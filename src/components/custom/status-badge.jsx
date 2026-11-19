import React from 'react';
import {
  AlertTriangle,
  CalendarClock,
  CheckCheck,
  CheckCircle2,
  CircleDotDashed,
  CircleX,
  ClipboardCheck,
  Clock,
  Cog,
  HelpCircle,
  Info,
  Loader,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  Timer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '../ui/spinners';

function formatLabel(str) {
  return (str || 'Upcoming')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Checks if a string or status ends with or contains an active "-ing" action.
 * Explicitly excludes "pending".
 */
function isIngStatus(text) {
  if (!text) return false;
  const s = text.trim().toLowerCase();

  // Explicitly exclude pending and upcoming
  if (
    s === 'pending' ||
    s.includes('pending') ||
    s === 'upcoming' ||
    s.includes('upcoming')
  ) {
    return false;
  }

  // Exact ending with 'ing'
  if (s.endsWith('ing')) {
    return true;
  }

  // Split into words and check if any word ends with 'ing' (e.g., 'matching vulnerabilities', 'port scanning')
  const words = s.split(/[\s_-]+/);
  if (words.some((w) => w.endsWith('ing') && w !== 'pending' && w !== 'upcoming')) {
    return true;
  }

  // Also common active continuous phrases
  if (s === 'in progress' || s === 'inprogress') {
    return true;
  }

  return false;
}

function getMatchingVariant(obj, key) {
  if (!obj || !key) return false;
  const objKeys = Object.keys(obj);
  for (let i = 0; i < objKeys.length; i++) {
    const curKey = objKeys[i];
    if (key === curKey || key.includes(curKey) || curKey.includes(key)) {
      return obj[curKey];
    }
  }
  return false;
}

const VARIANTS = {
  // Complete / Success (green)
  complete: 'success',
  completed: 'success',
  'completed successfully': 'success',
  exposure_analysis_completed: 'success',
  'exposure analysis completed': 'success',
  resolved: 'success',
  fixed: 'success',
  'fix verified': 'success',
  closed: 'success',

  // Queued & Pending (blue)
  queued: 'primary',
  pending: 'primary',
  configured: 'primary',

  // -ing / Active progress (warning)
  crawling: 'warning',
  scanning: 'warning',
  running: 'warning',
  'matching vulnerabilities': 'warning',
  'applying actions': 'warning',
  'in progress': 'warning',
  in_progress: 'warning',
  'completed with errors': 'warning',
  acknowledged: 'warning',

  // Cancelled / Paused (gray)
  cancelled: 'secondary',
  canceled: 'secondary',
  paused: 'secondary',
  'not scanned': 'secondary',
  upcoming: 'secondary',

  // Failed / Errors (red)
  failed: 'destructive',
  fail: 'destructive',
  timeout: 'destructive',
  rejected: 'destructive',
  'not configured': 'destructive',
  'risk accepted': 'destructive',

  // Info
  scheduled: 'info',
  triaged: 'info',
  'need more info': 'secondary',
};

const STATUS_ICONS = {
  // Complete -> Tick icon
  complete: CheckCircle2,
  completed: CheckCircle2,
  'completed successfully': CheckCircle2,
  exposure_analysis_completed: CheckCircle2,
  'exposure analysis completed': CheckCircle2,
  resolved: CheckCircle2,
  fixed: CheckCheck,
  'fix verified': ClipboardCheck,
  closed: CheckCircle2,

  // Queued & Pending -> Queue icon
  queued: Timer,
  pending: Timer,
  configured: Cog,

  // Cancelled -> Cross icon
  cancelled: CircleX,
  canceled: CircleX,
  paused: PauseCircle,
  'not scanned': HelpCircle,
  upcoming: Clock,

  // Failed -> Cross icon
  failed: CircleX,
  fail: CircleX,
  timeout: CircleX,
  rejected: CircleX,
  'not configured': CircleX,
  'risk accepted': ShieldAlert,

  // In-progress fallback icons (when spinner not shown)
  crawling: Loader,
  scanning: Loader,
  running: PlayCircle,
  'matching vulnerabilities': Loader,
  'applying actions': Loader,
  'in progress': Loader,
  in_progress: Loader,
  'completed with errors': AlertTriangle,
  acknowledged: Info,

  // Info
  scheduled: CalendarClock,
  triaged: CircleDotDashed,
  'need more info': HelpCircle,
};

function StatusBadge({
  status,
  progress,
  showPercentage = false,
  size = '',
  showProgress = false,
  label,
  showFound = false,
  foundCount = 0,
  showErrors = false,
  errorCount = 0,
  className,
}) {
  const raw = (status || '').toLowerCase().trim();
  const lookupKey = raw.replace(/_/g, ' ');

  // 1. Pending check: must NOT show spinner and must use blue + queue icon
  const isPending =
    lookupKey === 'pending' ||
    lookupKey.startsWith('pending') ||
    lookupKey.endsWith('pending') ||
    lookupKey.includes('pending');

  const isQueued = lookupKey === 'queued' || lookupKey.includes('queued');

  // 2. Spinner: Any status ending with 'ing' (except pending) or active in-progress states
  const showSpinner =
    !isPending &&
    (isIngStatus(raw) ||
      isIngStatus(lookupKey) ||
      (label && isIngStatus(label)));

  // 3. Reusable Color Variant Resolution
  let variant = VARIANTS[lookupKey] || VARIANTS[raw];

  if (showSpinner) {
    // All active -ing statuses use warning color
    variant = 'warning';
  } else if (!variant) {
    if (isPending || isQueued) {
      variant = 'primary'; // blue
    } else if (
      lookupKey.includes('complete') ||
      lookupKey.includes('resolve') ||
      lookupKey === 'success'
    ) {
      variant = 'success'; // green
    } else if (lookupKey.includes('cancel')) {
      variant = 'secondary'; // gray
    } else if (
      lookupKey.includes('fail') ||
      lookupKey.includes('error') ||
      lookupKey.includes('timeout')
    ) {
      variant = 'destructive'; // red
    } else {
      variant = getMatchingVariant(VARIANTS, lookupKey) || 'secondary';
    }
  }

  // 4. Relevant Icon Resolution
  let Icon = STATUS_ICONS[lookupKey] || STATUS_ICONS[raw];

  if (!Icon) {
    if (isPending || isQueued) {
      Icon = Timer; // queue icon
    } else if (
      lookupKey.includes('complete') ||
      lookupKey.includes('resolve') ||
      lookupKey === 'success'
    ) {
      Icon = CheckCircle2; // tick icon
    } else if (lookupKey.includes('cancel')) {
      Icon = CircleX; // cross icon
    } else if (
      lookupKey.includes('fail') ||
      lookupKey.includes('error') ||
      lookupKey.includes('timeout')
    ) {
      Icon = CircleX; // cross icon
    } else {
      Icon = getMatchingVariant(STATUS_ICONS, lookupKey) || HelpCircle;
    }
  }

  return (
    <Badge
      variant={variant}
      size={size || undefined}
      appearance="outline"
      className={cn(
        'inline-flex w-auto gap-2 items-center whitespace-nowrap',
        className,
      )}
    >
      {/* Show spinner for active "-ing" statuses (excluding pending); otherwise show relevant Lucide icon */}
      {showSpinner ? (
        <Spinner className="animate-spin w-3 h-3 shrink-0" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5 shrink-0" />
      ) : null}

      {label || formatLabel(status)}

      {showPercentage && typeof progress === 'number' && showSpinner && (
        <span>{progress?.toFixed(1)}%</span>
      )}

      {showFound && typeof foundCount === 'number' && showSpinner && (
        <span>(Found {foundCount})</span>
      )}

      {showErrors && typeof errorCount === 'number' && (
        <span>
          ({errorCount} {errorCount === 1 ? 'Error' : 'Errors'})
        </span>
      )}

      {showProgress &&
        progress &&
        typeof progress === 'object' &&
        progress.total !== undefined &&
        showSpinner && (
          <span>
            ({progress.processed || 0} out of {progress.total})
          </span>
        )}
    </Badge>
  );
}

export { StatusBadge };
