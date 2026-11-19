import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  ShieldCheck,
  XCircle,
  EllipsisVertical,
  Info
} from 'lucide-react';

const MOCK_MIGRATION_PLAN = {
  target: 'Target 950 Repositories: Axios 0.9 - 1.1',
  targetDesc:
    'This plan outlines a phased, automated migration with manual checkpoints. Estimated timeline: 6 weeks. Each phase gates the next to prevent cascading failures.',
  phases: [
    {
      id: 1,
      title: 'Audit & Inventory (Week 1)',
      badge: 'Automated',
      badgeVariant: 'info',
      icon: CheckCircle2,
      iconColor: 'text-[#1379f0]',
      bullets: [
        'Run repo scan runner --dep axios across all 950 repos to output an exact dependency map with current version, usage patterns, and test coverage %.',
        'Classify repos into tiers: Tier A (high coverage >85%), Tier B (partial 40-80%), Tier C (low <40%). Migrate A -> B -> C in sequence.',
        'Identify all direct usages: axios.create, custom instances, interceptors, and custom wrapper libraries across all repos.',
      ],
    },
    {
      id: 2,
      title: 'Breaking Changes Remediation (Week 2)',
      badge: 'Manual',
      badgeVariant: 'warning',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      bullets: [
        'CancelToken deprecated: Replace axios.CancelToken.source() with standard AbortController API. Est. code mod: ~80% automation, remaining manual.',
        'Response typing: v1 enforces strict generic types. Update axios.get<T>() to propagate response type correctly — review TypeScript compiler errors.',
        'Error handling: error.response is no longer implicitly typed. Wrap catch blocks with axios.isAxiosError(error) guard before accessing properties.',
        'Interceptors: Request interceptor signature changed — second argument (error handler) is now required. Add direct reject fallback where missing.',
      ],
    },
    {
      id: 3,
      title: 'Automated Batch Rollout (Weeks 3-4)',
      badge: 'CI/CD',
      badgeVariant: 'success',
      icon: PlayCircle,
      iconColor: 'text-green-500',
      bullets: [
        'Use GitHub Actions with a matrix strategy to open PRs across all repos in batches of 50/day. Template PR body includes changelog diff and test instructions.',
        'Each PR runs npm install, runs existing test suite, and reports pass/fail as a required status check before merge.',
        'Auto-merge enabled for Tier A repos on green CI. Tier B/C require manual approval from repo leads before merge.',
        'Track progress via a central dashboard (Deprecator or Grafana) showing Open / Merged / Failed PR counts per tier in real time.',
      ],
    },
    {
      id: 4,
      title: 'Validation & Testing (Week 5)',
      badge: 'QA Gate',
      badgeVariant: 'primary',
      icon: ShieldCheck,
      iconColor: 'text-indigo-500',
      bullets: [
        'Run integration tests against staging with new dependency image. Coverage must not drop below pre-migration baseline for any repo.',
        'Execute contract tests for all API consumers using Pact or mock mocks to ensure request/response shapes are unchanged after migration.',
        'Security scan with npm audit — confirm all 1,570 high + 100 medium CVEs are resolved after upgrade to axios 1.5.',
      ],
    },
    {
      id: 5,
      title: 'Rollback Strategy & Completion (Week 6)',
      badge: 'Risk Control',
      badgeVariant: 'destructive',
      icon: XCircle,
      iconColor: 'text-red-500',
      bullets: [
        'Pre-release: pin a package version snapshot per repo before opening PRs. Rollback is a simple git revert.',
        'For any repo with >5 failing tests post-merge, an automated alert triggers to revert PR immediately and notify repo owner via Slack.',
        'Final sign-off close campaign once 100% of repos show axios v1.x in their package.json and CI pipelines are green for 48 hours.',
      ],
    },
  ],
};

export default function MigrationTab() {
  return (
    <Card className="w-full bg-card">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4 px-6">
        <CardTitle className="text-base font-semibold text-foreground">
          Migration Plan - How to Fix
        </CardTitle>
        <Button variant="ghost" size="sm" mode="icon">
          <EllipsisVertical className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col p-6 gap-6">
        {/* Target info alert */}
        <div className="border border-dashed border-primary/40 bg-primary/[0.03] dark:bg-primary/[0.01] rounded-xl p-4.5 flex gap-3.5 items-start">
          <Info className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h5 className="text-sm font-semibold text-primary">
              {MOCK_MIGRATION_PLAN.target}
            </h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {MOCK_MIGRATION_PLAN.targetDesc}
            </p>
          </div>
        </div>

        {/* Timeline list */}
        <div className="flex flex-col gap-5 relative pl-4 border-l border-border/60 ml-2 mt-2">
          {MOCK_MIGRATION_PLAN.phases.map((phase) => (
            <div
              key={phase.id}
              className="relative flex flex-col gap-3 group pb-2"
            >
              {/* Circle icon marker */}
              <div className="absolute -start-[27px] top-0 bg-card rounded-full p-1 border border-border">
                <phase.icon className={`size-4.5 ${phase.iconColor}`} />
              </div>

              {/* Phase Header */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h4 className="text-sm font-semibold text-foreground">
                  {phase.title}
                </h4>
                <Badge variant={phase.badgeVariant} appearance="outline">
                  {phase.badge}
                </Badge>
              </div>

              {/* Phase Bullet Items */}
              <ul className="flex flex-col gap-2 pl-1.5 list-disc text-muted-foreground text-xs leading-relaxed">
                {phase.bullets.map((bullet, bulletIdx) => (
                  <li key={bulletIdx} className="pl-0.5">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-5 mt-4 grid grid-cols-3 gap-6">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground leading-tight">
              6 Weeks
            </span>
            <span className="text-2xs text-muted-foreground uppercase font-semibold mt-0.5 tracking-wider">
              Total Timeline
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground leading-tight">
              950 Repos
            </span>
            <span className="text-2xs text-muted-foreground uppercase font-semibold mt-0.5 tracking-wider">
              In Scope
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground leading-tight">
              1,670 CVEs
            </span>
            <span className="text-2xs text-muted-foreground uppercase font-semibold mt-0.5 tracking-wider">
              Resolved on Completion
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
