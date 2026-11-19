// useStore.js
import { create } from 'zustand';

const useStore = create((set) => ({
  pagination: { pageIndex: 0, pageSize: 10 },
  searchQuery: '',
  filters: {},
  sorting: [],
  setPagination: (callback) =>
    set((state) => {
      const newState = callback(state.pagination);
      return { pagination: newState };
    }),
  setSearchQuery: (search) => set(() => ({ searchQuery: search })),
  setFilters: (callback) => set((state) => {
    let newState = callback(state.filters);
    return { filters: newState }
  }),
  setSorting: (callback) =>
    set((state) => {
      let newState = callback(state.sorting);
      if (!newState.length) return { sorting: [] };
      return { sorting: [newState.at(-1)] };
    }),
}));

export default useStore;
