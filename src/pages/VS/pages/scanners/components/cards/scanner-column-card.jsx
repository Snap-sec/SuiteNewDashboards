import { formatDate } from 'date-fns/format';
import {
  Bug,
  Files,
  FolderDown,
  Forward,
  SquarePen,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AvatarGroup } from '@/components/common/avatar-group';
import { CustomAvatarGroup } from '@/components/custom/avatar-group';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { DateFormatter } from '@/components/custom/date-formatter';
import { CustomTooltip } from '@/components/custom/tooltip';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import { formatDateTime } from '../../../../../../lib/helpers';

import {
  useVsDeleteVsScannerMutation,
  // useLazyGetVmScannerToCSVQuery,
} from '@/services/vs/scannerApi';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';
import { Skeleton } from '@/components/ui/skeleton';

export const ScannerColumnCardSkeleton = () => {
  return (
    <Card className="p-7.5 flex flex-col gap-5">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <Skeleton className="h-6 w-36 mb-1" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-6 w-14 rounded-md shrink-0" />
      </div>

      <Skeleton className="w-20 h-[30px] rounded-lg" />

      <div className="flex gap-1 justify-between items-end">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-1">
            <Skeleton className="h-5 w-8 rounded" />
            <Skeleton className="h-5 w-8 rounded" />
            <Skeleton className="h-5 w-8 rounded" />
            <Skeleton className="h-5 w-8 rounded" />
          </div>
        </div>
        <Skeleton className="h-9 w-9 rounded-md shrink-0" />
      </div>
    </Card>
  );
};

const ScannerColumnCard = ({
  title,
  ip,
  lastHeartbeat,
  isDefault,
  remediationPercentage,
  vulnerabilities,
  scanner,
  active,
}) => {
  // const [downloadCSVScannerFile, { isLoading: isExporting }] =
  //   useLazyGetVmScannerToCSVQuery();
  const [deleteScanner] = useVsDeleteVsScannerMutation();

  const navigate = useNavigate();

  const formattedStatus =
    status?.toLowerCase() == 'not configured'
      ? { variant: 'destructive', label: status }
      : status?.toLowerCase() == 'running'
        ? { variant: 'warning', label: status }
        : status?.toLowerCase() == 'completed'
          ? { variant: 'success', label: status }
          : { variant: 'primary', label: status };

  const formattedProgress =
    remediationPercentage >= '55'
      ? { variant: 'bg-primary', value: remediationPercentage }
      : remediationPercentage == '100'
        ? { variant: 'bg-green-500', value: remediationPercentage }
        : remediationPercentage >= '35' || remediationPercentage >= '19'
          ? { variant: 'bg-primary', value: remediationPercentage }
          : { variant: '', value: '' };

  const handleCopyAssmntUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/public/report-new?scannerId=${assId}`,
      );
      toast.success('Reporting Portal Link Copied');
    } catch (err) {
      toast.error('Failed to Copy Link');
    }
  };

  const handleExportCSV = async () => {
    const toastId = toast.loading('Exporting CSV report.');

    try {
      // const response = await downloadCSVScannerFile(assId);

      // Handle the CSV data
      const csvData = response.error.data; // Assuming this is the CSV string

      // Create a blob and download the file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scanner-${assId}.csv`; // Specify the file name
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('CSV Exported Successfully');
      toast.dismiss(toastId);
    } catch (error) {
      console.error('Error exporting scanner CSV:', error);
      toast.error('Error exporting CSV');
      toast.dismiss(toastId);
    }
  };

  const handleDeleteScanner = () => {
    toast.promise(deleteScanner(scanner._id).unwrap(), {
      loading: 'Deleting Scanner',
      success: 'Scanner Deleted',
      error: 'Failed to delete Scanner',
    });
  };

  return (
    <Card className="p-7.5 flex flex-col gap-5">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="text-lg font-media/brand text-mono hover:text-primary-active mb-px">
            {title}
          </div>

          <span>{formatDateTime(lastHeartbeat)}</span>
        </div>

        <Badge
          variant={`${active ? 'success' : 'destructive'}`}
          appearance="outline"
        >
          {active ? 'Active' : 'Dead'}
        </Badge>
      </div>

      <div className="w-fit bg-accent p-2 rounded-lg">{ip}</div>

      <div className="flex gap-1 justify-between items-end">
        <div className="flex flex-wrap flex-col">
          <p className="text-secondary-foreground">Vulnerabilities:</p>
          <VulnerabilityLables
            items={[
              { number: vulnerabilities?.critical, label: 'C' },
              { number: vulnerabilities?.high, label: 'H' },
              { number: vulnerabilities?.medium, label: 'M' },
              { number: vulnerabilities?.low, label: 'L' },
            ]}
          />
        </div>
        <AuthorityGuard forbidRoles={['Auditor']}>
        <div>
          <ButtonWithConfirm className="hover:bg-red-200/20" variant="ghost" confirm={true} onConfirm={() => handleDeleteScanner()}>
            <Trash2 className='text-destructive' />
          </ButtonWithConfirm>
        </div>
        </AuthorityGuard>
      </div>
    </Card>
  );
};

export default ScannerColumnCard;
