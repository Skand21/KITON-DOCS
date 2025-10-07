# 🚀 Развертывание системы базы знаний

## 📋 Обзор изменений

Реализована система персонализированной базы знаний, которая показывает релевантную информацию в зависимости от роли пользователя:

- **Репетиторы** - видят полную базу знаний со всеми возможностями
- **Ученики** - видят только информацию, релевантную для них
- **Родители** - видят информацию о контроле обучения детей

## 🔧 Технические изменения

### 1. Обновлены константы (`TT/utils/constants.py`)

```python
# База знаний - разные URL для разных ролей
KNOWLEDGE_BASE_URL = "https://your-domain.com/knowledge-base"  # Общая (для репетиторов)
KNOWLEDGE_BASE_STUDENT_URL = "https://your-domain.com/knowledge-base-student"  # Для учеников
KNOWLEDGE_BASE_PARENT_URL = "https://your-domain.com/knowledge-base-parent"  # Для родителей
```

### 2. Обновлена функция создания клавиатуры помощи (`TT/keyboards.py`)

```python
def create_help_keyboard(user_role: str = None) -> InlineKeyboardMarkup:
    """
    Создаёт клавиатуру для меню помощи с учетом роли пользователя
    
    Args:
        user_role: Роль пользователя ('student', 'tutor', 'parent')
    """
    # Определяем URL базы знаний в зависимости от роли
    if user_role == 'student':
        knowledge_base_url = KNOWLEDGE_BASE_STUDENT_URL
    elif user_role == 'parent':
        knowledge_base_url = KNOWLEDGE_BASE_PARENT_URL
    else:  # tutor или None (по умолчанию показываем полную базу знаний)
        knowledge_base_url = KNOWLEDGE_BASE_URL
    
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="💬 Чат поддержки", url=SUPPORT_URL),
            ],
            [InlineKeyboardButton(text="📢 Канал", url=CHANNEL_URL)],
            [InlineKeyboardButton(text="📚 База знаний", url=knowledge_base_url)],
            [InlineKeyboardButton(text=BTN_BACK, callback_data="back_to_menu")]
        ]
    )
```

### 3. Обновлен обработчик помощи (`TT/handlers/common.py`)

```python
@router.callback_query(F.data == "show_help")
async def handle_show_help(callback: CallbackQuery, state: FSMContext):
    """Обработчик кнопки помощи"""
    help_text = ""
    
    try:
        # Определяем роль пользователя для показа соответствующей базы знаний
        user, user_type = get_user_by_telegram_id_simple(callback.from_user.id)
        user_role = user_type if user_type else None
        
        await edit_or_send_message(
            message_or_callback=callback,
            text=help_text,
            keyboard=create_help_keyboard(user_role),
            state=state,
            image_path=get_image_for("help")
        )
    except Exception as e:
        logger.error(f"Error in handle_show_help: {e}")
        await edit_or_send_message(
            message_or_callback=callback,
            text="❌ Произошла ошибка при открытии меню помощи",
            keyboard=create_back_button(),
            state=state
        )
```

## 📚 Структура базы знаний

### Созданные файлы документации:

1. **`knowledge-base.md`** - Главная страница базы знаний
2. **`knowledge-base-tutor.md`** - Полная база знаний для репетиторов
3. **`knowledge-base-student.md`** - База знаний для учеников
4. **`knowledge-base-parent.md`** - База знаний для родителей

### Содержание по ролям:

#### Для репетиторов (полная версия):
- Управление учениками
- Система домашних заданий
- Расписание и управление занятиями
- Детальная статистика и отчеты
- Финансовое управление
- Система "Газики"
- Настройки и профиль
- Продвинутые возможности
- FAQ и поддержка

#### Для учеников:
- Первые шаги и регистрация
- Работа с домашними заданиями
- Расписание занятий
- Отслеживание прогресса
- Система "Газики"
- Баланс и оплаты
- Настройки профиля
- Советы для эффективной учебы
- FAQ и поддержка

#### Для родителей:
- Первые шаги и подключение к ребенку
- Управление детьми
- Контроль домашних заданий
- Контроль расписания
- Финансовое управление
- Отслеживание прогресса
- Настройки и профиль
- Советы для родителей
- FAQ и поддержка

## 🌐 Развертывание на хостинге

### Вариант 1: MkDocs (рекомендуется)

1. **Установите MkDocs:**
```bash
pip install mkdocs mkdocs-material
```

2. **Создайте конфигурацию `mkdocs.yml`:**
```yaml
site_name: KITON База знаний
theme:
  name: material
  palette:
    - scheme: default
      primary: orange
      accent: orange
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode
    - scheme: slate
      primary: orange
      accent: orange
      toggle:
        icon: material/brightness-4
        name: Switch to light mode
  features:
    - navigation.tabs
    - navigation.sections
    - navigation.top
    - search.highlight
    - search.share

nav:
  - Главная: index.md
  - Гайды:
    - Репетиторы: tutor-guide.md
    - Ученики: student-guide.md
    - Родители: parent-guide.md
  - База знаний:
    - Общая: knowledge-base.md
    - Для репетиторов: knowledge-base-tutor.md
    - Для учеников: knowledge-base-student.md
    - Для родителей: knowledge-base-parent.md

plugins:
  - search
```

3. **Соберите сайт:**
```bash
mkdocs build
```

4. **Запустите локально для тестирования:**
```bash
mkdocs serve
```

5. **Разверните на хостинге:**
```bash
mkdocs gh-deploy  # Для GitHub Pages
# или загрузите папку site/ на ваш хостинг
```

### Вариант 2: GitHub Pages

1. **Создайте репозиторий** для документации
2. **Настройте GitHub Pages** в настройках репозитория
3. **Используйте MkDocs** для автоматического развертывания
4. **URL будет:** `https://your-username.github.io/your-repo-name/`

### Вариант 3: Netlify/Vercel

1. **Подключите репозиторий** к Netlify или Vercel
2. **Настройте сборку** с MkDocs
3. **Получите автоматический домен** или подключите свой

## 🔗 Настройка URL в боте

После развертывания базы знаний обновите URL в константах:

```python
# В TT/utils/constants.py
KNOWLEDGE_BASE_URL = "https://your-domain.com/knowledge-base-tutor"
KNOWLEDGE_BASE_STUDENT_URL = "https://your-domain.com/knowledge-base-student"
KNOWLEDGE_BASE_PARENT_URL = "https://your-domain.com/knowledge-base-parent"
```

## 🧪 Тестирование

### Проверьте работу системы:

1. **Зарегистрируйтесь как репетитор** и нажмите "База знаний" - должна открыться полная версия
2. **Зарегистрируйтесь как ученик** и нажмите "База знаний" - должна открыться версия для учеников
3. **Зарегистрируйтесь как родитель** и нажмите "База знаний" - должна открыться версия для родителей

### Проверьте ссылки:

- Все ссылки должны работать корректно
- Контент должен соответствовать роли пользователя
- Навигация должна быть интуитивной

## 📈 Мониторинг и аналитика

### Рекомендуется настроить:

1. **Google Analytics** для отслеживания использования
2. **Поиск по сайту** для улучшения UX
3. **Обратная связь** от пользователей
4. **A/B тестирование** разных версий

## 🔄 Обновления

### Процесс обновления документации:

1. **Редактируйте файлы** в папке `docs/`
2. **Тестируйте локально** с `mkdocs serve`
3. **Развертывайте** на продакшн
4. **Уведомляйте пользователей** о новых возможностях

### Автоматизация:

- **GitHub Actions** для автоматического развертывания
- **Webhooks** для уведомлений о обновлениях
- **CDN** для быстрой загрузки

## 🎯 Преимущества новой системы

1. **Персонализация** - каждый пользователь видит релевантную информацию
2. **Улучшенный UX** - меньше путаницы, больше пользы
3. **Масштабируемость** - легко добавлять новые роли и разделы
4. **SEO-оптимизация** - отдельные страницы для разных аудиторий
5. **Аналитика** - можно отслеживать, что ищут разные пользователи

---

*Система готова к развертыванию! Следуйте инструкциям выше для запуска.* 🚀
