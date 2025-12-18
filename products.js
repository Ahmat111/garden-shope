// JavaScript для страницы товаров

// Глобальные переменные
let currentProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 9;
let currentView = 'grid';

// Инициализация страницы товаров
document.addEventListener('DOMContentLoaded', async function() {
    if (!document.querySelector('.products-page')) return;
    
    await initProductsPage();
});

// Инициализация страницы товаров
async function initProductsPage() {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const discount = urlParams.get('discount');
    
    // Загружаем все товары
    await loadAllProducts();
    
    // Применяем фильтры из URL
    if (category) {
        applyCategoryFilter(category);
    }
    
    if (discount === 'true') {
        applyDiscountFilter();
    }
    
    // Инициализация фильтров
    initFilters();
    
    // Инициализация сортировки
    initSorting();
    
    // Инициализация переключения вида
    initViewToggle();
    
    // Инициализация пагинации
    initPagination();
    
    // Отображаем товары
    displayProducts();
}

// Загрузка всех товаров
async function loadAllProducts() {
    try {
        currentProducts = await MockAPI.getProducts();
        filteredProducts = [...currentProducts];
        updateProductsCount();
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        showError('Не удалось загрузить товары');
    }
}

// Инициализация фильтров
function initFilters() {
    // Очистка всех фильтров
    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFilters);
    }
    
    // Фильтр по категориям
    const categoryFilters = document.querySelectorAll('input[name="category"]');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', applyCategoryFilters);
    });
    
    // Фильтр по цене
    const priceFilterBtn = document.getElementById('apply-price');
    if (priceFilterBtn) {
        priceFilterBtn.addEventListener('click', applyPriceFilter);
    }
    
    // Фильтр по наличию
    const stockFilters = document.querySelectorAll('input[name="stock"]');
    stockFilters.forEach(filter => {
        filter.addEventListener('change', applyStockFilter);
    });
    
    // Фильтр по скидке
    const discountFilter = document.querySelector('input[name="discount"]');
    if (discountFilter) {
        discountFilter.addEventListener('change', applyDiscountFilter);
    }
    
    // Фильтр по брендам
    const brandFilters = document.querySelectorAll('input[name="brand"]');
    brandFilters.forEach(filter => {
        filter.addEventListener('change', applyBrandFilter);
    });
}

// Применение фильтров по категориям
function applyCategoryFilters() {
    const selectedCategories = Array.from(
        document.querySelectorAll('input[name="category"]:checked')
    ).map(input => input.value);
    
    // Если выбрана категория "all" или ничего не выбрано, показываем все
    if (selectedCategories.includes('all') || selectedCategories.length === 0) {
        filteredProducts = [...currentProducts];
    } else {
        filteredProducts = currentProducts.filter(product =>
            selectedCategories.includes(product.category)
        );
    }
    
    applyOtherFilters();
}

// Применение фильтра по цене
function applyPriceFilter() {
    const minPrice = parseInt(document.getElementById('min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('max-price').value) || Infinity;
    
    filteredProducts = filteredProducts.filter(product =>
        product.price >= minPrice && product.price <= maxPrice
    );
    
    displayProducts();
    updateProductsCount();
}

// Применение фильтра по наличию
function applyStockFilter() {
    const inStock = document.querySelector('input[name="stock"][value="in-stock"]').checked;
    const preorder = document.querySelector('input[name="stock"][value="preorder"]').checked;
    
    if (inStock && preorder) {
        // Показываем все товары
        return;
    }
    
    if (inStock) {
        filteredProducts = filteredProducts.filter(product => product.inStock);
    } else if (preorder) {
        filteredProducts = filteredProducts.filter(product => !product.inStock);
    }
    
    displayProducts();
    updateProductsCount();
}

// Применение фильтра по скидке
function applyDiscountFilter() {
    const discountOnly = document.querySelector('input[name="discount"][value="yes"]');
    if (!discountOnly) return;
    
    if (discountOnly.checked) {
        filteredProducts = filteredProducts.filter(product => product.discount > 0);
    }
    
    displayProducts();
    updateProductsCount();
}

// Применение фильтра по брендам
function applyBrandFilter() {
    const selectedBrands = Array.from(
        document.querySelectorAll('input[name="brand"]:checked')
    ).map(input => input.value);
    
    if (selectedBrands.length === 0) {
        return;
    }
    
    filteredProducts = filteredProducts.filter(product =>
        selectedBrands.includes(product.brand.toLowerCase())
    );
    
    displayProducts();
    updateProductsCount();
}

// Применение всех фильтров (кроме цены)
function applyOtherFilters() {
    // Сохраняем исходный массив
    let tempProducts = [...filteredProducts];
    
    // Применяем фильтр по наличию
    const inStock = document.querySelector('input[name="stock"][value="in-stock"]');
    const preorder = document.querySelector('input[name="stock"][value="preorder"]');
    
    if (inStock && preorder) {
        // Если оба выбраны, ничего не делаем
    } else if (inStock && inStock.checked) {
        tempProducts = tempProducts.filter(product => product.inStock);
    } else if (preorder && preorder.checked) {
        tempProducts = tempProducts.filter(product => !product.inStock);
    }
    
    // Применяем фильтр по скидке
    const discountOnly = document.querySelector('input[name="discount"][value="yes"]');
    if (discountOnly && discountOnly.checked) {
        tempProducts = tempProducts.filter(product => product.discount > 0);
    }
    
    // Применяем фильтр по брендам
    const selectedBrands = Array.from(
        document.querySelectorAll('input[name="brand"]:checked')
    ).map(input => input.value);
    
    if (selectedBrands.length > 0) {
        tempProducts = tempProducts.filter(product =>
            selectedBrands.includes(product.brand.toLowerCase())
        );
    }
    
    filteredProducts = tempProducts;
    displayProducts();
    updateProductsCount();
}

// Применение фильтра по категории из URL
function applyCategoryFilter(category) {
    const checkboxes = document.querySelectorAll('input[name="category"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = (checkbox.value === category);
    });
    
    filteredProducts = currentProducts.filter(product => product.category === category);
    displayProducts();
    updateProductsCount();
}

// Очистка всех фильтров
function clearAllFilters() {
    // Сбрасываем все чекбоксы
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Ставим галочку на "Все товары"
    const allCheckbox = document.querySelector('input[name="category"][value="all"]');
    if (allCheckbox) {
        allCheckbox.checked = true;
    }
    
    // Сбрасываем цену
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    
    // Возвращаем все товары
    filteredProducts = [...currentProducts];
    
    displayProducts();
    updateProductsCount();
}

// Инициализация сортировки
function initSorting() {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        sortProducts(this.value);
        displayProducts();
    });
}

// Сортировка товаров
function sortProducts(sortBy) {
    switch(sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'discount':
            filteredProducts.sort((a, b) => {
                const discountA = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
                const discountB = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
                return discountB - discountA;
            });
            break;
        default:
            // Сортировка по умолчанию
            break;
    }
}

// Инициализация переключения вида
function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Обновляем активную кнопку
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Меняем вид
            currentView = view;
            const container = document.getElementById('products-container');
            if (container) {
                container.className = 'products-container ' + view + '-view';
            }
        });
    });
}

// Инициализация пагинации
function initPagination() {
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    const pageNumbers = document.querySelector('.page-numbers');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayProducts();
                updatePagination();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayProducts();
                updatePagination();
            }
        });
    }
    
    // Обработка кликов по номерам страниц
    if (pageNumbers) {
        pageNumbers.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-number')) {
                const pageNum = parseInt(e.target.textContent);
                if (pageNum !== currentPage) {
                    currentPage = pageNum;
                    displayProducts();
                    updatePagination();
                }
            }
        });
    }
}

// Обновление пагинации
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    const pageNumbers = document.querySelector('.page-numbers');
    
    if (!prevBtn || !nextBtn || !pageNumbers) return;
    
    // Обновляем состояние кнопок
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Обновляем номера страниц
    let pageNumbersHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        if (i <= 3 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pageNumbersHTML += `
                <span class="page-number ${i === currentPage ? 'active' : ''}">${i}</span>
            `;
        } else if (i === 4 && totalPages > 6) {
            pageNumbersHTML += '<span class="page-dots">...</span>';
        }
    }
    
    pageNumbers.innerHTML = pageNumbersHTML;
}

// Отображение товаров
function displayProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    // Вычисляем товары для текущей страницы
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }
    
    // Создаем HTML для товаров
    let productsHTML = '';
    
    if (currentView === 'grid') {
        productsHTML = productsToShow.map(product => createProductGridCard(product)).join('');
    } else {
        productsHTML = productsToShow.map(product => createProductListCard(product)).join('');
    }
    
    container.innerHTML = productsHTML;
    
    // Добавляем обработчики событий
    addProductEventListeners();
    
    // Обновляем пагинацию
    updatePagination();
}

// Создание карточки товара для сетки
function createProductGridCard(product) {
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
                
                <div class="product-meta">
                    <span class="product-brand">${product.brand}</span>
                    <span class="product-rating">
                        <i class="fas fa-star"></i>
                        ${product.rating.toFixed(1)}
                    </span>
                </div>
                
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
                    <button class="btn btn-outline btn-quick-view" data-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Создание карточки товара для списка
function createProductListCard(product) {
    const discountPercentage = product.oldPrice ? 
        Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            
            <div class="product-info">
                ${product.discount ? `
                    <div class="product-badge">-${discountPercentage}%</div>
                ` : ''}
                
                <div class="product-category">
                    <i class="${getCategoryIcon(product.category)}"></i>
                    ${getCategoryName(product.category)}
                </div>
                
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                
                <div class="product-specs">
                    <div class="spec-item">
                        <i class="fas fa-tag"></i>
                        <span>Бренд: ${product.brand}</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-star"></i>
                        <span>Рейтинг: ${product.rating.toFixed(1)} (${product.reviews} отзывов)</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-${product.inStock ? 'check' : 'clock'}"></i>
                        <span>${product.inStock ? 'В наличии' : 'Под заказ'}</span>
                    </div>
                </div>
                
                <div class="product-price-large">
                    <span class="current-price">${product.price.toLocaleString('ru-RU')} ₽</span>
                    ${product.oldPrice ? `
                        <span class="old-price">${product.oldPrice.toLocaleString('ru-RU')} ₽</span>
                    ` : ''}
                </div>
                
                <div class="product-actions">
                    <button class="btn btn-add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> В корзину
                    </button>
                    <button class="btn btn-outline btn-quick-view" data-id="${product.id}">
                        <i class="fas fa-eye"></i> Быстрый просмотр
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
    
    // Кнопки быстрого просмотра
    document.querySelectorAll('.btn-quick-view').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            showQuickView(productId);
        });
    });
}

// Обновление счетчика товаров
function updateProductsCount() {
    const countElement = document.getElementById('products-count');
    if (!countElement) return;
    
    const count = filteredProducts.length;
    countElement.textContent = `${count} товаров`;
}

// Показать ошибку
function showError(message) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>${message}</h3>
            <button class="btn retry-btn" onclick="location.reload()">
                Попробовать снова
            </button>
        </div>
    `;
}

// Показать уведомление
function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Простая реализация, если функция из main.js не доступна
        alert(message);
    }
}

// Быстрый просмотр товара
function showQuickView(productId) {
    if (typeof window.showQuickView === 'function') {
        window.showQuickView(productId);
    }
}