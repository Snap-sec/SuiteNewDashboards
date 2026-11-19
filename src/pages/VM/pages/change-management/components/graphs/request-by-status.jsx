import { useMemo } from 'react';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '../../../../../../components/ui/button';

const STATUS_COLORS = {
  // secondary (gray / slate)
  Scheduled: '#94a3b8',
  New: '#94a3b8',
  'Not Configured': '#94a3b8',

  // warning (yellow / amber)
  Paused: '#eab308',

  // primary (blue)
  Running: '#1379f0',
  'Testing Ongoing': '#1379f0',
  Pending: '#1379f0',

  // success (green)
  Remediation: '#22c55e',
  Completed: '#22c55e',
  Closed: '#22c55e',
};

const formatStatus = (key = '') => {
  if (!key) return '';
  if (key.includes(' ')) {
    return key
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

const getStatusColor = (status = '') => {
  const trimmed = status.trim();
  if (STATUS_COLORS[trimmed]) return STATUS_COLORS[trimmed];

  const normalized = trimmed.toLowerCase().replace(/_/g, ' ');
  const match = Object.keys(STATUS_COLORS).find(
    (k) => k.toLowerCase() === normalized
  );
  return match ? STATUS_COLORS[match] : '#94a3b8';
};

const RequestByStatus = ({ data = {}, assetsLoading }) => {
  const { chartData, colorArray } = useMemo(() => {
    const rows = Object.entries(data).map(([k, v]) => ({
      status: formatStatus(k),
      count: v,
    }));
    const colors = rows.map((r) => getStatusColor(r.status));
    return { chartData: rows, colorArray: colors };
  }, [data]);

  return (
    <ReBarChart
      data={chartData}
      xKey="status"
      keys={[{ key: 'count', label: 'Count' }]}
      colors={colorArray}
      distributed={true}
      isLoading={assetsLoading}
      xTickFormatter={(v) => v}
      title="Requests By Status"
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
              This chart displays the number of change requests in each status.
            </p>
          }
        />
      }
    />
  );
};

export default RequestByStatus;
