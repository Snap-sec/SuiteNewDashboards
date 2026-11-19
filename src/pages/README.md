# Page structure

Every page owns a folder under `src/pages/<page-name>/`:

```text
src/pages/<page-name>/
  index.jsx        # page entry: shell + layout + the page content
  components/      # every component used only by this page
  data/            # optional: page fixtures and static data
  store/           # optional: page-scoped zustand stores
  lib/             # optional: page-specific helpers
```

Rules:

- All page-specific UI belongs in that page's `components/` folder. Do not put page components in `src/components/` or another page's folder.
- Shared design-system primitives stay in `src/components/ui/` and `src/components/reui/`.
- Shared app-level controls (for example `src/components/theme-toggle.jsx`) and global stores (for example `src/store/use-theme-store.js`) stay global.
- App entry files (`src/App.jsx`, providers, global toaster) stay global; they import the page entry from `src/pages/<page-name>`.
- A new page gets a new folder with its own `index.jsx` and `components/`; extract anything genuinely shared into `src/components/` only when a second page needs it.

Current pages:

- `dashboard/` — Surface command overview (reference: `surface-command.html`).
