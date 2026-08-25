// modules/catalog.js
import { state, getState, setState } from './state.js';
import { formatPrice, getWholesalePrice, getRetailPrice, getProductImage, getProductRating, getProductBadge, buildStarRating, generateProductThumbnail } from './utils.js';
import { showToast } from './ui.js';
import { addToCart } from './cart.js';
import { toggleWishlist } from './wishlist.js';

let products = window.PRODUCTS || [];

export function setProducts(data) {
  products = data;
}

function getFilteredProducts() {
  let filtered = products.slice();
  if (state.filter.category) filtered = filtered.filter(p => p.category === state.filter.category);
  if (state.filter.search) {
    const s = state.filter.search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || (p.category && p.category.toLowerCase().includes(s)));
  }
  if (state.filter.sort === 'price-asc') filtered.sort((a,b) => getWholesalePrice(a) - getWholesalePrice(b));
  else if (state.filter.sort === 'price-desc') filtered.sort((a,b) => getWholesalePrice(b) - getWholesalePrice(a));
  else if (state.filter.sort === 'rating') filtered.sort((a,b) => getProductRating(b) - getProductRating(a));
  else filtered.sort((a,b) => a.name.localeCompare(b.name));
  return filtered;
}

export function renderProductGrid() {
  const grid = document.getElementById('productGrid');
  const noResults = document.getElementById('noResults');
  const pagination = document.getElementById('pagination');
  if (!grid) return;
  const filtered = getFilteredProducts();
  const totalPages = Math.ceil(filtered.length / state.itemsPerPage);
  const start = (state.currentPage - 1) * state.itemsPerPage;
  const paginated = filtered.slice(start, start + state.itemsPerPage);
  if (paginated.length === 0) {
    grid.innerHTML = '';
    grid.classList.add('hidden');
    if (noResults) noResults.classList.remove('hidden');
    if (pagination) pagination.innerHTML = '';
    return;
  }
  if (noResults) noResults.classList.add('hidden');
  grid.classList.remove('hidden');
  grid.innerHTML = paginated.map(product => buildProductCardHTML(product)).join('');
  if (pagination && totalPages > 1) {
    let html = '';
    if (state.currentPage > 1) html += `<button class="pagination-btn" onclick="window.changePage(${state.currentPage - 1})"><i class="fas fa-chevron-left"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= state.currentPage - 1 && i <= state.currentPage + 1)) {
        html += `<button class="pagination-btn ${i === state.currentPage ? 'active' : ''}" onclick="window.changePage(${i})">${i}</button>`;
      } else if (i === state.currentPage - 2 || i === state.currentPage + 2) {
        html += `<span class="px-2 text-secondary text-xs">...</span>`;
      }
    }
    if (state.currentPage < totalPages) html += `<button class="pagination-btn" onclick="window.changePage(${state.currentPage + 1})"><i class="fas fa-chevron-right"></i></button>`;
    pagination.innerHTML = html;
  } else if (pagination) {
    pagination.innerHTML = '';
  }
}

export function changePage(page) {
  state.currentPage = page;
  renderProductGrid();
  document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
}

function buildProductCardHTML(product) {
  const wholesalePrice = getWholesalePrice(product);
  const retailPrice = getRetailPrice(product);
  const discount = retailPrice > 0 ? Math.round(((retailPrice - wholesalePrice) / retailPrice) * 100) : 0;
  const badge = getProductBadge(product);
  const rating = getProductRating(product);
  const inWishlist = state.wishlist.indexOf(product.id) > -1;
  const image = getProductImage(product);
  return `<div class="mp-card" data-product-id="${product.id}">
    <div class="mp-card-image">
      ${badge}
      <button class="mp-card-wishlist ${inWishlist ? 'active' : ''}" onclick="window.toggleWishlist('${product.id}', event)" title="Wishlist"><i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i></button>
      <img src="${image}" alt="${product.name}" loading="lazy" class="mp-card-img">
    </div>
    <div class="mp-card-content">
      <div class="mp-card-category">${product.category || 'R2'}</div>
      <h3 class="mp-card-title">${product.name}</h3>
      <div class="mp-card-rating">${buildStarRating(rating)}<span>(${rating})</span></div>
      <div class="mp-card-price">
        <div class="mp-card-price-retail">Rp ${formatPrice(retailPrice)}</div>
        <div class="mp-card-price-wholesale">Rp ${formatPrice(wholesalePrice)}${discount > 0 ? `<span class="mp-card-price-badge">-${discount}%</span>` : ''}</div>
      </div>
      <div class="mp-card-actions">
        <button class="mp-card-add-to-cart" onclick="window.addToCart('${product.id}')"><i class="fas fa-plus"></i> Keranjang</button>
        <button class="mp-card-quick-view" onclick="window.openQuickView('${product.id}')" title="Quick View"><i class="fas fa-eye"></i></button>
      </div>
    </div>
  </div>`;
}

export function filterByCategory(category) {
  state.filter.category = category;
  state.currentPage = 1;
  document.getElementById('categoryFilter').value = category;
  renderProductGrid();
  // update tombol kategori
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.classList.remove('bg-gold', 'text-white', 'border-gold', 'shadow-md');
    btn.classList.add('bg-white', 'text-primary', 'border-border', 'shadow-sm');
  });
  const activeId = category === '' ? 'btnCatAll' : (category === 'R2' ? 'btnCatR2' : 'btnCatResmi');
  const activeBtn = document.getElementById(activeId);
  if (activeBtn) {
    activeBtn.classList.remove('bg-white', 'text-primary', 'border-border', 'shadow-sm');
    activeBtn.classList.add('bg-gold', 'text-white', 'border-gold', 'shadow-md');
  }
  document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
}

export function resetFilters() {
  state.filter = { category: '', search: '', sort: 'name' };
  state.currentPage = 1;
  document.getElementById('categoryFilter').value = '';
  document.getElementById('sortFilter').value = 'name';
  document.getElementById('searchInput').value = '';
  renderProductGrid();
  // reset tombol kategori
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.classList.remove('bg-gold', 'text-white', 'border-gold', 'shadow-md');
    btn.classList.add('bg-white', 'text-primary', 'border-border', 'shadow-sm');
  });
  document.getElementById('btnCatAll')?.classList.add('bg-gold', 'text-white', 'border-gold', 'shadow-md');
}

export function renderEditorsPick() {
  const container = document.getElementById('editorsPick');
  if (!container) return;
  const featured = products.filter(p => p.isFeatured).slice(0, 3);
  if (featured.length === 0) { container.innerHTML = '<p class="text-secondary text-sm">Belum ada produk unggulan.</p>'; return; }
  container.innerHTML = featured.map(product => `
    <div class="mp-card cursor-pointer" onclick="window.openQuickView('${product.id}')">
      <div class="mp-card-image"><img src="${getProductImage(product)}" alt="${product.name}" loading="lazy" class="mp-card-img"></div>
      <div class="mp-card-content">
        <h3 class="font-semibold text-primary mb-1 text-sm">${product.name}</h3>
        <p class="text-gold font-bold font-mono text-sm">Rp ${formatPrice(getWholesalePrice(product))}</p>
      </div>
    </div>
  `).join('');
}

// Quick View
export function openQuickView(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const modal = document.getElementById('quickViewModal');
  const content = document.getElementById('quickViewContent');
  if (!modal || !content) return;
  const wholesale = getWholesalePrice(product);
  const retail = getRetailPrice(product);
  const discount = retail > 0 ? Math.round(((retail - wholesale) / retail) * 100) : 0;
  const inWishlist = state.wishlist.indexOf(product.id) > -1;
  content.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
    <div class="aspect-square rounded-xl overflow-hidden bg-surface relative group">
      <img src="${getProductImage(product)}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy">
    </div>
    <div>
      <div class="flex items-start justify-between mb-3">
        <div><span class="text-xs text-secondary uppercase font-semibold">${product.category || 'R2'}</span><h2 class="text-xl font-display text-primary mt-0.5">${product.name}</h2></div>
        <button class="w-9 h-9 rounded-lg ${inWishlist ? 'bg-gold text-white' : 'bg-surface text-primary'} hover:scale-110 transition-transform" onclick="window.toggleWishlist('${product.id}')"><i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i></button>
      </div>
      <div class="flex items-center gap-2 mb-3">${buildStarRating(getProductRating(product))}<span class="text-secondary text-xs">(${getProductRating(product)})</span></div>
      <div class="mb-4">
        <p class="text-secondary line-through text-xs mb-1 font-mono">Rp ${formatPrice(retail)}</p>
        <div class="flex items-center gap-2"><span class="text-2xl font-bold text-primary font-mono">Rp ${formatPrice(wholesale)}</span>${discount > 0 ? `<span class="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">-${discount}%</span>` : ''}</div>
      </div>
      <p class="text-secondary text-xs mb-4 leading-relaxed">${product.description || 'Produk original dari distributor resmi.'}</p>
      <div class="flex gap-2">
        <button onclick="window.addToCart('${product.id}'); window.closeQuickView();" class="flex-1 py-2.5 bg-gradient-to-r from-gold to-gold-light text-white font-semibold rounded-lg transition-all shadow-md text-sm"><i class="fas fa-shopping-cart mr-1"></i>Tambah</button>
        <button onclick="window.shareProduct('${product.id}')" class="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all"><i class="fab fa-whatsapp"></i></button>
      </div>
    </div>
  </div>`;
  modal.classList.remove('hidden');
  setTimeout(() => { content.classList.remove('scale-95', 'opacity-0'); content.classList.add('scale-100', 'opacity-100'); }, 10);
}

export function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  const content = document.getElementById('quickViewContent');
  if (!modal || !content) return;
  content.classList.remove('scale-100', 'opacity-100');
  content.classList.add('scale-95', 'opacity-0');
  setTimeout(() => modal.classList.add('hidden'), 300);
}

export function shareProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const url = window.location.origin + window.location.pathname + '?p=' + productId;
  const message = `Check out ${product.name} - Rp ${formatPrice(getWholesalePrice(product))} di R2 Nusantara! ${url}`;
  window.open('https://wa.me/?text=' + encodeURIComponent(message), '_blank');
}

// Testimonial
export function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const reviewCountEl = document.getElementById('reviewCount');
  if (!track) return;
  // Hentikan interval lama jika ada
  if (state.autoPlayInterval) clearInterval(state.autoPlayInterval);

  const testimonials = loadTestimonials();
  if (reviewCountEl) reviewCountEl.textContent = testimonials.length;
  track.innerHTML = testimonials.map(t => {
    const initials = t.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    const stars = Array(5).fill(0).map((_, i) => `<i class="${i < t.rating ? 'fas' : 'far'} fa-star"></i>`).join('');
    return `<div class="testimonial-slide"><div class="testimonial-card"><div class="testimonial-stars">${stars}</div><p class="testimonial-text">"${t.text}"</p><div class="testimonial-author"><div class="testimonial-avatar">${initials}</div><div class="testimonial-author-info"><h4>${t.name}</h4><p>${t.location}</p></div></div></div></div>`;
  }).join('');
  const slides = track.querySelectorAll('.testimonial-slide');
  if (slides.length === 0) return;
  if (dotsContainer) dotsContainer.innerHTML = Array.from(slides).map((_, i) => `<div class="testimonial-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('');

  function getVisibleSlides() { return window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1); }
  function updateSlider() {
    const slideWidth = slides[0]?.offsetWidth || 0;
    track.style.transform = `translateX(-${state.testimonialIndex * slideWidth}px)`;
    document.querySelectorAll('.testimonial-dot').forEach((dot, idx) => dot.classList.toggle('active', idx === state.testimonialIndex));
  }
  function nextSlide() {
    const maxIndex = Math.max(0, slides.length - getVisibleSlides());
    state.testimonialIndex = state.testimonialIndex >= maxIndex ? 0 : state.testimonialIndex + 1;
    updateSlider();
  }
  function prevSlide() {
    const maxIndex = Math.max(0, slides.length - getVisibleSlides());
    state.testimonialIndex = state.testimonialIndex <= 0 ? maxIndex : state.testimonialIndex - 1;
    updateSlider();
  }
  function startAutoPlay() { state.autoPlayInterval = setInterval(nextSlide, 4000); }
  function stopAutoPlay() { clearInterval(state.autoPlayInterval); }

  if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); nextSlide(); startAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); prevSlide(); startAutoPlay(); });
  document.querySelectorAll('.testimonial-dot').forEach((dot, idx) => {
    dot.addEventListener('click', () => { stopAutoPlay(); state.testimonialIndex = idx; updateSlider(); startAutoPlay(); });
  });
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAutoPlay(); }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { if (diff > 0) nextSlide(); else prevSlide(); }
    startAutoPlay();
  });
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);
  window.addEventListener('resize', () => { state.testimonialIndex = 0; updateSlider(); });
  updateSlider();
  startAutoPlay();
}

function loadTestimonials() {
  const defaultTestimonials = [
    { name: 'Budi Santoso', location: 'Surabaya, Jawa Timur', rating: 5, text: 'Pelayanan sangat profesional. Barang original semua, packing rapi. Pengiriman cepat hanya 2 hari. Recommended!' },
    { name: 'Ahmad Fauzi', location: 'Malang, Jawa Timur', rating: 5, text: 'Sudah langganan 2 tahun lebih. Harga grosir terbaik di Malang, stok lengkap, selalu original. Terima kasih!' },
    { name: 'Dedi Kurniawan', location: 'Jakarta Pusat', rating: 5, text: 'Stok sangat lengkap, lebih dari 200 merek. Admin ramah. Sistem bayar setelah resi keluar bikin tenang.' },
    { name: 'Rudi Setiawan', location: 'Bandung, Jawa Barat', rating: 5, text: 'Website user friendly, mudah cari produk. Fitur wishlist dan cart sangat membantu. Checkout via WA cepat.' },
    { name: 'Wawan Hermawan', location: 'Semarang, Jawa Tengah', rating: 5, text: 'Gratis ongkir untuk minimal 1 bal sangat membantu. Packaging aman, harga kompetitif. Pasti order lagi!' },
    { name: 'Eko Prasetyo', location: 'Yogyakarta', rating: 5, text: 'Sebagai reseller, saya sangat puas. Konsisten, reliable, harga kompetitif. Partner bisnis yang tepat!' }
  ];
  const saved = localStorage.getItem('userReviews');
  const userReviews = saved ? JSON.parse(saved) : [];
  return defaultTestimonials.concat(userReviews);
    }
