import React from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomTooltip } from '../../../../../components/custom/tooltip';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const Statistics = ({ businessUnitStats, isLoading }) => {
  const navigate = useNavigate();

  const { id } = useParams();

  const items = [
    {
      number: businessUnitStats?.total_assets ?? 0,
      label: 'Associated Assets',
      tooltip: 'The total number of assets currently belonging to this Business Unit.',
    },
    {
      number: businessUnitStats?.total_open_criticals ?? 0,
      label: 'Open Criticals',
      tooltip: "Total number of open vulnerabilities with a 'Critical' severity level.",
    },
    {
      number: businessUnitStats?.total_open_vulns ?? 0,
      label: 'Open Vulns',
      tooltip: 'Total count of all open vulnerabilities affecting the assets of this Business Unit.',
    },
    {
      number: businessUnitStats?.total_associated_vulns ?? 0,
      label: 'Associated Vulns',
      tooltip: 'Sum of all open vulnerabilities that are either directly assigned to this Business Unit or affect its assets.',
    },
  ];

  const renderItems = (item, index) => {
    const handleCardClick = (label) => {
      if (label == 'Total Assets') {
        navigate(`/assetinventory/assets?filters=businessUnitId:${id}`);
      }

      if (label == 'Open Criticals') {
        navigate(`/vm/vulnerabilities?filters=businessUnitIds:${id};severity:Critical;state:In Review,Unresolved,Triaged`);
      }

      if (label == 'Open Vulns') {
        navigate(`/vm/vulnerabilities?filters=businessUnitIds:${id};state:In Review,Unresolved,Triaged`);
      }

      if (label == 'Associated Vulns') {
        navigate(`/vm/vulnerabilities?filters=businessUnitId:${id}`);
      }
    };

    return (
      <React.Fragment key={index}>
        <CustomTooltip text={'Click to Apply Filter'}>
          <div
            className="grid grid-cols-1 place-content-center cursor-pointer flex-1 gap-1 text-center"
            onClick={() => {
              handleCardClick(item.label);
            }}
          >
            <span className="text-mono text-2xl lg:text-2xl leading-none font-semibold">
              {item.number}
            </span>
            <span className="text-secondary-foreground text-sm flex items-center justify-center gap-1">
              {item.label}
              <DetailedHoverPopover
                buttonText={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground inline-flex"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CircleAlert className="h-3 w-3" />
                  </Button>
                }
                showBadge={false}
                popoverTitle={item.label}
                popoverContent={
                  <p className="text-muted-foreground text-xs">{item.tooltip}</p>
                }
              />
            </span>
          </div>
        </CustomTooltip>
        <span className="not-last:border-e border-e-input my-1"></span>
      </React.Fragment>
    );
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent>
          <div className="flex lg:px-10 py-1.5 gap-2 justify-between">
            {items.map((_, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center justify-center flex-1 gap-2.5 py-1 text-center">
                  <Skeleton className="h-6 w-10 rounded" />
                  <Skeleton className="h-4 w-28 rounded" />
                </div>
                {index < items.length - 1 && (
                  <span className="border-e border-e-input my-1"></span>
                )}
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
          {items.map((item, index) => {
            return renderItems(item, index);
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export { Statistics };
