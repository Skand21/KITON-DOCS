# Установка и настройка 🛠️

Пошаговая инструкция по развертыванию Telegram-бота.

## 📋 Требования

- Python 3.10 или выше
- Telegram Bot Token (получить у [@BotFather](https://t.me/BotFather))
- Git

## 🚀 Установка

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Создание виртуального окружения

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate
```

### 3. Установка зависимостей

```bash
pip install -r requirements.txt
```

### 4. Настройка конфигурации

Создайте файл `config.py` в корне проекта:

```python
# config.py
import os

# Telegram Bot Token
BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"

# База данных
DATABASE_URL = "sqlite:///database.db"

# Логирование
LOG_LEVEL = "INFO"
LOG_FILE = "logs/main.log"

# Администраторы (ID пользователей)
ADMIN_IDS = [123456789, 987654321]

# Настройки уведомлений
NOTIFICATION_CHAT_ID = -1001234567890  # ID чата для уведомлений
```

### 5. Инициализация базы данных

```bash
python -c "from database import init_db; init_db()"
```

### 6. Запуск бота

```bash
python main.py
```

## 🔧 Настройка окружения

### Переменные окружения (рекомендуется)

Создайте файл `.env`:

```env
BOT_TOKEN=your_bot_token_here
DATABASE_URL=sqlite:///database.db
LOG_LEVEL=INFO
ADMIN_IDS=123456789,987654321
```

И обновите `config.py`:

```python
import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///database.db")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
ADMIN_IDS = [int(x) for x in os.getenv("ADMIN_IDS", "").split(",") if x]
```

## 🐳 Docker (опционально)

### Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "main.py"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  bot:
    build: .
    environment:
      - BOT_TOKEN=${BOT_TOKEN}
      - DATABASE_URL=sqlite:///database.db
    volumes:
      - ./database.db:/app/database.db
      - ./logs:/app/logs
    restart: unless-stopped
```

Запуск:

```bash
docker-compose up -d
```

## 🔍 Проверка установки

После запуска бота проверьте:

1. **Логи**: Убедитесь, что нет ошибок в `logs/main.log`
2. **Telegram**: Отправьте `/start` боту
3. **База данных**: Проверьте создание файла `database.db`

## 🚨 Устранение неполадок

### Частые проблемы

**Ошибка "Bot token is invalid"**
- Проверьте правильность токена в `config.py`
- Убедитесь, что бот активирован у [@BotFather](https://t.me/BotFather)

**Ошибка подключения к базе данных**
- Проверьте права доступа к папке
- Убедитесь, что SQLite установлен

**Модули не найдены**
- Активируйте виртуальное окружение
- Переустановите зависимости: `pip install -r requirements.txt`

### Логи

Проверьте логи в папке `logs/`:
- `main.log` - основные события
- `error.log` - ошибки
- `notifications.log` - уведомления

## 🔄 Обновление

```bash
git pull origin main
pip install -r requirements.txt
python -c "from database import init_db; init_db()"  # если нужно обновить схему БД
```

## 📞 Поддержка

Если возникли проблемы:
- 📚 [База знаний](https://your-knowledge-base.com)
- 💬 [Поддержка в Telegram](https://t.me/kiton_support)
- 🐛 [GitHub Issues](https://github.com/your-repo/issues)
