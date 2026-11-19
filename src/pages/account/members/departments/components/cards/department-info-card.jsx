import { HexagonBadge } from '@/partials/common/hexagon-badge';
import { EllipsisVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { DepartmentInfoCardDropdown } from '../dropdowns/department-info-card-dropdown';

const DepartmentInfoCard = ({
  teamId = '',
  teamName,
  lastActive,
  description,
  teamMembers = [],
  badge,
  teamCount,
  departmentLead,
  teamIds,
  totalMembers
}) => {
  return (
    <Link to={`/profile/account/members/departments/${teamId}`} className="h-full block">
      <Card className="h-full flex flex-col gap-5 p-5 lg:p-7.5">
        <div className="flex items-center flex-wrap justify-between gap-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <HexagonBadge {...badge} />

            <div className="flex flex-col min-w-0">
              <p className="text-base truncate font-medium text-mono hover:text-primary-active mb-px">
                {teamName}
              </p>

              <span className="text-sm text-secondary-foreground">
                {lastActive}
              </span>
            </div>
          </div>

          <AuthorityGuard
            roles={['Admin']}
            // allowedUsers={teamMembers
            //   ?.map((u) => ({ userId: u?.id, isLead: u.isLead }))
            //   ?.filter((m) => m.isLead == true)}
          >
            {/* <DepartmentInfoCardDropdown
              trigger={
                <Button variant="ghost" mode="icon">
                  <EllipsisVertical />
                </Button>
              }
              departmentId={teamId}
              departmentName={teamName}
              lastActive={lastActive}
              description={description}
              teamMembers={teamMembers}
              departmentLead={departmentLead}
              departmentTeams={teamIds}
            /> */}
          </AuthorityGuard>
        </div>

        <p className="text-sm text-secondary-foreground grow truncate">{description}</p>

        {/* <Link
          to={`/profile/account/members/team-members?teamId=${teamId}`}
          className="text-base font-medium text-mono hover:text-primary-active mb-px"
        > */}
        <span className="text-sm text-foreground">{`${teamCount || 0} Team${teamCount === 1 ? '' : 's'}`} | {totalMembers} Member{totalMembers === 1 ? '' : 's'}</span>
        {/* </Link> */}
      </Card>
    </Link>
  );
};

const DepartmentInfoCardSkeleton = () => {
  return (
    <Card className="h-full flex flex-col gap-5 p-5 lg:p-7.5">
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <Skeleton className="size-[44px] rounded-lg shrink-0" />

          <div className="flex flex-col gap-1.5 min-w-0">
            <Skeleton className="h-4.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>

      <div className="space-y-1.5 grow">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
      </div>

      <Skeleton className="h-4 w-36" />
    </Card>
  );
};

export { DepartmentInfoCard, DepartmentInfoCardSkeleton };
