import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useRecomputeAsmAnalyticsDashboardMutation } from '@/services/asm/dashboardApi';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';

export default function RecomputeDashboardAction({
  iconOnly = false,
  tooltipText = 'Recompute Dashboard',
  confirmTitle = 'Recompute Dashboard?',
  dialog = 'This will trigger a full recomputation of all dashboard metrics. This may take a moment.',
  confirmVariant = 'warning',
  ...props
}) {
  const [recompute, { isLoading: isRecomputing }] =
    useRecomputeAsmAnalyticsDashboardMutation();

  const handleRecompute = () => {
    toast.promise(recompute().unwrap(), {
      loading: 'Recomputing dashboard...',
      success: 'Dashboard recomputed successfully',
      error: (err) =>
        err?.data?.message || 'Failed to recompute dashboard',
    });
  };

  return (
    <CustomTooltip text={tooltipText}>
      <ButtonWithConfirm
        disabled={isRecomputing}
        variant="outline"
        confirm={true}
        confirmVariant={confirmVariant}
        confirmTitle={confirmTitle}
        dialog={dialog}
        onConfirm={handleRecompute}
        className={iconOnly ? 'text-secondary-foreground' : 'flex'}
        {...props}
      >
        {iconOnly ? (
          <RefreshCcw className={`size-4 ${isRecomputing ? 'animate-spin' : ''}`} />
        ) : (
          <div className="font-normal flex gap-2 w-full items-center">
            <RefreshCcw className={`size-4 ${isRecomputing ? 'animate-spin' : ''}`} /> Recompute
          </div>
        )}
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}
