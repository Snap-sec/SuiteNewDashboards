import { useEffect } from 'react';
import { Download } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useExportVmSLAViolationsMutation } from '@/services/vm/slaApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { ContentLoader } from '@/components/common/content-loader';
import PageHeading from '@/components/custom/page-heading';
import useDebounce from '../../../../../hooks/use-debounce';
import { useGetVmSLAVoilationsByQuery } from '../../../../../services/vm/slaApi';
import VoilationTable from '../components/voilation-table';
import useStore from '../store';
import { EmptyScreen } from '@/components/common/empty-screen';
import { toast } from 'sonner';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

function Violation() {
  const [exportSLAViolations, { isLoading: isExporting }] = useExportVmSLAViolationsMutation();

  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);
  const filters = useStore((state) => state.filters);
  const setPagination = useStore((state) => state.setPagination);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const {
    data: voilationsData,
    isLoading,
    isFetching,
    refetch,
    isError,
    error,
  } = useGetVmSLAVoilationsByQuery({
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(sorting?.length && sorting[0]
      ? {
        sortBy: sorting[0]?.id,
        order: sorting[0]?.desc ? 'desc' : 'asc',
      }
      : {}),
    ...filters,
  });

  useEffect(() => {
    if (pagination?.pageIndex !== 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [searchQuery, JSON.stringify(filters)]);

  useEffect(() => {
    refetch();
  }, [
    debouncedSearch,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    JSON.stringify(filters),
    refetch,
  ]);

  // if (isLoading) {
  //   return <ContentLoader />;
  // }

  const handleDownloadCSV = async () => {
    try {
      toast.loading('Preparing CSV...', { id: 'sla_csv' });

      const blob = await exportSLAViolations().unwrap();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sla-violations-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success('CSV downloaded', { id: 'sla_csv' });
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to download CSV', {
        id: 'sla_csv',
      });
    }
  };

  const hasVoilations = voilationsData?.data?.violations?.length > 0 || voilationsData?.data?.length > 0;
  const hasActiveFilters = (filters && Object.keys(filters).length > 0) || Boolean(searchQuery);

  if(isError) return <ApiErrorHandler error={error} />
  
  return (
    <div>
      <Helmet>
        <title>UniRisk | SLA Violations</title>
      </Helmet>

      {(!isLoading && !hasVoilations && !hasActiveFilters) ? null : (
        <div className="flex justify-between items-center">
          <PageHeading
            title="SLA Violations"
            description="Track and manage SLA violations across your organization."
          />
          {hasVoilations && (
            <ButtonWithConfirm
              variant="link"
              confirm={true}
              confirmTitle="Download CSV"
              dialog="This will generate and download a CSV file of all recorded SLA violations. Proceed?"
              confirmVariant="info"
              onConfirm={() => (isExporting ? null : handleDownloadCSV())}
              disabled={isExporting}
              className="hover:text-primary hover:underline h-auto p-0"
              confirmButton={
                <Button variant="primary" disabled={isExporting}>
                  Proceed
                </Button>
              }
              cancelButton={<Button variant="outline">Cancel</Button>}
            >
              <div className="flex items-center gap-2">
                <Download size={16} /> Download CSV
              </div>
            </ButtonWithConfirm>
          )}
        </div>
      )}

      {!isLoading && !hasVoilations && !hasActiveFilters ? (
        <EmptyScreen
          title="No SLA Violations"
          subTitle="All vulnerabilities are currently within their SLA timeframes."
        />
      ) : (
        <VoilationTable
          data={voilationsData?.data}
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
    </div>
  );
}

export default Violation;
