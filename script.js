"use strict";
/* ============================================
 CAT CAFFE — Application Logic
 ============================================ */
Object.defineProperty(exports, "__esModule", { value: true });
// ========== MENU DATA ==========
const menuData = [
    {
        id: 1,
        name: "Caramel Latte",
        desc: "Smooth espresso with creamy caramel and steamed milk",
        price: 32000,
        category: "coffee",
        image: "assets/hero-coffee.png",
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Classic Espresso",
        desc: "Bold and rich double-shot espresso, perfectly extracted",
        price: 22000,
        category: "coffee",
        image: "assets/espresso.png",
        badge: null
    },
    {
        id: 3,
        name: "Cappuccino",
        desc: "Velvety foam over rich espresso with a touch of cocoa",
        price: 28000,
        category: "coffee",
        image: "assets/cappuccino.png",
        badge: null
    },
    {
        id: 4,
        name: "Matcha Latte",
        desc: "Premium Japanese matcha blended with creamy oat milk",
        price: 35000,
        category: "non-coffee",
        image: "assets/matcha-latte.png",
        badge: "Popular"
    },
    {
        id: 5,
        name: "Cold Brew",
        desc: "24-hour steeped cold brew, smooth and refreshing",
        price: 30000,
        category: "coffee",
        image: "assets/cold-brew.png",
        badge: null
    },
    {
        id: 6,
        name: "Café Mocha",
        desc: "Espresso meets rich Belgian chocolate and whipped cream",
        price: 34000,
        category: "coffee",
        image: "assets/mocha.png",
        badge: null
    },
    {
        id: 7,
        name: "Butter Croissant",
        desc: "Flaky, golden croissant baked fresh every morning",
        price: 18000,
        category: "food",
        image: "assets/croissant.png",
        badge: "Fresh"
    },
    {
        id: 8,
        name: "Honey Americano",
        desc: "Classic Americano sweetened with natural wildflower honey",
        price: 26000,
        category: "coffee",
        image: "assets/espresso.png",
        badge: null
    },
    {
        id: 9,
        name: "Vanilla Iced Latte",
        desc: "Chilled latte with Madagascar vanilla bean syrup",
        price: 33000,
        category: "coffee",
        image: "assets/cold-brew.png",
        badge: null
    },
    {
        id: 10,
        name: "Chocolate Croissant",
        desc: "Buttery pastry filled with premium dark chocolate",
        price: 22000,
        category: "food",
        image: "assets/croissant.png",
        badge: null
    },
    {
        id: 11,
        name: "Strawberry Smoothie",
        desc: "Fresh strawberries blended with yogurt and honey",
        price: 30000,
        category: "non-coffee",
        image: "assets/matcha-latte.png",
        badge: null
    },
    {
        id: 12,
        name: "Affogato",
        desc: "Vanilla gelato drowned in a shot of hot espresso",
        price: 36000,
        category: "coffee",
        image: "assets/mocha.png",
        badge: "Chef's Pick"
    }
];
// ========== STATE ==========
let cart = [];
let activeCategory = 'all';
// ========== DOM ELEMENTS ==========
const menuGrid = document.getElementById('menuGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const checkoutClose = document.getElementById('checkoutClose');
const checkoutSummary = document.getElementById('checkoutSummary');
const confirmPayment = document.getElementById('confirmPayment');
const orderStatusOverlay = document.getElementById('orderStatusOverlay');
const orderStatusIcon = document.getElementById('orderStatusIcon');
const orderStatusTitle = document.getElementById('orderStatusTitle');
const orderStatusText = document.getElementById('orderStatusText');
const orderStatusBadge = document.getElementById('orderStatusBadge');
const orderStatusLabel = document.getElementById('orderStatusLabel');
const orderStatusClose = document.getElementById('orderStatusClose');
const toastContainer = document.getElementById('toastContainer');
const categoryFilter = document.getElementById('categoryFilter');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
// ========== UTILITIES ==========
function formatPrice(price) {
    return 'Rp ' + price.toLocaleString('id-ID');
}
// Paw SVG icon
const pawIcon = `<img src="https://img.icons8.com/?size=100&id=9199&format=png&color=000000" alt="cat paw icon" />`;
// ========== RENDER MENU ==========
function renderMenu(category = 'all') {
    const filtered = category === 'all'
        ? menuData
        : menuData.filter(item => item.category === category);
    menuGrid.innerHTML = '';
    filtered.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'bg-[#FAF9F6] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col h-full reveal';
        card.style.animationDelay = `${index * 0.05}s`;
        card.dataset.category = item.category;
        card.innerHTML = `
      <div class="relative w-full h-48 overflow-hidden group">
        <img src="${item.image}" alt="${item.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500">
        ${item.badge ? `<span class="absolute top-3 right-3 bg-[#1A1A1A] text-white text-xs font-bold px-2.5 py-1 rounded-full tracking-wide shadow-md">${item.badge}</span>` : ''}
      </div>
      <div class="p-6 flex flex-col flex-grow">
        <h3 class="font-serif text-xl font-semibold text-[#1A1A1A] mb-2">${item.name}</h3>
        <p class="text-sm text-[#6B6B6B] leading-relaxed flex-grow mb-4">${item.desc}</p>
        <div class="flex items-center justify-between mt-auto">
          <span class="font-semibold text-lg text-[#1A1A1A]">${formatPrice(item.price)}</span>
          <button class="menu-card-add-btn bg-[#1A1A1A] text-white p-2.5 rounded-full hover:bg-[#C8A27C] hover:scale-105 transition-all duration-300 shadow-md group" data-id="${item.id}" aria-label="Add ${item.name} to cart" title="Add to cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>
    `;
        menuGrid.appendChild(card);
        // Trigger reveal animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                card.classList.add('visible');
            });
        });
    });
    // Attach click handlers to add buttons
    document.querySelectorAll('.menu-card-add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget;
            const id = parseInt(target.dataset.id);
            addToCart(id);
            // Button feedback animation
            const button = target;
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });
}
// ========== CATEGORY FILTER ==========
categoryFilter.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('category-btn')) {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        activeCategory = target.dataset.category;
        renderMenu(activeCategory);
    }
});
// ========== CART LOGIC ==========
function addToCart(id) {
    const item = menuData.find(i => i.id === id);
    if (!item)
        return;
    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty += 1;
    }
    else {
        cart.push({ ...item, qty: 1 });
    }
    updateCartUI();
    showToast(`${item.name} added to cart`);
}
function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    updateCartUI();
}
function updateQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item)
        return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id);
        return;
    }
    updateCartUI();
}

// Expose these to window so that the inline onclick handlers in updateCartUI work
Object.assign(window, { updateQty, removeFromCart });

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}
function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}
function updateCartUI() {
    const count = getCartCount();
    // Badge
    cartBadge.textContent = count.toString();
    if (count > 0) {
        cartBadge.classList.add('show');
    }
    else {
        cartBadge.classList.remove('show');
    }
    // Cart items
    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartFooter.style.display = 'none';
        cartItems.innerHTML = '';
        cartItems.appendChild(cartEmpty);
        return;
    }
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';
    cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-qty-btn" onclick="updateQty(${item.id}, -1)" aria-label="Decrease quantity">−</button>
        <span class="cart-item-qty">${item.qty}</span>
        <button class="cart-qty-btn" onclick="updateQty(${item.id}, 1)" aria-label="Increase quantity">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove item">✕</button>
    </div>
  `).join('');
    cartTotal.textContent = formatPrice(getCartTotal());
}
// ========== CART SIDEBAR TOGGLE ==========
function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}
cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
// ========== CHECKOUT ==========
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0)
        return;
    closeCart();
    // Build summary
    let summaryHTML = cart.map(item => `
    <div class="checkout-summary-item">
      <span>${item.name} × ${item.qty}</span>
      <span>${formatPrice(item.price * item.qty)}</span>
    </div>
  `).join('');
    summaryHTML += `
    <div class="checkout-summary-total">
      <span>Total</span>
      <span>${formatPrice(getCartTotal())}</span>
    </div>
  `;
    checkoutSummary.innerHTML = summaryHTML;
    checkoutOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
});
checkoutClose.addEventListener('click', () => {
    checkoutOverlay.classList.remove('open');
    document.body.style.overflow = '';
});
checkoutOverlay.addEventListener('click', (e) => {
    if (e.target === checkoutOverlay) {
        checkoutOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }
});
// ========== CONFIRM PAYMENT ==========
confirmPayment.addEventListener('click', () => {
    checkoutOverlay.classList.remove('open');
    // Show processing
    orderStatusIcon.className = 'order-status-icon processing';
    orderStatusIcon.textContent = '⏳';
    orderStatusTitle.textContent = 'Processing Your Order';
    orderStatusText.textContent = 'Please wait while we prepare your order...';
    orderStatusBadge.className = 'order-status-badge processing';
    orderStatusLabel.textContent = 'Processing';
    orderStatusClose.style.display = 'none';
    orderStatusOverlay.classList.add('open');
    // Simulate processing
    setTimeout(() => {
        orderStatusIcon.className = 'order-status-icon completed';
        orderStatusIcon.textContent = '✓';
        orderStatusTitle.textContent = 'Order Completed!';
        orderStatusText.textContent = 'Your order is ready. Thank you for choosing Cat Caffe!';
        orderStatusBadge.className = 'order-status-badge completed';
        orderStatusLabel.textContent = 'Completed';
        orderStatusClose.style.display = 'inline-flex';
        // Clear cart
        cart = [];
        updateCartUI();
    }, 3000);
});
orderStatusClose.addEventListener('click', () => {
    orderStatusOverlay.classList.remove('open');
    document.body.style.overflow = '';
});
// ========== TOAST NOTIFICATIONS ==========
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">🐾</span> ${message}`;
    toastContainer.appendChild(toast);
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}
// ========== NAVBAR SCROLL EFFECT ==========
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }
    else {
        navbar.classList.remove('scrolled');
    }
});
// ========== HAMBURGER MENU ==========
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});
// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});
// ========== SCROLL REVEAL ==========
function handleReveal() {
    const reveals = document.querySelectorAll('.reveal:not(.visible)');
    reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
            el.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', handleReveal);
window.addEventListener('load', handleReveal);
// ========== KEYBOARD SUPPORT ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
        checkoutOverlay.classList.remove('open');
        orderStatusOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }
});
// ========== INIT ==========
renderMenu();
//# sourceMappingURL=script.js.map