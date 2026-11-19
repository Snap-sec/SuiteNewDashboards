import { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Profile } from '@/components/custom/profile';

const FindingsTimeline = ({ title, workload }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 max-h-[320px] kt-scrollable-y-auto">
          {workload && workload.length > 0 ? (
            workload.map((item, index) => (
              <div key={index} className="flex justify-between gap-4 w-full">
                <div className="w-[30%]">
                  <Profile
                    name={item?.owner?.name}
                    email={item?.owner?.email}
                    role={`${item?.total_resolved}/${item?.total} Resolved`}
                  />
                </div>
                <div className="w-[70%] text-end -mt-1">
                  <p className="text-sm font-normal text-muted-foreground">
                    {parseInt(item?.progress)}% completed
                  </p>
                  <Progress value={parseInt(item?.progress)} />
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center h-[165px] text-muted-foreground mt-[100px]">
              <p className="text-sm text-muted-foreground mt-8">
                No Workload Data Available
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { FindingsTimeline };
