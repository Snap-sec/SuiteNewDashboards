import { useState } from 'react';
import { SquarePen } from 'lucide-react';
import { toast } from 'sonner';
import SingleBusinessUnitSelector from '@/components/common/single-business-unit-selector';
import { useUpdateAimAssetMutation } from '../../../../../../../services/asset-inventory/assets/assetsApi';
import { useGetAimBusinessUnitsQuery } from '@/services/asset-inventory/businessUnitsApi';

function UpdateBusinessUnit({ assetData = {} }) {
  const [updateAsset, { isLoading: isUpdating }] = useUpdateAimAssetMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState(
    assetData?.businessUnitIds?.[0],
  );

  const handleChangeAssetBusinessUnit = (businessUnitId) => {
    toast.promise(
      updateAsset({
        id: assetData?._id,
        body: {
          businessUnitIds: [businessUnitId],
        },
      }).unwrap(),
      {
        loading: 'Changing Business Unit...',
        success: () => {
          setIsEditing(false);
          return 'Business Unit Changed Successfully';
        },
        error: 'Error Changing Business Unit.',
      },
    );
  };

  return (
    <div className="flex flex-col px-2.75 py-2.25 border border-dashed border-input rounded-md">
      {!isEditing && (
        <>
          <div className="flex items-center gap-3">
            <span className="text-mono text-sm leading-none font-medium">
              {assetData?.businessUnits?.[0]?.name || ''}
            </span>
            <div className=" cursor-pointer">
              <button
                type="button"
                aria-label="Edit Owner"
                onClick={() => setIsEditing(true)}
                className="cursor-pointer"
              >
                <SquarePen className="w-3 h-3" />
              </button>
            </div>
          </div>

          <span className="text-secondary-foreground text-xs">
            Business Unit
          </span>
        </>
      )}

      {isEditing && (
        <SingleBusinessUnitSelector
          onChange={(e) => {
            handleChangeAssetBusinessUnit(e.id || e);
            setSelectedBusinessUnits(e.id || e);
          }}
          showLabel={false}
          value={selectedBusinessUnits}
          queryEndpoint={useGetAimBusinessUnitsQuery}
          disabled={isUpdating}
        />
      )}
    </div>
  );
}

export default UpdateBusinessUnit;
