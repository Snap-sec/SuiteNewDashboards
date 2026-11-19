import React from 'react';
import { Play } from 'lucide-react';
import { toast } from 'sonner';
import { useRunActiveAsmRulesMutation } from '@/services/asm/ruleApi';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinners';

function ExecuteActiveRules() {
  // Execute Active Rules Mutation
  const [runActiveRules, { isLoading: isExecutingRuleSet }] =
    useRunActiveAsmRulesMutation();

  const handleExecuteActiveRules = () => {
    toast.promise(runActiveRules().unwrap(), {
      loading: 'Executing active rules',
      success: 'Active rules executed successfully',
      error: 'Failed to execute active rules',
    });
  };

  return (
    <Button
      disabled={isExecutingRuleSet}
      onClick={handleExecuteActiveRules}
      variant="outline"
    >
      {isExecutingRuleSet ? (
        <Spinner className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Play />
      )}

      {isExecutingRuleSet ? 'Executing Active Rules' : 'Execute Active Rules'}
    </Button>
  );
}

export default ExecuteActiveRules;
