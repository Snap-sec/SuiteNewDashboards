import { HexagonBadge } from '@/partials/common/hexagon-badge';
import { Building, Building2, EllipsisVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { TeamInfoCardDropdown } from '../dropdowns/team-info-card-dropdown';
import { CustomAvatarGroup } from '@/components/custom/avatar-group';

const TeamInfoCard = ({
  teamId = '',
  teamName,
  lastActive,
  description,
  teamMembers,
  badge,
  department = {},
}) => {
  return (
    <Card className="flex flex-col gap-5 p-5 lg:p-7.5">
      <div className="flex items-center flex-wrap justify-between gap-1">
        <div className="flex items-center gap-2.5">
          <HexagonBadge {...badge} />

          <div className="flex flex-col">
            <Link to={`/profile/account/members/teams/${teamId}`} className="text-base font-medium text-mono hover:text-primary-active mb-px">
              {teamName}
            </Link>

            {department && (
              <div className=" flex items-center gap-1">
                <Building2 size={12} />
                <p className="text-base text-mono hover:text-primary-active mb-px">
                  {department?.name}
                </p>
              </div>
            )}

            <span className="text-sm text-secondary-foreground">
              {lastActive}
            </span>
          </div>
        </div>

        <AuthorityGuard
          roles={['Admin']}
          allowedUsers={teamMembers
            ?.filter((u) => u) // Filter out null/undefined members first
            ?.map((u) => ({ userId: u?.id, isLead: u?.isLead }))
            ?.filter((m) => m?.isLead === true)}
        >
          {/* <TeamInfoCardDropdown
            trigger={
              <Button variant="ghost" mode="icon">
                <EllipsisVertical />
              </Button>
            }
            teamId={teamId}
            teamName={teamName}
            lastActive={lastActive}
            description={description}
            teamMembers={teamMembers}
          /> */}
        </AuthorityGuard>
      </div>

      <p className="text-sm text-secondary-foreground">{description}</p>

      <Link
        to={`/profile/account/members/team-members?teamId=${teamId}`}
        className="text-base font-medium text-mono hover:text-primary-active mb-px"
      >
        {/* <span className="text-sm text-foreground underline hover:text-primary">{`${teamMembers?.length || 0} member${teamMembers?.length === 1 ? '' : 's'}`}</span> */}
        <CustomAvatarGroup
          emails={teamMembers?.filter((m) => m)?.map((member) => member?.email)}
          size={'30px'}
          maxVisible={2}
          more={{
            number: 10,
            variant: 'text-white ring-background bg-green-500', // Note: CustomAvatarGroup implementation might need checking if it uses this prop, but we match the reference usage.
          }}
        />
      </Link>
    </Card>
  );
};

export { TeamInfoCard };
