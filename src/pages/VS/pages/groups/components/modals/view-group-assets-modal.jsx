import { Modal } from '@/components/custom/modal';
import { useGetAllVsGroupAssetsQuery } from '../../../../../../services/vs/groupApi';
import { Skeleton } from '@/components/ui/skeleton';

const ViewGroupAssetsModal = ({ groupId, isOpen, setIsOpen, groupName }) => {
  const { data: groupAssets, isLoading } = useGetAllVsGroupAssetsQuery(
    { groupId },
    {
      skip: !isOpen || !groupId, // Skip if modal is closed or no groupId
    }
  );

  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title={`Assets in ${groupName || 'Group'}`}
      description="List of assets in this group."
      className="w-[calc(100vw-2rem)] sm:w-[90vw] md:w-[500px] lg:w-[600px] max-h-[85vh] flex flex-col"
    >
      <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded" />
            ))}
          </div>
        ) : groupAssets?.assets?.length > 0 ? (
          groupAssets.assets.map((asset) => (
            <div key={asset._id} className="p-2.5 border border-border/60 rounded-md text-sm font-mono break-all bg-muted/20">
              {asset.value}
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-6 text-sm">
            No assets found in this group.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewGroupAssetsModal;
