import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const VulnChart = ({ timeline = [], period, setPeriod, isLoading }) => {

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [d, m, y] = dateStr.split('-');
    return new Date(`${y}-${m}-${d}`);
  };

  const sortedTimeline = Array.isArray(timeline)
    ? [...timeline].sort((a, b) => parseDate(a.date) - parseDate(b.date))
    : [];

  const chartData = sortedTimeline.map((item) => ({
    date: item.date,
    Vulnerabilities: item.count,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
          Vulnerabilities
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
                This chart displays the trend of vulnerabilities over time.
              </p>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-end items-stretch grow px-3 py-1">
       
          <ReAreaChart
            data={chartData}
            xKey="date"
            keys={[{ key: 'Vulnerabilities', label: 'Vulnerabilities' }]}
            colors={['var(--color-primary)']}
            height={250}
            isLoading={isLoading}
            stacked={false}
            xTickFormatter={(v) => String(v)}
            noCard={true}
          />
      </CardContent>
    </Card>
  );
};

export default VulnChart;
