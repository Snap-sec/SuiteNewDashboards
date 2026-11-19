import { Helmet } from 'react-helmet';
import {
  Globe,
  ShieldAlert,
  AlertTriangle,
  Activity,
  ScanLine,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Ellipsis,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import AreaChart from '@/components/custom/charts/area-chart';
import DonutChart from '@/components/custom/charts/donut-chart';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import SeverityLabel from '@/components/custom/severity-label';

// ── Static Dashboard Data ─────────────────────────────────────────────

const DASHBOARD = {
  metrics: {
    total_assets: 1878,
    risky_assets: 18,
    critical_risks: 2,
    total_risks: 18,
    active_scans: 0,
    total_scans: 28,
    next_scan: '2026-04-08T05:01:23.544Z',
    risks_by_state: {
      false_positive: 0,
      in_review: 16,
      resolved: 13,
      unresolved: 0,
      hidden_by_disabled_rule: 0,
    },
  },
  asset_distribution_with_risks: [
    { count: 776, risks: 0, type: 'port' },
    { count: 426, risks: 0, type: 'subdomain' },
    { count: 320, risks: 0, type: 'dns' },
    { count: 118, risks: 2, type: 'certificate' },
    { count: 98, risks: 3, type: 'ip' },
    { count: 82, risks: 2, type: 'web_server' },
    { count: 58, risks: 0, type: 'technology' },
  ],
  assets_vs_risks_trend: [
    { date: 'Nov 11', assets: 2382, risks: 24 },
    { date: 'Nov 13', assets: 1497, risks: 24 },
    { date: 'Nov 27', assets: 1364, risks: 24 },
    { date: 'Nov 30', assets: 1364, risks: 3 },
    { date: 'Dec 07', assets: 1327, risks: 328 },
    { date: 'Dec 14', assets: 1355, risks: 431 },
    { date: 'Dec 21', assets: 1353, risks: 485 },
    { date: 'Dec 28', assets: 1441, risks: 25 },
    { date: 'Jan 04', assets: 1437, risks: 25 },
    { date: 'Jan 11', assets: 1415, risks: 25 },
    { date: 'Jan 18', assets: 1419, risks: 25 },
    { date: 'Jan 25', assets: 1412, risks: 22 },
    { date: 'Feb 01', assets: 1434, risks: 22 },
    { date: 'Feb 06', assets: 950, risks: 22 },
    { date: 'Feb 09', assets: 1401, risks: 44 },
    { date: 'Feb 26', assets: 1174, risks: 22 },
    { date: 'Mar 05', assets: 1256, risks: 21 },
    { date: 'Mar 12', assets: 1249, risks: 14 },
    { date: 'Mar 19', assets: 1175, risks: 17 },
    { date: 'Mar 29', assets: 2651, risks: 17 },
    { date: 'Mar 31', assets: 2134, risks: 19 },
    { date: 'Apr 01', assets: 1878, risks: 19 },
  ],
  recent_events: [
    { id: 1, title: 'Found for first time', description: 'The Technology TLS was found for the first time.', asset: 'accounts-dev.hala.com', type: 'technology', change_type: 'added', createdAt: '2026-04-01T06:34:00.755Z' },
    { id: 2, title: 'Found for first time', description: 'The Technology TLS was found for the first time.', asset: 'accounts-dev.hala.com', type: 'technology', change_type: 'added', createdAt: '2026-04-01T06:29:00.683Z' },
    { id: 3, title: 'Found for first time', description: 'The Technology Cloudflare was found for the first time.', asset: 'sfm.hala.com', type: 'technology', change_type: 'added', createdAt: '2026-04-01T06:11:00.682Z' },
    { id: 4, title: 'Found for first time', description: 'The Technology Cloudflare was found for the first time.', asset: 'pay.online.hala.com', type: 'technology', change_type: 'added', createdAt: '2026-04-01T06:09:00.596Z' },
    { id: 5, title: 'Found for first time', description: 'The Technology Sectigo was found for the first time.', asset: 'accounts-stg.hala.com', type: 'technology', change_type: 'added', createdAt: '2026-04-01T06:09:00.560Z' },
  ],
  top_risks: [
    { id: 1, asset: '194.32.161.184', subdomain: 'autodiscover.hala.com', type: 'ip', severity: 'critical', state: 'In Review', reason: 'Direct IP Access to safedecision-server - should allow only Cloudflare routed traffic.' },
    { id: 2, asset: '193.122.92.37', subdomain: 'pay.online.hala.com', type: 'ip', severity: 'high', state: 'In Review', reason: 'Direct IP Access to server (pay.online.hala.com) - should allow only Cloudflare routed traffic.' },
    { id: 3, asset: '158.101.228.240', subdomain: 'fdsm.hala.com', type: 'ip', severity: 'medium', state: 'In Review', reason: 'Direct IP Access to FDSM Server - should allow only Cloudflare routed traffic.' },
    { id: 4, asset: '80.225.71.243', subdomain: 'desk.hala.com', type: 'ip', severity: 'critical', state: 'In Review', reason: 'Direct IP Access to ServiceDESK-server - should allow only Cloudflare routed traffic.' },
    { id: 5, asset: '158.101.227.163', subdomain: 'jira.hala.com', type: 'ip', severity: 'high', state: 'In Review', reason: 'Direct IP Access to Jira-server - should allow only Cloudflare routed traffic.' },
    { id: 6, asset: 'jira.hala.com', subdomain: 'jira.hala.com', type: 'subdomain', severity: 'none', state: 'Resolved', reason: 'Exposing Jira Fully to internet - should be under Tailscale.' },
    { id: 7, asset: 'tms.hala.com', subdomain: 'tms.hala.com', type: 'web_server', severity: 'critical', state: 'Resolved', reason: 'Exposing Staging Application - this should not be publicly exposed.' },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────

function formatNextScan(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = d - now;
  if (diff < 0) return 'Overdue';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  if (days > 0) return `in ${days}d ${hours}h`;
  return `in ${hours}h`;
}

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins}m ago`;
}

function formatAssetType(type) {
  const map = {
    port: 'Ports',
    subdomain: 'Subdomains',
    dns: 'DNS Records',
    certificate: 'Certificates',
    ip: 'IP Addresses',
    web_server: 'Web Servers',
    technology: 'Technologies',
  };
  return map[type] || type;
}

// ── KPI Metric Card ────────────────────────────────────────────────────

function MetricCard({ icon: Icon, label, value, subtitle, iconColor = 'text-primary', trend }) {
  return (
    <Card className="h-full">
      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg bg-muted ${iconColor}`}>
            <Icon className="size-5" />
          </div>
          {trend && (
            <span className={`text-xs font-medium flex items-center gap-0.5 ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {trend > 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div>
          <span className="text-2xl font-semibold text-foreground">{typeof value === 'number' ? value.toLocaleString() : value}</span>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          {subtitle && <p className="text-[11px] text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// ── State Badge ────────────────────────────────────────────────────────

function StateBadge({ state }) {
  const variantMap = {
    'In Review': 'info',
    'Resolved': 'success',
    'Open': 'warning',
    'Triaged': 'primary',
    'Unresolved': 'destructive',
  };
  return (
    <Badge variant={variantMap[state] || 'secondary'} appearance="outline" size="sm">
      {state}
    </Badge>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────

function AsmDashboard() {
  const { metrics, asset_distribution_with_risks, assets_vs_risks_trend, recent_events, top_risks } = DASHBOARD;

  // Chart data preparation
  const trendCategories = assets_vs_risks_trend.map((d) => d.date);
  const trendSeries = [
    { name: 'Assets', data: assets_vs_risks_trend.map((d) => d.assets) },
    { name: 'Risks', data: assets_vs_risks_trend.map((d) => d.risks) },
  ];

  const risksByStateData = [
    { name: 'In Review', value: metrics.risks_by_state.in_review },
    { name: 'Resolved', value: metrics.risks_by_state.resolved },
    { name: 'False Positive', value: metrics.risks_by_state.false_positive },
    { name: 'Unresolved', value: metrics.risks_by_state.unresolved },
  ].filter((d) => d.value > 0);

  const assetDistData = asset_distribution_with_risks.map((d) => ({
    name: formatAssetType(d.type),
    assets: d.count,
    risks: d.risks,
  }));

  return (
    <>
      <Helmet>
        <title>Xpose Dashboard | Demo</title>
      </Helmet>

      <div className="p-6 space-y-6">
        {/* ── KPI Metrics Row ──────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard icon={Globe} label="Total Assets" value={metrics.total_assets} iconColor="text-primary" />
          <MetricCard icon={ShieldAlert} label="Risky Assets" value={metrics.risky_assets} iconColor="text-orange-500" />
          <MetricCard icon={AlertTriangle} label="Critical Risks" value={metrics.critical_risks} iconColor="text-red-500" />
          <MetricCard icon={Activity} label="Total Risks" value={metrics.total_risks} iconColor="text-yellow-500" />
          <MetricCard icon={ScanLine} label="Total Scans" value={metrics.total_scans} subtitle={`${metrics.active_scans} active`} iconColor="text-blue-500" />
          <MetricCard icon={Clock} label="Next Scan" value={formatNextScan(metrics.next_scan)} iconColor="text-violet-500" />
        </div>

        {/* ── Row 2: Trend Chart + Risk by State ─────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Assets vs Risks Trend</CardTitle>
                  <CardDescription className="text-xs">Last 6 months scan history</CardDescription>
                </div>
                <Badge variant="secondary" appearance="outline" size="sm">
                  <TrendingUp className="size-3 mr-1" />
                  22 Scans
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <AreaChart
                series={trendSeries}
                xCategories={trendCategories}
                height={280}
                colors={['#3b82f6', '#ef4444']}
                xaxisType="category"
                strokeCurve="smooth"
                showLegend={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Risks by State</CardTitle>
              <CardDescription className="text-xs">Current risk distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <DonutChart
                data={risksByStateData}
                height={250}
                colors={['#8b5cf6', '#22c55e', '#6b7280', '#ef4444']}
                showLegend={true}
                legendPosition="bottom"
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Row 3: Asset Distribution Bar Chart ────── */}
        <ReBarChart
          title="Asset Distribution"
          data={assetDistData}
          xKey="name"
          keys={[
            { key: 'assets', label: 'Assets' },
            { key: 'risks', label: 'Risks' },
          ]}
          colors={['#3b82f6', '#ef4444']}
          height={280}
          showYAxis={true}
          showBarLabel={true}
        />

        {/* ── Row 4: Top Risks + Recent Events ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Top Risks */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Top Risks</CardTitle>
                  <CardDescription className="text-xs">Highest priority exposures requiring attention</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Asset</TableHead>
                    <TableHead className="text-xs font-semibold">Type</TableHead>
                    <TableHead className="text-xs font-semibold">Severity</TableHead>
                    <TableHead className="text-xs font-semibold">State</TableHead>
                    <TableHead className="text-xs font-semibold w-[40px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {top_risks.map((risk) => (
                    <TableRow key={risk.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{risk.subdomain}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[300px]">{risk.reason}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground capitalize">{risk.type.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <SeverityLabel severity={risk.severity} />
                      </TableCell>
                      <TableCell>
                        <StateBadge state={risk.state} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Ellipsis className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[140px]">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Send to VM</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">Dismiss</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Recent Events</CardTitle>
                  <CardDescription className="text-xs">Latest scan discoveries</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {recent_events.map((event, i) => (
                  <div
                    key={event.id}
                    className={`flex items-start gap-3 px-5 py-3.5 ${i !== recent_events.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <div className="mt-0.5 p-1.5 rounded-md bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400 shrink-0">
                      <ArrowUpRight className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{event.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" appearance="outline" size="xs">{event.type}</Badge>
                        <span className="text-[11px] text-muted-foreground">{event.asset}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">{timeAgo(event.createdAt)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default AsmDashboard;
