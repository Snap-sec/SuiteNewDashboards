import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const EndpointMetrics = ({ metrics, isLoading }) => {
  const stats = [
    { label: 'Total Requests', number: metrics?.totalRequests || 0 },
    { label: 'Total Vulnerabilities', number: metrics?.totalVulnsFound || 0 },
  ];

  const renderItems = (item, index) => {
    const content = (
      <div className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center">
        <span className="text-mono text-2xl lg:text-2xl leading-none font-semibold group-hover:text-primary transition-colors">
          {item.number}
        </span>
        <span className="text-secondary-foreground text-sm group-hover:text-foreground transition-colors">
          {item.label}
        </span>
      </div>
    );

    return (
      <React.Fragment key={index}>
        {item.link ? (
          <Link to={item.link} className="flex-1 flex group transition-all duration-200">
            {content}
          </Link>
        ) : (
          content
        )}
        <span className="not-last:border-e border-e-input my-1"></span>
      </React.Fragment>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex lg:px-10 py-1.5 gap-2">
            {[1, 2].map((_, index) => (
              <React.Fragment key={index}>
                <div className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center">
                  <div className="flex justify-center">
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <span className="not-last:border-e border-e-input my-1"></span>
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex lg:px-10 py-1.5 gap-2">
          {stats.map((item, index) => {
            return renderItems(item, index);
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EndpointMetrics;
