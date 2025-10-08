// Система выбора цвета шапки
document.addEventListener('DOMContentLoaded', function() {
    // Создаем панель выбора цвета
    const colorPickerPanel = document.createElement('div');
    colorPickerPanel.className = 'color-picker-panel';
    colorPickerPanel.innerHTML = `
        <div class="color-picker-header">🎨 Выберите цвет шапки</div>
        <div class="color-options">
            <div class="color-option blue active" data-theme="blue">Синий</div>
            <div class="color-option orange" data-theme="orange">Оранжевый</div>
            <div class="color-option green" data-theme="green">Зеленый</div>
            <div class="color-option purple" data-theme="purple">Фиолетовый</div>
            <div class="color-option red" data-theme="red">Красный</div>
            <div class="color-option dark" data-theme="dark">Серый</div>
        </div>
    `;
    
    // Создаем кнопку для открытия панели
    const toggleButton = document.createElement('button');
    toggleButton.className = 'color-picker-toggle';
    toggleButton.innerHTML = '🎨';
    toggleButton.title = 'Выбрать цвет шапки';
    
    // Добавляем элементы на страницу
    document.body.appendChild(colorPickerPanel);
    document.body.appendChild(toggleButton);
    
    // Цветовые схемы
    const colorSchemes = {
        blue: {
            primary: '#1976d2',
            accent: '#64b5f6'
        },
        orange: {
            primary: '#ff6b35',
            accent: '#ffb74d'
        },
        green: {
            primary: '#388e3c',
            accent: '#81c784'
        },
        purple: {
            primary: '#7b1fa2',
            accent: '#ba68c8'
        },
        red: {
            primary: '#d32f2f',
            accent: '#ef5350'
        },
        dark: {
            primary: '#424242',
            accent: '#757575'
        }
    };
    
    // Функция применения цветовой схемы
    function applyColorScheme(theme) {
        const scheme = colorSchemes[theme];
        if (!scheme) return;
        
        // Обновляем CSS переменные
        document.documentElement.style.setProperty('--header-primary', scheme.primary);
        document.documentElement.style.setProperty('--header-accent', scheme.accent);
        
        // Обновляем кнопку
        toggleButton.style.backgroundColor = scheme.primary;
        
        // Сохраняем выбор в localStorage
        localStorage.setItem('header-theme', theme);
        
        // Обновляем активную кнопку
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
    }
    
    // Обработчики для кнопок цветов
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            applyColorScheme(theme);
        });
    });
    
    // Обработчик для кнопки переключения
    toggleButton.addEventListener('click', () => {
        if (colorPickerPanel.style.display === 'none' || colorPickerPanel.style.display === '') {
            colorPickerPanel.style.display = 'block';
        } else {
            colorPickerPanel.style.display = 'none';
        }
    });
    
    // Закрытие панели при клике вне её
    document.addEventListener('click', (e) => {
        if (!colorPickerPanel.contains(e.target) && !toggleButton.contains(e.target)) {
            colorPickerPanel.style.display = 'none';
        }
    });
    
    // Загружаем сохраненную тему
    const savedTheme = localStorage.getItem('header-theme') || 'green';
    applyColorScheme(savedTheme);
    
    // Анимация появления кнопки
    setTimeout(() => {
        toggleButton.style.opacity = '0';
        toggleButton.style.transform = 'scale(0.8)';
        toggleButton.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            toggleButton.style.opacity = '1';
            toggleButton.style.transform = 'scale(1)';
        }, 100);
    }, 1000);
});

// Дополнительные функции для работы с цветами
function getCurrentTheme() {
    return localStorage.getItem('header-theme') || 'green';
}

function setRandomTheme() {
    const themes = ['blue', 'orange', 'green', 'purple', 'red', 'dark'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    applyColorScheme(randomTheme);
}

// Экспорт функций для использования в других скриптах
window.ColorPicker = {
    getCurrentTheme,
    setRandomTheme,
    applyColorScheme: function(theme) {
        const colorSchemes = {
            blue: { primary: '#1976d2', accent: '#64b5f6' },
            orange: { primary: '#ff6b35', accent: '#ffb74d' },
            green: { primary: '#388e3c', accent: '#81c784' },
            purple: { primary: '#7b1fa2', accent: '#ba68c8' },
            red: { primary: '#d32f2f', accent: '#ef5350' },
            dark: { primary: '#424242', accent: '#757575' }
        };
        
        const scheme = colorSchemes[theme];
        if (scheme) {
            document.documentElement.style.setProperty('--header-primary', scheme.primary);
            document.documentElement.style.setProperty('--header-accent', scheme.accent);
            localStorage.setItem('header-theme', theme);
        }
    }
};
