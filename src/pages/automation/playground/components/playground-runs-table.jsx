import React, { useMemo, useState, useEffect, useRef } from 'react';
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
  Clock,
  Zap,
  Copy,
  Download,
  ChevronDown,
  Search,
  X,
  Check,
  Terminal,
  Loader2,
  RefreshCw,
  Bot,
  Play,
  Pause,
  Square,
} from 'lucide-react';
import {
  useGetPlaygroundRunsQuery,
  useGetPlaygroundRunDetailsQuery,
  useGetPlaygroundSessionQuery,
  usePausePlaygroundRunMutation,
  useResumePlaygroundRunMutation,
  useCancelPlaygroundRunMutation,
} from '@/services/automation/playgroundApi';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import PlaygroundArtifacts from './playground-artifacts';
import { NoSearchResultsFound } from '../../../../components/common/no-search-found';

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
      : log?.text ||
      log?.message ||
      log?.log ||
      log?.content ||
      (typeof log === 'object' ? JSON.stringify(log) : String(log || ''));

  const match = text.match(/^\[([A-Z0-9_\s]+)\]\s*(.*)$/i);
  let tag = match
    ? match[1].trim().toUpperCase()
    : (log?.type || log?.level || 'INFO').toUpperCase();
  let cleanText = match ? match[2] : text;

  tag = tag.replace(/_/g, ' ');

  let tagClass = 'text-primary';

  if (tag.includes('INIT') || tag === 'ENV') {
    tagClass = 'text-sky-600 dark:text-sky-400';
  } else if (tag.includes('THOUGHT')) {
    tagClass = 'text-indigo-600 dark:text-indigo-400';
  } else if (tag.includes('TOOL')) {
    tagClass = 'text-amber-600 dark:text-amber-400';
  } else if (
    tag.includes('OBSERVATION') ||
    tag.includes('ERROR') ||
    tag.includes('WARN') ||
    cleanText.includes('Severity: HIGH')
  ) {
    tagClass = 'text-red-600 dark:text-red-400';
  } else if (tag.includes('SUCCESS') || tag.includes('COMPLETE')) {
    tagClass = 'text-emerald-600 dark:text-emerald-400';
  } else if (tag === 'MODEL' || tag === 'AGENT') {
    tagClass = 'text-purple-600 dark:text-purple-400';
  }

  return {
    tag,
    cleanText,
    tagClass,
  };
}

function renderHighlightedText(text) {
  if (!text) return null;

  const severityMatch = text.match(
    /Severity:\s*(HIGH|CRITICAL|MEDIUM|LOW)(\s*\(CVSS\s*[\d.]+\))?/i
  );
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

function PlaygroundRunAccordionItem({
  run,
  isOpen,
  copiedId,
  onCopyLogs,
  onDownloadJson,
  onPauseRun,
  onResumeRun,
  onCancelRun,
  actionLoadingRunId,
}) {
  const runId = run?.runId || run?._id;
  const displayId = run?.name || (runId?.startsWith('run_') ? `Playground-${runId.slice(-4).toUpperCase()}` : runId || 'Playground');
  const isCopied = copiedId === run._id;

  const statusLower = (run.status || '').toLowerCase().trim();
  const isRunning = ['pending', 'running', 'in progress'].includes(statusLower);
  const isPaused = statusLower === 'paused';
  const canControl = isRunning || isPaused;
  const isActionLoading = actionLoadingRunId === runId;

  // Lazy-load run details (logs, thinking, artifacts) on demand when expanded
  const { data: detailsResponse, isLoading: isLoadingDetails } =
    useGetPlaygroundRunDetailsQuery(runId, {
      skip: !isOpen || !runId,
      pollingInterval: isRunning ? 2000 : 0,
    });

  const runPayload = detailsResponse?.data?.data || detailsResponse?.data;
  const fullRun = runPayload?._id || runPayload?.runId ? runPayload : run;
  const artifacts = fullRun?.artifacts || run?.artifacts || [];
  const logs = fullRun?.logs || run?.logs || [];

  const agentName =
    fullRun.agentId?.name ||
    run.agentId?.name ||
    fullRun.agentName ||
    run.agentName ||
    fullRun.model ||
    run.model;

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

              {agentName && (
                <Badge
                  variant="secondary"
                  className="text-[11px] font-normal gap-1 py-0.5 px-2 bg-muted/50 text-foreground"
                >
                  <Bot className="size-3 text-primary shrink-0" />
                  <span className="truncate max-w-[140px]">{agentName}</span>
                </Badge>
              )}

              <StatusBadge status={run.status || 'completed'} />

              {artifacts.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {artifacts.length} {artifacts.length === 1 ? 'artifact' : 'artifacts'}
                </span>
              )}
            </div>
          </div>

          {/* Right Metrics & Actions */}
          <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-center text-xs shrink-0 flex-wrap sm:flex-nowrap">
            {(isRunning || isPaused) && (
              <div
                className="flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                {isPaused ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isActionLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      onResumeRun(runId);
                    }}
                  >
                    {isActionLoading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Play className="size-3.5" />
                    )}
                    <span>Resume</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isActionLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPauseRun(runId);
                    }}
                  >
                    {isActionLoading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Pause className="size-3.5" />
                    )}
                    <span>Pause</span>
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isActionLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelRun(runId);
                  }}
                >
                  <Square className="size-3.5" />
                  <span>Cancel</span>
                </Button>
              </div>
            )}

            <div className="flex flex-col items-start sm:items-end">
              <span className="text-xs text-muted-foreground">Duration</span>
              <span className="text-xs font-medium text-foreground flex items-center gap-1">
                <Clock className="size-3 text-muted-foreground" />
                {formatDuration(run)}
              </span>
            </div>

            {/* <div className="flex flex-col items-start sm:items-end">
              <span className="text-xs text-muted-foreground">Token Count</span>
              <span className="text-xs font-medium text-foreground flex items-center gap-1">
                <Zap className="size-3 text-muted-foreground" />
                {Number(run.totalTokens ?? run.tokens ?? 0).toLocaleString()} tk
              </span>
            </div> */}

            <div className="flex flex-col items-start sm:items-end">
              <span className="text-xs text-muted-foreground">Started</span>
              <span className="text-xs text-muted-foreground">
                <DateFormatter date={run.startedAt || run.createdAt} />
              </span>
            </div>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-5 pb-5 pt-0 min-w-0 w-full max-w-full overflow-hidden space-y-4">
        {/* Run Artifacts */}
        {artifacts.length > 0 && (
          <PlaygroundArtifacts
            artifacts={artifacts}
            runId={runId}
            title="Generated Artifacts"
            description="Artifacts produced by this run."
          />
        )}

        {/* Terminal Execution Trace */}
        <div className="dark:bg-[#0b0e14] rounded-xl border border-muted shadow-xl overflow-hidden font-mono text-xs min-w-0 w-full max-w-full">
          <div className="flex items-center justify-between px-4 py-2.5 dark:bg-zinc-900/80 border-b border-zinc-800 text-xs">
            <div className="flex items-center gap-2.5">
              <Terminal className="size-4 text-primary" />
              <span className="font-sans font-semibold text-xs">
                Execution Trace Logs
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
                className="h-7 text-xs hover:text-white hover:bg-zinc-800 gap-1.5 px-2.5 font-sans"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyLogs(fullRun);
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
                className="h-7 text-xs hover:text-white hover:bg-zinc-800 gap-1.5 px-2.5 font-sans"
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

          <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto overflow-x-hidden select-text min-w-0 w-full custom-scrollbar">
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
                    className="rounded-lg p-1 transition-colors leading-relaxed shadow-2xs min-w-0 w-full"
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
                        className="dark:text-white text-black text-xs flex-1 min-w-0 break-all"
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

export default function PlaygroundRunsTable() {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [activeRunId, setActiveRunId] = useState(null);
  const [actionLoadingRunId, setActionLoadingRunId] = useState(null);

  const [pauseRun] = usePausePlaygroundRunMutation();
  const [resumeRun] = useResumePlaygroundRunMutation();
  const [cancelRun] = useCancelPlaygroundRunMutation();

  // Check session status to trigger polling when playground is running
  const { data: sessionData } = useGetPlaygroundSessionQuery(undefined, {
    pollingInterval: 3000,
  });
  const session = sessionData?.data || sessionData?.session || sessionData;
  const isSessionRunning = session?.status === 'running';

  // Fetch paginated playground runs
  const {
    data: runsResponse,
    isLoading,
    isFetching,
    refetch,
    isError,
    error,
  } = useGetPlaygroundRunsQuery(undefined, {
    pollingInterval: isSessionRunning ? 3000 : 0,
  });

  const runsList = useMemo(() => {
    const raw =
      runsResponse?.data?.runs ||
      runsResponse?.data?.data?.runs ||
      runsResponse?.runs ||
      runsResponse?.data ||
      [];
    if (!Array.isArray(raw)) return [];
    return raw
      .map((item, idx) => ({
        _id: item._id || item.runId || `pg-run-${idx}`,
        ...item,
      }))
      .sort((a, b) => {
        const timeA = new Date(a.startedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.startedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
  }, [runsResponse]);

  const hasInitializedRef = useRef(false);

  // Default active accordion item to first run on initial load only
  useEffect(() => {
    if (!hasInitializedRef.current && runsList.length > 0) {
      setActiveRunId(runsList[0]._id);
      hasInitializedRef.current = true;
    }
  }, [runsList]);

  const filteredRuns = useMemo(() => {
    if (!search.trim()) return runsList;
    const q = search.toLowerCase();
    return runsList.filter(
      (r) =>
        r.runId?.toLowerCase().includes(q) ||
        r.status?.toLowerCase().includes(q) ||
        r.name?.toLowerCase().includes(q) ||
        r.agentName?.toLowerCase().includes(q) ||
        r.agentId?.name?.toLowerCase().includes(q) ||
        r.model?.toLowerCase().includes(q)
    );
  }, [search, runsList]);

  const handleCopyRawLogs = (run) => {
    const logs = run?.logs || [];
    if (!logs.length) {
      toast.info('No logs available to copy');
      return;
    }
    const text = logs
      .map((l) => (typeof l === 'string' ? l : l.text || l.message || JSON.stringify(l)))
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

  const handlePauseRun = async (runId) => {
    if (!runId) return;
    setActionLoadingRunId(runId);
    try {
      await pauseRun(runId).unwrap();
      toast.success('Playground run paused successfully');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to pause run');
    } finally {
      setActionLoadingRunId(null);
    }
  };

  const handleResumeRun = async (runId) => {
    if (!runId) return;
    setActionLoadingRunId(runId);
    try {
      await resumeRun(runId).unwrap();
      toast.success('Playground run resumed successfully');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to resume run');
    } finally {
      setActionLoadingRunId(null);
    }
  };

  const handleCancelRun = async (runId) => {
    if (!runId) return;
    setActionLoadingRunId(runId);
    try {
      await cancelRun(runId).unwrap();
      toast.success('Playground run cancelled successfully');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to cancel run');
    } finally {
      setActionLoadingRunId(null);
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
            className="border border-border rounded-xl bg-card p-4 space-y-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex items-center gap-4">
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

  if (!isFetching && !isLoading && !isError && runsList.length === 0 && !search.trim()) {
    return (
      <EmptyScreen
        title="No runs found"
        subTitle="Trigger an agent in the playground to view execution runs and generated artifacts."
      />
    );
  }

  if (!isFetching && !isLoading && isError) {
    return <ApiErrorHandler error={error} />;
  }

  return (
    <div className="flex flex-col gap-4 min-w-0 w-full max-w-full">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Playground Runs
          </h3>
          <p className="text-xs text-muted-foreground">
            View execution history, trace logs, and generated artifacts for each run.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search runs by ID, agent, or status..."
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

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              refetch();
              toast.success('Runs refreshed');
            }}
            disabled={isFetching}
            className="h-9 text-xs gap-1.5 shrink-0"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {filteredRuns.length === 0 && search.trim() ? (
        <NoSearchResultsFound
          title="No search results found"
          subTitle="No playground runs matched your search criteria."
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
            <PlaygroundRunAccordionItem
              key={run._id}
              run={run}
              isOpen={activeRunId === run._id}
              copiedId={copiedId}
              onCopyLogs={handleCopyRawLogs}
              onDownloadJson={handleDownloadJson}
              onPauseRun={handlePauseRun}
              onResumeRun={handleResumeRun}
              onCancelRun={handleCancelRun}
              actionLoadingRunId={actionLoadingRunId}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
}
