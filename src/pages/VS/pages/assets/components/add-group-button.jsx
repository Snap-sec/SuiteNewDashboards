import useStore from '../store';

import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CustomTooltip } from '../../../../../components/custom/tooltip';


const AddGroupButton = ({ assetId, groups = [] }) => {

  const setShowAddGroupModal = useStore((state) => state.setShowAddGroupModal);
  const setSelectedAsset = useStore((state) => state.setSelectedAsset);
  const setSelectedGroups = useStore((state) => state.setSelectedGroups);



  const handleClick = () => {
    setShowAddGroupModal(true);
    setSelectedAsset(assetId);
    setSelectedGroups(() => groups);
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => handleClick()}>
      <Plus />
    </Button>
  )
}

export default AddGroupButton;