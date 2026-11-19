import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ExposureSummary({ data, isLoading }) {
    if (isLoading) {
        return <Skeleton className="h-[340px] w-full" />;
    }

    const summary = data?.exposureSummary || {};
    const exposureData = [
        { name: 'Critical', value: summary.critical || 0, color: '#ef4444' }, // red-500
        { name: 'High', value: summary.high || 0, color: '#f97316' }, // orange-500
        { name: 'Medium', value: summary.medium || 0, color: '#eab308' }, // yellow-500
        { name: 'Other', value: (summary.low || 0) + (summary.informational || 0), color: '#94a3b8' }, // slate-400
    ].filter(item => item.value > 0);

    const total = summary.totalOpenVulnerabilities || 0;

    return (
        <Card className="bg-card">
            <CardHeader className="pb-0">
                <CardTitle className="text-base font-medium">Exposure Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-6">
                <div className="relative w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={exposureData.length > 0 ? exposureData : [{ value: 1, color: '#e2e8f0' }]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {(exposureData.length > 0 ? exposureData : [{ color: '#e2e8f0' }]).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Total</span>
                        <span className="text-2xl font-bold text-foreground">{total.toLocaleString()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-6 w-full px-4">
                    {exposureData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                                <span className="text-xs text-muted-foreground">{item.name}</span>
                            </div>
                            <span className="text-xs font-semibold">{item.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
