// modules/state.js
export const state = {
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  currentPage: 1,
  itemsPerPage: 12,
  filter: { category: '', search: '', sort: 'name' },
  products: [],
  testimonials: [],
  autoPlayInterval: null,
  testimonialIndex: 0
};

export function setState(newState) {
  Object.assign(state, newState);
}

export function getState() {
  return state;
}
