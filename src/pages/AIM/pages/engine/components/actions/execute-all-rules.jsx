import React from 'react';
import { Play } from 'lucide-react';
import { toast } from 'sonner';
import { useExecuteAllAimPolicyMutation } from '@/services/asset-inventory/policyApi';
import { Spinner } from '@/components/ui/spinners';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';

function ExecuteAllPolicies({ policyType = "classifier" }) {
    // Execute All Rules Mutation
    const [executeAllPolicyRules, { isLoading: isExecutingRuleSet }] =
        useExecuteAllAimPolicyMutation();

    const handleExecuteAllPolicies = () => {
        toast.promise(executeAllPolicyRules(policyType).unwrap(), {
            loading: 'Executing all policies..',
            success: 'Policies executed successfully',
            error: 'Failed to execute Policies',
        });
    };

    return (
        <ButtonWithConfirm
            confirm
            confirmVariant="success"
            disabled={isExecutingRuleSet}
            onConfirm={handleExecuteAllPolicies}
            variant="outline"
            dialog="This will execute all policy rules. Are you sure you want to proceed?"
        >
            {isExecutingRuleSet ? (
                <Spinner className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Play />
            )}

            {isExecutingRuleSet ? 'Executing All Rules' : 'Execute All Rules'}
        </ButtonWithConfirm>
    );
}

export default ExecuteAllPolicies;
