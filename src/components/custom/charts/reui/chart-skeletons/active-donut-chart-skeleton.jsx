import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ActiveDonutChartSkeleton = ({
  height = 300,
  showLegend = true,
  noCard = false,
  className = '',
  title,
  description,
}) => {
  const Wrapper = noCard ? 'div' : Card;
  const BodyWrapper = noCard ? 'div' : CardContent;

  const numHeight = typeof height === 'number' ? height : parseInt(height, 10) || 300;
  const chartSize = Math.max(120, numHeight - (showLegend ? 80 : 40));

  return (
    <Wrapper className={cn('w-full flex flex-col', className)}>
      {!noCard && (title || description) ? (
        <CardHeader className="items-center pb-0 shrink-0">
          {title ? (
            <p className="text-base leading-none tracking-tight font-normal text-sm text-gray-500">
              {title}
            </p>
          ) : (
            <Skeleton className="h-4 w-32 mb-2" />
          )}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : (
            description === undefined && <Skeleton className="h-3 w-48" />
          )}
        </CardHeader>
      ) : !noCard ? (
        <CardHeader className="items-center pb-0 shrink-0">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-48" />
        </CardHeader>
      ) : null}
      <BodyWrapper
        className={cn(
          'flex-1 min-h-0 flex flex-col justify-center items-center overflow-hidden',
          !noCard ? 'pb-4' : '',
        )}
      >
        <div className="flex flex-col items-center justify-center w-full" style={{ height }}>
          <div
            className="relative flex items-center justify-center animate-pulse"
            style={{
              height: chartSize,
              width: chartSize,
              maxWidth: '100%',
              aspectRatio: '1/1',
            }}
          >
            <div className="absolute inset-0 rounded-full border-[20px] border-accent" />
            <div className="z-10 flex flex-col items-center gap-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
          {showLegend && (
            <div className="flex flex-wrap justify-center gap-4 mt-4 w-full px-4">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-2.5 w-2.5 rounded-xs" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-2.5 w-2.5 rounded-xs" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-2.5 w-2.5 rounded-xs" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          )}
        </div>
      </BodyWrapper>
    </Wrapper>
  );
};

export default ActiveDonutChartSkeleton;
