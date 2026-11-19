import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DonutChart from '@/components/custom/charts/reui/donut-chart'
import { Skeleton } from '@/components/ui/skeleton'
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
const SigningAuthorityDistributionPiechart = ({ statsData, statsLoading }) => {
  const authorityData = useMemo(() => {
    const distribution = statsData?.signing_authority_distribution || {};

    return Object.entries(distribution)
      .map(([name, value]) => ({
        name,
        value: value || 0,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [statsData]);

  const isEmpty = authorityData.length === 0;

  return (
    <Card className="flex-1 min-w-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
          Certificate Authority Distribution
          <DetailedHoverPopover
              buttonText={
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                  <CircleAlert className="h-4 w-4" />
                </Button>
              }
              showBadge={false}
              popoverTitle="About this Graph"
              popoverContent={
                <p className="text-muted-foreground">This graph breaks down the certificates by their issuing Certificate Authority.</p>
              }
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[280px] flex items-center justify-center">
        {isEmpty && !statsLoading ? (
          <div className="flex flex-col justify-center items-center h-full text-muted-foreground text-sm">
            <p>No data available</p>
          </div>
        ) : (
          <DonutChart
            data={authorityData}
            isLoading={statsLoading}
            showLegend={true}
            height={260}
            centerLabel="Total"
            className="border-none shadow-none p-0"
            noCard={true}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default SigningAuthorityDistributionPiechart