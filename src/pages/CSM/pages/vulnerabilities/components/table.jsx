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

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import SeverityLabel from '@/components/custom/severity-label';
import useStore from '../store';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

import {StateLabels} from '@/components/custom/state-labels';
import {Profile} from '@/components/custom/profile';
import {DateFormatter} from '@/components/custom/date-formatter';
import { Link } from 'react-router';
import { OctagonX } from 'lucide-react';
import FilterButton from './filter-button';
import { SortAscIcon } from 'lucide-react';
import { SortDescIcon } from 'lucide-react';




const Table = () => {
    const setMetrics = useStore((state) => state.setMetrics);
    const setVulnsLoading = useStore((state) => state.setVulnsLoading);

    const [sorting, setSorting] = useState([{ id: 'createdAt', desc: true }]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });


    const total = vulnData?.data?.totalItems || 0;
    const supportedFilters = vulnData?.data?.filters;


    // build filter arrays
    const severityFilters = supportedFilters?.severity?.map(severity => ({ id: severity, label: severity, value: severity })) || [];
    const assessmentFilters = supportedFilters?.assessments?.map(filter => ({ id: filter.id, label: filter.title, value: filter.title })) || [];
    const ownerFilters = supportedFilters?.owners?.map(owner => ({ id: owner.email, label: owner.name, value: owner.email })) || [];


    const handleFilterChange = (key) => (checked, value) => {
        if (checked) setFilters(prev => ({ ...prev, [key]: value.value }));
        else setFilters(prev => Object.keys(prev).filter(k => k != key).reduce((f, k) => ({ ...f, [k]: prev[k] }), {}));
    }

    useEffect(() => {
        setVulnsLoading(isLoading);
    }, [isLoading]);

    useEffect(() => {
        if (vulnData) {
            setMetrics(vulnData?.data?.metrics);
        }
    }, [vulnData]);


    const columns = useMemo(
        () => [
        {
            accessorKey: '_id',
            accessorFn: (row) => row._id,
            header: () => <DataGridTableRowSelectAll />,
            cell: ({ row }) => <DataGridTableRowSelect row={row} />,
            enableSorting: false,
            enableHiding: false,
            enableResizing: false,
            size: 51,
            meta: {
                cellClassName: '',
            },
        },
        {
            id: 'title',
            accessorFn: (row) => row.title,
            header: ({ column }) => (
            <DataGridColumnHeader title="Title" column={column} />
            ),

            cell: ({ row }) => (
            <Link to={`/vm/vulnerability-report?id=${row?.original?._id}&assessmentId=${row?.original?.assessmentId}`} className="leading-none text-mono flex gap-1 font-medium text-sm+ hover:text-primary data-[selected=true]:text-primary ">
               {row?.original?.blockers.length > 0 && (<ShieldAlert size={16} className="text-destructive" /> )}{row.original.title}
            </Link>
            ),

            enableSorting: false,
            size: 400,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7 w-[100px]" />
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
             <Profile name={row.original.assignee?.name || "Unknown"} role={row.original.assignee?.role || "{{Role}}"} email={row.original.assignee?.email} />
            ),

            enableSorting: false,
            size: 150,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7 w-[100px]" />
            },
        },
        {
            id: 'Assessment Name',
            accessorFn: (row) => row.assessmentTitle,
            header: ({ column }) => (
            <DataGridColumnHeader title="Assessment Name" column={column} />
            ),

            cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                {row.original.assessmentTitle || "Unknown"}
            </div>
            ),

            enableSorting: false,
            size: 150,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7 w-[100px]" />
            },
        },
        {
            id: 'state',
            accessorFn: (row) => row.eventType,
            header: ({ column }) => (
            <DataGridColumnHeader title="State" column={column} />
            ),

            cell: ({ row }) => (
             <StateLabels state={row.original.state}/>
            ),

            enableSorting: false,
            size: 130,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7 w-[100px]" />
            },
        },
        {
            id: 'severity',
            accessorFn: (row) => row.severity,
            header: ({ column }) => (
                <DataGridColumnHeader title="Severity" column={column} />
            ),

            cell: ({ row }) => (
                <SeverityLabel severity={row.original.cvssRating} />
            ),

            enableSorting: true,
            size: 100,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7 w-[100px]" />
            },
        },
        {
            id: 'createdAt',
            accessorFn: (row) => row.createdAt,
            header: ({ column }) => (
            <DataGridColumnHeader title="Reported On" column={column} />
            ),

            cell: ({ row }) => (
            <DateFormatter date={row.original.createdAt} />
            ),

            enableSorting: true,
            size: 100,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7 w-[100px]" />
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
        data: vulnData?.data?.userVulns || [],
        pageCount: Math.ceil((total || 0) / pagination.pageSize),
        getRowId: (row) => row.id,
        state: {
            pagination,
            sorting,
        },
        manualPagination: true,
        manualSorting: true,
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
            recordCount={vulnData?.data?.userVulns?.length || 0}
            isLoading={isLoading || isFetching}
            tableLayout={{
                columnsPinnable: true,
                columnsMovable: true,
                columnsVisibility: true,
                cellBorder: false,
            }}
        >
        <Card>
            <CardHeader>
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

                    {searchQuery?.length > 0 && (
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
                    <FilterButton title="Severity" filters={severityFilters} onChange={handleFilterChange("severity")} />
                    <FilterButton title="Assessments" filters={assessmentFilters} onChange={handleFilterChange("assTitle")} />
                    <FilterButton title="Owners" filters={ownerFilters} onChange={handleFilterChange("assignee")} />
                </div>
            </CardHeading>
            
            <div className='flex items-center gap-3'>
                <FilterButton icon={<SortAscIcon />} title="Sort By" filters={ownerFilters} onChange={handleFilterChange("assignee")} />
                <FilterButton icon={<SortDescIcon />} title="Sort As" filters={ownerFilters} onChange={handleFilterChange("assignee")} />
                <Toolbar />
            </div>
            </CardHeader>
            <CardTable>
            <ScrollArea>
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            </CardTable>
            <CardFooter>
            <DataGridPagination isLoading={false} />
            </CardFooter>
        </Card>
        </DataGrid>
    );
};

export default Table;