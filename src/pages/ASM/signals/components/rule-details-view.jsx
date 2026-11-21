import { useState } from 'react';
import { RefreshCcw, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ExposureTableV2 from './exposure-table-v2';

import useExposureStore from '@/pages/ASM/exposures/store';
import { toast } from 'sonner';
import {
  useSyncAsmVulnsMutation,
  useDeleteAsmExposureMutation,
  useLazyExportAsmExposuresQuery,
} from '@/services/asm/exposureApi';
import useStore2 from '../store';
import { NoSearchResultsFound } from '@/components/common/no-search-found';

export function RuleDetailsView({
  displayRules,
  activeRule,
  setActiveRule,
  exposuresData,
  exposuresLoading,
  exposuresFetching,
  rulesLoading,
}) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const assetSearch = useStore2((state) => state.assetSearch);
  const setAssetSearch = useStore2((state) => state.setAssetSearch);
  const pagination = useExposureStore((state) => state.pagination);
  const setPagination = useExposureStore((state) => state.setPagination);
  const sorting = useExposureStore((state) => state.sorting);
  const setSorting = useExposureStore((state) => state.setSorting);
  const rowSelection = useExposureStore((state) => state.rowSelection);
  const setRowSelection = useExposureStore((state) => state.setRowSelection);
  const setSelectedExposure = useExposureStore((state) => state.setSelectedExposure);
  const setShowEditExposure = useExposureStore((state) => state.setShowEdit);

  // Exposure Mutations
  const [syncVulns] = useSyncAsmVulnsMutation();
  const [deleteExposure] = useDeleteAsmExposureMutation();
  const [triggerExport, { isFetching: isExporting }] = useLazyExportAsmExposuresQuery();

  const handleEditExposure = (exposure) => {
    setSelectedExposure(exposure);
    setShowEditExposure(true);
  };

  const handleSyncExposure = (exposureId) => {
    toast.promise(syncVulns(exposureId).unwrap(), {
      loading: 'Sending to VM...',
      success: 'Sent successfully',
      error: 'Failed to send to VM',
    });
  };

  const handleDeleteExposure = (exposureId) => {
    toast.promise(deleteExposure(exposureId).unwrap(), {
      loading: 'Deleting exposure...',
      success: 'Exposure deleted',
      error: 'Failed to delete exposure',
    });
  };

  const handleExport = async () => {
    if (!activeRule?._id) return;
    try {
      const blob = await triggerExport({ ruleId: activeRule._id, search: assetSearch || undefined }).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeRule.name || 'matched-assets'}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to export assets');
    }
  };

  if (rulesLoading || exposuresLoading || exposuresFetching) {
    return (
      <main className="flex-1 kt-scrollable-x-auto bg-background">
        <div className="p-6">
          {/* Header skeleton */}
          <header className="mb-6">
            <div className="relative pl-3.5 space-y-2">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-muted rounded-full" />
              <Skeleton className="h-7 w-72" />
              <Skeleton className="h-4 w-full max-w-2xl" />
            </div>
          </header>

          <div>
            <ExposureTableV2
              data={exposuresData}
              isLoading={true}
              isFetching={true}
              pagination={pagination}
              setPagination={setPagination}
              sorting={sorting}
              setSorting={setSorting}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onEdit={handleEditExposure}
              onSync={handleSyncExposure}
              onDelete={handleDeleteExposure}
              assetSearch={assetSearch}
              setAssetSearch={setAssetSearch}
              activeRule={activeRule}
              ruleConditions={activeRule?.match?.conditions || []}
            />
          </div>
        </div>
      </main>
    );
  }

  if (!activeRule) {
    return (
      <main className="flex-1 bg-background flex flex-col justify-center items-center h-full">
        <NoSearchResultsFound
          title="No Results Found"
          subTitle="No matching rules found. Try adjusting your search query."
        />
      </main>
    );
  }

  return (
    <main className="flex-1 kt-scrollable-x-auto bg-background">
      <div className="p-6">
        {/* Rule Title & Expandable Description Header */}
        <header className="mb-6">
          <div className="relative pl-3.5">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
            <div className="flex flex-col gap-1.5">
              <h1 className="text-xl font-semibold text-foreground leading-tight tracking-tight">
                {activeRule.name}
              </h1>
              {activeRule.description && (
                <div className="flex items-start gap-2 max-w-4xl text-sm text-muted-foreground">
                  <p
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className={`cursor-pointer leading-relaxed ${
                      !isDescExpanded ? 'line-clamp-1' : ''
                    }`}
                    title={!isDescExpanded ? 'Click to show full description' : 'Click to collapse'}
                  >
                    {activeRule.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="text-xs text-primary font-medium hover:underline shrink-0 pt-0.5 cursor-pointer select-none"
                  >
                    {isDescExpanded ? 'Show less' : 'more'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Table View with Export Button inside the table toolbar */}
        <section>
          <ExposureTableV2
            data={exposuresData}
            isLoading={exposuresLoading}
            isFetching={exposuresFetching}
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onEdit={handleEditExposure}
            onSync={handleSyncExposure}
            onDelete={handleDeleteExposure}
            assetSearch={assetSearch}
            setAssetSearch={setAssetSearch}
            activeRule={activeRule}
            ruleConditions={activeRule?.match?.conditions || []}
            rightToolbar={
              <Button
                appearance="light"
                variant="outline"
                size="sm"
                className="mb-1"
                onClick={handleExport}
                disabled={isExporting || !activeRule?._id}
              >
                {isExporting ? (
                  <>
                    <RefreshCcw className="animate-spin size-3.5 mr-1.5" /> Exporting...
                  </>
                ) : (
                  <>
                    <LogOut className="rotate-270 size-3.5 mr-1.5" /> Export List
                  </>
                )}
              </Button>
            }
          />
        </section>
      </div>
    </main>
  );
}

export default RuleDetailsView;
