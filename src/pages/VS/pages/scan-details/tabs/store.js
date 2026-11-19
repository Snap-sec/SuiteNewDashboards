import { create } from 'zustand';


const useStore = create((set) => ({
    pagination: { pageIndex: 0, pageSize: 20 },
    searchQuery: "",
    filters: { suppressed:"false" },
    sorting: [],
    showInfo: false,
    selectedVuln: null,
    rowSelection: {},

    setPagination: (callback) => (set((state) => { let newState = callback(state.pagination); return { pagination: newState }; })),   // for tanstack table (passes callback)
    setSearchQuery: (search) => (set(() => ({ searchQuery: search }))),
    setFilters: (callback) => (set((state) => { let newState = callback(state.filters); return { filters: newState } })),
    setSorting: (callback) => (set((state) => { let newState = callback(state.sorting); if (!newState.length) return { sorting: [] }; return { sorting: [newState.at(-1)] }; })),
    setShowInfo: (open) => (set({ showInfo: open })),
    setSelectedVuln: (vuln) => (set({ selectedVuln: vuln })),
    setRowSelection: (callback) => (set((state) => { let newState = callback(state.rowSelection); return { rowSelection: newState }; })),
    reset: () => set(() => ({
        pagination: { pageIndex: 0, pageSize: 20 },
        searchQuery: "",
        filters: { suppressed: "false" },
        sorting: [],
        rowSelection: {},
    })),
}));


export default useStore;
