# Aperture — ASM Dashboards

Three attack-surface management dashboards built from the `surface-command.html` reference. React 19, JavaScript (no TypeScript), Vite, React Router, Tailwind CSS v4, zustand, and ReUI components on shadcn/ui (base-nova, Base UI).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## Stack notes

- **Routes**: React Router. `/` **Surface command** (analyst overview), `/dashboard2` **Exposure operations** (enterprise console), `/dashboard3` **Executive risk posture** (board briefing). The top-bar view switcher moves between them. These are client-side routes; production hosting needs an SPA fallback to `index.html`.
- **App shells**: shadcn `Sidebar` in icon-rail mode on Surface command, an expanded labelled `Sidebar` on Exposure operations, and a horizontal top navigation on Executive posture. All become compact on mobile.
- **Containers**: ReUI `Frame` panels throughout. Data regions use `data-grid`; filtering uses the ReUI `filters` bar; the remediation board uses ReUI `kanban`; timelines use ReUI `timeline`; state uses ReUI `Badge` `-light` variants.
- **State**: each page owns a zustand store (`src/pages/<page>/store/`) for refresh/loading/error and page-specific search/filter state. Board and notification state are local to their components, seeded from the mock response.
- **Mock API**: each page has exactly one `mock/response.json`. The page entry imports it once and passes slices down as props; components never import fixture modules or JSON directly.
- **Theme**: light/dark switch in the top bar. The first visit follows the OS; the choice persists in localStorage (`aperture-theme`), and the pre-paint bootstrap in `index.html` applies it before React mounts. Sonner toasts follow the selected theme.
- **Charts**: Recharts inside the shadcn `ChartContainer`, with static or toggle-free series, accessible summaries and custom legends.

## Pages

Each page is self-contained under `src/pages/<page-name>/`:

```text
src/pages/dashboard/            # Surface command
src/pages/dashboard2/           # Exposure operations
src/pages/dashboard3/           # Executive risk posture
  index.jsx                     # page entry: imports mock response, composes shell
  components/                   # every page component, data passed via props
  mock/response.json            # one API-shaped payload for the page
  store/use-dashboard-store.js  # page-scoped zustand UI state
  lib/                          # optional page helpers
```

New pages get a new folder under `src/pages/` with their own `index.jsx`, `components/` and `mock/response.json`. See `src/pages/README.md` for the full convention. Shared design-system primitives remain in `src/components/ui/` and `src/components/reui/`; shared app-level controls such as the theme toggle and view switcher live in `src/components/`, and global stores in `src/store/`.

The mock JSON is the page's single source of data. Each page entry imports it once and passes slices down; derived values such as matrix totals, flow totals and critical counts are computed in the components rather than duplicated in the response.

## Interactions

- Use the view switcher in the top bar to move between the three ASM dashboards.
- Use the sun/moon button in the top bar to switch between light and dark mode; the choice persists across reloads.
- **Surface command**: `⌘K` / `Ctrl K` focuses search; `Enter` jumps to the priority queue, `Escape` clears it. New scan opens a dialog; drag remediation cards; expand weekly data; notifications and mark-all-read.
- **Exposure operations**: search and the ReUI filter bar filter the findings table, with pagination, an empty state and Clear filters. Export and Run scan toast. The 12-week trend fills its panel.
- **Executive risk posture**: in-page section navigation, board pack toast, board decisions, regulatory readiness and a remediation-velocity chart.
- Every page shows per-region skeletons on refresh; refreshing while offline switches every region to an inline error with Retry.
# SuiteNewDashboards
