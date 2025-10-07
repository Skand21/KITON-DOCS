# ⚡ Быстрый старт GitHub Pages

## 🎯 Что нужно сделать (5 минут)

### 1. Создайте репозиторий на GitHub
- Название: `KITON-DOCS`
- Сделайте **публичным**
- Инициализируйте с README

### 2. Загрузите файлы
```bash
git clone https://github.com/skand21/KITON-DOCS.git
cd KITON-DOCS
# Файлы уже настроены с вашими данными!
git add .
git commit -m "Add documentation"
git push origin main
```

### 3. mkdocs.yml уже настроен! ✅
Все ссылки уже обновлены с вашими данными:
- site_url: https://skand21.github.io/KITON-DOCS
- repo_name: skand21/KITON-DOCS
- repo_url: https://github.com/skand21/KITON-DOCS

### 4. Настройте GitHub Pages
- Settings → Pages
- Source: **GitHub Actions**
- Сохраните

### 5. Запустите деплой
```bash
git add mkdocs.yml
git commit -m "Update repository links"
git push origin main
```

## ✅ Готово!

Сайт будет доступен через 2-3 минуты по адресу:
```
https://skand21.github.io/KITON-DOCS
```

## 🔧 Если что-то не работает

1. **Проверьте Actions** - должен быть запущен workflow "Deploy Documentation"
2. **Убедитесь, что репозиторий публичный**
3. **Проверьте настройки Pages** - должен быть выбран "GitHub Actions"

---

**Подробный гайд:** [GITHUB_PAGES_GUIDE.md](GITHUB_PAGES_GUIDE.md)
