import { create } from 'zustand';


const useStore = create((set) => ({
    pagination: { pageIndex: 0, pageSize: 10 },  // for tanstack table
    searchQuery: "",
    filters: {},
    sorting: [],
    showAddTeamModal: false,
    updateTeamDetail:{id:"", name:"", description: "", members: []},

    setPagination: (callback) => (set((state) => { let newState = callback(state.pagination); return { pagination: newState }; })),   // for tanstack table (passes callback)
    setSearchQuery: (search) => (set(() => ({ searchQuery: search }))),
    setFilters: (callback) => (set((state) => { let newState = callback(state); return { filters: newState } })),
    setSorting: (callback) => (set((state) => { let newState = callback(state.sorting); if (!newState.length) return { sorting: [] }; return { sorting: [newState.at(-1)] }; })),
    setShowAddTeamModal: (show) => set({ showAddTeamModal: show }),
    // ✅ Setter for updateTeamDetail
    setUpdateTeamDetail: (newDetails) => set({ updateTeamDetail: newDetails }),
}));


export default useStore;