import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const defaultStats = [
    { label: 'Workflows', key: 'noOfWorkflows' },
    { label: 'Total Runs', key: 'totalRuns' },
    { label: 'Models Connected', key: 'modelsConnected' },
    { label: 'Tokens Used', key: 'totalTokensUsed' },
];

const DashboardMetrics = ({ data, isLoading, stats = defaultStats }) => {
    if (isLoading) {
        return (
            <Card>
                <CardContent>
                    <div className="flex lg:px-10 py-1.5 gap-2">
                        {stats.map((_, i) => (
                            <React.Fragment key={i}>
                                <div className="grid grid-cols-1 place-content-center justify-items-center flex-1 gap-1 text-center">
                                    <Skeleton className="h-6 w-8 my-0.5" />
                                    <Skeleton className="h-3.5 w-16 my-0.5" />
                                </div>
                                <span className="not-last:border-e border-e-input my-1" />
                            </React.Fragment>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <div className="flex lg:px-10 py-1.5 gap-2">
                    {stats.map((stat, index) => (
                        <React.Fragment key={index}>
                            <div className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center group">
                                <span className="text-mono text-2xl lg:text-2xl group-hover:text-muted-foreground leading-none font-semibold">
                                    {data?.[stat.key] ?? 0}
                                </span>
                                <span className="text-secondary-foreground text-sm group-hover:text-muted-foreground">
                                    {stat.label}
                                </span>
                            </div>
                            <span className="not-last:border-e border-e-input my-1" />
                        </React.Fragment>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default DashboardMetrics;
