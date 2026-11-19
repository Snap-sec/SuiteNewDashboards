import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useGetVsStatsQuery } from '@/services/vs/vsApi';
import { Card } from '@/components/ui/card';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { ContentLoader } from '@/components/common/content-loader';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import PageHeading from '../../../../components/custom/page-heading';
import Analytics from './components/Analytics';
import VulnTable from './components/VulnTable';
import { Button } from '../../../../components/ui/button';
import { Scan } from 'lucide-react';
import { useNavigate } from 'react-router';

function Dashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('12m');
  const { data, isLoading, error, isError } = useGetVsStatsQuery({ period });

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  if (
    !isLoading &&
    !isError &&
    !data?.stats?.totalScans &&
    !data?.stats?.totalVulns &&
    !data?.stats?.totalAssets
  )
    return (
      <EmptyScreen
        title="No Dashboard Data"
        subTitle="When new data is found, it will show here."
        engage={<Button onClick={()=>navigate("/vs/scans")}><Scan /> Start a Scan</Button>}
      />
    );

  return (
    <div className="px-4 flex flex-col gap-1">
      <Helmet>
        <title>VS | Dashboard</title>
      </Helmet>

      <PageHeading
        title="Dashboard"
        description="Overview of vulnerabilities, scanning activity, assets, and security posture."
      />

      <Analytics
        stats={data?.stats}
        timeline={data?.timeline}
        vulnBreakdown={data?.vulnBreakdown}
        period={period}
        setPeriod={setPeriod}
        isLoading={isLoading}
      />

      <Card className=" mb-4 mt-2">
        <div className="px-4 py-2 font-normal text-sm text-gray-500">
          Top 10 Vulnerabilities
        </div>
        {!isLoading && !data?.topVulns?.length ? (
          <EmptyScreen
            darkImgUrl="/media/illustrations/19-dark.svg"
            lightImgUrl="/media/illustrations/19.svg"
            title="No Vulnerabilities Found"
            subTitle="When new vulnerabilities are found, they will show here."
          />
        ) : (
          <VulnTable data={data?.topVulns} isLoading={isLoading} />
        )}
      </Card>
    </div>
  );
}

export default Dashboard;
