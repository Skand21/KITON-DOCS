// Исправление мобильного меню для MkDocs Material
(function() {
    'use strict';
    
    function initMobileMenuFix() {
        // Ждем полной загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMobileMenuFix);
            return;
        }
        
        const hamburgerButton = document.querySelector('.md-header__button--menu');
        const drawer = document.querySelector('.md-drawer');
        const overlay = document.querySelector('.md-overlay');
        
        if (!hamburgerButton || !drawer) {
            // Если элементы не найдены, пробуем еще раз через небольшую задержку
            setTimeout(initMobileMenuFix, 100);
            return;
        }
        
        console.log('Mobile menu fix initialized');
        
        // Добавляем обработчик клика для переключения темы
        hamburgerButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Hamburger button clicked - toggling theme');
            
            // Основное действие - переключение темы
            toggleTheme();
            
            return false;
        });
        
        // Добавляем обработчик для двойного клика - открытие меню
        let clickCount = 0;
        hamburgerButton.addEventListener('click', function(e) {
            clickCount++;
            setTimeout(() => {
                if (clickCount === 2) {
                    console.log('Double click - opening menu');
                    const isOpen = drawer.classList.contains('md-drawer--open');
                    if (isOpen) {
                        closeMenu();
                    } else {
                        openMenu();
                    }
                }
                clickCount = 0;
            }, 300);
        });
        
        // Добавляем обработчик для долгого нажатия - открытие меню
        let pressTimer;
        hamburgerButton.addEventListener('mousedown', function(e) {
            pressTimer = setTimeout(() => {
                console.log('Long press - opening menu');
                const isOpen = drawer.classList.contains('md-drawer--open');
                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }
            }, 800);
        });
        
        hamburgerButton.addEventListener('mouseup', function(e) {
            clearTimeout(pressTimer);
        });
        
        hamburgerButton.addEventListener('mouseleave', function(e) {
            clearTimeout(pressTimer);
        });
        
        // Для мобильных устройств
        hamburgerButton.addEventListener('touchstart', function(e) {
            pressTimer = setTimeout(() => {
                console.log('Long touch - opening menu');
                const isOpen = drawer.classList.contains('md-drawer--open');
                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }
            }, 800);
        });
        
        hamburgerButton.addEventListener('touchend', function(e) {
            clearTimeout(pressTimer);
        });
        
        function openMenu() {
            console.log('Opening menu');
            
            // Добавляем содержание (TOC) в мобильное меню
            addTableOfContentsToMobileMenu();
            
            drawer.classList.add('md-drawer--open');
            document.body.classList.add('md-drawer--open');
            
            if (overlay) {
                overlay.classList.add('md-overlay--active');
            }
        }
        
        // Функция добавления содержания в мобильное меню
        function addTableOfContentsToMobileMenu() {
            const drawerInner = document.querySelector('.md-drawer__inner');
            if (!drawerInner) return;
            
            // Удаляем старое содержание, если есть
            const existingToc = drawerInner.querySelector('.mobile-toc');
            if (existingToc) {
                existingToc.remove();
            }
            
            // Получаем заголовки со страницы
            const headings = document.querySelectorAll('.md-content h1, .md-content h2, .md-content h3, .md-content h4, .md-content h5, .md-content h6');
            if (headings.length === 0) return;
            
            // Создаем контейнер для содержания
            const tocContainer = document.createElement('div');
            tocContainer.className = 'mobile-toc';
            
            // Создаем заголовок содержания
            const tocTitle = document.createElement('div');
            tocTitle.className = 'mobile-toc-title';
            tocTitle.innerHTML = `
                <span class="toc-icon">📋</span>
                <span class="toc-text">Содержание</span>
            `;
            tocContainer.appendChild(tocTitle);
            
            // Создаем список содержания
            const tocList = document.createElement('ul');
            tocList.className = 'mobile-toc-list';
            
            headings.forEach((heading, index) => {
                const level = parseInt(heading.tagName.charAt(1));
                const text = heading.textContent.trim();
                const id = heading.id || `heading-${index}`;
                
                // Если у заголовка нет ID, создаем его
                if (!heading.id) {
                    heading.id = id;
                }
                
                const listItem = document.createElement('li');
                listItem.className = `mobile-toc-item mobile-toc-level-${level}`;
                
                const link = document.createElement('a');
                link.href = `#${id}`;
                link.textContent = text;
                link.className = 'mobile-toc-link';
                
                // Добавляем обработчик клика для плавной прокрутки
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetElement = document.getElementById(id);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        // Закрываем меню после клика
                        closeMenu();
                    }
                });
                
                listItem.appendChild(link);
                tocList.appendChild(listItem);
            });
            
            tocContainer.appendChild(tocList);
            
            // Вставляем содержание в начало drawer
            const firstChild = drawerInner.firstChild;
            if (firstChild) {
                drawerInner.insertBefore(tocContainer, firstChild);
            } else {
                drawerInner.appendChild(tocContainer);
            }
        }
        
        function closeMenu() {
            console.log('Closing menu');
            drawer.classList.remove('md-drawer--open');
            document.body.classList.remove('md-drawer--open');
            
            if (overlay) {
                overlay.classList.remove('md-overlay--active');
            }
        }
        
        // Функция переключения темы
        function toggleTheme() {
            console.log('Toggling theme');
            const currentTheme = document.documentElement.getAttribute('data-md-color-scheme');
            const newTheme = currentTheme === 'slate' ? 'default' : 'slate';
            
            // Добавляем анимацию к кнопке
            hamburgerButton.style.transform = 'scale(0.9)';
            hamburgerButton.style.transition = 'transform 0.1s ease';
            setTimeout(() => {
                hamburgerButton.style.transform = 'scale(1)';
            }, 100);
            
            // Применяем новую тему
            document.documentElement.setAttribute('data-md-color-scheme', newTheme);
            localStorage.setItem('md-theme', newTheme);
            localStorage.setItem('md-theme-manual', 'true');
            
            // Обновляем кнопку переключения темы
            const themeButton = document.querySelector(`[data-md-component="palette"] input[data-md-color-scheme="${newTheme}"]`);
            if (themeButton) {
                themeButton.checked = true;
            }
            
            // Показываем уведомление
            showThemeNotification(newTheme);
        }
        
        // Функция показа уведомления о смене темы
        function showThemeNotification(theme) {
            const notification = document.createElement('div');
            notification.className = 'theme-notification';
            notification.innerHTML = `
                <div class="theme-notification-content">
                    <span class="theme-icon">${theme === 'slate' ? '🌙' : '☀️'}</span>
                    <span class="theme-text">${theme === 'slate' ? 'Темная тема' : 'Светлая тема'}</span>
                </div>
            `;
            
            // Добавляем стили для уведомления
            const style = document.createElement('style');
            style.textContent = `
                .theme-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${theme === 'slate' ? '#2c3e50' : '#ffffff'};
                    color: ${theme === 'slate' ? '#ffffff' : '#000000'};
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 10000;
                    font-size: 14px;
                    font-weight: 600;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                }
                
                .theme-notification-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .theme-icon {
                    font-size: 16px;
                }
            `;
            
            if (!document.querySelector('.theme-notification-styles')) {
                style.className = 'theme-notification-styles';
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notification);
            
            // Анимация появления
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 10);
            
            // Убираем уведомление через 2 секунды
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 2000);
        }
        
        // Закрываем меню при клике на ссылки
        const navLinks = document.querySelectorAll('.md-drawer .md-nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Nav link clicked, closing menu');
                closeMenu();
            });
        });
        
        // Закрываем меню при клике на overlay
        if (overlay) {
            overlay.addEventListener('click', function() {
                console.log('Overlay clicked, closing menu');
                closeMenu();
            });
        }
        
        // Закрываем меню при клике вне меню
        document.addEventListener('click', function(e) {
            if (drawer.classList.contains('md-drawer--open')) {
                if (!drawer.contains(e.target) && !newHamburgerButton.contains(e.target)) {
                    console.log('Click outside menu, closing');
                    closeMenu();
                }
            }
        });
        
        // Закрываем меню при нажатии Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && drawer.classList.contains('md-drawer--open')) {
                console.log('Escape pressed, closing menu');
                closeMenu();
            }
        });
        
        // Исправляем стили для мобильного меню
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 76.1875em) {
                .md-drawer {
                    pointer-events: auto !important;
                    z-index: 999 !important;
                }
                
                .md-drawer__inner {
                    pointer-events: auto !important;
                    z-index: 999 !important;
                }
                
                .md-header__button--menu {
                    pointer-events: auto !important;
                    cursor: pointer !important;
                    z-index: 1000 !important;
                    transition: all 0.2s ease !important;
                }
                
                .md-header__button--menu:hover {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                    transform: scale(1.05) !important;
                }
                
                .md-header__button--menu:active {
                    transform: scale(0.95) !important;
                }
                
                .md-nav__link {
                    pointer-events: auto !important;
                    cursor: pointer !important;
                }
            }
            
            /* Стили для мобильного содержания */
            .mobile-toc {
                background: rgba(255, 255, 255, 0.05);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                margin-bottom: 16px;
                padding: 16px;
            }
            
            [data-md-color-scheme="default"] .mobile-toc {
                background: rgba(0, 0, 0, 0.05);
                border-bottom-color: rgba(0, 0, 0, 0.1);
            }
            
            .mobile-toc-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 700;
                font-size: 16px;
                color: #3498db;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid rgba(52, 152, 219, 0.3);
            }
            
            .toc-icon {
                font-size: 18px;
            }
            
            .mobile-toc-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .mobile-toc-item {
                margin: 0;
                padding: 0;
            }
            
            .mobile-toc-link {
                display: block;
                padding: 8px 0;
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                font-size: 14px;
                line-height: 1.4;
                transition: all 0.3s ease;
                border-left: 3px solid transparent;
                padding-left: 12px;
            }
            
            [data-md-color-scheme="default"] .mobile-toc-link {
                color: rgba(0, 0, 0, 0.8);
            }
            
            .mobile-toc-link:hover {
                color: #3498db;
                background: rgba(52, 152, 219, 0.1);
                border-left-color: #3498db;
                padding-left: 16px;
            }
            
            /* Отступы для разных уровней заголовков */
            .mobile-toc-level-1 .mobile-toc-link {
                font-weight: 600;
                font-size: 15px;
            }
            
            .mobile-toc-level-2 .mobile-toc-link {
                padding-left: 20px;
                font-size: 14px;
            }
            
            .mobile-toc-level-3 .mobile-toc-link {
                padding-left: 28px;
                font-size: 13px;
            }
            
            .mobile-toc-level-4 .mobile-toc-link {
                padding-left: 36px;
                font-size: 12px;
            }
            
            .mobile-toc-level-5 .mobile-toc-link {
                padding-left: 44px;
                font-size: 12px;
            }
            
            .mobile-toc-level-6 .mobile-toc-link {
                padding-left: 52px;
                font-size: 11px;
            }
            
            /* Анимация появления */
            .mobile-toc {
                animation: slideInFromTop 0.3s ease-out;
            }
            
            @keyframes slideInFromTop {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Инициализируем исправление
    initMobileMenuFix();
    
    // Переинициализируем при изменении размера окна
    window.addEventListener('resize', function() {
        setTimeout(initMobileMenuFix, 100);
    });
    
    // Показываем подсказку о новой функциональности при первом посещении
    function showFeatureHint() {
        if (localStorage.getItem('mobile-menu-hint-shown')) return;
        
        setTimeout(() => {
            const hint = document.createElement('div');
            hint.className = 'mobile-menu-hint';
            hint.innerHTML = `
                <div class="hint-content">
                    <div class="hint-icon">💡</div>
                    <div class="hint-text">
                        <strong>Новые возможности:</strong><br>
                        • Обычный клик - переключить тему<br>
                        • Двойной клик - открыть меню<br>
                        • Долгое нажатие - открыть меню
                    </div>
                    <button class="hint-close">✕</button>
                </div>
            `;
            
            // Стили для подсказки
            const hintStyle = document.createElement('style');
            hintStyle.textContent = `
                .mobile-menu-hint {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    background: #2c3e50;
                    color: white;
                    padding: 16px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    z-index: 10000;
                    font-size: 14px;
                    opacity: 0;
                    transform: translateY(100%);
                    transition: all 0.3s ease;
                }
                
                .hint-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                }
                
                .hint-icon {
                    font-size: 20px;
                    flex-shrink: 0;
                }
                
                .hint-text {
                    flex: 1;
                    line-height: 1.4;
                }
                
                .hint-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background 0.3s ease;
                }
                
                .hint-close:hover {
                    background: rgba(255,255,255,0.1);
                }
                
                @media (max-width: 480px) {
                    .mobile-menu-hint {
                        left: 10px;
                        right: 10px;
                        bottom: 10px;
                    }
                }
            `;
            
            if (!document.querySelector('.mobile-menu-hint-styles')) {
                hintStyle.className = 'mobile-menu-hint-styles';
                document.head.appendChild(hintStyle);
            }
            
            document.body.appendChild(hint);
            
            // Анимация появления
            setTimeout(() => {
                hint.style.opacity = '1';
                hint.style.transform = 'translateY(0)';
            }, 100);
            
            // Обработчик закрытия
            hint.querySelector('.hint-close').addEventListener('click', () => {
                hint.style.opacity = '0';
                hint.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    if (hint.parentNode) {
                        hint.parentNode.removeChild(hint);
                    }
                }, 300);
                localStorage.setItem('mobile-menu-hint-shown', 'true');
            });
            
            // Автоматическое закрытие через 10 секунд
            setTimeout(() => {
                if (hint.parentNode) {
                    hint.style.opacity = '0';
                    hint.style.transform = 'translateY(100%)';
                    setTimeout(() => {
                        if (hint.parentNode) {
                            hint.parentNode.removeChild(hint);
                        }
                    }, 300);
                    localStorage.setItem('mobile-menu-hint-shown', 'true');
                }
            }, 10000);
            
        }, 2000);
    }
    
    // Показываем подсказку только на мобильных устройствах
    if (window.innerWidth <= 768) {
        showFeatureHint();
    }
    
})();
