import React from 'react';
import { Play } from 'lucide-react';
import { toast } from 'sonner';
import { useExecuteSingleAimPolicyMutation } from '@/services/asset-inventory/policyApi';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinners';

function ExecuteSinglePolicy({ policyId }) {
    // Execute All Rules Mutation
    const [executeSinglePolicy, { isLoading: isExecutingPolicy }] =
        useExecuteSingleAimPolicyMutation();

    const handleExecuteSinglePolicy = () => {
        toast.promise(executeSinglePolicy(policyId).unwrap(), {
            loading: 'Executing a Policy..',
            success: 'Policy executed successfully',
            error: 'Failed to execute Policy',
        });
    };

    return (
        <Button
            disabled={isExecutingPolicy}
            onClick={handleExecuteSinglePolicy}
            variant="ghost"
        >
            {isExecutingPolicy ? (
                <Spinner className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Play />
            )}
        </Button>
    );
}

export default ExecuteSinglePolicy;
