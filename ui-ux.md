

Design Instruction
==================

# Attack Surface Management — UI/UX Design Skill

Use this as the visual contract for new attack-surface, exposure, and security-overview screens. It captures the current executive dashboard language. Follow the values; do not introduce a new visual style.

## 1. Design intent

- **Calm, factual, data-first.** The interface should feel like a security briefing, not a marketing page.
- **White-on-white surfaces.** Panels are white, separated from the canvas by a 1px neutral border and a barely visible shadow — not by gray fills, gradients, or heavy elevation.
- **Quiet structure, loud data.** Headings recede into gray; numbers, labels, and chart marks carry the emphasis.
- **Color belongs to data.** Neutral ink and surfaces dominate. Saturated color appears only in chart marks, category chips, or semantic state.
- **No decorative motion.** No page-load choreography, staggered reveals, panel lifts, or hover scaling. Feedback is a subtle tint or opacity change.
- **Dense but airy.** One clear job per panel, generous padding, no nested panels, no ornamental summaries.

## 2. Canvas and rhythm

- Page inset: **16px** on every side; fluid width.
- Vertical rhythm: **24px** between major bands.
- Panel grid gap: **20–24px**.
- Spacing scale: **4, 8, 12, 16, 20, 24, 32px**. Nothing arbitrary.
- Screen order:
  1. Page header — title, one-line description, optional single icon action at top right.
  2. **24px**
  3. Full-width metric strip.
  4. **24px**
  5. Three equal analytical panels.
  6. **24px**
  7. Full-width data table.
- Page header anatomy:
  - Title: **20px / 500 / 1.0 line-height**, near-black.
  - Description: **14px / 400 / 1.43**, secondary gray.
  - Gap between title and description: **8px**.
  - Header bottom margin: **20px**.
  - The single top-right action is a **32px** ghost or outline icon box with a **16px** line icon. No primary CTA unless a real workflow needs one.

## 3. Panels (the main surface)

- Background: **#FFFFFF** (light) / **#09090B** (dark).
- Border: **1px solid #ECECEE** (light) / **#27272A** (dark).
- Radius: **12px**.
- Shadow: **0 1px 2px rgba(0,0,0,0.05)** — that is the entire elevation budget.
- No panel inside another panel. No tinted headers. No gradient fills.
- Panel header:
  - Height: **56px**.
  - Horizontal padding: **20px**.
  - Bottom border: **1px solid #ECECEE** (dark: #27272A).
  - Title: **14px / 400 / 1.0**, **#6B7280**, letter-spacing **-0.35px**. Title case.
  - Optional context-help icon: **16px** outline icon, **60% opacity**, placed **8px** after the title, inside a **28–32px** hit area.
  - Do not right-align panel actions in this header; keep it editorial and quiet.
- Panel body:
  - Padding: **20px** all around.
  - Standard plot area: **300px tall**; panel content becomes **340px** including padding.
  - Data-table body is flush to the panel edge: horizontal padding **0**, header stays at **20px**.
- Dark mode uses the same geometry: near-black surface, zinc-800 border, zinc-50 primary ink, zinc-400 secondary ink.

## 4. Typography

Font: **Inter** (or the product’s current sans). Use **tabular numerals** for every metric, axis value, table number, and chart label.

| Role | Size | Weight | Line-height | Color | Notes |
|---|---:|---:|---:|---|---|
| Page title | 20px | 500 | 1.0 | #09090B | No tracking change |
| Page description | 14px | 400 | 1.43 | #52525B | One line, one clause |
| Panel title | 14px | 400 | 1.0 | #6B7280 | tracking **-0.35px** |
| Metric value | 24px | 600 | 1.0 | #09090B | Centered |
| Metric label | 14px | 400 | 1.43 | #52525B | Centered, 4px below value |
| Body / table text | 14px | 400 | 1.43 | #3F3F46 | Default reading size |
| Row emphasis | 14px | 500 | 1.43 | #09090B | Names, labels, table values |
| Meta / units | 12px | 400 | 1.33 | #A1A1AA | Units, timestamps |
| Chart axis | 11px | 400 | 1.2 | #A1A1AA | Muted, no axis lines |
| Bar value label | 12px | 500 | 1.0 | #09090B | Direct above bar |
| Donut center value | 30px | 700 | 1.0 | #3F3F46 | Tabular |
| Donut center label | 12px | 400 | 1.33 | #A1A1AA | Direct under value |
| Chart legend | 12px | 400 | 1.33 | #52525B | 8px square swatch |
| Context help body | 14px | 400 | 1.43 | #52525B | 300px max width |

- Sentence case for descriptive copy; title case for page, panel, and metric labels.
- No all-caps labels, no letter-spaced eyebrow text.
- Never use type below **11px**. Donut center labels may use **10–12px** only at small sizes.

## 5. Metric strip

A single full-width panel with **no heading**.

- Height: **~102px**.
- Content inset: **20px**; inner vertical breathing room **6px**.
- Desktop: **4 equal segments** (maximum 6).
- Each segment: centered, **24px/600** number, **4px** gap, **14px/400** secondary label.
- Dividers: **1px #E4E4E7**, inset **4px** from top and bottom.
- No icons, no delta chips, no colored values, no sparklines in the strip. If a trend matters, give it its own analytical panel.
- A short date (e.g. “Nov 22, 2026”) may occupy one segment and uses the same metric-value style.

## 6. Analytical panels

- Three equal-width panels in one row on desktop; equal height.
- No panel descriptions when the title is sufficient. If needed: 14px/400 secondary, directly under the title.
- Chart panel composition: 56px header + 20px padding + 300px plot + 20px padding = **398px** total.
- Table panel: title header, then a flush data table. No footer unless pagination is genuinely needed.
- Keep one focal mark per panel: a single bar series, a single donut, or one table.
- No more than three analytical panels in a row. If the story needs more, add another band.

## 7. Charts

### Category color system

Assign colors in fixed order and keep a category’s color stable when filters change. Never cycle beyond 8 categories; fold the rest into “Other.”

**Asset categories**

| Order | Hex |
|---:|---|
| 1 | `#0EA5E9` sky |
| 2 | `#10B981` emerald |
| 3 | `#F59E0B` amber |
| 4 | `#F43F5E` rose |
| 5 | `#8B5CF6` violet |
| 6 | `#64748B` slate |
| 7 | `#14B8A6` teal |
| 8 | `#D946EF` fuchsia |

**Exposure / risk categories**

| Order | Hex |
|---:|---|
| 1 | `#F43F5E` rose |
| 2 | `#F97316` orange |
| 3 | `#F59E0B` amber |
| 4 | `#8B5CF6` violet |
| 5 | `#0EA5E9` sky |
| 6 | `#10B981` emerald |
| 7 | `#64748B` slate |
| 8 | `#D946EF` fuchsia |

These palettes are for categories only. Do not reuse them for healthy/warning/critical states.

### Bar chart

- Vertical bars, one series; category identity through fill.
- No y-axis. Horizontal grid only, very low contrast.
- Bar top radius **4px**; bars grow from the baseline.
- Value label above each bar: **12px / 500**, foreground.
- X labels: **11px**, muted, truncated around **10 characters** with an ellipsis.
- Plot height **300px**. Generous space above the tallest bar for the label.
- Prefer 4–8 bars. Do not use grouped or stacked bars unless the comparison requires it.

### Donut chart

- Ring thickness: inner radius **65%**, outer radius **90%**.
- Segment gap: **3°**; segment ends: **5px** radius.
- Separator stroke: **1px** in the surface color.
- Center: value **30px / 700 / tabular**, label **12px / 400 / muted**, stacked with a **2–4px** gap.
- Legend: centered below the ring, **12px**, **8px** square swatches with **2px** radius, **16px** between items, **6px** between swatch and label.
- On narrow widths, the legend scrolls horizontally; never wrap it into a tall block.
- Maximum 8 meaningful segments. Prefer 3–6.

### Chart hover readout + context help

- Surface: panel background, **1px** neutral border, **8px** radius, large soft shadow.
- Text: **12px**; title **12px / 500** separated by a **1px** bottom border; body label muted, value **12px / 600 / tabular**.
- Color swatch: **8px** square, **2px** radius.
- Help bubble: max width **300px**; title **14px / 500** with a bottom border; body **14px** muted; **16px** padding.

### Chart rules

- No gradients, dual axes, 3D, pie charts beyond 8 slices, or heavy gridlines.
- One color per category, fixed order.
- Label the data directly: bar values above bars; donut total in the center; legend present for 2+ series.
- No entrance animation or animated value counting. Charts appear complete.

## 8. Data tables

- Full-width panel; table flush to the panel edge.
- Header row: **40px**, fill **#FAFAFA** (dark: zinc-900), **1px** bottom and column separators.
- Header labels: **13px / 400**, secondary gray, with a **6px** radius hover surface and **8px** horizontal padding.
- Body rows: **~49px**, padding **12px 16px**, **14px / 400**, text **#3F3F46**.
- Grid: **1px #ECECEE** vertical and horizontal lines. No zebra striping.
- Row hover: **#FAFAFA** (dark: zinc-900/50). No lift, no colored row.
- First column:
  - **24px** icon tile, **6px** radius, **1px** border, **#F4F4F5** fill, muted **12px** icon.
  - Label **14px / 500**, near-black, **8px** after the tile.
- Numeric cells: value **14px / 500** + unit **12px / 400 / muted**, **4px** apart, aligned on the baseline.
- Avoid dense status chips. Use a chip only for a single primary state or category per row.
- Pagination, if required, stays visually quiet: 12–14px muted text, 28–32px ghost controls.

## 9. Color and state rules

- Neutrals carry the interface; color carries data identity or a meaningful state.
- Product accent for links, focus, or active navigation: **#1379F0**. Do not use it as a chart category.
- Semantic states (outside charts): positive **#22C55E**, warning **#EAB308**, high **#F97316**, critical **#DC2626**. Pair state color with a label or icon; never color alone.
- Categorical chart colors must never double as status colors.
- In dark mode, keep the same category order; use the dark-surface equivalents and preserve contrast.

## 10. Data states

- **Loading:** placeholder blocks that match the final shape and size — 24px-wide number blocks, 14px label blocks, ring/bar placeholders. No spinners, no full-panel loader.
- **Empty chart:** preserve the full 300px plot region; center “No data available” at **14px** muted.
- **Empty page:** centered illustration up to **230px** tall, short title, one-line explanation, one action. Keep it calm.
- **Error:** page-level failure replaces the dashboard with a concise error screen; partial data failures stay inline in the affected panel.
- **Hover:** surface tint, icon opacity, or link color only. No scale, lift, glow, or shadow change.

## 11. Responsive behavior

- **≥1024px:** 4-across metric strip; 3-across analytical panels; full table.
- **768–1023px:** 2×2 metric strip; one or two analytical panels per row; full-width table.
- **<768px:** one metric segment per row or 2×2; one panel per row; page padding stays **16px**; tables scroll horizontally inside their panel, never the page.
- Never shrink plots below **280px** height. Reflow instead.
- Keep the header action reachable by wrapping it below the title block.

## 12. Do / Don’t

**Do**
- Use white panels, 1px neutral borders, 12px radius, and a 5% black 1–2px shadow.
- Let section titles be small, gray, and normal-weight.
- Lead with exact numbers, direct labels, and one chart per question.
- Keep 24px vertical rhythm and equal-height panels.
- Use the categorical palettes in order and keep category colors stable.
- Leave generous space around the tallest bar and inside the donut ring.

**Don’t**
- No gradients, glass, colored panel headers, heavy shadows, or decorative illustrations inside panels.
- No oversized hero headings; the page title stays 20px.
- No all-caps tracked labels or tiny sub-10px copy.
- No icons or trend chips inside the metric strip.
- No nested panels or double borders.
- No dual-axis charts, rainbow palettes, pie charts with many slices, or animated entrances.
- No more than one primary action on a screen, and none unless the workflow requires it.

## 13. Quick review checklist

- [ ] 16px page inset; 24px between bands.
- [ ] Panels: white, 1px #ECECEE border, 12px radius, 0 1px 2px rgba(0,0,0,0.05) shadow.
- [ ] Panel header: 56px, 20px inset, 14px/400 #6B7280 title with -0.35px tracking.
- [ ] Metric strip: one bare panel, 4 equal segments, 24px/600 values, 14px labels, 1px inset dividers.
- [ ] Charts: 300px plot; labels/legend present; category colors in fixed order; no gradients.
- [ ] Table: 40px header, 49px rows, 1px grid, 12×16px cell padding, 12px muted units.
- [ ] Color appears only in data or state; structure is neutral.
- [ ] Loading uses shaped placeholders; empty and error states exist.
- [ ] No lift, scale, stagger, or entrance motion.
- [ ] Mobile reflows to one column; table scrolls inside its panel.




### Advanced Dashboard Intelligence & Design Reasoning

Before designing any dashboard, think deeply about the data, its relationships, and the insights the user should gain. Do not default to conventional charts, tables, KPI cards, or generic dashboard layouts. First, develop a comprehensive visualization strategy that identifies the most meaningful ways to represent the information.

Think like a **senior product designer, data visualization expert, and enterprise analytics architect**. Explore creative and advanced visualization patterns such as interactive graphs, heatmaps, risk matrices, radial visualizations, treemaps, flow diagrams, timelines, topology maps, comparative visualizations, drill-down analytics, and contextual data representations.

Every element must serve a purpose: communicate an insight, reveal a pattern, highlight a risk, show relationships, or support a decision. Prioritize visual hierarchy, information density, meaningful interactions, contextual insights, and intuitive exploration.

**The objective is to build a sophisticated, enterprise-grade analytical experience — not a collection of charts and tables.** Challenge conventional layouts, explore better ways to visualize the data, and choose the most effective representation for each dataset. Never sacrifice usability or clarity for visual complexity.






### Intelligent Component Selection & Visualization Standards

Do not automatically reach for basic tables, pie charts, bar charts, or generic KPI cards. Before implementing any section, evaluate the available UI component library and select the most appropriate components based on the nature of the data, user intent, and analytical purpose.

Think beyond conventional components. Consider advanced UI patterns such as:
- **Data Visualization:** Interactive heatmaps, treemaps, sunburst charts, Sankey diagrams, radar charts, bubble charts, chord diagrams, and network graphs.
- **Analytical Components:** Risk matrices, severity distributions, trend indicators, comparison panels, anomaly highlights, and statistical summaries.
- **Relationship Mapping:** Interactive asset graphs, attack-path visualizations, dependency maps, topology diagrams, and hierarchical trees.
- **Operational Components:** Progress rings, status timelines, activity streams, SLA indicators, workflow visualizations, and remediation funnels.
- **Interactive Components:** Expandable drill-down panels, segmented views, contextual filters, interactive legends, and detail-on-demand overlays.

**Mandatory design rules:**
1. Explore the existing component library before creating new components.
2. Select components based on what communicates the data most effectively, not what is easiest to implement.
3. Avoid repeating the same visualization pattern across different dashboard sections.
4. Use tables only when users genuinely need to inspect, compare, or act on individual records.
5. Use pie charts only when showing meaningful part-to-whole relationships; prefer richer alternatives where appropriate.
6. Combine visualizations with contextual insights, annotations, trends, and actionable information.
7. Reuse existing design-system components and styling conventions. Do not introduce arbitrary visual styles or unnecessary dependencies.
8. Ensure every advanced component remains intuitive, responsive, accessible, and genuinely interactive.

**Quality benchmark:** Every dashboard section should look intentionally designed by an experienced enterprise SaaS product team. If a component looks like a default chart-library example or a generic admin template, rethink and redesign it.





Folders Structure for Desingin new pages
========================================
For each page design a new folder inside the module - for example if we have to build Dashboard3 for ASM, make a new folder in in ASM called Dashboard3 and inside that following this structure.  

{pageName}/components => save all components
{newPage}/data/response.json => a http response that will be imported to page as if its a full json response

> Note that for the mock data - use single response.json file which will export a single json response(text) to the page not different exports



Donot Inherit or read our desings
=================================
- You are not allowed to read our current pages at /src/pages 
- Donot consider the current designs because they are very bad
- Use your own designing Skills and Knowledge to make nice, professional designs


Donot use our custom Compoentns
===============================
- You are not allowed to read our custom components /components/custom
- You should use re-ui for any components


Using Re-ui
===========
- You can read the list components of reui from https://reui.io/llms.txt to see the avilable components in UI
- Use these components to plan new UI
- You also have access to reui MCP


Your End Goal
=============
The goal is to make a ready to use enterprise grade UI/UX that is very good looking from the design point of view


Task
===
Make a new dashboard page on /casm/dashboard5 - The goal is to make a new dashboard for Aattack Surface management Dashboard for CISO


in the page is need the following information to be visualized in the best possible manner

- Big elemetns showing overall risk of org in 100 - a circular graph of top left conor
- showing changes in Attack surface and rate of exposures over the time (in chart)
- top 5 Cirittcal Exposures
- Distribution of exposure over different asset type in heatmap
- Latest Surface changes
- and anything else that you would like to show 

