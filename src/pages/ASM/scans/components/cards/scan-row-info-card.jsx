import { Edit, EllipsisVertical, Hand, Trash } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AvatarGroup } from '@/components/common/avatar-group';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';

// import { useStore } from '../../store';


const ScanRowInfoCard = ({
  icon,
  logo,
  scan,

  assetName,
  progress,
  status,
  newAssets,
  totalExposures,
  executionDate,
}) => {
  //   const setShowCreateUpdateModal = useStore(
  //     (state) => state.setShowCreateUpdateModal,
  //   );
  //   const setModalMode = useStore((state) => state.setModalMode);
  //   const setSelectedScan = useStore((state) => state.setSelectedScan);

  //   const handleUpdate = () => {
  //     setShowCreateUpdateModal(true);
  //     setModalMode('update');
  //     setSelectedScan(scan);
  //   };

  const formattedStatus =
    status.toLowerCase() == 'running'
      ? { variant: 'primary', label: status }
      : status.toLowerCase() == 'completed'
        ? { variant: 'success', label: status }
        : { variant: 'destructive', label: status };

  const formattedProgress =
    progress >= 55
      ? { variant: 'bg-primary', value: progress }
      : progress == 100
        ? { variant: 'bg-green-500', value: progress }
        : progress >= 35 || progress >= 19
          ? { variant: 'bg-primary', value: progress }
          : { variant: '', value: '' };

  return (
    <Card className="p-7">
      <div className="flex items-center flex-wrap justify-between gap-2">
        <div className="flex items-center gap-3.5">
          {/* Asset name */}
          <div className="flex flex-col">
            <Link
              to="#"
              className="text-center text-[16px] font-medium text-mono hover:text-primary-active mb-px"
            >
              {assetName || 'N/A'}
            </Link>
            <span className="text-[12px] text-secondary-foreground opacity-0">
              {scan?.group?.description || 'Demo description'}
            </span>
            {/* <Badge className="mt-2">{scan?.scanner?.name}</Badge> */}
          </div>
        </div>

        {/* Status */}
        <div>
          <Badge
            size="lg"
            variant={formattedStatus.variant}
            appearance="outline"
          >
            {formattedStatus.label.toUpperCase()}
          </Badge>
        </div>


        {/* <div>
          <Badge size="lg" appearance="outline">
            {scan.scanType?.toUpperCase()} Scan
          </Badge>
        </div> */}

        {/* New Assets */}
        <div>
          <Badge size="lg" appearance="outline">
            {newAssets} New Assets
          </Badge>
        </div>

        {/* Total Exposures */}
        <div>
          <Badge size="lg" appearance="outline">
            Total Exposures {totalExposures}
          </Badge>
        </div>


        {/* Progress */}
        <div className="flex items-center flex-wrap gap-5">
          <div className="flex gap-1 items-center text-[11px]">
            <Progress
              value={progress}
              indicatorClassName={formattedProgress?.variant}
              className="h-1.5 w-36"
            />
            {progress || 0}%
          </div>
        </div>


        {/* Execution Date */}
        <div className='flex flex-col gap-0.5'>
            <span className="text-[12px] text-sm text-secondary-foreground">Execution Date: </span>
              {
                Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(executionDate))
              }
        </div>

        <div className="flex items-center flex-wrap gap-5 lg:gap-20">
          {/* <div className="flex flex-wrap">
            <VulnerabilityLables
              items={[
                { number: vulnerabilities?.critical, label: 'C' },
                { number: vulnerabilities?.high, label: 'H' },
                { number: vulnerabilities?.medium, label: 'M' },
                { number: vulnerabilities?.low, label: 'L' },
              ]}
            />
          </div> */}

          {/* <div className="flex items-center">
            {(status == 'completed' || status == 'pending') && (
              <ButtonWithConfirm
                variant="ghost"
                onConfirm={() => handleUpdate()}
              >
                <Edit />
              </ButtonWithConfirm>
            )}
            {true ||
              status == 'pending' ||
              (status == 'halted' && (
                <ButtonWithConfirm
                  variant="ghost"
                  onConfirm={() => deleteScan(scan._id)}
                  confirm={true}
                >
                  <Trash />
                </ButtonWithConfirm>
              ))}
            {status == 'running' && (
              <ButtonWithConfirm
                variant="ghost"
                onConfirm={() => handleHaltScan()}
                confirm={true}
              >
                <Hand />
              </ButtonWithConfirm>
            )}
          </div> */}
        </div>
      </div>
    </Card>
  );
};

export default ScanRowInfoCard;
