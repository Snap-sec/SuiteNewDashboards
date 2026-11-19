import { Briefcase, Copy, Crown, CrownIcon, Settings, SquarePen, UserCog } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { AvatarSingle } from './avatar-single';
import EditBusinessUnitModal from './modals/edit-business-unit-modal';

const BusinessUnitCard = ({
  avatar,
  businessUnit,
  bgImage,
  name,
  email,
  info,
  statistics,
  vulnCount = {},
  id,
  owner={}
}) => {
  const renderItem = (statistic, index) => {
    return (
      <div
        key={index}
        className="grid grid-cols-1 gap-1.5 border-[0.5px] border-dashed border-input rounded-md px-2.5 py-2 shrink-0 max-w-auto"
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
    <Card className="overflow-hidden rounded-xl">
      <CardHeader
        className="card-rounded-t flex justify-end items-start relative p-0 bg-no-repeat bg-cover bg-center h-[120px]
    bg-[url('/media/images/2600x1200/bg-7.png')]
    dark:bg-[url('/media/images/2600x1200/bg-10-dark.png')]"
      >
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-center transform -translate-y-1/2">
          <AvatarSingle
            className={avatar?.className}
            fallback={avatar?.fallback}
            image={avatar?.image}
            imageClass={avatar?.imageClass}
            badgeClass={avatar?.badgeClass}
          />
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-px -mt-7.5">
          <Link
            to="#"
            className="hover:text-primary-active text-base leading-5 font-medium text-mono"
          >
            {name}
          </Link>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-3.5">
          <div title={info}   style={{
       display: '-webkit-box',
       WebkitLineClamp: 2,
       WebkitBoxOrient: 'vertical',
     }} className="flex items-center line-clamp-2  gap-2 text-sm text-center font-normal text-muted-foreground">
            {info}{' '}
          </div>
        </div>
        <div className=' flex  items-center mb-7 justify-center gap-0.5 '>
          <Crown className='text-muted-foreground' size={10}/>
          <p className='text-center text-sm font-normal text-muted-foreground'>{owner?.name}</p>
        </div>
        <div className="flex items-center justify-center flex-wrap gap-2 lg:gap-5 mb-3">
          {Object.entries(businessUnit?.risk)
            .map(([key, value]) => ({
              total: value,
              description: key,
            }))
            .map((statistic, index) => {
              return renderItem(statistic, index);
            })}
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button mode="link" underlined="dashed">
          <Link target="_blank" to={`/assetinventory/business-unit/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export { BusinessUnitCard };
