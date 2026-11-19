import { useState } from 'react';
import { Boxes, EllipsisVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/custom/modal';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import { useDeleteVsGroupMutation } from '../../../../../../services/vs/groupApi';
import DropdownMenu from '../dropdowns/group-info-card-dropdown';
import AddAssetsToGroupForm from '../forms/add-assets-to-groups';
import EditGroupModal from '../modals/post-group-modal';
import ViewGroupAssetsModal from '../modals/view-group-assets-modal';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';

const InfoCard = ({ item, dropdown }) => {
  const [isAddAssetsModalOpen, setIsAddAssetsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewAssetsModalOpen, setIsViewAssetsModalOpen] = useState(false);

  const [deleteGroupById] = useDeleteVsGroupMutation();

  const handleDeleteList = () => {
    if (!item?._id.trim()) return toast.error('Asset Group Id is Required');

    toast.promise(deleteGroupById(item?._id).unwrap(), {
      loading: 'Deleting Asset Group',
      success: 'Asset Group Deleted',
      error: 'Failed to Delete Asset Group',
    });
  };

  const handleEditList = () => {
    setIsEditModalOpen(true);
  };

  return (
    <Card className="p-5 lg:p-7.5 lg:pt-7">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <Boxes className="text-xl text-blue-500" />

          <AuthorityGuard forbidRoles={['Auditor']}>
            {dropdown && (
              <DropdownMenu
                trigger={
                  <Button variant="ghost" mode="icon">
                    <EllipsisVertical />
                  </Button>
                }
                onAddVulnerabilities={() => setIsAddAssetsModalOpen(true)}
                onDeleteList={handleDeleteList} // pass down delete handler
                onEditList={() => handleEditList()} // Open Post vuln list details modal
              />
            )}
          </AuthorityGuard>
        </div>

        <div className="flex justify-between gap-8">
          <div className="flex flex-col gap-3">
            <Link
              to={`/vs/assets?groupId=${item._id}`}
              className="text-base font-medium leading-none text-mono hover:text-primary"
            >
              {item?.name || ''}
            </Link>
            <span className="text-sm text-secondary-foreground leading-5">
              {item?.description || ''}
            </span>
          </div>

          <div className="flex flex-col gap-3">


            <Button mode="link" underlined="dashed" onClick={() => setIsViewAssetsModalOpen(true)}>
              {item?.totalAssets}
              <p className=" text-xs">Assets</p>
            </Button>

          </div>
        </div>
        {(() => {
          const allItems = [
            { number: item?.vulnCount?.critical || 0, label: 'C' },
            { number: item?.vulnCount?.high || 0, label: 'H' },
            { number: item?.vulnCount?.medium || 0, label: 'M' },
            { number: item?.vulnCount?.low || 0, label: 'L' },
            { number: item?.vulnCount?.info || 0, label: 'I' },
          ];
          const filteredItems = allItems.filter(i => i.number > 0);

          return filteredItems.length > 0 ? (
            <VulnerabilityLables items={filteredItems} />
          ) : (
            <span className="text-sm px-2 py-1 border border-border shadow-xs black/5 rounded-md flex bg-accent/60 w-fit">
              No Active Vulnerabilities
            </span>
          );
        })()}
      </div>

      {/* Open Add assets modal  */}
      {isAddAssetsModalOpen && (
        <Modal
          className="w-[calc(100vw-2rem)] sm:w-[90vw] md:w-[500px] lg:w-[600px] xl:w-[750px] max-h-[95vh] flex flex-col"
          title={
            item?.totalAssets == 0
              ? 'Add Assets To Group'
              : 'Manage Group Assets'
          }
          description="Add or Remove group assets."
          open={isAddAssetsModalOpen}
          setOpen={setIsAddAssetsModalOpen}
        >
          <AddAssetsToGroupForm
            groupId={item?._id}
            setIsModalOpen={setIsAddAssetsModalOpen}
          />
        </Modal>
      )}

      {/* Open edit vuln list details modal */}
      <EditGroupModal
        groupId={item?._id}
        groupName={item?.name}
        groupDescription={item?.description}
        triggeredBtnText="Edit"
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
      />

      {/* Open View Assets Modal */}
      <ViewGroupAssetsModal
        groupId={item?._id}
        groupName={item?.name}
        isOpen={isViewAssetsModalOpen}
        setIsOpen={setIsViewAssetsModalOpen}
      />
    </Card>
  );
};

export function GroupInfoCardSkeleton() {
  return (
    <Card className="p-5 lg:p-7.5 lg:pt-7 flex flex-col gap-4">
      {/* Top Row: Icon + Menu */}
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-6 w-6 rounded-md" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>

      {/* Middle Row: Title/Description + Asset Count */}
      <div className="flex justify-between gap-8">
        <div className="flex flex-col gap-2.5 flex-1">
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-3 w-8 rounded-md" />
        </div>
      </div>

      {/* Bottom Row: Vulnerabilities Labels */}
      <div className="flex items-center gap-1.5 pt-1">
        <Skeleton className="h-6 w-10 rounded-md" />
        <Skeleton className="h-6 w-10 rounded-md" />
        <Skeleton className="h-6 w-10 rounded-md" />
        <Skeleton className="h-6 w-10 rounded-md" />
      </div>
    </Card>
  );
}

export { InfoCard as GroupInfoCard };
export default InfoCard;
