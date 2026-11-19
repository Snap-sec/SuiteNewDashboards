import { useState } from 'react';
import { DownloadCloudIcon } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import appConfig from '@/config/appConfig';
import { useGetAimSupportedReportsQuery } from '@/services/asset-inventory/exportApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import { CardExport } from './components/card-export';
import GenerateExportModal from './components/modals/generate-export-modal';

const Export = () => {
  const { data, isLoading, isError, error } = useGetAimSupportedReportsQuery();

  if (isError) return <ApiErrorHandler error={error} />;

  return (
    <div className="p-4">
      <Helmet>
        <title>AssetIQ | Exports</title>
      </Helmet>
      <div className="flex justify-between items-center mb-5">
        <PageHeading
          title="Exports"
          description="Export assets from your inventory for analysis, reporting, and data management."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
        {isLoading &&
          [1, 2, 3, 4, 5, 6].map((v) => (
            <Card key={v}>
              <CardContent className="p-5 lg:p-7.5">
                <div className="flex items-center justify-between mb-3 lg:mb-5">
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-11 w-11 rounded-md" />
                  </div>
                </div>

                <div className="flex flex-col gap-1 lg:gap-2.5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-full max-" />
                </div>
              </CardContent>

              <CardFooter className="justify-between items-center py-3.5">
                <Skeleton className="h-9 w-full rounded-md" />
              </CardFooter>
            </Card>
          ))}

        {!isLoading &&
          data?.exports?.map((item, index) => (
            <CardExport key={index} data={item} />
          ))}
      </div>
    </div>
  );
};

export default Export;
