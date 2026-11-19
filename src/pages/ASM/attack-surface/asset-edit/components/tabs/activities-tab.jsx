import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft, Clock, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import { useGetAimAssetDetailsTimelineQuery } from '@/services/asset-inventory/assets/assetsApi';

const eventIcons = {
    state_changed: <ArrowRightLeft className="h-4 w-4" />,
    default: <Clock className="h-4 w-4" />,
};

function formatTimestamp(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

function TimelineSkeleton() {
    return (
        <div className="relative space-y-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="relative flex gap-4 items-start">
                    {i !== 3 && (
                        <div className="absolute left-[19px] top-10 w-[2px] h-[calc(100%+8px)] bg-border" />
                    )}
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    <div className="flex flex-col gap-2 pt-0.5 w-full">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ActivitiesTab({ asset }) {
    const { data: timelineData, isLoading } = useGetAimAssetDetailsTimelineQuery(asset?._id);

    const timeline = timelineData?.timeline || [];

    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <TimelineSkeleton />
                    ) : timeline.length === 0 ? (
                        <EmptyScreen
                            title="No Timeline Events"
                            subTitle="There are no timeline events recorded for this asset yet."
                        />
                    ) : (
                        <div className="relative space-y-8">
                            {timeline.map((event, index) => (
                                <div key={event._id} className="relative flex gap-4 items-start group">
                                    {index !== timeline.length - 1 && (
                                        <div className="absolute left-[19px] top-10 w-[2px] h-[calc(100%+8px)] bg-border" />
                                    )}

                                    <div className="relative z-10 flex items-center justify-center h-10 w-10 shrink-0 rounded-full bg-muted border border-border">
                                        {eventIcons[event.event] || eventIcons.default}
                                    </div>

                                    <div className="flex flex-col pt-0.5">
                                        <p className="text-sm font-normal text-foreground">
                                            {event.message}
                                        </p>
                                        <span className="text-xs text-muted-foreground mt-1">
                                            {formatTimestamp(event.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
