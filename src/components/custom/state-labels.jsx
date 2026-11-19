import { Badge, BadgeDot } from '@/components/ui/badge';
import { capitalizeFirstLetter } from '../../lib/helpers';

// Lucide Icons
import {
  Eye,                  // In Review
  Loader,               // In Progress
  XCircle,              // False Positive
  Ban,                  // Not Applicable
  AlertCircle,          // Unresolved
  RefreshCcw,           // Retest
  ServerCog,                // Fixed In Staging
  CheckCheck,           // Resolved
  Copy,
  CheckCircle2,
  CircleDotDashed,
  Hourglass,                 // Duplicate
  CircleAlert,
  Clock,
} from "lucide-react";
import DetailedHoverPopover from './detailed-popover';

function StateLabels({ state, className }) {

  const Colors = {
    'in review': 'primary',
    'in progress': 'warning',
    'in_progress': 'warning',
    'running': 'warning',
    'false positive': 'destructive',
    'not applicable': 'destructive',
    'unresolved': 'destructive',
    'retest': 'warning',
    're-test': 'warning',
    're test': 'warning',
    'fixed in staging': 'success',
    'resolved': 'success',
    'duplicate': 'secondary',
    'none': 'secondary',
    'open': 'destructive',
    'risk accepted': 'destructive',
    'pending': 'warning',
    'approved': 'secondary',
    'failed': 'destructive',
    'rejected': 'destructive',
    'triaged': 'warning',
    'completed': 'success',
    'upcoming': 'secondary',
    'scheduled': 'secondary',
  };

  const Icons = {
    'in review': <Eye size={16} />,
    'in progress': <Loader size={16} className='animate-spin' />,
    'false positive': <XCircle size={16} />,
    'not applicable': <Ban size={16} />,
    'unresolved': <AlertCircle size={16} />,
    'retest': <RefreshCcw size={16} />,
    're-test': <RefreshCcw size={16} />,
    're test': <RefreshCcw size={16} />,
    'fixed in staging': <ServerCog size={16} />,
    'resolved': <CheckCheck size={16} />,
    'duplicate': <Copy size={16} />,
    'none': <Copy size={16} />, // fallback
    'open': <AlertCircle size={16} />,
    'risk accepted': <CheckCircle2 size={16} />,
    'approved': <CheckCircle2 size={16} />,
    'pending': <Hourglass size={16} />,
    "rejected": <XCircle size={16} />,
    'triaged': <CircleDotDashed size={16} />,
    'completed': <CheckCheck size={16} />,
    'upcoming': <Clock size={16} />,
    'scheduled': <Clock size={16} />,
  };

  const Descriptions = {
    'in review': 'The vulnerability is being reviewed and validated by the security team.',
    'in progress': 'The responsible team is currently working on fixing the vulnerability.',
    'false positive': 'The reported vulnerability is not a real security issue.',
    'not applicable': 'The vulnerability does not apply to the asset or environment.',
    'unresolved': 'The vulnerability has been identified but is not yet fixed.',
    'retest': 'The vulnerability fix is being tested to confirm it has been properly resolved.',
    're-test': 'The vulnerability fix is being tested to confirm it has been properly resolved.',
    're test': 'The vulnerability fix is being tested to confirm it has been properly resolved.',
    'fixed in staging': 'The vulnerability has been fixed in the staging environment.',
    'resolved': 'The vulnerability has been successfully fixed in production.',
    'duplicate': 'The vulnerability has already been reported under another record.',
    'none': 'No state has been assigned to this record.',
    'open': 'The vulnerability is open and awaits further action.',
    'risk accepted': 'The risk associated with this vulnerability has been acknowledged and accepted.',
    'pending': 'The record is awaiting action or review.',
    'approved': 'The request or change has been approved.',
    'rejected': 'The request or change has been rejected.',
    'triaged': 'The vulnerability has been reviewed, categorized, and prioritized.',
    'completed': 'The task or operation has been completed successfully.',
  };

  let myState = state?.toLowerCase?.().trim().replace(/_/g, ' ');
  const description = Descriptions[myState];

  const content = (
    <Badge
      data-testid="state-badge"
      // size="lg"
      variant={Colors[myState]}
      appearance="outline"
      className="inline-flex w-auto gap-2 items-center whitespace-nowrap cursor-pointer"
    >
      {/* Icon */}
      {/* {Icons[myState]} */}

      {/* Label */}
      <span className={className || ''}>
        {capitalizeFirstLetter(myState || 'none')}
      </span>

      {/* Info Icon */}
      {/* {description && <CircleAlert size={12} className="opacity-70" />} */}
    </Badge>
  );

  return (
    <div className="inline-block">
      {description ? (
        <DetailedHoverPopover
          buttonText={content}
          showBadge={false}
          popoverTitle={capitalizeFirstLetter(myState)}
          popoverContent={
            <p className="text-muted-foreground">
              {description}
            </p>
          }
        />
      ) : (
        content
      )}
    </div>
  );
}

export { StateLabels };
