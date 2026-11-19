import { Modal } from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import useStore from "../store";
import Select from "@/components/custom/select";

import { useGetVsGroupsQuery } from "@/services/vs/groupApi";
import { useAddToVsGroupMutation } from "@/services/vs/assetApi";
import { useState } from "react";
import { toast } from "sonner";
import { useEffect } from "react";


function AddGroup() {

    const [selectedGroup, setSelectedGroup] = useState("");

    const { data: groups, isLoading: groupsLoading } = useGetVsGroupsQuery();
    const [addToGroup, {isLoading: isAdding}] = useAddToVsGroupMutation();

    // exclude already assigned groups 
    const [filteredGroups, setFilteredGroups] = useState([])

    const showAddGroupModal = useStore((state) => state.showAddGroupModal);
    const setShowAddGroupModal = useStore((state) => state.setShowAddGroupModal);
    const selectedAsset = useStore((state) => state.selectedAsset);
    const alreadySelectedGroups = useStore((state) => state.selectedGroups);

    useEffect(() => {
    if (!groups?.groups) return;

    const alreadyAssignedIds = alreadySelectedGroups?.map(g => g._id) ?? [];

    const filtered = groups.groups.filter(
        (g) => !alreadyAssignedIds.includes(g._id)
    );

    setFilteredGroups(filtered);
}, [groups, alreadySelectedGroups]);


    const handleAddToGroup = () => {

        toast.promise(addToGroup({ assetId: selectedAsset, groupId: selectedGroup }).unwrap(), {
            loading: "Adding asset to the group",
            success: (res) => { setShowAddGroupModal(false); return "Asset added to the group" },
            error: "Asset could not be added to group"
        });
    };

    return (
        <Modal
            title="Add To Group"
            description="Add this asset to a group"
            open={showAddGroupModal}
            setOpen={setShowAddGroupModal}
            footer={
                <div className="w-full flex gap-2 items-center justify-end">
                    <Button variant="destructive" onClick={() => setShowAddGroupModal(false)} >
                        Cancel
                    </Button>    
                    <Button disabled={isAdding || !selectedGroup || !selectedAsset} onClick={() => handleAddToGroup()}>
                        {isAdding ? "Adding" : "Add To Group"}
                    </Button>    
                </div>
            }
        >
            <div className="">
                <p className="text-[12px] mb-2">Select Group</p>
                <Select options={filteredGroups?.map(g => ({ label: g.name, value: g._id}))} enableSearch={false} onChange={(option) => { setSelectedGroup(option.value) }} />
            </div>
        </Modal>
    )
}

export default AddGroup