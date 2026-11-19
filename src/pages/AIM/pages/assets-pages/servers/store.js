import { create } from 'zustand';

const useStore = create((set) => ({
    pagination: { pageIndex: 0, pageSize: 10 },
    searchQuery: '',
    filters: {},
    sorting: [],

    setPagination: (callback) =>
        set((state) => {
            let newState = callback(state.pagination);
            return { pagination: newState };
        }),

    setSearchQuery: (search) => set(() => ({ searchQuery: search })),

    setSorting: (callback) =>
        set((state) => {
            let newState = callback(state.sorting);
            if (!newState.length) return { sorting: [] };
            return { sorting: [newState.at(-1)] };
        }),

    setFilters: (callback) =>
        set((state) => {
            if (
                typeof callback === 'function' &&
                Object.keys(callback(state.filters)).length === 0
            ) {
                return { filters: {} };
            }
            let newState =
                typeof callback === 'function' ? callback(state.filters) : callback;
            return { filters: newState };
        }),
}));

export default useStore;
