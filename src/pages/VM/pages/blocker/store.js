import { create } from 'zustand';


const useStore = create((set) => ({
    pagination: { pageIndex: 0, pageSize: 10 },  // for tanstack table
    searchQuery: "",
    filters: { status: ['pending'] },
    sorting: [],
    rowSelection: {},

    setPagination: (callback) => (set((state) => { let newState = callback(state.pagination); return { pagination: newState }; })),   // for tanstack table (passes callback)
    setPage: (page) =>
      set((state) => ({
        pagination: {
          ...state.pagination,
          pageIndex: Math.max((page || 1) - 1, 0),
        },
      })),
    setSearchQuery: (search) => (set(() => ({ searchQuery: search }))),
    setFilters: (callback) => (set((state) => { let newState = callback(state.filters); return { filters: newState } })),
    setSorting: (callback) => (set((state) => { let newState = callback(state.sorting); if (!newState.length) return { sorting: [] }; return { sorting: [newState.at(-1)] }; })),
    setRowSelection: (callback) => (set((state) => { let newState = callback(state.rowSelection); return { rowSelection: newState }; }))
}));


export default useStore;