import React, { useEffect, useMemo, useState } from 'react';
import PlaygroundArtifacts from '@/pages/automation/playground/components/playground-artifacts';
import {
  Check,
  ChevronDown,
  Clock,
  Copy,
  Download,
  Loader2,
  Terminal,
} from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useGetAutomationSingleRunDetailsQuery } from '@/services/automation/agentsApi';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '@/components/common/empty-screen';
import { DateFormatter } from '@/components/custom/date-formatter';
import PageHeading from '@/components/custom/page-heading';
import { StatusBadge } from '@/components/custom/status-badge';

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
          : typeof log?.log === 'string'
            ? log.log
            : typeof log?.content === 'string'
              ? log.content
              : JSON.stringify(log || '');

  const match = text.match(/^\[([A-Z0-9_\s]+)\]\s*(.*)$/i);
  let tag = match
    ? match[1].trim().toUpperCase()
    : (log?.level || log?.type || 'INFO').toUpperCase();
  let cleanText = match ? match[2] : text;

  tag = tag.replace(/_/g, ' ');

  let tagClass = 'text-sky-600 dark:text-sky-400';

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
    /Severity:\s*(HIGH|CRITICAL|MEDIUM|LOW)(\s*\(CVSS\s*[\d.]+\))?/i,
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

export default function SingleRunDetailsPage() {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const runId = paramId || searchParams.get('runId') || 'mwd2eykqsuaf';

  const [copiedId, setCopiedId] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAutomationSingleRunDetailsQuery(
    { runId },
    {
      skip: !runId,
    },
  );

  const rawData = useMemo(() => {
    return (
      responseData?.data?.run ||
      responseData?.data?.data ||
      responseData?.data ||
      responseData?.run ||
      responseData ||
      null
    );
  }, [responseData]);

  const runsList = useMemo(() => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;
    if (Array.isArray(rawData.runs)) return rawData.runs;
    if (Array.isArray(rawData.subRuns)) return rawData.subRuns;
    if (Array.isArray(rawData.tasks)) return rawData.tasks;
    if (Array.isArray(rawData.steps)) return rawData.steps;
    return [rawData];
  }, [rawData]);

  // Set default active accordion item to the first item
  useEffect(() => {
    if (runsList.length > 0 && !activeAccordion) {
      const firstId =
        runsList[0]._id || runsList[0].runId || runsList[0].id || 'run-0';
      setActiveAccordion(firstId);
    }
  }, [runsList, activeAccordion]);

  const handleCopyRawLogs = (run) => {
    const logs = run?.logs || [];
    if (!logs.length) {
      toast.info('No logs available to copy');
      return;
    }
    const text = logs
      .map((l) =>
        typeof l === 'string'
          ? l
          : l.text || l.message || l.log || l.content || JSON.stringify(l),
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    const key = run._id || run.runId || run.id || 'run';
    setCopiedId(key);
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
      anchor.setAttribute(
        'download',
        `${run.name || run.runId || 'run'}-trace.json`,
      );
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      toast.success('Run trace JSON downloaded');
    } catch {
      toast.error('Failed to download JSON');
    }
  };

  if (isError) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <ApiErrorHandler error={error} onRetry={refetch} />
      </div>
    );
  }

  const primaryRun = runsList[0] || rawData;
  const pageTitle =
    primaryRun?.name ||
    primaryRun?.title ||
    primaryRun?.agentName ||
    (runId ? `Run #${runId}` : 'Single Run Details');

  const pageDescription =
    primaryRun?.description ||
    (primaryRun?.startedAt || primaryRun?.createdAt
      ? `Execution trace logs and details recorded on ${new Date(
          primaryRun.startedAt || primaryRun.createdAt,
        ).toLocaleString()}`
      : `Execution trace logs and terminal output for run #${runId}`);

  return (
    <div className="p-4 sm:p-6 mx-auto flex flex-col gap-5 w-full">
      <Helmet>
        <title>{pageTitle} | SnapSec</title>
      </Helmet>

      {/* Page Heading showing name as page title */}
      <PageHeading title={pageTitle} description={pageDescription} />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="border border-border rounded-xl p-5 bg-card space-y-3 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex items-center gap-6">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : runsList.length === 0 ? (
        <EmptyScreen
          title="No run logs found"
          subTitle="No logs were recorded for this execution run."
        />
      ) : (
        <Accordion
          type="single"
          collapsible
          value={activeAccordion}
          onValueChange={setActiveAccordion}
          indicator="none"
          className="space-y-3 min-w-0 w-full max-w-full"
        >
          {runsList.map((run, index) => {
            const itemId = run._id || run.runId || run.id || `run-${index}`;
            const displayId =
              run.name ||
              (run.runId?.startsWith('run_')
                ? `RUN-${run.runId.slice(-4).toUpperCase()}`
                : run.runId || `RUN-${index + 1}`);

            const isCopied = copiedId === itemId;
            const isRunning = [
              'pending',
              'running',
              'in progress',
              'crawling',
              'scanning',
            ].includes(run.status?.toLowerCase());

            const artifacts = run.artifacts || [];
            const logs = run.logs || [];

            return (
              <AccordionItem
                key={itemId}
                value={itemId}
                className="border border-border rounded-xl bg-card overflow-hidden shadow-xs data-[state=open]:ring-1 data-[state=open]:ring-primary/20 transition-all min-w-0 w-full max-w-full"
              >
                <AccordionTrigger
                  indicator="none"
                  className="px-5 py-4 hover:no-underline group cursor-pointer min-w-0 w-full"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full min-w-0 text-left">
                    {/* Left Details */}
                    <div className="flex items-center gap-3">
                      {/* <div className="size-6 rounded-full border border-border flex items-center justify-center shrink-0 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform bg-background/50">
                        <ChevronDown className="size-3.5" />
                      </div> */}

                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-semibold text-foreground truncate max-w-[280px] sm:max-w-md">
                          #{displayId}
                        </span>

                        <StatusBadge status={run.status || 'completed'} />

                        {artifacts.length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {artifacts.length}{' '}
                            {artifacts.length === 1 ? 'artifact' : 'artifacts'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Metrics */}
                    <div className="flex items-center gap-6 self-end sm:self-center text-xs shrink-0">
                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-xs text-muted-foreground">
                          Duration
                        </span>
                        <span className="text-xs font-medium text-foreground flex items-center gap-1">
                          <Clock className="size-3 text-muted-foreground" />
                          {formatDuration(run)}
                        </span>
                      </div>

                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-xs text-muted-foreground">
                          Timestamp
                        </span>
                        <span className="text-xs text-muted-foreground">
                          <DateFormatter
                            date={run.startedAt || run.createdAt}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-5 pb-5 pt-0 min-w-0 w-full max-w-full overflow-hidden space-y-4">
                  {/* Run Artifacts if any */}
                  {artifacts.length > 0 && (
                    <PlaygroundArtifacts
                      artifacts={artifacts}
                      runId={run.runId}
                      agentId={run.agentId}
                      title="Generated Artifacts"
                      description="Artifacts produced by this run."
                    />
                  )}

                  {/* Terminal Execution Trace (Light & Dark theme responsive) */}
                  <div className="bg-white dark:bg-[#0b0e14] rounded-xl border border-border dark:border-zinc-800 shadow-sm dark:shadow-xl overflow-hidden font-mono text-xs min-w-0 w-full max-w-full">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50/90 dark:bg-zinc-900/80 border-b border-border dark:border-zinc-800 text-xs">
                      <div className="flex items-center gap-2.5">
                        <Terminal className="size-4 text-primary" />
                        <span className="font-sans font-semibold text-foreground dark:text-zinc-200 text-xs">
                          Agent Execution Trace
                        </span>
                        {isRunning && (
                          <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-sans">
                            <Loader2 className="size-3 animate-spin" />
                            Streaming live...
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-muted-foreground hover:text-foreground hover:bg-muted dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 gap-1.5 px-2.5 font-sans cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyRawLogs(run);
                          }}
                        >
                          {isCopied ? (
                            <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                          <span>{isCopied ? 'Copied' : 'Copy Logs'}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-muted-foreground hover:text-foreground hover:bg-muted dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 gap-1.5 px-2.5 font-sans cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadJson(run);
                          }}
                        >
                          <Download className="size-3" />
                          <span>Download JSON</span>
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 space-y-2.5 max-h-[600px] overflow-y-scroll overflow-x-hidden select-text min-w-0 w-full custom-scrollbar">
                      {logs.length > 0 ? (
                        logs.map((_, idx) => {
                          const logIndex = logs.length - 1 - idx;
                          const log = logs[logIndex];
                          const { tag, cleanText, tagClass } =
                            parseLogItem(log);
                          return (
                            <div
                              key={logIndex}
                              className="rounded-lg p-1.5 transition-colors leading-relaxed hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40 min-w-0 w-full"
                            >
                              <div className="flex items-start gap-2.5 font-mono min-w-0 w-full">
                                <span
                                  className={cn(
                                    'text-xs font-bold uppercase shrink-0 pt-0.5',
                                    tagClass,
                                  )}
                                >
                                  {tag}
                                </span>
                                <div
                                  className="text-zinc-900 dark:text-zinc-200 text-xs flex-1 min-w-0 break-all"
                                  style={{
                                    wordBreak: 'break-all',
                                    overflowWrap: 'anywhere',
                                  }}
                                >
                                  {renderHighlightedText(cleanText)}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-8 text-center text-muted-foreground dark:text-zinc-500 text-xs">
                          No execution trace logs recorded for this run.
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
