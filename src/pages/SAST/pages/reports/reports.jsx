import React from 'react';
import { Helmet } from 'react-helmet';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/custom/page-heading';
import {
  useGetSastSupportedReportsQuery,
  useLazyExportFullCatalogQuery,
} from '@/services/sast/reportsApi';
import { CardIntegration } from './components/card-integration';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import appConfig from '@/config/appConfig';

const SASTReportsPage = () => {
  const [triggerExportCatalog, { isFetching: isExportingCatalog }] = useLazyExportFullCatalogQuery();

  // Fetch Supported Report Templates
  const {
    data: supportedReportsRes,
    isLoading: isSupportedLoading,
    isError: isSupportedError,
    error: supportedError,
  } = useGetSastSupportedReportsQuery();

  const supportedReports =
    supportedReportsRes?.data?.reports ||
    supportedReportsRes?.reports ||
    supportedReportsRes?.data?.data ||
    supportedReportsRes?.data ||
    (Array.isArray(supportedReportsRes) ? supportedReportsRes : []);

  const handleExportCatalog = async () => {
    try {
      await triggerExportCatalog().unwrap();
      window.location.href = `${appConfig.BASE_URL}/sast/api/v1/reports/export-full-catalog`;
      toast.success('SAST full catalog export initiated.');
    } catch (err) {
      window.location.href = `${appConfig.BASE_URL}/sast/api/v1/reports/export-full-catalog`;
    }
  };

  if (isSupportedError) return <ApiErrorHandler error={supportedError} />;

  return (
    <div className="p-4 flex flex-col gap-6 w-full">
      <Helmet>
        <title>SAST | Reports & Export</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Reports & Export"
          description="Generate SPDX/CycloneDX SBOM exports, audit summaries, and executive SAST reports."
        />

        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleExportCatalog}
          disabled={isExportingCatalog}
        >
          {isExportingCatalog ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          <span>Export Full Catalog</span>
        </Button>
      </div>

      {/* Available Report Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
        {isSupportedLoading &&
          [1, 2, 3].map((v) => (
            <Card key={v} className="shadow-sm">
              <CardContent className="p-5 lg:p-7.5">
                <div className="flex items-center justify-between mb-3 lg:mb-5">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Skeleton className="h-5 w-12 rounded" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
              <CardFooter className="py-3.5 px-5 border-t border-border/50">
                <Skeleton className="h-9 w-32 rounded-md" />
              </CardFooter>
            </Card>
          ))}

        {!isSupportedLoading &&
          Array.isArray(supportedReports) &&
          supportedReports.map((item, idx) => (
            <CardIntegration
              key={item.type || item.name || idx}
              id={item.reportId || item.id}
              format={item.format}
              name={item.name}
              type={item.type}
              types={item.types}
              supportedFormats={item.supported_formats}
              reportId={item.reportId || item.id}
              isGeneratedAt={item.createdAt}
              status={item.status}
              description={item.description}
            />
          ))}
      </div>
    </div>
  );
};

export default SASTReportsPage;
