import { create } from 'zustand';

const useStore = create((set) => ({
  pagination: { pageIndex: 0, pageSize: 25 },
  searchQuery: "",
  // filters: { supressed: "false" },
  sorting: [],
  selectedVuln: null,
  rowSelection: {},

  setPagination: (callback) =>
    set((state) => ({
      pagination:
        typeof callback === 'function'
          ? callback(state.pagination)
          : callback,
    })),
  setSearchQuery: (search) => (set(() => ({ searchQuery: search }))),
  setFilters: (callback) => (set((state) => { let newState = callback(state.filters); return { filters: newState } })),
  setSorting: (callback) => (set((state) => { let newState = callback(state.sorting); if (!newState.length) return { sorting: [] }; return { sorting: [newState.at(-1)] }; })),
  setSelectedVuln: (vuln) => (set({ selectedVuln: vuln })),
  setRowSelection: (callback) => (set((state) => { let newState = callback(state.rowSelection); return { rowSelection: newState }; }))
}));


export default useStore;