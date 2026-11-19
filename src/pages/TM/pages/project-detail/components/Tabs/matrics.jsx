import { BasicDetails } from "../basic-details";
import { FindingsTimeline } from "../findings-timeline";
import { SeverityGraph } from "../severity-graph";
import { TopFindings } from "../top-findings";
import { ContentLoader } from '@/components/common/content-loader';
import { useGetProjectStatsQuery } from "@/services/tm/projectApi";
import ProjectStatusDistribution from "../severity-distribution-graph";


function MatricsTab(){

    const projectId = window.location.pathname?.split("/")?.at(-1);

    const { data, isLoading } = useGetProjectStatsQuery(projectId);

    if (isLoading) {
        return <ContentLoader className="w-full h-full" />
    }




    return(
        <div>
            <BasicDetails data={data} />

            <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-4">
                    <ProjectStatusDistribution title="Threats Timeline" data={data.metrics} />
                </div>
                <div className="col-span-4">
                    <FindingsTimeline title="Workload" workload={data?.workload} />
                </div>
                <div className="col-span-4">
                    <SeverityGraph title="Severity Distribution" metrics={data?.severity} />
                </div>
            </div>
        </div>
    )
}


export default MatricsTab;