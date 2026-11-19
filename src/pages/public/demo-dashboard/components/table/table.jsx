'use client';

import { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  FileDown,
  Filter,
  KeyRound,
  Lock,
  NotepadText,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  TrafficCone,
  Wifi,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataGrid, useDataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import SeverityLabel from '@/components/custom/severity-label';
import { Link } from 'react-router';

import {Profile} from '@/components/custom/profile';
import {DateFormatter} from '@/components/custom/date-formatter';
import { StateLabels } from '@/components/custom/state-labels';


const Table = ({ data }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverities, setSelectedSeverities] = useState([]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter by severity
      console.log('TOOOPPPPP',data)
      const matchesSeverity =
        !selectedSeverities?.length ||
        selectedSeverities.includes(item.severity);

      // Filter by search query (case-insensitive)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchLower);

      return matchesSeverity && matchesSearch;
    });
  }, [searchQuery, selectedSeverities]);

  const severityCounts = useMemo(() => {
    return data.reduce((acc, item) => {
      const severity = item.severity;
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const handleSeverityChange = (checked, value) => {
    setSelectedSeverities((prev = []) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  const columns = useMemo(
    () => [
      // {
      //   accessorKey: '_id',
      //   accessorFn: (row) => row._id,
      //   header: () => <DataGridTableRowSelectAll />,
      //   cell: ({ row }) => <DataGridTableRowSelect row={row} />,
      //   enableSorting: false,
      //   enableHiding: false,
      //   enableResizing: false,
      //   size: 51,
      //   meta: {
      //     cellClassName: '',
      //   },
      // },
      {
        id: 'title',
        accessorFn: (row) => row.title,
        header: ({ column }) => (
          <DataGridColumnHeader title="Title" column={column} />
        ),

        cell: ({ row }) => (
          <div 
            className="leading-none font-medium text-sm text-mono hover:text-primary flex items-center gap-1">
              {row?.original?.blockers?.length > 0 && (<ShieldAlert size={16} className="text-destructive" /> )}  {row.original.title}
          </div>
        ),

        enableSorting: true,
        size: 400,
        meta: {
          cellClassName: '',
        },
      },
       {
            id: 'owner',
            accessorFn: (row) => row.owner,
            header: ({ column }) => (
            <DataGridColumnHeader title="Owner" column={column} />
            ),

            cell: ({ row }) => (
            // <div className="flex items-center gap-1.5">
            //     {row.original.assignee?.name || "Unknown"}
            // </div>
             <Profile name={
                          row.original.assigneeDetails?.firstName && row.original.assigneeDetails?.lastName
                            ? `${row.original.assigneeDetails.firstName} ${row.original.assigneeDetails.lastName}`
                            : "Unknown"
                        }
                      role={row.original.assigneeDetails?.role || " "} 
                      email={row.original.assigneeDetails?.email}
                      userId={row.original.assigneeDetails?._id}
              />
            ),

            enableSorting: false,
            size: 150,
            meta: {
                cellClassName: '',
                // skeleton: <Skeleton className="h-7" />
            },
        },
      // {
      //   id: 'assessment name',
      //   accessorFn: (row) => row.eventType,
      //   header: ({ column }) => (
      //     <DataGridColumnHeader title="Assessment Name" column={column} />
      //   ),

      //   cell: ({ row }) => (
      //     <div className="flex items-center gap-1.5">
      //         {row.original.assessmentTitle || "Unknown"}
      //     </div>
      //   ),

      //   enableSorting: false,
      //   size: 200,
      //   meta: {
      //     cellClassName: '',
      //   },
      // },
      {
        id: 'state',
        accessorFn: (row) => row.eventType,
        header: ({ column }) => (
          <DataGridColumnHeader title="State" column={column} />
        ),
  
        cell: ({ row }) => <StateLabels state={row.original.state} />,
  
        enableSorting: false,
        size: 130,
        meta: {
          cellClassName: '',
          // skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'cvssScore',
        accessorFn: (row) => row.severity,
        header: ({ column }) => (
          <DataGridColumnHeader title="Severity" column={column} />
        ),
  
        cell: ({ row }) => <SeverityLabel severity={row.original.cvssRating} />,
  
        enableSorting: true,
        size: 100,
        meta: {
          cellClassName: '',
          // skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'Found On',
        accessorFn: (row) => row.createdAt,
        header: ({ column }) => (
          <DataGridColumnHeader title="Reported On" column={column} />
        ),

        cell: ({ row }) => (
          <DateFormatter date={row.original.createdAt}/>
        ),

        enableSorting: true,
        size: 100,
        meta: {
          cellClassName: '',
        },
      },
      // {
      //   id: 'actions',
      //   header: () => '',
      //   cell: () => (
      //     <Button variant="ghost">
      //       <NotepadText />
      //     </Button>
      //   ),

      //   enableSorting: false,
      //   size: 70,
      //   meta: {
      //     headerClassName: '',
      //   },
      // },
    ],

    [],
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const Toolbar = () => {
    const { table } = useDataGrid();

    return (
      <CardToolbar>
        <DataGridColumnVisibility
          table={table}
          trigger={
            <Button variant="outline">
              <Settings2 />
              Columns
            </Button>
          }
        />
      </CardToolbar>
    );
  };

  return (
    <DataGrid
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: false,
      }}
    >
      <Card>
        {/* <CardHeader>
          <CardHeading>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search Vulns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9 w-40"
                />

                {searchQuery.length > 0 && (
                  <Button
                    mode="icon"
                    variant="ghost"
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery('')}
                  >
                    <X />
                  </Button>
                )}
              </div>
              <Popover>
                <PopoverContent className="w-40 p-3" align="start">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Filters
                    </div>
                    <div className="space-y-3">
                      {Object.keys(severityCounts).map((severity) => (
                        <div
                          key={severity}
                          className="flex items-center gap-2.5"
                        >
                          <Checkbox
                            id={severity}
                            checked={selectedSeverities.includes(severity)}
                            onCheckedChange={(checked) =>
                              handleSeverityChange(checked === true, severity)
                            }
                          />

                          <Label
                            htmlFor={severity}
                            className="grow flex items-center justify-between font-normal gap-1.5"
                          >
                            {severity}
                            <span className="text-muted-foreground">
                              {severityCounts[severity]}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeading>
          <Toolbar />
        </CardHeader> */}
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
      </Card>
    </DataGrid>
  );
};

export default Table ;
