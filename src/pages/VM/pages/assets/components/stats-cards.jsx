import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Cards from './card/card';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

const CardsSkeleton = ({ count = 4 }) => {
  return (
    <Card>
      <CardContent>
        <div className="flex lg:px-10 py-1.5 gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <React.Fragment key={index}>
              <div className="grid grid-cols-1 place-content-center flex-1 gap-2 text-center">
                {/* Number */}
                <Skeleton className="h-8 w-16 mx-auto rounded-md" />

                {/* Label */}
                <Skeleton className="h-4 w-20 mx-auto rounded-md" />
              </div>

              {/* Divider */}
              {index !== count - 1 && (
                <span className="border-e border-e-input my-1"></span>
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
const StatsCards = ({ statsData, statsLoading }) => {
  const cardItems = useMemo(
    () =>
      statsData
        ? [
            { number: String(statsData.total || 0), label: 'Total Assets' },
            // { number: String(statsData.tested || 0), label: 'Tested' },
            // { number: String(statsData.untested || 0), label: 'Untested' },
            {
              number: String(statsData?.vulnerable || 0),
              label: 'Vulnerable',
            },
            {
              number: String(statsData?.safe || 0),
              label: 'Safe Assets',
            },
            // {
            //   number: String(statsData.riskScore.totalScore || 0),
            //   label: 'Risk Score',
            // },
          ]
        : [],
    [statsData],
  );
  if (statsLoading) {
    return <CardsSkeleton />;
  }
  return <Cards items={cardItems} isLoading={statsLoading} />;
};

export default StatsCards;
