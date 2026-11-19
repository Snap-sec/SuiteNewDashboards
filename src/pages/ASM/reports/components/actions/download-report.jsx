import { DownloadCloudIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import appConfig from '../../../../../config/appConfig';

function DownloadReport({ reportId, isDisabled }) {
  return (
    <Button
      disabled={isDisabled}
      variant="ghost"
      onClick={() =>
        window.open(
          `${appConfig.BASE_URL}/op/api/v1/reports/${reportId}/download`,
        )
      }
    >
      <DownloadCloudIcon />
    </Button>
  );
}

export default DownloadReport;
