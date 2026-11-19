import { create } from "zustand"

import { initialBoard, initialNotifications } from "../data/dashboard"

const REGIONS = [
  "summary",
  "pressure",
  "score",
  "scan",
  "matrix",
  "queue",
  "board",
  "timeline",
]

function regionStatuses(value) {
  return Object.fromEntries(REGIONS.map((region) => [region, value]))
}

const initialRegionStatus = regionStatuses("ready")

export const useDashboardStore = create((set, get) => ({
  query: "",
  setQuery: (query) => set({ query }),

  lastUpdated: "Updated 4 min ago",
  isRefreshing: false,
  regionStatus: initialRegionStatus,

  refresh: async () => {
    if (get().isRefreshing) {
      return true
    }

    set({ isRefreshing: true, regionStatus: regionStatuses("loading") })
    await new Promise((resolve) => setTimeout(resolve, 750))

    const isOnline =
      typeof navigator === "undefined" ? true : navigator.onLine !== false

    if (!isOnline) {
      set({ isRefreshing: false, regionStatus: regionStatuses("error") })
      return false
    }

    set({
      isRefreshing: false,
      regionStatus: initialRegionStatus,
      lastUpdated: "Updated just now",
    })
    return true
  },

  notifications: initialNotifications,
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    })),

  board: initialBoard,
  commitBoard: (board) => set({ board }),
  resetBoard: () => set({ board: initialBoard }),
}))
