import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ActiveDonutChart from '@/components/custom/charts/reui/active-donut-chart';

function SeverityDistributionGraph({ data, isLoading }) {
    // Transform API data to chart format
    const charts = data?.charts || {};
    const severityData = charts.severity_distribution?.data || {};
    const title = charts.severity_distribution?.title || "Severity Distribution";

    // Define severity levels with their corresponding colors
    const severityConfig = [
        { name: 'Critical', value: severityData.critical || 0, color: '#ef4444' }, // Red
        { name: 'High', value: severityData.high || 0, color: '#f97316' },         // Orange
        { name: 'Medium', value: severityData.medium || 0, color: '#eab308' },     // Yellow
        { name: 'Low', value: severityData.low || 0, color: '#3b82f6' },           // Blue
        { name: 'Info', value: severityData.info || 0, color: '#6b7280' },         // Gray
    ];

    // Filter items with values and extract series/labels/colors in same order
    const filtered = severityConfig.filter(item => item.value > 0);
    const series = filtered.map(item => item.value);
    const labels = filtered.map(item => item.name);
    const colors = filtered.map(item => item.color);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center px-3">
                <ActiveDonutChart
                    series={series}
                    labels={labels}
                    colors={colors}
                    height={250}
                    showLegend={true}
                    noCard={true}
                    isLoading={isLoading}
                />
            </CardContent>
        </Card>
    );
}

export default SeverityDistributionGraph;

