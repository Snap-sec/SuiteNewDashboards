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
import { StateLabels } from '@/components/custom/state-labels';
import SeverityLabel from '@/components/custom/severity-label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    ShieldCheck,
    ShieldAlert,
    Clock,
    AlertTriangle,
    Timer,
    TrendingUp,
    Building2,
    Download,
    CalendarClock,
    CheckCircle2,
    XCircle,
} from 'lucide-react';

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

// ─── Mock Data ────────────────────────────────────────────────────────────────

const kpiData = {
    totalVulns: 1247,
    remediated: 478,
    open: 561,
    overdue: 208,
    mttr: 18.4, // days
    slaCompliance: 72, // %
};

const remediationBySeverity = [
    { severity: 'critical', total: 104, remediated: 29, inProgress: 31, overdue: 44 },
    { severity: 'high', total: 246, remediated: 98, inProgress: 87, overdue: 61 },
    { severity: 'medium', total: 389, remediated: 201, inProgress: 132, overdue: 56 },
    { severity: 'low', total: 183, remediated: 110, inProgress: 58, overdue: 15 },
    { severity: 'info', total: 52, remediated: 40, inProgress: 10, overdue: 2 },
];

const remediationByBU = [
    { bu: 'Hala Go', total: 187, remediated: 71, inProgress: 76, overdue: 40, mttr: 22.1 },
    { bu: 'Hala Now', total: 103, remediated: 45, inProgress: 38, overdue: 20, mttr: 16.8 },
    { bu: 'Hala Control', total: 59, remediated: 28, inProgress: 22, overdue: 9, mttr: 14.2 },
    { bu: 'Hala Financing', total: 105, remediated: 52, inProgress: 37, overdue: 16, mttr: 17.5 },
    { bu: 'Hala Freelancer', total: 59, remediated: 31, inProgress: 18, overdue: 10, mttr: 12.9 },
];

const slaCompliance = [
    { severity: 'critical', sla: '7 days', onTime: 19, breached: 10, pending: 75, compliance: 65 },
    { severity: 'high', sla: '30 days', onTime: 81, breached: 17, pending: 148, compliance: 83 },
    { severity: 'medium', sla: '60 days', onTime: 176, breached: 25, pending: 188, compliance: 88 },
    { severity: 'low', sla: '90 days', onTime: 105, breached: 5, pending: 73, compliance: 95 },
    { severity: 'info', sla: '180 days', onTime: 39, breached: 1, pending: 12, compliance: 97 },
];

const overdueVulns = [
    { id: 'CVE-2024-1234', title: 'SQL Injection in Payment API', severity: 'critical', bu: 'Hala Financing', daysOverdue: 34, owner: 'Billing Team' },
    { id: 'CVE-2024-5678', title: 'Broken Authentication – Admin Panel', severity: 'critical', bu: 'Hala Control', daysOverdue: 28, owner: 'Platform Team' },
    { id: 'CVE-2024-9012', title: 'Server-Side Request Forgery (SSRF)', severity: 'high', bu: 'Hala Go', daysOverdue: 22, owner: 'Backend Team' },
    { id: 'CVE-2024-3456', title: 'Exposed Secrets in Environment Config', severity: 'high', bu: 'Hala Now', daysOverdue: 19, owner: 'DevOps Team' },
    { id: 'CVE-2024-7890', title: 'Insecure Direct Object Reference', severity: 'high', bu: 'Hala Freelancer', daysOverdue: 14, owner: 'API Team' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function TotalBadge({ value }) {
    return (
        <Badge variant="secondary" size="sm" className="font-semibold tabular-nums">
            {value}
        </Badge>
    );
}

function pct(done, total) {
    if (!total) return 0;
    return Math.round((done / total) * 100);
}

// ─── KPI Cards ───────────────────────────────────────────────────────────────

const KPI_CARDS = [
    {
        label: 'Total Vulnerabilities',
        value: kpiData.totalVulns.toLocaleString(),
        icon: <ShieldAlert size={20} className="text-muted-foreground" />,
        sub: 'All time',
    },
    {
        label: 'Remediated',
        value: kpiData.remediated.toLocaleString(),
        icon: <ShieldCheck size={20} className="text-green-500" />,
        sub: `${pct(kpiData.remediated, kpiData.totalVulns)}% of total`,
        accent: 'text-green-600 dark:text-green-400',
    },
    {
        label: 'Open / Pending',
        value: kpiData.open.toLocaleString(),
        icon: <Clock size={20} className="text-blue-500" />,
        sub: `${pct(kpiData.open, kpiData.totalVulns)}% of total`,
        accent: 'text-blue-600 dark:text-blue-400',
    },
    {
        label: 'Overdue',
        value: kpiData.overdue.toLocaleString(),
        icon: <AlertTriangle size={20} className="text-red-500" />,
        sub: `${pct(kpiData.overdue, kpiData.totalVulns)}% of total`,
        accent: 'text-red-600 dark:text-red-400',
    },
    {
        label: 'Avg. MTTR',
        value: `${kpiData.mttr}d`,
        icon: <Timer size={20} className="text-orange-500" />,
        sub: 'Mean time to remediate',
        accent: 'text-orange-600 dark:text-orange-400',
    },
    {
        label: 'SLA Compliance',
        value: `${kpiData.slaCompliance}%`,
        icon: <TrendingUp size={20} className="text-violet-500" />,
        sub: 'Vulns resolved on time',
        accent: 'text-violet-600 dark:text-violet-400',
    },
];

function KpiCards() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {KPI_CARDS.map((k) => (
                <Card key={k.label}>
                    <CardContent className="p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            {k.icon}
                            <span className="text-xs text-muted-foreground">{k.sub}</span>
                        </div>
                        <div>
                            <div className={`text-3xl font-semibold ${k.accent ?? 'text-foreground'}`}>
                                {k.value}
                            </div>
                            <div className="text-sm text-muted-foreground mt-0.5">{k.label}</div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// ─── Table 1 – Remediation Progress by Severity ───────────────────────────────

function RemediationBySeverityTable() {
    const grandTotal = remediationBySeverity.reduce((a, r) => a + r.total, 0);
    const grandRemediated = remediationBySeverity.reduce((a, r) => a + r.remediated, 0);
    const grandProgress = remediationBySeverity.reduce((a, r) => a + r.inProgress, 0);
    const grandOverdue = remediationBySeverity.reduce((a, r) => a + r.overdue, 0);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2.5">
                    <ShieldCheck size={18} className="text-muted-foreground" />
                    <CardTitle>Remediation Progress by Severity</CardTitle>
                </div>
                <CardToolbar>
                    <TotalBadge value={`${grandTotal} Total`} />
                    <Button
                        variant="outline" size="sm" className="gap-1.5"
                        onClick={() => downloadCSV(
                            'remediation-by-severity.csv',
                            ['Severity', 'Total', 'Remediated', '% Fixed', 'In Progress', 'Overdue'],
                            remediationBySeverity.map((r) => [
                                r.severity, r.total, r.remediated, `${pct(r.remediated, r.total)}%`, r.inProgress, r.overdue,
                            ]),
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
                            <TableHead className="w-36">Severity</TableHead>
                            <TableHead className="text-center">Total</TableHead>
                            <TableHead className="text-center">Remediated</TableHead>
                            <TableHead className="text-center w-44">Progress</TableHead>
                            <TableHead className="text-center">In Progress</TableHead>
                            <TableHead className="text-center">Overdue</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {remediationBySeverity.map((row) => {
                            const done = pct(row.remediated, row.total);
                            return (
                                <TableRow key={row.severity}>
                                    <TableCell><SeverityLabel severity={row.severity} /></TableCell>
                                    <TableCell className="text-center"><TotalBadge value={row.total} /></TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-semibold text-green-600 dark:text-green-400 tabular-nums">{row.remediated}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={done} className="h-2 flex-1" />
                                            <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{done}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="tabular-nums text-blue-600 dark:text-blue-400 font-medium">{row.inProgress}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="tabular-nums text-red-600 dark:text-red-400 font-semibold">{row.overdue}</span>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</TableCell>
                            <TableCell className="text-center"><TotalBadge value={grandTotal} /></TableCell>
                            <TableCell className="text-center font-semibold text-green-600 dark:text-green-400 tabular-nums">{grandRemediated}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={pct(grandRemediated, grandTotal)} className="h-2 flex-1" />
                                    <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{pct(grandRemediated, grandTotal)}%</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center font-semibold tabular-nums text-blue-600 dark:text-blue-400">{grandProgress}</TableCell>
                            <TableCell className="text-center font-semibold tabular-nums text-red-600 dark:text-red-400">{grandOverdue}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardTable>
        </Card>
    );
}

// ─── Table 2 – Remediation Status by Business Unit ───────────────────────────

function RemediationByBUTable() {
    const totals = remediationByBU.reduce(
        (a, r) => ({ total: a.total + r.total, remediated: a.remediated + r.remediated, inProgress: a.inProgress + r.inProgress, overdue: a.overdue + r.overdue }),
        { total: 0, remediated: 0, inProgress: 0, overdue: 0 },
    );
    const avgMttr = (remediationByBU.reduce((a, r) => a + r.mttr, 0) / remediationByBU.length).toFixed(1);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2.5">
                    <Building2 size={18} className="text-muted-foreground" />
                    <CardTitle>Remediation Status by Business Unit</CardTitle>
                </div>
                <CardToolbar>
                    <TotalBadge value={`${totals.total} Total`} />
                    <Button
                        variant="outline" size="sm" className="gap-1.5"
                        onClick={() => downloadCSV(
                            'remediation-by-bu.csv',
                            ['Business Unit', 'Total', 'Remediated', '% Fixed', 'In Progress', 'Overdue', 'MTTR (days)'],
                            remediationByBU.map((r) => [
                                r.bu, r.total, r.remediated, `${pct(r.remediated, r.total)}%`, r.inProgress, r.overdue, r.mttr,
                            ]),
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
                            <TableHead className="w-40">Business Unit</TableHead>
                            <TableHead className="text-center">Total</TableHead>
                            <TableHead className="text-center">Remediated</TableHead>
                            <TableHead className="text-center w-44">Progress</TableHead>
                            <TableHead className="text-center">In Progress</TableHead>
                            <TableHead className="text-center">Overdue</TableHead>
                            <TableHead className="text-center">MTTR (days)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {remediationByBU.map((row) => {
                            const done = pct(row.remediated, row.total);
                            return (
                                <TableRow key={row.bu}>
                                    <TableCell className="font-medium">{row.bu}</TableCell>
                                    <TableCell className="text-center"><TotalBadge value={row.total} /></TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-semibold text-green-600 dark:text-green-400 tabular-nums">{row.remediated}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={done} className="h-2 flex-1" />
                                            <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{done}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="tabular-nums text-blue-600 dark:text-blue-400 font-medium">{row.inProgress}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="tabular-nums text-red-600 dark:text-red-400 font-semibold">{row.overdue}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" size="sm" className="tabular-nums">{row.mttr}d</Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total / Avg</TableCell>
                            <TableCell className="text-center"><TotalBadge value={totals.total} /></TableCell>
                            <TableCell className="text-center font-semibold text-green-600 dark:text-green-400 tabular-nums">{totals.remediated}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={pct(totals.remediated, totals.total)} className="h-2 flex-1" />
                                    <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{pct(totals.remediated, totals.total)}%</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center font-semibold tabular-nums text-blue-600 dark:text-blue-400">{totals.inProgress}</TableCell>
                            <TableCell className="text-center font-semibold tabular-nums text-red-600 dark:text-red-400">{totals.overdue}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant="outline" size="sm" className="tabular-nums">{avgMttr}d</Badge>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardTable>
        </Card>
    );
}

// ─── Table 3 – SLA Compliance by Severity ────────────────────────────────────

function SLAComplianceTable() {
    const totalsOnTime = slaCompliance.reduce((a, r) => a + r.onTime, 0);
    const totalsBreached = slaCompliance.reduce((a, r) => a + r.breached, 0);
    const totalsPending = slaCompliance.reduce((a, r) => a + r.pending, 0);
    const overallCompliance = pct(totalsOnTime, totalsOnTime + totalsBreached);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2.5">
                    <CalendarClock size={18} className="text-muted-foreground" />
                    <CardTitle>SLA Compliance by Severity</CardTitle>
                </div>
                <CardToolbar>
                    <Badge
                        variant={overallCompliance >= 80 ? 'success' : overallCompliance >= 60 ? 'warning' : 'destructive'}
                        appearance="outline"
                        size="sm"
                    >
                        {overallCompliance}% Overall
                    </Badge>
                    <Button
                        variant="outline" size="sm" className="gap-1.5"
                        onClick={() => downloadCSV(
                            'sla-compliance.csv',
                            ['Severity', 'SLA Target', 'On-Time', 'Breached', 'Pending', 'Compliance %'],
                            slaCompliance.map((r) => [r.severity, r.sla, r.onTime, r.breached, r.pending, `${r.compliance}%`]),
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
                            <TableHead className="w-36">Severity</TableHead>
                            <TableHead className="text-center">SLA Target</TableHead>
                            <TableHead className="text-center">On-Time</TableHead>
                            <TableHead className="text-center">Breached</TableHead>
                            <TableHead className="text-center">Pending</TableHead>
                            <TableHead className="text-center w-44">Compliance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {slaCompliance.map((row) => (
                            <TableRow key={row.severity}>
                                <TableCell><SeverityLabel severity={row.severity} /></TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" size="sm">{row.sla}</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 font-semibold tabular-nums">
                                        <CheckCircle2 size={13} />{row.onTime}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 font-semibold tabular-nums">
                                        <XCircle size={13} />{row.breached}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="tabular-nums text-muted-foreground">{row.pending}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Progress
                                            value={row.compliance}
                                            className="h-2 flex-1"
                                        />
                                        <span className={`text-xs tabular-nums font-semibold w-9 text-right ${row.compliance >= 80 ? 'text-green-600 dark:text-green-400' : row.compliance >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {row.compliance}%
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</TableCell>
                            <TableCell />
                            <TableCell className="text-center font-semibold text-green-600 dark:text-green-400 tabular-nums">{totalsOnTime}</TableCell>
                            <TableCell className="text-center font-semibold text-red-600 dark:text-red-400 tabular-nums">{totalsBreached}</TableCell>
                            <TableCell className="text-center tabular-nums text-muted-foreground">{totalsPending}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={overallCompliance} className="h-2 flex-1" />
                                    <span className="text-xs tabular-nums font-semibold w-9 text-right text-green-600 dark:text-green-400">{overallCompliance}%</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardTable>
        </Card>
    );
}

// ─── Table 4 – Top Overdue Vulnerabilities ────────────────────────────────────

function TopOverdueTable() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2.5">
                    <AlertTriangle size={18} className="text-red-500" />
                    <CardTitle>Top Overdue Vulnerabilities</CardTitle>
                </div>
                <CardToolbar>
                    <Badge variant="destructive" appearance="outline" size="sm">{overdueVulns.length} Items</Badge>
                    <Button
                        variant="outline" size="sm" className="gap-1.5"
                        onClick={() => downloadCSV(
                            'overdue-vulnerabilities.csv',
                            ['CVE ID', 'Title', 'Severity', 'Business Unit', 'Days Overdue', 'Owner'],
                            overdueVulns.map((r) => [r.id, r.title, r.severity, r.bu, r.daysOverdue, r.owner]),
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
                            <TableHead className="w-36">CVE ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="text-center">Severity</TableHead>
                            <TableHead className="text-center">Business Unit</TableHead>
                            <TableHead className="text-center">Days Overdue</TableHead>
                            <TableHead className="text-center">Owner</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {overdueVulns.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Badge variant="secondary" size="sm" className="font-mono text-xs">{row.id}</Badge>
                                </TableCell>
                                <TableCell className="font-medium max-w-xs">{row.title}</TableCell>
                                <TableCell className="text-center"><SeverityLabel severity={row.severity} /></TableCell>
                                <TableCell className="text-center">
                                    <span className="text-sm text-muted-foreground">{row.bu}</span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="destructive" appearance="outline" size="sm" className="tabular-nums gap-1">
                                        <Clock size={11} />
                                        {row.daysOverdue}d
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="text-sm text-muted-foreground">{row.owner}</span>
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

export default function Metrics2Page() {
    return (
        <div className="p-6 flex flex-col gap-6">
            {/* Page header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-foreground">Remediation Executive Metrics</h1>
                <p className="text-sm text-muted-foreground">
                    Executive-level view of vulnerability remediation progress, SLA compliance, and overdue items.
                </p>
            </div>

            {/* KPI Row */}
            <KpiCards />

            {/* Remediation by Severity */}
            <RemediationBySeverityTable />

            {/* Remediation by Business Unit */}
            <RemediationByBUTable />

            {/* SLA Compliance */}
            <SLAComplianceTable />

            {/* Top Overdue Vulns */}
            <TopOverdueTable />
        </div>
    );
}
