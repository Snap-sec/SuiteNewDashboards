import { create } from "zustand"

const THEME_STORAGE_KEY = "aperture-theme"

function getAppliedTheme() {
  if (typeof document === "undefined") {
    return "light"
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function applyTheme(theme) {
  if (typeof document === "undefined") {
    return
  }

  const isDark = theme === "dark"
  document.documentElement.classList.toggle("dark", isDark)
  document.documentElement.style.colorScheme = isDark ? "dark" : "light"
}

function persistTheme(theme) {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // The theme still applies for this session when storage is unavailable.
  }
}

export const useThemeStore = create((set, get) => ({
  theme: getAppliedTheme(),
  setTheme: (theme) => {
    applyTheme(theme)
    persistTheme(theme)
    set({ theme })
  },
  toggleTheme: () => {
    const nextTheme = get().theme === "dark" ? "light" : "dark"
    applyTheme(nextTheme)
    persistTheme(nextTheme)
    set({ theme: nextTheme })
  },
}))
