// Основной JavaScript файл с общей логикой

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initMain();
});

// Основная инициализация
async function initMain() {
    // Инициализация таймера на главной странице
    initCountdown();
    
    // Инициализация поиска
    initSearch();
    
    // Инициализация фильтров на главной
    initHomeFilters();
    
    // Инициализация модальных окон
    initModals();
    
    // Загрузка популярных товаров на главной
    if (document.getElementById('featured-products')) {
        await loadFeaturedProducts();
    }
}

// Инициализация таймера
function initCountdown() {
    const countdownElements = document.querySelectorAll('#countdown, #main-timer');
    
    if (countdownElements.length === 0) return;
    
    // Устанавливаем дату окончания акции (через 5 дней)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 5);
    endDate.setHours(23, 59, 59, 999);
    
    function updateCountdown() {
        const now = new Date();
        const timeLeft = endDate - now;
        
        if (timeLeft <= 0) {
            countdownElements.forEach(element => {
                element.innerHTML = '<span class="expired">Акция завершена</span>';
            });
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        countdownElements.forEach(element => {
            const timeUnits = element.querySelectorAll('.time-unit, .timer-unit');
            
            if (timeUnits.length >= 3) {
                timeUnits[0].querySelector('.number').textContent = days.toString().padStart(2, '0');
                timeUnits[1].querySelector('.number').textContent = hours.toString().padStart(2, '0');
                timeUnits[2].querySelector('.number').textContent = minutes.toString().padStart(2, '0');
                
                if (timeUnits.length === 4) {
                    timeUnits[3].querySelector('.number').textContent = seconds.toString().padStart(2, '0');
                }
            }
        });
    }
    
    // Обновляем каждую секунду
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Инициализация поиска
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchSuggestions = document.getElementById('search-suggestions');
    
    if (!searchInput) return;
    
    // Обработчик поиска
    const performSearch = async () => {
        const query = searchInput.value.trim();
        
        if (query.length === 0) {
            if (searchSuggestions) {
                searchSuggestions.style.display = 'none';
            }
            return;
        }
        
        try {
            const results = await MockAPI.searchProducts(query);
            showSearchSuggestions(results);
        } catch (error) {
            console.error('Ошибка поиска:', error);
        }
    };
    
    // События для поиска
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch();
        });
    }
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Поиск при вводе с debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        
        if (searchInput.value.trim() === '') {
            if (searchSuggestions) {
                searchSuggestions.style.display = 'none';
            }
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch();
        }, 300);
    });
    
    // Закрытие подсказок при клике вне области
    document.addEventListener('click', (e) => {
        if (searchSuggestions && 
            !searchInput.contains(e.target) && 
            !searchSuggestions.contains(e.target)) {
            searchSuggestions.style.display = 'none';
        }
    });
}

// Показать подсказки поиска
function showSearchSuggestions(results) {
    const searchSuggestions = document.getElementById('search-suggestions');
    if (!searchSuggestions) return;
    
    if (results.length === 0) {
        searchSuggestions.innerHTML = '<div class="suggestion-item">Ничего не найдено</div>';
        searchSuggestions.style.display = 'block';
        return;
    }
    
    const suggestionsHTML = results.slice(0, 5).map(product => `
        <a href="#" class="suggestion-item" data-id="${product.id}">
            <div class="suggestion-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="suggestion-info">
                <div class="suggestion-title">${product.name}</div>
                <div class="suggestion-price">${product.price.toLocaleString('ru-RU')} ₽</div>
            </div>
        </a>
    `).join('');
    
    searchSuggestions.innerHTML = suggestionsHTML;
    searchSuggestions.style.display = 'block';
    
    // Добавляем обработчики для подсказок
    searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = item.dataset.id;
            showQuickView(productId);
            searchSuggestions.style.display = 'none';
        });
    });
}

// Инициализация фильтров на главной
function initHomeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', async function() {
            const filter = this.dataset.filter;
            
            // Обновляем активную вкладку
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Загружаем товары в зависимости от фильтра
            await loadFilteredProducts(filter);
        });
    });
}

// Загрузка отфильтрованных товаров
async function loadFilteredProducts(filter) {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    try {
        let products;
        
        switch(filter) {
            case 'new':
                products = await MockAPI.getNewProducts();
                break;
            case 'discount':
                products = await MockAPI.getDiscountProducts();
                break;
            case 'bestsellers':
                products = await MockAPI.getFeaturedProducts();
                break;
            default:
                products = await MockAPI.getFeaturedProducts();
        }
        
        container.innerHTML = products.map(product => createProductCard(product)).join('');
        addProductEventListeners();
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

// Загрузка популярных товаров
async function loadFeaturedProducts() {
    try {
        const products = await MockAPI.getFeaturedProducts();
        const container = document.getElementById('featured-products');
        
        if (!container) return;
        
        container.innerHTML = products.map(product => createProductCard(product)).join('');
        addProductEventListeners();
    } catch (error) {
        console.error('Ошибка загрузки популярных товаров:', error);
    }
}

// Создание карточки товара
function createProductCard(product) {
    const discountPercentage = product.oldPrice ? 
        Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    
    return `
        <div class="product-card" data-id="${product.id}">
            ${product.discount ? `
                <div class="product-badge">-${discountPercentage}%</div>
            ` : ''}
            
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            
            <div class="product-info">
                <div class="product-category">
                    <i class="${getCategoryIcon(product.category)}"></i>
                    ${getCategoryName(product.category)}
                </div>
                
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${truncateText(product.description, 60)}</p>
                
                <div class="product-price">
                    <span class="current-price">${product.price.toLocaleString('ru-RU')} ₽</span>
                    ${product.oldPrice ? `
                        <span class="old-price">${product.oldPrice.toLocaleString('ru-RU')} ₽</span>
                    ` : ''}
                </div>
                
                <div class="product-actions">
                    <button class="btn btn-add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> В корзину
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Получение иконки категории
function getCategoryIcon(category) {
    const icons = {
        'cutting': 'fas fa-cut',
        'digging': 'fas fa-shovel',
        'watering': 'fas fa-tint',
        'storage': 'fas fa-box'
    };
    
    return icons[category] || 'fas fa-seedling';
}

// Получение названия категории
function getCategoryName(category) {
    const names = {
        'cutting': 'Режущий инструмент',
        'digging': 'Земляные работы',
        'watering': 'Полив',
        'storage': 'Хранение'
    };
    
    return names[category] || category;
}

// Обрезка текста
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Добавление обработчиков событий для товаров
function addProductEventListeners() {
    // Кнопки "В корзину"
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', async function() {
            const productId = parseInt(this.dataset.id);
            const product = await MockAPI.getProduct(productId);
            
            if (!product) return;
            
            CartAPI.addToCart(productId, 1);
            
            // Визуальная обратная связь
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Добавлено';
            this.classList.add('added');
            
            // Показываем уведомление
            showNotification(`${product.name} добавлен в корзину`, 'success');
            
            // Возвращаем исходный текст через 2 секунды
            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('added');
            }, 2000);
        });
    });
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    `;
    
    // Добавляем на страницу
    document.body.appendChild(notification);
    
    // Показываем с анимацией
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Убираем через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Инициализация модальных окон
function initModals() {
    const modalOverlay = document.getElementById('quick-view-modal');
    if (!modalOverlay) return;
    
    const closeModal = modalOverlay.querySelector('.close-modal');
    
    // Закрытие модального окна
    closeModal.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
    });
    
    // Закрытие при клике вне окна
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
            modalOverlay.style.display = 'none';
        }
    });
}

// Быстрый просмотр товара
async function showQuickView(productId) {
    try {
        const product = await MockAPI.getProduct(productId);
        if (!product) return;
        
        const modalContent = createQuickViewContent(product);
        const modalOverlay = document.getElementById('quick-view-modal');
        const modalBody = document.getElementById('quick-view-content');
        
        if (!modalOverlay || !modalBody) return;
        
        modalBody.innerHTML = modalContent;
        modalOverlay.style.display = 'flex';
        
        // Добавляем обработчики в модальном окне
        const addToCartBtn = modalBody.querySelector('.btn-add-to-cart-modal');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                CartAPI.addToCart(productId, 1);
                showNotification(`${product.name} добавлен в корзину`, 'success');
            });
        }
        
    } catch (error) {
        console.error('Ошибка при быстром просмотре:', error);
    }
}

// Создание контента для быстрого просмотра
function createQuickViewContent(product) {
    const discountPercentage = product.oldPrice ? 
        Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    
    return `
        <div class="quick-view-content">
            <div class="quick-view-images">
                <div class="main-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
            </div>
            
            <div class="quick-view-info">
                <div class="product-category">
                    <i class="${getCategoryIcon(product.category)}"></i>
                    ${getCategoryName(product.category)}
                </div>
                
                <h2>${product.name}</h2>
                
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span class="rating-value">${product.rating.toFixed(1)}</span>
                    <span class="reviews-count">(${product.reviews} отзывов)</span>
                </div>
                
                <div class="product-description">
                    <p>${product.description}</p>
                </div>
                
                <div class="product-specs">
                    <h4>Характеристики:</h4>
                    <ul>
                        ${Object.entries(product.specifications || {}).map(([key, value]) => `
                            <li><strong>${key}:</strong> ${value}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="product-price-large">
                    ${product.oldPrice ? `
                        <div class="price-old">${product.oldPrice.toLocaleString('ru-RU')} ₽</div>
                        <div class="price-discount">-${discountPercentage}%</div>
                    ` : ''}
                    <div class="price-current">${product.price.toLocaleString('ru-RU')} ₽</div>
                </div>
                
                <div class="product-availability">
                    <i class="fas fa-${product.inStock ? 'check-circle' : 'clock'}"></i>
                    ${product.inStock ? 
                        `В наличии (${product.stockCount} шт.)` : 
                        'Под заказ (3-5 дней)'}
                </div>
                
                <div class="product-actions-modal">
                    <button class="btn btn-primary btn-add-to-cart-modal">
                        <i class="fas fa-cart-plus"></i> Добавить в корзину
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Генерация звезд рейтинга
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Инициализация слайдеров (если есть)
function initSliders() {
    const sliders = document.querySelectorAll('.slider-container');
    
    sliders.forEach(slider => {
        // Простая реализация слайдера
        const slides = slider.children;
        let currentSlide = 0;
        
        function showSlide(index) {
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = 'none';
            }
            slides[index].style.display = 'block';
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
        
        // Добавляем кнопки управления
        const prevBtn = slider.parentElement.querySelector('.slider-btn.prev');
        const nextBtn = slider.parentElement.querySelector('.slider-btn.next');
        
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Автопрокрутка
        setInterval(nextSlide, 5000);
        
        // Показываем первый слайд
        if (slides.length > 0) {
            showSlide(0);
        }
    });
}

// Экспортируем функции для использования в других файлах
window.showQuickView = showQuickView;
window.MockAPI = MockAPI;
window.CartAPI = CartAPI;