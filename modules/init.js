// modules/init.js
import { state, setState } from './state.js';
import { setProducts } from './catalog.js';
import { loadCartFromStorage } from './cart.js';
import { loadWishlistFromStorage } from './wishlist.js';
import { renderProductGrid, renderEditorsPick, initTestimonialSlider } from './catalog.js';
import { initSearch, selectSearchResult } from './search.js';
import { initCheckoutForm } from './checkout.js';
import { initCookieBanner, initBackToTop, initFAQ, initNewsletter, initReviewForm } from './ui.js';
import { initFilters } from './filters.js'; // kita akan buat juga

export function initApp() {
  // Set products
  setProducts(window.PRODUCTS);
  // Load from storage
  loadCartFromStorage();
  loadWishlistFromStorage();
  // Init components
  initFilters();
  initSearch();
  renderProductGrid();
  renderEditorsPick();
  initTestimonialSlider();
  initFAQ();
  initBackToTop();
  initNewsletter();
  initCookieBanner();
  initReviewForm();
  initCheckoutForm();
  // Mobile nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      if (this.tagName === 'A') this.classList.add('active');
    });
  });
  // Header scroll
  const header = document.getElementById('mainHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    });
  }
  // Cart & Wishlist buttons
  document.getElementById('cartBtn')?.addEventListener('click', () => import('./cart.js').then(m => m.openCart()));
  document.getElementById('wishlistBtn')?.addEventListener('click', () => import('./wishlist.js').then(m => m.openWishlist()));
  document.getElementById('mobileBottomCart')?.addEventListener('click', (e) => { e.preventDefault(); import('./cart.js').then(m => m.openCart()); });
  document.getElementById('mobileBottomWishlist')?.addEventListener('click', (e) => { e.preventDefault(); import('./wishlist.js').then(m => m.openWishlist()); });
  // Hide loading
  setTimeout(() => {
    document.getElementById('loadingScreen')?.classList.add('hidden');
  }, 1200);
  // Check deep link
  checkDeepLink();
  // Service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(console.error);
  }
  console.log('✅ R2 Nusantara initialized!');
}

function checkDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const pid = params.get('p');
  if (pid) {
    setTimeout(() => {
      import('./catalog.js').then(m => m.openQuickView(pid));
    }, 900);
  }
}

// Filters
function initFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  if (categoryFilter) categoryFilter.addEventListener('change', function(e) {
    state.filter.category = e.target.value;
    state.currentPage = 1;
    renderProductGrid();
    // update tombol kategori
    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.classList.remove('bg-gold', 'text-white', 'border-gold', 'shadow-md');
      btn.classList.add('bg-white', 'text-primary', 'border-border', 'shadow-sm');
    });
    const activeId = e.target.value === '' ? 'btnCatAll' : (e.target.value === 'R2' ? 'btnCatR2' : 'btnCatResmi');
    const activeBtn = document.getElementById(activeId);
    if (activeBtn) {
      activeBtn.classList.remove('bg-white', 'text-primary', 'border-border', 'shadow-sm');
      activeBtn.classList.add('bg-gold', 'text-white', 'border-gold', 'shadow-md');
    }
  });
  if (sortFilter) sortFilter.addEventListener('change', function(e) {
    state.filter.sort = e.target.value;
    renderProductGrid();
  });
    }
