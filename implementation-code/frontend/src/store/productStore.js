import { create } from "zustand";

export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  brands: [],
  filters: {
    categories: [],
    brands: [],
    priceRange: [0, 10000],
    inStockOnly: false,
  },
  filteredProducts: [],

  setProducts: (products) =>
    set(() => {
      const filtered = get().applyFilters(products, get().filters);
      return { products, filteredProducts: filtered };
    }),

  setCategories: (categories) => set({ categories }),

  setBrands: (brands) => set({ brands }),

  setFilters: (newFilters) =>
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filtered = get().applyFilters(state.products, updatedFilters);
      return { filters: updatedFilters, filteredProducts: filtered };
    }),

  applyFilters: (products, filters) => {
    let filtered = [...products];

    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.categoryName)
      );
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) =>
        filters.brands.includes(p.brand.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.inStockOnly) {
      filtered = filtered.filter((p) => p.stockQuantity > 0);
    }

    return filtered;
  },
}));
