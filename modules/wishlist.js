// modules/wishlist.js
import { state } from './state.js';
import { getProductImage, getWholesalePrice, formatPrice } from './utils.js';
import { showToast } from './ui.js';
import { addToCart } from './cart.js';
import { renderProductGrid } from './catalog.js';

export function toggleWishlist(productId, event) {
  if (event) event.stopPropagation();
  const product = window.PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const index = state.wishlist.indexOf(productId);
  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast(product.name + ' dihapus dari wishlist', 'success');
  } else {
    state.wishlist.push(productId);
    showToast(product.name + ' ditambahkan ke wishlist', 'success');
  }
  saveToStorage();
  updateWishlistUI();
  renderProductGrid();
}

export function renderWishlistSidebarContent() {
  const container = document.getElementById('wishlistItems');
  if (!container) return;
  if (state.wishlist.length === 0) {
    container.innerHTML = `<div class="text-center py-10"><i class="far fa-heart text-5xl text-muted/30 mb-3"></i><p class="text-secondary text-sm">Wishlist Anda kosong</p><button onclick="window.closeWishlist(); document.getElementById('katalog').scrollIntoView({behavior:'smooth'})" class="mt-3 px-5 py-2 bg-gradient-to-r from-gold to-gold-light text-white font-semibold rounded-lg text-sm">Jelajahi Produk</button></div>`;
  } else {
    container.innerHTML = state.wishlist.map(id => {
      const product = window.PRODUCTS.find(p => p.id === id);
      if (!product) return '';
      return `<div class="flex gap-3 mb-3 p-3 bg-surface rounded-lg">
        <img src="${getProductImage(product)}" alt="${product.name}" class="w-16 h-16 object-cover rounded-lg">
        <div class="flex-1">
          <h4 class="font-semibold text-primary text-sm mb-1">${product.name}</h4>
          <p class="text-gold font-bold font-mono text-sm mb-2">Rp ${formatPrice(getWholesalePrice(product))}</p>
          <div class="flex gap-2">
            <button onclick="window.addToCart('${product.id}'); window.closeWishlist();" class="flex-1 py-1.5 bg-gradient-to-r from-gold to-gold-light text-white text-xs font-semibold rounded-md"><i class="fas fa-shopping-cart mr-1"></i>Tambah</button>
            <button onclick="window.toggleWishlist('${product.id}')" class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-md"><i class="fas fa-trash text-xs"></i></button>
          </div>
        </div>
      </div>`;
    }).filter(Boolean).join('');
  }
}

export function updateWishlistUI() {
  const count = state.wishlist.length;
  ['wishlistBadge', 'mobileWishlistBadge', 'mobileBottomWishlistBadge'].forEach(id => {
    const badge = document.getElementById(id);
    if (badge) {
      if (count > 0) { badge.classList.remove('hidden'); badge.textContent = count; }
      else badge.classList.add('hidden');
    }
  });
  const sidebar = document.getElementById('wishlistSidebar');
  if (sidebar && !sidebar.classList.contains('hidden')) renderWishlistSidebarContent();
}

export function openWishlist() {
  const sidebar = document.getElementById('wishlistSidebar');
  const content = document.getElementById('wishlistContent');
  if (!sidebar || !content) return;
  renderWishlistSidebarContent();
  sidebar.classList.remove('hidden');
  setTimeout(() => content.classList.remove('translate-x-full'), 10);
}

export function closeWishlist() {
  const sidebar = document.getElementById('wishlistSidebar');
  const content = document.getElementById('wishlistContent');
  if (!sidebar || !content) return;
  content.classList.add('translate-x-full');
  setTimeout(() => sidebar.classList.add('hidden'), 300);
}

function saveToStorage() {
  try { localStorage.setItem('r2_wishlist', JSON.stringify(state.wishlist)); } catch (e) {}
}

export function loadWishlistFromStorage() {
  try {
    const saved = localStorage.getItem('r2_wishlist');
    if (saved) state.wishlist = JSON.parse(saved);
  } catch (e) {}
    }
