import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useRecomputeVmRemidationCampaignByIdMutation } from '@/services/vm/remidationCampaignApi';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinners';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';

export default function RecomputeRemidationCampaign({
  campaignId,
  iconOnly = false,
  ...props
}) {
  const [recompute, { isLoading: isRecomputing }] =
    useRecomputeVmRemidationCampaignByIdMutation();

  const handleRecompute = () => {
    toast.promise(recompute(campaignId).unwrap(), {
      loading: 'Recomputing Remediation Campaign...',
      success: 'Remediation Campaign Recomputed Successfully',
      error: 'Failed to recompute Remediation Campaign',
    });
  };

  return (
    <CustomTooltip text="Recompute Campaign">
      <div>
        <ButtonWithConfirm
          disabled={isRecomputing}
          variant="outline"
          confirm={true}
          onConfirm={() => handleRecompute()}
          confirmVariant="info"
          confirmTitle="Recompute Campaign?"
          dialog="This will trigger a recomputation of the vulnerability states and assets for this remediation campaign. Proceed?"
          confirmButton={<Button variant="primary">Proceed</Button>}
          cancelButton={<Button variant="outline">Cancel</Button>}
          className={iconOnly ? 'text-secondary-foreground' : 'flex'}
          {...props}
        >
          {isRecomputing ? (
            <Spinner className="w-4 h-4 animate-spin" />
          ) : iconOnly ? (
            <RefreshCcw className="size-4" />
          ) : (
            <div className="font-normal flex gap-2 w-full items-center">
              <RefreshCcw className="size-4" />
            </div>
          )}
        </ButtonWithConfirm>
      </div>
    </CustomTooltip>
  );
}
