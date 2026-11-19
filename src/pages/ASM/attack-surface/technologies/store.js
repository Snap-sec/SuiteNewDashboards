import { create } from 'zustand';

const useStore = create((set) => ({
  pagination: { pageIndex: 0, pageSize: 24 },
  searchQuery: '',
  filters: {},
  sorting: [],

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
      // Pass only the existing filters object to the callback.
      // Previously we passed the whole `state`, which caused the
      // callback to receive the entire store (including functions)
      // and resulted in the filters containing the whole store.
      let newState = callback(state.filters);
      return { filters: newState };
    }),
}));

export default useStore;
