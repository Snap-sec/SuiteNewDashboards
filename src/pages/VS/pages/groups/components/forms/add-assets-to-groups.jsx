import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input, InputWrapper } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomTooltip } from '@/components/custom/tooltip';
import {
  useAddAssetsToVsGroupMutation,
  useGetAllVsGroupAssetsQuery,
} from '../../../../../../services/vs/groupApi';
import { useGetVsAssetsQuery } from '../../../../../../services/vs/vsApi';

/**
 * A form component to add or remove assets from a group.
 *
 * @param {object} props - The component props.
 * @param {string} props.groupId - The ID of the group to modify.
 * @param {function} props.setIsModalOpen - Function to control the modal visibility.
 * @param {Array<object>} [props.currentAssets=[]] - The assets already in the group.
 */
const AddAssetsToGroupForm = ({
  groupId,
  setIsModalOpen,
  currentAssets = [],
}) => {
  const { data: groupAssets, isLoading: isAssetsLoading } =
    useGetAllVsGroupAssetsQuery({ groupId });

  const [limit, setLimit] = useState(20);

  // Initialize selectedAssets with a standardized object structure from currentAssets.
  const [selectedAssets, setSelectedAssets] = React.useState(
    groupAssets?.assets,
  );

  // Update selectedAssets as soon as they are retunred from api
  useEffect(() => {
    setSelectedAssets(() => {
      return groupAssets?.assets?.map((asset) => ({
        id: asset._id, // Correctly use _id
        value: asset?.value, // Correctly use value
        isCurrentAsset: true,
      }));
    });
  }, [groupAssets]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('');

  const {
    data: assetsData,
    isLoading: isAssetsDataLoading,
    isFetching: isAssetsDataFetching,
  } = useGetVsAssetsQuery({
    search: debouncedSearchTerm,
    page: 1,
    limit: limit,
  });

  const [addAssetsToGroup] = useAddAssetsToVsGroupMutation();

  // Toggles the selection of an asset from the fetched list.
  const handleToggleSelect = (asset) => {
    setSelectedAssets((prev) => {
      const alreadySelected = prev.find((a) => a.id === asset._id);
      if (alreadySelected) {
        return prev.filter((a) => a.id !== asset._id);
      }
      // Add the new asset with a consistent object structure.
      return [
        ...prev,
        { id: asset._id, value: asset.value, isCurrentAsset: false },
      ];
    });
  };

  // Deselects an asset from the "Selected Assets" list.
  const handleDeselect = (assetId) => {
    setSelectedAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  // Handles the final submission.
  const handleUpdateAssetsClick = () => {
    const allSelectedIds = selectedAssets.map((asset) => asset.id);

    // Create a Set of original asset IDs for efficient lookup.
    const originalAssetIds = new Set(currentAssets.map((asset) => asset._id));

    // Check if the final selection is identical to the original.
    const isUnchanged =
      allSelectedIds.length === originalAssetIds.size &&
      allSelectedIds.every((id) => originalAssetIds.has(id));

    if (isUnchanged) {
      return toast.error('No changes to save');
    }

    toast.promise(
      addAssetsToGroup({
        groupId: groupId, // Use the passed groupId prop
        assetIds: allSelectedIds,
      }).unwrap(),
      {
        loading: 'Updating assets in group...',
        success: 'Assets updated successfully!',
        error: 'Failed to update assets.',
      },
    );
    setIsModalOpen(false);
  };

  // Debounce the search input to avoid excessive API calls.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Checks if an asset is currently in the selectedAssets state.
  const isAssetSelected = (assetId) => {
    return selectedAssets?.some((asset) => asset?.id === assetId);
  };

  return (
    <div className="mx-auto w-full flex flex-col max-h-[70vh] overflow-y-auto pr-1">
      {/* Search Bar */}
      <div className="relative mb-4">
        <InputWrapper>
          <Search />
          <Input
            type="text"
            placeholder="Type to search assets"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputWrapper>
        {isAssetsDataFetching && (
          <svg
            className="absolute right-2 top-2.5 h-5 w-5 animate-spin text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            ></path>
          </svg>
        )}
      </div>

      {/* Selected Assets */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1">
          {selectedAssets?.length > 0 ? (
            selectedAssets?.map((asset) => (
              <CustomTooltip text={asset.value} key={asset.id}>
                <div className="flex items-center justify-between p-2 border  dark:border-gray-800 rounded text-sm text-gray-700 dark:text-white">
                  <span className="mr-2">
                    {asset.value.length > 20
                      ? `${asset.value.slice(0, 20)}...`
                      : asset.value}
                  </span>
                  <button
                    onClick={() => handleDeselect(asset.id)}
                    className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </CustomTooltip>
            ))
          ) : (
            <div className="rounded border text-sm text-gray-500">
              {isAssetsDataLoading || isAssetsLoading ? (
                <Skeleton className="h-9 rounded bg-gray-200" />
              ) : (
                <div className="p-2 border dark:border-gray-800 rounded text-sm text-gray-500">
                  No Assets selected
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Assets List */}
      <div 
        onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.target;
          if (scrollTop + clientHeight >= scrollHeight - 10) {
            if (limit < assetsData?.total && !isAssetsDataFetching) {
              setLimit((prev) => prev + 20);
            }
          }
        }}
        className="bg-card border border-border shadow-xs  rounded max-h-64 grow kt-scrollable-y-auto p-0"
      >
        {isAssetsDataLoading || isAssetsLoading ? (
          <div className="flex flex-col gap-2 px-2 py-1">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded bg-gray-200" />
            ))}
          </div>
        ) : !assetsData?.assets?.length ? (
          <p className="text-center py-4 text-gray-500">No results found</p>
        ) : (
          assetsData?.assets?.map((asset) => {
            const isSelected = isAssetSelected(asset?._id);
            return (
              <div
                key={asset._id} // Use correct key
                onClick={() => handleToggleSelect(asset)}
                className={`flex items-center p-2 mb-0.5 lg:mb-1.5 cursor-pointer hover:bg-accent ${
                  isSelected ? 'bg-accent' : ''
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleToggleSelect(asset)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-white">
                  {asset.value}
                </span>{' '}
                {/* Display correct property */}
              </div>
            );
          })
        )}
        
        {isAssetsDataFetching && !isAssetsDataLoading && (
           <div className="flex justify-center p-2">
             <svg
                className="h-5 w-5 animate-spin text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
           </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={handleUpdateAssetsClick}>
          <Plus className="mr-2 h-4 w-4" />
          Update Assets
        </Button>
      </div>
    </div>
  );
};

export default AddAssetsToGroupForm;
