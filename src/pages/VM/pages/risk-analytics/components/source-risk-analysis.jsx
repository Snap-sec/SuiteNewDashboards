import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function SourceRiskAnalysis({ data, isLoading }) {
    if (isLoading) {
        return <Skeleton className="h-[240px] w-full" />;
    }

    const sourceData = data?.sourceRiskDistribution || [];

    return (
        <Card className="bg-card">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Source Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="w-full">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border/50">
                        <div className="w-2/5">Scanner Source</div>
                        <div className="w-2/5">Risk Level</div>
                        <div className="w-1/5 text-right">Total Vulns</div>
                    </div>
                    <div className="flex flex-col gap-4">
                        {sourceData.length > 0 ? sourceData.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="w-2/5 flex items-center gap-2">
                                    <span className="text-sm truncate" title={item.source}>{item.source}</span>
                                </div>
                                <div className="w-2/5 flex items-center gap-3">
                                    <span className="text-xs font-medium w-6">{item.riskScore || 0}</span>
                                    <Progress value={item.riskScore || 0} className="h-1.5 bg-secondary flex-1" />
                                </div>
                                <div className="w-1/5 text-right text-sm font-medium">
                                    {item.total?.toLocaleString() || 0}
                                </div>
                            </div>
                        )) : (
                            <div className="text-sm text-muted-foreground text-center py-2">No source data available.</div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
