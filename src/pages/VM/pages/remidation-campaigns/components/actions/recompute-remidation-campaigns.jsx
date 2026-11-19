import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useRecomputeVmRemidationCampaignsMutation } from '@/services/vm/remidationCampaignApi';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinners';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';

function RecomputeRemidationCampaigns({ iconOnly = false, ...props }) {
  const [recompute, { isLoading: isRecomputing }] =
    useRecomputeVmRemidationCampaignsMutation();

  const handleRecompute = () => {
    toast.promise(recompute().unwrap(), {
      loading: 'Recomputing Campaigns..',
      success: 'Campaigns Recomputed Successfully',
      error: 'Failed to recompute Campaigns',
    });
  };

  return (
    <CustomTooltip text="Recompute Campaigns">
      <ButtonWithConfirm
        disabled={isRecomputing}
        variant="primary"
        confirm={true}
        onConfirm={() => handleRecompute()}
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
            <RefreshCcw className="size-4" /> Recompute
          </div>
        )}
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}

export default RecomputeRemidationCampaigns;
