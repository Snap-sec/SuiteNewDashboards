import React from 'react';
import { Play } from 'lucide-react';
import { toast } from 'sonner';
import { useRunAllAsmRulesMutation } from '@/services/asm/ruleApi';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinners';

function ExecuteAllRules() {
  // Execute All Rules Mutation
  const [runAllRules, { isLoading: isExecutingRuleSet }] =
    useRunAllAsmRulesMutation();

  const handleExecuteAllRules = () => {
    toast.promise(runAllRules().unwrap(), {
      loading: 'Executing the rule set',
      success: 'Rules executed successfully',
      error: 'Failed to execute ruleset',
    });
  };

  return (
    <Button
      disabled={isExecutingRuleSet}
      onClick={handleExecuteAllRules}
      variant="outline"
    >
      {isExecutingRuleSet ? (
        <Spinner className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Play />
      )}

      {isExecutingRuleSet ? 'Executing All Rules' : 'Execute All Rules'}
    </Button>
  );
}

export default ExecuteAllRules;
