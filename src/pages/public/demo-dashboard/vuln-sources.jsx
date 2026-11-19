import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardTable, CardToolbar } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';
import {
  Radar, Ellipsis, Pencil, Plus, Search, Trash2, Eye, ScanLine, Shield, AlertTriangle,
  CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Activity, Layers, GitMerge, MapPin, Route,
  TrendingUp, TrendingDown, Zap, ShieldCheck, ShieldAlert, Target, CircleDot,
} from 'lucide-react';

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const SOURCE_TYPES = ['Scanner', 'Manual', 'External', 'Integration', 'Bug Bounty'];
const CONFIDENCE_LEVELS = ['High', 'Medium', 'Low'];
const PROJECTS = ['Customer Portal', 'Payment Gateway', 'Mobile App', 'API Gateway', 'CI/CD Pipeline', 'Data Platform'];

const INITIAL_SOURCES = [
  { id: '1', name: 'Burp Suite Pro', type: 'Scanner', description: 'Dynamic application security testing scanner for web applications.', confidence: 'High', projects: ['Customer Portal', 'Payment Gateway', 'API Gateway'], isActive: true, createdAt: '2025-08-15', findings: { total: 342, valid: 289, falsePositive: 38, ignored: 8, riskAccepted: 7 }, monthlyActivity: [28, 35, 31, 42, 38, 29, 33, 40, 36, 44, 39, 34] },
  { id: '2', name: 'SonarQube', type: 'Scanner', description: 'Static analysis platform for continuous code quality and security inspection.', confidence: 'High', projects: ['Customer Portal', 'Payment Gateway', 'Mobile App', 'CI/CD Pipeline'], isActive: true, createdAt: '2025-07-20', findings: { total: 567, valid: 412, falsePositive: 128, ignored: 15, riskAccepted: 12 }, monthlyActivity: [45, 52, 48, 61, 55, 42, 50, 58, 53, 67, 60, 55] },
  { id: '3', name: 'Snyk', type: 'Integration', description: 'Developer-first SCA tool for open source dependency vulnerability detection.', confidence: 'High', projects: ['Customer Portal', 'Mobile App', 'API Gateway', 'Data Platform'], isActive: true, createdAt: '2025-09-01', findings: { total: 234, valid: 198, falsePositive: 22, ignored: 6, riskAccepted: 8 }, monthlyActivity: [18, 22, 19, 28, 24, 20, 23, 26, 21, 30, 27, 24] },
  { id: '4', name: 'Manual Pentest Team', type: 'Manual', description: 'Internal red team conducting quarterly penetration tests across all critical assets.', confidence: 'High', projects: ['Customer Portal', 'Payment Gateway', 'Mobile App', 'API Gateway', 'CI/CD Pipeline', 'Data Platform'], isActive: true, createdAt: '2025-06-10', findings: { total: 87, valid: 82, falsePositive: 2, ignored: 1, riskAccepted: 2 }, monthlyActivity: [0, 0, 12, 0, 0, 15, 0, 0, 18, 0, 0, 22] },
  { id: '5', name: 'Nessus', type: 'Scanner', description: 'Network vulnerability scanner for infrastructure and compliance assessments.', confidence: 'Medium', projects: ['API Gateway', 'CI/CD Pipeline', 'Data Platform'], isActive: true, createdAt: '2025-10-05', findings: { total: 456, valid: 298, falsePositive: 134, ignored: 12, riskAccepted: 12 }, monthlyActivity: [38, 42, 36, 50, 44, 35, 41, 48, 40, 54, 47, 42] },
  { id: '6', name: 'HackerOne Reports', type: 'Bug Bounty', description: 'Crowdsourced vulnerability reports from HackerOne bug bounty program.', confidence: 'Medium', projects: ['Customer Portal', 'Mobile App'], isActive: true, createdAt: '2025-11-12', findings: { total: 63, valid: 51, falsePositive: 8, ignored: 2, riskAccepted: 2 }, monthlyActivity: [4, 6, 5, 8, 7, 4, 6, 7, 5, 9, 8, 6] },
  { id: '7', name: 'Qualys Cloud Agent', type: 'Scanner', description: 'Cloud-based vulnerability management and compliance solution.', confidence: 'Medium', projects: ['CI/CD Pipeline', 'Data Platform'], isActive: false, createdAt: '2025-12-01', findings: { total: 189, valid: 112, falsePositive: 62, ignored: 8, riskAccepted: 7 }, monthlyActivity: [15, 18, 14, 22, 19, 0, 0, 0, 0, 0, 0, 0] },
  { id: '8', name: 'AWS Inspector', type: 'Integration', description: 'Automated security assessment service for AWS workloads.', confidence: 'Medium', projects: ['Data Platform'], isActive: true, createdAt: '2026-01-15', findings: { total: 145, valid: 98, falsePositive: 35, ignored: 5, riskAccepted: 7 }, monthlyActivity: [0, 0, 0, 0, 0, 12, 15, 18, 14, 20, 17, 15] },
  { id: '9', name: 'External Audit (Deloitte)', type: 'External', description: 'Annual external security audit and compliance assessment by Deloitte.', confidence: 'High', projects: ['Customer Portal', 'Payment Gateway'], isActive: false, createdAt: '2026-02-20', findings: { total: 34, valid: 32, falsePositive: 1, ignored: 0, riskAccepted: 1 }, monthlyActivity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 0] },
  { id: '10', name: 'OWASP ZAP', type: 'Scanner', description: 'Open-source DAST scanner integrated into CI/CD pipelines for automated testing.', confidence: 'Low', projects: ['Mobile App', 'API Gateway'], isActive: true, createdAt: '2026-03-01', findings: { total: 298, valid: 145, falsePositive: 138, ignored: 8, riskAccepted: 7 }, monthlyActivity: [0, 0, 0, 0, 0, 0, 0, 25, 28, 32, 30, 27] },
];

const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

const ROUTING_RULES = [
  { source: 'Burp Suite Pro', targetTeam: 'Application Security', rule: 'All web app findings → AppSec team' },
  { source: 'SonarQube', targetTeam: 'Engineering', rule: 'Code quality issues → Dev teams by repo owner' },
  { source: 'Nessus', targetTeam: 'Infrastructure / DevOps', rule: 'Network vulns → Infra team' },
  { source: 'AWS Inspector', targetTeam: 'Cloud / DevOps', rule: 'Cloud config issues → Cloud ops team' },
  { source: 'HackerOne Reports', targetTeam: 'Application Security', rule: 'Bug bounty submissions → AppSec triage' },
  { source: 'Manual Pentest Team', targetTeam: 'All Teams (by scope)', rule: 'Pentest findings → Assigned asset owner' },
];

const DEDUP_ENTRIES = [
  { vuln: 'SQL Injection — /api/v2/users', sources: ['Burp Suite Pro', 'OWASP ZAP', 'Manual Pentest Team'], count: 3 },
  { vuln: 'XSS — /dashboard/search', sources: ['Burp Suite Pro', 'SonarQube'], count: 2 },
  { vuln: 'Outdated jQuery 3.4.1', sources: ['Snyk', 'SonarQube', 'OWASP ZAP'], count: 3 },
  { vuln: 'TLS 1.0 Enabled', sources: ['Nessus', 'Qualys Cloud Agent'], count: 2 },
  { vuln: 'IDOR — /api/orders/{id}', sources: ['Burp Suite Pro', 'Manual Pentest Team', 'HackerOne Reports'], count: 3 },
  { vuln: 'Log4Shell (CVE-2021-44228)', sources: ['Snyk', 'AWS Inspector', 'Nessus'], count: 3 },
  { vuln: 'Open Redirect — /auth/callback', sources: ['OWASP ZAP', 'HackerOne Reports'], count: 2 },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

const pct = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100));
const EMPTY_FORM = { name: '', type: 'Scanner', description: '', confidence: 'Medium', projects: [], isActive: true };

const TYPE_COLORS = { Scanner: 'primary', Manual: 'success', External: 'info', Integration: 'warning', 'Bug Bounty': 'destructive' };
const CONF_COLORS = { High: 'text-green-600 bg-green-50 border-green-200', Medium: 'text-amber-600 bg-amber-50 border-amber-200', Low: 'text-red-600 bg-red-50 border-red-200' };

function ConfBadge({ level }) {
  const cls = CONF_COLORS[level] ?? '';
  return <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${cls}`}>{level}</span>;
}

// ─── Source Form Dialog ─────────────────────────────────────────────────────────

function SourceFormDialog({ open, onOpenChange, source, onSave }) {
  const isEdit = !!source;
  const [form, setForm] = useState(source ? { name: source.name, type: source.type, description: source.description, confidence: source.confidence, projects: source.projects, isActive: source.isActive } : { ...EMPTY_FORM });

  const handleOpen = (v) => { if (v) setForm(source ? { name: source.name, type: source.type, description: source.description, confidence: source.confidence, projects: source.projects, isActive: source.isActive } : { ...EMPTY_FORM }); onOpenChange(v); };
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Source' : 'Add New Source'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Update the vulnerability source details.' : 'Register a new vulnerability detection source.'}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form id="source-form" onSubmit={(e) => { e.preventDefault(); onSave(form); onOpenChange(false); }} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[0.8125rem]">Source Name <span className="text-destructive">*</span></Label>
              <Input size="md" placeholder="e.g. Burp Suite Pro" value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[0.8125rem]">Type</Label>
                <Select value={form.type} onValueChange={(v) => set('type', v)}>
                  <SelectTrigger size="md"><SelectValue /></SelectTrigger>
                  <SelectContent>{SOURCE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[0.8125rem]">Confidence Level</Label>
                <Select value={form.confidence} onValueChange={(v) => set('confidence', v)}>
                  <SelectTrigger size="md"><SelectValue /></SelectTrigger>
                  <SelectContent>{CONFIDENCE_LEVELS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[0.8125rem]">Description</Label>
              <Textarea size="md" rows={3} placeholder="Brief description..." value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-md border border-input px-3 py-2.5">
              <div>
                <p className="text-[0.8125rem] font-medium text-foreground">Active Status</p>
                <p className="text-xs text-muted-foreground">Inactive sources won't ingest new findings.</p>
              </div>
              <Switch size="sm" checked={form.isActive} onCheckedChange={(v) => set('isActive', v)} />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="md" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="primary" size="md" type="submit" form="source-form" disabled={!form.name.trim()}>{isEdit ? 'Save Changes' : 'Add Source'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Dialog ──────────────────────────────────────────────────────────────

function DeleteSourceDialog({ open, onOpenChange, source, onConfirm }) {
  if (!source) return null;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Source</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to delete <span className="font-semibold text-foreground">{source.name}</span>? Historical findings will remain but new detections will stop.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => { onConfirm(source.id); onOpenChange(false); }}>Delete Source</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Detail Dialog ──────────────────────────────────────────────────────────────

function SourceDetailDialog({ open, onOpenChange, source }) {
  if (!source) return null;
  const f = source.findings;
  const accuracy = pct(f.valid, f.total);
  const fpRate = pct(f.falsePositive, f.total);
  // Mini accuracy ring
  const ringSize = 80, ringStroke = 8, ringR = (ringSize - ringStroke) / 2;
  const ringC = 2 * Math.PI * ringR, ringP = (accuracy / 100) * ringC;
  const ringColor = accuracy >= 85 ? '#22c55e' : accuracy >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Source Details</DialogTitle></DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-5">
            {/* Header with ring */}
            <div className="flex items-center gap-4">
              <div className="relative" style={{ width: ringSize, height: ringSize }}>
                <svg width={ringSize} height={ringSize} className="transform -rotate-90">
                  <circle cx={ringSize/2} cy={ringSize/2} r={ringR} fill="none" stroke="var(--border)" strokeWidth={ringStroke} opacity={0.25} />
                  <circle cx={ringSize/2} cy={ringSize/2} r={ringR} fill="none" stroke={ringColor} strokeWidth={ringStroke} strokeDasharray={`${ringP} ${ringC - ringP}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold tabular-nums" style={{ color: ringColor }}>{accuracy}%</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground">{source.name}</h3>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <Badge variant={TYPE_COLORS[source.type]} size="sm">{source.type}</Badge>
                  <ConfBadge level={source.confidence} />
                  <Badge variant={source.isActive ? 'success' : 'secondary'} size="sm">{source.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                {source.description && <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{source.description}</p>}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Total', value: f.total, cls: 'text-foreground' },
                { label: 'Valid', value: f.valid, cls: 'text-green-600' },
                { label: 'False Positive', value: f.falsePositive, cls: 'text-red-500' },
                { label: 'Ignored', value: f.ignored, cls: 'text-muted-foreground' },
                { label: 'Risk Accepted', value: f.riskAccepted, cls: 'text-amber-600' },
                { label: 'FP Rate', value: `${fpRate}%`, cls: fpRate > 30 ? 'text-red-500' : fpRate > 15 ? 'text-amber-600' : 'text-green-600' },
              ].map((s) => (
                <div key={s.label} className="rounded-md bg-muted/50 p-2.5 text-center">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-base font-semibold tabular-nums ${s.cls}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div>
              <p className="text-xs text-muted-foreground mb-1.5 font-medium">Assigned to {source.projects.length} Project{source.projects.length !== 1 ? 's' : ''}</p>
              <div className="flex flex-wrap gap-1.5">{source.projects.map((p) => <Badge key={p} variant="outline" size="sm">{p}</Badge>)}</div>
            </div>

            {/* Meta */}
            <p className="text-xs text-muted-foreground">Registered since {new Date(source.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
        </DialogBody>
        <DialogFooter><Button variant="outline" size="md" onClick={() => onOpenChange(false)}>Close</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function VulnSourcesPage() {
  const [sources, setSources] = useState(INITIAL_SOURCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editSource, setEditSource] = useState(null);
  const [detailSource, setDetailSource] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteSource, setDeleteSource] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Computed
  const activeSources = sources.filter((s) => s.isActive);
  const totalFindings = sources.reduce((a, s) => a + s.findings.total, 0);
  const totalValid = sources.reduce((a, s) => a + s.findings.valid, 0);
  const totalFP = sources.reduce((a, s) => a + s.findings.falsePositive, 0);
  const noisySources = sources.filter((s) => pct(s.findings.falsePositive, s.findings.total) > 30);
  const highConfSources = sources.filter((s) => s.confidence === 'High' && pct(s.findings.valid, s.findings.total) > 85);
  const multiSourceVulns = DEDUP_ENTRIES.length;
  const singleSourceVulns = totalFindings - DEDUP_ENTRIES.reduce((a, d) => a + d.count, 0) + multiSourceVulns;

  // Filtered sources for table
  const filtered = useMemo(() => {
    let list = sources;
    if (searchQuery.trim()) { const q = searchQuery.toLowerCase(); list = list.filter((s) => s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q)); }
    if (typeFilter !== 'all') list = list.filter((s) => s.type === typeFilter);
    if (statusFilter !== 'all') list = list.filter((s) => (statusFilter === 'active' ? s.isActive : !s.isActive));
    return list;
  }, [sources, searchQuery, typeFilter, statusFilter]);

  // Chart data
  const findingsBySource = sources.filter((s) => s.findings.total > 0).sort((a, b) => b.findings.total - a.findings.total).map((s) => ({ name: s.name.length > 16 ? s.name.slice(0, 14) + '…' : s.name, findings: s.findings.total, valid: s.findings.valid, fp: s.findings.falsePositive }));
  const accuracyDonut = [{ name: 'Valid', value: totalValid, fill: '#22c55e' }, { name: 'False Positive', value: totalFP, fill: '#ef4444' }, { name: 'Ignored', value: sources.reduce((a, s) => a + s.findings.ignored, 0), fill: '#a3a3a3' }, { name: 'Risk Accepted', value: sources.reduce((a, s) => a + s.findings.riskAccepted, 0), fill: '#f59e0b' }];
  const activityData = MONTHS.map((m, i) => ({ month: m, ...Object.fromEntries(sources.filter((s) => s.isActive).slice(0, 5).map((s) => [s.name.split(' ')[0], s.monthlyActivity[i] || 0])) }));
  const activityKeys = sources.filter((s) => s.isActive).slice(0, 5).map((s, i) => ({ key: s.name.split(' ')[0], label: s.name }));
  const activityColors = ['#3b82f6', '#f97316', '#8b5cf6', '#22c55e', '#ef4444'];

  // CRUD
  const handleSave = (form) => {
    if (editSource) {
      setSources((p) => p.map((s) => s.id === editSource.id ? { ...s, ...form } : s));
      setEditSource(null);
    } else {
      setSources((p) => [{ ...form, id: String(Date.now()), createdAt: new Date().toISOString().slice(0, 10), findings: { total: 0, valid: 0, falsePositive: 0, ignored: 0, riskAccepted: 0 }, monthlyActivity: Array(12).fill(0), projects: [] }, ...p]);
    }
  };
  const handleDelete = (id) => setSources((p) => p.filter((s) => s.id !== id));
  const handleToggle = (id) => setSources((p) => p.map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s));

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Vulnerability Sources</h1>
        <p className="text-sm text-muted-foreground">Understand tool effectiveness, reduce noise, improve trust in findings, and identify coverage gaps.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Sources', value: sources.length, icon: Radar, sub: `${activeSources.length} active`, color: 'bg-primary/10 text-primary', trend: 'up', trendVal: '+2' },
          { label: 'Total Findings', value: totalFindings.toLocaleString(), icon: ScanLine, sub: 'across all sources', color: 'bg-blue-500/10 text-blue-600', trend: 'down', trendVal: '-8%' },
          { label: 'Validation Rate', value: `${pct(totalValid, totalFindings)}%`, icon: ShieldCheck, sub: `${totalValid.toLocaleString()} valid`, color: 'bg-green-500/10 text-green-600', trend: 'up', trendVal: '+3%' },
          { label: 'False Positive Rate', value: `${pct(totalFP, totalFindings)}%`, icon: ShieldAlert, sub: `${totalFP.toLocaleString()} findings`, color: 'bg-amber-500/10 text-amber-600', trend: 'down', trendVal: '-5%' },
          { label: 'Noisy Sources', value: noisySources.length, icon: AlertTriangle, sub: '>30% FP rate', color: 'bg-red-500/10 text-red-500', trend: 'down', trendVal: '-1' },
          { label: 'High Confidence', value: highConfSources.length, icon: Shield, sub: '>85% accuracy', color: 'bg-emerald-500/10 text-emerald-600', trend: 'up', trendVal: '+1' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
                <div className={`flex items-center justify-center size-8 rounded-lg ${kpi.color}`}><kpi.icon className="size-4" /></div>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-semibold text-foreground tabular-nums">{kpi.value}</p>
                {kpi.trend && (
                  <div className={`flex items-center gap-0.5 text-xs font-medium mb-0.5 ${kpi.trend === 'up' && kpi.label !== 'Noisy Sources' ? 'text-green-600' : kpi.trend === 'down' && kpi.label === 'Noisy Sources' ? 'text-green-600' : kpi.trend === 'down' && kpi.label === 'False Positive Rate' ? 'text-green-600' : kpi.trend === 'down' && kpi.label === 'Total Findings' ? 'text-green-600' : 'text-green-600'}`}>
                    {kpi.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {kpi.trendVal}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList variant="line" size="md">
          <TabsTrigger value="overview"><Activity className="size-4" /> Overview</TabsTrigger>
          <TabsTrigger value="sources"><Layers className="size-4" /> Sources</TabsTrigger>
          <TabsTrigger value="analytics"><ScanLine className="size-4" /> Analytics</TabsTrigger>
          <TabsTrigger value="coverage"><MapPin className="size-4" /> Coverage</TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Overview ── */}
        <TabsContent value="overview">
          <div className="flex flex-col gap-6 mt-4">
            {/* Top & Bottom Performers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-sm">Top Performing Sources</CardTitle><CardToolbar><Badge variant="success" size="sm"><Zap className="size-3" /> High Trust</Badge></CardToolbar></CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {sources.filter(s => pct(s.findings.valid, s.findings.total) >= 85 && s.findings.total > 30).sort((a,b) => pct(b.findings.valid, b.findings.total) - pct(a.findings.valid, a.findings.total)).slice(0, 3).map((s) => {
                    const acc = pct(s.findings.valid, s.findings.total);
                    return (
                      <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-green-50/60 border border-green-100">
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center justify-center size-8 rounded-md bg-green-500/10"><CheckCircle2 className="size-4 text-green-600" /></div>
                          <div><p className="text-[0.8125rem] font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.findings.total} findings · {s.findings.valid} valid</p></div>
                        </div>
                        <div className="text-right"><p className="text-lg font-semibold tabular-nums text-green-600">{acc}%</p><p className="text-[10px] text-muted-foreground">accuracy</p></div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Sources Needing Attention</CardTitle><CardToolbar><Badge variant="destructive" size="sm"><AlertTriangle className="size-3" /> Noisy</Badge></CardToolbar></CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {sources.filter(s => pct(s.findings.falsePositive, s.findings.total) > 25 && s.findings.total > 30).sort((a,b) => pct(b.findings.falsePositive, b.findings.total) - pct(a.findings.falsePositive, a.findings.total)).slice(0, 3).map((s) => {
                    const fp = pct(s.findings.falsePositive, s.findings.total);
                    return (
                      <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-red-50/60 border border-red-100">
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center justify-center size-8 rounded-md bg-red-500/10"><XCircle className="size-4 text-red-500" /></div>
                          <div><p className="text-[0.8125rem] font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.findings.total} findings · {s.findings.falsePositive} false positives</p></div>
                        </div>
                        <div className="text-right"><p className="text-lg font-semibold tabular-nums text-red-500">{fp}%</p><p className="text-[10px] text-muted-foreground">FP rate</p></div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
              <div className="lg:col-span-2">
                <ReBarChart data={findingsBySource} xKey="name" keys={[{ key: 'valid', label: 'Valid' }, { key: 'fp', label: 'False Positive' }]} colors={['#22c55e', '#ef4444']} title="Findings by Source" height={260} titleBadge={<span data-slot="badge" className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs">{totalFindings} Total</span>} />
              </div>
              <DonutChart data={accuracyDonut} title="Findings Classification" centerValue={`${pct(totalValid, totalFindings)}%`} centerLabel="Accuracy" height={260} />
            </div>

            {/* Source Type Distribution + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
              <DonutChart data={SOURCE_TYPES.map((t, i) => ({ name: t, value: sources.filter(s => s.type === t).length, fill: ['#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#ef4444'][i] }))} title="Source Type Distribution" centerValue={String(sources.length)} centerLabel="Sources" height={240} />
              <div className="lg:col-span-2">
                <ReAreaChart data={activityData} xKey="month" keys={activityKeys} colors={activityColors} title="Source Activity (12 Months)" height={240} titleBadge={<span data-slot="badge" className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs">{activeSources.length} Active Sources</span>} />
              </div>
            </div>
            {/* Quick stats table */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Source Performance Summary</CardTitle></CardHeader>
              <CardTable>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead className="w-48">Source</TableHead><TableHead>Type</TableHead><TableHead className="text-center">Findings</TableHead><TableHead className="text-center">Valid</TableHead><TableHead className="text-center">FP</TableHead><TableHead className="text-center">Accuracy</TableHead><TableHead className="text-center">FP Rate</TableHead><TableHead className="text-center">Confidence</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {sources.sort((a, b) => b.findings.total - a.findings.total).map((s) => {
                      const a = pct(s.findings.valid, s.findings.total), fp = pct(s.findings.falsePositive, s.findings.total);
                      return (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell><Badge variant={TYPE_COLORS[s.type]} size="sm">{s.type}</Badge></TableCell>
                          <TableCell className="text-center tabular-nums">{s.findings.total}</TableCell>
                          <TableCell className="text-center tabular-nums text-green-600">{s.findings.valid}</TableCell>
                          <TableCell className="text-center tabular-nums text-red-500">{s.findings.falsePositive}</TableCell>
                          <TableCell className="text-center"><div className="flex flex-col items-center gap-1"><Progress value={a} className="h-1.5 w-16" /><span className="text-xs tabular-nums">{a}%</span></div></TableCell>
                          <TableCell className="text-center"><span className={`text-xs tabular-nums font-medium ${fp > 30 ? 'text-red-500' : fp > 15 ? 'text-amber-500' : 'text-green-600'}`}>{fp}%</span></TableCell>
                          <TableCell className="text-center"><ConfBadge level={s.confidence} /></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardTable>
            </Card>
          </div>
        </TabsContent>

        {/* ── Tab 2: Sources Management ── */}
        <TabsContent value="sources">
          <div className="flex flex-col gap-5 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">All Sources</CardTitle>
                <CardToolbar>
                  <InputWrapper size="sm" className="w-48">
                    <Search className="size-4" />
                    <Input placeholder="Search sources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </InputWrapper>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger size="sm" className="w-32"><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">All Types</SelectItem>{SOURCE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger size="sm" className="w-28"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
                  </Select>
                  <Button variant="primary" size="sm" className="gap-1.5" onClick={() => { setEditSource(null); setFormOpen(true); }}><Plus size={15} /> Add Source</Button>
                </CardToolbar>
              </CardHeader>
              <CardTable>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead className="w-56">Source</TableHead><TableHead>Type</TableHead><TableHead className="text-center">Projects</TableHead><TableHead className="text-center">Findings</TableHead><TableHead className="text-center">Valid / FP</TableHead><TableHead className="text-center">Accuracy</TableHead><TableHead className="text-center">Confidence</TableHead><TableHead className="text-center w-28">Status</TableHead><TableHead className="text-center w-16">Actions</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow><TableCell colSpan={9} className="h-32 text-center"><div className="flex flex-col items-center gap-2 text-muted-foreground"><Radar className="size-8 opacity-30" /><p className="text-sm">No sources found.</p></div></TableCell></TableRow>
                    ) : filtered.map((s) => {
                      const acc = pct(s.findings.valid, s.findings.total);
                      return (
                      <TableRow key={s.id}>
                        <TableCell>
                          <div className="min-w-0"><p className="text-[0.8125rem] font-medium text-foreground truncate">{s.name}</p>{s.description && <p className="text-xs text-muted-foreground truncate max-w-[230px]">{s.description}</p>}</div>
                        </TableCell>
                        <TableCell><Badge variant={TYPE_COLORS[s.type]} size="sm">{s.type}</Badge></TableCell>
                        <TableCell className="text-center"><Badge variant="outline" size="sm">{s.projects.length}</Badge></TableCell>
                        <TableCell className="text-center tabular-nums font-medium">{s.findings.total}</TableCell>
                        <TableCell className="text-center"><span className="text-xs tabular-nums"><span className="text-green-600 font-medium">{s.findings.valid}</span> <span className="text-muted-foreground">/</span> <span className="text-red-500 font-medium">{s.findings.falsePositive}</span></span></TableCell>
                        <TableCell className="text-center"><div className="flex flex-col items-center gap-0.5"><Progress value={acc} className="h-1.5 w-14" /><span className={`text-xs tabular-nums font-medium ${acc >= 85 ? 'text-green-600' : acc >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{acc}%</span></div></TableCell>
                        <TableCell className="text-center"><ConfBadge level={s.confidence} /></TableCell>
                        <TableCell className="text-center"><div className="flex items-center justify-center gap-2"><Switch size="sm" checked={s.isActive} onCheckedChange={() => handleToggle(s.id)} /><Badge variant={s.isActive ? 'success' : 'secondary'} size="sm" className="min-w-[55px] justify-center">{s.isActive ? 'Active' : 'Off'}</Badge></div></TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="size-7 p-0"><Ellipsis className="size-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-[150px]">
                              <DropdownMenuItem onClick={() => { setDetailSource(s); setDetailOpen(true); }}><Eye className="size-4" /> View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setEditSource(s); setFormOpen(true); }}><Pencil className="size-4" /> Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive" onClick={() => { setDeleteSource(s); setDeleteOpen(true); }}><Trash2 className="size-4" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                    })}
                  </TableBody>
                </Table>
              </CardTable>
            </Card>
          </div>
        </TabsContent>

        {/* ── Tab 3: Analytics ── */}
        <TabsContent value="analytics">
          <div className="flex flex-col gap-6 mt-4">
            {/* Noise vs Accuracy */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Noise vs Accuracy Analysis</CardTitle><CardToolbar><span data-slot="badge" className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs">{noisySources.length} Noisy</span></CardToolbar></CardHeader>
              <CardTable>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead className="w-48">Source</TableHead><TableHead className="text-center">Total</TableHead><TableHead className="text-center">Valid</TableHead><TableHead className="text-center">FP</TableHead><TableHead className="text-center">Ignored</TableHead><TableHead className="text-center">Risk Acc.</TableHead><TableHead className="text-center">Accuracy</TableHead><TableHead className="text-center">FP Rate</TableHead><TableHead className="text-center">Signal</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {sources.sort((a, b) => pct(b.findings.valid, b.findings.total) - pct(a.findings.valid, a.findings.total)).map((s) => {
                      const acc = pct(s.findings.valid, s.findings.total), fp = pct(s.findings.falsePositive, s.findings.total);
                      const signal = acc >= 85 ? 'High Trust' : acc >= 60 ? 'Moderate' : 'Noisy';
                      const sigCls = acc >= 85 ? 'text-green-600' : acc >= 60 ? 'text-amber-600' : 'text-red-500';
                      return (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell className="text-center tabular-nums">{s.findings.total}</TableCell>
                          <TableCell className="text-center tabular-nums text-green-600">{s.findings.valid}</TableCell>
                          <TableCell className="text-center tabular-nums text-red-500">{s.findings.falsePositive}</TableCell>
                          <TableCell className="text-center tabular-nums">{s.findings.ignored}</TableCell>
                          <TableCell className="text-center tabular-nums">{s.findings.riskAccepted}</TableCell>
                          <TableCell className="text-center"><div className="flex flex-col items-center gap-0.5"><Progress value={acc} className="h-1.5 w-16" /><span className="text-xs tabular-nums">{acc}%</span></div></TableCell>
                          <TableCell className="text-center"><span className={`text-xs font-medium tabular-nums ${fp > 30 ? 'text-red-500' : fp > 15 ? 'text-amber-500' : 'text-green-600'}`}>{fp}%</span></TableCell>
                          <TableCell className="text-center"><span className={`text-xs font-medium ${sigCls}`}>{signal}</span></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardTable>
            </Card>

            {/* Detection Mode + Confidence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Card>
                <CardHeader><CardTitle className="text-sm">Detection Mode</CardTitle></CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2.5"><GitMerge className="size-4 text-primary" /><span className="text-[0.8125rem] font-medium">Multi-Source Detected</span></div>
                    <span className="text-lg font-semibold tabular-nums">{multiSourceVulns}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2.5"><Layers className="size-4 text-muted-foreground" /><span className="text-[0.8125rem] font-medium">Single-Source Only</span></div>
                    <span className="text-lg font-semibold tabular-nums">{singleSourceVulns}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Multi-source detections indicate higher-confidence findings corroborated by multiple tools.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Confidence Distribution</CardTitle></CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {CONFIDENCE_LEVELS.map((lvl) => {
                    const count = sources.filter((s) => s.confidence === lvl).length;
                    return (
                      <div key={lvl} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5"><ConfBadge level={lvl} /><span className="text-[0.8125rem]">{count} source{count !== 1 ? 's' : ''}</span></div>
                        <Progress value={pct(count, sources.length)} className="h-1.5 w-24" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Deduplication Table */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Cross-Source Deduplication</CardTitle><CardToolbar><span data-slot="badge" className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs">{DEDUP_ENTRIES.length} Merged</span></CardToolbar></CardHeader>
              <CardTable>
                <Table>
                  <TableHeader><TableRow><TableHead className="w-72">Vulnerability</TableHead><TableHead>Detected By</TableHead><TableHead className="text-center w-24">Sources</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {DEDUP_ENTRIES.map((d) => (
                      <TableRow key={d.vuln}>
                        <TableCell className="font-medium text-[0.8125rem]">{d.vuln}</TableCell>
                        <TableCell><div className="flex flex-wrap gap-1">{d.sources.map((s) => <Badge key={s} variant="outline" size="sm">{s}</Badge>)}</div></TableCell>
                        <TableCell className="text-center"><Badge variant="primary" size="sm">{d.count}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardTable>
            </Card>
          </div>
        </TabsContent>

        {/* ── Tab 4: Coverage & Routing ── */}
        <TabsContent value="coverage">
          <div className="flex flex-col gap-6 mt-4">
            {/* Coverage Matrix */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Project × Source Coverage Matrix</CardTitle></CardHeader>
              <CardTable>
                <Table>
                  <TableHeader><TableRow><TableHead className="w-44">Project</TableHead>{SOURCE_TYPES.map((t) => <TableHead key={t} className="text-center text-xs">{t}</TableHead>)}<TableHead className="text-center">Coverage</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {PROJECTS.map((proj) => {
                      const covered = SOURCE_TYPES.map((type) => sources.some((s) => s.isActive && s.type === type && s.projects.includes(proj)));
                      const coverageCount = covered.filter(Boolean).length;
                      return (
                        <TableRow key={proj}>
                          <TableCell className="font-medium text-[0.8125rem]">{proj}</TableCell>
                          {covered.map((c, i) => (
                            <TableCell key={SOURCE_TYPES[i]} className="text-center">{c ? <CheckCircle2 className="size-4 text-green-500 mx-auto" /> : <XCircle className="size-4 text-red-400/50 mx-auto" />}</TableCell>
                          ))}
                          <TableCell className="text-center"><div className="flex flex-col items-center gap-0.5"><Progress value={pct(coverageCount, SOURCE_TYPES.length)} className="h-1.5 w-16" /><span className="text-xs tabular-nums">{coverageCount}/{SOURCE_TYPES.length}</span></div></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardTable>
            </Card>

            {/* Gap Analysis */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Coverage Gap Analysis</CardTitle><CardToolbar><span data-slot="badge" className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs text-amber-600">{PROJECTS.reduce((a, p) => a + SOURCE_TYPES.filter((t) => !sources.some((s) => s.isActive && s.type === t && s.projects.includes(p))).length, 0)} Gaps</span></CardToolbar></CardHeader>
              <CardTable>
                <Table>
                  <TableHeader><TableRow><TableHead className="w-44">Project</TableHead><TableHead>Missing Source Types</TableHead><TableHead className="text-center">Risk</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {PROJECTS.map((proj) => {
                      const missing = SOURCE_TYPES.filter((t) => !sources.some((s) => s.isActive && s.type === t && s.projects.includes(proj)));
                      if (missing.length === 0) return null;
                      const risk = missing.length >= 3 ? 'High' : missing.length >= 2 ? 'Medium' : 'Low';
                      return (
                        <TableRow key={proj}>
                          <TableCell className="font-medium">{proj}</TableCell>
                          <TableCell><div className="flex flex-wrap gap-1">{missing.map((m) => <Badge key={m} variant="outline" size="sm" className="text-amber-600 border-amber-200 bg-amber-50">{m}</Badge>)}</div></TableCell>
                          <TableCell className="text-center"><ConfBadge level={risk} /></TableCell>
                        </TableRow>
                      );
                    }).filter(Boolean)}
                  </TableBody>
                </Table>
              </CardTable>
            </Card>

            {/* Routing Rules */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Source-Based Routing Rules</CardTitle><CardToolbar><Badge variant="outline" size="sm"><Route className="size-3.5" /> {ROUTING_RULES.length} Rules</Badge></CardToolbar></CardHeader>
              <CardTable>
                <Table>
                  <TableHeader><TableRow><TableHead className="w-44">Source</TableHead><TableHead>Target Team</TableHead><TableHead>Routing Rule</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {ROUTING_RULES.map((r) => (
                      <TableRow key={r.source}>
                        <TableCell className="font-medium text-[0.8125rem]">{r.source}</TableCell>
                        <TableCell><Badge variant="secondary" size="sm">{r.targetTeam}</Badge></TableCell>
                        <TableCell className="text-[0.8125rem] text-muted-foreground">{r.rule}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardTable>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <SourceFormDialog open={formOpen} onOpenChange={(v) => { setFormOpen(v); if (!v) setEditSource(null); }} source={editSource} onSave={handleSave} />
      <SourceDetailDialog open={detailOpen} onOpenChange={setDetailOpen} source={detailSource} />
      <DeleteSourceDialog open={deleteOpen} onOpenChange={setDeleteOpen} source={deleteSource} onConfirm={handleDelete} />
    </div>
  );
}
