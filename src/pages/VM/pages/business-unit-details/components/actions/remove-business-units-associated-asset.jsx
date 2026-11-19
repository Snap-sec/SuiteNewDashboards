import { MinusCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinners';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import { useRemoveAimBusinessUnitAssociatedAssetsMutation } from '@/services/asset-inventory/businessUnitsApi';

function RemoveAssociatedAsset({
  businessUnitId,
  assetId,
  iconOnly = false,
  ...props
}) {
  const [removeAsset, { isLoading: isRemovingAssets }] =
    useRemoveAimBusinessUnitAssociatedAssetsMutation();

  const handleRemove = async () => {
    try {
      await removeAsset({ businessUnitId, assetId }).unwrap();
      toast.success('Asset removed successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to remove asset');
    }
  };

  return (
    <CustomTooltip text="Remove">
      <ButtonWithConfirm
        disabled={isRemovingAssets}
        variant="ghost"
        confirm={true}
        onConfirm={handleRemove}
        confirmButton={<Button variant="primary">Proceed</Button>}
        cancelButton={<Button variant="outline">Cancel</Button>}
        className={iconOnly ? 'text-secondary-foreground' : 'flex'}
        {...props}
      >
        {isRemovingAssets ? (
          <Spinner className="w-4 h-4 animate-spin" />
        ) : iconOnly ? (
          <MinusCircleIcon className="size-4" />
        ) : (
          <div className=" font-normal flex gap-2 w-full">
            <MinusCircleIcon className="size-4" /> Remove
          </div>
        )}
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}

export default RemoveAssociatedAsset;
