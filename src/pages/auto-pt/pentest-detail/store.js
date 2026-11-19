import { create } from 'zustand';

const useEndpointsStore = create((set) => ({
  pagination: { pageIndex: 0, pageSize: 25 },
  searchQuery: '',
  filters: {},  // add filters state here
  sorting: [],
  rowSelection: {},

  setPagination: (callback) => set((state) => ({ pagination: callback(state.pagination) })),
  setSearchQuery: (query) => set(() => ({ searchQuery: query })),
  setFilters: (callback) => set((state) => ({ filters: callback(state.filters) })),
  setSorting: (callback) => set((state) => {
    const newSorting = callback(state.sorting);
    return { sorting: newSorting.length ? [newSorting[newSorting.length - 1]] : [] };
  }),
  setRowSelection: (callback) => set((state) => ({ rowSelection: callback(state.rowSelection) })),
}));

export default useEndpointsStore;
