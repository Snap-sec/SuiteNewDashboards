import { Fragment } from 'react';
import {
  Bug,
  ShieldAlert,
  ClockFading,
  LayoutDashboard,
} from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const VulnStateMetrics = ({ data, isLoading }) => {
  const items = [
    {
      logo: <Bug className="text-blue-500" />,
      info: data?.total_active ?? data?.total_vulns,
      desc: 'Total Vulnerabilities',
      path: '',
      // extra: `(${data?.openVulns})`
    },
    {
      logo: <LayoutDashboard className="text-blue-500" />,
      info: data?.total_applications,
      desc: 'Total Applications',
      path: '',
    },
    {
      logo: <ShieldAlert className="text-blue-500" />,
      info: data?.total_critical,
      desc: 'Total Critical',
      path: '',
    },
    {
      logo: <ClockFading className="text-blue-500" />,
      info: data?.applications_with_active_scans,
      desc: 'Application with active scans',
      path: '',
    },
  ];

  const renderItem = (item, index) => {
    return (
      <Card key={index} className="w-full">
        <CardContent className="p-0 flex flex-col justify-between h-full w-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg">
          <div className="px-4 py-4">{item.logo}</div>
          <div className="flex flex-col gap-1 pb-4 px-4">
            <span className="text-sm font-normal text-muted-foreground">
              {item.desc}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-3xl font-semibold text-mono">
                {item.info}
              </span>

              <span className="text-[12px] font-normal text-secondary-foreground leading-5.5">
                {item.extra}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Fragment>
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="w-full">
            <CardContent className="p-0 flex flex-col justify-between h-full w-full">
              <div className="px-4 py-4">
                <Skeleton className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-2 pb-4 px-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-9 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </Fragment>
    );
  }

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

      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </Fragment>
  );
};

export default VulnStateMetrics;
