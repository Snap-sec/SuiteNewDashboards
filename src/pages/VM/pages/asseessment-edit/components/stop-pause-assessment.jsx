import {
  AlarmPlus,
  CalendarPlus,
  ClipboardPlus,
  PauseCircle,
  Play,
  PlayCircle,
  ShieldCheck,
  ShieldPlus,
  TimerIcon,
} from 'lucide-react';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { formatDate } from '../../../../../lib/helpers';
import ReasonModel from '../tabs/reason-model';
import {
  Loader,
} from "lucide-react";
import { StatusBadge } from '../../../../../components/custom/status-badge';
import { AssessmentBadges } from '../../../../../components/custom/assessment-states';
import { useAuth } from '@/auth/context/auth-context';

const isStarted = (state) => {
  return state == 'Testing Ongoing' || state == 'Running';
};

const isPaused = (state) => {
  if (state == 'Paused' || state == 'Pause') return true;
  else return false;
};

const isFinished = (state) => {
  if (state == 'Remediation' || state == 'Completed') return true;
  return false;
};

const ShowBadge = ({ title, variant }) => {
  return (
    <Badge size="md" variant={variant} appearance="outline">
      {title}
    </Badge>
  );
};

const getBadgeVariant = (state) => {
  if (state == 'Paused' || state == 'Pause') return 'warning';
  else if (state == 'Remediation' || state == 'Completed') return 'success';
  else if (state == 'New' || state == 'Not Configured' || state == 'Pending') return 'destructive';
  else if (state == 'Testing Ongoing' || state == 'Running') return 'warning';
  return 'success';
};

const StopPauseAssessment = ({ assessment={}, onUpdate }) => {
  const { user } = useAuth();


  const items = [
    {
      title: 'Start Assessment',
      description: 'Start the assessment',
      control: (
        <ButtonWithConfirm
          disabled={isStarted(assessment.state) || isFinished(assessment.state)}
          variant="outline"
          confirm={true}
          confirmTitle="Start Assessment?"
          confirmVariant="info"
          dialog="Are you sure you want to start this assessment?"
          onConfirm={() => onUpdate({ state: 'Testing Ongoing' })}
        >
          Start
        </ButtonWithConfirm>
      ),
      startDate: assessment?.startDate,
    },
    {
      title: 'Pause',
      description: 'Pause the assessment',
      control:
        isFinished(assessment.state) ? (
          <Button disabled variant="outline">
            Resume
          </Button>
        ) : !isPaused(assessment.state) ? (
          <ReasonModel
            disabled={isFinished(assessment.state)}
            onSubmit={(reason) =>
              onUpdate({
                state: 'Pause',
                pauseReason: reason,
              })
            }
          />
        ) : (
          <ButtonWithConfirm
            disabled={isFinished(assessment.state)}
            variant="outline"
            confirm={true}
            confirmTitle="Resume Assessment?"
            confirmVariant="info"
            dialog="Are you sure you want to resume this assessment?"
            onConfirm={() => onUpdate({ state: 'Testing Ongoing' })}
          >
            Resume
          </ButtonWithConfirm>
        ),
      pauseDate: isStarted(assessment.state) ? null : assessment?.pauseDate,
      pauseReason: assessment?.pauseReason,
    },
    {
      title: 'Finish Assessment',
      description: 'Reports will be visible only for you.',
      control: (
        <ButtonWithConfirm
          disabled={isFinished(assessment.state)}
          variant="outline"
          confirm={true}
          confirmTitle="Finish Assessment?"
          confirmVariant="warning"
          dialog="Are you sure you want to finish this assessment? Reports will be visible only for you."
          onConfirm={() => onUpdate({ state: 'Remediation' })}
        >
          Complete
        </ButtonWithConfirm>
      ),
      endDate: assessment?.endDate,
    },
  ];

  const renderItem = (item, index) => {
    return (
      <CardContent
        key={index}
        className="border-b border-border flex items-center justify-between py-4 gap-2.5"
      >
        <div className="flex flex-col justify-center gap-1.5">
          <span className="leading-none font-medium text-sm text-mono">
            {item.title}
          </span>
          <div className=" flex flex-col">
            <span className="text-sm text-secondary-foreground">
              {item.description}
            </span>
            <span className="text-sm text-secondary-foreground mt-1">
              {(() => {
                // Choose icon and date dynamically
                let Icon = null;
                let date = null;

                if (item?.startDate) {
                  Icon = ShieldPlus;
                  date = item.startDate;
                } else if (item?.pauseDate) {
                  Icon = PauseCircle;
                  date = item.pauseDate;
                } else if (item?.endDate) {
                  Icon = ShieldCheck;
                  date = item.endDate;
                }

                return Icon && date ? (
                  <div className="flex items-center space-x-1">
                    <Icon size={14} />
                    <p>{formatDate(date)}</p>
                  </div>
                ) : null;
              })()}
            </span>
          </div>
        </div>
        {user.role === "Auditor" ? null : item.control}
      </CardContent>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment State</CardTitle>
       
        <AssessmentBadges state={assessment.state} />
        {/* <StatusBadge status={assessment.state} /> */}
      </CardHeader>
      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </Card>
  );
};

export { StopPauseAssessment };
