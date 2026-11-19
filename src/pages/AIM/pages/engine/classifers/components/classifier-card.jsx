import { Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';


// ── Skeleton ────────────────────────────────────────

export function ClassifierCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
        <Skeleton className="h-6 w-6 rounded-md shrink-0" />
      </div>
      <div className="flex items-start gap-6">
        <div className="flex flex-col gap-1.5 w-[75px]">
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-5 w-8" />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}


// ── Card ─────────────────────────────────────────────

export function ClassifierCard({
  classifier,
  isActive,
  onClick,
  onToggle,
  onExecute,
  onEdit,
  onDelete,
}) {
  const isEnabled = classifier.enabled !== false;

  return (
    <Card
      className={`cursor-pointer transition-all relative border overflow-hidden ${isActive
        ? 'border-l-[3px] border-l-primary shadow-sm'
        : 'hover:shadow-sm'
        }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground leading-tight line-clamp-2">
              {classifier.name}
            </h4>
            <p className='text-[11px] text-muted-foreground mt-1 line-clamp-1'>
              {classifier.description}
            </p>
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
                  <DropdownMenuItem onClick={() => onExecute(classifier._id)}>
                    Execute
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(classifier._id)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onToggle(classifier, !isEnabled)}
                  >
                    {isEnabled ? 'Disable' : 'Enable'}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" asChild>
                    <ButtonWithConfirm
                      variant="ghost"
                      confirm={true}
                      onConfirm={() => onDelete(classifier._id)}
                      confirmButton={<Button variant="primary">Delete</Button>}
                      cancelButton={<Button variant="outline">Cancel</Button>}
                      className="w-full justify-start h-8 px-2 text-destructive hover:text-destructive font-normal"
                    >
                      Delete
                    </ButtonWithConfirm>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </AuthorityGuard>
        </div>

        {/* Stats row */}
        <div className="flex items-start gap-6 mt-4">
          <div className="flex flex-col gap-1.5 w-[75px]">
            <span className="text-[11px] text-muted-foreground leading-none font-medium uppercase tracking-wider">
              Matched
            </span>
            <div className="flex flex-col justify-center h-6">
              <span className="text-xl font-semibold text-foreground leading-none">
                {classifier.matched_assets ?? 0}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[11px] text-muted-foreground leading-none font-medium uppercase tracking-wider">
              Status
            </span>
            <div className="flex items-center h-6">
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-2 w-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                />
                <span
                  className={`text-[12px] font-medium ${isEnabled
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-muted-foreground'
                    }`}
                >
                  {isEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
