import { Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import TimelineItem from './timeline-item';
import {DateFormatter} from "@/components/custom/date-formatter"
import { ChevronsRight   } from 'lucide-react';
import {StateLabels} from '@/components/custom/state-labels';
import NumberLables from '@/components/custom/number-lables';
import { BadgeDot } from '@/components/ui/badge';
import { StatusBadge } from '../../../../../../components/custom/status-badge';
import SeverityLabel from '../../../../../../components/custom/severity-label';

const StateChange = ({ heading, datetime, title, stateFrom, stateTo, ownerId, name}) => {


  
const renderBadge = (state) => {
  if (!state) return state;

  if (state === 'high' || state === 'medium' || state === 'low' || !isNaN(parseFloat(state))) {
    return <SeverityLabel severity={state} />;
  }

  if (state === 'None' || state === 'none' || state?.includes('@')) {
    return (
      <Badge size="lg" variant="secondary" appearance="outline" shape="square">
        <BadgeDot className="text-success"/> {state}
      </Badge>
    );
  }

  if (
    [
      "pending",
      "acknowledged",
      "risk_accepted",
      "fixed",
      "fix_verified",
      "rejected",
      "in_progress",
      "need_more_info"
    ].includes(state)
  ) {
    return <StatusBadge status={state} />;
  }

  return (
    <p className="text-sm px-2 py-1 bg-muted rounded-lg border">
     <BadgeDot className="text-secondary"/> {state}
    </p>
  );
};



  return (
    <TimelineItem icon={Printer} line={true} userName={name}  userId={ownerId}>
      <div className="flex flex-col pb-2.5">
        <span className="text-sm text-foreground">
          {heading}
        </span>
        <span className="text-xs text-secondary-foreground">
          {name || " "} - <DateFormatter date={datetime}/>
        </span>
      </div>
      <Card className="shadow-none">
        <CardContent className="lg:py-4">
          <div className="flex flex-col gap-1">
            <div className="text-base font-medium text-mono text-center">
              {title}
            </div>
            <div className="flex items-center justify-center gap-1">
              {renderBadge(stateFrom || "None")}
              <span className="text-sm text-secondary-foreground mt-0.5">
                <ChevronsRight size={16}/>
              </span>
              {renderBadge(stateTo)}
            </div>
          </div>
        </CardContent>
      </Card>
    </TimelineItem>
  );
};

export { StateChange };
