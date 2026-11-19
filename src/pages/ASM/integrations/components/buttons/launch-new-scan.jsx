import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAsmSettingsQuery } from '@/services/asm/configApi';
import { useLaunchAsmTestScanMutation } from '@/services/asm/scansApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Skeleton } from '../../../../../components/ui/skeleton';

function LaunchNewScan({ setIsScanConfigured, ...props }) {
  const navigate = useNavigate();
  const { data: asmSettingsData, isLoading: loadingSettings } =
    useGetAsmSettingsQuery({ refetchOnMountOrArgChange: true });

  const [launchTestScan, { isLoading: isLaunchingTestScan }] =
    useLaunchAsmTestScanMutation();

  useEffect(() => {
    if (asmSettingsData?.data) {
      setIsScanConfigured?.(true);
    }
    if(!asmSettingsData?.data) 
      setIsScanConfigured?.(false);
  }, [asmSettingsData, setIsScanConfigured]);

  const handleLaunchTestScan = () => {
    const promise = launchTestScan().unwrap();
    toast.promise(promise, {
      loading: 'Launching Full Scan',
      success: 'Full Scan lanched Successfully',
      error: (err) => err?.data?.message || 'Error launching Full Scan',
    });
    promise.then(() => {
      navigate('/casm/scans');
    }).catch(() => {});
  };

  return loadingSettings ? (
    <Skeleton className="h-6" />
  ) : (
    asmSettingsData?.data && (
      <ButtonWithConfirm
        confirm={true}
        onConfirm={handleLaunchTestScan}
        dialog={
          <p className="text-sm">
            Are you sure you want to launch a new test scan now?
          </p>
        }
        disabled={isLaunchingTestScan}
        variant="outline"
        {...props}
      >
        <Rocket className="w-4 h-4 mr-2" />
        Launch Scan Now
      </ButtonWithConfirm>
    )
  );
}

export default LaunchNewScan;
