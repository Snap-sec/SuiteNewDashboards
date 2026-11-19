import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardHeading } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { calculateDuration, formatDateTime } from './utils';

export function RunSummaryCard({ runInfo }) {
  if (!runInfo) return null;

  const status = runInfo?.status || 'Completed';
  const isCompleted = status.toLowerCase() === 'completed';
  const badgeVariant = isCompleted ? 'success' : (status.toLowerCase() === 'failed' ? 'destructive' : 'secondary');

  const overallDuration = runInfo?.duration || calculateDuration(runInfo?.startedAt || runInfo?.createdAt, runInfo?.completedAt);

  return (
    <Card className="bg-card shadow-xs">
      <CardHeader>
        <div className="flex justify-between items-start w-full gap-4">
          <CardHeading>
            <CardTitle className="text-base font-medium">
              Workflow {runInfo?.workflowName || runInfo?.workflowId} - Org {runInfo?.orgId}
            </CardTitle>
          </CardHeading>
          <Badge variant={badgeVariant} appearance="outline" className="gap-1.5 capitalize rounded-full px-2.5 py-0.5 font-normal">
            {isCompleted && <CheckCircle2 size={14} className="opacity-70" />}
            {!isCompleted && status.toLowerCase() === 'failed' && <XCircle size={14} className="opacity-70" />}
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm mb-6 border-t border-border pt-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">Started</span>
            <span className="text-foreground font-medium">{formatDateTime(runInfo?.startedAt || runInfo?.createdAt)}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">Completed</span>
            <span className="text-foreground font-medium">{formatDateTime(runInfo?.completedAt)}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">Duration</span>
            <span className="text-foreground font-medium">{overallDuration}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">Tokens Used</span>
            <span className="text-foreground font-medium">{runInfo?.tokensUsed !== undefined ? runInfo.tokensUsed.toLocaleString() : '-'}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">Item Executions</span>
            <span className="text-foreground font-medium">{runInfo?.itemExecutionsCount ?? runInfo?.itemExecutions?.length ?? '-'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
