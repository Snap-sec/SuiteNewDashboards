import { useMemo } from 'react';
import { RefreshCcw, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Profile } from '@/components/custom/profile';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import ProfileImage from '@/components/common/profile-image';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import useStore from '../../store';

const getRiskInfo = (score) => {
  const n = parseInt(score) || 0;
  if (n === 0) return { label: 'Not Assessed', variant: 'secondary' };
  if (n >= 1 && n <= 11) return { label: 'Low Risk', variant: 'success' };
  if (n >= 12 && n <= 16) return { label: 'Medium Risk', variant: 'warning' };
  if (n >= 17 && n <= 22) return { label: 'High Risk', variant: 'dangerSoft' };
  if (n >= 23 && n <= 27) return { label: 'Critical Risk', variant: 'destructive' };
  return { label: 'Not Assessed', variant: 'secondary' };
};

function getColumns() {
  return [
    {
      id: 'BusinessUnit',
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title="Business Unit" column={column} />
      ),

      cell: ({ row }) => (
        <div className=' flex gap-2'>
          <ProfileImage
            src={row?.original?.logo}
            fallbackAvatarText={row?.original?.name}
          />

          <Link to={`/vm/business-units/${row?.original?._id}`}>
            <p
              title={row?.original?.name}
              className="text-secondary-foreground font-medium hover:text-primary break-words truncate overflow-hidden whitespace-nowrap max-w-40"
            >
              {row?.original?.name}
            </p>
            <p className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap w-[200px] truncate">
              {row?.original?.description}
            </p>
          </Link>
        </div>
      ),

      enableSorting: false,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'owner',
      accessorFn: (row) => row.owner,
      header: ({ column }) => (
        <DataGridColumnHeader title="Owner" column={column} />
      ),
      cell: ({ row }) => (
        <Profile
          name={
            row?.original?.owner?.firstName
              ? `${row?.original?.owner?.firstName}`
              : row.original?.owner?.name || 'No Owner'
          }
          role={row.original.owner?.role || ' '}
          email={row.original.owner?.email || row.original?.owner?.email || ' '}
        />
      ),

      enableSorting: false,
      size: 130,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'assetsCount',
      accessorFn: (row) => row.assessmentTitle,
      header: ({ column }) => (
        <DataGridColumnHeader title="Assets" column={column} />
      ),

      cell: ({ row }) => (
        <div
          data-testid="assessment-badge"
          className="flex items-center gap-1.5"
        >
          {row?.original?.assetsCount}
        </div>
      ),

      enableSorting: true,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'riskScore',
      accessorFn: (row) => row.riskScore,
      header: ({ column }) => (
        <DataGridColumnHeader title="Criticality" column={column} />
      ),

      cell: ({ row }) => {
        const { label } = getRiskInfo(row?.original?.riskScore);
        return (
          <Badge variant="secondary" appearance="outline">
            {label}
          </Badge>
        );
      },

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'SecurityPosture',
      accessorFn: (row) => row.assessmentTitle,
      header: ({ column }) => (
        <DataGridColumnHeader title="Open Vulnerabilities" column={column} />
      ),

      cell: ({ row }) => {
        const items = [
          { number: row?.original?.risk?.critical, label: 'C' },
          { number: row?.original?.risk?.high, label: 'H' },
          { number: row?.original?.risk?.medium, label: 'M' },
          { number: row?.original?.risk?.low, label: 'L' },
        ].filter(item => Number(item.number) > 0);

        return (
          <div
            data-testid="assessment-badge"
            className="flex items-center gap-1.5"
          >
            {items.length > 0 ? (
              <VulnerabilityLables items={items} />
            ) : (
              <span className="text-muted-foreground">No Vulnerabilities Found</span>
            )}
          </div>
        );
      },

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'LastUpdated',
      accessorFn: (row) => row.updatedAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Last Updated" column={column} />
      ),

      cell: ({ row }) => (
        <div className=" flex flex-col">
          <DateFormatter date={row?.original?.updatedAt} />{' '}
        </div>
      ),

      enableSorting: true,
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

function BusinessUnitsTable({ data, isLoading }) {
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);

  const columns = useMemo(() => getColumns(), []);

  return (
    <Table
      data={data?.businessUnits || data}
      columns={columns}
      enableSorting={true}
      isLoading={isLoading}
      totalPages={data?.totalPages}
      totalCount={data?.totalItems}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      search={searchQuery}
      setSearch={setSearchQuery}
    />
  );
}

export default BusinessUnitsTable;
