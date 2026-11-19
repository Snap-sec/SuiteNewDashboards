import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { skipToken } from '@reduxjs/toolkit/query/react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format, formatDistanceToNow } from 'date-fns';
import {
  CircleCheckBig,
  MoreHorizontal,
  Search,
  Settings2,
  ShieldCheck,
  ShieldX,
  TriangleAlert,
  X,
} from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { useSetAsmExposureMutation } from '@/services/asm/attackSurfaceApi';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid, useDataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DateFormatter } from '@/components/custom/date-formatter';
import Select from '@/components/custom/select';
import { CustomTooltip } from '@/components/custom/tooltip';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import { Badge } from '../../../../../components/ui/badge';
import { Skeleton } from '../../../../../components/ui/skeleton';
import { useGetAsmExposureReasonsQuery } from '../../../../../services/asm/exposureApi';

const Table = ({
  data = [],
  columns = [],
  onRowClick,
  search,
  searchPlaceholder = 'Search ....',
  setSearch,
  pagination,
  totalCount = 0,
  totalPages = 1,
  sorting,
  setPagination,
  setSorting,
  toolbar,
  toolbar_right,
  isLoading,
  enableSorting = false,
  manualSorting = true,
  manualPagination = true,
  enableSearch = true,
  grid = false,
  assetType,
  hideExposures,
}) => {
  const location = useLocation();
  const isTechnologies2 =
    hideExposures ||
    location?.pathname?.includes('technologies2') ||
    location?.pathname === '/casm/assets/technologies2';

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'safe' or 'risk'
  const [modalRow, setModalRow] = useState(null);

  const exposureSchema = useMemo(() => {
    return z.object({
      reason: z
        .string()
        .min(1, 'Reason is required')
        .max(110, 'Reason must be at most 110 characters'),
      severity:
        modalType === 'risk'
          ? z.string().min(1, 'Severity is required')
          : z.string().optional(),
    });
  }, [modalType]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(exposureSchema),
    mode: 'onChange',
    defaultValues: {
      reason: '',
      severity: '',
    },
  });

  const reasonValue = watch('reason');

  const severityOptions = [
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
    { label: 'Info', value: 'info' },
  ];

  const [setExposure, { isLoading: isSubmitting }] = useSetAsmExposureMutation(); // <-- Add this hook

  // Query exposure reasons for the currently selected asset type when modal is open
  const {
    data: exposureReasonsData,
    isLoading: isFetchingExposureReasons,
    error: exposureReasonsError,
  } = useGetAsmExposureReasonsQuery(
    modalOpen && modalRow?.type
      ? { assetType: modalRow.type, status: modalType }
      : skipToken,
  );

  // Log when we trigger the request and when data arrives
  useEffect(() => {
    if (modalOpen && modalRow?.type) {
      console.log('Requesting exposure reasons for assetType:', modalRow.type);
    }
  }, [modalOpen, modalRow?.type]);

  useEffect(() => {
    if (exposureReasonsData) {
      console.log('Exposure reasons data:', exposureReasonsData);
    }
    if (exposureReasonsError) {
      console.error('Error fetching exposure reasons:', exposureReasonsError);
    }
  }, [exposureReasonsData, exposureReasonsError]);

  // Update handlers to open modal
  const handleSafe = (row) => {
    setModalType('safe');
    setModalRow(row);
    reset({
      reason: '',
      severity: '',
    });
    setModalOpen(true);
  };

  const handleExposed = (row) => {
    setModalType('risk');
    setModalRow(row);
    reset({
      reason: '',
      severity: '',
    });
    setModalOpen(true);
  };

  // Submit handler using mutation
  const onSubmit = async (values) => {
    if (!modalRow?._id) return;

    toast.promise(
      setExposure({
        assetType: modalRow.type,
        assetId: modalRow._id,
        risk: modalType === 'safe' ? 'none' : values.severity,
        reason: values.reason,
      }).unwrap(),
      {
        loading: `Updating asset ${modalType === 'safe' ? 'Safe' : 'Risk'} phase`,
        success: () => {
          setModalOpen(false);
          return `Asset updated successfully`;
        },
        error: `Error updating Asset`,
      },
    );
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    reset();
  };

  // Inject Action column at the end
  const columnsWithAction = [
    ...columns,
    {
      id: 'createdAt',
      accessorFn: (row) => row.detectedOn,
      header: ({ column }) => (
        <DataGridColumnHeader title="Detected On" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original?.createdAt
            ? formatDistanceToNow(new Date(row.original.createdAt), {
              addSuffix: true,
            })
            : 'Unknown Date'}
          {/* <span className="text-xs text-muted-foreground">
            {row.original?.createdAt
              ? <DateFormatter date={row.original.createdAt} /> ||
              'Unknown Date'
              : ''}
          </span> */}
        </div>
      ),

      enableSorting: true,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    // {
    //   id: 'total_signals',
    //   accessorFn: (row) => row.total_signals,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="Signalssssssssss" column={column} />
    //   ),

    //   cell: ({ row }) => {
    //     const risk = row.original?.risk;
    //     const count = row.original?.total_signals || 0;
    //     const isNone = !risk || risk === 'none';
    //     return (
    //       <CustomTooltip text={`${count} Active Signals - ${risk} Risk`}>
    //         <Badge
    //           // className="m-0.5 h-fit"
    //           variant="default"
    //           appearance="outline"
    //         >
    //           {count} Signals
    //         </Badge>
    //       </CustomTooltip>
    //     );
    //   },

    //   enableSorting: true,
    //   size: 100,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="h-7" />,
    //   },
    // },
    ...(!isTechnologies2
      ? [
          {
            id: 'total_signals',
            accessorFn: (row) => row.total_exposures,
            header: ({ column }) => (
              <DataGridColumnHeader title="Total Exposures" column={column} />
            ),

            cell: ({ row }) => {
              const signalsCount = row.original?.total_exposures || 0;
              if (signalsCount === 0) {
                return <span className="text-muted-foreground ml-10">-</span>;
              }
              return (
                <CustomTooltip text={`${signalsCount} Exposures`}>
                  <Badge variant="default" appearance="outline">
                    {signalsCount} Exposures
                  </Badge>
                </CustomTooltip>
              );
            },

            enableSorting: true,
            size: 80,
            meta: {
              cellClassName: '',
              skeleton: <Skeleton className="h-7" />,
            },
          },
        ]
      : []),
    // {
    //   id: 'action',
    //   header: ({ column }) => <DataGridColumnHeader title="" column={column} />,
    //   cell: ({ row }) => (
    //     <AuthorityGuard forbidRoles={['Auditor']}>
    //     </AuthorityGuard>
    //   ),
    //   enableSorting: false,
    //   size: 50,
    //   enableHiding: false,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="h-7" />,
    //   },
    // },
  ];

  const table = useReactTable({
    columns: columnsWithAction,
    data: data || [],
    pageCount: totalPages,
    getRowId: (row) => row._id,
    state: {
      ...(manualPagination && {
        pagination: pagination || {},
      }),
      ...(manualSorting && {
        sorting: sorting || {},
      }),
    },
    manualPagination: manualPagination,
    manualSorting: manualSorting,
    enableSorting: enableSorting,
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
    <>
      <DataGrid
        table={table}
        recordCount={totalCount}
        isLoading={isLoading}
        tableLayout={{
          columnsPinnable: true,
          columnsMovable: true,
          columnsVisibility: true,
          cellBorder: grid,
        }}
        tableClassNames={{
          bodyRow: 'group',
        }}
        onRowClick={onRowClick}
      >
        <Card>
          <CardHeader>
            <CardHeading>
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  {enableSearch && (
                    <>
                      <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                      <Input
                        placeholder={searchPlaceholder || 'Search Vulns...'}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="ps-9 w-40"
                      />
                    </>
                  )}

                  {search?.length > 0 && (
                    <Button
                      mode="icon"
                      variant="ghost"
                      className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => setSearch('')}
                    >
                      <X />
                    </Button>
                  )}
                </div>

                {toolbar || ''}
              </div>
            </CardHeading>

            <div className="flex items-center gap-3">
              {toolbar_right || ''}
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

      {/* Modal for Safe/Exposed */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl mx-auto p-4 rounded-lg">
          <DialogHeader>
            <DialogTitle>
              {modalType === 'safe' ? 'Mark as Safe' : 'Mark as Exposure'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              *Please provide a brief justification for your Input (optional)
            </p>
          </DialogHeader>
          <div className="flex gap-2 ">
            <div className="h-60 kt-scrollable-x-auto">
              <ul className="list-none flex flex-col gap-2">
                {isFetchingExposureReasons ? (
                  <>
                    <Skeleton className="h-10 w-50" />
                    <Skeleton className="h-10 w-50" />
                    <Skeleton className="h-10 w-50" />
                    <Skeleton className="h-10 w-50" />
                    <Skeleton className="h-10 w-50" />
                    <Skeleton className="h-10 w-50" />
                  </>
                ) : (
                  exposureReasonsData?.data
                    ?.filter(Boolean)
                    ?.map((reason, index) => (
                      <li
                        key={index}
                        className={`text-xs cursor-pointer p-2 rounded-lg border ${reasonValue === reason
                          ? 'bg-accent/20 font-medium text-primary'
                          : 'hover:bg-accent'
                          }`}
                        onClick={() =>
                          setValue('reason', reason, { shouldValidate: true })
                        }
                      >
                        {reason}
                      </li>
                    ))
                )}
              </ul>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <textarea
                className={`w-full border rounded p-2 text-sm ${errors.reason ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                rows={modalType == 'safe' ? 10 : 8}
                placeholder={`Why are you marking this as ${modalType == 'safe' ? 'safe' : 'exposure'}? `}
                {...register('reason')}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center px-1">
                {errors.reason ? (
                  <p className="text-[10px] text-destructive font-medium">
                    {errors.reason.message}
                  </p>
                ) : (
                  <div />
                )}
                <p
                  className={`text-[10px] font-medium ${reasonValue?.length > 110 ? 'text-destructive' : 'text-muted-foreground'}`}
                >
                  {reasonValue?.length || 0}/110
                </p>
              </div>

              {modalType === 'risk' && (
                <div className="flex flex-col gap-1.5 mt-2">
                  <p className="text-xs text-muted-foreground">
                    Select Severity <span className="text-destructive">*</span>
                  </p>
                  <Controller
                    name="severity"
                    control={control}
                    render={({ field }) => (
                      <Select
                        placeholder="Select severity"
                        options={severityOptions}
                        value={field.value}
                        onChange={(val) => field.onChange(val?.value)}
                        error={!!errors.severity}
                      />
                    )}
                  />
                  {errors.severity && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.severity.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleModalCancel}
              disabled={isSubmitting}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !isValid}
              size="sm"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Table;
