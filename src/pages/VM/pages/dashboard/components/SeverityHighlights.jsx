import { DropdownMenu4 } from '@/partials/dropdown-menu/dropdown-menu-4';
import { ArrowDown, ArrowUp, EllipsisVertical, ShieldAlert, LucideShieldX, Info, HelpCircle, BatteryMedium, AlertTriangle, } from 'lucide-react';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OctagonAlert } from 'lucide-react';
import { CircleAlert } from 'lucide-react';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import SeverityLabel from '../../../../../components/custom/severity-label';

const SeverityHighlights = ({ data, limit, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-2 w-full rounded-xs" />
          <div className="flex items-center flex-wrap gap-4 mb-1">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <Skeleton className="size-2 rounded-full" />
                <Skeleton className="h-3.5 w-12" />
              </div>
            ))}
          </div>
          <div className="border-b border-input"></div>
          <div className="grid gap-3">
            {[...Array(limit || 5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

    const rows = [
      {
        icon: ShieldAlert,
        text: 'Critical',
        total: data?.severityBreakdown?.critical || 0,
        stats: 3.9,
        increase: true,
      },
      {
        icon: LucideShieldX,
        text: 'High',
        total: data?.severityBreakdown?.high || 0,
        stats: 0.7,
        increase: false,
      },
      {
        icon: AlertTriangle,
        text: 'Medium',
        total: data?.severityBreakdown?.medium || 0,
        stats: 8.2,
        increase: true,
      },
      {
        icon: Info,
        text: 'Low',
        total: data?.severityBreakdown?.low || 0,
        stats: 8.2,
        increase: true,
      },
      {
        icon: HelpCircle ,
        text: 'None',
        total: data?.severityBreakdown?.none || 0,
        stats: 8.2,
        increase: true,
      },
    ];

    const items = [
      { badgeColor: 'bg-[#E11D48]', label: 'Critical' },
      { badgeColor: 'bg-[#EA580C]', label: 'High' },
      { badgeColor: 'bg-[#F59E0B]', label: 'Medium' },
      { badgeColor: 'bg-[#3B82F6]', label: 'Low' },
      { badgeColor: 'bg-[#94A3B8]', label: 'None' },
    ];

    const renderRow = (row, index) => {
      return (
        <div
          key={index}
          className="flex items-center justify-between flex-wrap gap-2"
        >
          <div className="flex items-center gap-1.5">
            <SeverityLabel severity={row.text} size="sm" />
          </div>
          <div className="flex items-center text-sm font-medium text-foreground gap-6">
            <span className="lg:text-right">{row.total}</span>
            {/* <span className="flex items-center justify-end gap-1">
              {row.increase ? (
                <ArrowUp className="text-green-500 size-4" />
              ) : (
                <ArrowDown className="text-destructive size-4" />
              )}
              {row.stats}%
            </span> */}
          </div>
        </div>
      );
    };

    const renderItem = (item, index) => {
      return (
        <div key={index} className="flex items-center gap-1.5">
          <BadgeDot className={item.badgeColor} />
          <span className="text-sm font-normal text-foreground">
            {item.label}
          </span>
        </div>
      );
    };

    const totalVulns = data?.severityBreakdown?.total || 0;
    const hasNoData = !data || totalVulns === 0;

    // severity percentage breakdown
    const criticalPercent = totalVulns > 0 ? (((data?.severityBreakdown?.critical || 0) / totalVulns) * 100)?.toFixed(0) : 0;
    const highPercent = totalVulns > 0 ? (((data?.severityBreakdown?.high || 0) / totalVulns) * 100)?.toFixed(0) : 0;
    const mediumPercent = totalVulns > 0 ? (((data?.severityBreakdown?.medium || 0) / totalVulns) * 100)?.toFixed(0) : 0;
    const lowPercent = totalVulns > 0 ? (((data?.severityBreakdown?.low || 0) / totalVulns) * 100)?.toFixed(0) : 0;
    const nonePercent = totalVulns > 0 ? (((data?.severityBreakdown?.none || 0) / totalVulns) * 100)?.toFixed(0) : 0;

    return (
      <Card className="h-full flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
            Severity Breakdown
            <DetailedHoverPopover
              buttonText={
                <Button variant="ghost" size="sm">
                  <CircleAlert className="h-4 w-4" />
                </Button>
              }
              showBadge={false}
              popoverTitle="About this Panel"
              popoverContent={
                <p className="text-muted-foreground">
                  This panel highlights active vulnerabilities categorized by their severity levels, offering a clear percentage breakdown to gauge the environment's overall risk profile.
                </p>
              }
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4 flex-1 justify-center">
          {hasNoData ? (
            <div className="flex flex-col justify-center items-center text-muted-foreground text-sm my-auto py-12">
              <p>No data available</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-normal text-secondary-foreground">
                  Active Vulnerabilities
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl font-semibold text-mono">{totalVulns}</span>
                  {/* <Badge size="sm" variant="success" appearance="outline">
                    +2.7%
                  </Badge> */}
                </div>
              </div>
              <div className="flex items-center gap-1 mb-1.5 w-full">
                <div className="bg-[#E11D48] h-2 rounded-xs" style={{ width: `${criticalPercent}%` }}></div>
                <div className="bg-[#EA580C] h-2 rounded-xs" style={{ width: `${highPercent}%` }}></div>
                <div className="bg-[#F59E0B] h-2 rounded-xs" style={{ width: `${mediumPercent}%` }}></div>
                <div className="bg-[#3B82F6] h-2 rounded-xs" style={{ width: `${lowPercent}%` }}></div>
                <div className="bg-[#94A3B8] h-2 rounded-xs" style={{ width: `${nonePercent}%` }}></div>
              </div>
              <div className="flex items-center flex-wrap gap-4 mb-1">
                {items.map((item, index) => {
                  return renderItem(item, index);
                })}
              </div>
              <div className="border-b border-input"></div>
              <div className="grid gap-3">{rows.slice(0, limit).map(renderRow)}</div>
            </>
          )}
        </CardContent>
      </Card>
    );
};

export default SeverityHighlights;
