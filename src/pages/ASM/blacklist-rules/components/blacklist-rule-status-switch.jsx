import React from 'react';
import { toast } from 'sonner';
import { Switch, SwitchIndicator, SwitchWrapper } from '@/components/ui/switch';
import { useAuth } from '@/auth/context/auth-context';
import { useToggleAsmBlacklistRuleStatusMutation } from '@/services/asm/blacklistRulesApi';

export const BlacklistRuleStatusSwitch = ({ rule }) => {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';
  const [toggleRule, { isLoading }] = useToggleAsmBlacklistRuleStatusMutation();

  const handleToggle = (checked) => {
    if (isAuditor) return;
    const ruleId = rule._id || rule.id;
    toast.promise(toggleRule({ id: ruleId, enabled: checked }).unwrap(), {
      loading: 'Updating Status',
      success: 'Status Updated',
      error: 'Failed to update status',
    });
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <SwitchWrapper className={isAuditor || isLoading ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}>
        <Switch
          checked={rule.enabled !== false}
          onCheckedChange={handleToggle}
          disabled={isAuditor || isLoading}
          size="md"
        />
        {/* <SwitchIndicator state="on" className="text-[10px] font-bold">
          ON
        </SwitchIndicator>
        <SwitchIndicator state="off" className="text-[10px] font-bold">
          OFF
        </SwitchIndicator> */}
      </SwitchWrapper>
    </div>
  );
};

export default BlacklistRuleStatusSwitch;
