import { Skeleton } from "@/components/ui/skeleton";

// Import components
import BasicDetails from '../components/basic-details';
import VulnerabilityTrendGraph from '../components/vulnerability-trend-graph';
import SeverityDistributionGraph from '../components/severity-distribution-graph';
import TopVulnerabilities from '../components/top-vulnerabilities';
import OpenCloseSeverityDistributationPieChart from "../components/charts/severity-open-close-distributation-piechart";

export function DashboardTab({ data, loading = false, error }) {

    if (error) {
        return (
            <div className="text-center py-8 text-destructive">
                Failed to load scan details. Please try again.
            </div>
        );
    }

    if (!loading && !data) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No scan data available.
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className="col-span-2">
                <BasicDetails data={data} isLoading={loading} />
            </div>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                    <VulnerabilityTrendGraph data={data} isLoading={loading} />
                </div>

                <div className="col-span-4">
                    <OpenCloseSeverityDistributationPieChart data={data} isLoading={loading} />
                </div>

                <div className="col-span-4 h-full">
                    <SeverityDistributionGraph data={data} isLoading={loading} />
                </div>
            </div>

            <TopVulnerabilities data={data} isLoading={loading} />
        </div>
    );
}

