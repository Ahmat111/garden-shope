// Мок данные для садового инвентаря с улучшенной структурой
const gardenProducts = [
    // Режущий инструмент
    {
        id: 1,
        name: "Секатор профессиональный Fiskars",
        category: "cutting",
        type: "secateurs",
        price: 1990,
        oldPrice: 2490,
        description: "Профессиональный секатор для точной обрезки ветвей до 25 мм. Эргономичные ручки из армированного пластика, лезвия из нержавеющей стали с тефлоновым покрытием.",
        image: "https://avatars.mds.yandex.net/i?id=87d86da69a2022625f0d7e75e93e55dbcb34410e-4576161-images-thumbs&n=13",
        images: [
            "https://avatars.mds.yandex.net/i?id=87d86da69a2022625f0d7e75e93e55dbcb34410e-4576161-images-thumbs&n=13",
            "https://avatars.mds.yandex.net/i?id=87d86da69a2022625f0d7e75e93e55dbcb34410e-4576161-images-thumbs&n=13"
        ],
        inStock: true,
        stockCount: 15,
        discount: 20,
        featured: true,
        new: false,
        rating: 4.8,
        reviews: 42,
        brand: "Fiskars",
        specifications: {
            material: "Нержавеющая сталь",
            weight: "350г",
            warranty: "2 года"
        }
    },
    {
        id: 2,
        name: "Сучкорез телескопический Gardena",
        category: "cutting",
        type: "pruners",
        price: 3490,
        oldPrice: 4290,
        description: "Телескопические ручки до 2.4м. Для безопасной обрезки высоких ветвей. Механизм усиления реза, противоскользящие рукоятки.",
        image: "https://avatars.mds.yandex.net/i?id=c36a50d2b0279307195ba522820865c39a84dc76-5735191-images-thumbs&n=13",
        images: [
            "https://avatars.mds.yandex.net/i?id=c36a50d2b0279307195ba522820865c39a84dc76-5735191-images-thumbs&n=13"
        ],
        inStock: true,
        stockCount: 8,
        discount: 18,
        featured: true,
        new: true,
        rating: 4.6,
        reviews: 28,
        brand: "Gardena",
        specifications: {
            material: "Алюминий/сталь",
            maxLength: "2.4м",
            warranty: "3 года"
        }
    },
    {
        id: 3,
        name: "Садовые ножницы для живой изгороди",
        category: "cutting",
        type: "shears",
        price: 2890,
        oldPrice: 3590,
        description: "Мощные ножницы для стрижки кустов и живой изгороди. Длина лезвия 25см, зубчатая режущая кромка для лучшего захвата.",
        image: "https://avatars.mds.yandex.net/i?id=e12e6e5f6613036a956cdff07481434a80597757-7947652-images-thumbs&n=13",
        images: [
            "https://avatars.mds.yandex.net/i?id=e12e6e5f6613036a956cdff07481434a80597757-7947652-images-thumbs&n=13"
        ],
        inStock: true,
        stockCount: 12,
        discount: 20,
        featured: false,
        new: false,
        rating: 4.5,
        reviews: 35,
        brand: "Wolf-Garten",
        specifications: {
            material: "Сталь/пластик",
            bladeLength: "25см",
            warranty: "2 года"
        }
    },
    
    // Земляные работы
    {
        id: 4,
        name: "Штыковая лопата из нержавеющей стали",
        category: "digging",
        type: "shovels",
        price: 1890,
        oldPrice: 2390,
        description: "Лопата с усиленным черенком из ясеня и нержавеющим лезвием. Для любых земляных работ, устойчива к коррозии.",
        image: "https://avatars.mds.yandex.net/i?id=313f44fd170a118815790027620e2dec8a2bd33e-4488147-images-thumbs&n=13",
        images: [
            "https://avatars.mds.yandex.net/i?id=313f44fd170a118815790027620e2dec8a2bd33e-4488147-images-thumbs&n=13",
            "https://avatars.mds.yandex.net/i?id=313f44fd170a118815790027620e2dec8a2bd33e-4488147-images-thumbs&n=13"
        ],
        inStock: true,
        stockCount: 20,
        discount: 21,
        featured: true,
        new: false,
        rating: 4.7,
        reviews: 56,
        brand: "Fiskars",
        specifications: {
            material: "Нержавеющая сталь/ясень",
            weight: "1.8кг",
            warranty: "5 лет"
        }
    },
    {
        id: 5,
        name: "Садовая мотыга 3 в 1",
        category: "digging",
        type: "hoes",
        price: 1250,
        oldPrice: 1590,
        description: "Универсальная мотыга для прополки, рыхления и окучивания. Регулируемый угол наклона, эргономичная ручка.",
        image: "https://avatars.mds.yandex.net/i?id=3d58f31c7c25efd4f696ca8cdd24e85e8a526516-5433135-images-thumbs&n=13",
        images: [
            "https://avatars.mds.yandex.net/i?id=3d58f31c7c25efd4f696ca8cdd24e85e8a526516-5433135-images-thumbs&n=13"
        ],
        inStock: true,
        stockCount: 18,
        discount: 21,
        featured: false,
        new: true,
        rating: 4.4,
        reviews: 24,
        brand: "Gardena",
        specifications: {
            material: "Сталь/дерево",
            width: "15см",
            warranty: "2 года"
        }
    },
    {
        id: 6,
        name: "Вил садовый с зубьями из стали",
        category: "digging",
        type: "forks",
        price: 2190,
        oldPrice: 2790,
        description: "4 закаленных зубья для перекопки тяжелых почв. Усиленная конструкция, противоскользящая рукоятка.",
        image: "https://avatars.mds.yandex.net/i?id=cb40640ce11714b3e58330c5092ed2f438df08b8-5284135-images-thumbs&n=13",
        images: [
            "https://avatars.mds.yandex.net/i?id=cb40640ce11714b3e58330c5092ed2f438df08b8-5284135-images-thumbs&n=13"
        ],
        inStock: true,
        stockCount: 10,
        discount: 21,
        featured: true,
        new: false,
        rating: 4.6,
        reviews: 31,
        brand: "Fiskars",
        specifications: {
            material: "Закаленная сталь",
            teeth: "4",
            warranty: "3 года"
        }
    },
    
    // Полив
    {
        id: 7,
        name: "Поливочный шланг 50м усиленный",
        category: "watering",
        type: "hoses",
        price: 2890,
        oldPrice: 3890,
        description: "Армированный шланг с защитой от перегибов. Комплект с распылителем и 5 насадками. Давление до 10 бар.",
        image: "https://avatars.mds.yandex.net/i?id=bba6105e23f193480f19ac72a7c409d58fab20e4-4987768-images-thumbs&n=13",
        images: [
            "https://avatars.mds.yandex.net/i?id=bba6105e23f193480f19ac72a7c409d58fab20e4-4987768-images-thumbs&n=13"
        ],
        inStock: true,
        stockCount: 25,
        discount: 26,
        featured: true,
        new: false,
        rating: 4.8,
        reviews: 67,
        brand: "Gardena",
        specifications: {
            length: "50м",
            diameter: "1/2\"",
            warranty: "5 лет"
        }
    },
    {
        id: 8,
        name: "Лейка садовая 10л с ситечком",
        category: "watering",
        type: "watering-cans",
        price: 890,
        oldPrice: 1190,
        description: "Пластиковая лейка для бережного полива рассады и цветов. Съемное ситечко, удобная ручка.",
        image: "https://avatars.mds.yandex.net/i?id=8da6e423d6b58381d6d1a33e72c3076841be890f-16607573-images-thumbs&n=13",
        images: [
            "https://avatars.mds.yandex.net/i?id=8da6e423d6b58381d6d1a33e72c3076841be890f-16607573-images-thumbs&n=13"
        ],
        inStock: true,
        stockCount: 30,
        discount: 25,
        featured: false,
        new: true,
        rating: 4.7,
        reviews: 42,
        brand: "Огородник",
        specifications: {
            volume: "10л",
            material: "Пластик",
            warranty: "1 год"
        }
    },
    
    // Хранение
    {
        id: 9,
        name: "Корзина для ягод и овощей 5л",
        category: "storage",
        type: "baskets",
        price: 450,
        oldPrice: 590,
        description: "Пластиковая корзина с перфорацией для вентиляции. Рукоятка для удобного переноса, складная конструкция.",
        image: "https://avatars.mds.yandex.net/i?id=06329602e9da1815f924a1cf02cd8f85c29863aa43e17069-11959565-images-thumbs&n=13",
        images: [
            "https://avatars.mds.yandex.net/i?id=06329602e9da1815f924a1cf02cd8f85c29863aa43e17069-11959565-images-thumbs&n=13"
        ],
        inStock: true,
        stockCount: 50,
        discount: 24,
        featured: true,
        new: false,
        rating: 4.7,
        reviews: 89,
        brand: "Огородник",
        specifications: {
            volume: "5л",
            material: "Пластик",
            warranty: "1 год"
        }
    },
    {
        id: 10,
        name: "Садовая тачка 100л",
        category: "storage",
        type: "wheelbarrows",
        price: 5490,
        oldPrice: 6890,
        description: "Металлическая тачка с грузоподъемностью 150кг. Пневматическое колесо, усиленная рама.",
        image: "https://avatars.mds.yandex.net/i?id=74eb0d3950a8df5d34fe70b5a5c5e24f69f2a798-4080492-images-thumbs&n=13",
        images: [
            "https://avatars.mds.yandex.net/i?id=74eb0d3950a8df5d34fe70b5a5c5e24f69f2a798-4080492-images-thumbs&n=13"
        ],
        inStock: true,
        stockCount: 5,
        discount: 20,
        featured: false,
        new: true,
        rating: 4.9,
        reviews: 38,
        brand: "Калибр",
        specifications: {
            volume: "100л",
            weight: "15кг",
            warranty: "2 года"
        }
    }
];

// Категории
const categories = [
    { 
        id: 1, 
        name: "cutting", 
        title: "Режущий инструмент", 
        icon: "fas fa-cut",
        description: "Секаторы, сучкорезы, садовые ножницы"
    },
    { 
        id: 2, 
        name: "digging", 
        title: "Земляные работы", 
        icon: "fas fa-shovel",
        description: "Лопаты, вилы, грабли, мотыги"
    },
    { 
        id: 3, 
        name: "watering", 
        title: "Полив", 
        icon: "fas fa-tint",
        description: "Шланги, лейки, системы полива"
    },
    { 
        id: 4, 
        name: "storage", 
        title: "Хранение урожая", 
        icon: "fas fa-box",
        description: "Корзины, тачки, ящики"
    }
];

// Бренды
const brands = [
    { id: 1, name: "Fiskars", logo: "images/brands/fiskars.png" },
    { id: 2, name: "Gardena", logo: "images/brands/gardena.png" },
    { id: 3, name: "Wolf-Garten", logo: "images/brands/wolf-garten.png" },
    { id: 4, name: "Bosch", logo: "images/brands/bosch.png" }
];

// Промокоды
const promoCodes = [
    { code: "SPRING2024", discount: 10, type: "percent", minOrder: 1000 },
    { code: "FIRSTORDER", discount: 5, type: "percent", minOrder: 500 },
    { code: "GARDEN10", discount: 10, type: "percent", minOrder: 2000 },
    { code: "FREE300", discount: 300, type: "fixed", minOrder: 3000 }
];

// Имитация API с улучшенными функциями
class MockAPI {
    // Получить все продукты
    static async getProducts(filters = {}) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredProducts = [...gardenProducts];
                
                // Фильтрация по категории
                if (filters.category && filters.category !== 'all') {
                    filteredProducts = filteredProducts.filter(p => p.category === filters.category);
                }
                
                // Фильтрация по типу
                if (filters.type) {
                    filteredProducts = filteredProducts.filter(p => p.type === filters.type);
                }
                
                // Фильтрация по бренду
                if (filters.brand) {
                    filteredProducts = filteredProducts.filter(p => p.brand === filters.brand);
                }
                
                // Фильтрация по наличию
                if (filters.inStock) {
                    filteredProducts = filteredProducts.filter(p => p.inStock);
                }
                
                // Фильтрация по скидке
                if (filters.discount) {
                    filteredProducts = filteredProducts.filter(p => p.discount > 0);
                }
                
                // Фильтрация по новинкам
                if (filters.new) {
                    filteredProducts = filteredProducts.filter(p => p.new);
                }
                
                // Фильтрация по цене
                if (filters.minPrice || filters.maxPrice) {
                    const min = filters.minPrice || 0;
                    const max = filters.maxPrice || Infinity;
                    filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
                }
                
                resolve(filteredProducts);
            }, 300);
        });
    }
    
    // Получить популярные товары
    static async getFeaturedProducts(limit = 6) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const featured = gardenProducts
                    .filter(p => p.featured)
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, limit);
                resolve(featured);
            }, 200);
        });
    }
    
    // Получить товары со скидкой
    static async getDiscountProducts(limit = 8) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const discounted = gardenProducts
                    .filter(p => p.discount > 0)
                    .sort((a, b) => b.discount - a.discount)
                    .slice(0, limit);
                resolve(discounted);
            }, 200);
        });
    }
    
    // Получить новинки
    static async getNewProducts(limit = 4) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newProducts = gardenProducts
                    .filter(p => p.new)
                    .slice(0, limit);
                resolve(newProducts);
            }, 200);
        });
    }
    
    // Получить категории
    static async getCategories() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(categories);
            }, 100);
        });
    }
    
    // Получить бренды
    static async getBrands() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(brands);
            }, 100);
        });
    }
    
    // Получить товар по ID
    static async getProduct(id) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const product = gardenProducts.find(p => p.id === parseInt(id));
                resolve(product);
            }, 200);
        });
    }
    
    // Поиск товаров
    static async searchProducts(query) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = gardenProducts.filter(product => 
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.description.toLowerCase().includes(query.toLowerCase()) ||
                    product.brand.toLowerCase().includes(query.toLowerCase()) ||
                    product.category.toLowerCase().includes(query.toLowerCase())
                );
                resolve(results);
            }, 300);
        });
    }
    
    // Получить связанные товары
    static async getRelatedProducts(productId, limit = 4) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const product = gardenProducts.find(p => p.id === productId);
                if (!product) {
                    resolve([]);
                    return;
                }
                
                const related = gardenProducts
                    .filter(p => p.id !== productId && p.category === product.category)
                    .slice(0, limit);
                
                resolve(related);
            }, 200);
        });
    }
    
    // Проверить промокод
    static async validatePromoCode(code, orderTotal) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const promo = promoCodes.find(p => p.code === code.toUpperCase());
                
                if (!promo) {
                    resolve({ valid: false, message: "Промокод не найден" });
                    return;
                }
                
                if (orderTotal < promo.minOrder) {
                    resolve({ 
                        valid: false, 
                        message: `Минимальная сумма заказа для промокода: ${promo.minOrder} ₽` 
                    });
                    return;
                }
                
                let discount = 0;
                if (promo.type === 'percent') {
                    discount = Math.round(orderTotal * promo.discount / 100);
                } else {
                    discount = promo.discount;
                }
                
                resolve({
                    valid: true,
                    discount: discount,
                    type: promo.type,
                    code: promo.code
                });
            }, 300);
        });
    }
}

// Корзина в localStorage
class CartAPI {
    static getCart() {
        const cart = localStorage.getItem('gardenCart');
        return cart ? JSON.parse(cart) : [];
    }

    static saveCart(cart) {
        localStorage.setItem('gardenCart', JSON.stringify(cart));
        this.updateCartCounter();
        this.dispatchCartUpdate();
    }

    static addToCart(productId, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ 
                productId, 
                quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart(cart);
        return cart;
    }

    static removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.productId !== productId);
        this.saveCart(cart);
        return cart;
    }

    static updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.productId === productId);
        
        if (item) {
            if (quantity <= 0) {
                return this.removeFromCart(productId);
            }
            item.quantity = quantity;
            item.updatedAt = new Date().toISOString();
        }
        
        this.saveCart(cart);
        return cart;
    }

    static clearCart() {
        localStorage.removeItem('gardenCart');
        this.updateCartCounter();
        this.dispatchCartUpdate();
        return [];
    }

    static getCartCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    static async getCartWithProducts() {
        const cart = this.getCart();
        const cartWithProducts = [];
        
        for (const item of cart) {
            const product = await MockAPI.getProduct(item.productId);
            if (product) {
                cartWithProducts.push({
                    ...item,
                    product
                });
            }
        }
        
        // Сортируем по дате добавления (новые сверху)
        return cartWithProducts.sort((a, b) => 
            new Date(b.addedAt) - new Date(a.addedAt)
        );
    }

    static getCartTotal(cartWithProducts) {
        return cartWithProducts.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    static getCartDiscount(cartWithProducts) {
        return cartWithProducts.reduce((total, item) => {
            const discount = item.product.oldPrice ? 
                (item.product.oldPrice - item.product.price) * item.quantity : 0;
            return total + discount;
        }, 0);
    }

    static updateCartCounter() {
        const counters = document.querySelectorAll('.cart-counter');
        const count = this.getCartCount();
        
        counters.forEach(counter => {
            counter.textContent = count;
            counter.style.display = count > 0 ? 'flex' : 'none';
        });
        
        // Обновляем общую сумму в хедере
        const cartTotals = document.querySelectorAll('.cart-total');
        if (cartTotals.length > 0) {
            this.updateCartTotal();
        }
    }

    static async updateCartTotal() {
        const cartWithProducts = await this.getCartWithProducts();
        const total = this.getCartTotal(cartWithProducts);
        
        const cartTotals = document.querySelectorAll('.cart-total');
        cartTotals.forEach(totalElement => {
            totalElement.textContent = `${total.toLocaleString('ru-RU')} ₽`;
        });
    }

    static dispatchCartUpdate() {
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
}

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    CartAPI.updateCartCounter();
});

// Обработчик обновления корзины
window.addEventListener('cartUpdated', () => {
    CartAPI.updateCartCounter();
});