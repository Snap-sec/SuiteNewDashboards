import { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Plus,
  Search,
  Filter,
  Settings,
  Ellipsis,
  ChevronRight,
  ChevronLeft,
  Copy,
  Files,
  Eye,
  TrendingDown,
  TrendingUp,
  Minus,
  CircleDot,
  Shield,
  Globe,
  Monitor,
  ArrowUpRight,
  Sparkles,
  Info,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

// ── Static mock data ───────────────────────────────────────────────────

const SIGNAL_CARDS = [
  {
    id: 1,
    title: 'Admin Accounts that have Not Changed their Password for one Year',
    violations: 6,
    severity: 'critical',
    trendPercent: -86,
    trendDirection: 'down',
  },
  {
    id: 2,
    title: 'Assets with a High ACR and Critical Vulnerabilities',
    violations: 123,
    severity: 'high',
    trendPercent: 36.87,
    trendDirection: 'up',
  },
  {
    id: 3,
    title: 'Administrative Accounts Connected to an Internet-Exposed Host',
    violations: 1,
    severity: 'critical',
    trendPercent: -25,
    trendDirection: 'down',
  },
  {
    id: 4,
    title: 'Cloud assets with critical severity findings and AES score above 700',
    violations: 124,
    severity: 'high',
    trendPercent: 34,
    trendDirection: 'up',
  },
  {
    id: 5,
    title: 'Active Directory Domain Controllers being Administered by Non Administ...',
    violations: 0,
    severity: 'medium',
    trendPercent: 0,
    trendDirection: 'neutral',
  },
  {
    id: 6,
    title: 'Exposed S3 Buckets with Public Read Access',
    violations: 42,
    severity: 'critical',
    trendPercent: 12,
    trendDirection: 'up',
  },
];

const IMPACTED_ASSETS = [
  { id: 1, name: 'COELPT54321', type: 'Subdomain', severity: 'critical', status: 'In Review', ticket: 'VM-1042' },
  { id: 2, name: 'RCOELPT514C2', type: 'IP Address', severity: 'high', status: 'Triaged', ticket: 'VM-1038' },
  { id: 3, name: 'NONCOELP1234', type: 'Subdomain', severity: 'critical', status: 'Open', ticket: 'VM-1035' },
  { id: 4, name: 'Optimus', type: 'Port', severity: 'medium', status: 'In Review', ticket: null },
  { id: 5, name: 'TYT7216B03A', type: 'Certificate', severity: 'high', status: 'Mitigated', ticket: 'VM-1029' },
  { id: 6, name: 'Itamar1', type: 'Subdomain', severity: 'low', status: 'Resolved', ticket: null },
];

const ACTIVE_SIGNAL = {
  title: 'Admin Accounts that have Not Changed their Password for one Year',
  lastRun: '22 March 10:00pm',
  ruleAuthor: 'imran@snapsec.co',
  description:
    'An exposure signal that looks for Admin account assets that have not changed their password in one year or more. These accounts are considered deprecated and may be vulnerable to attack, as they are using weak passwords.',
  queryParts: [
    { type: 'entity', label: 'Asset' },
    { type: 'keyword', label: 'AS' },
    { type: 'entity', label: 'Account' },
    { type: 'keyword', label: 'HAS' },
    { type: 'filter', label: 'AD Last Password Update Time older than 1 YEARS' },
    { type: 'keyword', label: 'AND' },
    { type: 'filter', label: 'Directory Admin Count > 1' },
  ],
};

// ── Helper components ──────────────────────────────────────────────────

function TrendBadge({ percent, direction }) {
  if (direction === 'neutral' || percent === 0) {
    return <span className="text-xs text-muted-foreground flex items-center gap-1"><Minus className="size-3" /> 0%</span>;
  }
  const isUp = direction === 'up';
  return (
    <span className={`text-xs flex items-center gap-0.5 font-medium ${isUp ? 'text-red-600' : 'text-green-600'}`}>
      {isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
      {isUp ? '+' : ''}{percent}%
    </span>
  );
}

function MiniRiskLabel({ severity }) {
  const normalized = severity?.toLowerCase() || 'none';
  const colors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
    none: 'bg-gray-500',
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${colors[normalized]}`} />
      <span className="text-[12px] font-medium capitalize text-muted-foreground">
        {severity}
      </span>
    </div>
  );
}

function SignalCard({ signal, isActive, onClick }) {
  return (
    <Card
      className={`cursor-pointer transition-all relative overflow-hidden border ${isActive
        ? 'border-primary ring-1 ring-primary/20 shadow-sm bg-accent/5'
        : 'hover:shadow-sm border-transparent'
        }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
            {signal.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[140px]">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-start gap-4 mt-4">
          <div className="flex flex-col gap-1 w-[60px]">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Violations</span>
            <span className="text-lg font-bold text-foreground leading-none">{signal.violations}</span>
          </div>
          <div className="flex flex-col gap-1 w-[70px]">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Risk</span>
            <div className="flex items-center h-5">
              <MiniRiskLabel severity={signal.severity} />
            </div>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider whitespace-nowrap">Trends (last 7 days)</span>
            <div className="flex items-center h-5">
              <TrendBadge percent={signal.trendPercent} direction={signal.trendDirection} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QueryPill({ part }) {
  if (part.type === 'keyword') {
    return (
      <span className="text-[11px] text-muted-foreground font-bold px-1 uppercase letter-spacing-1">
        {part.label}
      </span>
    );
  }
  return (
    <div className="flex items-center gap-2 bg-background border border-border/60 hover:border-border px-2.5 py-1.5 rounded-md shadow-sm transition-colors cursor-default group">
      {part.type === 'entity' && <CircleDot className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />}
      {part.type === 'filter' && <Filter className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />}
      <span className="text-xs font-semibold text-foreground/90">{part.label}</span>
    </div>
  );
}

function ExposureSignalsV2() {
  const [activeSignalId, setActiveSignalId] = useState(1);
  const [currentTab, setCurrentTab] = useState('built-in');

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Helmet>
        <title>Exposure Policy & Signals v2 | Demo</title>
      </Helmet>

      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* ─── Left Sidebar ─────────────────────────────────────── */}
        <aside className="w-[380px] shrink-0 border-r border-border flex flex-col bg-background/50">
          <div className="p-4 flex flex-col gap-4 border-b border-border/60">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="w-full bg-muted/50 p-1">
                <TabsTrigger value="built-in" className="flex-1 text-xs font-semibold">Active</TabsTrigger>
                <TabsTrigger value="custom" className="flex-1 text-xs font-semibold">Directory</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search signals..."
                  className="pl-9 h-9 text-xs bg-muted/30 border-border/60 focus:bg-background transition-all"
                />
              </div>
              <Button size="icon" className="h-9 w-9 shrink-0">
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 flex flex-col gap-3">
              {SIGNAL_CARDS.map((signal) => (
                <SignalCard
                  key={signal.id}
                  signal={signal}
                  isActive={activeSignalId === signal.id}
                  onClick={() => setActiveSignalId(signal.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* ─── Right Detail Panel ───────────────────────────────── */}
        <main className="flex-1 overflow-auto bg-muted/5">
          <div className="max-w-[1200px] mx-auto p-8">
            {/* Rule Header */}
            <header className="mb-8 relative pl-6">
              <div className="absolute left-0 top-1 bottom-1 w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
              <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
                {ACTIVE_SIGNAL.title}
              </h1>
              <div className="flex items-center gap-3 text-[13px] text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5">
                  Last Run: <span className="text-foreground/80">{ACTIVE_SIGNAL.lastRun}</span>
                </span>
                <span className="opacity-40">•</span>
                <span className="flex items-center gap-1.5">
                  Rule Author: <span className="text-foreground/80">{ACTIVE_SIGNAL.ruleAuthor}</span>
                </span>
                <span className="opacity-40">•</span>
                <button className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group">
                  Edit rule <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </header>

            <div className="space-y-6">
              {/* Description Card */}
              <Card className="border-border/60 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Info className="size-4 text-primary" />
                      What is it about?
                    </CardTitle>
                    <Badge variant="secondary" className="px-2 py-0.5 text-[10px] uppercase font-heavy tracking-wider flex items-center gap-1 bg-primary/10 text-primary border-primary/20">
                      <Sparkles className="size-3" />
                      Generated by AI
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-foreground/80 leading-relaxed max-w-[800px]">
                    {ACTIVE_SIGNAL.description}
                  </p>
                </CardContent>
              </Card>

              {/* Associated Query Card */}
              <Card className="border-border/60 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3 border-b border-border/40">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Settings className="size-4 text-primary" />
                    Associated Query
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="bg-muted/20 border border-border/40 p-4 rounded-xl flex items-center gap-2 flex-wrap min-h-[60px]">
                    {ACTIVE_SIGNAL.queryParts.map((part, i) => (
                      <QueryPill key={i} part={part} />
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-4 ml-1">
                    <button className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 group">
                      <Eye className="size-4 group-hover:scale-110 transition-transform" />
                      See Results in Inventory
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Impacted Assets Table Section */}
              <section className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">Exposures (Impacted Assets)</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="Search assets..."
                        className="pl-9 h-9 w-[240px] text-xs bg-muted/30 border-border/60 transition-all"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="h-9 font-semibold gap-2 border-border/60">
                      <Filter className="size-3.5" /> Filter
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 font-semibold gap-2 border-border/60">
                      <ArrowUpRight className="size-3.5" /> Export List
                    </Button>
                  </div>
                </div>

                <Card className="border-border/60 shadow-md overflow-hidden bg-background">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent border-b border-border/60">
                        <TableHead className="w-[50px] pl-6">
                          <Checkbox />
                        </TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Asset Name</TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Asset Type</TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Risk</TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-6">Status</TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ticket</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {IMPACTED_ASSETS.map((asset) => (
                        <TableRow key={asset.id} className="hover:bg-muted/10 transition-colors border-b border-border/40 last:border-0 group">
                          <TableCell className="pl-6">
                            <Checkbox />
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {asset.name}
                          </TableCell>
                          <TableCell className="text-sm text-foreground/70">
                            {asset.type}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <Badge
                                variant="outline"
                                className={`
                                  capitalize px-2 py-0.5 text-[11px] font-bold border-0
                                  ${asset.severity === 'critical' ? 'text-red-600 bg-red-50' :
                                    asset.severity === 'high' ? 'text-orange-600 bg-orange-50' :
                                      asset.severity === 'medium' ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50'}
                                `}
                              >
                                {asset.severity}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="px-6">
                            <div className="flex items-center gap-2">
                              <div className={`size-1.5 rounded-full ${asset.status === 'Resolved' ? 'bg-green-500' : 'bg-blue-500'
                                }`} />
                              <span className="text-sm font-medium text-foreground/80">{asset.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {asset.ticket ? (
                              <span className="text-[13px] font-bold text-primary/80 hover:text-primary cursor-pointer underline decoration-primary/20 underline-offset-4">
                                {asset.ticket}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground/50">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ExposureSignalsV2;
