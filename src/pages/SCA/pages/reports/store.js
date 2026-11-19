import { create } from 'zustand';

const useStore = create((set) => ({
  pagination: { pageIndex: 0, pageSize: 10 },
  searchQuery: '',
  filters: {},
  sorting: [],

  setPagination: (callback) =>
    set((state) => {
      let newState = typeof callback === 'function' ? callback(state.pagination) : callback;
      return { pagination: newState };
    }),
  setSearchQuery: (search) => set(() => ({ searchQuery: search })),
  setFilters: (callback) =>
    set((state) => {
      let newState = typeof callback === 'function' ? callback(state) : callback;
      return { filters: newState };
    }),
  setSorting: (callback) =>
    set((state) => {
      let newState = typeof callback === 'function' ? callback(state.sorting) : callback;
      if (!newState.length) return { sorting: [] };
      return { sorting: [newState.at(-1)] };
    }),
  rowSelection: {},
  setRowSelection: (callback) =>
    set((state) => {
      let newState = typeof callback === 'function' ? callback(state.rowSelection) : callback;
      return { rowSelection: newState };
    }),
}));

export default useStore;
