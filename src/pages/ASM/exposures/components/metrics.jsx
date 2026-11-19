import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomTooltip } from '../../../../components/custom/tooltip';
import useStore from '../store';

const Metrics = ({ metrics, isLoading }) => {
  const setFilters = useStore((state) => state.setFilters);

  const stats = [
    {
      label: 'Subdomains',
      number: metrics?.subdomain || 0,
      state: 'subdomain',
    },
    {
      label: 'Certificates',
      number: metrics?.certificate || 0,
      state: 'certificate',
    },
    { label: 'IP Addresses', number: metrics?.ip || 0, state: 'ip' },
    { label: 'DNS Records', number: metrics?.dns || 0, state: 'dns' },
    { label: 'Ports', number: metrics?.port || 0, state: 'port' },
    // { label: "APIs", number: metrics?.api || 0 },
    {
      label: 'Web servers',
      number: metrics?.web_server || 0,
      state: 'web_server',
    },
    {
      label: 'Technologies',
      number: metrics?.technology || 0,
      state: 'technology',
    },

    {
      label: 'Apis',
      number: metrics?.api || 0,
      state: 'api',
    },
  ];

  const renderItems = (item, index) => {
    return (
      <React.Fragment key={index}>
        <CustomTooltip text={'Click to Apply Filter'}>
          <div
            className="grid grid-cols-1 cursor-pointer group place-content-center flex-1 gap-1 text-center"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                ['associatedAsset.type']: item.state,
              }))
            }
          >
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
    return <Skeleton className="w-full h-[90px]" />;
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

export default Metrics;
