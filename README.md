# 📚 Документация Telegram-бота KITON

Полная документация по Telegram-боту для организации взаимодействия между учениками, репетиторами и родителями.

## 🚀 Быстрый старт

### Локальный просмотр:
```bash
# Установка зависимостей
pip install mkdocs mkdocs-material

# Запуск локального сервера
mkdocs serve

# Открыть в браузере: http://localhost:8000
```

### Деплой на хостинг:
1. Загрузите содержимое папки `documentation/` в новый GitHub репозиторий
2. Обновите ссылки в `mkdocs.yml` на ваш новый репозиторий
3. Настройте GitHub Pages в Settings → Pages
4. Сайт будет доступен по адресу: `https://username.github.io/repository-name`

## 📁 Структура

```
documentation/
├── docs/                    # Документация
│   ├── index.md            # Главная страница
│   ├── install.md          # Установка и настройка
│   ├── commands.md         # Команды и функции
│   ├── api.md             # API документация
│   ├── DEPLOY.md          # Инструкции по деплою
│   └── README.md          # Описание документации
├── .github/workflows/      # GitHub Actions
│   ├── docs.yml           # Основной workflow
│   └── docs-simple.yml    # Альтернативный workflow
├── mkdocs.yml             # Конфигурация MkDocs
└── README.md              # Этот файл
```

## 🎯 Что включено

- ✅ **Полная документация** по всем функциям бота
- ✅ **Material Design** тема с темной/светлой поддержкой
- ✅ **Автоматический деплой** через GitHub Actions
- ✅ **Поиск по документации**
- ✅ **Адаптивный дизайн** для мобильных устройств
- ✅ **Русская локализация**

## 🔧 Настройка для нового репозитория

1. **Обновите ссылки в `mkdocs.yml`:**
   ```yaml
   site_url: https://your-username.github.io/your-repo
   repo_name: your-username/your-repo
   repo_url: https://github.com/your-username/your-repo
   ```

2. **Настройте GitHub Pages:**
   - Settings → Pages
   - Source: GitHub Actions

3. **Запушьте код:**
   ```bash
   git add .
   git commit -m "Add documentation"
   git push origin main
   ```

## 📞 Поддержка

- 📚 [База знаний](https://your-knowledge-base.com)
- 💬 [Поддержка в Telegram](https://t.me/kiton_support)
- 🐛 [Сообщить об ошибке](https://github.com/your-repo/issues)

---

*Документация готова к использованию! 🎉*
