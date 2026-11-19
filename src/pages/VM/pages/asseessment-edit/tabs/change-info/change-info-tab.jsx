import { Bug, Files, FolderDown, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { formatDate } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import PageHeading from '@/components/custom/page-heading';
import { PriorityBadge } from '@/components/custom/priority-badge';
import { CustomTooltip } from '@/components/custom/tooltip';
import {
  useDeleteVmAssessmentMutation,
  useLazyGetVmAssessmentToCSVQuery,
} from '../../../../../../services/vm/assessmentsApi';
import { ApplicationDetails } from './components/application-details';
import DetailsAndPassword from './components/details-password';
import { PentestRequirements } from './components/pentest-requirements';
import { RequestInformation } from './components/request-info';
import { TechnicalInformation } from './components/techinical-details';
import ApiErrorHandler from '../../../../../../components/common/api-error-handler';

function ChangeInfoTab({ changeRequestData, statsData, loading, isError, error }) {
  const navigate = useNavigate();

  const [deleteAssessment] = useDeleteVmAssessmentMutation();
  const [downloadCSVAssessmentFile, { isExporting }] =
    useLazyGetVmAssessmentToCSVQuery();

  const handleDeleteAssessment = () => {
    toast.promise(deleteAssessment(changeRequestData?._id).unwrap(), {
      loading: 'Deleting Assessment',
      success: () => {
        // Go back one page after success
        navigate(-1);
        return 'Assessment Deleted';
      },
      error: (err) => {
        // Try to extract error message from the response
        if (err?.data?.message) return err.data.message;
        if (err?.data?.error) return err.data.error;
        if (typeof err?.data?.data === 'string') return err.data.data;
        if (err?.message) return err.message;
        return 'Failed to delete Assessment';
      },
    });
  };

  const handleCopyAssmntUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/pages/public/report-new?assessmentId=${changeRequestData?._id}`,
      );
      toast.success('Reporting Portal Link Copied');
    } catch (err) {
      toast.error('Failed to Copy Link');
    }
  };

  const handleExportCSV = async () => {
    const toastId = toast.loading('Exporting CSV report.');

    try {
      const response = await downloadCSVAssessmentFile(changeRequestData?._id);
      const csvData = response.error.data;

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessment-${changeRequestData?._id}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('CSV Exported Successfully');
      toast.dismiss(toastId);
    } catch (error) {
      console.error('Error exporting assessment CSV:', error);
      toast.error('Error exporting CSV');
      toast.dismiss(toastId);
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));

  if (!isError && loading) {
    return (
      <div>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-5 items-start mt-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-44" />
            </CardHeader>
            <CardContent className="pt-3.5 pb-3.5 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-44" />
            </CardHeader>
            <CardContent className="pt-3.5 pb-3.5 space-y-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-5 items-start mt-4">
          <Card className="h-full">
            <CardHeader>
              <Skeleton className="h-6 w-44" />
            </CardHeader>
            <CardContent className="pt-3.5 pb-3.5 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-44" />
            </CardHeader>
            <CardContent className="pt-3.5 pb-3.5 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-44" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardHeader>
            <CardContent className="pt-3.5 pb-3.5 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeading
          title="Change Request Details"
          description="View and manage the details of the Change request"
        />
        <div className="flex items-center gap-2">
          <CustomTooltip text="Copy Report URL">
            <Button variant="outline" onClick={handleCopyAssmntUrl}>
              <Files />
            </Button>
          </CustomTooltip>

          <CustomTooltip text="View Vulnerabilities">
            <Button
              variant="outline"
              onClick={() => {
                const url = `${window.location.origin}/vm/vulnerabilities?filters=assessmentId:${changeRequestData?._id}`;
                window.open(url, '_blank');
              }}
            >
              <Bug />
            </Button>
          </CustomTooltip>

          <CustomTooltip text="Export CSV">
            <Button
              variant="outline"
              disabled={isExporting}
              onClick={handleExportCSV}
            >
              <FolderDown />
            </Button>
          </CustomTooltip>

          {statsData?.totalVulns == 0 && <AuthorityGuard roles={['Admin']}>
            <CustomTooltip text="Delete">
              <ButtonWithConfirm
                variant="outline"
                confirm={true}
                onConfirm={() => handleDeleteAssessment()}
                className='text-red-500 hover:text-red-500 hover:bg-red-200/20'
              >
                <Trash2 />
              </ButtonWithConfirm>
            </CustomTooltip>
          </AuthorityGuard>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-5 items-start mt-4">
        <RequestInformation
          changeRequestData={changeRequestData?.changeRequestData}
          loading={loading}
        />
        <TechnicalInformation
          changeRequestData={changeRequestData?.changeRequestData}
          loading={loading}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-5 items-start mt-4">
        <PentestRequirements
          changeRequestData={changeRequestData?.changeRequestData}
          loading={loading}
        />
        <DetailsAndPassword
          environment={
            changeRequestData?.changeRequestData?.environmentToBeTested
          }
          testUrl={changeRequestData?.changeRequestData?.testUrlOrIp}
          authenticationType={
            changeRequestData?.changeRequestData?.authenticationType
          }
          testCredentials={
            changeRequestData?.changeRequestData?.testCredentials
          }
          loading={loading}
        />
      </div>

      <div className="mt-5">
        <ApplicationDetails
          changeRequestData={changeRequestData?.changeRequestData || []}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default ChangeInfoTab;
