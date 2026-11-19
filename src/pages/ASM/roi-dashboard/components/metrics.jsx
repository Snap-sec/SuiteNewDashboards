import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';



const Metrics = ({ metrics, isLoading }) => {
  const assetsReduced = metrics?.assets_reduced ?? 0;
  const reductionPercentage = metrics?.reduction_percentage ?? 0;
    const stats = [
        {
          label:
            assetsReduced >= 0
              ? "Total Assets Reduced"
              : "Total Assets Increased",
          number: `${assetsReduced < 0 ? "+ " : ""}${Math.abs(assetsReduced)}`,
        },
        {
          label:
            reductionPercentage >= 0
              ? "Reduction Percentage"
              : "Increase Percentage",
          number: `${reductionPercentage < 0 ? "+ " : ""}${Math.abs(reductionPercentage.toFixed(2))}%`,
        },
        { label: "Active Risks", number: metrics?.active_risks || 0 },
        { label: "Asset in Monitoring", number: metrics?.total_assets || 0 },
    ];

    const renderItems = (item, index) => {
      return (
        <React.Fragment key={index}>
          <div className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center">
            <span className="text-mono text-2xl lg:text-2xl leading-none font-semibold">
              {item.number}
            </span>
            <span className="text-secondary-foreground text-sm">
              {item.label}
            </span>
          </div>
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

export default Metrics;
