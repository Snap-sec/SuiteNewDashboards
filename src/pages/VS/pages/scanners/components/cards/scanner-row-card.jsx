import { EllipsisVertical } from 'lucide-react';
import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AvatarGroup } from '@/components/common/avatar-group';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';

// import { DropdownMenu3 } from '../dropdown-menu/dropdown-menu-3';

const ScannerRowCard = ({
  assId,
  icon,
  logo,
  title,
  description,
  status,
  remediationPercentage,
  vulnerabilities,
}) => {
  const formattedStatus =
    status.toLowerCase() == 'not configured'
      ? { variant: 'destructive', label: status }
      : status.toLowerCase() == 'running'
        ? { variant: 'warning', label: status }
        : status.toLowerCase() == 'completed'
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

  return (
    <Card className="p-7">
      <div className="flex items-center flex-wrap justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center size-14 shrink-0 rounded-lg bg-accent/60">
            {logo ? (
              <img
                src={toAbsoluteUrl(`/media/brand-logos/${logo}`)}
                className=""
                alt="image"
              />
            ) : (
              icon
            )}
          </div>
          <div className="flex flex-col">
            <Link
              to="#"
              className="text-lg text-mono hover:text-primary-active mb-px"
            >
              {title || ''}
            </Link>
            <span className="text-sm text-secondary-foreground">
              {description || 'Demo description'}
            </span>
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-5 lg:gap-20">
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
          <div className="flex items-center flex-wrap gap-5 lg:gap-14">
            <Badge
              size="lg"
              variant={formattedStatus.variant}
              appearance="outline"
            >
              {formattedStatus.label}
            </Badge>

            <Progress
              value={formattedProgress?.value}
              indicatorClassName={formattedProgress?.variant}
              className="h-1.5 w-36"
            />
          </div>

          <div className="flex items-center gap-5 lg:gap-14">
            <div className="flex justify-end w-24">
              {/* <AvatarGroup
                group={team.group}
                size={team.size}
                more={team.more}
              /> */}
              <AvatarGroup
                group={[
                  { filename: '300-21.png' },
                  { filename: '300-1.png' },
                  { filename: '300-2.png' },
                ]}
                size={'size-[30px]'}
                more={{
                  number: 10,
                  variant: 'text-white ring-background bg-green-500',
                }}
              />
            </div>

            {/* <DropdownMenu3
              trigger={
                <Button variant="ghost" mode="icon">
                  <EllipsisVertical />
                </Button>
              }
            /> */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ScannerRowCard;
