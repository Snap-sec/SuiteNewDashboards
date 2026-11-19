import React from 'react';
import { Play, Settings, Sparkles, CheckCircle2, Clock, Zap, ArrowLeft, Loader2, Plus, Trash2, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/custom/status-badge';
import { DateFormatter } from '@/components/custom/date-formatter';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useRunAgentMutation, useDeleteAgentMutation } from '@/services/automation/agentsApi';

export function AgentHeaderCardSkeleton() {
  return (
    <div className="flex flex-col gap-5 w-full bg-card border border-border p-6 rounded-xl shadow-xs animate-pulse">
      <div className="flex items-start justify-between flex-wrap gap-4 w-full">
        <div className="flex flex-col gap-2.5 max-w-3/4 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton className="h-7 w-64 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
      <div className="flex flex-row gap-6 mt-2 overflow-x-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3 min-w-28"
          >
            <Skeleton className="h-7 w-12 rounded-md" />
            <Skeleton className="h-3.5 w-16 mt-2 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AgentHeaderCard({
  agent,
  isLoading,
  onRun,
  onOpenEditModal,
  onOpenAddSkillsModal,
}) {
  const navigate = useNavigate();
  const [deleteAgent, { isLoading: isDeleting }] = useDeleteAgentMutation();

  console.log(agent)

  if (isLoading) {
    return <AgentHeaderCardSkeleton />;
  }

  const handleDelete = () => {
    const agentId = agent?._id || agent?.id;
    if (!agentId) return;

    toast.promise(
      deleteAgent(agentId)
        .unwrap()
        .then(() => {
          navigate('/ai-agent-builder/agents');
        }),
      {
        loading: 'Deleting agent...',
        success: 'Agent Deleted Successfully',
        error: (err) => {
          console.log(err);
          return err?.data?.message || err?.message || 'Failed to delete the Agent';
        },
      }
    );
  };


  const totalRuns = agent?.stats?.totalRuns ?? agent?.runsCount ?? 0;
  const rawTokens = agent?.stats?.totalTokensUsed ?? agent?.tokensUsed;
  const formattedTokens =
    rawTokens != null
      ? typeof rawTokens === 'number'
        ? rawTokens >= 1_000_000
          ? `${(rawTokens / 1_000_000).toFixed(2)}M`
          : rawTokens >= 1_000
            ? `${(rawTokens / 1_000).toFixed(1)}K`
            : rawTokens.toLocaleString()
        : rawTokens
      : '0';

  const totalTimeRun = agent?.stats?.totalTimeRun || '-';

  return (
    <div className="flex flex-col gap-5 w-full bg-card border border-border p-6 rounded-xl shadow-xs">
      {/* Top Title & Actions Row */}
      <div className="flex items-start justify-between flex-wrap gap-4 w-full">
        <div className="flex flex-col gap-1.5 max-w-3/4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg font-medium text-foreground leading-tight">
              {agent?.name || 'Untitled Agent'}
            </h1>
            <StatusBadge status={agent?.status || 'idle'} size="sm" />
            {/* {agent?.model && (
              <Badge variant="secondary" appearance="outline" size="sm" className="text-xs">
                {agent.model}
              </Badge>
            )} */}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground mt-1">
            {agent?.description || 'No description provided'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* 
          {onOpenAddSkillsModal && (
            <Button
              variant="outline"
              onClick={onOpenAddSkillsModal}
              className="gap-1.5"
            >
              <Plus className="size-3.5" />
              Add Skills
            </Button>
          )} */}
          {/* <Button
            variant="outline"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Play className="size-3.5" />
            )}
            {isRunning ? 'Running...' : 'Run Agent'}
          </Button> */}
          {onOpenEditModal && !agent?.agent_type && (
            <Button
              variant="outline"
              onClick={onOpenEditModal}
              className="gap-1.5"
            >
              Edit
            </Button>
          )}

          {
            !agent?.agent_type &&
            (
              <AuthorityGuard forbidRoles={['Auditor']}>
                <ButtonWithConfirm
                  disabled={isDeleting}
                  variant="outline"
                  confirm={true}
                  dialog="This action requires confirmation, click Delete to proceed."
                  confirmOnInput={agent?.name || 'Untitled Agent'}
                  onConfirm={() => {
                    if (isDeleting) return;
                    handleDelete();
                  }}
                  confirmButton={
                    <Button variant="destructive" disabled={isDeleting}>
                      Delete
                    </Button>
                  }
                  cancelButton={<Button variant="outline">Cancel</Button>}
                  className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                >
                  <Trash2 className="size-3.5" />
                </ButtonWithConfirm>
              </AuthorityGuard>
            )
          }

        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="flex flex-row gap-4 mt-2 overflow-x-auto pb-1">
        <div className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3 min-w-28">
          <span className="text-lg text-foreground font-medium">
            {totalRuns.toLocaleString()}
          </span>
          <span className="text-2xs uppercase tracking-wider mt-1 text-muted-foreground">
            Total Runs
          </span>
        </div>

        <div className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3 min-w-28">
          <span className="text-lg text-foreground font-medium">
            {formattedTokens}
          </span>
          <span className="text-2xs uppercase tracking-wider mt-1 text-muted-foreground">
            Tokens Used
          </span>
        </div>

        <div className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3 min-w-28">
          <span className="text-lg text-foreground font-medium">
            {totalTimeRun}
          </span>
          <span className="text-2xs uppercase tracking-wider mt-1 text-muted-foreground">
            Total Time Run
          </span>
        </div>

        <div className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3 min-w-32">
          <span className="text-lg text-foreground font-medium">
            {agent?.updatedAt ? <DateFormatter date={agent.updatedAt} /> : '-'}
          </span>
          <span className="text-2xs uppercase tracking-wider mt-1 text-muted-foreground">
            Last Active
          </span>
        </div>
      </div>
    </div>
  );
}
