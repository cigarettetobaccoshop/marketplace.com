// app.js - Entry point R2 Nusantara v8.0
import { initApp } from './modules/init.js';

// Ekspos beberapa fungsi ke window agar bisa dipanggil dari HTML (onclick)
import { filterByCategory, resetFilters } from './modules/catalog.js';
import { openQuickView, closeQuickView, shareProduct } from './modules/catalog.js';
import { addToCart, removeFromCart, updateCartQuantity, openCart, closeCart } from './modules/cart.js';
import { toggleWishlist, openWishlist, closeWishlist } from './modules/wishlist.js';
import { openCheckout, closeCheckout } from './modules/checkout.js';
import { openReviewModal, closeReviewModal, acceptCookies, rejectCookies, openLegalModal, closeLegalModal, showToast } from './modules/ui.js';

window.filterByCategory = filterByCategory;
window.resetFilters = resetFilters;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.shareProduct = shareProduct;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.openCart = openCart;
window.closeCart = closeCart;
window.toggleWishlist = toggleWishlist;
window.openWishlist = openWishlist;
window.closeWishlist = closeWishlist;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.openReviewModal = openReviewModal;
window.closeReviewModal = closeReviewModal;
window.acceptCookies = acceptCookies;
window.rejectCookies = rejectCookies;
window.openLegalModal = openLegalModal;
window.closeLegalModal = closeLegalModal;
window.showToast = showToast;

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});