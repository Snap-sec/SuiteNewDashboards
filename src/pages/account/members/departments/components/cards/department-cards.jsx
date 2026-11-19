import { Building2, Plus, Settings } from 'lucide-react';
import { formatDate } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeading from '@/components/custom/page-heading';
import { EmptyScreen } from '../../../../../../components/common/empty-screen';
import useStore from '../../store';
import { DepartmentInfoCard, DepartmentInfoCardSkeleton } from './department-info-card';

const DepartmentCards = ({ data, loading }) => {
  const setShowAddTeamModal = useStore((state) => state.setShowAddTeamModal);

  // Format data combitable to team-info-card
  const formattedData = data?.map((team) => ({
    badge: {
      size: 'size-[44px]',
      badge: <Building2 className="text-xl text-blue-400" />,
      stroke: 'stroke-blue-200 dark:stroke-blue-950',
      fill: 'fill-blue-50 dark:fill-blue-950/30',
    },
    teamId: team?._id,
    teamName: team?.name || '',
    // lastActive: team?.lastActive ? formatDate(team.lastActive) : '',
    description: team?.description || '',
    teamMembers: team?.totalMembers || [],
    teamCount: team?.teamCount,

    departmentLead: team?.departmentLead,
    teamIds: team?.teamIds,
    totalMembers: team?.totalMembers,
  }));

  const user = JSON.parse(localStorage.getItem('user'));

  if (!loading && !data?.length) {
    return (
      <EmptyScreen
        title="No Departments Found"
        subTitle="No departments added yet. Create one to get started."
        engage={
          user?.role === 'Admin' && (
            <Button onClick={() => setShowAddTeamModal(true)}>
              <Plus /> Create Department
            </Button>
          )
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <PageHeading title="Departments" description="Manage and organize departments across your organization." />

        {user?.role === 'Admin' && (
          <Button onClick={() => setShowAddTeamModal(true)}>
            <Plus /> Add Department
          </Button>
        )}
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5
      lg:gap-7.5"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <DepartmentInfoCardSkeleton key={i} />
            ))
          : formattedData?.map((item, index) => (
              <DepartmentInfoCard key={index} {...item} />
            ))}
      </div>
    </div>
  );
};

export { DepartmentCards };
