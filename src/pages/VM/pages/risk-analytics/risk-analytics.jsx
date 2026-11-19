import React from 'react';
import { format, parseISO } from 'date-fns';
import { CircleAlert, RefreshCcw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import {
  useGetVmRiskScoreQuery,
  useGetVmStatsQuery,
  useRecomputeVmDashboardMutation,
} from '@/services/vm/dashboardApi';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import {
  ButtonWithConfirm,
  ConfirmDialog,
} from '@/components/custom/button-with-confirmation';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import PageHeading from '@/components/custom/page-heading';
import AverageOpenAge from './components/average-open-age';
import OrganizationRiskScore from './components/organization-risk-score';
import RiskDrivers from './components/risk-drivers';
import SlaComplianceOverview from './components/sla-compliance-overview';
import ThreatExposure from './components/threat-exposure';
import TopStatsRow from './components/top-stats-row';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { Button } from '../../../../components/ui/button';

function RiskAnalytics() {
  const {
    data: riskScoreData,
    isLoading: isRiskScoreLoading,
    refetch,
    isFetching,
    isError,
    error
  } = useGetVmRiskScoreQuery();
  const [recomputeDashboard, { isLoading: isRecomputing }] =
    useRecomputeVmDashboardMutation();
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const riskTrend = React.useMemo(() => {
    const trend = riskScoreData?.data?.riskTrend || riskScoreData?.data?.riskScoreTrend || [];
    if (!Array.isArray(trend)) return [];
    return trend.map((item) => ({
      ...item,
      date: item.date || item.month || '',
      riskScore: Number(item.riskScore ?? item.score ?? 0),
      score: Number(item.riskScore ?? item.score ?? 0),
    }));
  }, [riskScoreData]);

  const exposureTrend = React.useMemo(() => {
    const trend = riskScoreData?.data?.exposureTrend || [];
    if (!Array.isArray(trend)) return [];
    return trend.map((item) => ({
      ...item,
      date: item.date || item.month || '',
      exposureScore: Number(item.riskScore ?? item.exposureScore ?? item.score ?? 0),
      riskScore: Number(item.riskScore ?? item.exposureScore ?? item.score ?? 0),
      score: Number(item.riskScore ?? item.exposureScore ?? item.score ?? 0),
    }));
  }, [riskScoreData]);

  const handleRecompute = async () => {
    try {
      await recomputeDashboard().unwrap();
      refetch();
      toast.success('Dashboard recomputation started');
      setIsConfirmOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to recompute dashboard');
    }
  };

  if (isError && !isRiskScoreLoading && !isFetching) {
    return <ApiErrorHandler error={error} />;
  }

  const totalOpenVulnerabilities =
    riskScoreData?.data?.exposureSummary?.totalOpenVulnerabilities;

  const showEmptyState =
    !isRiskScoreLoading &&
    !isFetching &&
    riskScoreData?.data &&
    totalOpenVulnerabilities === 0;

  if (showEmptyState) {
    return (
      <EmptyScreen
        title="No Data Available"
        subTitle="There are currently no data available for risk analytics. Please take an action to get started."
        engage={
          <>
            <Button
              variant="primary"
              onClick={() => setIsConfirmOpen(true)}
              disabled={isRecomputing}
              className="text-sm cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCcw />
              Recompute
            </Button>
            <ConfirmDialog
              open={isConfirmOpen}
              setOpen={setIsConfirmOpen}
              onConfirm={handleRecompute}
              variant="warning"
              title="Recompute Dashboard?"
              dialog="This will trigger a full recomputation of all dashboard metrics. This may take a moment."
            />
          </>
        }
      />
    );
  }

  return (
    <div className="p-4 flex flex-col">
      <Helmet>
        <title>UniRisk | Risk Analytics</title>
      </Helmet>

      {isFetching || isRiskScoreLoading ? (
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <PageHeading
            title="Risk Analytics"
            description="Comprehensive overview of your organization's risk posture and exposure."
          />
          <button
            onClick={() => setIsConfirmOpen(true)}
            disabled={isRecomputing}
            className="text-sm cursor-pointer text-blue-500 underline decoration-dashed underline-offset-4 hover:text-blue-400 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Recompute
          </button>
          <ConfirmDialog
            open={isConfirmOpen}
            setOpen={setIsConfirmOpen}
            onConfirm={handleRecompute}
            variant="warning"
            title="Recompute Dashboard?"
            dialog="This will trigger a full recomputation of all dashboard metrics. This may take a moment."
          />
        </div>
      )}

      <TopStatsRow data={riskScoreData?.data} isLoading={isRiskScoreLoading || isFetching} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <OrganizationRiskScore
          data={riskScoreData?.data}
          isLoading={isRiskScoreLoading || isFetching}
        />
        <SlaComplianceOverview
          data={riskScoreData?.data}
          isLoading={isRiskScoreLoading || isFetching}
        />
        <ThreatExposure
          data={riskScoreData?.data}
          isLoading={isRiskScoreLoading || isFetching}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReAreaChart
            title="Org Risk Score Trend"
            titleBadge={
              <DetailedHoverPopover
                buttonText={
                  <CircleAlert className="h-4 w-4 text-muted-foreground" />
                }
                popoverTitle="Org Risk Score Trend"
                popoverContent={<p className="text-muted-foreground">Visual representation of the organization's risk score over time.</p>}
                showBadge={false}
              />
            }
            data={riskTrend}
            xKey="date"
            keys={[{ key: 'riskScore', label: 'Risk Score' }]}
            colors={['#F97316']}
            height={300}
            isLoading={isRiskScoreLoading || isFetching}
            xTickFormatter={(v) => v}
          />
          <ReAreaChart
            title="Exposure Score Trend"
            titleBadge={
              <DetailedHoverPopover
                buttonText={
                  <CircleAlert className="h-4 w-4 text-muted-foreground" />
                }
                popoverTitle="Exposure Score Trend"
                popoverContent={<p className="text-muted-foreground">Visual representation of the exposure score over time.</p>}
                showBadge={false}
              />
            }
            data={exposureTrend}
            xKey="date"
            keys={[{ key: 'exposureScore', label: 'Exposure Score' }]}
            colors={['#3b82f6']}
            height={300}
            isLoading={isRiskScoreLoading || isFetching}
            xTickFormatter={(v) => v}
          />
        </div>
        {/* <div className="lg:col-span-1">
                        <AverageOpenAge
                            data={riskScoreData?.data}
                            isLoading={isRiskScoreLoading}
                        />
                    </div> */}
      </div>

      <div className="mt-6">
        {/* Executive Insights and Remediation Opportunities */}
        <RiskDrivers
          data={riskScoreData?.data}
          isLoading={isRiskScoreLoading || isFetching}
        />
      </div>
    </div>
  );
}

export default RiskAnalytics;
