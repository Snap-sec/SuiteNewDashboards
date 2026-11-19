import { create } from 'zustand';


const useStore = create((set) => ({
    pagination: { pageIndex: 0, pageSize: 10 },  // for tanstack table
    searchQuery: "",
    filters: {},
    totalCount: 0,

    setPagination: (callback) => (set((state) => { let newState = callback(state.pagination); return { pagination: newState }; })),   // for tanstack table (passes callback)
    setSearchQuery: (search) => (set(() => ({ searchQuery: search }))),
    setFilters: (callback) => (set((state) => { let newState = callback(state.filters); return { filters: newState } })),
    setSorting: (callback) => (set((state) => { let newState = callback(state.sorting); if (!newState.length) return { sorting: [] }; return { sorting: [newState.at(-1)] }; })),
    setTotalCount: (count) => set(() => ({ totalCount: count })),
}));


export default useStore;