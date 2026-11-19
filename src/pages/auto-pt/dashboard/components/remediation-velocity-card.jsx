import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';

const DEFAULT_TREND = [
  { name: 'Oct 08', discovered: 16, remediated: 20 },
  { name: 'Oct 14', discovered: 22, remediated: 26 },
  { name: 'Oct 20', discovered: 18, remediated: 24 },
  { name: 'Oct 26', discovered: 14, remediated: 28 },
  { name: 'Nov 01', discovered: 19, remediated: 32 },
  { name: 'Nov 07', discovered: 11, remediated: 25 },
];

export default function RemediationVelocityCard({
  data = [],
  isLoading = false,
}) {
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    return DEFAULT_TREND;
  }, [data]);

  const keys = [
    { key: 'remediated', label: 'Remediated' },
    { key: 'discovered', label: 'Discovered' },
  ];

  const colors = [
    '#10B981', // Emerald - Remediated
    '#E11D48', // Red - Discovered
  ];

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-normal text-sm text-gray-500">
          Remediation Velocity vs. Net Discovery
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="Remediation Velocity"
            popoverContent={
              <p className="text-muted-foreground text-xs leading-relaxed">
                Tracks whether the engineering and security teams are resolving vulnerabilities faster than new ones are discovered. Remediated curves above discovered indicate a healthy burn-down.
              </p>
            }
          />
        </CardTitle>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-foreground">Remediated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-500" />
            <span className="font-medium text-foreground">Discovered</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-3">
        <ReAreaChart
          data={chartData}
          xKey="name"
          keys={keys}
          colors={colors}
          stacked={false}
          height={260}
          isLoading={isLoading}
          noCard={true}
        />
      </CardContent>
    </Card>
  );
}

