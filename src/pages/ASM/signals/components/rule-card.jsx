import { Clock, Ellipsis, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { timeAgo } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch, SwitchWrapper } from '@/components/ui/switch';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';


function TrendBadge({ rule }) {
  const trend = typeof rule?.trend === 'number' ? rule.trend : 0;
  if (trend === 0) {
    return <span className="text-xs text-muted-foreground flex items-center gap-1"><Minus className="size-3" /> 0%</span>;
  }
  const isUp = trend > 0;
  return (
    <span className={`text-xs flex items-center gap-0.5 font-medium ${isUp ? 'text-red-600' : 'text-green-600'}`}>
      {isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
      {isUp ? '+' : ''}{trend}%
    </span>
  );
}

function MiniRiskLabel({ severity }) {
  const normalized = severity?.toLowerCase() || 'none';
  const colors = {
    critical: 'bg-red-500 text-red-600 dark:text-red-400',
    high: 'bg-orange-500 text-orange-600 dark:text-orange-400',
    medium: 'bg-yellow-500 text-yellow-600 dark:text-yellow-400',
    low: 'bg-green-500 text-green-600 dark:text-green-400',
    info: 'bg-blue-500 text-blue-600 dark:text-blue-400',
    none: 'bg-gray-500 text-gray-600 dark:text-gray-400',
    info: 'bg-gray-500 text-gray-600 dark:text-gray-400',
  };

  const selected = colors[normalized];
  if (!selected) return null;
  const [bgClass, textClassLight, textClassDark] = selected.split(' ');

  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${bgClass}`} />
      <span className={`text-[12px] font-medium capitalize ${textClassLight} ${textClassDark}`}>
        {severity}
      </span>
    </div>
  );
}

// ── Rule Card Skeleton ────────────────────────────

export function RuleCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Skeleton className="h-4 w-7 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-md" />
        </div>
      </div>
      {/* Stats row */}
      <div className="flex items-start gap-6">
        <div className="flex flex-col gap-1.5 w-[65px]">
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-5 w-8" />
        </div>
        <div className="flex flex-col gap-1.5 w-[70px]">
          <Skeleton className="h-2.5 w-8" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-2.5 w-14" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

// ── Rule Sidebar Card ─────────────────────

export function RuleCard({ rule, isActive, onClick, onToggle, onExecute, onDelete, onEdit }) {
  return (
    <Card
      className={`cursor-pointer transition-all relative border overflow-hidden ${
        isActive
          ? 'border-l-[3px] border-l-primary shadow-sm'
          : 'hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground leading-tight line-clamp-2">
              {rule.name}
            </h4>
          </div>

          <AuthorityGuard forbidRoles={['Auditor']}>
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 shrink-0"
                  >
                    <Ellipsis className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={() => onEdit(rule)}>
                    Edit Rule
                  </DropdownMenuItem>
                  {/* <DropdownMenuSeparator/> */}
                  <DropdownMenuItem
                    onClick={() => onToggle(rule, rule.enabled === false)}
                  >
                    {rule.enabled !== false ? 'Disable Rule' : 'Enable Rule'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator/>
                  {/* <DropdownMenuItem onClick={() => onExecute(rule._id)}>Execute Now</DropdownMenuItem> */}
                  <DropdownMenuItem variant="destructive" asChild>
                    <ButtonWithConfirm
                      variant="ghost"
                      confirm={true}
                      onConfirm={() => onDelete(rule._id)}
                      confirmButton={<Button variant="primary">Delete</Button>}
                      cancelButton={<Button variant="outline">Cancel</Button>}
                      className="w-full justify-start h-8 px-2 text-destructive hover:text-destructive font-normal"
                    >
                      Delete Rule
                    </ButtonWithConfirm>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </AuthorityGuard>
        </div>

        <div className="flex items-start gap-6 mt-4">
          <div className="flex flex-col gap-1.5 w-[65px]">
            <span className="text-[11px] text-muted-foreground leading-none font-medium uppercase tracking-wider">
              Assets
            </span>
            <div className="flex flex-col justify-center h-6">
              <span className="text-xl font-semibold text-foreground leading-none">
                {rule.exposure_count || 0}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 w-[70px]">
            <span className="text-[11px] text-muted-foreground leading-none font-medium uppercase tracking-wider">
              Risk
            </span>
            <div className="flex items-center h-6">
              <MiniRiskLabel severity={rule.risk} />
            </div>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider whitespace-nowrap">
              Trend
            </span>
            <div className="flex items-center gap-1 h-5">
              <TrendBadge rule={rule} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}