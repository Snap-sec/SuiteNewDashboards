import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function TrueRiskStats({ data, isLoading }) {
    const progress = data?.progress ?? 52;
    const total = data?.total_vulns ?? data?.total ?? 1120040;
    const processed = data?.total_processed ?? data?.processed ?? 50000;
    const state = data?.status || data?.state || 'in_progress'; // fallback

    if (isLoading) {
        return <Skeleton className="w-full h-[90px] mb-6" />;
    }

    const isComplete = state === 'complete' || progress === 100;
    
    if (isComplete) {
        return null;
    }

    const isFailed = state === 'failed';
    const colorClass = isFailed ? 'text-destructive' : (isComplete ? 'text-green-500' : 'text-orange-500');
    const bgColorClass = isFailed ? 'bg-destructive' : (isComplete ? 'bg-green-500' : 'bg-orange-500');

    return (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm mb-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">True Risk Sync Progress</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline-block">
                        ({processed.toLocaleString()} / {total.toLocaleString()} processed)
                    </span>
                </div>

                <div className='flex items-center gap-2'>
                    <span
                        className={cn(
                            'text-lg font-bold',
                            colorClass
                        )}
                    >
                        {progress}%
                    </span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="relative w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            'h-full transition-all duration-500',
                            bgColorClass
                        )}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                </div>

                <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    <span>0%</span>
                    <span className={colorClass}>
                        {state.replace('_', ' ').toUpperCase()}
                    </span>
                    <span>100%</span>
                </div>
            </div>
        </div>
    );
}
