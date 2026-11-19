import { useMemo } from 'react';
import ExposureTimelineModel from '@/pages/ASM/exposures/components/modals/exposure-timeline-modal';
import { Link2, Link2 as LinkIcon, RefreshCcw, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { formatDateTime, timeAgo } from '@/lib/helpers';
import { useRaiseAsmExposureMutation } from '@/services/asm/exposureApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import ExpandableText from '@/components/custom/expandable-text';
import SeverityLabel from '@/components/custom/severity-label';
import Table from '@/components/custom/table';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';


const normalizeFieldLabel = (field) => {
  if (!field) return 'Unknown';
  const cleaned = String(field).replace(/^associatedAsset\./, '');
  const lastSegment = cleaned.split('.').filter(Boolean).at(-1) || cleaned;

  let label = String(lastSegment)
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (label === 'Subdomain Status Code') return 'Status Code';
  return label;
};

const getByPath = (obj, path) => {
  if (!obj || !path) return undefined;
  return String(path)
    .split('.')
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
};

const formatCellValue = (value) => {
  if (value === null || typeof value === 'undefined') return 'N/A';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return String(value);
    }
  }
  return String(value);
};

const VMTicketCell = ({ row, activeRule }) => {
  const [raiseExposure, { isLoading: isRaisingExposure }] =
    useRaiseAsmExposureMutation();

  const assetId = row?._id;
  const ruleId = activeRule?._id;
  const isExposed = row?.is_exposed;

  if (row?.is_exposed && row?.sentToVm) {
    return (
      <Badge className="text-[11px] whitespace-nowrap" variant="secondary" appearance="outline">
        <Link
          className="w-full flex gap-2 items-center whitespace-nowrap"
          target="_blank"
          to={`/vm/vulnerability-report?id=${row?.universalVulnId}&assessmentId=${row?.assessmentId}`}
        >
          <LinkIcon size={12} />
          View Ticket
        </Link>
      </Badge>
    );
  }

  if (row?.is_exposed && !row?.sentToVm) {
    return (
      <Badge className="text-[11px] whitespace-nowrap" variant="secondary" appearance="outline">
        <span className="w-full flex gap-2 items-center whitespace-nowrap">
          <ShieldCheck size={12} />
          Exposure Confirmed
        </span>
      </Badge>
    );
  }

  return (
    <AuthorityGuard forbidRoles={['Auditor']}>
      <ButtonWithConfirm
        variant="outline"
        size="sm"
        className="h-7 text-[11px] flex gap-1.5 items-center border-dashed whitespace-nowrap"
        confirm
        disabled={isRaisingExposure}
        onConfirm={() => {
          toast.promise(raiseExposure({ assetId, ruleId }).unwrap(), {
            loading: 'Marking as Exposure...',
            success: 'Marked as Exposure successfully',
            error: 'Failed to mark as Exposure',
          });
        }}
        title="Mark as Exposure"
        dialog="Are you sure you want to mark this as Exposure?"
      >
        {isRaisingExposure ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <ShieldAlert size={12} />
        )}
        Mark as Exposure
      </ButtonWithConfirm>
    </AuthorityGuard>
  );
};

const ExposureTableV2 = ({
  data,
  isLoading,
  isFetching,
  pagination,
  setPagination,
  sorting,
  setSorting,
  rowSelection,
  setRowSelection,
  onEdit,
  onSync,
  onDelete,
  assetSearch,
  setAssetSearch,
  ruleConditions,
  activeRule,
}) => {

  const ruleFields = useMemo(() => {
    if (!Array.isArray(ruleConditions)) return new Set();
    return new Set(
      ruleConditions
        .map((c) => c?.field)
        .filter((f) => typeof f === 'string' && f.trim().length > 0),
    );
  }, [ruleConditions]);

  const hasIpType = useMemo(() => {
    return data?.data?.some((item) => (item?.type === 'ip' || (item?.type == "dns" && ["A", "AAAA"].includes(item?.properties?.dns_class))));
  }, [data?.data]);

  const dynamicFields = useMemo(() => {
    // Additional columns come from the query chip conditions.
    // We still exclude the ones that are already represented by fixed columns.
    return Array.from(ruleFields)
      .filter((field) => field !== 'type' && field !== 'value' && (field !== 'subdomain' || !hasIpType));
  }, [ruleFields, hasIpType]);

  const initialColumnVisibility = useMemo(() => {
    return {
      // asset: !ruleFields.has('value'),
      // type: !ruleFields.has('type'),
    };
  }, [ruleFields]);

  const initialDynamicColumnVisibility = useMemo(() => {
    // Show all columns by default (including dynamically added rule fields).
    return { ...initialColumnVisibility };
  }, [initialColumnVisibility]);

  const tableResetKey = useMemo(() => {
    // Force-mount on rule field changes so new columns are picked up.
    return Array.from(new Set([...ruleFields, ...dynamicFields, hasIpType ? 'subdomain' : ''])).sort().join('|');
  }, [ruleFields, dynamicFields, hasIpType]);

  const columns = useMemo(
    () => [
      {
        id: 'asset',
        accessorFn: (row) => row.value || 'Unknown',
        header: ({ column }) => (
          <DataGridColumnHeader title="Asset" column={column} />
        ),
        cell: ({ row }) => {
          const item = row.original;
          const assetValue = item?.value || 'N/A';
          const typeInfo = GetAssetTypeInfo(item?.type);
          return (
            <div className='flex items-center gap-1'>
              <Badge variant="secondary" appearance="outline">
                {typeInfo.icon}
              </Badge>
              <Link
                to={`/casm/asset-details/${item._id}`}
                className="font-medium text-sm truncate max-w-[400px] hover:text-primary cursor-pointer transition-colors"
              >
                {assetValue}
              </Link>
            </div>
          );
        },
        size: 350,
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      ...((data?.data || []).some((row) => row.type === 'port') ? [{
        id: 'ip',
        accessorFn: (row) => row.ip || 'N/A',
        header: ({ column }) => (
          <DataGridColumnHeader title="Host" column={column} />
        ),
        cell: ({ row }) => {
          return (
            <span className="text-sm text-foreground truncate">
              {row.original?.ip || 'N/A'}
            </span>
          );
        },
        size: 160,
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-5" />,
        },
      }] : []),
      ...(hasIpType ? [{
        id: 'subdomain',
        accessorFn: (row) => row.subdomain || 'N/A',
        header: ({ column }) => (
          <DataGridColumnHeader title="Host" column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground whitespace-nowrap truncate">
            {row.original.subdomain || 'N/A'}
          </div>
        ),
        size: 150,
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-5" />,
        },
      }] : []),

      ...dynamicFields.map((field) => ({
        id: field,
        accessorFn: (row) => {
          const associated = row?.associatedAsset;
          const direct = getByPath(row, field);
          const nested = getByPath(associated, field);
          return typeof direct !== 'undefined' ? direct : nested;
        },
        header: ({ column }) => (
          <DataGridColumnHeader title={normalizeFieldLabel(field)} column={column} />
        ),
        cell: ({ row }) => {
          const associated = row?.original?.associatedAsset;
          const direct = getByPath(row.original, field);
          const nested = getByPath(associated, field);
          const value = typeof direct !== 'undefined' ? direct : nested;
          return (
            <Badge variant="default" appearance="outline" className="capitalize">
              {formatCellValue(value)}
            </Badge>
          );
        },
        size: 160,
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-5" />,
          headerTitle: normalizeFieldLabel(field),
        },
      })),
      {
        id: 'createdAt',
        accessorFn: (row) => row.createdAt || 'Unassigned',
        header: ({ column }) => (
          <DataGridColumnHeader title="Detected At" column={column} />
        ),
        cell: ({ row }) => (
          <div className="text-xs text-muted-foreground whitespace-nowrap" title={formatDateTime(row.original.createdAt)}>
            {timeAgo(row.original.createdAt)}
          </div>
        ),
        size: 140,
        meta: {
          skeleton: <Skeleton className="h-5" />,
        },
      },
      {
        id: 'vm ticket',
        header: ({ column }) => (
          <DataGridColumnHeader title="Action" column={column} />
        ),
        cell: ({ row }) => <VMTicketCell row={row.original} activeRule={activeRule} />,
        size: 140,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      }
    ],
    [onEdit, onSync, onDelete, dynamicFields, hasIpType, data]
  );

  return (
    <Table
      key={tableResetKey}
      loadingMode="skeleton"
      data={data?.data || []}
      columns={columns}
      initialColumnVisibility={initialDynamicColumnVisibility}
      isLoading={isLoading || isFetching}
      search={assetSearch}
      setSearch={setAssetSearch}
      searchPlaceholder="Search exposures..."
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      totalPages={Math.ceil((data?.total || 0) / (pagination?.pageSize || 10)) || 1}
      totalCount={data?.total}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      // toolbar={<TableToolbar supportedFilters={data?.filters} />}
      enableSorting={true}
      cardHeading={true}
      className="border-border/60 shadow-md"
    />
  );
};

export default ExposureTableV2;