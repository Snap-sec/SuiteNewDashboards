import React, { useState } from 'react';
import {
  FileText,
  FolderPlus,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import Select from '@/components/custom/select';
import FloatingCard from '../../../../../components/custom/floating-card';
import { useGetVmAssessmentsQuery } from '../../../../../services/vm/assessmentsApi';
import { useGetVsGroupsQuery } from '@/services/vs/vsApi';

import {
  useBulkDeleteVsAssetsMutation,
  useBulkAddVsAssetsToGroupMutation,
  useBulkSendVsAssetsToVmMutation
} from '../../../../../services/vs/vsApi';
import useStore from '../store';
import { useAuth } from '@/auth/context/auth-context';

function BulkUpdateFloatingBar() {
  const { user } = useAuth();
  const isAuditor = user?.role?.toLowerCase() === 'auditor';
  const [bulkDelete, { isLoading: isDeleting }] = useBulkDeleteVsAssetsMutation();
  const [bulkAddToGroup, { isLoading: isAddingToGroup }] = useBulkAddVsAssetsToGroupMutation();
  const [bulkSendToVm, { isLoading: isSendingToVm }] = useBulkSendVsAssetsToVmMutation();

  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);

  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [showAssessmentSelect, setShowAssessmentSelect] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const [groupSearch, setGroupSearch] = useState('');
  const [showGroupSelect, setShowGroupSelect] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const assetIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

  // Fetch Assessments
  const { data: assessmentData, isLoading: assessmentLoading } =
    useGetVmAssessmentsQuery({
      page: 1,
      limit: 10,
      search: assessmentSearch,
    });

  const assessmentOptions =
    assessmentData?.data?.assessments?.map((item) => ({
      value: item._id,
      label: item.title,
    })) || [];

  const { data: groupsData, isLoading: groupsLoading } = useGetVsGroupsQuery({ search: groupSearch });

  const groupOptions = groupsData?.groups?.map(g => ({
      value: g._id,
      label: g.name
  })) || [];

  const handleBulkAddToGroup = async () => {
      if (!assetIds.length || !selectedGroup) return;
      
      toast.promise(bulkAddToGroup({ assetIds, groupId: selectedGroup.value }).unwrap(), {
          loading: 'Adding assets to group...',
          success: (data) => {
              setRowSelection(() => ({}));
              return data?.message || 'Assets added to group successfully';
          },
          error: (e) => {
              console.error("Bulk add to group error:", e);
              return e?.data?.message || e?.message || 'Failed to add assets to group';
          }
      });
  };

  const handleBulkSendToVm = async () => {
      if (!assetIds.length || !selectedAssessment) return;

      toast.promise(bulkSendToVm({ assetIds, assessmentId: selectedAssessment.value }).unwrap(), {
          loading: 'Sending assets to VM...',
          success: (data) => {
              setRowSelection(() => ({}));
              return data?.message || 'Assets sent to VM successfully';
          },
          error: (e) => e?.data?.message || 'Failed to send assets to VM'
      });
  };

  const handleBulkDelete = async () => {
    if (!assetIds.length) return;
    toast.promise(bulkDelete({ assetIds }).unwrap(), {
      loading: 'Deleting assets...',
      success: (data) => {
        setRowSelection(() => ({}));
        return data?.message || 'Bulk delete successful';
      },
      error: (e) => {
        return e?.data?.message || 'Bulk delete failed';
      },
    });
  };

  return (
    <FloatingCard
      position="sticky-bottom"
    >
        <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div className="flex flex-wrap gap-4 items-center">
                <span className="text-sm font-medium text-muted-foreground mr-2">{assetIds.length} Selected</span>

                {/* ADD TO GROUP */}
                <div className="flex items-center gap-2">
                    {showGroupSelect ? (
                        <div className="flex items-center gap-2">
                            <Select
                                options={groupOptions}
                                placeholder="Select Group"
                                className="w-60"
                                onChange={setSelectedGroup}
                                onSearchChange={setGroupSearch}
                                isLoading={groupsLoading}
                            />
                            <Button size="sm" onClick={handleBulkAddToGroup} disabled={!selectedGroup || isAddingToGroup}>
                                Add
                            </Button>
                             {/* <Button size="sm" variant="ghost" onClick={() => setShowGroupSelect(false)}><Trash2 size={14}/></Button> */}
                        </div>
                    ) : (
                        <Button variant="outline" onClick={() => setShowGroupSelect(true)}>
                            <FolderPlus size={16} className="mr-2" />
                            Add to Group
                        </Button>
                    )}
                </div>

                {/* SEND TO VM */}
                {/* <div className="flex items-center gap-2">
                    {showAssessmentSelect ? (
                         <div className="flex items-center gap-2">
                            <Select
                                options={assessmentOptions}
                                placeholder="Select Assessment"
                                className="w-60"
                                onChange={setSelectedAssessment}
                                onSearchChange={setAssessmentSearch}
                                isLoading={assessmentLoading}
                            />
                            <Button size="sm" onClick={handleBulkSendToVm} disabled={!selectedAssessment || isSendingToVm}>
                                Send
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setShowAssessmentSelect(false)}><Trash2 size={14}/></Button>
                        </div>
                    ) : (
                        <Button variant="outline" onClick={() => setShowAssessmentSelect(true)}>
                            <FileText size={16} className="mr-2" />
                            Send to VM
                        </Button>
                    )}
                </div> */}
            </div>

             {/* DELETE BUTTON */}
            {!isAuditor && (
              <ButtonWithConfirm
                disabled={isDeleting}
                variant="ghost"
                confirm={true}
                onConfirm={handleBulkDelete}
                confirmButton={<Button variant="primary">Proceed</Button>}
                cancelButton={<Button variant="outline">Cancel</Button>}
                className="text-destructive hover:text-destructive hover:bg-red-200/20"
              >
                <Trash2 size={14} />
              </ButtonWithConfirm>
            )}
        </div>
    </FloatingCard>
  );
}

export default BulkUpdateFloatingBar;
