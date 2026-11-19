import { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';


const COLORS = [
  '#8B00FF', '#0000FF', '#FF4560', '#FF7F00', '#FFCF00',
  '#00E396', '#4B0082', '#FFC0CB', '#800080', '#008080',
  '#00FFFF', '#FF00FF', '#00FF7F', '#808000', '#A52A2A',
];

const BusinessUnitsPieChart = ({ data, loading }) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((unit) => ({
      name: unit.businessUnitName || 'Unknown Unit',
      value: unit.totalChangeRequests || 0,
    }));
  }, [data]);

  return (
    <DonutChart
      data={chartData}
      isLoading={loading}
      colors={COLORS}
      title="Change Requests by Business Unit"
      centerLabel="Total"
      showLegend={true}
      height={300}
      className="h-full"
      titleBadge={
        <DetailedHoverPopover
          buttonText={
            <Button variant="ghost" size="sm">
              <CircleAlert className="h-4 w-4" />
            </Button>
          }
          showBadge={false}
          popoverTitle="About this Graph"
          popoverContent={
            <p className="text-muted-foreground">
              This chart displays the distribution of change requests across
              different business units. It helps identify the business units
              with the most change requests.
            </p>
          }
        />
      }
    />
  );
};

export default BusinessUnitsPieChart;