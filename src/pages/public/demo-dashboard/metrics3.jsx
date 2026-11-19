import {
    Card,
    CardHeader,
    CardTitle,
    CardTable,
    CardToolbar,
    CardContent,
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
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Building2,
    Download,
    ShieldAlert,
    Server,
    TrendingDown,
    TrendingUp,
    Flame,
} from 'lucide-react';

// ─── CSV Export Helper ────────────────────────────────────────────────────────

function downloadCSV(filename, headers, rows) {
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const departments = [
    {
        id: 'hala-go',
        name: 'Hala Go',
        color: 'text-violet-600 dark:text-violet-400',
        riskScore: 82,
        riskTrend: 'up',
        totalAssets: 72,
        totalVulns: 187,
        open: 116,
        resolved: 71,
        overdue: 40,
        critical: 18, high: 54, medium: 79, low: 30, info: 6,
        assetTypes: { web: 28, api: 24, cloud: 12, mobile: 5, db: 3 },
        topFindings: [
            { title: 'SQL Injection – Checkout API', severity: 'critical', state: 'open', asset: 'checkout-api.hala.com' },
            { title: 'Hardcoded JWT Secret', severity: 'high', state: 'in progress', asset: 'auth-service' },
            { title: 'Missing Rate Limiting on Login', severity: 'high', state: 'in review', asset: 'api.halago.com' },
        ],
    },
    {
        id: 'hala-now',
        name: 'Hala Now',
        color: 'text-blue-600 dark:text-blue-400',
        riskScore: 61,
        riskTrend: 'down',
        totalAssets: 45,
        totalVulns: 103,
        open: 58,
        resolved: 45,
        overdue: 20,
        critical: 5, high: 28, medium: 44, low: 22, info: 4,
        assetTypes: { web: 14, api: 18, cloud: 9, mobile: 3, db: 1 },
        topFindings: [
            { title: 'IDOR on Order Tracking', severity: 'high', state: 'open', asset: 'orders.halanow.com' },
            { title: 'Open Redirect in SSO Callback', severity: 'high', state: 'retest', asset: 'sso.halanow.com' },
            { title: 'Verbose Error Messages', severity: 'medium', state: 'in progress', asset: 'api.halanow.com' },
        ],
    },
    {
        id: 'hala-control',
        name: 'Hala Control',
        color: 'text-green-600 dark:text-green-400',
        riskScore: 49,
        riskTrend: 'down',
        totalAssets: 31,
        totalVulns: 59,
        open: 31,
        resolved: 28,
        overdue: 9,
        critical: 3, high: 14, medium: 28, low: 12, info: 2,
        assetTypes: { web: 10, api: 12, cloud: 6, mobile: 2, db: 1 },
        topFindings: [
            { title: 'Broken Access Control – Admin APIs', severity: 'critical', state: 'in review', asset: 'admin.halacontrol.com' },
            { title: 'Unencrypted PII in Logs', severity: 'high', state: 'open', asset: 'log-service' },
            { title: 'Outdated TLS Version (TLS 1.0)', severity: 'medium', state: 'resolved', asset: 'dashboard.halacontrol.com' },
        ],
    },
    {
        id: 'hala-financing',
        name: 'Hala Financing',
        color: 'text-orange-600 dark:text-orange-400',
        riskScore: 77,
        riskTrend: 'up',
        totalAssets: 53,
        totalVulns: 105,
        open: 53,
        resolved: 52,
        overdue: 16,
        critical: 12, high: 31, medium: 42, low: 17, info: 3,
        assetTypes: { web: 18, api: 20, cloud: 9, mobile: 4, db: 2 },
        topFindings: [
            { title: 'Insecure Deserialization', severity: 'critical', state: 'open', asset: 'payment-gateway' },
            { title: 'Weak Password Policy', severity: 'high', state: 'in progress', asset: 'portal.halafinancing.com' },
            { title: 'SSRF via Webhook URL', severity: 'high', state: 'open', asset: 'webhooks.halafinancing.com' },
        ],
    },
    {
        id: 'hala-freelancer',
        name: 'Hala Freelancer',
        color: 'text-pink-600 dark:text-pink-400',
        riskScore: 55,
        riskTrend: 'down',
        totalAssets: 29,
        totalVulns: 59,
        open: 28,
        resolved: 31,
        overdue: 10,
        critical: 4, high: 14, medium: 26, low: 13, info: 2,
        assetTypes: { web: 10, api: 11, cloud: 5, mobile: 2, db: 1 },
        topFindings: [
            { title: 'XSS in Profile Bio Field', severity: 'high', state: 'resolved', asset: 'app.halafreelancer.com' },
            { title: 'Missing CSP Header', severity: 'medium', state: 'in progress', asset: 'www.halafreelancer.com' },
            { title: 'Exposed Internal API Docs', severity: 'medium', state: 'open', asset: 'docs.halafreelancer.com' },
        ],
    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function TotalBadge({ value }) {
    return <Badge variant="secondary" size="sm" className="font-semibold tabular-nums">{value}</Badge>;
}

function pct(done, total) {
    return total ? Math.round((done / total) * 100) : 0;
}

function RiskScore({ score, trend }) {
    const color =
        score >= 75 ? 'text-red-600 dark:text-red-400' :
            score >= 50 ? 'text-orange-500 dark:text-orange-400' :
                'text-green-600 dark:text-green-400';
    return (
        <div className={`flex items-center gap-1 font-bold tabular-nums text-base ${color}`}>
            {score}
            {trend === 'up'
                ? <TrendingDown size={14} className="text-red-500" />
                : <TrendingUp size={14} className="text-green-500" />}
        </div>
    );
}

// ─── Department KPI Cards ─────────────────────────────────────────────────────

function DeptKpiCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {departments.map((d) => (
                <Card key={d.id}>
                    <CardContent className="p-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-semibold ${d.color}`}>{d.name}</span>
                            <Badge
                                variant={d.riskScore >= 75 ? 'destructive' : d.riskScore >= 50 ? 'warning' : 'success'}
                                appearance="outline"
                                size="sm"
                            >
                                Risk {d.riskScore}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                                <div className="text-xl font-bold text-foreground tabular-nums">{d.totalAssets}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">Assets</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold tabular-nums text-orange-500">{d.open}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">Open</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold tabular-nums text-red-500">{d.overdue}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">Overdue</div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Resolved</span>
                                <span>{pct(d.resolved, d.totalVulns)}%</span>
                            </div>
                            <Progress value={pct(d.resolved, d.totalVulns)} className="h-1.5" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// ─── Table 1 – Security Posture Overview ─────────────────────────────────────

function SecurityPostureTable() {
    const totals = departments.reduce(
        (a, d) => ({
            assets: a.assets + d.totalAssets,
            vulns: a.vulns + d.totalVulns,
            open: a.open + d.open,
            resolved: a.resolved + d.resolved,
            overdue: a.overdue + d.overdue,
        }),
        { assets: 0, vulns: 0, open: 0, resolved: 0, overdue: 0 },
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2.5">
                    <Building2 size={18} className="text-muted-foreground" />
                    <CardTitle>Security Posture by Department</CardTitle>
                </div>
                <CardToolbar>
                    <TotalBadge value={`${totals.vulns} Total Vulns`} />
                    <Button variant="outline" size="sm" className="gap-1.5"
                        onClick={() => downloadCSV('security-posture.csv',
                            ['Department', 'Risk Score', 'Total Assets', 'Total Vulns', 'Open', 'Resolved', '% Resolved', 'Overdue'],
                            departments.map((d) => [d.name, d.riskScore, d.totalAssets, d.totalVulns, d.open, d.resolved, `${pct(d.resolved, d.totalVulns)}%`, d.overdue]),
                        )}
                    >
                        <Download size={14} /> Export CSV
                    </Button>
                </CardToolbar>
            </CardHeader>
            <CardTable>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-40">Department</TableHead>
                            <TableHead className="text-center">Risk Score</TableHead>
                            <TableHead className="text-center">Assets</TableHead>
                            <TableHead className="text-center">Total Vulns</TableHead>
                            <TableHead className="text-center">Open</TableHead>
                            <TableHead className="text-center">Resolved</TableHead>
                            <TableHead className="text-center w-40">Resolution Rate</TableHead>
                            <TableHead className="text-center">Overdue</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departments.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell><span className={`font-semibold ${d.color}`}>{d.name}</span></TableCell>
                                <TableCell className="text-center"><RiskScore score={d.riskScore} trend={d.riskTrend} /></TableCell>
                                <TableCell className="text-center"><TotalBadge value={d.totalAssets} /></TableCell>
                                <TableCell className="text-center"><TotalBadge value={d.totalVulns} /></TableCell>
                                <TableCell className="text-center">
                                    <span className="font-semibold tabular-nums text-orange-500">{d.open}</span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="font-semibold tabular-nums text-green-600 dark:text-green-400">{d.resolved}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Progress value={pct(d.resolved, d.totalVulns)} className="h-2 flex-1" />
                                        <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{pct(d.resolved, d.totalVulns)}%</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="font-semibold tabular-nums text-red-600 dark:text-red-400">{d.overdue}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</TableCell>
                            <TableCell />
                            <TableCell className="text-center"><TotalBadge value={totals.assets} /></TableCell>
                            <TableCell className="text-center"><TotalBadge value={totals.vulns} /></TableCell>
                            <TableCell className="text-center font-semibold tabular-nums text-orange-500">{totals.open}</TableCell>
                            <TableCell className="text-center font-semibold tabular-nums text-green-600 dark:text-green-400">{totals.resolved}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={pct(totals.resolved, totals.vulns)} className="h-2 flex-1" />
                                    <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{pct(totals.resolved, totals.vulns)}%</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center font-semibold tabular-nums text-red-600 dark:text-red-400">{totals.overdue}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardTable>
        </Card>
    );
}

// ─── Table 2 – Severity Breakdown per Department ──────────────────────────────

function SeverityBreakdownTable() {
    const totals = departments.reduce(
        (a, d) => ({ critical: a.critical + d.critical, high: a.high + d.high, medium: a.medium + d.medium, low: a.low + d.low, info: a.info + d.info }),
        { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2.5">
                    <ShieldAlert size={18} className="text-muted-foreground" />
                    <CardTitle>Vulnerability Severity Breakdown by Department</CardTitle>
                </div>
                <CardToolbar>
                    <Button variant="outline" size="sm" className="gap-1.5"
                        onClick={() => downloadCSV('severity-breakdown.csv',
                            ['Department', 'Critical', 'High', 'Medium', 'Low', 'Info', 'Total'],
                            departments.map((d) => [d.name, d.critical, d.high, d.medium, d.low, d.info, d.totalVulns]),
                        )}
                    >
                        <Download size={14} /> Export CSV
                    </Button>
                </CardToolbar>
            </CardHeader>
            <CardTable>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-40">Department</TableHead>
                            <TableHead className="text-center"><SeverityLabel severity="critical" size="sm" /></TableHead>
                            <TableHead className="text-center"><SeverityLabel severity="high" size="sm" /></TableHead>
                            <TableHead className="text-center"><SeverityLabel severity="medium" size="sm" /></TableHead>
                            <TableHead className="text-center"><SeverityLabel severity="low" size="sm" /></TableHead>
                            <TableHead className="text-center"><SeverityLabel severity="info" size="sm" /></TableHead>
                            <TableHead className="text-center">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departments.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell><span className={`font-semibold ${d.color}`}>{d.name}</span></TableCell>
                                <TableCell className="text-center"><span className="font-semibold tabular-nums text-red-600 dark:text-red-400">{d.critical}</span></TableCell>
                                <TableCell className="text-center"><span className="font-semibold tabular-nums text-orange-500 dark:text-orange-400">{d.high}</span></TableCell>
                                <TableCell className="text-center"><span className="font-semibold tabular-nums text-yellow-600 dark:text-yellow-400">{d.medium}</span></TableCell>
                                <TableCell className="text-center"><span className="font-semibold tabular-nums text-blue-500 dark:text-blue-400">{d.low}</span></TableCell>
                                <TableCell className="text-center"><span className="tabular-nums text-muted-foreground">{d.info}</span></TableCell>
                                <TableCell className="text-center"><TotalBadge value={d.totalVulns} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</TableCell>
                            <TableCell className="text-center font-semibold tabular-nums text-red-600 dark:text-red-400">{totals.critical}</TableCell>
                            <TableCell className="text-center font-semibold tabular-nums text-orange-500 dark:text-orange-400">{totals.high}</TableCell>
                            <TableCell className="text-center font-semibold tabular-nums text-yellow-600 dark:text-yellow-400">{totals.medium}</TableCell>
                            <TableCell className="text-center font-semibold tabular-nums text-blue-500 dark:text-blue-400">{totals.low}</TableCell>
                            <TableCell className="text-center tabular-nums text-muted-foreground">{totals.info}</TableCell>
                            <TableCell className="text-center"><TotalBadge value={Object.values(totals).reduce((a, b) => a + b, 0)} /></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardTable>
        </Card>
    );
}

// ─── Table 3 – Asset Coverage per Department ──────────────────────────────────

const ASSET_TYPE_COLS = [
    { key: 'web', label: 'Web App' },
    { key: 'api', label: 'API' },
    { key: 'cloud', label: 'Cloud' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'db', label: 'Database' },
];

function AssetCoverageTable() {
    const colTotals = ASSET_TYPE_COLS.reduce((a, c) => {
        a[c.key] = departments.reduce((s, d) => s + (d.assetTypes[c.key] || 0), 0);
        return a;
    }, {});
    const grandTotal = departments.reduce((a, d) => a + d.totalAssets, 0);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2.5">
                    <Server size={18} className="text-muted-foreground" />
                    <CardTitle>Asset Coverage by Department</CardTitle>
                </div>
                <CardToolbar>
                    <TotalBadge value={`${grandTotal} Assets`} />
                    <Button variant="outline" size="sm" className="gap-1.5"
                        onClick={() => downloadCSV('asset-coverage.csv',
                            ['Department', 'Web App', 'API', 'Cloud', 'Mobile', 'Database', 'Total'],
                            departments.map((d) => [d.name, d.assetTypes.web, d.assetTypes.api, d.assetTypes.cloud, d.assetTypes.mobile, d.assetTypes.db, d.totalAssets]),
                        )}
                    >
                        <Download size={14} /> Export CSV
                    </Button>
                </CardToolbar>
            </CardHeader>
            <CardTable>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-40">Department</TableHead>
                            {ASSET_TYPE_COLS.map((c) => (
                                <TableHead key={c.key} className="text-center">{c.label}</TableHead>
                            ))}
                            <TableHead className="text-center">Total Assets</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departments.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell><span className={`font-semibold ${d.color}`}>{d.name}</span></TableCell>
                                {ASSET_TYPE_COLS.map((c) => (
                                    <TableCell key={c.key} className="text-center">
                                        <span className="tabular-nums">{d.assetTypes[c.key] ?? '—'}</span>
                                    </TableCell>
                                ))}
                                <TableCell className="text-center"><TotalBadge value={d.totalAssets} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</TableCell>
                            {ASSET_TYPE_COLS.map((c) => (
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

// ─── Table 4 – Top Risk Findings per Department ───────────────────────────────

function TopRiskFindingsTable() {
    const allFindings = departments.flatMap((d) =>
        d.topFindings.map((f) => ({ ...f, dept: d.name, deptColor: d.color })),
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2.5">
                    <Flame size={18} className="text-red-500" />
                    <CardTitle>Top Risk Findings per Department</CardTitle>
                </div>
                <CardToolbar>
                    <Badge variant="destructive" appearance="outline" size="sm">{allFindings.length} Findings</Badge>
                    <Button variant="outline" size="sm" className="gap-1.5"
                        onClick={() => downloadCSV('top-findings.csv',
                            ['Department', 'Finding', 'Severity', 'State', 'Asset'],
                            allFindings.map((f) => [f.dept, f.title, f.severity, f.state, f.asset]),
                        )}
                    >
                        <Download size={14} /> Export CSV
                    </Button>
                </CardToolbar>
            </CardHeader>
            <CardTable>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-36">Department</TableHead>
                            <TableHead>Finding</TableHead>
                            <TableHead className="text-center">Severity</TableHead>
                            <TableHead className="text-center">State</TableHead>
                            <TableHead>Asset</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allFindings.map((f, i) => (
                            <TableRow key={i}>
                                <TableCell><span className={`font-semibold text-sm ${f.deptColor}`}>{f.dept}</span></TableCell>
                                <TableCell className="font-medium">{f.title}</TableCell>
                                <TableCell className="text-center"><SeverityLabel severity={f.severity} /></TableCell>
                                <TableCell className="text-center"><StateLabels state={f.state} /></TableCell>
                                <TableCell>
                                    <Badge variant="secondary" size="sm" className="font-mono text-xs">{f.asset}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardTable>
        </Card>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Metrics3Page() {
    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-foreground">Departmental Overview</h1>
                <p className="text-sm text-muted-foreground">
                    Security posture, vulnerability distribution, asset coverage, and top findings per business unit.
                </p>
            </div>

            {/* Per-department KPI cards */}
            <DeptKpiCards />

            {/* Security posture overview */}
            <SecurityPostureTable />

            {/* Severity breakdown */}
            <SeverityBreakdownTable />

            {/* Asset coverage */}
            <AssetCoverageTable />

            {/* Top risk findings */}
            <TopRiskFindingsTable />
        </div>
    );
}
