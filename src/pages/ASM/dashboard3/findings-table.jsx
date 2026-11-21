import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Braces,
  Cloud,
  Globe2,
  Mail,
  Network,
  RefreshCcw,
  Search,
  SearchX,
  Server,
} from "lucide-react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTable } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Input, InputWrapper } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PanelTitle } from "./components";

const SEVERITY_RANK = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

const SURFACE_ICONS = {
  web: Globe2,
  cloud: Cloud,
  api: Braces,
  remote: Network,
  email: Mail,
  dns: Server,
};

function SeverityBadge({ severity }) {
  const variant =
    severity === "Critical"
      ? "destructive"
      : severity === "High"
        ? "high"
        : severity === "Medium"
          ? "warning"
          : "secondary";

  return (
    <Badge
      variant={variant}
      appearance={severity === "Low" ? "outline" : "light"}
    >
      {severity}
    </Badge>
  );
}

function SurfaceTile({ surfaceKey }) {
  const Icon = SURFACE_ICONS[surfaceKey] ?? Globe2;

  return (
    <span
      className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-secondary-foreground"
      aria-hidden="true"
    >
      <Icon className="size-3" />
    </span>
  );
}

function OwnerCell({ owner }) {
  const initials = owner.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-secondary-foreground"
        aria-hidden="true"
      >
        {initials}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm">{owner.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {owner.team}
        </span>
      </div>
    </div>
  );
}

function FindingsEmpty({
  state,
  hasFilters,
  onRetry,
  onClearFilters,
  onDiscover,
}) {
  if (state === "error") {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <AlertCircle className="size-4 text-destructive" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">
          Findings could not be loaded
        </p>
        <p className="text-xs">The findings service did not respond.</p>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RefreshCcw aria-hidden="true" />
          Retry
        </Button>
      </div>
    );
  }

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <SearchX className="size-4" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">
          No findings match these filters
        </p>
        <p className="text-xs">Try a different severity or search term.</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClearFilters}
        >
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <p className="text-sm font-medium text-foreground">
        No findings for this period
      </p>
      <p className="text-xs">
        Run discovery to populate the external attack surface.
      </p>
      <Button type="button" variant="outline" size="sm" onClick={onDiscover}>
        Run discovery
      </Button>
    </div>
  );
}

export function FindingsTable({
  findings,
  state,
  onRetry,
  onDiscover,
  onInspect,
}) {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("all");
  const [sorting, setSorting] = useState([{ id: "severity", desc: false }]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const filteredFindings = useMemo(() => {
    const search = query.trim().toLowerCase();

    return findings.filter((finding) => {
      const matchesSeverity =
        severity === "all" || finding.severity === severity;
      const matchesSearch =
        !search ||
        finding.title.toLowerCase().includes(search) ||
        finding.asset.toLowerCase().includes(search) ||
        finding.id.toLowerCase().includes(search) ||
        finding.owner.name.toLowerCase().includes(search);

      return matchesSeverity && matchesSearch;
    });
  }, [findings, query, severity]);

  const tableData = state === "ready" ? filteredFindings : [];
  const hasFilters = query.trim().length > 0 || severity !== "all";

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataGridColumnHeader title="Finding" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-2.5">
            <SurfaceTile surfaceKey={row.original.surfaceKey} />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-sm font-medium text-foreground">
                {row.original.title}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {row.original.id} · detected {row.original.detected}
              </span>
            </div>
          </div>
        ),
        size: 320,
        meta: { skeleton: <Skeleton className="h-9 w-56" /> },
      },
      {
        accessorKey: "asset",
        header: ({ column }) => (
          <DataGridColumnHeader title="Asset" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm">{row.original.asset}</span>
            <span className="truncate text-xs text-muted-foreground">
              {row.original.address}
            </span>
          </div>
        ),
        size: 220,
        meta: { skeleton: <Skeleton className="h-9 w-44" /> },
      },
      {
        accessorKey: "severity",
        header: ({ column }) => (
          <DataGridColumnHeader title="Severity" column={column} />
        ),
        cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
        sortingFn: (rowA, rowB) =>
          SEVERITY_RANK[rowA.original.severity] -
          SEVERITY_RANK[rowB.original.severity],
        size: 110,
        meta: { skeleton: <Skeleton className="h-5 w-16" /> },
      },
      {
        accessorKey: "cvss",
        header: ({ column }) => (
          <DataGridColumnHeader title="CVSS" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-sm font-medium tabular-nums">
            {row.original.cvss.toFixed(1)}
          </span>
        ),
        size: 80,
        meta: { skeleton: <Skeleton className="h-4 w-8" /> },
      },
      {
        id: "sla",
        accessorFn: (row) => row.sla.overdue,
        header: ({ column }) => (
          <DataGridColumnHeader title="SLA" column={column} />
        ),
        cell: ({ row }) => (
          <span
            className={cn(
              "text-xs font-medium",
              row.original.sla.overdue
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {row.original.sla.label}
          </span>
        ),
        size: 100,
        meta: { skeleton: <Skeleton className="h-4 w-16" /> },
      },
      {
        id: "owner",
        accessorFn: (row) => row.owner.name,
        header: ({ column }) => (
          <DataGridColumnHeader title="Owner" column={column} />
        ),
        cell: ({ row }) => <OwnerCell owner={row.original.owner} />,
        size: 170,
        meta: { skeleton: <Skeleton className="h-8 w-32" /> },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60"
              aria-hidden="true"
            />
            {row.original.status}
          </span>
        ),
        enableSorting: false,
        size: 120,
        meta: { skeleton: <Skeleton className="h-4 w-20" /> },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              mode="icon"
              aria-label={`Inspect ${row.original.id}`}
              onClick={() => onInspect(row.original)}
            >
              <ArrowUpRight aria-hidden="true" />
            </Button>
          </div>
        ),
        enableSorting: false,
        size: 56,
        meta: {
          headerClassName: "text-end",
          cellClassName: "text-end",
          skeleton: <Skeleton className="ms-auto h-7 w-7" />,
        },
      },
    ],
    [onInspect],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  });

  const resetPage = () => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleSearch = (event) => {
    setQuery(event.target.value);
    resetPage();
  };

  const handleSeverity = (value) => {
    setSeverity(value);
    resetPage();
  };

  const clearFilters = () => {
    setQuery("");
    setSeverity("all");
    resetPage();
  };

  return (
    <DataGrid
      table={table}
      recordCount={tableData.length}
      isLoading={state === "loading"}
      tableLayout={{ cellBorder: true, rowBorder: true }}
      tableClassNames={{ base: "min-w-[1080px]" }}
      emptyMessage={
        <FindingsEmpty
          state={state}
          hasFilters={hasFilters}
          onRetry={onRetry}
          onClearFilters={clearFilters}
          onDiscover={onDiscover}
        />
      }
    >
      <Card className="min-w-0 overflow-hidden">
        <CardHeader>
          <PanelTitle help="Exposures ranked by severity, impact and SLA pressure.">
            Priority findings
          </PanelTitle>
        </CardHeader>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
          <InputWrapper size="md" className="w-full sm:w-64">
            <Search
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              placeholder="Search findings or assets"
              value={query}
              onChange={handleSearch}
              aria-label="Search findings"
              disabled={state !== "ready"}
            />
          </InputWrapper>

          <Select
            value={severity}
            onValueChange={handleSeverity}
            disabled={state !== "ready"}
          >
            <SelectTrigger
              className="w-[148px]"
              aria-label="Filter by severity"
            >
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              <SelectItem value="Critical">Critical (38)</SelectItem>
              <SelectItem value="High">High (164)</SelectItem>
              <SelectItem value="Medium">Medium (312)</SelectItem>
              <SelectItem value="Low">Low (241)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CardTable>
          <div className="min-w-0 overflow-x-auto">
            <DataGridTable />
          </div>
        </CardTable>

        {(state === "ready" || state === "loading") && (
          <CardFooter>
            <DataGridPagination sizes={[8, 12, 24, 48]} />
          </CardFooter>
        )}
      </Card>
    </DataGrid>
  );
}
