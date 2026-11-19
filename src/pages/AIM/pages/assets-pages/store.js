import { create } from 'zustand';

const useStore = create((set) => ({
  pagination: { pageIndex: 0, pageSize: 25 },
  searchQuery: '',
  filters: {},
  sorting: [],
  rowSelection: {},

  // setPagination: (callback) => (set((state) => {
  //     let newState = callback(state.pagination);
  //     return { pagination: newState };
  // })),
  setPagination: (updater) =>
    set((state) => {
      let newPagination =
        typeof updater === 'function' ? updater(state.pagination) : updater; // ✅ handle object form too
      return { pagination: newPagination };
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
      // If it's a function that returns an empty object (reset case), force a new empty object
      if (
        typeof callback === 'function' &&
        Object.keys(callback(state.filters)).length === 0
      ) {
        return { filters: {} };
      }
      let newState =
        typeof callback === 'function' ? callback(state.filters) : callback;
      return { filters: newState };
    }),

  setRowSelection: (updater) =>
    set((state) => {
      let newState = typeof updater === 'function' ? updater(state.rowSelection) : updater;
      return { rowSelection: newState };
    }),
}));

export default useStore;
