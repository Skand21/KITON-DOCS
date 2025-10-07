# 🚀 Развертывание документации

## GitHub Pages (рекомендуется)

### 1. Настройка репозитория

1. Зайдите в **Settings** → **Pages**
2. В разделе **Source** выберите **GitHub Actions**
3. Сохраните настройки

### 2. Обновление конфигурации

В файле `mkdocs.yml` замените:

```yaml
site_url: https://your-username.github.io/your-repo
repo_name: your-username/your-repo
repo_url: https://github.com/your-username/your-repo
```

На ваши реальные данные:

```yaml
site_url: https://art12.github.io/TT
repo_name: art12/TT
repo_url: https://github.com/art12/TT
```

### 3. Деплой

1. Сделайте commit и push в ветку `main`
2. GitHub Actions автоматически соберет и развернет сайт
3. Сайт будет доступен по адресу: `https://your-username.github.io/your-repo`

## Netlify

### 1. Подключение репозитория

1. Зайдите на [netlify.com](https://netlify.com)
2. Нажмите **New site from Git**
3. Выберите ваш GitHub репозиторий

### 2. Настройки сборки

- **Build command**: `pip install mkdocs mkdocs-material && mkdocs build`
- **Publish directory**: `site`
- **Python version**: `3.11`

### 3. Переменные окружения

Добавьте в настройки:
- `PYTHON_VERSION`: `3.11`

## Vercel

### 1. Подключение

1. Зайдите на [vercel.com](https://vercel.com)
2. Импортируйте ваш GitHub репозиторий

### 2. Настройки

- **Framework Preset**: Other
- **Build Command**: `pip install mkdocs mkdocs-material && mkdocs build`
- **Output Directory**: `site`
- **Install Command**: `pip install mkdocs mkdocs-material`

## Локальная сборка

```bash
# Установка зависимостей
pip install mkdocs mkdocs-material

# Сборка сайта
mkdocs build

# Просмотр локально
mkdocs serve
```

## Структура файлов

```
docs/
├── index.md          # Главная страница
├── install.md        # Установка
├── commands.md       # Команды
├── api.md           # API документация
└── README.md        # Описание документации

mkdocs.yml           # Конфигурация MkDocs
.github/workflows/   # GitHub Actions
```

## Обновление документации

1. Отредактируйте файлы в папке `docs/`
2. Сделайте commit и push
3. Сайт автоматически обновится

## Поддержка

- 📚 [MkDocs документация](https://www.mkdocs.org/)
- 🎨 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- 💬 [Поддержка в Telegram](https://t.me/kiton_support)
