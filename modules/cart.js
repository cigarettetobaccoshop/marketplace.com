// modules/cart.js
import { state, getState, setState } from './state.js';
import { formatPrice, getWholesalePrice, getProductImage } from './utils.js';
import { showToast } from './ui.js';
import { renderCartSidebarContent } from './catalog.js';

export function addToCart(productId, quantity = 1) {
  const product = window.PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = state.cart.find(item => item.id === productId);
  if (existing) existing.quantity += quantity;
  else state.cart.push({ id: productId, name: product.name, price: getWholesalePrice(product), image: getProductImage(product), quantity });
  saveToStorage();
  updateCartUI();
  showToast(product.name + ' ditambahkan ke keranjang', 'success');
}

export function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  saveToStorage();
  updateCartUI();
}

export function updateCartQuantity(productId, quantity) {
  const item = state.cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveToStorage();
    updateCartUI();
  }
}

export function renderCartSidebarContent() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!container) return;
  if (state.cart.length === 0) {
    container.innerHTML = `<div class="text-center py-10"><i class="fas fa-shopping-cart text-5xl text-muted/30 mb-3"></i><p class="text-secondary text-sm">Keranjang Anda kosong</p><button onclick="window.closeCart(); document.getElementById('katalog').scrollIntoView({behavior:'smooth'})" class="mt-3 px-5 py-2 bg-gradient-to-r from-gold to-gold-light text-white font-semibold rounded-lg text-sm">Belanja Sekarang</button></div>`;
  } else {
    container.innerHTML = state.cart.map(item => `
      <div class="flex gap-3 mb-3 p-3 bg-surface rounded-lg">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
        <div class="flex-1">
          <h4 class="font-semibold text-primary text-sm mb-1">${item.name}</h4>
          <p class="text-gold font-bold font-mono text-sm mb-2">Rp ${formatPrice(item.price)}</p>
          <div class="flex items-center gap-2">
            <button onclick="window.updateCartQuantity('${item.id}', ${item.quantity - 1})" class="w-7 h-7 rounded-md bg-white border border-border hover:bg-gray-100 flex items-center justify-center"><i class="fas fa-minus text-[10px]"></i></button>
            <span class="w-8 text-center text-xs font-bold font-mono">${item.quantity}</span>
            <button onclick="window.updateCartQuantity('${item.id}', ${item.quantity + 1})" class="w-7 h-7 rounded-md bg-white border border-border hover:bg-gray-100 flex items-center justify-center"><i class="fas fa-plus text-[10px]"></i></button>
            <button onclick="window.removeFromCart('${item.id}')" class="ml-auto text-red-500 hover:text-red-600"><i class="fas fa-trash text-xs"></i></button>
          </div>
        </div>
      </div>
    `).join('');
  }
  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (totalEl) totalEl.textContent = 'Rp ' + formatPrice(total);
}

export function updateCartUI() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  ['cartBadge', 'mobileCartBadge', 'mobileBottomCartBadge'].forEach(id => {
    const badge = document.getElementById(id);
    if (badge) {
      if (totalItems > 0) { badge.classList.remove('hidden'); badge.textContent = totalItems; }
      else badge.classList.add('hidden');
    }
  });
  const sidebar = document.getElementById('cartSidebar');
  if (sidebar && !sidebar.classList.contains('hidden')) renderCartSidebarContent();
}

export function openCart() {
  const sidebar = document.getElementById('cartSidebar');
  const content = document.getElementById('cartContent');
  if (!sidebar || !content) return;
  renderCartSidebarContent();
  sidebar.classList.remove('hidden');
  setTimeout(() => content.classList.remove('translate-x-full'), 10);
}

export function closeCart() {
  const sidebar = document.getElementById('cartSidebar');
  const content = document.getElementById('cartContent');
  if (!sidebar || !content) return;
  content.classList.add('translate-x-full');
  setTimeout(() => sidebar.classList.add('hidden'), 300);
}

function saveToStorage() {
  try {
    localStorage.setItem('r2_cart', JSON.stringify(state.cart));
  } catch (e) { console.error(e); }
}

export function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('r2_cart');
    if (saved) state.cart = JSON.parse(saved);
  } catch (e) { console.error(e); }
}
