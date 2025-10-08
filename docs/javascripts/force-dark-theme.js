// Принудительная установка темной темы
(function() {
    'use strict';
    
    // Функция для принудительной установки темной темы
    function forceDarkTheme() {
        // Устанавливаем темную тему в HTML
        document.documentElement.setAttribute('data-md-color-scheme', 'slate');
        
        // Устанавливаем темную тему в body
        document.body.setAttribute('data-md-color-scheme', 'slate');
        
        // Обновляем localStorage
        localStorage.setItem('md-theme', 'slate');
        
        // Находим и активируем кнопку темной темы
        const darkThemeButton = document.querySelector('[data-md-color-scheme="slate"]');
        if (darkThemeButton) {
            darkThemeButton.checked = true;
        }
        
        // Применяем стили шапки
        const header = document.querySelector('.md-header');
        if (header) {
            header.style.backgroundColor = '#388e3c';
        }
    }
    
    // Применяем темную тему сразу
    forceDarkTheme();
    
    // Применяем темную тему при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceDarkTheme);
    } else {
        forceDarkTheme();
    }
    
    // Применяем темную тему при изменении страницы
    window.addEventListener('load', forceDarkTheme);
    
    // Следим за изменениями в переключателе темы
    document.addEventListener('change', function(e) {
        if (e.target.matches('[data-md-color-scheme]')) {
            const theme = e.target.getAttribute('data-md-color-scheme');
            if (theme === 'default') {
                // Если пользователь выбрал светлую тему, разрешаем
                localStorage.setItem('md-theme-manual', 'true');
            } else if (theme === 'slate') {
                // Если выбрал темную, тоже разрешаем
                localStorage.setItem('md-theme-manual', 'true');
            }
        }
    });
    
    // Проверяем каждые 500мс, не изменилась ли тема
    setInterval(function() {
        const currentTheme = document.documentElement.getAttribute('data-md-color-scheme');
        const savedTheme = localStorage.getItem('md-theme');
        const isManual = localStorage.getItem('md-theme-manual');
        
        // Если тема не установлена или не темная, и пользователь не выбирал вручную
        if ((!currentTheme || currentTheme === 'default') && !isManual) {
            forceDarkTheme();
        }
    }, 500);
    
    // Перехватываем клики по кнопкам темы
    document.addEventListener('click', function(e) {
        const themeButton = e.target.closest('[data-md-color-scheme]');
        if (themeButton) {
            const theme = themeButton.getAttribute('data-md-color-scheme');
            localStorage.setItem('md-theme-manual', 'true');
            localStorage.setItem('md-theme', theme);
        }
    });
    
})();
