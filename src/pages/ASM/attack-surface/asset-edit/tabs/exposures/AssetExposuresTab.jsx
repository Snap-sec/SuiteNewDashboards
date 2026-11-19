import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Eye,
  Layers,
  Search,
  Server,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import useDebounce from '@/hooks/use-debounce';
import { useGetAsmAssetExposuresQuery } from '@/services/asm/attackSurfaceApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '@/components/common/empty-screen';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Modal } from '@/components/custom/modal';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';

function ExposureDetailsModal({ exposure, open, setOpen }) {
  if (!exposure) return null;

  const associated = exposure.associatedAsset || {};
  const timeline = Array.isArray(exposure.timeline) ? exposure.timeline : [];
  const scanIds = Array.isArray(exposure.scanIds) ? exposure.scanIds : [];

  return (
    <Modal
      title="Exposure Details"
      open={open}
      setOpen={setOpen}
      className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-5 text-sm">
        {/* Header badges and title */}
        <div className="flex flex-col gap-2 border-b pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {exposure.severity && (
              <SeverityLabel severity={exposure.severity} />
            )}
            {exposure.state && <StateLabels state={exposure.state} />}
            {exposure.falsePositive && (
              <Badge variant="destructive" appearance="outline">
                False Positive
              </Badge>
            )}
            {(exposure.generated_by_automation_workflow ||
              exposure.marked_by === 'rule') && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Sparkles className="size-3 text-primary" />
                Automation Rule
              </Badge>
            )}
          </div>

          <h2 className="text-lg font-semibold text-foreground tracking-tight mt-1">
            {exposure.title || exposure.reason || 'Asset Exposure'}
          </h2>
        </div>

        {/* Associated Asset */}
        <div className="bg-muted/40 p-3.5 rounded-lg border flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Server className="size-3.5" />
            <span>Associated Asset</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            {associated.type && (
              <Badge
                variant="secondary"
                appearance="outline"
                className="capitalize text-xs"
              >
                {associated.type.replace('_', ' ')}
              </Badge>
            )}
            <span className="font-mono text-sm font-medium text-foreground">
              {associated.value || associated.subdomain || '-'}
            </span>
          </div>
        </div>

        {/* Reason / Description */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Reason & Description
          </p>
          <div className="p-3.5 rounded-lg bg-card border text-sm text-foreground/90 leading-relaxed">
            {exposure.reason ||
              exposure.description ||
              'No detailed description available.'}
          </div>
        </div>

        {/* Timeline / Detection Events */}
        {timeline.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="size-3.5" />
              <span>Detection Timeline</span>
            </div>
            <div className="flex flex-col gap-2">
              {timeline.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1 p-3 rounded-lg border bg-secondary/30 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">
                      {item.title || 'Event'}
                    </span>
                    {item.date && (
                      <DateFormatter
                        date={item.date}
                        mode="formatted"
                        className="text-muted-foreground"
                      />
                    )}
                  </div>
                  {item.description && (
                    <p className="text-muted-foreground">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scans info */}
        {scanIds.length > 0 && (
          <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Layers className="size-3.5" />
              <span>Associated Scans</span>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {scanIds.length} {scanIds.length === 1 ? 'Scan' : 'Scans'}
            </Badge>
          </div>
        )}

        {/* Metadata timestamps */}
        <div className="grid grid-cols-2 gap-3 border-t pt-3 text-xs text-muted-foreground">
          <div>
            <span className="block font-medium text-foreground/80 mb-0.5">
              First Detected
            </span>
            <DateFormatter date={exposure.createdAt} mode="formatted" />
          </div>
          <div>
            <span className="block font-medium text-foreground/80 mb-0.5">
              Last Updated
            </span>
            <DateFormatter date={exposure.updatedAt} mode="formatted" />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function AssetExposuresTab() {
  const params = useParams();
  const actualId = params.assetId || params.id;

  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [selectedExposure, setSelectedExposure] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch]);

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAsmAssetExposuresQuery(
    {
      assetId: actualId,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: debouncedSearch || undefined,
    },
    { skip: !actualId },
  );

  const exposuresList = useMemo(() => {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.exposures)) return response.exposures;
    if (Array.isArray(response)) return response;
    return [];
  }, [response]);

  // Client-side search fallback to ensure responsive searching even if backend doesn't filter query
  const filteredExposures = useMemo(() => {
    if (!debouncedSearch) return exposuresList;
    const q = debouncedSearch.toLowerCase().trim();
    return exposuresList.filter((exp) => {
      return (
        exp.title?.toLowerCase().includes(q) ||
        exp.reason?.toLowerCase().includes(q) ||
        exp.description?.toLowerCase().includes(q) ||
        exp.severity?.toLowerCase().includes(q) ||
        exp.state?.toLowerCase().includes(q) ||
        exp.associatedAsset?.value?.toLowerCase().includes(q) ||
        exp.associatedAsset?.subdomain?.toLowerCase().includes(q) ||
        exp.associatedAsset?.type?.toLowerCase().includes(q) ||
        exp.marked_by?.toLowerCase().includes(q)
      );
    });
  }, [exposuresList, debouncedSearch]);

  const totalCount =
    response?.total ?? response?.totalCount ?? exposuresList.length;
  const totalPages =
    response?.pages ??
    response?.totalPages ??
    Math.max(1, Math.ceil(totalCount / (pagination.pageSize || 10)));

  const columns = useMemo(
    () => [
      {
        id: 'title',
        accessorFn: (row) => row.title || row.reason,
        header: ({ column }) => (
          <DataGridColumnHeader title="Exposure" column={column} />
        ),
        cell: ({ row }) => {
          const title =
            row.original?.title || row.original?.reason || 'Exposure';
          const description = row.original?.description || row.original?.reason;

          return (
            <div className="flex flex-col gap-0.5 max-w-[420px]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedExposure(row.original);
                  setModalOpen(true);
                }}
                className="font-medium text-sm truncate hover:text-primary cursor-pointer transition-colors text-left"
                title={title}
              >
                {title}
              </button>
              {description && (
                <p
                  className="text-xs text-muted-foreground truncate"
                  title={description}
                >
                  {description}
                </p>
              )}
            </div>
          );
        },
        size: 320,
        meta: {
          skeleton: <Skeleton className="h-7 w-52" />,
        },
      },
      {
        id: 'associatedAsset',
        accessorFn: (row) =>
          row.associatedAsset?.value || row.associatedAsset?.subdomain,
        header: ({ column }) => (
          <DataGridColumnHeader title="Associated Asset" column={column} />
        ),
        cell: ({ row }) => {
          const asset = row.original?.associatedAsset;
          const value = asset?.value || asset?.subdomain || '-';
          const type = asset?.type;

          return (
            <div className="flex items-center gap-1.5 flex-wrap">
              {type && (
                <Badge
                  variant="secondary"
                  appearance="outline"
                  className="capitalize text-xs shrink-0"
                >
                  {type.replace('_', ' ')}
                </Badge>
              )}
              <span
                className="text-xs font-mono truncate max-w-[180px]"
                title={value}
              >
                {value}
              </span>
            </div>
          );
        },
        size: 200,
        meta: {
          skeleton: <Skeleton className="h-7 w-36" />,
        },
      },
      {
        id: 'severity',
        accessorFn: (row) => row.severity,
        header: ({ column }) => (
          <DataGridColumnHeader title="Severity" column={column} />
        ),
        cell: ({ row }) => (
          <SeverityLabel severity={row.original?.severity || 'info'} />
        ),
        size: 110,
        meta: {
          skeleton: <Skeleton className="h-7 w-16" />,
        },
      },
      {
        id: 'state',
        accessorFn: (row) => row.state,
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: ({ row }) => (
          <StateLabels state={row.original?.state || 'In Review'} />
        ),
        size: 130,
        meta: {
          skeleton: <Skeleton className="h-7 w-20" />,
        },
      },
      {
        id: 'marked_by',
        accessorFn: (row) => row.marked_by,
        header: ({ column }) => (
          <DataGridColumnHeader title="Origin" column={column} />
        ),
        cell: ({ row }) => {
          const isAuto =
            row.original?.generated_by_automation_workflow ||
            row.original?.marked_by === 'rule';
          const isFP = row.original?.falsePositive;

          return (
            <div className="flex items-center gap-1 flex-wrap">
              <Badge variant="outline" className="capitalize text-xs">
                {isAuto ? 'Automation Rule' : row.original?.marked_by || 'Rule'}
              </Badge>
              {isFP && (
                <Badge
                  variant="destructive"
                  appearance="outline"
                  className="text-xs"
                >
                  FP
                </Badge>
              )}
            </div>
          );
        },
        size: 140,
        meta: {
          skeleton: <Skeleton className="h-7 w-24" />,
        },
      },
      {
        id: 'createdAt',
        accessorFn: (row) => row.createdAt,
        header: ({ column }) => (
          <DataGridColumnHeader title="Detected" column={column} />
        ),
        cell: ({ row }) => (
          <DateFormatter
            date={row.original?.createdAt}
            mode="relative"
            className="text-xs text-muted-foreground"
          />
        ),
        size: 120,
        meta: {
          skeleton: <Skeleton className="h-7 w-20" />,
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right w-full">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end w-full">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedExposure(row.original);
                setModalOpen(true);
              }}
              title="View Details"
            >
              <Eye className="size-4" />
            </Button>
          </div>
        ),
        size: 80,
        meta: {
          cellClassName: 'text-right',
          skeleton: <Skeleton className="h-7 w-8 ml-auto" />,
        },
      },
    ],
    [],
  );

  if (isError && !isLoading && !isFetching) {
    return <ApiErrorHandler error={error} />;
  }

  if (
    !isLoading &&
    !isFetching &&
    exposuresList.length === 0 &&
    !debouncedSearch
  ) {
    return (
      <div className="py-6">
        <EmptyScreen
          title="No Exposures Found"
          subTitle="There are currently no active exposures affecting this asset."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table
        data={filteredExposures}
        columns={columns}
        isLoading={isLoading || isFetching}
        search={searchQuery}
        setSearch={setSearchQuery}
        searchPlaceholder="Search exposures..."
        pagination={pagination}
        setPagination={setPagination}
        totalCount={totalCount}
        totalPages={totalPages}
        manualPagination={true}
        manualSorting={false}
        enableSearch={true}
        showPagination={true}
        cardHeading={true}
        newSearchInput={
          <div className="relative w-72">
            <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search exposures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9 pe-8 h-9 text-xs"
            />
            {searchQuery.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute end-1 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery('')}
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>
        }
        onRowClick={(row) => {
          setSelectedExposure(row.original);
          setModalOpen(true);
        }}
      />

      <ExposureDetailsModal
        exposure={selectedExposure}
        open={modalOpen}
        setOpen={setModalOpen}
      />
    </div>
  );
}

export default AssetExposuresTab;
