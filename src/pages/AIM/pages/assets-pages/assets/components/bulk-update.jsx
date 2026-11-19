import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FloatingCard from "../../../../../../components/custom/floating-card";
import {  useDeleteBulkAimAssetsMutation } from "../../../../../../services/asset-inventory/assets/assetsApi";
import { useUpdateAimAssetBulkMutation } from "../../../../../../services/asset-inventory/assets/assetsApi";
import SelectWithAvatar from "../../../../../../components/custom/select-with-avatar";
import { useGetOrgMembersQuery } from "../../../../../../services/auth/orgApi";
import useStore from "../../store";
import { Settings2, ShieldUser, Component, Building2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Select from '@/components/custom/select';
import { toast } from "sonner";
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import AuthorityGuard from "../../../../../../components/custom/authority-guard/AuthorityGuard";
import { useAimBusinessUnitBulkAssignMutation, useGetAimBusinessUnitsQuery } from "@/services/asset-inventory/businessUnitsApi";
import MultiSelect from "@/components/custom/multi-select";

const EnvironmentOptions = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'development', label: 'Development' },
];

function BulkUpdate() {
  const { data: orgMembers, isLoading: membersLoading } = useGetOrgMembersQuery();
  const location = useLocation();
  const isAdvancedSearch = location.pathname === '/assetinventory/advance-search';
  const [showSelect, setShowSelect] = useState(false);
  const [showSelect2, setShowSelect2] = useState(false);
  const [showSelect3, setShowSelect3] = useState(false);

  const { data: businessUnitsData, isLoading: isBULoading } = useGetAimBusinessUnitsQuery();

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState([]);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);

  const [bulkUpdate, { isLoading: isUpdating }] = useUpdateAimAssetBulkMutation();
  const [deleteBulkAssets, { isLoading: isDeleting }] = useDeleteBulkAimAssetsMutation();
  const [businessUnitBulkAssign, { isLoading: isAssigning }] = useAimBusinessUnitBulkAssignMutation();


  // Prepare options for business unit select
  const businessUnitOptions = (businessUnitsData?.businessUnits || []).map(bu => ({
    id: bu._id,
    label: bu.name,
    value: bu._id
  }));

  // Get selected asset IDs
  const selectedAssetIds = Object.keys(rowSelection || {}).filter(
    (id) => rowSelection[id]
  );

  // Find selected user object
  const selectedUser = orgMembers?.data?.members?.find(
    (user) => user._id === selectedUserId
  );

  const handleUserChange = (userId) => {
    setSelectedUserId(userId);
  };

  // Bulk update handler
  const handleBulkUpdate = async () => {
    const updates = {};
    if (selectedUser) {
      updates.owner = {
        name: selectedUser.name,
        email: selectedUser.email,
        userId: selectedUser._id,
        role: selectedUser.role,
      };
    }
    if (selectedEnvironment) {
      updates.environment = selectedEnvironment;
    }
    if (selectedGroupId) {
      updates.groupId = selectedGroupId;
    }

    const hasUpdates = Object.keys(updates).length > 0;
    const hasBUs = selectedBusinessUnits.length > 0;

    console.log(updates, selectedAssetIds, "XXXXSSSSSSSSSSSSSSSSSSSWAAA");


    if (selectedAssetIds.length === 0 || (!hasUpdates && !hasBUs)) return;
    try {
      const promises = [];
      if (hasUpdates) {
        promises.push(bulkUpdate({
          ids: selectedAssetIds,
          payload: updates,
        }).unwrap());
      }
      if (hasBUs) {
        promises.push(businessUnitBulkAssign({
          assetIds: selectedAssetIds,
          businessUnitIds: selectedBusinessUnits.map(bu => bu.id),
        }).unwrap());
      }

      await Promise.all(promises);
      toast.success("Assets updated successfully");
      setRowSelection({});
    } catch (err) {
      toast.error("Failed to update assets");
    }
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedAssetIds.length === 0) return;
    try {
      await deleteBulkAssets({
        assetIds: selectedAssetIds,
      }).unwrap();
      toast.success("Assets deleted successfully");
      setRowSelection({});
    } catch (err) {
      toast.error("Failed to delete assets");
    }
  };

  const isButtonDisabled =
    selectedAssetIds.length === 0 ||
    (!selectedUserId && !selectedEnvironment && !selectedGroupId && selectedBusinessUnits.length === 0) ||
    isUpdating ||
    isAssigning;

  const isDeleteDisabled = selectedAssetIds.length === 0 || isDeleting;

  return (
    <FloatingCard
      position="sticky-bottom"
      updateButton={{
        text: (isUpdating || isAssigning) ? "Updating..." : "Update",
        onClick: handleBulkUpdate,
        disabled: isButtonDisabled,
      }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex justify-center items-center gap-6">
          <div>
            <SelectWithAvatar
              users={orgMembers?.data?.members}
              onChange={handleUserChange}
              searchFields={["name", "email"]}
              placeholder="Owner"
              icon={<ShieldUser />}
            />
          </div>
          {isAdvancedSearch && (
            <>
              {/* <div>
                {showSelect ? (
                  <Select
                    options={EnvironmentOptions}
                    placeholder="Select environment"
                    className="w-40"
                    enableSearch={false}
                    onChange={(selected) => setSelectedEnvironment(selected?.value)}
                  />
                ) : (
                  <Button variant="outline" onClick={() => setShowSelect(true)}>
                    <Settings2 />
                    Environment
                  </Button>
                )}
              </div> */}
              {/* <div>
                {showSelect2 ? (
                  <Select
                    options={groupOptions}
                    placeholder="Select a group"
                    className="w-40"
                    onChange={(selected) => setSelectedGroupId(selected?.value)}
                  />
                ) : (
                  <Button variant="outline" onClick={() => setShowSelect2(true)}>
                    <Component />
                    Groups
                  </Button>
                )}
              </div> */}
            </>
          )}
        </div>
        <div>
          <AuthorityGuard roles={`Admin`}>
            <ButtonWithConfirm
              disabled={isDeleteDisabled}
              variant="ghost"
              confirm={true}
              onConfirm={handleBulkDelete}
              confirmButton={<Button variant="primary">Proceed</Button>}
              cancelButton={<Button variant="outline">Cancel</Button>}
            >
              Stage for Decommission
            </ButtonWithConfirm>
          </AuthorityGuard>
        </div>
      </div>
    </FloatingCard>
  );
}

export default BulkUpdate;
