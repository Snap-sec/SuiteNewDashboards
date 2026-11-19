import { create } from 'zustand';


const useStore = create((set) => ({
    // Table / details panel state
    pagination: { pageIndex: 0, pageSize: 10 },
    searchQuery: "",
    filters: {},
    sorting: [],

    // Sidebar state
    activeClassifierId: null,
    currentTab: 'active',        // 'active' | 'disabled'
    sidebarSearch: "",

    setPagination: (callback) => (set((state) => { let newState = callback(state.pagination); return { pagination: newState }; })),
    setSearchQuery: (search) => (set(() => ({ searchQuery: search }))),
    setFilters: (callback) => (set((state) => { let newState = callback(state); return { filters: newState } })),
    setSorting: (callback) => (set((state) => { let newState = callback(state.sorting); if (!newState.length) return { sorting: [] }; return { sorting: [newState.at(-1)] }; })),

    setActiveClassifierId: (id) => set({ activeClassifierId: id }),
    setCurrentTab: (tab) => set({ currentTab: tab }),
    setSidebarSearch: (search) => set({ sidebarSearch: search }),
}));


export default useStore;