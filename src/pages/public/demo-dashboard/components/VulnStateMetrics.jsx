import { Fragment } from 'react';
import { RiCloseCircleFill, RiCloseCircleLine } from '@remixicon/react';
import {
  Ban,
  CircleCheckBig,
  CircleX,
  ClockFading,
  Eye,
  Layers,
  Repeat,
  ScanSearch,
} from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';

const VulnStateMetrics = ({ data }) => {
  const items = [
    {
      logo: <ScanSearch className="text-blue-500" />,
      info: data?.totalVulns,
      desc: 'Total Vulns',
      path: '',
      extra: 'Open-' + data?.openVulns
    },
    {
      logo: <Eye className="text-blue-500" />,
      info: data?.inReview,
      desc: 'In Review',
      path: '',
    },
    {
      logo: <CircleCheckBig className="text-blue-500" />,
      info: data?.resolved +  data?.fixedInStaging,
      desc: 'Resolved',
      path: '',
    },
    {
      logo: <ClockFading className="text-blue-500" />,
      info: data?.inProgress,
      desc: 'In Progress',
      path: '',
    },
    {
      logo: <CircleX className="text-blue-500" />,
      info: data?.unResolved,
      desc: 'Unresolved',
      path: '',
    },
    {
      logo: <Repeat className="text-blue-500" />,
      info: data?.retest,
      desc: 'Retest',
      path: '',
    },
    {
      logo: <Layers className="text-blue-500" />,
      info: data?.duplicate,
      desc: 'Duplicate',
      path: '',
    },
    {
      logo: <Ban className="text-blue-500" />,
      info: data?.notApplicable +  data?.falsePositive,
      desc: 'Rejected',
      path: '',
    },
  ];

  const renderItem = (item, index) => {
    return (
      <Card key={index}>
        <CardContent className="p-0 flex flex-col justify-between h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg">
          <div className="px-4 py-4">{item.logo}</div>
          <div className="flex flex-col gap-1 pb-4 px-4">
            <span className="text-sm font-normal text-muted-forehead">
              {item.desc}
            </span>
            <span className="text-3xl font-semibold text-mono">
              {item.info}
            </span>

            <span className="text-[12px] font-normal text-secondary-foreground leading-5.5">
              {item.extra}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

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
