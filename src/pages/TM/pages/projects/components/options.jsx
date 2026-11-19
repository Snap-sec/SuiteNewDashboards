import { ProjectActions } from './dropdown-actions';
import { EllipsisVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { CustomAvatarGroup } from '../../../../../components/custom/avatar-group';






const Options = ({ items, dropdown }) => {

  const renderProject = (item, index) => {
    return (
      <Card key={index} className="p-5 lg:p-7.5 lg:pt-7">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-2">
            <FileText className="text-xl text-blue-500" />
            {dropdown && (
              <ProjectActions
                trigger={
                  <Button variant="ghost" mode="icon">
                    <EllipsisVertical />
                  </Button>
                }
                projectId={item?._id}
              />
            )}
          </div>
          <div className='flex justify-between items-center flex-wrap'>
            <div className="flex flex-col gap-3">
              <Link
                to={`/threat-modeler/projects/${item?._id}`}
                className="text-base font-medium leading-none text-mono hover:text-primary-active">
                {item?.name}
              </Link>
              <span className="text-sm text-secondary-foreground leading-5">
                {item?.description || ''}
              </span>
            </div>
            <div>
              <CustomAvatarGroup emails={item?.collaborators} />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
      {items?.map((item, index) => {
        return renderProject(item, index);
      })}
    </div>
  );
};

export { Options };
