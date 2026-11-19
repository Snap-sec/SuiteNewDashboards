import { Fragment, useState } from 'react';
import { ActivitiesBloggingConference } from '@/partials/activities/blogging-conference';
import { TimelineItem } from '@/partials/activities/timeline-item';
import { Dot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import DrawerModal from '@/components/custom/drawer-modal';
import { Skeleton } from '../../../../../../../components/ui/skeleton';
import { useGetAsmAssetTimelineDataQuery } from '../../../../../../../services/asm/attackSurfaceApi';
import TimelineCard from './components/timeline-card';

function TimelineModel({ trigger, assetId, assetData }) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: timelineData, isLoading } = useGetAsmAssetTimelineDataQuery(
    assetId,
    {
      skip: !isOpen, // <--- this prevents calling API until open
    },
  );

  return (
    <DrawerModal
      direction="right"
      trigger={<div onClick={() => setIsOpen(true)}>{trigger}</div>}
      width="[30%]"
      title="Asset Timeline"
    >
      <div className="p-3 -mt-4">
        <div className="flex flex-col gap- mb-4">
          <p className="font-medium text-sm">{assetData?.domain || ''}</p>
          <p className="flex items-center text-xs font-normal text-muted-foreground">
            {assetData?.type || 'N/A'}
            <Dot />
            <spam>{assetData?.value || 'N/A'}</spam>
          </p>
        </div>

        <div className="h-[calc(90vh-100px)] kt-scrollable-x-auto">
          {isLoading &&
            [1, 2, 3, 4, 5].map(() => (
              <Card className="shadow-none mb-7">
                <CardContent className="">
                  <Skeleton className="w-full h-40 " />
                </CardContent>
              </Card>
            ))}

          {[...(timelineData?.data || [])].reverse().map((timeline) => (
            <TimelineCard key={timeline.id || Math.random()} timelineData={timeline} />
          ))}

        </div>
      </div>
    </DrawerModal>
  );
}

export default TimelineModel;
