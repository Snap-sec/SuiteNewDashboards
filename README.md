# Aperture — Surface Command

An attack-surface command dashboard built from the `surface-command.html` reference. React 19, JavaScript (no TypeScript), Vite, Tailwind CSS v4, zustand, and ReUI components on shadcn/ui (base-nova, Base UI).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## Stack notes

- **App shell**: shadcn `Sidebar` in icon-rail mode, with a Sheet on mobile.
- **Containers**: ReUI `Frame` panels throughout. Data regions use `data-grid`; the remediation board uses ReUI `kanban`; the change feed uses ReUI `timeline`; state uses ReUI `Badge` `-light` variants.
- **State**: zustand in `src/pages/dashboard/store/use-dashboard-store.js` owns search, refresh/loading/error state, notifications, and the persisted board.
- **Theme**: light/dark switch in the top bar. The first visit follows the OS; the choice persists in localStorage (`aperture-theme`), and the pre-paint bootstrap in `index.html` applies it before React mounts. Sonner toasts follow the selected theme.
- **Charts**: Recharts inside the shadcn `ChartContainer`, with the exact weekly counts available in the collapsible `data-grid` table.

## Pages

The dashboard is a self-contained page under `src/pages/dashboard/`:

```text
src/pages/dashboard/
  index.jsx                    # page entry: shell + content
  components/                  # every dashboard component
  data/dashboard.js            # page fixtures
  store/use-dashboard-store.js # page-scoped zustand store
  lib/severity.js              # page-specific helper
```

New pages get a new folder under `src/pages/` with their own `index.jsx` and `components/`. See `src/pages/README.md` for the full convention. Shared design-system primitives remain in `src/components/ui/` and `src/components/reui/`; shared app-level controls such as the theme toggle live in `src/components/`, and shared stores in `src/store/`.

## Interactions

- Use the sun/moon button in the top bar to switch between light and dark mode; the choice persists across reloads.
- `⌘K` / `Ctrl K` focuses search; `Enter` jumps to the priority queue, `Escape` clears it.
- **New scan** opens a dialog; queueing shows a Sonner toast.
- **Refresh** shows per-region skeletons. Refreshing while offline shows inline errors with Retry.
- Priority queue search has an empty state and a Clear search action.
- Drag remediation cards between Triage, In progress and Verify; counts and a toast update through zustand.
- **Weekly data** expands a scrollable, sticky-header data grid.
- Notifications open in a popover; Mark all read clears the unread state.
# SuiteNewDashboards
