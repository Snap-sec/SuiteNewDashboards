import { create } from 'zustand';

const useStore = create((set) => ({
  pagination: { pageIndex: 0, pageSize: 10 },
  searchQuery: '',
  sorting: [],
  filters: {},

  setPagination: (callback) =>
    set((state) => {
      let newState = callback(state.pagination);
      return { pagination: newState };
    }),
  setSearchQuery: (search) => set(() => ({ searchQuery: search })),
  setSorting: (callback) =>
    set((state) => {
      let newState = callback(state.sorting);
      if (!newState.length) return { sorting: [] };
      return { sorting: [newState.at(-1)] };
    }),
  setFilters: (callback) =>
    set((state) => {
      if (typeof callback === 'function') {
        return { filters: callback(state.filters) };
      }
      return { filters: callback };
    }),
  reset: () =>
    set(() => ({
      pagination: { pageIndex: 0, pageSize: 10 },
      searchQuery: '',
      sorting: [],
      filters: {},
    })),
}));

export default useStore;
