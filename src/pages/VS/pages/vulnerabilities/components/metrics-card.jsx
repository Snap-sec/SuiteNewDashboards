import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import useStore from '../store';
import { CustomTooltip } from '../../../../../components/custom/tooltip';



const MetricsCard = ({ metrics, isLoading }) => {
  const setFilters = useStore(state => state.setFilters);

  const stats = [
    { label: "Total Active", number: metrics?.totalVulns || 0 },
    { label: "Critical", number: metrics?.critical || 0 },
    { label: "High", number: metrics?.high || 0 },
    { label: "Medium", number: metrics?.medium || 0 },
    { label: "Low", number: metrics?.low || 0 },
    { label: "Info", number: metrics?.info || 0 },
    { label: "Supressed", number: metrics?.suppressedVulns || 0 },

  ];

  const renderItems = (item, index) => {
    const handleClick = () => {
      if (item.label.toLowerCase() === 'supressed') {
        setFilters(prev => {
          const { severity, ...rest } = prev;
          return { ...rest, suppressed: 'true' };
        });
      } else if (item.label.toLowerCase() === 'total') {
        setFilters(() => ({}));
      } else {
        setFilters(prev => {
          const { suppressed, ...rest } = prev;
          return { ...rest, severity: item.label.toLowerCase() };
        });
      }
    };

    return (
      <React.Fragment key={index}>
        <CustomTooltip text={"Click to Apply Filter"}>
          <div className=" cursor-pointer grid grid-cols-1 group place-content-center flex-1 gap-1 text-center" onClick={handleClick}>
            <span className="text-mono text-2xl group-hover:text-muted-foreground lg:text-2xl leading-none font-semibold">
              {item.number}
            </span>
            <span className="text-secondary-foreground group-hover:text-muted-foreground text-sm">
              {item.label}
            </span>
          </div>
        </CustomTooltip>
        <span className="not-last:border-e border-e-input my-1"></span>
      </React.Fragment>
    );
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[90px]" />
  }

  return (
    <Card>
      <CardContent>
        <div className="flex lg:px-10 py-1.5 gap-2">
          {stats.map((item, index) => {
            return renderItems(item, index);
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
