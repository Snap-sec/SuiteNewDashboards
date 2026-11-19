import { HexagonBadge } from '@/partials/common/hexagon-badge';
import { Building2, Pencil, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import SeverityLabel from '../../../../../components/custom/severity-label';
import { Button } from '../../../../../components/ui/button';
import { Switch } from '../../../../../components/ui/switch';
import { cvssScoreToSeverity } from '../../../../../lib/helpers';
import { useActiveApisecRuleMutation } from '../../../../../services/apisec/rulesApi';
import useStore from '../../../rule-categories/store';
import DeleteRule from '../actions/delete-rule';

const RuleInfoCardSkeleton = () => {
  return (
    <Card className="flex flex-col gap-4 p-5 h-full">
      <div className="flex justify-between items-start gap-2">
        <div className="flex gap-3">
          <Skeleton className="size-[44px] rounded-lg shrink-0" />
          <div className="flex flex-col gap-1.5 justify-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-5 w-9 rounded-full shrink-0" />
      </div>

      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>

      <div className="mt-2 pt-3 border-t border-border flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <div className="flex items-center gap-1">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </div>
    </Card>
  );
};


const RuleInfoCard = ({
  rule = {},
  badge = {
    size: 'size-[44px]',
    badge: <Building2 className="text-xl text-blue-400" />,
    stroke: 'stroke-blue-200 dark:stroke-blue-950',
    fill: 'fill-blue-50 dark:fill-blue-950/30',
  },
}) => {
  const [updateRule, { isLoading: isUpdating }] = useActiveApisecRuleMutation();
  const setMode = useStore((state) => state.setMode);
  const setSelectedRule = useStore((state) => state.setSelectedRule);
  const setShowModal = useStore((state) => state.setShowModal);

  // Active or deactive rule
  const handleAcitveRule = (value) => {
    toast.promise(updateRule({ ruleId: rule._id, isActive: value }).unwrap(), {
      loading: `${value ? 'Activating' : 'Deactivating'} Rule...`,
      success: (res) => {
        return `Rule ${value ? 'Activated' : 'Deactivated'} Successfully!`;
      },
      error: (err) => {
        console.error('Failed to update rule:', err);
        return (
          err?.data?.message ||
          `Failed to ${value ? 'Activate' : 'Deactivate'} rule.`
        );
      },
    });
  };

  const handleEdit = () => {
    setMode('update');
    setSelectedRule(rule);
    setShowModal(true);
  };

  return (
    <Card className="flex flex-col gap-4 p-5 h-full">
      <div className="flex justify-between items-start gap-2">
        <div className="flex gap-3 min-w-0 flex-1">
          <div className="shrink-0">
            <HexagonBadge {...badge} />
          </div>
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <p title={rule?.rule_name} className="truncate text-base font-semibold leading-none text-foreground">
              {rule?.rule_name}
            </p>
            <div className="w-fit">
              <SeverityLabel
                severity={''}
                score={rule?.parsed_yaml?.report?.cvssScore}
              />
            </div>
          </div>
        </div>

        <AuthorityGuard forbidRoles={['Auditor']}>
          <div className="flex items-center gap-2">
            <Switch
              disabled={isUpdating}
              checked={rule?.isActive}
              size={'sm'}
              onCheckedChange={handleAcitveRule}
            />
          </div>
        </AuthorityGuard>
      </div>

      <div className="flex-1">
        <p
          className="text-sm text-secondary-foreground line-clamp-3"
          title={
            rule?.parsed_yaml?.description ||
            rule?.parsed_yaml?.report?.description
          }
        >
          {rule?.parsed_yaml?.description ||
            rule?.parsed_yaml?.report?.description ||
            'No description available for this rule.'}
        </p>
      </div>

      <div className="mt-2 pt-3 border-t border-border flex items-center justify-between text-sm font-medium text-secondary-foreground">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4" />
          <span>{rule?.vulnerabilities_count || 0} Vulnerabilities</span>
        </div>

        <div className="flex items-center gap-1">
          <AuthorityGuard roles={['Admin']}>
            <Button variant="ghost" onClick={handleEdit}>
              <Pencil />
            </Button>
            <DeleteRule ruleId={rule._id} iconOnly={true} />
          </AuthorityGuard>
        </div>
      </div>
    </Card>
  );
};

export { RuleInfoCard, RuleInfoCardSkeleton };
