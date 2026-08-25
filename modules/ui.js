// modules/ui.js
import { state } from './state.js';
import { formatPrice } from './utils.js';

export function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  const icons = { success: 'fa-check', error: 'fa-times', warning: 'fa-exclamation' };
  const titles = { success: 'Berhasil', error: 'Error', warning: 'Peringatan' };
  toast.innerHTML = `<div class="toast-icon"><i class="fas ${icons[type] || 'fa-check'}"></i></div>
    <div class="toast-content"><div class="toast-title">${titles[type] || 'Berhasil'}</div>
    <div class="toast-message">${message}</div></div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

export function openLegalModal(type) {
  const modal = document.getElementById('legalModal');
  const content = document.getElementById('legalContent');
  if (!modal || !content) return;
  const map = {
    terms: { title: 'Syarat & Ketentuan', content: '<p class="text-sm text-secondary leading-relaxed">Selamat datang di R2 Nusantara. Dengan menggunakan website ini, Anda setuju untuk terikat dengan syarat dan ketentuan yang berlaku.</p>' },
    privacy: { title: 'Kebijakan Privasi', content: '<p class="text-sm text-secondary leading-relaxed">Kami menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi yang Anda berikan.</p>' },
    cookie: { title: 'Kebijakan Cookie', content: '<p class="text-sm text-secondary leading-relaxed">Website ini menggunakan cookie untuk meningkatkan pengalaman browsing Anda.</p>' }
  };
  const data = map[type];
  if (!data) return;
  content.innerHTML = `<div class="flex items-center justify-between mb-4"><h2 class="text-xl font-display text-primary">${data.title}</h2><button onclick="window.closeLegalModal()" class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"><i class="fas fa-times text-primary text-sm"></i></button></div>${data.content}`;
  modal.classList.remove('hidden');
  setTimeout(() => { content.classList.remove('scale-95', 'opacity-0'); content.classList.add('scale-100', 'opacity-100'); }, 10);
}

export function closeLegalModal() {
  const modal = document.getElementById('legalModal');
  const content = document.getElementById('legalContent');
  if (!modal || !content) return;
  content.classList.remove('scale-100', 'opacity-100');
  content.classList.add('scale-95', 'opacity-0');
  setTimeout(() => modal.classList.add('hidden'), 300);
}

export function openReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  setTimeout(() => {
    const c = modal.querySelector('div[class*="transform"]');
    if (c) { c.classList.remove('scale-95', 'opacity-0'); c.classList.add('scale-100', 'opacity-100'); }
  }, 10);
}

export function closeReviewModal() {
  const modal = document.getElementById('reviewModal');
  const content = modal ? modal.querySelector('div[class*="transform"]') : null;
  if (!modal) return;
  if (content) { content.classList.remove('scale-100', 'opacity-100'); content.classList.add('scale-95', 'opacity-0'); }
  setTimeout(() => modal.classList.add('hidden'), 300);
}

export function acceptCookies() {
  localStorage.setItem('cookiesAccepted', 'true');
  document.getElementById('cookieBanner')?.classList.add('hidden');
}
export function rejectCookies() {
  localStorage.setItem('cookiesAccepted', 'false');
  document.getElementById('cookieBanner')?.classList.add('hidden');
}

export function initCookieBanner() {
  setTimeout(() => {
    if (!localStorage.getItem('cookiesAccepted')) {
      document.getElementById('cookieBanner')?.classList.remove('hidden');
    }
  }, 1200);
}

export function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

export function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        const ans = i.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = '0';
      });
      if (!isActive) {
        item.classList.add('active');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
}

export function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Terima kasih telah berlangganan!', 'success');
    form.reset();
  });
}

export function initReviewForm() {
  const form = document.getElementById('reviewForm');
  const starBtns = document.querySelectorAll('.star-btn');
  const ratingInput = document.getElementById('reviewRating');
  if (!form) return;
  starBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const rating = parseInt(this.dataset.rating, 10);
      if (ratingInput) ratingInput.value = rating;
      starBtns.forEach(b => {
        const r = parseInt(b.dataset.rating, 10);
        const icon = b.querySelector('i');
        if (r <= rating) { icon.className = 'fas fa-star'; b.classList.add('text-gold'); b.classList.remove('text-gray-300'); }
        else { icon.className = 'far fa-star'; b.classList.remove('text-gold'); b.classList.add('text-gray-300'); }
      });
    });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('reviewName').value.trim();
    const location = document.getElementById('reviewLocation').value.trim();
    const rating = parseInt(document.getElementById('reviewRating').value, 10);
    const text = document.getElementById('reviewText').value.trim();
    if (!name || !location || !text) { showToast('Mohon lengkapi semua field', 'warning'); return; }
    const newReview = { name, location, rating, text, date: new Date().toISOString() };
    const saved = localStorage.getItem('userReviews');
    const userReviews = saved ? JSON.parse(saved) : [];
    userReviews.push(newReview);
    localStorage.setItem('userReviews', JSON.stringify(userReviews));
    form.reset();
    if (ratingInput) ratingInput.value = 5;
    starBtns.forEach(b => { const icon = b.querySelector('i'); icon.className = 'fas fa-star'; b.classList.add('text-gold'); });
    closeReviewModal();
    showToast('Ulasan Anda berhasil ditambahkan! Terima kasih.', 'success');
    // Refresh testimonial slider
    import('./catalog.js').then(module => {
      if (module.initTestimonialSlider) module.initTestimonialSlider();
    });
  });
}
