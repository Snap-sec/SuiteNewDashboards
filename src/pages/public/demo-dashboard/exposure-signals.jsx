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
import SeverityLabel from '@/components/custom/severity-label';

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
  {
    id: 7,
    title: 'Unpatched Apache Struts Vulnerabilities in Production',
    violations: 8,
    severity: 'critical',
    trendPercent: -50,
    trendDirection: 'down',
  },
  {
    id: 8,
    title: 'Expired SSL Certificates on Public-Facing Services',
    violations: 15,
    severity: 'high',
    trendPercent: 5,
    trendDirection: 'up',
  },
  {
    id: 9,
    title: 'Default Credentials Enabled on Management Interfaces',
    violations: 3,
    severity: 'high',
    trendPercent: -10,
    trendDirection: 'down',
  },
  {
    id: 10,
    title: 'API Endpoints Missing Rate Limiting and Authentication',
    violations: 27,
    severity: 'medium',
    trendPercent: 44,
    trendDirection: 'up',
  },
  {
    id: 11,
    title: 'Kubernetes Dashboards Exposed to the Internet',
    violations: 2,
    severity: 'critical',
    trendPercent: 0,
    trendDirection: 'neutral',
  },
  {
    id: 12,
    title: 'Open SSH Ports with Insecure Protocol Versions',
    violations: 56,
    severity: 'medium',
    trendPercent: -5,
    trendDirection: 'down',
  },
  {
    id: 13,
    title: 'Deprecated TLS Versions Enabled on Payment Gateways',
    violations: 11,
    severity: 'high',
    trendPercent: 20,
    trendDirection: 'up',
  },
  {
    id: 14,
    title: 'GCP Storage Buckets Lacking Server-Side Encryption',
    violations: 89,
    severity: 'medium',
    trendPercent: -2,
    trendDirection: 'down',
  },
  {
    id: 15,
    title: 'Jenkins Instances with Anonymous Read Access',
    violations: 4,
    severity: 'critical',
    trendPercent: 15,
    trendDirection: 'up',
  },
  {
    id: 16,
    title: 'Hardcoded API Keys in Public Git Repositories',
    violations: 19,
    severity: 'critical',
    trendPercent: 55,
    trendDirection: 'up',
  },
  {
    id: 17,
    title: 'Docker Containers Running as Root in Production',
    violations: 214,
    severity: 'high',
    trendPercent: -18,
    trendDirection: 'down',
  },
  {
    id: 18,
    title: 'MongoDB Databases Exposed Without Password Protection',
    violations: 1,
    severity: 'medium',
    trendPercent: 0,
    trendDirection: 'neutral',
  },
  {
    id: 19,
    title: 'Elasticsearch Clusters Accessible Without Authentication',
    violations: 5,
    severity: 'high',
    trendPercent: 8,
    trendDirection: 'up',
  },
  {
    id: 20,
    title: 'Excessive IAM Permissions Granted to Third-Party Apps',
    violations: 34,
    severity: 'medium',
    trendPercent: -3,
    trendDirection: 'down',
  },
];

const IMPACTED_ASSETS = [
  { id: 1, name: 'COELPT54321', type: 'Subdomain', severity: 'critical', status: 'In Review', ticket: 'VM-1042' },
  { id: 2, name: 'RCOELPT514C2', type: 'IP Address', severity: 'high', status: 'Triaged', ticket: 'VM-1038' },
  { id: 3, name: 'NONCOELP1234', type: 'Subdomain', severity: 'critical', status: 'Open', ticket: 'VM-1035' },
  { id: 4, name: 'Optimus', type: 'Port', severity: 'medium', status: 'In Review', ticket: null },
  { id: 5, name: 'TYT7216B03A', type: 'Certificate', severity: 'high', status: 'Mitigated', ticket: 'VM-1029' },
  { id: 6, name: 'Itamar1', type: 'Subdomain', severity: 'low', status: 'Resolved', ticket: null },
  { id: 7, name: 'DTP_NLG2W', type: 'IP Address', severity: 'medium', status: 'Triaged', ticket: 'VM-1021' },
  { id: 8, name: 'NCODECP321i', type: 'Port', severity: 'low', status: 'Open', ticket: null },
];

const ACTIVE_SIGNAL = {
  title: 'Admin Accounts that have Not Changed their Password for one Year',
  lastRun: '22 March 10:00pm',
  sourcesLabel: 'Rule author',
  category: 'Identify Exposure',
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
  totalAssets: 25,
};

// ── Helper components ──────────────────────────────────────────────────

function SourceDots({ sources, size = 'sm' }) {
  const colors = {
    nessus: 'bg-orange-500',
    qualys: 'bg-red-500',
    rapid7: 'bg-blue-600',
    tenable: 'bg-cyan-500',
    crowdstrike: 'bg-green-600',
    azure: 'bg-yellow-500',
  };
  const dotSize = size === 'sm' ? 'size-3' : 'size-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {sources.slice(0, 5).map((src, i) => (
        <span key={i} className={`${dotSize} rounded-full ${colors[src] || 'bg-gray-400'} border border-white`} title={src} />
      ))}
    </div>
  );
}

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

function AcrBadge({ score }) {
  let bg = 'bg-green-500';
  if (score >= 9) bg = 'bg-red-500';
  else if (score >= 7) bg = 'bg-orange-500';
  else if (score >= 5) bg = 'bg-yellow-500';

  return (
    <span className={`inline-flex items-center justify-center text-white text-[11px] font-semibold rounded-md size-6 ${bg}`}>
      {score}
    </span>
  );
}

// ── Signal Card ─────────────────────────────────────────────────────────

function SignalCard({ signal, isActive, onClick }) {
  return (
    <Card
      className={`cursor-pointer transition-all relative overflow-hidden ${isActive
          ? 'border-l-[3px] border-l-primary shadow-sm'
          : 'border-l-[3px] border-l-transparent hover:shadow-sm'
        }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-foreground leading-tight line-clamp-2">
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

        <div className="flex items-start gap-6 mt-4">
          <div className="flex flex-col gap-1.5 w-[65px]">
            <span className="text-[11px] text-muted-foreground leading-none">Violations</span>
            <div className="flex flex-col justify-center h-6">
              <span className="text-xl font-semibold text-foreground leading-none">{signal.violations}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 w-[70px]">
            <span className="text-[11px] text-muted-foreground leading-none">Risk</span>
            <div className="flex items-center h-6">
              <MiniRiskLabel severity={signal.severity} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[11px] text-muted-foreground leading-none">Trends (last 7 days)</span>
            <div className="flex items-center h-6">
              <TrendBadge percent={signal.trendPercent} direction={signal.trendDirection} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Mini Risk Label ─────────────────────────────────────────────────────

function MiniRiskLabel({ severity }) {
  const normalized = severity?.toLowerCase() || 'none';
  const colors = {
    critical: 'bg-red-500 text-red-600 dark:text-red-400',
    high: 'bg-orange-500 text-orange-600 dark:text-orange-400',
    medium: 'bg-yellow-500 text-yellow-600 dark:text-yellow-400',
    low: 'bg-green-500 text-green-600 dark:text-green-400',
    none: 'bg-gray-500 text-gray-600 dark:text-gray-400',
  };

  const selected = colors[normalized];
  if (!selected) return null;
  const [bgClass, textClassLight, textClassDark] = selected.split(' ');

  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${bgClass}`} />
      <span className={`text-[12px] font-medium capitalize ${textClassLight} ${textClassDark}`}>
        {severity}
      </span>
    </div>
  );
}

// ── Query Pill ──────────────────────────────────────────────────────────

function QueryPill({ part }) {
  if (part.type === 'keyword') {
    return (
      <span className="text-xs text-muted-foreground font-medium px-1.5">
        {part.label}
      </span>
    );
  }
  return (
    <Badge variant="secondary" appearance="outline" size="md" className="text-xs font-medium">
      {part.type === 'entity' && <CircleDot className="size-3 mr-1" />}
      {part.type === 'filter' && <Filter className="size-3 mr-1" />}
      {part.label}
    </Badge>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────

function ExposureSignals() {
  const [activeSignalId, setActiveSignalId] = useState(1);
  const [currentTab, setCurrentTab] = useState('built-in');

  return (
    <>
      <Helmet>
        <title>Exposure Signals | Demo</title>
      </Helmet>



      <div className="flex h-[calc(100vh-70px)]">
        {/* ─── Left Sidebar ─────────────────────────────────────── */}
        <div className="w-[380px] shrink-0 border-r border-border flex flex-col bg-background">
          {/* Sidebar Header */}
          <div className="p-4 pb-3 flex flex-col gap-3">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList variant="default" size="sm" className="w-full">
                <TabsTrigger value="built-in" className="flex-1">Active</TabsTrigger>
                <TabsTrigger value="custom" className="flex-1">Directory</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search signals..."
                  className="pl-8 h-8 text-xs"
                />
              </div>
              <Button variant="primary" size="sm" className="h-8 w-8 p-0 shrink-0">
                <Plus className="size-4" />
              </Button>
            </div>

          </div>

          {/* Signal Cards List */}
          <ScrollArea className="flex-1 px-4 pb-4">
            <div className="flex flex-col gap-2.5">
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
        </div>

        {/* ─── Right Detail Panel ───────────────────────────────── */}
        <div className="flex-1 overflow-auto bg-background">
          <div className="p-6">
            {/* Signal Title */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-1 bg-primary rounded-full self-stretch shrink-0" />
              <h1 className="text-xl font-semibold text-foreground leading-tight">
                {ACTIVE_SIGNAL.title}
              </h1>
            </div>

            {/* Metadata Row */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground ml-4 mb-5">
              <span>Last Run: {ACTIVE_SIGNAL.lastRun}</span>
              <span>•</span>
              <span>Rule Author: imran@snapsec.co</span>
              <span>•</span>
              <button className="text-primary text-xs font-medium hover:underline flex items-center gap-0.5">
                Edit rule <ChevronRight className="size-3" />
              </button>
            </div>

            {/* What is it about */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <Info className="size-4 text-muted-foreground" />
                    What is it about?
                  </CardTitle>
                  <Badge variant="secondary" appearance="outline" size="sm" className="text-[11px]">
                    <Sparkles className="size-3 mr-0.5" />
                    Generated by AI
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {ACTIVE_SIGNAL.description}
                </p>
              </CardContent>
            </Card>

            {/* Associated Query */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  Associated Query
                  <Info className="size-3.5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 flex-wrap p-3 bg-muted/50 rounded-lg border border-border">
                  {ACTIVE_SIGNAL.queryParts.map((part, i) => (
                    <QueryPill key={i} part={part} />
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <button className="text-primary text-xs font-medium hover:underline flex items-center gap-1">
                    <Eye className="size-3" /> See Results in Inventory
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Impacted Assets */}
            <div className="mt-6">
              <h2 className="text-base font-semibold text-foreground mb-3">Impacted Assets</h2>

              {/* Toolbar */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="size-3.5 mr-1.5" />
                    Filter
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search"
                      className="pl-8 h-8 w-[180px] text-xs"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <ArrowUpRight className="size-3.5 mr-1.5" />
                    Export List
                  </Button>
                </div>
              </div>

              {/* Assets Table */}
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox size="sm" />
                      </TableHead>
                      <TableHead className="text-xs font-semibold">Asset Name</TableHead>
                      <TableHead className="text-xs font-semibold">Asset Type</TableHead>
                      <TableHead className="text-xs font-semibold">Risk</TableHead>
                      <TableHead className="text-xs font-semibold">Status</TableHead>
                      <TableHead className="text-xs font-semibold">Ticket</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {IMPACTED_ASSETS.map((asset) => (
                      <TableRow key={asset.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Checkbox size="sm" />
                        </TableCell>
                        <TableCell className="text-sm font-medium text-foreground">
                          {asset.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {asset.type}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={asset.severity === 'critical' ? 'destructive' : asset.severity === 'high' ? 'warning' : asset.severity === 'medium' ? 'info' : 'success'}
                            appearance="outline"
                            size="sm"
                            className="capitalize"
                          >
                            {asset.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" appearance="outline" size="sm">
                            {asset.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {asset.ticket ? (
                            <Badge variant="secondary" appearance="outline" size="sm">
                              {asset.ticket}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExposureSignals;
