
import { Card, CardContent } from '@/components/ui/card';
import { TimelineItem } from '@/partials/activities/timeline-item';
import { History } from 'lucide-react';
import { formatDateTime } from '@/lib/helpers';

import {
  Plus,
  Minus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Flag
} from 'lucide-react';

function TimelineCard({ title, timelineData }) {


    const iconMap = {
        added: Plus,
        removed: Minus,
        changed: RefreshCw,
        exposure_created: AlertCircle,
        exposure_resolved: CheckCircle,
        exposure_reported: Flag,
    };

    return(
            <TimelineItem icon={iconMap[timelineData?.change_type]} line={true}>
              <Card className="shadow-none">
                <CardContent className="lg:py-4">
                    <div className='flex flex-col gap-0.5'>
                        <div className='flex justify-between items-center'>
                            <p className='font-medium'>
                                {timelineData?.title || ""}
                            </p>
                            <p className='text-xs text-secondary-foreground'>
                                {/* 12-04-2024 10:30 AM */}
                                {formatDateTime(timelineData?.createdAt)}
                            </p>
                        </div>
                       
                        <p className='flex items-center gap-2 text-sm font-normal text-muted-foreground'>
                            {timelineData?.description || ''}
                        </p>
                    </div>

                    {timelineData?.title.includes('Found for first time') && (
                        <div className='mt-4 bg-accent p-4 rounded-md flex flex-col gap-2'>
                            <div className='flex items-center justify-between gap-2'>
                                <p className='font-medium'>
                                    Scanner :
                                </p>
                                <p className='flex items-center gap-2 text-sm font-normal text-muted-foreground'>
                                    {timelineData?.tool_used || "N/A"}
                                </p>
                            </div>
                        </div>
                    )}

                </CardContent>
              </Card>
            </TimelineItem>
    )
}

export default TimelineCard;