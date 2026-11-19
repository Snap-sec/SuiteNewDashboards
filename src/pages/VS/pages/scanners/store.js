import { create } from 'zustand';

const useStore = create((set) => ({
  searchQuery: "",
  pagination: { page: 1, limit: 12 },
  filters: {},
  activeView: "cards",

  setSearchQuery: (query) => set({ searchQuery: query }),
  setPagination: (value) => set({ pagination: value }),
  setPage: (page) => set((state) => ({ pagination: { ...state.pagination, page: page }})),
  setLimit: (limit) => set((state) => ({ pagination: { ...state.pagination, limit: limit }})),
  setFilters: (filters) => set({ filters }),
  setActiveView: (view) => set({ activeView: view })
}));

export { useStore };