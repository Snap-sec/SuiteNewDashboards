import { create } from 'zustand';

const useStore = create((set) => ({
  pagination: { pageIndex: 0, pageSize: 12 },
  searchQuery: '',
  setPagination: (pagination) => set({ pagination }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));

export default useStore;
