import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CircleAlert, ShieldCheck } from 'lucide-react';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

export default function AssetCoverageCard({
  totalAssets = 1280,
  isLoading = false,
}) {
  const assets = [
    {
      name: 'Cloud Infrastructure',
      sub: 'AWS · Azure · GCP',
      count: 486,
      coverage: 98,
      highRisk: 3,
    },
    {
      name: 'Web Applications & APIs',
      sub: 'Production Microservices',
      count: 142,
      coverage: 94,
      highRisk: 8,
    },
    {
      name: 'Code Repositories',
      sub: 'GitHub & GitLab CI/CD',
      count: 84,
      coverage: 92,
      highRisk: 2,
    },
    {
      name: 'Network Perimeter Hosts',
      sub: 'DMZ, VPNs & External IPs',
      count: 568,
      coverage: 99,
      highRisk: 5,
    },
  ];

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-normal text-sm text-gray-500">
          Attack Surface & Asset Coverage
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="Asset Coverage"
            popoverContent={
              <p className="text-muted-foreground text-xs leading-relaxed">
                Percentage of discovered infrastructure, web services, source code, and network assets under continuous active security scanning and penetration testing.
              </p>
            }
          />
        </CardTitle>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="size-3.5" />
          <span>96.8% Audited</span>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-4 space-y-4">
        {assets.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-medium text-foreground">{item.name}</span>
                <span className="text-muted-foreground ml-1.5 text-[11px]">
                  ({item.sub})
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {item.highRisk > 0 && (
                  <span className="text-[11px] font-medium text-rose-500">
                    {item.highRisk} at risk
                  </span>
                )}
                <span className="font-semibold text-foreground">
                  {item.count}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Progress value={item.coverage} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground font-medium w-8 text-right">
                {item.coverage}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

