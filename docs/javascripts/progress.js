// Прогресс-бар для длинных гайдов
document.addEventListener('DOMContentLoaded', function() {
    // Создаем прогресс-бар
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    // Функция обновления прогресса
    function updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    }
    
    // Обновляем прогресс при скролле
    window.addEventListener('scroll', updateProgress);
    
    // Обновляем прогресс при изменении размера окна
    window.addEventListener('resize', updateProgress);
    
    // Инициализация
    updateProgress();
});

// Улучшенный поиск с автодополнением
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
        // Добавляем обработчик для автодополнения
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            
            // Подсвечиваем теги при поиске
            const tags = document.querySelectorAll('.tag');
            tags.forEach(tag => {
                if (tag.textContent.toLowerCase().includes(query)) {
                    tag.style.background = '#ffeb3b';
                    tag.style.color = '#000';
                } else {
                    tag.style.background = '';
                    tag.style.color = '';
                }
            });
        });
    }
});

// Плавная прокрутка к якорям
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Подсветка активного раздела в навигации
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('h1, h2, h3');
    const navLinks = document.querySelectorAll('.md-nav__link');
    
    function highlightActiveSection() {
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100) {
                currentSection = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('md-nav__link--active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('md-nav__link--active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection();
});
