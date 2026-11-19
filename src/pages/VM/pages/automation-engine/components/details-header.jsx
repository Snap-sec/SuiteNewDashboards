import { Calendar, ChevronRight, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { DateFormatter } from '@/components/custom/date-formatter';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import EditAutomationRuleModal from './edit-automation-rule-modal';

export function AutomationDetailsHeader({ activeRule, origin, isExecuting, onExecute }) {
  return (
    <header className="mb-4 flex items-start gap-3">
      <div className="flex items-start justify-between w-full">
        <div>
          <div className="relative pl-3">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
            <h1 className="text-2xl font-semibold text-foreground leading-tight">
              {activeRule.name}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3 pl-3">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Created:{' '}
              <span className="text-foreground/80">
                <DateFormatter date={activeRule.createdAt} mode="long" />
              </span>
            </span>
            <span>•</span>
            <AuthorityGuard forbidRoles={['Auditor']}>
              <EditAutomationRuleModal
                rule={activeRule}
                origin={origin}
                trigger={
                  <button className="text-primary font-medium hover:underline flex items-center gap-0.5 group">
                    Edit rule{' '}
                    <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                }
              />
            </AuthorityGuard>
          </div>
        </div>

        <AuthorityGuard forbidRoles={['Auditor']}>
          <ButtonWithConfirm
            variant="outline"
            confirm={true}
            onConfirm={() => onExecute(activeRule._id)}
            confirmButton={<Button variant="primary">Execute</Button>}
            cancelButton={<Button variant="outline">Cancel</Button>}
            className="w-full justify-start h-8 px-2 font-normal"
          >
            {isExecuting ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : (
              <Play className="size-4 mr-2" />
            )}
            Execute Now{' '}
          </ButtonWithConfirm>
        </AuthorityGuard>
      </div>
    </header>
  );
}
