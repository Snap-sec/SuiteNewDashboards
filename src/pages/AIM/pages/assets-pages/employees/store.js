import { create } from 'zustand';


const useStore = create((set) => ({
  pagination: { pageIndex: 0, pageSize: 20 },
  searchQuery: '',
  filters: {},
  sorting: [],

  setPagination: (callback) =>
    set((state) => {
      let newState = callback(state.pagination);
      return { pagination: newState };
    }),

  setPage: (page) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        pageIndex: Math.max((page || 1) - 1, 0),
      },
    })),

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
}));

export default useStore;