import { Download } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardFooter,
} from '../../../../../components/ui/card';
import { Skeleton } from '../../../../../components/ui/skeleton';
import { useGetVmAssessmentReportsQuery } from '../../../../../services/vm/assessmentsApi';
import { CardIntegration } from '../components/card-integration';
import { AssessmentReportsTable } from '../components/assessment-reports-table';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

function Reports() {
  
  const [params] = useSearchParams();

  const { data, isLoading, isFetching, isError, error } = useGetVmAssessmentReportsQuery(
    params.get('assessmentId'),
  );

  const renderItem = (item, index) => {
    return (
      <CardIntegration
        logo={item?.logo || item?.format == 'PDF' ? 'pdf.svg' : 'csv.svg'}
        path={item?.path}
        format={item?.format?.toLowerCase?.()}
        name={item?.name}
        type={item?.type}
        reportId={item?.fileId}
        key={index}
        id={item?._id}
        isGeneratedAt={item?.createdAt}
      />
    );
  };

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <div id="integrations_cards">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
        {(!isError && (isLoading ||
          isFetching)) &&
          [1, 2, 3, 4, 5, 6].map((v) => (
            <Card key={v}>
              <CardContent className="p-5 lg:p-7.5">
                {/* Logo */}
                <div className="flex items-center justify-between mb-3 lg:mb-5">
                  <Skeleton className="h-11 w-11 rounded-md" />
                </div>

                {/* Name + description */}
                <div className="flex flex-col gap-1 lg:gap-2.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-full max-" />
                </div>
              </CardContent>

              {/* Footer actions */}
              <CardFooter className="justify-between items-center py-3.5">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-8 w-10 rounded-md" />
                  {/* <Skeleton className="h-8 w-8 rounded-md" /> */}
                </div>
              </CardFooter>
            </Card>
          ))}

        {!isError && !isLoading && !isFetching &&
          data?.data?.reports?.map((item, index) => {
            return renderItem(item, index);
          })}
      </div>

      <AssessmentReportsTable assessmentId={params.get('assessmentId')} />
    </div>
  );
}

export default Reports;
