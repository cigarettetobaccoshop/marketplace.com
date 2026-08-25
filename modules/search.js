// modules/search.js
import { state } from './state.js';
import { getProductImage, getWholesalePrice, formatPrice } from './utils.js';
import { openQuickView } from './catalog.js';

export function initSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!input || !results) return;
  input.addEventListener('input', function(e) {
    const query = e.target.value.trim().toLowerCase();
    if (query.length < 2) { results.classList.add('hidden'); return; }
    let filtered = window.PRODUCTS.filter(p => {
      return p.name.toLowerCase().includes(query) || (p.category && p.category.toLowerCase().includes(query));
    });
    // Filter berdasarkan kategori jika ada
    if (state.filter.category) {
      filtered = filtered.filter(p => p.category === state.filter.category);
    }
    filtered = filtered.slice(0, 5);
    if (filtered.length > 0) {
      results.innerHTML = filtered.map(product => `
        <div class="search-result-item" onclick="window.selectSearchResult('${product.id}')">
          <div class="flex items-center gap-3">
            <img src="${getProductImage(product)}" alt="${product.name}" class="w-10 h-10 object-cover rounded-lg">
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-primary text-xs truncate">${product.name}</p>
              <p class="text-[10px] text-secondary">${product.category || 'R2'}</p>
            </div>
            <span class="text-gold font-bold text-xs font-mono">Rp ${formatPrice(getWholesalePrice(product))}</span>
          </div>
        </div>
      `).join('');
      results.classList.remove('hidden');
    } else {
      results.classList.add('hidden');
    }
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#searchInput') && !e.target.closest('#searchResults')) {
      results.classList.add('hidden');
    }
  });
}

export function selectSearchResult(productId) {
  openQuickView(productId);
  document.getElementById('searchResults')?.classList.add('hidden');
  document.getElementById('searchInput').value = '';
}
