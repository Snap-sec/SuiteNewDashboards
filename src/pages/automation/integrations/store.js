import { create } from 'zustand';

const useStore = create((set) => ({
  showInstallModal: { type: "" },
  showConfigModal: null,
  selectedTab: "all-integrations",

  setShowInstallModal: (show) => set((state) => ({ ...state, showInstallModal: show })),
  setShowConfigModal: (adapter) => set((state) => ({ ...state, showConfigModal: adapter })),
  setSelectedTab: (tab) => set((state) => ({ ...state, selectedTab: tab })),

  searchQuery: '',
  pagination: { pageIndex: 0, pageSize: 10 },
  filters: {},
  activeView: localStorage.getItem('automation_integrations_view') ?? 'list',
  sorting: [],
  rowSelection: {},

  setSearchQuery: (query) => set({ searchQuery: query }),
  setPagination: (updater) =>
    set((state) => ({
      pagination:
        typeof updater === 'function' ? updater(state.pagination) : updater,
    })),
  setPage: (page) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        pageIndex: Math.max((page || 1) - 1, 0),
      },
    })),
  setLimit: (limit) =>
    set((state) => ({
      pagination: { ...state.pagination, pageSize: limit },
    })),
  setFilters: (callback) =>
    set((state) => {
      const newState =
        typeof callback === 'function' ? callback(state.filters) : callback;
      return { filters: newState || {} };
    }),
  setActiveView: (view) => {
    localStorage.setItem('automation_integrations_view', view);
    set({ activeView: view });
  },
  setSorting: (callback) =>
    set((state) => {
      const next =
        typeof callback === 'function' ? callback(state.sorting) : callback;
      if (!Array.isArray(next) || !next.length) return { sorting: [] };
      return { sorting: [next.at(-1)] };
    }),
  setRowSelection: (callback) =>
    set((state) => ({
      rowSelection:
        typeof callback === 'function'
          ? callback(state.rowSelection)
          : callback || {},
    })),
}));

export { useStore };