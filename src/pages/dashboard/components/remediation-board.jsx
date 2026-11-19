import { useState } from "react"

import { Columns3 } from "lucide-react"
import { toast } from "sonner"

import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/reui/frame"
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@/components/reui/kanban"
import { Badge } from "@/components/reui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { boardStages, initialBoard } from "../data/dashboard"
import { useDashboardStore } from "../store/use-dashboard-store"
import { cn } from "@/lib/utils"

import { RegionState } from "./region-state"
import { SeverityBadge } from "./severity-badge"

const STAGE_LABELS = Object.fromEntries(
  boardStages.map((stage) => [stage.id, stage.label]),
)

function BoardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {boardStages.map((stage) => (
        <div
          key={stage.id}
          className="flex flex-col gap-2 rounded-xl border border-border p-2"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ))}
    </div>
  )
}

function TaskCard({ task }) {
  return (
    <KanbanItem
      value={task.id}
      className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <KanbanItemHandle>
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
          <div className="flex items-center justify-between gap-2">
            <SeverityBadge severity={task.severity} />
            <span
              className={cn(
                "text-xs",
                task.dueRisk
                  ? "font-medium text-destructive-foreground dark:text-destructive"
                  : "text-muted-foreground",
              )}
            >
              {task.due === "today" ? "Due today" : `Due ${task.due}`}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium leading-snug">{task.title}</p>
            <p className="break-all text-xs text-muted-foreground">
              {task.asset}
            </p>
          </div>

          <div className="flex items-center gap-2 border-t border-border pt-2 text-xs text-muted-foreground">
            <Avatar size="sm" aria-hidden="true">
              <AvatarFallback>{task.owner}</AvatarFallback>
            </Avatar>
            <span>{task.team}</span>
            <span className="ml-auto whitespace-nowrap">
              {task.age} in stage
            </span>
          </div>
        </div>
      </KanbanItemHandle>
    </KanbanItem>
  )
}

function TaskColumn({ stage, tasks }) {
  return (
    <KanbanColumn
      value={stage.id}
      className="min-w-0 rounded-xl border border-border bg-muted/30 p-2"
    >
      <div className="flex items-center gap-2 px-1 pb-2">
        <span
          className={cn("size-2 rounded-full", stage.dotClassName)}
          aria-hidden="true"
        />
        <h3 className="text-xs font-semibold">{stage.label}</h3>
        <Badge variant="outline">{tasks.length}</Badge>
      </div>

      <KanbanColumnContent value={stage.id}>
        {tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-2 py-4 text-center text-xs text-muted-foreground">
            No tasks in this stage
          </p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </KanbanColumnContent>
    </KanbanColumn>
  )
}

export function RemediationBoard({ className, status, onRetry }) {
  const storedBoard = useDashboardStore((state) => state.board)
  const commitBoard = useDashboardStore((state) => state.commitBoard)
  const resetBoard = useDashboardStore((state) => state.resetBoard)
  const [columns, setColumns] = useState(storedBoard)

  const allTasks = Object.values(columns).flat()
  const totalTasks = allTasks.length
  const atRiskCount = allTasks.filter((task) => task.dueRisk).length
  const isEmpty = totalTasks === 0

  function handleCommit(nextBoard, meta) {
    commitBoard(nextBoard)
    toast.success("Task moved", {
      description: `Moved to ${STAGE_LABELS[meta.overContainer] ?? "another stage"}.`,
    })
  }

  function handleReset() {
    setColumns(initialBoard)
    resetBoard()
    toast.success("Board restored", {
      description: "Demo tasks are back in their original stages.",
    })
  }

  return (
    <Frame className={cn("h-full", className)}>
      <FrameHeader className="flex-row flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <FrameTitle>Remediation board</FrameTitle>
          <FrameDescription>
            Active work from triage to verification
          </FrameDescription>
        </div>
        <Badge variant="destructive-light">
          {atRiskCount} beyond SLA
        </Badge>
      </FrameHeader>

      <FramePanel className="flex flex-1 flex-col">
        <RegionState
          status={status}
          label="the remediation board"
          onRetry={onRetry}
          skeleton={<BoardSkeleton />}
        >
          {isEmpty ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Columns3 aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No active remediation work</EmptyTitle>
                <EmptyDescription>
                  Every demo task has been cleared from the board.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  Reset demo board
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <Kanban
              value={columns}
              onValueChange={setColumns}
              onValueCommit={handleCommit}
              getItemValue={(item) => item.id}
            >
              <KanbanBoard>
                {boardStages.map((stage) => (
                  <TaskColumn
                    key={stage.id}
                    stage={stage}
                    tasks={columns[stage.id]}
                  />
                ))}
              </KanbanBoard>
              <KanbanOverlay className="rounded-lg border-2 border-dashed border-border bg-muted/30" />
            </Kanban>
          )}
        </RegionState>
      </FramePanel>

      <FrameFooter className="flex-row flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {totalTasks} active {totalTasks === 1 ? "task" : "tasks"} across 3
          stages
        </span>
        <span>Next review in 30 min</span>
      </FrameFooter>
    </Frame>
  )
}
