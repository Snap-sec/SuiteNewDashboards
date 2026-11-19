import { Fragment } from 'react';
import { HexagonBadge } from '@/partials/common/hexagon-badge';
import { Rocket } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';
import { FolderPlus } from 'lucide-react';
const AddFolderAssessmentCard = ({ logo, title, subTitle, onClick, className, alignment}) => {
  return (
    <div onClick={()=> onClick && onClick()} className="cursor-pointer flex">
      <style>
        {`
          .offer-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1200/bg-4.png')}');
          }
          .dark .offer-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1200/bg-4-dark.png')}');
          }
        `}
      </style>

      <Card className="card border-2 border-dashed border-orange-200 hover:cursor-pointer dark:border-orange-950 bg-center bg-[length:600px] bg-no-repeat offer-bg">
        <CardContent>
          <div className={`${className ? className : "flex flex-col items-center justify-center gap-5"}`}>
            <div className="flex items-center justify-center relative  text-muted-foreground">
              {logo}
            </div>
            <div className="flex flex-col text-start gap-1">
              <span className={`${alignment ? alignment : ""} text-sm font-medium text-secondary-foreground leading-none tracking-tight`}>
                {title}
              </span>
              <span className="text-sm text-muted-foreground">
                {subTitle}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { AddFolderAssessmentCard };
