import MetricsCard from "../components/metrics-card";
import VoilationBySeverity from "../components/voilations-by-severity-graph";
import VoilationBreakDownTable from "../components/voilation-breakdown";
import PageHeading from "@/components/custom/page-heading";
import SlaComplianceOverview from "../components/voilation-overview";
import VoilationByDepartment from "../components/violations-by-department-graph";
import ViolationsByBusinessUnit from "../components/violations-by-business-unit";
import {
  useGetVmSLADashboardQuery,
  useRefreshVmSLAMutation,
  useGetVmSLAReportMutation,
} from "@/services/vm/slaApi";
import SLASkeleton from "../components/sla-skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonWithConfirm } from "@/components/custom/button-with-confirmation";
import { FileUp, RefreshCcw, RefreshCw, Settings } from "lucide-react";
import { Helmet } from "react-helmet";
import { EmptyScreen } from "@/components/common/empty-screen";
import ApiErrorHandler from "../../../../../components/common/api-error-handler";
import {useNavigate} from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  const { data: slaData, refetch, isLoading, isFetching, isError, error } = useGetVmSLADashboardQuery();
  const [refreshSLA, { isLoading: isRefreshing }] = useRefreshVmSLAMutation();
  const [getSLAReport, { isLoading: isExporting }] = useGetVmSLAReportMutation();

  const showSkeleton = isLoading || isFetching || isRefreshing;

  const hasData = slaData?.data?.totalVulns > 0;

  const handleRefresh = async () => {
    try {
      await refreshSLA().unwrap();
      toast.success("SLA refreshed successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to refresh SLA:", error);
      toast.error("Failed to refresh SLA. Please try again.");
    }
  };

  const handleExport = async () => {
    try {
      // .unwrap() gets the result of response.blob()
      const blob = await getSLAReport().unwrap();

      // Check if it's already a Blob (prevents corruption from double-wrapping)
      const finalBlob = blob instanceof Blob
        ? blob
        : new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Validate size - if it's 0 or very small, the server might be sending an error string
      if (finalBlob.size < 100) {
        console.warn("The downloaded file is unusually small. Check server for error messages.");
      }

      const url = window.URL.createObjectURL(finalBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SLA_Report_${new Date().toISOString().split('T')[0]}.xlsx`;

      document.body.appendChild(link);
      link.click();

      // Clean up to prevent memory leaks in 2025 browsers
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export report. Check console for details.");
    }
  };

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <>
      <Helmet>
        <title>UniRisk | SLA Dashboard</title>
      </Helmet>
      {(!showSkeleton && !hasData) ? null : (
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <PageHeading
              title="SLA Dashboard"
              description="Track critical vulnerabilities and ensure compliance with remediation timelines."
            />
          </div>

          <div className="flex flex-row gap-2">
            <ButtonWithConfirm
              confirm={true}
              variant="outline"
              confirmTitle="Refresh SLA Data"
              dialog="This will refresh the SLA data. Proceed?"
              confirmVariant="info"
              onConfirm={() => {
                if (!isRefreshing) handleRefresh();
              }}
              disabled={isRefreshing}
              className="flex items-center gap-2"
              confirmButton={
                <Button variant="primary" disabled={isRefreshing}>
                  Proceed
                </Button>
              }
              cancelButton={<Button variant="outline">Cancel</Button>}
            >
              {isRefreshing ? (
                <>
                  <RefreshCcw className="animate-spin" /> Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw /> Refresh Data
                </>
              )}
            </ButtonWithConfirm>
            <ButtonWithConfirm
              confirm={true}
              variant="outline"
              confirmTitle="Export SLA Report"
              dialog="This will generate and download an Excel report based on the current SLA dashboard data. Proceed?"
              confirmVariant="info"
              onConfirm={() => {
                if (!isExporting) handleExport();
              }}
              disabled={isExporting}
              className="flex items-center gap-2"
              confirmButton={
                <Button variant="primary" disabled={isExporting}>
                  Proceed
                </Button>
              }
              cancelButton={<Button variant="outline">Cancel</Button>}
            >
              {isExporting ? (
                <>
                  <FileUp className="animate-pulse" /> Exporting...
                </>
              ) : (
                <>
                  <FileUp /> Export Report
                </>
              )}
            </ButtonWithConfirm>
          </div>
        </div>
      )}

      {!showSkeleton && !hasData ? (
        <EmptyScreen
          title="SLA Dashboard Empty"
          subTitle="There is no SLA activity to report at this time. Metrics will automatically populate as data becomes available."
          engage={
            <Button
              onClick={() => navigate('/vm/sla?tab=Settings')}
              className="flex items-center gap-2"
            >
              <Settings />
              Setup SLA
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-6 mt-2">
          <div>
            <MetricsCard metrics={slaData?.data} isLoading={showSkeleton} />
          </div>

          <div className="grid lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {/* Sla compilance overview */}
            <SlaComplianceOverview
              data={slaData?.data?.overview}
              isLoading={showSkeleton}
            />

            {/* Violations By Severity */}
            <VoilationBySeverity
              data={slaData?.data?.violationsBySeverity}
              isLoading={showSkeleton}
            />

            {/* Violations By Department */}
            <VoilationByDepartment
              data={slaData?.data?.violationsByDepartment}
              isLoading={showSkeleton}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-5 lg:gap-6 mb-4">
            <div className="lg:col-span-1">
              {/* Violations by Business Unit */}
              <ViolationsByBusinessUnit
                data={slaData?.data?.violationsByBusinessUnit || []}
                isLoading={showSkeleton}
              />
            </div>

            <div className="lg:col-span-2">
              <VoilationBreakDownTable
                data={slaData?.data?.violationsByDepartment || []}
                isLoading={showSkeleton}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
