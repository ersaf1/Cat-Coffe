import { supabase } from './src/lib/supabase';

  /* ============================================
   CAT CAFFE — Application Logic
   ============================================ */

// ========== MENU DATA ==========
let menuData: MenuItem[] = [];

// ========== FETCH DATA DARI DATABASE ==========
async function fetchMenu() {
  try {
    const { data, error } = await supabase.from('menu_items').select('*');
    if (error) throw error;
    
    menuData = data || [];
    renderMenu();
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    showToast('Failed to load menu from server');
  }
}

// ========== INTERFACES ==========
interface MenuItem {
  id: number;
  name: string;
  desc: string;
  price: number;
  category: string;
  image: string;
  badge: string | null;
}

interface CartItem extends MenuItem {
  qty: number;
}

// ========== STATE ==========
let cart: CartItem[] = [];
let activeCategory: string = 'all';

// ========== DOM ELEMENTS ==========
const menuGrid = document.getElementById('menuGrid') as HTMLElement;
const cartSidebar = document.getElementById('cartSidebar') as HTMLElement;
const cartOverlay = document.getElementById('cartOverlay') as HTMLElement;
const cartItems = document.getElementById('cartItems') as HTMLElement;
const cartEmpty = document.getElementById('cartEmpty') as HTMLElement;
const cartFooter = document.getElementById('cartFooter') as HTMLElement;
const cartTotal = document.getElementById('cartTotal') as HTMLElement;
const cartBadge = document.getElementById('cartBadge') as HTMLElement;
const cartToggle = document.getElementById('cartToggle') as HTMLButtonElement;
const cartClose = document.getElementById('cartClose') as HTMLButtonElement;
const checkoutBtn = document.getElementById('checkoutBtn') as HTMLButtonElement;
const checkoutOverlay = document.getElementById('checkoutOverlay') as HTMLElement;
const checkoutClose = document.getElementById('checkoutClose') as HTMLButtonElement;
const checkoutSummary = document.getElementById('checkoutSummary') as HTMLElement;
const confirmPayment = document.getElementById('confirmPayment') as HTMLButtonElement;
const orderStatusOverlay = document.getElementById('orderStatusOverlay') as HTMLElement;
const orderStatusIcon = document.getElementById('orderStatusIcon') as HTMLElement;
const orderStatusTitle = document.getElementById('orderStatusTitle') as HTMLElement;
const orderStatusText = document.getElementById('orderStatusText') as HTMLElement;
const orderStatusBadge = document.getElementById('orderStatusBadge') as HTMLElement;
const orderStatusLabel = document.getElementById('orderStatusLabel') as HTMLElement;
const orderStatusClose = document.getElementById('orderStatusClose') as HTMLButtonElement;
const toastContainer = document.getElementById('toastContainer') as HTMLElement;
const categoryFilter = document.getElementById('categoryFilter') as HTMLElement;
const navbar = document.getElementById('navbar') as HTMLElement;
const hamburger = document.getElementById('hamburger') as HTMLButtonElement;
const navLinks = document.getElementById('navLinks') as HTMLElement;

// ========== UTILITIES ==========
function formatPrice(price: number) {
  return 'Rp ' + price.toLocaleString('id-ID');
}

// Paw SVG icon
const pawIcon = `<img src="https://img.icons8.com/?size=100&id=9199&format=png&color=000000" alt="cat paw icon" />`;

// ========== RENDER MENU ==========
function renderMenu(category: string = 'all') {
  const filtered = category === 'all'
    ? menuData
    : menuData.filter(item => item.category === category);

  menuGrid.innerHTML = '';

  filtered.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'menu-card reveal';
    card.style.animationDelay = `${index * 0.05}s`;
    card.dataset.category = item.category;

    card.innerHTML = `
      <div class="menu-card-image">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        ${item.badge ? `<span class="menu-card-badge">${item.badge}</span>` : ''}
      </div>
      <div class="menu-card-body">
        <h3 class="menu-card-name">${item.name}</h3>
        <p class="menu-card-desc">${item.desc}</p>
        <div class="menu-card-footer">
          <span class="menu-card-price">${formatPrice(item.price)}</span>
          <button class="menu-card-add-btn" data-id="${item.id}" aria-label="Add ${item.name} to cart">
            ${pawIcon}
            Add
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
    btn.addEventListener('click', (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const id = parseInt(target.dataset.id!);
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
categoryFilter.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('category-btn')) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    target.classList.add('active');
    activeCategory = target.dataset.category!;
    renderMenu(activeCategory);
  }
});

// ========== CART LOGIC ==========
function addToCart(id: number) {
  const item = menuData.find(i => i.id === id);
  if (!item) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  showToast(`${item.name} added to cart`);
}

function removeFromCart(id: number) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function updateQty(id: number, delta: number) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
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
  } else {
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
  if (cart.length === 0) return;
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
confirmPayment.addEventListener('click', async () => {
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

  try {
    const orderTotal = getCartTotal();

    // 1. Insert ke tabel orders
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{ total_amount: orderTotal, status: 'Processing' }])
      .select('id')
      .single();

    if (orderError) throw orderError;
    const orderId = orderData.id;

    // 2. Siapkan data item pesanan
    const orderItems = cart.map(item => ({
      order_id: orderId,
      menu_item_id: item.id,
      quantity: item.qty,
      price: item.price
    }));

    // 3. Insert ke tabel order_items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;
      
    // Sukses order
    console.log('Order sukses:', orderId);
    
    orderStatusIcon.className = 'order-status-icon completed';
    orderStatusIcon.textContent = '✓';
    orderStatusTitle.textContent = 'Order Completed!';
    orderStatusText.textContent = 'Your order is ready. Thank you for choosing Cat Caffe!';
    orderStatusBadge.className = 'order-status-badge completed';
    orderStatusLabel.textContent = 'Completed';
    orderStatusClose.style.display = 'block';

    // Clear cart
    cart = [];
    updateCartUI();

  } catch (error) {
    console.error('Error submitting order to Supabase:', error);
    orderStatusIcon.className = 'order-status-icon processing';
    orderStatusIcon.textContent = '✖';
    orderStatusTitle.textContent = 'Order Failed!';
    orderStatusText.textContent = 'Please try again later.';
    orderStatusClose.style.display = 'block';
  }
});

orderStatusClose.addEventListener('click', () => {
  orderStatusOverlay.classList.remove('open');
  document.body.style.overflow = '';
});

// ========== TOAST NOTIFICATIONS ==========
function showToast(message: string) {
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
  } else {
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
fetchMenu();

// ========== CHECK AUTH ==========
const authLink = document.getElementById('authLink');
if (authLink) {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    authLink.innerHTML = `<a href="#" id="logoutBtn" style="color: var(--accent-caramel);">Hi, ${user.username} (Logout)</a>`;
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('user');
      window.location.reload();
    });
  }
}
