import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, CircleAlert } from 'lucide-react';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const FALLBACK_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Customer Portal & Checkout Web Pentest',
    vector: 'Pentesting',
    scope: 'checkout.enterprise.io',
    critical: 2,
    high: 4,
    slaStatus: 'At Risk',
    progress: 78,
    owner: 'Red Team',
  },
  {
    id: 'proj-2',
    name: 'Production AWS Cloud Enclaves',
    vector: 'Vuln Scan',
    scope: '3 VPCs · 412 Hosts',
    critical: 0,
    high: 3,
    slaStatus: 'On Track',
    progress: 92,
    owner: 'SecOps',
  },
  {
    id: 'proj-3',
    name: 'Auth & Identity Microservices Audit',
    vector: 'SAST Code',
    scope: 'auth-service, gateway-api',
    critical: 1,
    high: 2,
    slaStatus: 'On Track',
    progress: 64,
    owner: 'AppSec',
  },
  {
    id: 'proj-4',
    name: 'Core SDK Supply Chain Dependencies',
    vector: 'SCA Deps',
    scope: '98 npm & PyPI packages',
    critical: 0,
    high: 1,
    slaStatus: 'On Track',
    progress: 88,
    owner: 'Release Eng',
  },
];

export default function ActiveEngagementsCard({
  projects = [],
  isLoading = false,
}) {
  const displayProjects = projects.length > 0 ? projects : FALLBACK_PROJECTS;

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-normal text-sm text-gray-500">
          Active Security Engagements & Scope
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="Active Engagements"
            popoverContent={
              <p className="text-muted-foreground text-xs leading-relaxed">
                Ongoing penetration tests, automated vulnerability scans, and security reviews across platforms, teams, and domains.
              </p>
            }
          />
        </CardTitle>
        <Link
          to="/apt/pentests"
          className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
        >
          <span>View All Pentests</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="py-2.5 px-5 font-medium">Program & Scope</th>
              <th className="py-2.5 px-4 font-medium">Vector</th>
              <th className="py-2.5 px-4 font-medium text-center">Exposures</th>
              <th className="py-2.5 px-4 font-medium">SLA</th>
              <th className="py-2.5 px-4 font-medium">Progress</th>
              <th className="py-2.5 px-5 font-medium text-right">Team</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayProjects.map((proj) => (
              <tr key={proj.id} className="hover:bg-muted/40 transition-colors">
                <td className="py-3 px-5">
                  <span className="font-medium text-foreground block">
                    {proj.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground block truncate max-w-xs mt-0.5">
                    {proj.scope}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <span className="text-muted-foreground text-xs font-medium">
                    {proj.vector}
                  </span>
                </td>

                <td className="py-3 px-4 text-center">
                  <span
                    className={`font-medium ${
                      proj.critical > 0
                        ? 'text-rose-600 dark:text-rose-400 font-semibold'
                        : 'text-foreground'
                    }`}
                  >
                    {proj.critical > 0 ? `${proj.critical} Crit · ` : ''}
                    {proj.high} High
                  </span>
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`text-[11px] font-medium ${
                      proj.slaStatus === 'At Risk'
                        ? 'text-rose-500 font-semibold'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {proj.slaStatus}
                  </span>
                </td>

                <td className="py-3 px-4 min-w-[110px]">
                  <div className="flex items-center gap-2">
                    <Progress value={proj.progress} className="h-1.5 flex-1" />
                    <span className="text-[11px] text-muted-foreground w-7 text-right">
                      {proj.progress}%
                    </span>
                  </div>
                </td>

                <td className="py-3 px-5 text-right font-medium text-muted-foreground">
                  {proj.owner}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

