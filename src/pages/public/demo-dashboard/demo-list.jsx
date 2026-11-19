import React from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, LayoutDashboard, BarChart2, Shield, Activity, Eye, LineChart, Building, Radar, FileText, LayoutGrid, Orbit, ClipboardList, Target } from 'lucide-react';

const demoPages = [
    {
        title: 'Demo Dashboard',
        description: 'Main demo dashboard overview page.',
        path: '/demo',
        badge: 'Dashboard',
        badgeVariant: 'primary',
        icon: LayoutDashboard,
    },
    {
        title: 'ASM Dashboard',
        description: 'Attack Surface Management dashboard with asset inventory, risk scoring, and exposure analysis.',
        path: '/demo/asm-dashboard',
        badge: 'ASM',
        badgeVariant: 'info',
        icon: Shield,
    },
    {
        title: 'Exposure Signals',
        description: 'Exposure signals view showing vulnerability findings categorized by severity and type.',
        path: '/demo/exposures',
        badge: 'Signals',
        badgeVariant: 'warning',
        icon: Activity,
    },
    {
        title: 'Exposure Signals V2',
        description: 'Revised exposure signals layout with improved signal grouping and filtering controls.',
        path: '/demo/exposures-2',
        badge: 'Signals v2',
        badgeVariant: 'warning',
        icon: Activity,
    },
    {
        title: 'Metrics 1',
        description: 'Vulnerability metrics dashboard with severity distribution, count breakdowns, and trend data.',
        path: '/demo/metrics1',
        badge: 'Metrics',
        badgeVariant: 'success',
        icon: BarChart2,
    },
    {
        title: 'Metrics 2',
        description: 'Alternative vulnerability metrics layout exploring different chart and table compositions.',
        path: '/demo/metrics2',
        badge: 'Metrics',
        badgeVariant: 'success',
        icon: BarChart2,
    },
    {
        title: 'Metrics 3',
        description: 'Third metrics variant with additional data dimensions and refined visual hierarchy.',
        path: '/demo/metrics3',
        badge: 'Metrics',
        badgeVariant: 'success',
        icon: BarChart2,
    },
    {
        title: 'Metrics 4',
        description: 'Security assessment metrics dashboard with investment analysis and department-level breakdowns.',
        path: '/demo/metrics4',
        badge: 'Metrics',
        badgeVariant: 'success',
        icon: LineChart,
    },
    {
        title: 'CISO Dashboard',
        description: 'EagleView CISO dashboard with overall security score, KPIs, vulnerability trends, and asset exposure charts.',
        path: '/demo/ciso-dash',
        badge: 'CISO',
        badgeVariant: 'destructive',
        icon: Eye,
    },
    {
        title: 'Service Vendors',
        description: 'Service vendor management module for the reporting identity layer — create, edit, and manage branded service vendor profiles for vulnerability reports.',
        path: '/demo/service-vendors',
        badge: 'Service Vendors',
        badgeVariant: 'info',
        icon: Building,
    },
    {
        title: 'Vulnerability Sources',
        description: 'Detection intelligence module providing visibility into tool effectiveness, noise reduction, and coverage gaps.',
        path: '/demo/vuln-sources',
        badge: 'Intelligence',
        badgeVariant: 'primary',
        icon: Radar,
    },
    {
        title: 'Vulnerability Info',
        description: 'Detailed vulnerability report page showing severity, CVSS scoring, affected assets, and remediation guidance.',
        path: '/demo/vulnerability-info',
        badge: 'Report',
        badgeVariant: 'warning',
        icon: FileText,
    },
    {
        title: 'Vulnerability Info V2',
        description: 'Redesigned two-column vulnerability report with refined layout, inline evidence, and improved information density.',
        path: '/demo/vulnerability-info-v2',
        badge: 'Report v2',
        badgeVariant: 'warning',
        icon: FileText,
    },
    {
        title: 'Module Selection',
        description: 'Redesigned post-login module selection screen with premium product cards and responsive grid layout.',
        path: '/demo/module-selection',
        badge: 'Home',
        badgeVariant: 'primary',
        icon: LayoutGrid,
    },
    {
        title: 'Module Selection — Orbital',
        description: 'Circular orbital layout with Snapsec logo at center and product modules arranged around it with animated connections.',
        path: '/demo/module-choose-2',
        badge: 'Home v2',
        badgeVariant: 'primary',
        icon: Orbit,
    },
    {
        title: 'Assessment Report (PDF)',
        description: 'Executive-level vulnerability assessment report with severity charts, open/closed tracking, full findings table, and one-click PDF export.',
        path: '/demo/assessment-report',
        badge: 'Report PDF',
        badgeVariant: 'destructive',
        icon: ClipboardList,
    },
    {
        title: 'Organisation Executive Report',
        description: 'Macro-level vulnerability and assessment metrics aggregation, showcasing enterprise risk posture across all projects.',
        path: '/demo/org-executive-report',
        badge: 'Org Report',
        badgeVariant: 'destructive',
        icon: ClipboardList,
    },
    {
        title: 'Scoring Selection',
        description: 'Configure prioritization strategy by switching between Standard CVSS and premium True Risk scoring systems.',
        path: '/demo/scoring-selection',
        badge: 'New',
        badgeVariant: 'success',
        icon: Target,
    },
];

export default function DemoListPage() {
    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground">Demo Pages</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Browse all available demo pages in the Snapsec UI. Click any card to navigate.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demoPages.map((page) => {
                    const Icon = page.icon;
                    return (
                        <Link key={page.path} to={page.path} className="group block">
                            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 border-border">
                                <CardHeader className="pb-2 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                                    {page.title}
                                                </CardTitle>
                                                <code className="text-xs text-muted-foreground font-mono">{page.path}</code>
                                            </div>
                                        </div>
                                        <ArrowRight
                                            size={16}
                                            className="mt-1 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="px-5 pb-5 pt-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <CardDescription className="text-[0.8125rem] text-muted-foreground leading-snug">
                                            {page.description}
                                        </CardDescription>
                                        <Badge variant={page.badgeVariant} size="sm" className="shrink-0 mt-0.5">
                                            {page.badge}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
