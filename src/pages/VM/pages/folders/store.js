import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set) => ({
            query: '',
            currentPath: [],

            setQuery: (query) => set({ query }),
            setCurrentPath: (path) => set({ currentPath: path }),
            resetPath: () => set({ currentPath: [] }),
        }),
        {
            name: 'vm-folders-storage',
            partialize: (state) => ({ currentPath: state.currentPath }),
        }
    )
);

export default useStore;
