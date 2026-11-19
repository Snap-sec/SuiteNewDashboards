import { AvatarGroup } from '@/partials/common/avatar-group';
import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {CustomAvatarGroup} from '@/components/custom/avatar-group'
import { useDeleteAssessmentMutation } from '../../../../../services/vm/assessmentsApi';
import { useDeleteProjectMutation } from '../../../../../services/tm/projectApi';
import { ButtonWithConfirm } from "@/components/custom/button-with-confirmation";
import { toast } from 'sonner';

import { useNavigate } from 'react-router-dom';


const BasicDetails = ({ data }) => {

    const [deleteProject] = useDeleteProjectMutation();

    const projectId = window.location.pathname?.split("/")?.at(-1);

    const navigate = useNavigate();

    const handleDeleteProject = () => {
      toast.promise(
        deleteProject(projectId).unwrap(),
        {
          loading: "Deleting Project...",
          success: (res) => {
            navigate('/tm/projects');
            return res?.message || "Project Deleted";
          },
          error: (err) => err?.data?.message || "Failed to delete Project"
        }
      );
    };

    const statistics = [
      {
        total: 'Pending',
        description: data?.metrics?.pending || 0
      },
      {
        total: 'Acknowledged',
        description: data?.metrics?.acknowledged || 0
      },
      {
        total: 'Risk Accepted',
        description: data?.metrics?.risk_accepted || 0
      },
      {
        total: 'Need More Info',
        description: data?.metrics?.need_more_info || 0
      },
      {
        total: 'In Progress',
        description: data?.metrics?.in_progress || 0
      },
      {
        total: 'Fixed',
        description: data?.metrics?.fixed || 0
      },
      {
        total: 'Fix Verified',
        description: data?.metrics?.fix_verified || 0
      },
    ];



  const renderItem = (statistic, index) => {
    return (
      <div
        key={index}
        className="flex flex-col gap-1.5 px-2.75 py-2.25 border border-dashed border-input rounded-md"
      >
        <span className="text-mono text-sm leading-none font-medium">
          {statistic.total}
        </span>
        <span className="text-secondary-foreground text-xs">
          {statistic.description}
        </span>
      </div>
    );
  };



  return (
    <Card>
      <CardContent className="lg:py-7.5">
        <div className="flex flex-wrap gap-7.5">
          <div className="flex flex-col gap-3 items-center justify-center size-[140px] rounded-xl ring-1 ring-border bg-secondary-clarity">
            <img
              src={toAbsoluteUrl('/media/brand-logos/cloud-one.svg')}
              className="size-[70px]"
              alt="image"
            />

            <span className="text-sm font-semibold text-mono text-center">{data?.project?.name}</span>
          </div>
          <div className="flex flex-col gap-5 lg:gap-7.5 grow">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-semibold text-mono">
                    {data?.assessmentName}
                  </h2>
                   {/* <Badge
                    size="lg"
                    variant={formattedStatus?.variant}
                    appearance="outline">
                    {data?.assessmentState}
                  </Badge> */}
                </div>
                <p className="text-sm text-secondary-foreground">
                  Comprehensive project overview.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                {data?.assessmentState === "Configured" && (
                  <ButtonWithConfirm 
                    confirm={true} 
                    onConfirm={() => handleDeleteProject()}
                  > 
                    Delete Assessment
                  </ButtonWithConfirm>
                )}
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
              {statistics.map((statistic, index) => {
                return renderItem(statistic, index);
              })}
            </div>
            <div className="flex flex-wrap gap-6 lg:gap-12">
              <div className="flex flex-col gap-3.5 grow">
                <div className="text-sm text-secondary-foreground">
                  Resolved {' '}
                  <span className="text-sm font-medium text-mono">
                    {data?.resolved} 
                  </span>
                 {' '} out of {' '}
                  <span className="text-sm font-medium text-mono">
                    {data?.totalVulns} 
                  </span>
                 {' '} Identified Vulnerabilities
                </div>
                <Progress value={data?.closed > 0 ? (data?.metrics?.closed / (data?.metrics?.open || 1)) * 100 : 0} className="w-full" />
              </div>
              <div className="flex flex-col gap-2.5 lg:min-w-24 shrink-0 -mt-3 max-w-auto">
                {/* <div className="text-sm font-medium text-secondary-foreground">
                  Members :
                </div>
                <CustomAvatarGroup
                    emails={assessmentData?.collaborators?.map((item) => item.email)}
                    size={'size-[30px]'}
                    more={{
                      number: 10,
                      variant: 'text-white ring-background bg-green-500',
                    }}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { BasicDetails };
