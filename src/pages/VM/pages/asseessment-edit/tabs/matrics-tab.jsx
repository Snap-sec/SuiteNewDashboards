import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import { BasicDetails } from '../components/basic-details';
import { VulnerabilityTrendGraph } from '../components/severity-distribution-graph';
import SeverityOpenCloseDistribution from '../components/severity-distribution-graph2';
import { SeverityGraph } from '../components/severity-graph';
import { TopFindings } from '../components/top-findings';
import { Upgrade } from '../components/upgrade';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

export function MatricsTab({ loading, assessmentData, data, isError, error }) {
  

  // if (!data?.data?.top5?.length) return <EmptyScreen
  //   title= "No Assessment Metrics"
  //   subTitle= "There are no vulnerabilities, add some to get insights"
  //   />

  if (!isError && !loading && !assessmentData && !data)
    return (
      <EmptyScreen
        title="Assessment not found"
        subTitle="There is no assessment to display"
        darkImgUrl="/media/illustrations/30-dark.svg"
        lightImgUrl="/media/illustrations/30.svg"
      />
    );

  if(isError) return <ApiErrorHandler error={error}/>

  return (
    <div className="flex flex-col gap-4">
      {/* <div>
       <h2 className='text-sm+ font-semibold'>Metrics</h2>
       <p>This tab contains basic details of the assessment.</p>
      </div> */}

      {/* <div className="col-span-2">
          <Upgrade />
      </div> */}
      {/* <div className="col-span-2">
        <BasicDetails data={data?.data} assessmentData={assessmentData} loading={loading} />
      </div> */}

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <VulnerabilityTrendGraph
            asset={data?.data?.vulnerabilityTrend}
            loading={loading}
          />
        </div>

        <div className="col-span-4">
          <SeverityOpenCloseDistribution Data={data?.data} loading={loading} />
        </div>

        <div className="col-span-4 h-full">
          <SeverityGraph
            title="Severity Distribution"
            asset={data?.data?.severityDistribution}
            loading={loading}
          />
        </div>
      </div>

      <TopFindings data={data?.data?.top5} loading={loading} />
    </div>
  );
}
