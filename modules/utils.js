// modules/utils.js
export function formatPrice(price) {
  return new Intl.NumberFormat('id-ID').format(price);
}

export function getCleanWaNumber(phone) {
  let cleaned = (phone || '').replace(/\D/g, '');
  if (cleaned.startsWith('0')) cleaned = '62' + cleaned.substring(1);
  else if (!cleaned.startsWith('62')) cleaned = '62' + cleaned;
  return cleaned;
}

// Thumbnail generator dengan cache
const thumbnailCache = new Map();
export function generateProductThumbnail(product) {
  if (thumbnailCache.has(product.id)) return thumbnailCache.get(product.id);
  const brandName = product.name.toUpperCase();
  const category = product.category || 'R2';
  const sideText = category === 'Resmi' ? 'RESMI FILTER' : 'R2 FILTER';
  let accentColor = '#1a1a1a';
  if (product.badge === 'hot') accentColor = '#DC2626';
  else if (product.badge === 'vip') accentColor = '#7C3AED';
  else if (product.badge === 'new') accentColor = '#059669';

  let bgPacks = '';
  for (let i = 0; i < 30; i++) {
    const x = (i % 6) * 100 + 10;
    const y = Math.floor(i / 6) * 100 + 10;
    const opacity = 0.08 + (Math.random() * 0.1);
    bgPacks += `<rect x="${x}" y="${y}" width="70" height="90" fill="#ffffff" opacity="${opacity.toFixed(2)}" rx="2"/>`;
    bgPacks += `<text x="${x+35}" y="${y+55}" font-family="Georgia, serif" font-size="22" fill="#ffffff" opacity="${(opacity+0.05).toFixed(2)}" text-anchor="middle" font-weight="bold">R2</text>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2a2a2a"/><stop offset="50%" stop-color="#1a1a1a"/><stop offset="100%" stop-color="#0d0d0d"/></linearGradient>
      <linearGradient id="packGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f0f0f0"/></linearGradient>
      <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#888888"/><stop offset="30%" stop-color="#e0e0e0"/><stop offset="50%" stop-color="#ffffff"/><stop offset="70%" stop-color="#c0c0c0"/><stop offset="100%" stop-color="#666666"/></linearGradient>
      <filter id="packShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="15" stdDeviation="25" flood-color="#000" flood-opacity="0.6"/></filter>
      <filter id="textShadow"><feDropShadow dx="1" dy="2" stdDeviation="1" flood-color="#000" flood-opacity="0.3"/></filter>
    </defs>
    <rect width="600" height="600" fill="url(#bgGrad)"/>${bgPacks}
    <rect x="0" y="520" width="600" height="80" fill="#1a1a1a" opacity="0.5"/>
    <g filter="url(#packShadow)" transform="translate(150, 80)">
      <rect x="0" y="30" width="50" height="400" fill="#d4d4d4" rx="2"/>
      <text x="25" y="230" font-family="Arial" font-size="11" fill="#666" text-anchor="middle" transform="rotate(-90, 25, 230)" letter-spacing="3">${sideText}</text>
      <rect x="50" y="0" width="300" height="440" fill="url(#packGrad)" rx="3" stroke="#000" stroke-width="1.5"/>
      <path d="M 50,20 L 75,0 L 350,0 L 350,20 Z" fill="#e8e8e8" stroke="#000" stroke-width="1"/>
      <rect x="60" y="10" width="280" height="110" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
      <rect x="60" y="10" width="280" height="28" fill="#000000"/>
      <text x="200" y="30" font-family="Arial" font-size="15" fill="#ffffff" text-anchor="middle" font-weight="bold" letter-spacing="1">HEALTH WARNINGS</text>
      <rect x="65" y="42" width="140" height="73" fill="#f5f5f5" stroke="#000" stroke-width="0.5"/>
      <circle cx="135" cy="78" r="25" fill="#d0d0d0" opacity="0.6"/>
      <text x="135" y="85" font-family="Arial" font-size="30" fill="#999" text-anchor="middle">⚠</text>
      <rect x="215" y="42" width="65" height="65" fill="#fff" stroke="#000" stroke-width="0.5"/>
      <rect x="220" y="47" width="15" height="15" fill="#000"/><rect x="260" y="47" width="15" height="15" fill="#000"/><rect x="220" y="87" width="15" height="15" fill="#000"/><rect x="240" y="67" width="15" height="15" fill="#000"/><rect x="260" y="87" width="15" height="15" fill="#000"/>
      <rect x="60" y="120" width="280" height="45" fill="#000000"/>
      <text x="200" y="138" font-family="Arial" font-size="11" fill="#ffffff" text-anchor="middle" font-weight="bold">PERINGATAN: MEROKOK MEMBUNUHMU</text>
      <text x="200" y="155" font-family="Arial" font-size="10" fill="#ffffff" text-anchor="middle">WARNING: SMOKING KILLS</text>
      <rect x="60" y="175" width="280" height="220" fill="#ffffff" stroke="#000" stroke-width="1"/>
      <text x="200" y="320" font-family="Georgia, serif" font-size="140" fill="url(#metalGrad)" text-anchor="middle" font-weight="bold" filter="url(#textShadow)" letter-spacing="-2">R2</text>
      <text x="200" y="360" font-family="Georgia, serif" font-size="22" fill="#000000" text-anchor="middle" letter-spacing="10" font-weight="600">NUSANTARA</text>
      <line x1="120" y1="375" x2="280" y2="375" stroke="#000" stroke-width="1"/>
      <text x="200" y="395" font-family="Arial" font-size="14" fill="${accentColor}" text-anchor="middle" font-weight="bold" letter-spacing="1">${brandName.substring(0,22)}</text>
      <rect x="60" y="405" width="280" height="25" fill="#000000"/>
      <text x="200" y="422" font-family="Arial" font-size="12" fill="#ffffff" text-anchor="middle" font-weight="bold" letter-spacing="3">${sideText}</text>
    </g>
    <text x="570" y="580" font-family="Arial" font-size="13" font-style="italic" font-weight="600" fill="rgba(200,150,46,0.4)" text-anchor="end" letter-spacing="2">233 VARIAN</text>
  </svg>`;
  const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  thumbnailCache.set(product.id, dataUrl);
  return dataUrl;
}

export function getProductImage(product) {
  if (product.image && typeof product.image === 'string' && product.image.startsWith('http')) {
    return product.image;
  }
  return generateProductThumbnail(product);
}

export function getWholesalePrice(product) {
  if (!product.price) return 0;
  if (typeof product.price === 'object') return product.price.wholesale || 0;
  return product.price;
}

export function getRetailPrice(product) {
  if (!product.price) return 0;
  if (typeof product.price === 'object') return product.price.retail || Math.round(getWholesalePrice(product) * 1.15);
  return Math.round(product.price * 1.15);
}

export function getProductRating(product) {
  return product.rating || (product.badge === 'vip' ? 4.8 : (product.badge === 'hot' ? 4.7 : 4.5));
}

export function getProductBadge(product) {
  if (product.badge === 'hot') return '<span class="mp-card-badge hot"><i class="fas fa-fire"></i> Terlaris</span>';
  if (product.badge === 'vip') return '<span class="mp-card-badge vip"><i class="fas fa-crown"></i> VIP</span>';
  if (product.badge === 'new') return '<span class="mp-card-badge new"><i class="fas fa-bolt"></i> Baru</span>';
  return '';
}

export function buildStarRating(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
  if (half) html += '<i class="fas fa-star-half-alt"></i>';
  const empty = 5 - full - (half ? 1 : 0);
  for (let j = 0; j < empty; j++) html += '<i class="far fa-star"></i>';
  return html;
      }
