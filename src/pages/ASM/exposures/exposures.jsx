import { useEffect } from 'react';
import { Download, RefreshCcw, Upload, Sparkles, Loader2, ScanSearch } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { toast } from 'sonner';
import appConfig from '@/config/appConfig';
import {
  useGetAsmExposuresQuery,
  useSyncAsmVulnsMutation,
  useAnalyzeAsmExposuresMutation,
} from '@/services/asm/exposureApi';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import PageHeading from '@/components/custom/page-heading';
import EditExposure from './components/edit-exposure';
import ExposureList from './components/exposure-list';
import Metrics from './components/metrics';
import useStore from './store';
import useDebounce from '../../../hooks/use-debounce';
import AuthorityGuard from '../../../components/custom/authority-guard/AuthorityGuard';
import ApiErrorHandler from '../../../components/common/api-error-handler';



function Exposures() {
  const [syncVulns, { isLoading: isSyncingVulns }] = useSyncAsmVulnsMutation();
  const [analyzeExposures, { isLoading: isAnalyzing }] = useAnalyzeAsmExposuresMutation();
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const search = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);

  const debouncedSearch = useDebounce(search, 400)

  const {
    data: exposures,
    isLoading: exposuresLoading,
    isFetching,
    refetch,
    isError,
    error
  } = useGetAsmExposuresQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    search: debouncedSearch,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sortOrder: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: 10 }));
    refetch();
  }, [filters, debouncedSearch]);

  const isAiAnalysisRunning = exposures?.ai_analysis === 'running' || exposures?.ai_analysis === 'pending';
  const shouldDisableAiBtn = isAnalyzing || isAiAnalysisRunning;

  const handleAnalyze = () => {
    toast.promise(analyzeExposures().unwrap(), {
      loading: 'Analyzing exposures with AI...',
      success: 'Analysis triggered successfully',
      error: (error) => {
        return error?.data?.message || 'Failed to trigger AI analysis';
      },
    });
  };

  if (
    !isError &&
    !exposuresLoading &&
    !exposures?.total &&
    !debouncedSearch &&
    !Object.keys(filters).length &&
    !sorting?.length
  )
    return (
      <EmptyScreen
        title="No Exposures Found"
        subTitle="There are no exposures to show."
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <div className="flex items-center gap-2">
              <Link to="/casm/scans">
                <Button variant="primary"><ScanSearch /> Start a Scan</Button>
              </Link>
              <ButtonWithConfirm
                disabled={shouldDisableAiBtn}
                variant="outline"
                confirm={true}
                confirmVariant="info"
                dialog={
                  <p className="text-center">This action will analyze the current exposures using AI.</p>
                }
                onConfirm={() => (shouldDisableAiBtn ? null : handleAnalyze())}
                confirmButton={
                  <Button variant="primary" disabled={shouldDisableAiBtn}>
                    Analyze
                  </Button>
                }
                cancelButton={<Button variant="outline">Cancel</Button>}
              >
                {isAiAnalysisRunning ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {isAiAnalysisRunning ? 'Analyzing...' : 'Run AI Analysis'}
              </ButtonWithConfirm>
            </div>
          </AuthorityGuard>
        }
      />
    );

  if (isError) return <ApiErrorHandler error={error} />

  const handleSync = () => {
    toast.promise(syncVulns().unwrap(), {
      loading: 'Synchronizing Vulnerabilities',
      success: 'Synchorized',
      error: (error) => {
        return error?.data?.message || 'Failed to synchronize';
      },
    });
  };

  const handleExport = () => {
    const exportPromise = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${appConfig.BASE_URL}/op/api/v1/exposures/csv`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'exposures.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    };

    toast.promise(exportPromise(), {
      loading: 'Preparing your download...',
      success: 'Download started!',
      error: (error) =>
        error.message || 'An error occurred while exporting exposures.',
    });
  };

  if (isError) return <ApiErrorHandler error={error} />;

  return (
    <div className="p-4">
      <Helmet>
        <title>Xpose | Exposures</title>
      </Helmet>

      <div className=" flex justify-between items-center">
        <PageHeading
          title="Exposures"
          description="View and manage all exposures identified across your organization’s attack surface."
        />

        <AuthorityGuard forbidRoles={['Auditor']}>
          <div className="flex items-center gap-2">
            <ButtonWithConfirm
              disabled={shouldDisableAiBtn}
              variant="outline"
              confirm={true}
              confirmVariant="info"
              dialog={
                <p className="text-center">This action will analyze the current exposures using AI.</p>
              }
              onConfirm={() => (shouldDisableAiBtn ? null : handleAnalyze())}
              confirmButton={
                <Button variant="primary" disabled={shouldDisableAiBtn}>
                  Analyze
                </Button>
              }
              cancelButton={<Button variant="outline">Cancel</Button>}
            >
              {isAiAnalysisRunning ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {isAiAnalysisRunning ? 'Analyzing...' : 'AI Analysis'}
            </ButtonWithConfirm>

            {/* <ButtonWithConfirm
              disabled={isSyncingVulns}
              variant="outline"
              confirm={true}
              dialog={
                <p className="text-center">This action will pull all the vulnerabilities from the sources to the VM.</p>
              }
              onConfirm={() => (isSyncingVulns ? null : handleSync())}
              confirmButton={
                <Button variant="primary" disabled={isSyncingVulns}>
                  Sync
                </Button>
              }
              cancelButton={<Button variant="outline">Cancel</Button>}
            >
              <RefreshCcw /> Sync to VM
            </ButtonWithConfirm> */}

            <ButtonWithConfirm
              variant="outline"
              dialog={
                <p className="text-center">This action will export all the tickets to a CSV file.</p>
              }
              confirm={true}
              // confirmOnInput={reportName}
              onConfirm={() => handleExport()}
              confirmButton={
                <Button variant="primary">
                  Export
                </Button>
              }
              cancelButton={<Button variant="outline">Cancel</Button>}
            >
              <Upload /> Export
            </ButtonWithConfirm>
          </div>
        </AuthorityGuard>
      </div>

      <div className="w-full mt-1">
        <Metrics metrics={exposures?.stats} isLoading={exposuresLoading} />
      </div>

      <div className="mt-5">
        <ExposureList
          data={exposures}
          isLoading={exposuresLoading}
          isFetching={isFetching}
        />
      </div>

      <EditExposure />
    </div>
  );
}

export default Exposures;

