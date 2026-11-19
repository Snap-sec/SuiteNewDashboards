import { create } from 'zustand';

const useReportStore = create((set) => ({
  pagination: { pageIndex: 0, pageSize: 10 },
  searchQuery: '',
  filters: {},
  sorting: [],
  rowSelection: {},

  setRowSelection: (callback) =>
    set((state) => {
      const newState =
        typeof callback === 'function' ? callback(state.rowSelection) : callback;
      return { rowSelection: newState };
    }),
  setPagination: (callback) =>
    set((state) => {
      const newState = callback(state.pagination);
      return { pagination: newState };
    }),
  setSearchQuery: (search) => set(() => ({ searchQuery: search })),
  setFilters: (callback) =>
    set((state) => {
      const newState = callback(state);
      return { filters: newState };
    }),
  setSorting: (callback) =>
    set((state) => {
      const newState = callback(state.sorting);
      if (!newState.length) return { sorting: [] };
      return { sorting: [newState.at(-1)] };
    }),
}));

export default useReportStore;
