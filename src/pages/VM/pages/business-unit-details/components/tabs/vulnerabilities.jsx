import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, RefreshCcw, ShieldAlert } from 'lucide-react';
import { useGetVmVulnsQuery } from '@/services/vm/vulnerabilityApi';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Profile } from '@/components/custom/profile';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '../../../../../../components/common/api-error-handler';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';

function getColumns() {
  return [
    {
      id: 'title',
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title="Title" column={column} />
      ),
      cell: ({ row }) => (
        <Link
          to={`/vm/vulnerability-report?id=${row?.original?._id}&assessmentId=${row?.original?.assessmentId?._id || row?.original?.assessmentId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="leading-none font-medium text-sm text-mono hover:text-primary"
        >
          <div className="flex flex-col gap-1 lg:gap-2.5">
            <div className="flex items-center gap-1">
              {row?.original?.blockers?.length > 0 && (
                <ShieldAlert size={15} className="text-destructive" />
              )}
              <p className="truncate max-w-[300px]">
                {row.original.title}
              </p>
            </div>
            {/* <p className="text-gray-500 whitespace-normal break-words text-xs">
              {row.original?.affectedAssets[0]?.assetName ||
                row.original?.affectedAssets[0]?.value ||
                'No Associated Asset'}
            </p> */}
          </div>
        </Link>
      ),
      enableSorting: false,
      size: 350,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'owner',
      accessorFn: (row) => row.owner,
      header: ({ column }) => (
        <DataGridColumnHeader title="Owner" column={column} />
      ),
      cell: ({ row }) => {
        const firstName = row.original.assigneeDetails?.firstName;
        const assigneeName = row.original?.assignee?.name;
        const ownerName = firstName || assigneeName;

        if (!ownerName || ownerName.toLowerCase() === 'no owner') {
          return <span className="text-muted-foreground">No owner</span>;
        }

        return (
          <Profile
            name={ownerName}
            role={row.original.assigneeDetails?.role || ' '}
            email={
              row.original.assigneeDetails?.email ||
              row.original?.assignee?.email ||
              ' '
            }
          />
        );
      },
      enableSorting: false,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'Assessment Name',
      accessorFn: (row) => row.assessmentTitle,
      header: ({ column }) => (
        <DataGridColumnHeader title="Assessment Name" column={column} />
      ),
      cell: ({ row }) => (
        <Link
          to={`/vm/assessment-edit?assessmentId=${row?.original?.assessmentId}`}
          className="leading-none font-medium text-sm text-mono hover:text-primary"
        >
          {row.original.assessmentTitle || 'Unknown'}
        </Link>
      ),
      enableSorting: false,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'state',
      accessorFn: (row) => row.state,
      header: ({ column }) => (
        <DataGridColumnHeader title="State" column={column} />
      ),
      cell: ({ row }) => <StateLabels state={row.original.state} />,
      enableSorting: false,
      size: 130,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'Severity',
      accessorFn: (row) => row.severity,
      header: ({ column }) => (
        <DataGridColumnHeader title="Severity" column={column} />
      ),
      cell: ({ row }) => <SeverityLabel severity={row.original.cvssRating} />,
      enableSorting: true,
      size: 100,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'Reported On',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <DataGridColumnHeader title="Reported On" column={column} />
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="Timeline Definitions"
            popoverContent={
              <div className="space-y-2 text-xs">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">First Reported:</strong> The date and time when the vulnerability was initially identified.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Last Updated:</strong> The most recent date when the vulnerability was updated.
                </p>
              </div>
            }
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <DateFormatter date={row.original.createdAt} />
          {/* <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
            <RefreshCcw size={8} />
            <DateFormatter date={row.original.updatedAt} />
          </div> */}
        </div>
      ),
      enableSorting: true,
      size:85,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

const BusinessUnitVulnerabilitiesTab = ({ businessUnitId, activeTab }) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});

  // Reset page when search query or filters change
  useEffect(() => {
    if (pagination?.pageIndex !== 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [search, JSON.stringify(filters)]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetVmVulnsQuery({
    businessUnitIds: businessUnitId,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    ...filters,
    ...(sorting?.length
      ? {
          sortBy:
            sorting[0]?.id === 'Severity'
              ? 'cvssScore'
              : sorting[0]?.id === 'Reported On'
                ? 'createdAt'
                : sorting[0]?.id,
          sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
        }
      : {}),
  });

  // Refetch data when the tab is opened to ensure fresh data after adding assets
  useEffect(() => {
    if (activeTab === 'vulnerabilities' || activeTab === undefined) {
      refetch();
    }
  }, [activeTab, refetch]);

  const columns = useMemo(() => getColumns(), []);

  if (!isError && !isLoading && !data?.data?.userVulns?.length && !search && !Object.keys(filters).length) {
    return (
      <EmptyScreen
        title="No Vulnerabilities Found"
        subTitle="This business unit has no reported vulnerabilities."
      />
    );
  }

  if(isError) return <ApiErrorHandler error={error}/>

  return (
    <div className="space-y-4">
      <Table
        data={data?.data?.userVulns || []}
        columns={columns}
        isLoading={isLoading || isFetching}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        totalPages={data?.data?.totalPages}
        totalCount={data?.data?.totalItems}
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search Vulnerabilities"
        enableSorting={true}
        toolbar={
          <TableToolbarFilters
            supportedFilters={data?.data?.advanced_filters}
            filters={filters}
            setFilters={setFilters}
            isLoadingFilters={isLoading}
          />
        }
      />
    </div>
  );
};

export default BusinessUnitVulnerabilitiesTab;
