import Table from "@/components/custom/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import usePagination from "../../../../../../hooks/use-pagination";
import { useMemo } from "react";
import { Link } from "react-router";
import {Badge} from "@/components/ui/badge"


function getColumns() {
  return [
    {
      id: 'name',
      header: ({ column }) => <DataGridColumnHeader title="Name" column={column} />,
      accessorFn: row => row.name,
      cell: ({ row }) => 
      <span className="truncate block max-w-[180px] font-medium" title={row.original.name}>
        {row.original.name}
     </span>,

      size: 200,
      meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'method',
      header: ({ column }) => <DataGridColumnHeader title="Method" column={column} />,
      accessorFn: row => row.method,
      cell: ({ row }) => 
         <Badge 
            variant={row.original.method === "GET" ? "primary" : 
                row.original.method === "POST" ? "success" : 
                row.original.method === "PUT" ? "warning" :
                row.original.method === "PATCH" ? "secondary" : 
                row.original.method === "DELETE" ? "destructive" :
                " "
                } 
                appearance="outline">
            {row.original.method}
        </Badge>,
      size: 80,
      meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'path',
      header: ({ column }) => <DataGridColumnHeader title="Path" column={column} />,
      accessorFn: row => row.path,
      cell: ({ row }) => 
         <span className="truncate block max-w-[180px]" title={row.original.path}>
            {row.original.path}
        </span>,
      size: 200,
      meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'url',
      header: ({ column }) => <DataGridColumnHeader title="URL" column={column} />,
      accessorFn: row => row.url,
      cell: ({ row }) => <Link to={row.original.url} target="_blank" className="truncate hover:text-primary block max-w-[260px]" title={row.original.url}>{row.original.url}</Link>,
      size: 300,
      meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'collection',
      header: ({ column }) => <DataGridColumnHeader title="Collection" column={column} />,
      accessorFn: row => row.collection,
      cell: ({ row }) => <Badge>{row.original.collection}</Badge>,
      size: 120,
      meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'workspace',
      header: ({ column }) => <DataGridColumnHeader title="Workspace" column={column} />,
      accessorFn: row => row.workspace,
      cell: ({ row }) => <Badge>{row.original.workspace}</Badge>,
      size: 120,
      meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    },
    // Add more columns as needed
  ];
}

function EndpointsList({ data }) {
  // Combine all endpoints from all versions
  const allEndpoints = useMemo(() => data?.flatMap(group => group.endpoints) || [], [data]);

  const columns = getColumns();
  const { pagination, setPagination } = usePagination(10);

  return (
    <Table
      data={allEndpoints}
      columns={columns}
      pagination={pagination}
      setPagination={setPagination}
      manualPagination={false}
      enableSearch={false}
      newSearchInput={
        <h3 data-slot="card-title" className="text-base font-semibold leading-none tracking-tight">
          Endpoints
        </h3>
      }
    />
  );
}

export default EndpointsList;