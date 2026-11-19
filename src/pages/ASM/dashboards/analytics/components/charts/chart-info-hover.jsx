import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const ChartInfoHover = ({ text }) => (
  <DetailedHoverPopover
    buttonText={
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
      >
        <CircleAlert className="h-4 w-4" />
      </Button>
    }
    showBadge={false}
    popoverTitle="About this Graph"
    popoverContent={<p className="text-muted-foreground">{text}</p>}
  />
);

export default ChartInfoHover;
