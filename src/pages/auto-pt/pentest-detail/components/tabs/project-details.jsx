import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/auth/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetProjectByIdQuery
} from '@/services/tm/projectApi';
import AddCollabrator from '../add-collab-card';
import CollabratorTable from '../collabrators-table';
import DefaultThreatOwner from '../default-threat-owner-dropwown';
import { Question } from '../highligh-cards';



function ProjectDetails() {
  const { projectId } = useParams();
  const { data, isLoading } = useGetProjectByIdQuery(projectId);
  const { user } = useAuth();

  const userRole = useMemo(() => {
    if (!data?.collaborators || !user) return null;
    const collaborator = data.collaborators.find((c) => c.email === user.email);
    return collaborator?.role || null;
  }, [data?.collaborators, user]);

  if (isLoading) {
    return <Skeleton className=" h-screen w-full" />;
  }

  return (
    <div className="flex flex-col gap-4">
      {true && (
        <div className="grid gap-5 lg:gap-7.5">
          <div className="grid lg:grid-cols-5 gap-y-5 lg:gap-7.5 items-stretch">
            <div className="lg:col-span-3 kt-scrollable-y-auto">
              <CollabratorTable
                defaultThreatOwner={data?.defaultThreatOwner || {}}
              />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              <Question />
              <AddCollabrator
                alreadySelectedCollabs={data?.collaborators}
                defaultThreatOwner={data?.defaultThreatOwner || {}}
              />
              {!isLoading && (
                <DefaultThreatOwner
                  projectCollaborators={data?.collaborators}
                  defaultThreatOwner={data?.defaultThreatOwner || {}}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
