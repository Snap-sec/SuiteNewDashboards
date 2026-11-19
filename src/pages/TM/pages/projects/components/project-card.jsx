import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AvatarGroup } from '@/components/common/avatar-group';
import { Layers } from 'lucide-react';
import { ProjectActions } from './dropdown-actions';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DateFormatter } from '../../../../../components/custom/date-formatter';
import { CustomAvatarGroup } from '../../../../../components/custom/avatar-group';

const CardProject = ({
  name,
  description,
  startDate,
  team,
  id,
  remedation,
  totalEndpoints,
  totalThreats
}) => {
  return (
    <Card className="p-7.5">
     
        <div className="flex items-center justify-between mb-3 lg:mb-6">
          <div className="flex items-center justify-center size-[50px] rounded-lg bg-accent/60">
            <Layers className="text-xl text-blue-500" />
          </div>
              <ProjectActions
                  trigger={
                    <Button variant="ghost" mode="icon">
                      <EllipsisVertical />
                    </Button>
                  }
                  projectId={id}
              />
        </div>
        <Link to={`/threat-modeler/projects/${id}?name=${name}`}>
        <div className="flex flex-col mb-3 lg:mb-6">
          <p className="text-lg font-media/brand text-mono hover:text-primary-active mb-px">
            {name}
          </p>
          <span className="text-sm text-secondary-foreground">{description}</span>
        </div>


        <div className='flex items-center gap-5 mt-4'>
          <span className="text-sm text-secondary-foreground">
            Total Endpoints:{' '}
            <span className="text-sm font-medium text-foreground">{totalEndpoints}</span>
          </span>
          <span className="text-sm text-secondary-foreground">
            Total Threats:{' '}
            <span className="text-sm font-medium text-foreground">{totalThreats}</span>
          </span>
        </div>


        <div className="flex items-center gap-5 mb-3.5 lg:mb-7 mt-4 justify-between">
          <span className="text-sm text-secondary-foreground">
            Started:{' '}
            <span className="text-sm font-medium text-foreground">
              <DateFormatter date={startDate} />
            </span>
          </span>
          <CustomAvatarGroup emails={team?.map(member => member.email)} size={4} />
        </div>
        <Progress
          value={remedation}
          className="h-1.5"
        />

      </Link>
    </Card>
  );
};

export { CardProject };
