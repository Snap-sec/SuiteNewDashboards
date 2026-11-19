import {
  Card,
  CardHeader,
  CardTitle,
  CardTable,
  CardToolbar,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── CSV Export Helper ────────────────────────────────────────────────────────

function downloadCSV(filename, headers, rows) {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [
    headers.map(escape).join(','),
    ...rows.map((r) => r.map(escape).join(',')),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const STATES = ['Open', 'In Review', 'In Progress', 'Retest', 'Resolved', 'False Positive', 'Risk Accepted'];

const totalVulnsByState = [
  { state: 'Open', critical: 42, high: 87, medium: 134, low: 61, info: 12 },
  { state: 'In Review', critical: 8, high: 24, medium: 37, low: 18, info: 4 },
  { state: 'In Progress', critical: 11, high: 31, medium: 52, low: 22, info: 6 },
  { state: 'Retest', critical: 5, high: 12, medium: 19, low: 9, info: 2 },
  { state: 'Resolved', critical: 29, high: 68, medium: 112, low: 55, info: 20 },
  { state: 'False Positive', critical: 3, high: 9, medium: 14, low: 7, info: 3 },
  { state: 'Risk Accepted', critical: 6, high: 15, medium: 21, low: 11, info: 5 },
];

const businessUnits = ['Hala Go', 'Hala Now', 'Hala Control', 'Hala Financing', 'Hala Freelancer'];

const vulnsByBusinessUnit = [
  { bu: 'Hala Go', open: 54, in_review: 18, in_progress: 22, retest: 8, resolved: 71, false_positive: 5, risk_accepted: 9 },
  { bu: 'Hala Now', open: 31, in_review: 9, in_progress: 12, retest: 4, resolved: 38, false_positive: 3, risk_accepted: 6 },
  { bu: 'Hala Control', open: 18, in_review: 5, in_progress: 7, retest: 2, resolved: 22, false_positive: 2, risk_accepted: 3 },
  { bu: 'Hala Financing', open: 27, in_review: 10, in_progress: 9, retest: 5, resolved: 45, false_positive: 4, risk_accepted: 5 },
  { bu: 'Hala Freelancer', open: 13, in_review: 4, in_progress: 6, retest: 2, resolved: 28, false_positive: 2, risk_accepted: 4 },
];

const assetTypes = [
  { type: 'Web Application', count: 48, open: 36, in_review: 12, in_progress: 18, retest: 5, resolved: 64, false_positive: 4 },
  { type: 'API Endpoint', count: 124, open: 51, in_review: 19, in_progress: 24, retest: 7, resolved: 89, false_positive: 6 },
  { type: 'Cloud Resource', count: 76, open: 29, in_review: 10, in_progress: 14, retest: 4, resolved: 47, false_positive: 3 },
  { type: 'Network Device', count: 31, open: 17, in_review: 5, in_progress: 8, retest: 2, resolved: 22, false_positive: 1 },
  { type: 'Mobile Application', count: 22, open: 11, in_review: 4, in_progress: 6, retest: 1, resolved: 18, false_positive: 2 },
  { type: 'Database', count: 19, open: 9, in_review: 3, in_progress: 5, retest: 1, resolved: 13, false_positive: 1 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sum = (row, ...keys) => keys.reduce((acc, k) => acc + (row[k] || 0), 0);

function SevCount({ value }) {
  if (!value) return <span className="text-muted-foreground text-xs">—</span>;
  return <span className="tabular-nums">{value}</span>;
}

function TotalBadge({ value }) {
  return (
    <span
      data-slot="badge"
      className="inline-flex items-center justify-center border font-medium focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg]:-ms-px [&_svg]:shrink-0 rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs [&_svg]:size-3.5"
    >
      {value} Risks
    </span>
  );
}

// ─── Table 1 – Total Vulns per State ─────────────────────────────────────────

function TotalVulnsByStateTable() {
  const totals = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  totalVulnsByState.forEach((r) => {
    totals.critical += r.critical;
    totals.high += r.high;
    totals.medium += r.medium;
    totals.low += r.low;
    totals.info += r.info;
  });
  const grandTotal = sum(totals, 'critical', 'high', 'medium', 'low', 'info');

  const SEVERITIES = [
    { key: 'critical', label: 'Critical', severity: 'critical' },
    { key: 'high', label: 'High', severity: 'high' },
    { key: 'medium', label: 'Medium', severity: 'medium' },
    { key: 'low', label: 'Low', severity: 'low' },
    { key: 'info', label: 'Info', severity: 'info' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Vulnerabilities by State</CardTitle>
        <CardToolbar>
          <TotalBadge value={`${grandTotal} Total`} />
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              downloadCSV(
                'vulnerabilities-by-state.csv',
                ['Severity', ...totalVulnsByState.map((r) => r.state), 'Total'],
                SEVERITIES.map((sev) => [
                  sev.label,
                  ...totalVulnsByState.map((r) => r[sev.key]),
                  totals[sev.key],
                ]),
              )
            }
          >
            <Download size={14} />
            Export CSV
          </Button>
        </CardToolbar>
      </CardHeader>
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Severity</TableHead>
              {totalVulnsByState.map((r) => (
                <TableHead key={r.state} className="text-center whitespace-nowrap">
                  {r.state}
                </TableHead>
              ))}
              <TableHead className="text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SEVERITIES.map((sev) => (
              <TableRow key={sev.key}>
                <TableCell>{sev.label}</TableCell>
                {totalVulnsByState.map((r) => (
                  <TableCell key={r.state} className="text-center">
                    <SevCount value={r[sev.key]} />
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  <SevCount value={totals[sev.key]} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Total</TableCell>
              {totalVulnsByState.map((r) => {
                const t = sum(r, 'critical', 'high', 'medium', 'low', 'info');
                return (
                  <TableCell key={r.state} className="text-center">
                    <TotalBadge value={t} />
                  </TableCell>
                );
              })}
              <TableCell className="text-center"><TotalBadge value={grandTotal} /></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardTable>
    </Card>
  );
}

// ─── Table 2 – Vulns per State × Business Unit ───────────────────────────────

const BU_STATE_COLS = [
  { key: 'open', label: 'Open' },
  { key: 'in_review', label: 'In Review' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'retest', label: 'Retest' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'false_positive', label: 'False Positive' },
  { key: 'risk_accepted', label: 'Risk Accepted' },
];

function VulnsByBusinessUnitTable() {
  const colTotals = {};
  BU_STATE_COLS.forEach((c) => { colTotals[c.key] = 0; });
  vulnsByBusinessUnit.forEach((r) => BU_STATE_COLS.forEach((c) => { colTotals[c.key] += r[c.key] || 0; }));
  const grandTotal = Object.values(colTotals).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Vulnerabilities per Business Unit by State</CardTitle>
        <CardToolbar>
          <TotalBadge value={`${grandTotal} Total`} />
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              downloadCSV(
                'vulns-by-business-unit.csv',
                ['Business Unit', 'Open', 'In Review', 'In Progress', 'Retest', 'Resolved', 'False Positive', 'Risk Accepted', 'Total'],
                vulnsByBusinessUnit.map((r) => [
                  r.bu, r.open, r.in_review, r.in_progress, r.retest,
                  r.resolved, r.false_positive, r.risk_accepted,
                  BU_STATE_COLS.reduce((a, c) => a + (r[c.key] || 0), 0),
                ]),
              )
            }
          >
            <Download size={14} />
            Export CSV
          </Button>
        </CardToolbar>
      </CardHeader>
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-36">Business Unit</TableHead>
              {BU_STATE_COLS.map((c) => (
                <TableHead key={c.key} className="text-center whitespace-nowrap">
                  {c.label}
                </TableHead>
              ))}
              <TableHead className="text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vulnsByBusinessUnit.map((row) => {
              const rowTotal = BU_STATE_COLS.reduce((a, c) => a + (row[c.key] || 0), 0);
              return (
                <TableRow key={row.bu}>
                  <TableCell className="font-medium">{row.bu}</TableCell>
                  {BU_STATE_COLS.map((c) => (
                    <TableCell key={c.key} className="text-center">
                      <span className="tabular-nums">{row[c.key] ?? '—'}</span>
                    </TableCell>
                  ))}
                  <TableCell className="text-center"><TotalBadge value={rowTotal} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Total</TableCell>
              {BU_STATE_COLS.map((c) => (
                <TableCell key={c.key} className="text-center font-semibold tabular-nums">{colTotals[c.key]}</TableCell>
              ))}
              <TableCell className="text-center"><TotalBadge value={grandTotal} /></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardTable>
    </Card>
  );
}

// ─── Table 3 – Asset Type × Vulns per State ──────────────────────────────────

const ASSET_STATE_COLS = [
  { key: 'open', label: 'Open' },
  { key: 'in_review', label: 'In Review' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'retest', label: 'Retest' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'false_positive', label: 'False Positive' },
];

function VulnsByAssetTypeTable() {
  const colTotals = {};
  ASSET_STATE_COLS.forEach((c) => { colTotals[c.key] = 0; });
  assetTypes.forEach((r) => ASSET_STATE_COLS.forEach((c) => { colTotals[c.key] += r[c.key] || 0; }));
  const totalAssets = assetTypes.reduce((a, r) => a + r.count, 0);
  const grandTotal = Object.values(colTotals).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Vulnerabilities by Asset Type &amp; State</CardTitle>
        <CardToolbar>
          <Badge variant="outline" size="sm">{totalAssets} Assets</Badge>
          <TotalBadge value={`${grandTotal} Vulns`} />
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              downloadCSV(
                'vulns-by-asset-type.csv',
                ['Asset Type', 'Assets', 'Open', 'In Review', 'In Progress', 'Retest', 'Resolved', 'False Positive', 'Total Vulns'],
                assetTypes.map((r) => [
                  r.type, r.count, r.open, r.in_review, r.in_progress,
                  r.retest, r.resolved, r.false_positive,
                  ASSET_STATE_COLS.reduce((a, c) => a + (r[c.key] || 0), 0),
                ]),
              )
            }
          >
            <Download size={14} />
            Export CSV
          </Button>
        </CardToolbar>
      </CardHeader>
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-44">Asset Type</TableHead>
              <TableHead className="text-center">Assets</TableHead>
              {ASSET_STATE_COLS.map((c) => (
                <TableHead key={c.key} className="text-center whitespace-nowrap">
                  {c.label}
                </TableHead>
              ))}
              <TableHead className="text-center">Total Vulns</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assetTypes.map((row) => {
              const rowTotal = ASSET_STATE_COLS.reduce((a, c) => a + (row[c.key] || 0), 0);
              return (
                <TableRow key={row.type}>
                  <TableCell className="font-medium">{row.type}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" size="sm">{row.count}</Badge>
                  </TableCell>
                  {ASSET_STATE_COLS.map((c) => (
                    <TableCell key={c.key} className="text-center">
                      <span className="tabular-nums">{row[c.key] ?? '—'}</span>
                    </TableCell>
                  ))}
                  <TableCell className="text-center"><TotalBadge value={rowTotal} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Total</TableCell>
              <TableCell className="text-center font-semibold tabular-nums">{totalAssets}</TableCell>
              {ASSET_STATE_COLS.map((c) => (
                <TableCell key={c.key} className="text-center font-semibold tabular-nums">{colTotals[c.key]}</TableCell>
              ))}
              <TableCell className="text-center"><TotalBadge value={grandTotal} /></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardTable>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Metrics1Page() {
  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Vulnerability Metrics</h1>
        <p className="text-sm text-muted-foreground">
          Aggregated vulnerability state analytics across business units and asset types.
        </p>
      </div>

      {/* Table 1 – Totals by State */}
      <TotalVulnsByStateTable />

      {/* Table 2 – Business Unit × State */}
      <VulnsByBusinessUnitTable />

      {/* Table 3 – Asset Type × State */}
      <VulnsByAssetTypeTable />
    </div>
  );
}
