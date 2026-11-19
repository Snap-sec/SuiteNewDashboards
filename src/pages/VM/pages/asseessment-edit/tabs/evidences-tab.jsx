import { Evidences } from "../components/evidences";
import { useGetVmEvidenceQuery } from "../../../../../services/vm/filesApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router-dom";
import FileUploadModal from "../components/file-upload-modal";
import { EmptyScreen } from "@/components/common/empty-screen"
import { EvidencesCard } from "../components/evidences-card"
import { useState } from "react";
import axios from 'axios';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import appConfig from "@/config/appConfig";
import { Card } from '@/components/ui/card';
import AuthorityGuard from "../../../../../components/custom/authority-guard/AuthorityGuard";
import ApiErrorHandler from "../../../../../components/common/api-error-handler";

function EvidenceTab({ data, loading }) {
  const [params] = useSearchParams();
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const assessmentId = params.get('assessmentId');

  const handleDownloadAllEvidences = async () => {
    if (!assessmentId) {
      toast.error('Assessment ID is required');
      return;
    }

    if (isDownloading) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const response = await axios({
        url: `${appConfig.BASE_URL}/csm/api/files/evidence/${assessmentId}/zip`,
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setDownloadProgress(percentCompleted);
          }
        },
      });

      // Create a blob URL from the response data
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);

      // Get filename from Content-Disposition header or use default
      let filename = `evidences_${assessmentId}.zip`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          contentDisposition,
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Evidences downloaded successfully!');

      // Reset download state
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error?.message || 'Failed to download evidence files');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const { data: evidences, isLoading, isError, error } = useGetVmEvidenceQuery(params.get("assessmentId"));

  if (!isError && (loading || isLoading)) {
    return (
      <div className="flex flex-col gap-4">
        <div className="w-full flex items-center justify-between">
          <div>
            <h2 className='text-sm+ font-semibold'>Evidences</h2>
            <p>Evidences for the Assessments</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
              <Download size={20} />
              <span>Download All</span>
            </Button>
            <Button disabled>Upload File</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="border shadow-none overflow-hidden animate-pulse">
              <Skeleton className="w-full h-60 rounded-none" />
              <div className="px-4 py-3 flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
              <div className="flex items-center justify-between p-4 -mt-2">
                <Skeleton className="h-3 w-1/3 rounded" />
                <div className="flex gap-2">
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="size-6 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if(isError) return <ApiErrorHandler error={error}/>


  if (!evidences?.attachments?.length) {
    return <EmptyScreen
      title="No Evidences"
      subTitle="There are no evidences to display"
      darkImgUrl='/media/illustrations/30-dark.svg'
      lightImgUrl='/media/illustrations/30.svg'
      engage={<AuthorityGuard forbidRoles={"Auditor"}>
        <FileUploadModal />
      </AuthorityGuard>}
    />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex items-center justify-between">
        <div>
          <h2 className='text-sm+ font-semibold'>Evidences</h2>
          <p>Evidences for the Assessments</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDownloadAllEvidences}>
            <Download size={20} />
            {isDownloading ? (
              <span>Downloading ({downloadProgress}%)</span>
            ) : (
              <span>Download All</span>
            )}
          </Button>
          <AuthorityGuard forbidRoles={"Auditor"}>
            <FileUploadModal />
          </AuthorityGuard>
        </div>
      </div>
      {/* <Evidences attachments={evidences?.attachments || []} /> */}
      <EvidencesCard attachments={evidences?.attachments || []} />
    </div>
  );
}


export default EvidenceTab;