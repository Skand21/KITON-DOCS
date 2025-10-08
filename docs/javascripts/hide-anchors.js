// Скрываем символы ¶ (якоря) в заголовках - УСИЛЕННАЯ ВЕРСИЯ
document.addEventListener('DOMContentLoaded', function() {
    // Функция для скрытия якорей
    function hideAnchors() {
        // Находим все заголовки
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        headings.forEach(heading => {
            // Находим ссылки с якорями внутри заголовков
            const anchorLinks = heading.querySelectorAll('a[href^="#"]');
            
            anchorLinks.forEach(link => {
                // Полностью удаляем ссылку с якорем
                link.remove();
            });
        });
        
        // Также находим и удаляем все якорные ссылки в контенте
        const allAnchorLinks = document.querySelectorAll('.headerlink, a[href^="#"]');
        allAnchorLinks.forEach(link => {
            if (link.textContent === '¶' || link.textContent.includes('¶')) {
                link.remove();
            }
        });
    }
    
    // Выполняем сразу
    hideAnchors();
    
    // Выполняем с задержкой на случай динамической загрузки
    setTimeout(hideAnchors, 50);
    setTimeout(hideAnchors, 100);
    setTimeout(hideAnchors, 300);
    setTimeout(hideAnchors, 500);
    setTimeout(hideAnchors, 1000);
    setTimeout(hideAnchors, 2000);
    
    // Следим за изменениями в DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                hideAnchors();
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
