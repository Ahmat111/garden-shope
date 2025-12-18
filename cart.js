// JavaScript для страницы корзины

// Глобальные переменные
let cartProducts = [];
let currentPromoCode = null;
let deliveryCost = 0;
const COURIER_DELIVERY_COST = 300;

// Инициализация страницы корзины
document.addEventListener('DOMContentLoaded', async function() {
    if (!document.querySelector('.cart-page')) return;
    
    await initCartPage();
});

// Инициализация страницы корзины
async function initCartPage() {
    // Загружаем корзину
    await loadCart();
    
    // Инициализация элементов управления
    initCartControls();
    
    // Инициализация формы заказа
    initOrderForm();
    
    // Инициализация промокодов
    initPromoCode();
    
    // Инициализация вариантов доставки
    initDeliveryOptions();
    
    // Обновляем итоговую сумму
    updateOrderSummary();
}

// Загрузка корзины
async function loadCart() {
    try {
        cartProducts = await CartAPI.getCartWithProducts();
        displayCart();
    } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
        showError('Не удалось загрузить корзину');
    }
}

// Отображение корзины
function displayCart() {
    const emptyCart = document.getElementById('empty-cart');
    const cartItemsSection = document.getElementById('cart-items-section');
    const cartItems = document.getElementById('cart-items');
    
    if (!emptyCart || !cartItemsSection || !cartItems) return;
    
    if (cartProducts.length === 0) {
        emptyCart.style.display = 'block';
        cartItemsSection.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItemsSection.style.display = 'block';
    
    // Создаем HTML для товаров в корзине
    const cartItemsHTML = cartProducts.map(item => createCartItemHTML(item)).join('');
    cartItems.innerHTML = cartItemsHTML;
    
    // Добавляем обработчики событий
    addCartItemEventListeners();
}

// Создание HTML для товара в корзине
function createCartItemHTML(item) {
    const product = item.product;
    const total = product.price * item.quantity;
    const discount = product.oldPrice ? 
        (product.oldPrice - product.price) * item.quantity : 0;
    
    return `
        <div class="cart-item" data-id="${product.id}">
            <div class="cart-item-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            
            <div class="cart-item-info">
                <h4 class="cart-item-title">${product.name}</h4>
                <div class="cart-item-category">
                    <i class="${getCategoryIcon(product.category)}"></i>
                    ${getCategoryName(product.category)}
                </div>
                <div class="cart-item-price">
                    ${product.price.toLocaleString('ru-RU')} ₽ / шт.
                </div>
            </div>
            
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-id="${product.id}">-</button>
                    <input type="number" 
                           class="quantity-input" 
                           value="${item.quantity}" 
                           min="1" 
                           max="99"
                           data-id="${product.id}">
                    <button class="quantity-btn increase" data-id="${product.id}">+</button>
                </div>
                
                <div class="cart-item-total">
                    ${total.toLocaleString('ru-RU')} ₽
                    ${discount > 0 ? `
                        <div class="cart-item-discount">
                            Экономия: ${discount.toLocaleString('ru-RU')} ₽
                        </div>
                    ` : ''}
                </div>
                
                <button class="remove-item" data-id="${product.id}" title="Удалить">
                    <i class="fas fa-trash"></i>
                </button>
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

// Добавление обработчиков событий для товаров в корзине
function addCartItemEventListeners() {
    // Кнопки уменьшения количества
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
            const currentValue = parseInt(input.value);
            
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateQuantity(productId, currentValue - 1);
            }
        });
    });
    
    // Кнопки увеличения количества
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
            const currentValue = parseInt(input.value);
            
            input.value = currentValue + 1;
            updateQuantity(productId, currentValue + 1);
        });
    });
    
    // Изменение количества через input
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.dataset.id);
            const newValue = parseInt(this.value) || 1;
            
            updateQuantity(productId, newValue);
        });
    });
    
    // Удаление товара
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            removeFromCart(productId);
        });
    });
}

// Обновление количества товара
async function updateQuantity(productId, quantity) {
    try {
        CartAPI.updateQuantity(productId, quantity);
        await loadCart();
        updateOrderSummary();
    } catch (error) {
        console.error('Ошибка обновления количества:', error);
        showNotification('Не удалось обновить количество', 'error');
    }
}

// Удаление товара из корзины
async function removeFromCart(productId) {
    try {
        CartAPI.removeFromCart(productId);
        await loadCart();
        updateOrderSummary();
        showNotification('Товар удален из корзины', 'success');
    } catch (error) {
        console.error('Ошибка удаления товара:', error);
        showNotification('Не удалось удалить товар', 'error');
    }
}

// Инициализация элементов управления корзиной
function initCartControls() {
    // Очистка корзины
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Переход к оформлению заказа
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', showCheckoutForm);
    }
    
    // Возврат в корзину
    const backToCartBtn = document.getElementById('back-to-cart');
    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', hideCheckoutForm);
    }
}

// Очистка корзины
async function clearCart() {
    if (!confirm('Вы уверены, что хотите очистить корзину?')) return;
    
    try {
        CartAPI.clearCart();
        await loadCart();
        updateOrderSummary();
        showNotification('Корзина очищена', 'success');
    } catch (error) {
        console.error('Ошибка очистки корзины:', error);
        showNotification('Не удалось очистить корзину', 'error');
    }
}

// Инициализация промокодов
function initPromoCode() {
    const promoInput = document.getElementById('promo-input');
    const applyPromoBtn = document.getElementById('apply-promo');
    const promoSuggestions = document.querySelectorAll('.promo-suggestion');
    
    if (!promoInput || !applyPromoBtn) return;
    
    // Применение промокода
    applyPromoBtn.addEventListener('click', applyPromoCode);
    
    // Применение промокода по Enter
    promoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyPromoCode();
        }
    });
    
    // Подсказки промокодов
    promoSuggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            const code = this.dataset.code;
            promoInput.value = code;
            applyPromoCode();
        });
    });
}

// Применение промокода
async function applyPromoCode() {
    const promoInput = document.getElementById('promo-input');
    const code = promoInput.value.trim();
    
    if (!code) {
        showNotification('Введите промокод', 'error');
        return;
    }
    
    try {
        const subtotal = calculateSubtotal();
        const result = await MockAPI.validatePromoCode(code, subtotal);
        
        if (result.valid) {
            currentPromoCode = result;
            showNotification('Промокод применен!', 'success');
            updateOrderSummary();
        } else {
            showNotification(result.message, 'error');
            currentPromoCode = null;
        }
    } catch (error) {
        console.error('Ошибка проверки промокода:', error);
        showNotification('Не удалось применить промокод', 'error');
        currentPromoCode = null;
    }
}

// Инициализация вариантов доставки
function initDeliveryOptions() {
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    
    deliveryOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'courier') {
                deliveryCost = COURIER_DELIVERY_COST;
            } else {
                deliveryCost = 0;
            }
            
            updateOrderSummary();
        });
    });
}

// Инициализация формы заказа
function initOrderForm() {
    const orderForm = document.getElementById('order-form');
    if (!orderForm) return;
    
    orderForm.addEventListener('submit', submitOrder);
    
    // Валидация телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
}

// Форматирование номера телефона
function formatPhoneNumber(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        value = '+7' + value.substring(1);
    }
    
    // Форматирование: +7 (999) 999-99-99
    let formattedValue = '+7';
    
    if (value.length > 2) {
        formattedValue += ' (' + value.substring(2, 5);
    }
    if (value.length > 5) {
        formattedValue += ') ' + value.substring(5, 8);
    }
    if (value.length > 8) {
        formattedValue += '-' + value.substring(8, 10);
    }
    if (value.length > 10) {
        formattedValue += '-' + value.substring(10, 12);
    }
    
    input.value = formattedValue;
}

// Показать форму оформления заказа
function showCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    const orderSummary = document.getElementById('order-summary');
    
    if (!checkoutForm || !orderSummary) return;
    
    if (cartProducts.length === 0) {
        showNotification('Добавьте товары в корзину', 'error');
        return;
    }
    
    checkoutForm.style.display = 'block';
    orderSummary.style.display = 'none';
    
    // Прокручиваем к форме
    checkoutForm.scrollIntoView({ behavior: 'smooth' });
}

// Скрыть форму оформления заказа
function hideCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    const orderSummary = document.getElementById('order-summary');
    
    if (!checkoutForm || !orderSummary) return;
    
    checkoutForm.style.display = 'none';
    orderSummary.style.display = 'block';
}

// Отправка заказа
async function submitOrder(e) {
    e.preventDefault();
    
    // Получаем данные формы
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        comment: document.getElementById('comment').value,
        delivery: document.querySelector('input[name="delivery"]:checked').value,
        promoCode: currentPromoCode?.code || null,
        items: cartProducts.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price
        })),
        total: calculateTotal(),
        date: new Date().toISOString()
    };
    
    // Валидация
    if (!formData.name || !formData.phone || !formData.email) {
        showNotification('Заполните обязательные поля', 'error');
        return;
    }
    
    try {
        // В реальном приложении здесь была бы отправка на сервер
        // Для демонстрации просто показываем сообщение
        
        const orderNumber = Math.floor(Math.random() * 1000000);
        
        // Показываем подтверждение
        showOrderConfirmation(formData, orderNumber);
        
        // Очищаем корзину
        CartAPI.clearCart();
        
        // Сбрасываем форму
        e.target.reset();
        
        // Возвращаемся к корзине
        hideCheckoutForm();
        
        // Обновляем корзину
        await loadCart();
        
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
        showNotification('Не удалось оформить заказ', 'error');
    }
}

// Показать подтверждение заказа
function showOrderConfirmation(orderData, orderNumber) {
    const modalHTML = `
        <div class="order-confirmation">
            <div class="confirmation-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Заказ оформлен!</h2>
            <p class="order-number">Номер заказа: <strong>#${orderNumber}</strong></p>
            <div class="order-details">
                <p><strong>Имя:</strong> ${orderData.name}</p>
                <p><strong>Телефон:</strong> ${orderData.phone}</p>
                <p><strong>Email:</strong> ${orderData.email}</p>
                <p><strong>Доставка:</strong> ${orderData.delivery === 'courier' ? 'Курьером' : 'Самовывоз'}</p>
                <p><strong>Сумма заказа:</strong> ${orderData.total.toLocaleString('ru-RU')} ₽</p>
            </div>
            <p class="confirmation-message">
                Мы свяжемся с вами в ближайшее время для подтверждения заказа.
            </p>
            <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">
                Понятно
            </button>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = modalHTML;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Закрытие модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
            document.body.style.overflow = '';
        }
    });
}

// Обновление итоговой суммы
function updateOrderSummary() {
    const totalItemsElement = document.getElementById('total-items');
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount-amount');
    const deliveryElement = document.getElementById('delivery-cost');
    const totalElement = document.getElementById('total-price');
    
    if (!totalItemsElement || !subtotalElement || !totalElement) return;
    
    // Подсчет значений
    const totalItems = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const total = calculateTotal();
    
    // Обновление элементов
    totalItemsElement.textContent = `${totalItems} шт.`;
    subtotalElement.textContent = `${subtotal.toLocaleString('ru-RU')} ₽`;
    discountElement.textContent = `-${discount.toLocaleString('ru-RU')} ₽`;
    deliveryElement.textContent = deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost.toLocaleString('ru-RU')} ₽`;
    totalElement.textContent = `${total.toLocaleString('ru-RU')} ₽`;
}

// Подсчет общей суммы
function calculateSubtotal() {
    return cartProducts.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);
}

// Подсчет скидки
function calculateDiscount() {
    // Скидка на товары
    const productDiscount = cartProducts.reduce((sum, item) => {
        const itemDiscount = item.product.oldPrice ? 
            (item.product.oldPrice - item.product.price) * item.quantity : 0;
        return sum + itemDiscount;
    }, 0);
    
    // Скидка по промокоду
    let promoDiscount = 0;
    if (currentPromoCode) {
        if (currentPromoCode.type === 'percent') {
            const subtotal = calculateSubtotal();
            promoDiscount = Math.round(subtotal * currentPromoCode.discount / 100);
        } else {
            promoDiscount = currentPromoCode.discount;
        }
    }
    
    return productDiscount + promoDiscount;
}

// Подсчет итоговой суммы
function calculateTotal() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return Math.max(0, subtotal - discount + deliveryCost);
}

// Показать ошибку
function showError(message) {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    
    cartItems.innerHTML = `
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