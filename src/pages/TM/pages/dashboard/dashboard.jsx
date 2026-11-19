
import MetricsCard from "./components/matrics-cards";
import MetricsCard2 from "./components/matrics-card2";
import MetricsCard3 from "./components/matrics-card3";
import MetricsCard4 from "./components/matrics-card4";
import ProjectStatusDistribution from "./components/project-status-distribution-graph";
import { SeverityGraph } from "./components/severity-distribution";
import CWEDistributinGraph from "./components/cwe-distribution-graph";
import { useGetTmDashboardQuery } from "../../../../services/tm/dashboard";
import StatusDistribution from "./components/status-distribution";
import { Helmet } from 'react-helmet';

function Dashboard(){

    const { data: dashboardData, error, isLoading } = useGetTmDashboardQuery();

    return(
      <>
       <Helmet>
        <title>Threat Modeler | Dashboard </title>
       </Helmet>
      
      
        <div className="grid gap-5 lg:gap-7.5 p-4">
            <div className="grid lg:grid-cols-1 gap-y-5 lg:gap-7.5 items-stretch">
                <div className="lg:col-span-1 flex flex-col gap-4">
                  <MetricsCard isLoading={isLoading} metrics={dashboardData?.threatStats}/>
                  {/* <MetricsCard2 isLoading={isLoading} metrics={dashboardData?.threatStats?.state_distribution}/>
                  <MetricsCard3 isLoading={isLoading} metrics={dashboardData?.threatStats?.state_distribution}/>
                  <MetricsCard4 isLoading={isLoading} metrics={dashboardData?.threatStats?.state_distribution}/> */}
                </div>

                <div className="lg:col-span-2">
                    <ProjectStatusDistribution data={dashboardData?.projectStats?.projects} isLoading={isLoading}/>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
                <div>
                  <CWEDistributinGraph cweDistribution={dashboardData?.cwe_distribution} isLoading={isLoading}/>
                </div>

                <div>
                  <StatusDistribution data={dashboardData?.threatStats?.state_distribution} isLoading={isLoading}/>
                </div>

                <div>
                  <SeverityGraph title="Severity Distribution" asset={dashboardData?.threatStats?.severity_distribution} isLoading={isLoading}/>
                </div>
            </div>
        </div>
      </>
    )
}


export default Dashboard;