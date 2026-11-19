import { create } from 'zustand';


const useStore = create((set) => ({
    pagination: { pageIndex: 0, pageSize: 10 },  // for tanstack table
    searchQuery: "",
    filters: {},
    sorting: [],

    rowSelection: {},
    setRowSelection: (callback) =>
      set((state) => {
        let newState =
          typeof callback === 'function'
            ? callback(state.rowSelection)
            : callback;
        return { rowSelection: newState };
      }),
    setPagination: (callback) => (set((state) => { let newState = callback(state.pagination); return { pagination: newState }; })),   // for tanstack table (passes callback)
    setSearchQuery: (search) => (set(() => ({ searchQuery: search }))),
    setFilters: (callback) => (set((state) => { let newState = callback(state); return { filters: newState } })),
    setSorting: (callback) => (set((state) => { let newState = callback(state.sorting); if (!newState.length) return { sorting: [] }; return { sorting: [newState.at(-1)] }; }))
}));


export default useStore;