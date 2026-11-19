import { DownloadCloudIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import appConfig from '@/config/appConfig';
import { CustomTooltip } from '@/components/custom/tooltip';

function DownloadReport({ status, reportId, showDownloadText = true, btnVarient = "outline", disabled = false }) {
  const downloadReport = () => {
    const authToken = localStorage.getItem('token');
    const downloadReportURL = `${appConfig.BASE_URL}/csm/api/reports/${reportId}/download`;
    window.location.href = downloadReportURL;
  };

  return (
    <CustomTooltip text="Download Report">
      <Button
        disabled={status !== 'completed' || disabled}
        variant={btnVarient}
        onClick={downloadReport}
      >
        <DownloadCloudIcon /> {showDownloadText && "Download"}
      </Button>
    </CustomTooltip>
  );
}

export default DownloadReport;
