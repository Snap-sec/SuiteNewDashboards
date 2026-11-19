// THIS COMPONENT IS USED TO UPDATE THE ASSET NAME IN EDIT ASSET PAGE

import { useState } from 'react';
import { Save, SquarePen } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateAimAssetMutation } from '@/services/asset-inventory/assets/assetsApi';
import { Input } from '@/components/ui/input';

function BasicDetailsAssetNameInput({ assetId, name = '' }) {
  const [updateAsset, { isLoading: isUpdatingAsset }] =
    useUpdateAimAssetMutation();

  const [updatedName, setUpdatedName] = useState(name || '');

  const [isEditingName, SetIsEditingName] = useState(false);

  const handleEditAssetName = () => {
    if (!updatedName) return toast.error("Asset Name can't be Empity!");

    toast.promise(
      updateAsset({
        id: assetId,
        body: { name: updatedName },
      }).unwrap(),
      {
        loading: 'Updating Asset Name',
        success: () => {
          SetIsEditingName(false);
          return 'Asset Name Updated Successfully';
        },
        error: 'Error Updating Asset Name',
      },
    );
  };

  return (
    <div className="flex items-center">
      {/* Value / Input */}
      <div className="w-full py-2 text-foreground font-normal text-sm">
        {isEditingName ? (
          <Input
            value={updatedName}
            onChange={(e) => setUpdatedName((prev) => e.target.value)}
            className="max-w-[300px]"
          />
        ) : (
          updatedName || "N/A"
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        {isEditingName ? (
          <div className='p-2 rounded-lg hover:bg-accent cursor-pointer' onClick={handleEditAssetName}>
            <Save
              className="h-3 w-3"

            />
          </div>
        ) : (
          <div className='p-2 rounded-lg hover:bg-accent cursor-pointer' onClick={() => SetIsEditingName(true)}>
            <SquarePen className="h-3 w-3" />
          </div>
        )}
      </div>
    </div>
  );
}

export default BasicDetailsAssetNameInput;
