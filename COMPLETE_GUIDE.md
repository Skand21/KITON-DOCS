# 🚀 Полный гайд по настройке GitHub Pages

## 📋 Текущее состояние проекта

✅ **Готово:**
- mkdocs.yml настроен с вашими данными
- Workflow файл создан и готов
- Документация готова к публикации

## 🎯 Пошаговая инструкция

### Шаг 1: Создание репозитория на GitHub

1. **Перейдите на GitHub.com**
2. **Нажмите "New repository"**
3. **Заполните данные:**
   - Repository name: `KITON-DOCS`
   - Description: `Документация Telegram-бота KITON`
   - ✅ Public (обязательно!)
   - ✅ Add a README file
4. **Нажмите "Create repository"**

### Шаг 2: Загрузка файлов

1. **Склонируйте репозиторий:**
   ```bash
   git clone https://github.com/skand21/KITON-DOCS.git
   cd KITON-DOCS
   ```

2. **Скопируйте все файлы** из папки `KITON-DOCS` в склонированный репозиторий

3. **Сделайте первый коммит:**
   ```bash
   git add .
   git commit -m "Initial documentation setup"
   git push origin main
   ```

### Шаг 3: Настройка GitHub Pages

1. **Перейдите в настройки репозитория:**
   - Откройте https://github.com/skand21/KITON-DOCS
   - Нажмите на вкладку **"Settings"**

2. **Настройте Pages:**
   - В левом меню найдите **"Pages"**
   - В разделе **"Source"** выберите **"GitHub Actions"**
   - Нажмите **"Save"**

### Шаг 4: Запуск деплоя

1. **Сделайте коммит для запуска workflow:**
   ```bash
   # Добавьте любую строку в любой .md файл в папке docs/
   git add docs/
   git commit -m "Trigger GitHub Pages deployment"
   git push origin main
   ```

2. **Проверьте Actions:**
   - Перейдите в **"Actions"** в вашем репозитории
   - Должен запуститься workflow "Deploy to GitHub Pages"
   - Дождитесь завершения (зеленая галочка)

### Шаг 5: Проверка результата

1. **Подождите 2-3 минуты** после завершения workflow
2. **Откройте ваш сайт:**
   ```
   https://skand21.github.io/KITON-DOCS
   ```

## 🔧 Текущие настройки

### mkdocs.yml
```yaml
site_url: https://skand21.github.io/KITON-DOCS
repo_name: skand21/KITON-DOCS
repo_url: https://github.com/skand21/KITON-DOCS
```

### Workflow файл (.github/workflows/gh-pages.yml)
```yaml
name: Deploy Documentation

on:
  push:
    branches: [ main ]
    paths:
      - 'docs/**'
      - 'mkdocs.yml'

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install mkdocs mkdocs-material
      - run: mkdocs build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./site
      - name: Deploy to GitHub Pages
        id: deploy
        uses: actions/deploy-pages@v4
```

## 🚨 Возможные проблемы и решения

### Проблема: Workflow не запускается
**Решение:**
- Убедитесь, что репозиторий публичный
- Проверьте, что файл `.github/workflows/gh-pages.yml` существует
- Сделайте коммит с изменениями в `docs/` или `mkdocs.yml`

### Проблема: 404 ошибка на сайте
**Решение:**
- Подождите 5-10 минут после завершения workflow
- Проверьте, что Pages настроен на "Deploy from a branch" → "gh-pages"
- Убедитесь, что workflow завершился успешно (зеленая галочка)

### Проблема: Сайт не обновляется
**Решение:**
- Workflow запускается только при изменениях в `docs/` или `mkdocs.yml`
- Сделайте коммит с изменениями в эти файлы
- Проверьте логи в Actions

## 📝 Чек-лист

- [ ] Создан публичный репозиторий `KITON-DOCS` на GitHub
- [ ] Файлы загружены в репозиторий
- [ ] GitHub Pages настроен на "GitHub Actions"
- [ ] Workflow файл `.github/workflows/gh-pages.yml` существует
- [ ] Сделан коммит для запуска первого деплоя
- [ ] Workflow завершился успешно (зеленая галочка)
- [ ] Сайт доступен по адресу https://skand21.github.io/KITON-DOCS

## 🎯 Следующие шаги

После успешного деплоя:

1. **Обновите ссылки в боте** на новый адрес документации
2. **Добавьте ссылку в README** основного проекта
3. **Настройте автоматические уведомления** о новых версиях документации

## 🔄 Обновление документации

Для обновления сайта просто:
1. Внесите изменения в файлы в папке `docs/`
2. Сделайте коммит:
   ```bash
   git add docs/
   git commit -m "Update documentation"
   git push origin main
   ```
3. Сайт автоматически обновится через 2-3 минуты

---

**Готово!** 🎉 Ваша документация теперь будет автоматически обновляться при каждом изменении в репозитории.
