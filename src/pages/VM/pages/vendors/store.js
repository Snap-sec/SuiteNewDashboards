import { create } from 'zustand';

const useStore = create((set) => ({
    pagination: { pageIndex: 0, pageSize: 10 },
    searchQuery: "",
    filters: {},
    sorting: [],
    rowSelection: {},

    setPagination: (callback) => (set((state) => { 
        const newState = typeof callback === 'function' ? callback(state.pagination) : callback;
        return { pagination: newState }; 
    })),
    setSearchQuery: (search) => (set(() => ({ searchQuery: search }))),
    setFilters: (callback) => (set((state) => { 
        const newState = typeof callback === 'function' ? callback(state.filters) : callback;
        return { filters: newState } 
    })),
    setSorting: (callback) => (set((state) => { 
        const newState = typeof callback === 'function' ? callback(state.sorting) : callback;
        if (!newState.length) return { sorting: [] }; 
        return { sorting: [newState.at(-1)] }; 
    })),
    setRowSelection: (callback) => (set((state) => { 
        const newState = typeof callback === 'function' ? callback(state.rowSelection) : callback;
        return { rowSelection: newState }; 
    }))
}));

export default useStore;
