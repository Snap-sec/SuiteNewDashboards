import { useCallback, useEffect, useMemo, useState } from 'react';
import { Ban, Check, Cpu, Loader2, TableOfContents } from 'lucide-react';
// import ImportThreatsCSVModel from '../import-threats-csv-models';
import { Link, useParams } from 'react-router-dom';
import {
  useGetApisecProjectRulesQuery,
  useGetApisecProjectScannersQuery,
  useUpdateApisecProjectRulesMutation,
  useUpdateApisecProjectScannerMutation,
} from '@/services/apisec/projectsApi';
import { useGetProjectStatsQuery } from '@/services/tm/projectApi';
import ApiErrorHandler from '@/components/common/api-error-handler';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch, SwitchWrapper } from '@/components/ui/switch';
import { EmptyScreen } from '@/components/common/empty-screen';
import FloatingCard from '@/components/custom/floating-card';
import { Modal } from '@/components/custom/modal';
import SeverityLabel from '@/components/custom/severity-label';
import Table from '@/components/custom/table';
import YamlEditor from '@/components/custom/yaml-editor/yaml-editor';
import TableToolbarFilters from '../../../../../components/common/table-toolbar-filters';
import RuleToggleSwitch from '../actions/rule-toggle-switch';

function Rules() {
  const { id } = useParams();

  // View Rule Modal State
  const [selectedRuleToView, setSelectedRuleToView] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewRule = useCallback((rule) => {
    setSelectedRuleToView(rule);
    setIsViewModalOpen(true);
  }, []);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [scannerRowSelection, setScannerRowSelection] = useState({});

  // Reset pagination whenever search or filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [search, filters]);

  const selectedRulesCount = useMemo(() => {
    return Object.keys(rowSelection).filter((key) => rowSelection[key]).length;
  }, [rowSelection]);

  const selectedScannersCount = useMemo(() => {
    return Object.keys(scannerRowSelection).filter(
      (key) => scannerRowSelection[key],
    ).length;
  }, [scannerRowSelection]);

  console.log(filters);

  const { data, isLoading, isFetching, error, isError } = useGetApisecProjectRulesQuery({
    projectId: id,
    search,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });


  // Mutation to update project rules
  const [updateApisecProjectRules, { isLoading: isUpdating }] =
    useUpdateApisecProjectRulesMutation();

  const { data: scannersData, isLoading: scannersLoading } =
    useGetApisecProjectScannersQuery({ projectId: id });
  const [updateScanner, { isLoading: isUpdatingScanner }] =
    useUpdateApisecProjectScannerMutation();
  const [togglingScannerId, setTogglingScannerId] = useState(null);

  const handleToggleScanner = useCallback(
    async (scannerId, currentStatus) => {
      setTogglingScannerId(scannerId);
      try {
        await updateScanner({
          projectId: id,
          payload: {
            scannerId,
            isEnabled: !currentStatus,
          },
        }).unwrap();
      } catch (err) {
        console.error('Failed to update scanner:', err);
      } finally {
        setTogglingScannerId(null);
      }
    },
    [id, updateScanner],
  );

  const [isBulkUpdatingRules, setIsBulkUpdatingRules] = useState(false);
  const handleBulkUpdateRules = async (enable, markFP = false) => {
    const selectedKeys = Object.keys(rowSelection);
    if (!selectedKeys.length) return;
    setIsBulkUpdatingRules(true);
    try {
      await updateApisecProjectRules({
        projectId: id,
        payload: {
          ruleIds: selectedKeys,
          isActive: enable,
          ...(markFP ? { markAsFalsePositive: true } : {}),
        },
      }).unwrap();
      setRowSelection({});
    } catch (err) {
      console.error('Failed to update rules in bulk:', err);
    } finally {
      setIsBulkUpdatingRules(false);
    }
  };

  const [isBulkUpdatingScanners, setIsBulkUpdatingScanners] = useState(false);
  const handleBulkUpdateScanners = async (enable) => {
    const selectedKeys = Object.keys(scannerRowSelection);
    if (!selectedKeys.length) return;
    setIsBulkUpdatingScanners(true);
    try {
      await updateScanner({
        projectId: id,
        payload: {
          scannerIds: selectedKeys,
          isEnabled: enable,
        },
      }).unwrap();
      setScannerRowSelection({});
    } catch (err) {
      console.error('Failed to update scanners in bulk:', err);
    } finally {
      setIsBulkUpdatingScanners(false);
    }
  };

  // Local state to track per-row active state and a loading indicator for a row being updated
  const [activeMap, setActiveMap] = useState({});
  const [loadingRowId, setLoadingRowId] = useState(null);

  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [markFalsePositive, setMarkFalsePositive] = useState(false);

  const confirmBulkDisable = () => {
    handleBulkUpdateRules(false, markFalsePositive);
    setShowDisableDialog(false);
    setMarkFalsePositive(false);
  };

  // Initialize local activeMap when data loads
  useEffect(() => {
    const map = {};
    (data?.data?.availableRules || []).forEach((r) => {
      const rid = r?.id ?? r?._id ?? r?.ruleId ?? r?.rule_id;
      if (rid !== undefined) map[rid] = !!r?.isInProject;
    });
    setActiveMap(map);
  }, [data]);

  // Helper to extract rule id from a row
  const getRuleId = (row) =>
    row?.original?.id ??
    row?.original?._id ??
    row?.original?.ruleId ??
    row?.original?.rule_id;

  // Define columns here so they can use handlers / local state
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },
      // Title column
      {
        id: 'Title',
        header: ({ column }) => (
          <DataGridColumnHeader title="Title" column={column} />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex flex-col max-w-[350px]">
              <p
                className="leading-none font-medium text-sm text-mono hover:text-primary truncate cursor-pointer hover:underline"
                title={row?.original?.rule_name}
                onClick={() => handleViewRule(row?.original)}
              >
                {row?.original?.rule_name}
              </p>
              <p
                className="text-[12px] text-muted-foreground truncate mt-1.5"
                title={row?.original?.parsed_yaml?.report?.description}
              >
                {row?.original?.parsed_yaml?.report?.description ||
                  'No description available'}
              </p>
            </div>
          );
        },
        size: 200,
        meta: {
          cellClassName: 'w-full',
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'category',
        header: ({ column }) => (
          <DataGridColumnHeader title="Category" column={column} />
        ),
        cell: ({ row }) => {
          return (
            <Badge
              variant="secondary"
              className="capitalize font-normal text-[11px] whitespace-nowrap"
            >
              {row?.original?.category?.replace(/_/g, ' ') || 'Uncategorized'}
            </Badge>
          );
        },
        size: 150,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },

      // Vulnerability Count Column
      {
        id: 'vulnerabilityCount',
        accessorFn: (row) => row.vulnerabilityCount,
        header: ({ column }) => (
          <DataGridColumnHeader title="Vulnerabilities" column={column} />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-start">
              {row?.original?.vulnerability_count ? (
                <Link
                  to={`/was/projects/${id}?ruleId=${row?.original?._id}&tab=Vulnerabilities`}
                  className="text-sm font-medium text-primary underline"
                >
                  {row?.original?.vulnerability_count || 0} Vulns
                </Link>
              ) : (
                <span className="text-sm font-medium">
                  {row?.original?.vulnerability_count || 0} Vulns
                </span>
              )}
            </div>
          );
        },
        size: 120, // Adjusted size

        sortable: true,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },

      // CWE Column
      {
        id: 'cwe',
        header: ({ column }) => (
          <DataGridColumnHeader title="CWE" column={column} />
        ),
        cell: ({ row }) => {
          return (
            <p
              className="text-sm font-medium text-muted-foreground truncate whitespace-nowrap"
              title={row?.original?.parsed_yaml?.report?.cwe || 'N/A'}
            >
              {row?.original?.parsed_yaml?.report?.cwe || 'N/A'}
            </p>
          );
        },
        size: 100,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },

      // Is Active badge
      {
        id: 'isInProjectBadge',
        accessorFn: (row) => row.isInProject,
        header: ({ column }) => (
          <DataGridColumnHeader title="State" column={column} />
        ),
        cell: ({ row }) => {
          const ruleId = getRuleId(row);
          const isInProject = activeMap[ruleId] ?? row?.original?.isInProject;
          return (
            <Badge
              variant={isInProject ? 'success' : 'destructive'}
              appearance="outline"
            >
              {isInProject ? 'Active' : 'Inactive'}
            </Badge>
          );
        },
        sortable: false,
        enableSorting: false,
        size: 100,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },

      {
        id: 'severity',
        accessorKey: 'severity', // Use simplified accessor
        header: ({ column }) => (
          <DataGridColumnHeader title="Severity" column={column} />
        ),
        cell: ({ row }) => {
          return row?.original?.report ? (
            <SeverityLabel severity={row?.original?.report?.severity} />
          ) : (
            <SeverityLabel
              severity={row?.original?.parsed_yaml?.report?.severity}
            />
          );
        },
        sortable: false,
        enableSorting: false,
        size: 100,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },

      // Action switch
      {
        id: 'action',
        header: ({ column }) => (
          <DataGridColumnHeader title="Enable/Disable" column={column} />
        ),
        cell: ({ row }) => {
          const ruleId =
            row?.original?.id ??
            row?.original?._id ??
            row?.original?.ruleId ??
            row?.original?.rule_id;

          return (
            <RuleToggleSwitch
              ruleId={ruleId}
              initialChecked={activeMap[ruleId] ?? row?.original?.isInProject}
              projectId={id}
              updateRule={updateApisecProjectRules}
              disabled={isUpdating}
              setActiveMap={setActiveMap}
              setLoadingRowId={setLoadingRowId}
            />
          );
        },
        size: 50,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
    ],
    [activeMap, isUpdating, id, handleViewRule],
  );

  const scannerColumns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all scanners"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select scanner"
            className="translate-y-[2px]"
          />
        ),
        size: 20,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title="Scanner Name" column={column} />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex flex-col max-w-[350px]">
              <p
                className="leading-none font-medium text-sm hover:text-primary truncate"
                title={row?.original?.name}
              >
                {row?.original?.name}
              </p>
              <p
                className="text-[12px] text-muted-foreground truncate mt-1.5"
                title={row?.original?.description}
              >
                {row?.original?.description || 'No description available'}
              </p>
            </div>
          );
        },
        size: 200,
        meta: {
          cellClassName: 'w-full',
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'vulnerabilityCount',
        header: ({ column }) => (
          <DataGridColumnHeader title="Vulnerabilities" column={column} />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-start">
              {row?.original?.vulnerability_count ? (
                <Link
                  to={`/was/projects/${id}?scannerId=${row?.original?.id}&tab=Vulnerabilities`}
                  className="text-sm font-medium text-primary underline"
                >
                  {row?.original?.vulnerability_count || 0} Vulns
                </Link>
              ) : (
                <span className="text-sm font-medium">
                  {row?.original?.vulnerability_count || 0} Vulns
                </span>
              )}
            </div>
          );
        },
        size: 40,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'isEnabledBadge',
        accessorFn: (row) => row.isEnabled,
        header: ({ column }) => (
          <DataGridColumnHeader title="State" column={column} />
        ),
        cell: ({ row }) => {
          const isEnabled = row?.original?.isEnabled;
          return (
            <Badge
              variant={isEnabled ? 'success' : 'destructive'}
              appearance="outline"
            >
              {isEnabled ? 'Active' : 'Inactive'}
            </Badge>
          );
        },
        size: 40,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'action',
        header: ({ column }) => (
          <DataGridColumnHeader title="Enable/Disable" column={column} />
        ),
        cell: ({ row }) => {
          const scanner = row?.original;
          const isToggling = togglingScannerId === scanner.id;
          return (
            <SwitchWrapper>
              <Switch
                checked={!!scanner.isEnabled}
                onCheckedChange={() =>
                  handleToggleScanner(scanner.id, scanner.isEnabled)
                }
                size="sm"
                disabled={isToggling || isUpdatingScanner}
              />
            </SwitchWrapper>
          );
        },
        size: 30,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
    ],
    [togglingScannerId, isUpdatingScanner, handleToggleScanner],
  );

  const { data: StatusData, isLoading: StatusLoading } =
    useGetProjectStatsQuery(id);

  // Check if there are any active filters or search terms
  const hasActiveFiltersOrSearch =
    search.trim() !== '' || Object.keys(filters).length > 0;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Scanner Engines Card */}
      <Card>
        <CardHeader className="border-b border-border/60">
          <div className="flex items-center gap-2">
            <div>
              <CardTitle>Scanner Engines</CardTitle>

            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
            <Table
              grid
              data={(scannersData?.data?.scanners || []).map(s => ({ ...s, _id: s.id }))}
              columns={scannerColumns}
              isLoading={scannersLoading}
              enableSearch={false}
              showPagination={false}
              cardHeading={false}
              manualPagination={false}
              manualSorting={false}
            />
        </CardContent>
      </Card>

      {/* Rules Card */}
      <Card>
        <CardHeader className="border-b border-border/60">
          <div className="flex items-center gap-2">
            <div>
              <CardTitle>Scan Rules</CardTitle>

            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {data?.total === 0 && !hasActiveFiltersOrSearch && !isLoading ? (
            <EmptyScreen
              title="No Threats Found"
              subTitle="There are no threats found in this project!"
              engage={
                <div className="flex items-center gap-4">
                  {/* <ImportThreatsCSVModel showText={true} /> */}
                  {/* <ManualImportThreatModel showText={true} /> */}
                </div>
              }
              showTitle={false}
            />
          ) : (
            <Table
              grid
              data={data?.data?.availableRules || []} // Add fallback to prevent undefined errors
              columns={columns}
              search={search}
              setSearch={setSearch}
              pagination={pagination}
              setPagination={setPagination}
              totalCount={data?.data?.stats?.totalRules || 0}
              totalPages={Math.ceil((data?.data?.stats?.totalRules || 0) / pagination.pageSize)}
              sorting={sorting}
              setSorting={setSorting}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              isLoading={isLoading || isFetching}
              enableSearch={true}
              enableSorting={true}
              manualPagination={true}
              manualSorting={true}
              showPagination={true}
              toolbar={
                <TableToolbarFilters
                  supportedFilters={data?.advanced_filters}
                  filters={filters}
                  setFilters={setFilters}
                  isLoadingFilters={isLoading}
                />
              }
            />
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable Rules</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to disable the selected rules.
              <div className="flex items-center gap-2 mt-4">
                <Checkbox
                  id="bulk-mark-fp"
                  checked={markFalsePositive}
                  onCheckedChange={(v) => setMarkFalsePositive(!!v)}
                />
                <label
                  htmlFor="bulk-mark-fp"
                  className="text-sm cursor-pointer"
                >
                  Mark related vulns as false positives
                </label>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkUpdatingRules}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isBulkUpdatingRules}
              onClick={confirmBulkDisable}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Modal
        open={isViewModalOpen}
        setOpen={setIsViewModalOpen}
        title={
          selectedRuleToView
            ? `Rule: ${selectedRuleToView.rule_name}`
            : 'View Rule'
        }
        className="w-full max-w-[900px]"
      >
        {isViewModalOpen && selectedRuleToView && (
          <div className="py-4">
            <YamlEditor
              yaml={selectedRuleToView.raw_yaml || ''}
              height="65vh"
              readOnly={true}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Rules;
