import { Loader2 } from 'lucide-react';
import { useGetVmRiskAcceptanceDashboardQuery } from '@/services/vm/riskAcceptanceApi';
import PageHeading from '@/components/custom/page-heading';
import { ContentLoader } from '../../../../../../../components/common/content-loader';
import DashboardStatsCards from '../../cards/dashboard-stats';
import EscalationsByBusinessUnitPieChart from '../../charts/dashboard/escalations-by-business-unit';
import EscalationsByDepartmentPieChart from '../../charts/dashboard/escalations-by-department';
import EscalationsBySeverityColumnChart from '../../charts/dashboard/escalations-by-severity';
import ApiErrorHandler from '../../../../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../../../../components/common/empty-screen';

function DashboardTab() {
  const { data, isLoading, isError, error } = useGetVmRiskAcceptanceDashboardQuery();

  if(isError) return <ApiErrorHandler error={error} />

  if(!isLoading && !data?.data?.statistics?.totalEscalation){
    return(
      <EmptyScreen
      title="No Risk Acceptance Data"
      subTitle="There are no risk acceptance requests currently." />
    )
  }
  

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeading
          title="Dashboard"
          description="Overview of escalations across business units, severity levels, and departments."
        />
      </div>

      {/* Stats cards  */}
      <div className="mb-6">
        <DashboardStatsCards
          isLoading={isLoading}
          data={data?.data?.statistics || {}}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-6 items-stretch mt-6">
        <EscalationsByBusinessUnitPieChart
          data={data?.data?.riskAcceptanceByBusinessUnit}
          isLoading={isLoading}
        />

        <EscalationsBySeverityColumnChart
          data={data?.data?.riskAcceptanceBySeverity}
          isLoading={isLoading}
        />

        <EscalationsByDepartmentPieChart
          data={data?.data?.riskAcceptanceByDepartment}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default DashboardTab;
