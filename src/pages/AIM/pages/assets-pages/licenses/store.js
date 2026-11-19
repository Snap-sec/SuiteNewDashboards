import { create } from 'zustand';

const useStore = create((set) => ({
  pagination: { pageIndex: 0, pageSize: 10 },
  sorting: [],
  filters: {},
  searchQuery: '',
  setPagination: (updater) =>
    set((state) => ({
      pagination: typeof updater === 'function' ? updater(state.pagination) : updater,
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSorting: (sorting) => set({ sorting }),
  setFilters: (filters) => set({ filters }),
}));

export default useStore;
