# API и техническая документация 🔧

Техническая документация для разработчиков и интеграций.

## 🏗️ Архитектура системы

### Структура проекта

```
project/
├── handlers/           # Обработчики команд и сообщений
│   ├── auth.py        # Авторизация и регистрация
│   ├── profiles.py    # Управление профилями
│   ├── student/       # Функции для учеников
│   ├── tutor/         # Функции для репетиторов
│   ├── parent/        # Функции для родителей
│   └── admin/         # Административные функции
├── states/            # FSM состояния
├── keyboards.py       # Клавиатуры и кнопки
├── database.py        # Модели базы данных
├── utils/             # Вспомогательные функции
└── main.py           # Точка входа
```

### Основные компоненты

- **aiogram 3.x** - асинхронный фреймворк для Telegram Bot API
- **SQLAlchemy** - ORM для работы с базой данных
- **SQLite** - файловая база данных
- **FSM (Finite State Machine)** - управление состояниями диалогов

## 🗄️ База данных

### Основные модели

#### User (Пользователь)
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    telegram_id = Column(BigInteger, unique=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_registered = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

#### Student (Ученик)
```python
class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    grade = Column(Integer, nullable=False)
    school = Column(String(200))
    city = Column(String(100))
    phone = Column(String(20), nullable=False)
    personal_code = Column(String(10), unique=True, nullable=False)
```

#### Tutor (Репетитор)
```python
class Tutor(Base):
    __tablename__ = "tutors"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    middle_name = Column(String(50))
    specialization = Column(Text)
    phone = Column(String(20), nullable=False)
```

#### Parent (Родитель)
```python
class Parent(Base):
    __tablename__ = "parents"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    phone = Column(String(20), nullable=False)
```

### Связи между таблицами

- **User ↔ Student/Tutor/Parent** - один к одному
- **Tutor ↔ Student** - многие ко многим (через personal_code)
- **Parent ↔ Student** - многие ко многим (через personal_code)
- **Lesson** - связывает Tutor и Student
- **Homework** - связывает Lesson и Student

## 🔄 FSM (Finite State Machine)

### Состояния регистрации

```python
class RegistrationStates(StatesGroup):
    waiting_for_role = State()
    waiting_for_first_name = State()
    waiting_for_last_name = State()
    waiting_for_grade = State()      # только для учеников
    waiting_for_school = State()     # только для учеников
    waiting_for_city = State()       # только для учеников
    waiting_for_middle_name = State() # только для репетиторов
    waiting_for_specialization = State() # только для репетиторов
    waiting_for_phone = State()
    confirmation = State()
```

### Состояния редактирования профиля

```python
class ProfileEditStates(StatesGroup):
    waiting_for_field = State()
    waiting_for_new_value = State()
    confirmation = State()
```

## 🎯 Обработчики команд

### Структура обработчика

```python
@router.message(Command("start"))
async def cmd_start(message: Message, state: FSMContext):
    """Обработчик команды /start"""
    user = await get_user_by_telegram_id(message.from_user.id)
    
    if not user or not user.is_registered:
        # Показать приветствие и предложить регистрацию
        await show_welcome_message(message)
    else:
        # Показать главное меню согласно роли
        await show_main_menu(message, user.role)
    
    await state.clear()
```

### Принципы обработки

1. **Проверка авторизации** - все команды требуют регистрации
2. **Проверка роли** - доступ к функциям по ролям
3. **Валидация данных** - проверка всех входных данных
4. **Обработка ошибок** - graceful handling
5. **Логирование** - запись всех действий

## 🔐 Система авторизации

### Роли пользователей

```python
class UserRole(Enum):
    STUDENT = "student"
    TUTOR = "tutor"
    PARENT = "parent"
    ADMIN = "admin"
```

### Проверка доступа

```python
def require_role(required_role: UserRole):
    """Декоратор для проверки роли пользователя"""
    def decorator(func):
        async def wrapper(message: Message, *args, **kwargs):
            user = await get_user_by_telegram_id(message.from_user.id)
            if not user or user.role != required_role:
                await message.answer("❌ У вас нет доступа к этой функции")
                return
            return await func(message, *args, **kwargs)
        return wrapper
    return decorator
```

## 📝 Валидация данных

### Валидаторы

```python
def validate_name(name: str) -> bool:
    """Валидация имени/фамилии"""
    return (
        name.isalpha() and 
        name.isascii() == False and  # только кириллица
        name[0].isupper() and        # с заглавной буквы
        len(name) >= 2
    )

def validate_phone(phone: str) -> bool:
    """Валидация номера телефона"""
    pattern = r'^\+7\d{10}$'
    return bool(re.match(pattern, phone))

def validate_grade(grade: str) -> bool:
    """Валидация класса"""
    try:
        grade_num = int(grade)
        return 1 <= grade_num <= 11
    except ValueError:
        return False
```

## 🔗 Система подключений

### Алгоритм подключения репетитора к ученику

1. **Получение кода** - репетитор вводит персональный код ученика
2. **Проверка кода** - валидация существования и уникальности
3. **Создание связи** - добавление записи в таблицу связей
4. **Уведомления** - отправка уведомлений обеим сторонам

```python
async def connect_tutor_to_student(tutor_id: int, student_code: str) -> bool:
    """Подключение репетитора к ученику по коду"""
    student = await get_student_by_code(student_code)
    if not student:
        return False
    
    # Проверка на существующую связь
    existing = await get_tutor_student_connection(tutor_id, student.id)
    if existing:
        return False
    
    # Создание связи
    connection = TutorStudentConnection(
        tutor_id=tutor_id,
        student_id=student.id,
        connected_at=datetime.utcnow()
    )
    
    await save_connection(connection)
    
    # Отправка уведомлений
    await notify_student_about_tutor(student.user.telegram_id, tutor)
    await notify_tutor_about_student(tutor.user.telegram_id, student)
    
    return True
```

## 📊 Система уведомлений

### Типы уведомлений

```python
class NotificationType(Enum):
    LESSON_REMINDER = "lesson_reminder"
    HOMEWORK_DEADLINE = "homework_deadline"
    NEW_CONNECTION = "new_connection"
    PAYMENT_RECEIVED = "payment_received"
    SYSTEM_UPDATE = "system_update"
```

### Отправка уведомлений

```python
async def send_notification(
    user_id: int, 
    notification_type: NotificationType,
    data: dict
):
    """Отправка уведомления пользователю"""
    try:
        message = await format_notification(notification_type, data)
        await bot.send_message(user_id, message)
        await log_notification(user_id, notification_type, "success")
    except Exception as e:
        await log_notification(user_id, notification_type, f"error: {e}")
```

## 🎨 Система клавиатур

### Создание inline-клавиатур

```python
def create_main_menu_keyboard(role: UserRole) -> InlineKeyboardMarkup:
    """Создание главного меню в зависимости от роли"""
    keyboard = []
    
    if role == UserRole.STUDENT:
        keyboard.extend([
            [InlineKeyboardButton("📅 Расписание", callback_data="schedule")],
            [InlineKeyboardButton("📝 Домашние задания", callback_data="homework")],
            [InlineKeyboardButton("📊 Прогресс", callback_data="progress")],
            [InlineKeyboardButton("💰 Баланс", callback_data="balance")]
        ])
    elif role == UserRole.TUTOR:
        keyboard.extend([
            [InlineKeyboardButton("👥 Мои ученики", callback_data="students")],
            [InlineKeyboardButton("📅 Расписание", callback_data="schedule")],
            [InlineKeyboardButton("📝 Задания", callback_data="homework")],
            [InlineKeyboardButton("📈 Статистика", callback_data="statistics")]
        ])
    
    # Общие кнопки
    keyboard.extend([
        [InlineKeyboardButton("👤 Профиль", callback_data="profile")],
        [InlineKeyboardButton("❓ Помощь", callback_data="help")]
    ])
    
    return InlineKeyboardMarkup(inline_keyboard=keyboard)
```

## 📈 Система логирования

### Конфигурация логирования

```python
import logging
from logging.handlers import RotatingFileHandler

def setup_logging():
    """Настройка системы логирования"""
    
    # Основной логгер
    main_logger = logging.getLogger("main")
    main_logger.setLevel(logging.INFO)
    
    # Файловый обработчик
    file_handler = RotatingFileHandler(
        "logs/main.log", 
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    
    # Форматтер
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_handler.setFormatter(formatter)
    
    main_logger.addHandler(file_handler)
    
    # Логгер ошибок
    error_logger = logging.getLogger("error")
    error_logger.setLevel(logging.ERROR)
    
    error_handler = RotatingFileHandler(
        "logs/error.log",
        maxBytes=10*1024*1024,
        backupCount=5
    )
    error_handler.setFormatter(formatter)
    error_logger.addHandler(error_handler)
```

## 🔧 Утилиты и вспомогательные функции

### Генерация персональных кодов

```python
import secrets
import string

def generate_personal_code() -> str:
    """Генерация уникального персонального кода"""
    while True:
        code = ''.join(secrets.choices(
            string.ascii_uppercase + string.digits, 
            k=8
        ))
        
        # Проверка уникальности
        if not await code_exists(code):
            return code
```

### Кэширование

```python
from functools import lru_cache
import asyncio

@lru_cache(maxsize=128)
def get_cached_user_data(user_id: int):
    """Кэширование данных пользователя"""
    # Синхронная функция для кэширования
    pass

async def get_user_data(user_id: int):
    """Асинхронное получение данных с кэшированием"""
    try:
        return get_cached_user_data(user_id)
    except KeyError:
        data = await fetch_user_data_from_db(user_id)
        get_cached_user_data.cache_clear()  # Очистка кэша
        return data
```

## 🚀 Развертывание

### Переменные окружения

```bash
# .env
BOT_TOKEN=your_bot_token_here
DATABASE_URL=sqlite:///database.db
LOG_LEVEL=INFO
ADMIN_IDS=123456789,987654321
NOTIFICATION_CHAT_ID=-1001234567890
```

### Docker конфигурация

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Установка зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование кода
COPY . .

# Создание папок для логов
RUN mkdir -p logs

# Запуск
CMD ["python", "main.py"]
```

## 📊 Мониторинг и метрики

### Ключевые метрики

- **Количество пользователей** по ролям
- **Активность** - сообщения в день/час
- **Конверсия** - регистрация после /start
- **Ошибки** - частота и типы ошибок
- **Производительность** - время отклика

### Логирование метрик

```python
async def log_metric(metric_name: str, value: float, tags: dict = None):
    """Логирование метрики"""
    metric_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "metric": metric_name,
        "value": value,
        "tags": tags or {}
    }
    
    logger.info(f"METRIC: {json.dumps(metric_data)}")
```

## 🔒 Безопасность

### Защита от злоупотреблений

```python
from aiogram.utils.keyboard import InlineKeyboardBuilder
import time

class RateLimiter:
    def __init__(self, max_requests: int, time_window: int):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = {}
    
    def is_allowed(self, user_id: int) -> bool:
        now = time.time()
        user_requests = self.requests.get(user_id, [])
        
        # Очистка старых запросов
        user_requests = [req_time for req_time in user_requests 
                        if now - req_time < self.time_window]
        
        if len(user_requests) >= self.max_requests:
            return False
        
        user_requests.append(now)
        self.requests[user_id] = user_requests
        return True

# Глобальный лимитер
rate_limiter = RateLimiter(max_requests=10, time_window=60)  # 10 запросов в минуту
```

### Валидация входных данных

```python
def sanitize_input(text: str) -> str:
    """Очистка пользовательского ввода"""
    # Удаление HTML тегов
    import re
    text = re.sub(r'<[^>]+>', '', text)
    
    # Ограничение длины
    text = text[:1000]
    
    # Экранирование специальных символов
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    
    return text.strip()
```
