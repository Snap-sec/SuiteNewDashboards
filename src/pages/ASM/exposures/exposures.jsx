import { useEffect } from 'react';
import { Download, RefreshCcw, Upload, Sparkles, Loader2, ScanSearch } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { useSearchParams } from 'react-router-dom';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditExposure from './components/edit-exposure';
import ExposureList from './components/exposure-list';
import ExposureGroups from './components/exposure-groups';
import useStore from './store';
import useDebounce from '../../../hooks/use-debounce';
import AuthorityGuard from '../../../components/custom/authority-guard/AuthorityGuard';
import ApiErrorHandler from '../../../components/common/api-error-handler';

function Exposures() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'list';

  const [syncVulns, { isLoading: isSyncingVulns }] = useSyncAsmVulnsMutation();
  const [analyzeExposures, { isLoading: isAnalyzing }] = useAnalyzeAsmExposuresMutation();
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const search = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);

  const debouncedSearch = useDebounce(search, 400);

  const {
    data: exposures,
    isLoading: exposuresLoading,
    isFetching,
    refetch,
    isError,
    error,
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

  const handleTabChange = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', value);
      return next;
    });
  };

  if (isError) return <ApiErrorHandler error={error} />;

  return (
    <div className="p-4">
      <Helmet>
        <title>
          {currentTab === 'groups'
            ? 'Xpose | Exposure Groups'
            : 'Xpose | Exposures'}
        </title>
      </Helmet>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList variant="line" size="md" className="border-b mb-4">
          <TabsTrigger value="list">Exposures List</TabsTrigger>
          <TabsTrigger value="groups">Exposure Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {!isError &&
          !exposuresLoading &&
          !exposures?.total &&
          !debouncedSearch &&
          !Object.keys(filters).length &&
          !sorting?.length ? (
            <EmptyScreen
              title="No Exposures Found"
              subTitle="There are no exposures to show."
              engage={
                <AuthorityGuard forbidRoles={['Auditor']}>
                  <div className="flex items-center gap-2">
                    <Link to="/casm/scans">
                      <Button variant="primary">
                        <ScanSearch /> Start a Scan
                      </Button>
                    </Link>
                  </div>
                </AuthorityGuard>
              }
            />
          ) : (
            <ExposureList
              data={exposures}
              isLoading={exposuresLoading}
              isFetching={isFetching}
            />
          )}
        </TabsContent>

        <TabsContent value="groups">
          <ExposureGroups
            data={exposures}
            isLoading={exposuresLoading}
            isFetching={isFetching}
          />
        </TabsContent>
      </Tabs>

      <EditExposure />
    </div>
  );
}

export default Exposures;

