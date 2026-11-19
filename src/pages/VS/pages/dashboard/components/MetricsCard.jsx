import { Fragment } from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const MetricsCard = ({ title, info, logo, logoDark, path, icon, isLoading }) => {

  if (isLoading) {
    return (
      <Card className="min-h-[160px] h-full">
        <CardContent className="p-0 flex flex-col justify-between gap-6 h-full">
          <div className="mt-4 ms-5">
            <Skeleton className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-2 pb-4 px-5">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  let card = (
    <Card className="min-h-[160px] h-full">
      <CardContent className="p-0 flex flex-col justify-between gap-6 h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg">
        {logoDark ? (
          <>
            {
              icon ||
              <img
                src={toAbsoluteUrl(`/media/brand-logos/${logo}`)}
                className="dark:hidden w-7 mt-4 ms-5"
                alt="image"
              />
            }

            {
              icon ||
              <img
                src={icon || toAbsoluteUrl(`/media/brand-logos/${logoDark}`)}
                className="light:hidden w-7 mt-4 ms-5"
                alt="image"
              />
            }
          </>
        ) : (
          <>
            {
              icon ||
              <img
                src={icon || toAbsoluteUrl(`/media/brand-logos/${logo}`)}
                className="w-7 mt-4 ms-5"
                alt="image"
              />
            }
          </>
        )}
        <div className="flex flex-col gap-1 pb-4 px-5">
          <span className="text-3xl font-semibold text-mono">
            {info}
          </span>
          <span className="text-sm font-normal text-muted-forehead">
            {title}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Fragment>
      <style>
        {`
            .channel-stats-bg {
                background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3.png')}');
            }
            .dark .channel-stats-bg {
                background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3-dark.png')}');
            }
            `}
      </style>

      {card}
    </Fragment>
  );
};

export default MetricsCard;