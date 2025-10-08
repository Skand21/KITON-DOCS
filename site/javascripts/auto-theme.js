// Принудительная установка темной темы по умолчанию
document.addEventListener('DOMContentLoaded', function() {
    // Всегда начинаем с темной темы
    const defaultTheme = 'slate';
    
    // Получаем сохраненную тему или используем темную по умолчанию
    const savedTheme = localStorage.getItem('md-theme') || defaultTheme;
    
    // Применяем тему
    applyTheme(savedTheme);
    
    // Слушаем изменения в переключателе темы
    const paletteInputs = document.querySelectorAll('[data-md-component="palette"] input[type="radio"]');
    paletteInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                const theme = this.getAttribute('data-md-color-scheme');
                applyTheme(theme);
                localStorage.setItem('md-theme', theme);
                localStorage.setItem('md-theme-manual', 'true');
            }
        });
    });
    
    function applyTheme(theme) {
        const html = document.documentElement;
        
        // Удаляем все существующие схемы
        html.removeAttribute('data-md-color-scheme');
        
        // Добавляем новую схему
        html.setAttribute('data-md-color-scheme', theme);
        
        // Обновляем кнопку переключения
        updateToggleButton(theme);
        
        // Применяем цветовую схему шапки
        applyHeaderTheme(theme);
    }
    
    function updateToggleButton(theme) {
        const toggleButton = document.querySelector(`[data-md-component="palette"] input[data-md-color-scheme="${theme}"]`);
        if (toggleButton) {
            toggleButton.checked = true;
        }
    }
    
    function applyHeaderTheme(theme) {
        const header = document.querySelector('.md-header');
        if (header) {
            // Удаляем все классы тем
            header.classList.remove('theme-blue', 'theme-orange', 'theme-green', 'theme-purple', 'theme-red', 'theme-gray');
            
            // Добавляем класс для текущей темы
            header.classList.add('theme-green'); // Всегда зеленая шапка
        }
    }
    
    // Принудительно устанавливаем темную тему при первой загрузке
    if (!localStorage.getItem('md-theme')) {
        applyTheme(defaultTheme);
        localStorage.setItem('md-theme', defaultTheme);
    }
    
    // Дополнительная проверка через небольшую задержку
    setTimeout(() => {
        const currentTheme = document.documentElement.getAttribute('data-md-color-scheme');
        if (!currentTheme || currentTheme === 'default') {
            applyTheme(defaultTheme);
        }
    }, 100);
});

// Дополнительные функции для работы с темами
window.ThemeManager = {
    // Принудительно применить светлую тему
    setLightTheme: function() {
        const themeButton = document.querySelector('[data-md-component="palette"]');
        if (themeButton) {
            const lightScheme = themeButton.querySelector('[data-md-color-scheme="default"]');
            if (lightScheme) {
                lightScheme.click();
                localStorage.setItem('md-theme', 'default');
                localStorage.setItem('md-theme-manual', 'true');
            }
        }
    },
    
    // Принудительно применить темную тему
    setDarkTheme: function() {
        const themeButton = document.querySelector('[data-md-component="palette"]');
        if (themeButton) {
            const darkScheme = themeButton.querySelector('[data-md-color-scheme="slate"]');
            if (darkScheme) {
                darkScheme.click();
                localStorage.setItem('md-theme', 'slate');
                localStorage.setItem('md-theme-manual', 'true');
            }
        }
    },
    
    // Установить конкретную тему
    setTheme: function(theme) {
        const themeButton = document.querySelector('[data-md-component="palette"]');
        if (themeButton) {
            const schemes = themeButton.querySelectorAll('[data-md-color-scheme]');
            schemes.forEach(scheme => {
                if (scheme.getAttribute('data-md-color-scheme') === theme) {
                    scheme.click();
                }
            });
            localStorage.setItem('md-theme', theme);
            localStorage.setItem('md-theme-manual', 'true');
        }
    },
    
    // Получить текущую тему
    getCurrentTheme: function() {
        return localStorage.getItem('md-theme') || 'slate';
    }
};