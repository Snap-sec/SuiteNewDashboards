import { useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import Table from '@/components/custom/table';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import FullRequest from '../../../TM/pages/threats-detail/components/full-request';
import useStore from '../store';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomTooltip } from '@/components/custom/tooltip';
import FilterButton from './filter-button';
import RequestInfoModel from './request-details';

function getColumns() {
  return [
    {
      id: 'name',
      header: ({ column }) => <DataGridColumnHeader title="Name" column={column} />,
      accessorFn: row => row.name,
      cell: ({ row }) => 
      <p className="truncate block max-w-[180px] font-medium" title={row.original.name}>
        {row.original?.rawRequest?.name || "Unknown"}
     </p>,

      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'method',
      header: ({ column }) => (
        <DataGridColumnHeader title="Method" column={column} />
      ),
      accessorFn: (row) => row.method,
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.method === 'GET'
              ? 'primary'
              : row.original.method === 'POST'
                ? 'success'
                : row.original.method === 'PUT'
                  ? 'warning'
                  : row.original.method === 'PATCH'
                    ? 'secondary'
                    : row.original.method === 'DELETE'
                      ? 'destructive'
                      : ' '
          }
          appearance="outline"
        >
          {row.original.method}
        </Badge>
      ),
      size: 80,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'url',
      header: ({ column }) => (
        <DataGridColumnHeader title="URL" column={column} />
      ),
      accessorFn: (row) => row.url,
      cell: ({ row }) => (
        <>
          {/* <FullRequest
            raw={row?.original?.rawHttp}
            showGenerateThreatButton={false}
            triggerBtn={
              <p
                className="truncate cursor-pointer hover:text-primary block max-w-[260px]"
                title={row.original.url}
              >
                {row.original.url}
              </p>
            }
          /> */}

          <RequestInfoModel title={row.original.url} data={row?.original}/>
        </>
      ),
      size: 300,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

     {
      id: 'collectionName',
      header: ({ column }) => (
        <DataGridColumnHeader title="Response" column={column} />
      ),
      accessorFn: (row) => row.collectionName,
      cell: ({ row }) => (
        <p className="truncate block font-medium">
          {row?.original?.executionResult?.responseStatus}
        </p>
      ),
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },


    {
      id: 'collectionName',
      header: ({ column }) => (
        <DataGridColumnHeader title="Rule" column={column} />
      ),
      accessorFn: (row) => row.collectionName,
      cell: ({ row }) => (
        <p className="truncate block">
         {row?.original?.rule?.rule_name}
        </p>
      ),
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'totalVulns',
      header: ({ column }) => (
        <DataGridColumnHeader title="Matched" column={column} />
      ),
      accessorFn: (row) => row.totalVulns,
      cell: ({ row }) => {
        const hasVulnerability = row?.original?.vulnerability;

        return (
          <Badge 
            variant={hasVulnerability ? "success" : "destructive"} 
            appearance="outline"
          >
            {hasVulnerability ? "True" : "False"} 
          </Badge>
        );
      },
      size: 70,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    

  ];
}


function TableToolbar({ supportedFilters, filters, setFilters }) {
  const statusCodeFilters =
    supportedFilters?.statusCode?.map((val) => ({
      id: String(val),
      label: String(val),
      value: String(val),
    })) || [];

  const methodFilters =
    supportedFilters?.method?.map((val) => ({
      id: val,
      label: val,
      value: val,
    })) || [];

  const handleFilterChange = (key) => (checked, value) => {
    setFilters((prev) => {
      if (checked || value?.length > 0) {
        return { ...prev, [key]: value?.join(',') };
      } else {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  return (
    <div className="flex gap-2 items-center">

      <CustomTooltip text="Filter results by Status">
        <FilterButton
          title="Method"
          defaultValue={filters.method?.split(',')}
          filters={methodFilters}
          onChange={handleFilterChange('method')}
        />
      </CustomTooltip>

      <CustomTooltip text="Filter results by Status">
        <FilterButton
          title="Status Code"
          defaultValue={filters.statusCode?.split(',')}
          filters={statusCodeFilters}
          onChange={handleFilterChange('statusCode')}
        />
      </CustomTooltip>

      <Button variant="outline" onClick={() => setFilters(() => ({}))}>
        <RefreshCcw />
        Reset
      </Button>
    </div>
  );
}

function EndpointsList({ data, isLoading, isFetching }) {
  // Combine all endpoints from all versions
  // const allEndpoints = useMemo(() => data?.flatMap(group => group.endpoints) || [], [data]);

  const columns = useMemo(() => getColumns(), []);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);
  const search = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  // Reset to first page when filters or search changes
  useEffect(() => {
    setPagination(() => ({ ...pagination, pageIndex: 0 }));
  }, [filters, search]);

  return (
    <Table
      grid
      data={data?.requests}
      isLoading={isLoading || isFetching}
      columns={columns}
      pagination={pagination}
      totalPages={Math.ceil(data?.total/pagination.pageSize)}
      totalCount={data?.total}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      // manualPagination={true}
      enableSearch={true}
      // onSearchChange={setSearchQuery}
      search={search}
      setSearch={setSearchQuery}
      toolbar={
        <TableToolbar
          filters={filters}
          setFilters={setFilters}
          supportedFilters={data?.filters}
        />
      }
    />
  );
}

export default EndpointsList;
