// Улучшенный поиск с автодополнением и фильтрацией по тегам
document.addEventListener('DOMContentLoaded', function() {
    // Создаем панель быстрого поиска по тегам
    const quickSearchPanel = document.createElement('div');
    quickSearchPanel.id = 'quick-search-panel';
    quickSearchPanel.innerHTML = `
        <div class="quick-search-header">
            <h4>🔍 Быстрый поиск по тегам</h4>
        </div>
        <div class="quick-search-tags">
            <button class="tag-filter" data-tag="репетитор">👨🏫 Репетитор</button>
            <button class="tag-filter" data-tag="ученик">👨🎓 Ученик</button>
            <button class="tag-filter" data-tag="родитель">👨‍👩‍👧 Родитель</button>
            <button class="tag-filter" data-tag="домашние-задания">📚 ДЗ</button>
            <button class="tag-filter" data-tag="газики">🎮 Газики</button>
            <button class="tag-filter" data-tag="расписание">📅 Расписание</button>
            <button class="tag-filter" data-tag="финансы">💰 Финансы</button>
            <button class="tag-filter" data-tag="статистика">📊 Статистика</button>
            <button class="tag-filter" data-tag="тарифы">💳 Тарифы</button>
            <button class="tag-filter" data-tag="faq">❓ FAQ</button>
        </div>
        <div class="quick-search-results" id="quick-search-results"></div>
    `;
    
    // Добавляем стили для панели поиска
    const style = document.createElement('style');
    style.textContent = `
        #quick-search-panel {
            position: fixed;
            top: 60px;
            right: 20px;
            width: 300px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            display: none;
            max-height: 400px;
            overflow-y: auto;
        }
        
        [data-md-color-scheme="slate"] #quick-search-panel {
            background: #1e1e1e;
            border-color: #444;
        }
        
        .quick-search-header {
            padding: 12px;
            border-bottom: 1px solid #eee;
            background: #f5f5f5;
        }
        
        [data-md-color-scheme="slate"] .quick-search-header {
            background: #2d2d2d;
            border-bottom-color: #444;
        }
        
        .quick-search-header h4 {
            margin: 0;
            font-size: 14px;
            color: #333;
        }
        
        [data-md-color-scheme="slate"] .quick-search-header h4 {
            color: #fff;
        }
        
        .quick-search-tags {
            padding: 12px;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        
        .tag-filter {
            background: #e3f2fd;
            color: #1976d2;
            border: 1px solid #bbdefb;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .tag-filter:hover {
            background: #bbdefb;
            transform: translateY(-1px);
        }
        
        .tag-filter.active {
            background: #1976d2;
            color: white;
        }
        
        .quick-search-results {
            padding: 12px;
            border-top: 1px solid #eee;
        }
        
        [data-md-color-scheme="slate"] .quick-search-results {
            border-top-color: #444;
        }
        
        .search-result-item {
            padding: 8px;
            border-radius: 4px;
            margin-bottom: 4px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .search-result-item:hover {
            background: #f0f0f0;
        }
        
        [data-md-color-scheme="slate"] .search-result-item:hover {
            background: #333;
        }
        
        .search-result-title {
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 2px;
        }
        
        .search-result-description {
            font-size: 11px;
            color: #666;
        }
        
        [data-md-color-scheme="slate"] .search-result-description {
            color: #aaa;
        }
        
        .quick-search-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1976d2;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1001;
            transition: all 0.3s ease;
        }
        
        .quick-search-toggle:hover {
            background: #0d47a1;
            transform: scale(1.1);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(quickSearchPanel);
    
    // Создаем кнопку для открытия панели поиска
    const toggleButton = document.createElement('button');
    toggleButton.className = 'quick-search-toggle';
    toggleButton.innerHTML = '🔍';
    toggleButton.title = 'Быстрый поиск по тегам';
    document.body.appendChild(toggleButton);
    
    // Данные для поиска
    const searchData = [
        {
            title: 'Гайд для репетиторов',
            description: 'Полное руководство по управлению учениками и статистике',
            url: 'tutor-guide.md',
            tags: ['репетитор', 'управление', 'статистика', 'ученики']
        },
        {
            title: 'Гайд для учеников',
            description: 'Инструкции по работе с ДЗ и системой Газики',
            url: 'student-guide.md',
            tags: ['ученик', 'домашние-задания', 'газики', 'прогресс']
        },
        {
            title: 'Гайд для родителей',
            description: 'Контроль успеваемости и управление финансами',
            url: 'parent-guide.md',
            tags: ['родитель', 'контроль', 'финансы', 'дети']
        },
        {
            title: 'База знаний для репетиторов',
            description: 'Полная документация всех возможностей',
            url: 'knowledge-base-tutor.md',
            tags: ['репетитор', 'полная-версия', 'управление', 'статистика']
        },
        {
            title: 'База знаний для учеников',
            description: 'Упрощенная версия для учеников',
            url: 'knowledge-base-student.md',
            tags: ['ученик', 'упрощенная-версия', 'домашние-задания', 'газики']
        },
        {
            title: 'База знаний для родителей',
            description: 'Руководство по контролю обучения детей',
            url: 'knowledge-base-parent.md',
            tags: ['родитель', 'контроль', 'финансы', 'мониторинг']
        },
        {
            title: 'Часто задаваемые вопросы',
            description: 'Быстрые ответы на популярные вопросы',
            url: 'faq.md',
            tags: ['faq', 'вопросы', 'ответы', 'помощь']
        },
        {
            title: 'Тарифы и цены',
            description: 'Тарифные планы для репетиторов',
            url: 'tariffs.md',
            tags: ['тарифы', 'цены', 'планы', 'подписка']
        }
    ];
    
    // Функция фильтрации результатов
    function filterResults(activeTags) {
        const resultsContainer = document.getElementById('quick-search-results');
        resultsContainer.innerHTML = '';
        
        if (activeTags.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align: center; color: #666; font-size: 12px;">Выберите теги для поиска</p>';
            return;
        }
        
        const filteredResults = searchData.filter(item => 
            activeTags.some(tag => item.tags.includes(tag))
        );
        
        if (filteredResults.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align: center; color: #666; font-size: 12px;">Ничего не найдено</p>';
            return;
        }
        
        filteredResults.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-description">${result.description}</div>
            `;
            
            resultItem.addEventListener('click', () => {
                window.location.href = result.url;
            });
            
            resultsContainer.appendChild(resultItem);
        });
    }
    
    // Обработчики для кнопок тегов
    const tagButtons = quickSearchPanel.querySelectorAll('.tag-filter');
    let activeTags = [];
    
    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tag = button.dataset.tag;
            
            if (button.classList.contains('active')) {
                button.classList.remove('active');
                activeTags = activeTags.filter(t => t !== tag);
            } else {
                button.classList.add('active');
                activeTags.push(tag);
            }
            
            filterResults(activeTags);
        });
    });
    
    // Обработчик для кнопки переключения
    toggleButton.addEventListener('click', () => {
        if (quickSearchPanel.style.display === 'none' || quickSearchPanel.style.display === '') {
            quickSearchPanel.style.display = 'block';
            filterResults(activeTags);
        } else {
            quickSearchPanel.style.display = 'none';
        }
    });
    
    // Закрытие панели при клике вне её
    document.addEventListener('click', (e) => {
        if (!quickSearchPanel.contains(e.target) && !toggleButton.contains(e.target)) {
            quickSearchPanel.style.display = 'none';
        }
    });
    
    // Инициализация
    filterResults(activeTags);
});
