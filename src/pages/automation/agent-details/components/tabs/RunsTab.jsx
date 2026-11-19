import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/custom/status-badge';
import { DateFormatter } from '@/components/custom/date-formatter';
import { EmptyScreen } from '@/components/common/empty-screen';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
import {
  Clock,
  Zap,
  Copy,
  Download,
  ChevronDown,
  Search,
  X,
  Check,
  Terminal,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  StopCircle,
  Loader2,
} from 'lucide-react';
import {
  useGetAgentRunsQuery,
  useGetAgentRunDetailsQuery,
  usePauseAgentRunMutation,
  useResumeAgentRunMutation,
  useTerminateAgentRunMutation,
} from '@/services/automation/agentsApi';
import PlaygroundArtifacts from '@/pages/automation/playground/components/playground-artifacts';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function formatDuration(run) {
  if (run?.duration != null) {
    return typeof run.duration === 'number' ? `${run.duration}s` : run.duration;
  }
  if (run?.startedAt && run?.finishedAt) {
    const start = new Date(run.startedAt).getTime();
    const end = new Date(run.finishedAt).getTime();
    if (!isNaN(start) && !isNaN(end) && end >= start) {
      const diffSec = Math.round((end - start) / 1000);
      if (diffSec < 60) return `${diffSec}s`;
      const mins = Math.floor(diffSec / 60);
      const secs = diffSec % 60;
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }
  }
  return '-';
}


function parseLogItem(log) {
  const text =
    typeof log === 'string'
      ? log
      : typeof log?.text === 'string'
        ? log.text
        : typeof log?.message === 'string'
          ? log.message
          : '';
  const match = text.match(/^\[([A-Z0-9_\s]+)\]\s*(.*)$/i);
  let tag = match ? match[1].trim().toUpperCase() : (log?.level || 'INFO').toUpperCase();
  let cleanText = match ? match[2] : text;

  tag = tag.replace(/_/g, ' ');

  // let containerClass = 'bg-zinc-900/40 border-zinc-800/60';
  let tagClass = 'text-sky-400';

  if (tag.includes('INIT') || tag === 'ENV') {
    // containerClass = 'bg-sky-950/20 border-sky-900/40';
    tagClass = 'text-sky-400';
  } else if (tag.includes('THOUGHT')) {
    // containerClass = 'bg-indigo-950/25 border-indigo-900/40';
    tagClass = 'text-indigo-400';
  } else if (tag.includes('TOOL')) {
    // containerClass = 'bg-amber-950/20 border-amber-900/40';
    tagClass = 'text-amber-400';
  } else if (
    tag.includes('OBSERVATION') ||
    tag.includes('ERROR') ||
    tag.includes('WARN') ||
    cleanText.includes('Severity: HIGH')
  ) {
    // containerClass = 'bg-red-950/25 border-red-900/60';
    tagClass = 'text-red-400';
  } else if (tag.includes('SUCCESS') || tag.includes('COMPLETE')) {
    // containerClass = 'bg-emerald-950/25 border-emerald-900/60';
    tagClass = 'text-emerald-400';
  } else if (tag === 'MODEL' || tag === 'AGENT') {
    // containerClass = 'bg-purple-950/20 border-purple-900/40';
    tagClass = 'text-purple-400';
  }

  return {
    tag,
    cleanText,
    // containerClass,
    tagClass,
  };
}

function renderHighlightedText(text) {
  if (!text) return null;

  // Highlight severity badge if present
  const severityMatch = text.match(/Severity:\s*(HIGH|CRITICAL|MEDIUM|LOW)(\s*\(CVSS\s*[\d.]+\))?/i);
  if (severityMatch) {
    const parts = text.split(severityMatch[0]);
    return (
      <span>
        {parts[0]}
        <span className="bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded mx-1 select-none">
          {severityMatch[0]}
        </span>
        {parts[1]}
      </span>
    );
  }

  return text;
}

function RunActionsMenu({ run, agentId }) {
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [pauseRun, { isLoading: isPausing }] = usePauseAgentRunMutation();
  const [resumeRun, { isLoading: isResuming }] = useResumeAgentRunMutation();
  const [terminateRun, { isLoading: isTerminating }] = useTerminateAgentRunMutation();

  const status = run?.status?.toLowerCase() || '';
  const runId = run?.runId || run?._id;
  const displayId = run?.name || (runId?.startsWith('run_') ? `RUN-${runId.slice(-4).toUpperCase()}` : runId || 'RUN');

  const canPause = ['pending', 'running', 'in progress', 'crawling', 'scanning'].includes(status);
  const canResume = ['paused', 'pause'].includes(status);
  const canTerminate = !['completed', 'failed', 'cancelled', 'canceled'].includes(status);

  const handlePause = async (e) => {
    e?.stopPropagation?.();
    if (!runId) return;
    toast.promise(pauseRun({ agentId, runId }).unwrap(), {
      loading: `Pausing run #${displayId}...`,
      success: (res) => res?.message || `Run #${displayId} paused successfully`,
      error: (err) => err?.data?.message || err?.data?.error || 'Failed to pause run',
    });
  };

  const handleResume = async (e) => {
    e?.stopPropagation?.();
    if (!runId) return;
    toast.promise(resumeRun({ agentId, runId }).unwrap(), {
      loading: `Resuming run #${displayId}...`,
      success: (res) => res?.message || `Run #${displayId} resumed successfully`,
      error: (err) => err?.data?.message || err?.data?.error || 'Failed to resume run',
    });
  };

  const handleTerminateConfirm = async () => {
    if (!runId) return;
    try {
      await toast.promise(terminateRun({ agentId, runId }).unwrap(), {
        loading: `Terminating run #${displayId}...`,
        success: (res) => res?.message || `Run #${displayId} terminated`,
        error: (err) => err?.data?.message || err?.data?.error || 'Failed to terminate run',
      });
    } finally {
      setTerminateOpen(false);
    }
  };

  return (
    <>
      <div
        className="flex items-center shrink-0 ml-1"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44"
            onClick={(e) => e.stopPropagation()}
          >
            {canPause && (
              <DropdownMenuItem
                onClick={handlePause}
                disabled={isPausing}
                className="gap-2 cursor-pointer"
              >
                <PauseCircle className="size-4 text-amber-500" />
                <span>Pause</span>
              </DropdownMenuItem>
            )}

            {canResume && (
              <DropdownMenuItem
                onClick={handleResume}
                disabled={isResuming}
                className="gap-2 cursor-pointer"
              >
                <PlayCircle className="size-4 text-emerald-500" />
                <span>Resume</span>
              </DropdownMenuItem>
            )}

            {canTerminate && (
              <DropdownMenuItem
                onClick={() => setTerminateOpen(true)}
                disabled={isTerminating}
                className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <StopCircle className="size-4 text-destructive" />
                <span>Terminate</span>
              </DropdownMenuItem>
            )}

            {canTerminate && <DropdownMenuSeparator />}

            <DropdownMenuItem
              onClick={() => {
                const text = run.logs?.map((l) => l.text).join('\n') || '';
                if (!text) {
                  toast.info('No logs available');
                  return;
                }
                navigator.clipboard.writeText(text);
                toast.success('Raw logs copied');
              }}
              className="gap-2 cursor-pointer"
            >
              <Copy className="size-3.5 text-muted-foreground" />
              <span>Copy Raw Logs</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                try {
                  const dataStr =
                    'data:text/json;charset=utf-8,' +
                    encodeURIComponent(JSON.stringify(run, null, 2));
                  const anchor = document.createElement('a');
                  anchor.setAttribute('href', dataStr);
                  anchor.setAttribute('download', `${run.runId || 'run'}-trace.json`);
                  document.body.appendChild(anchor);
                  anchor.click();
                  anchor.remove();
                  toast.success('Trace JSON downloaded');
                } catch {
                  toast.error('Failed to download JSON');
                }
              }}
              className="gap-2 cursor-pointer"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span>Download JSON</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={terminateOpen}
        setOpen={setTerminateOpen}
        variant="destructive"
        title={`Terminate Run #${displayId}?`}
        dialog="This will immediately stop and abort the execution process. This action cannot be undone."
        onConfirm={handleTerminateConfirm}
      />
    </>
  );
}

function AgentRunAccordionItem({
  run,
  agentId,
  isOpen,
  copiedId,
  onCopyRawLogs,
  onDownloadJson,
}) {
  const displayId = run?.name || (run.runId?.startsWith('run_') ? `RUN-${run.runId.slice(-4).toUpperCase()}` : run.runId || 'RUN');
  const isCopied = copiedId === run._id;

  const isRunning = ['pending', 'running', 'in progress', 'crawling', 'scanning'].includes(
    run.status?.toLowerCase()
  );

  // Lazy-load details only when open
  const { data: detailsResponse, isLoading: isLoadingDetails } =
    useGetAgentRunDetailsQuery(
      { agentId, runId: run.runId },
      {
        skip: !isOpen || !agentId || !run.runId,
        pollingInterval: isRunning ? 2000 : 0,
      }
    );

  const runPayload = detailsResponse?.data?.data || detailsResponse?.data;
  const fullRun = runPayload?._id || runPayload?.runId ? runPayload : run;
  const artifacts = fullRun?.artifacts || run?.artifacts || [];
  const logs = fullRun?.logs || run?.logs || [];

  return (
    <AccordionItem
      value={run._id}
      className="border border-border rounded-xl bg-card overflow-hidden shadow-xs data-[state=open]:ring-1 data-[state=open]:ring-primary/20 transition-all min-w-0 w-full max-w-full"
    >
      <AccordionTrigger
        indicator="none"
        className="px-5 py-4 hover:no-underline group cursor-pointer min-w-0 w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full min-w-0 text-left">
          {/* Left Details */}
          <div className="flex items-center gap-3">
            <div className="size-6 rounded-full border border-border flex items-center justify-center shrink-0 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform bg-background/50">
              <ChevronDown className="size-3.5" />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-sm font-semibold text-foreground truncate max-w-[280px] sm:max-w-md">
                #{displayId}
              </span>

              <StatusBadge status={run.status || 'completed'} />

              {artifacts.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {artifacts.length} {artifacts.length === 1 ? 'artifact' : 'artifacts'}
                </span>
              )}
            </div>
          </div>

          {/* Right Metrics */}
          <div className="flex items-center gap-6 self-end sm:self-center text-xs shrink-0">
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-xs text-muted-foreground">Duration</span>
              <span className="text-xs font-medium text-foreground flex items-center gap-1">
                <Clock className="size-3 text-muted-foreground" />
                {formatDuration(run)}
              </span>
            </div>


            <div className="flex flex-col items-start sm:items-end">
              <span className="text-xs text-muted-foreground">Timestamp</span>
              <span className="text-xs text-muted-foreground">
                <DateFormatter date={run.startedAt || run.createdAt} />
              </span>
            </div>

            <RunActionsMenu run={run} agentId={agentId} />
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-5 pb-5 pt-0 min-w-0 w-full max-w-full overflow-hidden space-y-4">
        {/* Run Artifacts */}
        {artifacts.length > 0 && (
          <PlaygroundArtifacts
            artifacts={artifacts}
            runId={run.runId}
            agentId={agentId}
            title="Generated Artifacts"
            description="Artifacts produced by this run."
          />
        )}

        {/* Terminal Execution Trace */}
        <div className="bg-[#0b0e14] rounded-xl border border-zinc-800 shadow-xl overflow-hidden font-mono text-xs min-w-0 w-full max-w-full">
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800 text-xs">
            <div className="flex items-center gap-2.5">
              <Terminal className="size-4 text-primary" />
              <span className="font-sans font-semibold text-zinc-200 text-xs">
                Agent Execution Trace
              </span>
              {isRunning && (
                <span className="flex items-center gap-1 text-[11px] text-amber-400 font-sans">
                  <Loader2 className="size-3 animate-spin" />
                  Streaming live...
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 gap-1.5 px-2.5 font-sans"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyRawLogs(fullRun);
                }}
              >
                {isCopied ? (
                  <Check className="size-3 text-emerald-400" />
                ) : (
                  <Copy className="size-3" />
                )}
                <span>{isCopied ? 'Copied' : 'Copy Logs'}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 gap-1.5 px-2.5 font-sans"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadJson(fullRun);
                }}
              >
                <Download className="size-3" />
                <span>Download JSON</span>
              </Button>
            </div>
          </div>

          <div className="p-2.5 space-y-2.5 max-h-[500px] overflow-y-auto overflow-x-hidden select-text min-w-0 w-full custom-scrollbar">
            {isLoadingDetails && logs.length === 0 ? (
              <div className="py-8 flex items-center justify-center gap-2 text-zinc-400 font-mono text-xs">
                <Loader2 className="size-4 animate-spin text-primary" />
                <span>Loading execution trace logs...</span>
              </div>
            ) : logs.length > 0 ? (
              logs.map((_, idx) => {
                const logIndex = logs.length - 1 - idx;
                const log = logs[logIndex];
                const { tag, cleanText, tagClass } = parseLogItem(log);
                return (
                  <div
                    key={logIndex}
                    className={cn(
                      'rounded-lg p-1 transition-colors leading-relaxed shadow-2xs min-w-0 w-full'
                    )}
                  >
                    <div className="flex items-start gap-2.5 font-mono min-w-0 w-full">
                      <span
                        className={cn(
                          'text-xs font-bold uppercase shrink-0 pt-0.5',
                          tagClass
                        )}
                      >
                        {tag}
                      </span>
                      <div
                        className="text-zinc-200 text-xs flex-1 min-w-0 break-all"
                        style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
                      >
                        {renderHighlightedText(cleanText)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-zinc-500 text-xs">
                No execution trace logs recorded for this run.
              </div>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function RunsTab({ agentId: propAgentId }) {
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const agentId = propAgentId || routeId || searchParams.get('id');

  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [hasActiveRuns, setHasActiveRuns] = useState(false);
  const [activeRunId, setActiveRunId] = useState(null);

  const { data: runsResponse, isLoading, isError, error } = useGetAgentRunsQuery(agentId, {
    skip: !agentId,
    pollingInterval: hasActiveRuns ? 3000 : 0,
  });

  const runsList = useMemo(() => {
    const raw =
      runsResponse?.data?.data?.runs ||
      runsResponse?.data?.runs ||
      runsResponse?.data?.data ||
      runsResponse?.data ||
      runsResponse?.runs ||
      [];
    if (!Array.isArray(raw)) return [];
    return raw
      .map((item, idx) => ({
        _id: item._id || item.runId || `run-${idx}`,
        ...item,
      }))
      .sort((a, b) => {
        const timeA = new Date(a.startedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.startedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
  }, [runsResponse]);

  useEffect(() => {
    const active = runsList.some((r) =>
      ['pending', 'running', 'in progress', 'crawling', 'scanning', 'paused'].includes(
        r?.status?.toLowerCase()
      )
    );
    setHasActiveRuns(active);
  }, [runsList]);

  const filteredRuns = useMemo(() => {
    if (!search.trim()) return runsList;
    const q = search.toLowerCase();
    return runsList.filter(
      (r) =>
        r.runId?.toLowerCase().includes(q) ||
        r.status?.toLowerCase().includes(q) ||
        r.name?.toLowerCase().includes(q) ||
        (r.isPlayground && 'playground'.includes(q)) ||
        r.trigger?.toLowerCase().includes(q) ||
        r.logs?.some((l) => l.text?.toLowerCase().includes(q))
    );
  }, [search, runsList]);

  const handleCopyRawLogs = (run) => {
    if (!run?.logs?.length) {
      toast.info('No logs available to copy');
      return;
    }
    const text = run.logs
      .map((l) => l.text)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedId(run._id);
    toast.success('Raw logs copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadJson = (run) => {
    try {
      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(run, null, 2));
      const anchor = document.createElement('a');
      anchor.setAttribute('href', dataStr);
      anchor.setAttribute('download', `${run.runId || 'run'}-trace.json`);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      toast.success('Run trace JSON downloaded');
    } catch {
      toast.error('Failed to download JSON');
    }
  };

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-xl p-5 bg-card space-y-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex items-center gap-6">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (runsList.length === 0) {
    return (
      <EmptyScreen
        title="No runs found"
        subTitle="Trigger this agent to view execution trace logs."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 min-w-0 w-full max-w-full">
      {/* Header and Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Execution History
          </h3>
          <p className="text-xs text-muted-foreground">
            Chain-of-thought traces, execution logs, and trigger history.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search runs by ID, trigger, or logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9 pe-8 h-9 text-xs"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute end-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearch('')}
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      </div>

      {filteredRuns.length === 0 ? (
        <EmptyScreen
          title="No runs found"
          subTitle="No execution runs matched your search criteria."
        />
      ) : (
        <Accordion
          type="single"
          collapsible
          value={activeRunId}
          onValueChange={setActiveRunId}
          indicator="none"
          className="space-y-3 min-w-0 w-full max-w-full"
        >
          {filteredRuns.map((run) => (
            <AgentRunAccordionItem
              key={run._id}
              run={run}
              agentId={agentId}
              isOpen={activeRunId === run._id}
              copiedId={copiedId}
              onCopyRawLogs={handleCopyRawLogs}
              onDownloadJson={handleDownloadJson}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
}
