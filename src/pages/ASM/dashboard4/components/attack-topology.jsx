import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, PanelState } from "./panel";
import { formatNumber } from "./format";

const VIEW_WIDTH = 720;
const VIEW_HEIGHT = 380;

const RISK_FILL = {
  root: "var(--primary)",
  critical: "var(--destructive)",
  high: "var(--high)",
  medium: "var(--warning)",
  low: "var(--muted-foreground)",
};

const RISK_LABEL = {
  root: "Primary domain",
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function position(node) {
  return {
    x: (node.x / 100) * VIEW_WIDTH,
    y: (node.y / 100) * VIEW_HEIGHT,
  };
}

function labelPosition(node, p) {
  const side = node.labelSide ?? "bottom";
  const gap = node.r + 8;

  if (side === "left") {
    return { x: p.x - gap, y: p.y + 4, anchor: "end" };
  }
  if (side === "right") {
    return { x: p.x + gap, y: p.y + 4, anchor: "start" };
  }
  if (side === "top") {
    return { x: p.x, y: p.y - gap - 2, anchor: "middle" };
  }

  return { x: p.x, y: p.y + gap + 12, anchor: "middle" };
}

function edgePath(source, target) {
  const sourcePoint = position(source);
  const targetPoint = position(target);
  const controlX = (sourcePoint.x + targetPoint.x) / 2;
  const controlY = (sourcePoint.y + targetPoint.y) / 2 - 18;

  return `M ${sourcePoint.x} ${sourcePoint.y} Q ${controlX} ${controlY} ${targetPoint.x} ${targetPoint.y}`;
}

function TopologySkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_190px]">
      <Skeleton className="h-[360px] w-full" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-1.5 w-full" />
        <Skeleton className="mt-2 h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}

function FindingRow({ finding, onOpenFinding }) {
  return (
    <button
      type="button"
      onClick={() => onOpenFinding(finding)}
      className="group -mx-2 flex w-[calc(100%+1rem)] items-start justify-between gap-2 px-2 py-2 text-left transition-colors hover:bg-muted/60"
    >
      <div className="flex min-w-0 items-start gap-2">
        <span
          className={cn(
            "mt-1.5 size-1.5 shrink-0 rounded-full",
            finding.severity === "Critical"
              ? "bg-destructive"
              : finding.severity === "High"
                ? "bg-high"
                : "bg-warning",
          )}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-xs font-medium text-foreground">
            {finding.title}
          </span>
          <span className="truncate text-[11px] text-muted-foreground">
            {finding.sla.label}
          </span>
        </div>
      </div>
      <ArrowUpRight
        className="mt-0.5 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    </button>
  );
}

export function AttackTopology({
  data,
  findings,
  status,
  onRetry,
  onEmptyAction,
  onOpenFinding,
  className,
}) {
  const [selectedId, setSelectedId] = useState(data.defaultNodeId);
  const graphRef = useRef(null);

  const nodesById = useMemo(
    () => Object.fromEntries(data.nodes.map((node) => [node.id, node])),
    [data.nodes],
  );
  const selected = nodesById[selectedId] ?? data.nodes[0];

  useEffect(() => {
    if (status !== "ready") return;

    const graph = graphRef.current;
    const node = nodesById[selectedId] ?? data.nodes[0];
    if (!graph || !node) return;
    if (graph.scrollWidth <= graph.clientWidth + 1) return;

    const target = (node.x / 100) * graph.scrollWidth - graph.clientWidth / 2;
    graph.scrollLeft = Math.max(
      0,
      Math.min(target, graph.scrollWidth - graph.clientWidth),
    );
  }, [data.nodes, nodesById, selectedId, status]);

  const connectedIds = useMemo(() => {
    if (!selected) return new Set();

    const ids = new Set([selected.id]);
    data.edges.forEach((edge) => {
      if (edge.source === selected.id) ids.add(edge.target);
      if (edge.target === selected.id) ids.add(edge.source);
    });
    return ids;
  }, [data.edges, selected]);

  const selectedFindings = findings
    .filter((finding) => finding.nodeId === selected?.id)
    .slice(0, 2);

  const criticalShare = selected?.open
    ? Math.round((selected.critical / selected.open) * 100)
    : 0;

  return (
    <Panel
      title="Attack path graph"
      description="External assets connected to live exposure."
      help="Select a node to trace its business unit, exposure volume and priority findings."
      className={className}
    >
      <PanelState
        state={status}
        skeleton={<TopologySkeleton />}
        onRetry={onRetry}
        onEmptyAction={onEmptyAction}
        emptyTitle="No attack paths discovered"
        emptyDescription="Run discovery to map external assets and their relationships."
      >
        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_190px]">
          <div className="flex min-w-0 flex-col gap-3">
            <div
              ref={graphRef}
              role="region"
              className="min-w-0 overflow-x-auto"
              aria-label="Attack path graph; scroll horizontally to explore on small screens"
            >
              <svg
                viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
                role="group"
                aria-label="External attack path graph. Select a node to inspect its exposure."
                className="h-[360px] w-full min-w-[620px]"
              >
                {data.edges.map((edge) => {
                  const source = nodesById[edge.source];
                  const target = nodesById[edge.target];
                  if (!source || !target) return null;

                  const isConnected =
                    selected &&
                    (edge.source === selected.id ||
                      edge.target === selected.id);

                  return (
                    <path
                      key={`${edge.source}-${edge.target}`}
                      d={edgePath(source, target)}
                      fill="none"
                      stroke="var(--muted-foreground)"
                      strokeWidth={isConnected ? 1.5 : 1}
                      opacity={
                        selected && !isConnected
                          ? 0.12
                          : isConnected
                            ? 0.7
                            : 0.28
                      }
                      pointerEvents="none"
                    />
                  );
                })}

                {data.nodes.map((node) => {
                  const p = position(node);
                  const label = labelPosition(node, p);
                  const isSelected = selected?.id === node.id;
                  const isDimmed = selected && !connectedIds.has(node.id);
                  const isRoot = node.id === "root";

                  return (
                    <g
                      key={node.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.label}, ${node.businessUnit}, ${node.open} open exposures, ${node.critical} critical`}
                      onClick={() => setSelectedId(node.id)}
                      onFocus={() => setSelectedId(node.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedId(node.id);
                        }
                      }}
                      opacity={isDimmed ? 0.45 : 1}
                      className="cursor-pointer focus-visible:outline-none"
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={node.r + 6}
                        fill="transparent"
                      />
                      {isSelected && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={node.r + 4}
                          fill="none"
                          stroke="var(--foreground)"
                          strokeWidth={1.5}
                        />
                      )}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={node.r}
                        fill={RISK_FILL[node.risk] ?? RISK_FILL.low}
                        stroke="var(--card)"
                        strokeWidth={2}
                      />
                      <text
                        x={label.x}
                        y={label.y}
                        textAnchor={label.anchor}
                        fontSize={isRoot ? 12 : 11}
                        fontWeight={isRoot ? 600 : 500}
                        fill={
                          isRoot
                            ? "var(--foreground)"
                            : "var(--muted-foreground)"
                        }
                        stroke="var(--card)"
                        strokeWidth={3}
                        paintOrder="stroke"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full bg-destructive"
                    aria-hidden="true"
                  />
                  Critical
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full bg-high"
                    aria-hidden="true"
                  />
                  High
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full bg-warning"
                    aria-hidden="true"
                  />
                  Medium
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  Primary domain
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Select a node to inspect
              </span>
            </div>

            <p className="border-t border-border pt-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Insight:</span>{" "}
              {data.insight}
            </p>
          </div>

          <aside className="flex min-w-0 flex-col gap-4 border-t border-border pt-4 xl:border-s xl:border-t-0 xl:ps-4 xl:pt-0">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="size-1.5 rounded-full"
                  style={{
                    backgroundColor: RISK_FILL[selected?.risk] ?? RISK_FILL.low,
                  }}
                  aria-hidden="true"
                />
                {selected?.type} · {RISK_LABEL[selected?.risk]}
              </span>
              <h3 className="text-sm font-medium leading-tight text-foreground">
                {selected?.label}
              </h3>
              <span className="text-xs text-muted-foreground">
                {selected?.businessUnit}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  Open exposures
                </span>
                <span className="text-sm font-medium tabular-nums">
                  {formatNumber(selected?.open ?? 0)}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs text-muted-foreground">Critical</span>
                <span className="text-sm font-medium tabular-nums">
                  {formatNumber(selected?.critical ?? 0)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full bg-destructive"
                    style={{ width: `${criticalShare}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {criticalShare}%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Priority findings
              </span>
              {selectedFindings.length > 0 ? (
                selectedFindings.map((finding) => (
                  <FindingRow
                    key={finding.id}
                    finding={finding}
                    onOpenFinding={onOpenFinding}
                  />
                ))
              ) : (
                <p className="py-2 text-xs text-muted-foreground">
                  No priority finding attached to this node.
                </p>
              )}
            </div>
          </aside>
        </div>
      </PanelState>
    </Panel>
  );
}
