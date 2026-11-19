import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

export default function ScannerCadenceCard() {
  const scanners = [
    {
      name: 'Offensive Web Pentest Engine',
      cadence: 'Weekly & Event-Driven',
      lastRun: '18m ago',
      status: 'Active',
      statusDot: 'bg-emerald-500',
    },
    {
      name: 'Network & Port CVE Scanner',
      cadence: 'Daily at 00:00 UTC',
      lastRun: 'Running now',
      status: 'Scanning',
      statusDot: 'bg-blue-500 animate-pulse',
    },
    {
      name: 'Static Code Analyzer (SAST)',
      cadence: 'Continuous via CI/CD',
      lastRun: '4m ago',
      status: 'Active',
      statusDot: 'bg-emerald-500',
    },
    {
      name: 'Supply Chain SCA Package Auditor',
      cadence: 'Twice Daily',
      lastRun: '1h ago',
      status: 'Active',
      statusDot: 'bg-emerald-500',
    },
  ];

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-normal text-sm text-gray-500">
          Continuous Assessment Streams
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="Scanning Streams"
            popoverContent={
              <p className="text-muted-foreground text-xs leading-relaxed">
                Health and execution cadence of automated offensive testing, network port scanning, SAST code inspection, and third-party dependency scanning.
              </p>
            }
          />
        </CardTitle>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span>4 Engines Active</span>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-4 space-y-3.5">
        {scanners.map((s, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-none"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${s.statusDot}`} />
                <span className="font-medium text-foreground">{s.name}</span>
              </div>
              <p className="text-[11px] text-muted-foreground pl-4">
                Cadence: {s.cadence}
              </p>
            </div>
            <div className="text-right">
              <span className="font-medium text-foreground block">
                {s.status}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {s.lastRun}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

