import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomTooltip } from '../tooltip';
import { CircleHelp } from 'lucide-react';

const MetricsCards = ({ items, statsLoading, isLoading, onItemClick }) => {
  const renderItems = (item, index) => {
    const isClickable = Boolean(item.path || item.onClick || onItemClick);

    const cardContent = (
      <div
        className={`grid grid-cols-1 place-content-center flex-1 gap-1 text-center transition-opacity min-w-0 ${isClickable ? 'cursor-pointer hover:opacity-80' : ''
          }`}
        onClick={() => {
          if (!isClickable) return;
          if (item.onClick) item.onClick(item);
          else if (onItemClick) onItemClick(item);
        }}
      >
        <span className="text-mono text-2xl lg:text-2xl leading-none font-semibold">
          {item.number}
        </span>
        <div className="text-secondary-foreground text-sm flex items-center justify-center gap-1.5 truncate px-1">
          {item.label}
          {item.tooltip && (
            <CustomTooltip text={item.tooltip}>
              <CircleHelp className="h-3.5 w-3.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
            </CustomTooltip>
          )}
        </div>
      </div>
    );

    return (
      <React.Fragment key={index}>
        {item.path && !onItemClick ? (
          <Link to={item.path} className="flex-1 flex min-w-0">
            {cardContent}
          </Link>
        ) : (
          cardContent
        )}
        <span className="not-last:border-e border-e-input my-1"></span>
      </React.Fragment>
    );
  };

  const renderSkeletonItems = (item, index) => {
    return (
      <React.Fragment key={index}>
        <div className="grid grid-cols-1 place-content-center justify-items-center flex-1 gap-1 text-center">
          <Skeleton className="h-6 w-8 my-0.5" />
          <Skeleton className={`h-3.5 ${item?.skeletonWidth || 'w-16'} my-0.5`} />
        </div>
        <span className="not-last:border-e border-e-input my-1"></span>
      </React.Fragment>
    );
  };

  const loading = statsLoading || isLoading;

  if (loading) {
    const list = items && items.length > 0 ? items : Array.from({ length: 5 });
    return (
      <Card>
        <CardContent>
          <div className="flex lg:px-10 py-1.5 gap-2">
            {list.map((item, index) => renderSkeletonItems(item, index))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex lg:px-10 py-1.5 gap-2">
          {items.map((item, index) => {
            return renderItems(item, index);
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCards;
