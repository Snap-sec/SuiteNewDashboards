import { DropdownMenu4 } from '@/partials/dropdown-menu/dropdown-menu-4';
import { ArrowDown, ArrowUp, EllipsisVertical, ShieldAlert, LucideShieldX } from 'lucide-react';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OctagonAlert } from 'lucide-react';
import { CircleAlert } from 'lucide-react';

const SeverityHighlights = ({ data, limit }) => {

    const rows = [
      {
        icon: ShieldAlert,
        text: 'Critical',
        total: data.critical,
        stats: 3.9,
        increase: true,
      },
      {
        icon: LucideShieldX,
        text: 'High',
        total: data.high,
        stats: 0.7,
        increase: false,
      },
      {
        icon: OctagonAlert,
        text: 'Medium',
        total: data.medium,
        stats: 8.2,
        increase: true,
      },
      {
        icon: CircleAlert,
        text: 'Low',
        total: data.low,
        stats: 8.2,
        increase: true,
      },
    ];

    const items = [
      { badgeColor: 'bg-destructive', label: 'Critical' },
      { badgeColor: 'bg-[#ff7366]/80', label: 'High' },
      { badgeColor: 'bg-orange-500', label: 'Medium' },
      { badgeColor: 'bg-primary', label: 'Low' },
    ];

    const renderRow = (row, index) => {
      return (
        <div
          key={index}
          className="flex items-center justify-between flex-wrap gap-2"
        >
          <div className="flex items-center gap-1.5">
            <row.icon className="size-4.5 text-muted-foreground" />
            <span className="text-sm font-normal text-mono">{row.text}</span>
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

    // severity percentage breakdown
    const criticalPercent = ((data?.critical / data?.totalVulns) * 100)?.toFixed(0);
    const highPercent = ((data?.high / data?.totalVulns) * 100)?.toFixed(0);
    const mediumPercent = ((data?.medium / data?.totalVulns) * 100)?.toFixed(0);
    const lowPercent = ((data?.low / data?.totalVulns) * 100)?.toFixed(0);


    console.log("percentags: ", criticalPercent);

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Severity Breakdown</CardTitle>
        
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-normal text-secondary-foreground">
              Total Vulnerabilities
            </span>
            <div className="flex items-center gap-2.5">
              <span className="text-3xl font-semibold text-mono">{data?.totalVulns}</span>
              {/* <Badge size="sm" variant="success" appearance="outline">
                +2.7%
              </Badge> */}
            </div>
          </div>
          <div className="flex items-center gap-1 mb-1.5 w-full">
            <div className="bg-destructive h-2 rounded-xs" style={{ width: `${criticalPercent}%` }}></div>
            <div className="bg-[#ff7366]/80 h-2 rounded-xs" style={{ width: `${highPercent}%` }}></div>
            <div className="bg-orange-500 h-2 rounded-xs" style={{ width: `${mediumPercent}%` }}></div>
            <div className="bg-primary h-2 rounded-xs" style={{ width: `${lowPercent}%` }}></div>
          </div>
          <div className="flex items-center flex-wrap gap-4 mb-1">
            {items.map((item, index) => {
              return renderItem(item, index);
            })}
          </div>
          <div className="border-b border-input"></div>
          <div className="grid gap-3">{rows.slice(0, limit).map(renderRow)}</div>
        </CardContent>
      </Card>
    );
};

export default SeverityHighlights;
