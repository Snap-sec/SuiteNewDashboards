import { useState } from 'react';
import { RiFilePdf2Line } from '@remixicon/react';
import {
  Bug,
  CheckCircle,
  CircleAlert,
  CircleX,
  FileDown,
  Files,
  FolderDown,
  Forward,
  HelpCircle,
  Loader,
  PauseCircle,
  SquarePen,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomAvatarGroup } from '@/components/custom/avatar-group';
import { DateFormatter } from '@/components/custom/date-formatter';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';

const AssessmentColumnCard = ({
  logo,
  icon,
  assId,
  title,
  description,
  status,
  team,
  vulnerabilities,
  assessment,
  showActionButtons = true,
  classNames = '',
  totalVulns,
  resolvedVulns,
}) => {
  console.log('[+] TOTAL VULNS: ', totalVulns);
  console.log('[+] RESOLVED VULNS: ', resolvedVulns);

  const [isCopied, setIsCopied] = useState(false);

  console.log(assessment, 'ccc');

  const navigate = useNavigate();

  function getStatusConfig(status) {
    if (!status)
      return { variant: 'primary', label: 'Unknown', Icon: HelpCircle };

    const key = status.toLowerCase();

    switch (key) {
      case 'completed':
        return {
          variant: 'success',
          label: status,
          Icon: CheckCircle,
        };

      case 'running':
        return {
          variant: 'warning',
          label: status,
          Icon: Loader, // spinning loader icon
          className: 'animate-spin',
        };

      case 'not configured':
        return {
          variant: 'destructive',
          label: status,
          Icon: CircleX,
        };

      case 'failed':
        return {
          variant: 'destructive',
          label: status,
          Icon: CircleAlert,
        };

      case 'paused':
        return {
          variant: 'primary',
          label: status,
          Icon: PauseCircle,
        };

      default:
        return {
          variant: 'primary',
          label: status,
          Icon: HelpCircle, // default icon
        };
    }
  }

  const user = JSON.parse(localStorage.getItem('user'));
  const isMember = user?.role?.toLowerCase() === 'member';
  const { variant, label, Icon, className } = getStatusConfig(status);

  const percent = assessment?.remediationProgress ?? 0;

  return (
    <Card className={`p-7.5 ${classNames}`}>
      <div className="flex items-start flex-col justify-between flex-wrap gap-4 mb-3 lg:mb-5">
        {/* <div className="flex flex-col max-w-3/4">*/}
        <div className="flex flex-col w-full">
          <Link
            to={`/vm/assessment-edit?assessmentId=${assId}`}
            className="text-sm font-medium text-mono hover:text-primary truncate"
          >
            {title}
          </Link>
          <div className=" flex justify-between w-full items-center mt-2">
            <span>
              <DateFormatter
                className="text-[14px]"
                mode="long"
                date={assessment?.createdAt}
              />
            </span>

            {/* <StatusBadge status={status}/> */}
            {/* <AssessmentBadges
              state={status}
              resolved={assessment?.totalVulns - assessment?.resolvedVulns}
            /> */}
          </div>
          {/* <DateFormatter className="text-[14px]" date={assessment?.createdAt} /> */}
        </div>

        {/* <Badge appearance="outline" variant={variant}>
          <Icon className={`w-4 h-4 mr-1 ${className}`} />
          {label}
        </Badge> */}
      </div>

      <div className="flex flex-col gap-1 mb-7">
        <p className="text-secondary-foreground">Vulnerabilities:</p>

        <div className="flex flex-wrap">
          <VulnerabilityLables
            items={[
              { number: vulnerabilities?.critical, label: 'C' },
              { number: vulnerabilities?.high, label: 'H' },
              { number: vulnerabilities?.medium, label: 'M' },
              { number: vulnerabilities?.low, label: 'L' },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-4 lg:mb-8">
        <span className="text-xs font-medium text-muted-foreground text-end">
          {percent}% resolved
        </span>
        <Progress
          value={percent}
          // indicatorClassName={formattedProgress?.variant}
          className="h-1.5"
          indicatorClassName="bg-gray-500"
        />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <CustomAvatarGroup
          emails={team}
          size={'30px'}
          maxVisible={2}
          more={{
            number: 10,
            variant: 'text-white ring-background bg-green-500',
          }}
        />

        {/* <div
          className={`${showActionButtons ? '' : 'hidden'} flex items-center`}
        >
          {!isMember && status.toLowerCase() == 'not configured' && (
            <CustomTooltip text="Delete Assessment">
              <ButtonWithConfirm
                variant="ghost"
                confirm={true}
                onConfirm={() => handleDeleteAssessment()}
              >
                <Trash2 />
              </ButtonWithConfirm>
            </CustomTooltip>
          )}

          <CustomTooltip text="Edit Assessment">
            <Button
              variant="ghost"
              onClick={() => {
                navigate(
                  `/vm/assessment-edit?assessmentId=${assId}&taskType=edit-assmt`,
                  {
                    state: assessment,
                  },
                );
              }}
            >
              <SquarePen />
            </Button>
          </CustomTooltip>

          <CustomTooltip text={isCopied ? 'Copied!' : 'Copy Report URL'}>
            <Button variant="ghost" onClick={handleCopyAssmntUrl}>
              {isCopied ? <CheckCircle /> : <Files />}
            </Button>
          </CustomTooltip>

          <CustomTooltip text="View Vulnerabilities">
            <Button
              variant="ghost"
              onClick={() => {
                const url = `${window.location.origin}/vm/vulnerabilities?filters=assessmentId:${assessment?._id}`;
                window.open(url, '_blank');
              }}
            >
              <Bug />
            </Button>
          </CustomTooltip>

          <CustomTooltip text="Export CSV">
            <Button
              variant="ghost"
              disabled={isExporting}
              onClick={handleExportCSV}
            >
              <FileDown />
            </Button>
          </CustomTooltip>

          {assessment?.reportGenerated && (
            <CustomTooltip text="Download Report">
              <Button
                variant="ghost"
                disabled={isExporting}
                onClick={downloadReport}
              >
                <RiFilePdf2Line />
              </Button>
            </CustomTooltip>
          )}
        </div> */}
      </div>
    </Card>
  );
};

export function AssessmentColumnCardSkeleton() {
  return (
    <Card className="p-7.5 flex flex-col justify-between">
      <div>
        {/* Title & Date */}
        <div className="flex flex-col gap-2 mb-5">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3.5 w-1/3 rounded mt-1" />
        </div>

        {/* Vulnerabilities label & pills */}
        <div className="flex flex-col gap-2 mb-7">
          <Skeleton className="h-3.5 w-24 rounded" />
          <div className="flex gap-1.5 items-center">
            <Skeleton className="h-5 w-8 rounded-full" />
            <Skeleton className="h-5 w-8 rounded-full" />
            <Skeleton className="h-5 w-8 rounded-full" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        </div>

        {/* Resolution progress */}
        <div className="flex flex-col gap-1.5 mb-6 lg:mb-8">
          <div className="flex justify-end">
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      </div>

      {/* Avatars */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          <Skeleton className="h-7 w-7 rounded-full ring-2 ring-background" />
          <Skeleton className="h-7 w-7 rounded-full ring-2 ring-background" />
          <Skeleton className="h-7 w-7 rounded-full ring-2 ring-background" />
        </div>
      </div>
    </Card>
  );
}

export { AssessmentColumnCard };
export default AssessmentColumnCard;
