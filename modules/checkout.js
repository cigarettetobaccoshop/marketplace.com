// modules/checkout.js
import { state } from './state.js';
import { formatPrice, getCleanWaNumber } from './utils.js';
import { showToast } from './ui.js';
import { closeCart } from './cart.js';

export function openCheckout() {
  closeCart();
  const modal = document.getElementById('checkoutModal');
  const itemsContainer = document.getElementById('checkoutItems');
  const totalEl = document.getElementById('checkoutTotal');
  if (!modal || !itemsContainer) return;
  if (state.cart.length === 0) { showToast('Keranjang kosong!', 'warning'); return; }
  itemsContainer.innerHTML = state.cart.map(item => `
    <div class="flex justify-between items-center py-2 border-b border-border">
      <div><p class="font-semibold text-primary text-sm">${item.name}</p><p class="text-xs text-secondary">Qty: ${item.quantity}</p></div>
      <span class="text-gold font-bold font-mono text-sm">Rp ${formatPrice(item.price * item.quantity)}</span>
    </div>
  `).join('');
  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (totalEl) totalEl.textContent = 'Rp ' + formatPrice(total);
  modal.classList.remove('hidden');
  setTimeout(() => {
    const content = modal.querySelector('div[class*="transform"]');
    if (content) { content.classList.remove('scale-95', 'opacity-0'); content.classList.add('scale-100', 'opacity-100'); }
  }, 10);
}

export function closeCheckout() {
  const modal = document.getElementById('checkoutModal');
  const content = modal ? modal.querySelector('div[class*="transform"]') : null;
  if (!modal) return;
  if (content) { content.classList.remove('scale-100', 'opacity-100'); content.classList.add('scale-95', 'opacity-0'); }
  setTimeout(() => modal.classList.add('hidden'), 300);
}

export function initCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('checkoutName').value;
    const phone = document.getElementById('checkoutPhone').value;
    const address = document.getElementById('checkoutAddress').value;
    const notes = document.getElementById('checkoutNotes').value;
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let message = '*PESANAN BARU - R2 NUSANTARA*\n\n*Data Pembeli:*\nNama: ' + name + '\nWhatsApp: ' + phone + '\nAlamat: ' + address + '\n\n*Detail Pesanan:*\n';
    state.cart.forEach(item => {
      message += '- ' + item.name + '\n  Qty: ' + item.quantity + ' x Rp ' + formatPrice(item.price) + '\n  Subtotal: Rp ' + formatPrice(item.price * item.quantity) + '\n\n';
    });
    message += '*Total: Rp ' + formatPrice(total) + '*\n\n';
    if (notes) message += 'Catatan: ' + notes + '\n\n';
    message += 'Terima kasih!';
    const waNumber = getCleanWaNumber(window.COMPANY_INFO.contact.whatsapp);
    window.open('https://wa.me/' + waNumber + '?text=' + encodeURIComponent(message), '_blank');
    closeCheckout();
    state.cart = [];
    localStorage.setItem('r2_cart', JSON.stringify(state.cart));
    // update cart UI
    import('./cart.js').then(module => {
      module.updateCartUI();
    });
    showToast('Pesanan berhasil dikirim!', 'success');
  });
                        }
