import React, { useState } from 'react';
import {
  ChartPie,
  FileSpreadsheet,
  FileText,
  List,
  ShieldUser,
  Trash2,
  TriangleDashed,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import Select from '@/components/custom/select';
import SelectWithAvatar from '@/components/custom/select-with-avatar';
import FloatingCard from '@/components/custom/floating-card';
import { generateCsv } from '@/hooks/use-generate-csv';
import cweJson from '@/pages/public/report-new-vuln/data/cwe.json';
import { useGetOrgMembersQuery } from '@/services/auth/orgApi';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import {
  useBulkDeleteVmVulnsMutation,
  useBulkUpdateVmVulnsMutation,
} from '@/services/vm/vulnerabilityApi';
import { useGetVmVulnerabilityListQuery } from '@/services/vm/vulnerabilityListApi';
import useStore from '../store';

const StatusOptions = [
  { value: 'In Review', label: 'In Review' },
  { value: 'Not Applicable', label: 'Not Applicable' },
  { value: 'False Positive', label: 'False Positive' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Unresolved', label: 'Unresolved' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Re Test', label: 'Re Test' },
  { value: 'Duplicate', label: 'Duplicate' },
  { value: 'Fixed In Staging', label: 'Fixed In Staging' },
];

const GroupOptions = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'development', label: 'Development' },
];

const CweOptions = cweJson.map((cwe) => ({
  value: `CWE-${cwe['CWE-ID']}`,
  label: `CWE-${cwe['CWE-ID']}: ${cwe.Name}`,
  email: '', // Add empty email to satisfy interface
  description: cwe.Description,
}));

function VMBulkUpdate({ vulnerabilities }) {
  const {
    data: orgMembers,
    isLoading: membersLoading,
    isError,
  } = useGetOrgMembersQuery();
  const {
    data: vulnerabilityListData,
    isLoading,
    isListError,
  } = useGetVmVulnerabilityListQuery();
  const [bulkUpdate, { isLoading: isUpdating }] = useBulkUpdateVmVulnsMutation();
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);

  // State for search input to perform server-side assessment queries
  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [showSelect, setShowSelect] = useState(false);
  const [showSelect2, setShowSelect2] = useState(false);
  const [showSelect3, setShowSelect3] = useState(false);
  const [showSelect4, setShowSelect4] = useState(false);

  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCwe, setSelectedCwe] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [bulkDeleteVulns, { isLoading: isDeleting }] =
    useBulkDeleteVmVulnsMutation();

  // Use RTK Query to fetch assessments with server-side search and pagination
  const {
    data: assessmentData,
    error: assessmentError,
    isLoading: assessmentLoading,
  } = useGetVmAssessmentsQuery({
    page: 1,
    limit: 10,
    search: assessmentSearch,
  });

  // Map assessments to Select options format
  const assessmentOptions =
    assessmentData?.data?.assessments?.map((item) => ({
      value: item._id,
      label: item.title,
    })) || [];

  // Get selected vulnIds from rowSelection
  const vulnIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

  // Build the update payload based on selected fields
  let updateField = {};
  if (selectedCwe) updateField.cwe = selectedCwe.value;
  if (selectedStatus) updateField.state = selectedStatus.value;
  if (selectedOwner) {
    updateField.assignee = {
      _id: selectedOwner._id,
      name: selectedOwner.name,
      email: selectedOwner.email,
      role: selectedOwner.role,
    };
  }
  if (selectedAssessment) updateField.assessmentId = selectedAssessment.value;
  if (selectedList) updateField.list = selectedList.value;

  const handleBulkUpdate = async () => {
    if (!vulnIds.length || !Object.keys(updateField).length) return;
    const assessmentId = 'static-assessment-id'; // replace with actual assessment id if needed
    const body = { vulnIds, ...updateField };
    toast.promise(bulkUpdate({ assessmentId, body }).unwrap(), {
      loading: 'Updating vulnerabilities...',
      success: (data) => data?.message || 'Bulk update successful',
      error: (e) => e?.data?.message || 'Bulk update failed',
    });
  };

  const handleExportCsv = () => {
    const transformedVulns = vulnerabilities.map((vuln) => ({
      title: vuln.title,
      owner: vuln.assigneeDetails?.name || 'Unassigned',
      assessmentName: vuln.assessmentId?.title || 'Unknown Assessment',
      state: vuln.state,
      severity: vuln._raw?.info?.severity || vuln.cvssRating || 'Unknown',
      reportedOn: new Date(vuln.createdAt).toLocaleDateString(),
    }));

    generateCsv(transformedVulns);
  };

  const handleBulkDelete = async () => {
    if (!vulnIds.length) return;
    toast.promise(bulkDeleteVulns({ vulnIds }).unwrap(), {
      loading: 'Deleting vulnerabilities...',
      success: (data) => {
        setRowSelection(() => ({}));

        return data?.message || 'Bulk delete successful';
      },
      error: (e) => {
        setRowSelection(() => ({}));

        return e?.data?.message || 'Bulk delete failed';
      },
    });
  };

  return (
    <FloatingCard
      position="sticky-bottom"
      updateButton={{
        text: isUpdating ? 'Updating...' : 'Update',
        onClick: handleBulkUpdate,
        disabled:
          isUpdating || !vulnIds.length || !Object.keys(updateField).length,
      }}
    >
      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <SelectWithAvatar
              users={orgMembers?.data?.members}
              onChange={(userId) => {
                const user = orgMembers?.data?.members?.find(
                  (u) => u._id === userId,
                );
                setSelectedOwner(user || null);
              }}
              searchFields={['name', 'email']}
              placeholder="Owner"
              icon={<ShieldUser />}
            />
          </div>
          <div>
            {showSelect ? (
              <Select
                options={StatusOptions}
                placeholder="Select Status"
                className="w-40"
                enableSearch={false}
                onChange={setSelectedStatus}
              />
            ) : (
              <Button variant="outline" onClick={() => setShowSelect(true)}>
                <ChartPie />
                Status
              </Button>
            )}
          </div>
          <div>
            {showSelect2 ? (
              <Select
                options={CweOptions}
                placeholder="Select CWE"
                className="w-60"
                onChange={setSelectedCwe}
              />
            ) : (
              <Button variant="outline" onClick={() => setShowSelect2(true)}>
                <TriangleDashed />
                CWE
              </Button>
            )}
          </div>

          <div>
            {showSelect3 ? (
              <Select
                options={assessmentOptions}
                placeholder="Select Assessment"
                className="w-60"
                onChange={setSelectedAssessment}
                onSearchChange={(searchText) =>
                  setAssessmentSearch(searchText || '')
                }
                isLoading={assessmentLoading}
              />
            ) : (
              <Button variant="outline" onClick={() => setShowSelect3(true)}>
                <FileText />
                Assessment
              </Button>
            )}
          </div>

          <div>
            {showSelect4 ? (
              <Select
                options={
                  vulnerabilityListData?.data
                    ? vulnerabilityListData.data.map((item) => ({
                        value: item._id,
                        label: item.name,
                      }))
                    : []
                }
                placeholder="Select List"
                className="w-60"
                onChange={setSelectedList}
                value={selectedList}
              />
            ) : (
              <Button variant="outline" onClick={() => setShowSelect4(true)}>
                <List />
                Lists
              </Button>
            )}
          </div>

          <Button variant="outline" onClick={handleExportCsv}>
            <FileSpreadsheet />
            Export CSV
          </Button>
        </div>

        <ButtonWithConfirm
          disabled={isDeleting}
          variant="ghost"
          confirm={true}
          onConfirm={handleBulkDelete}
          confirmButton={<Button variant="primary">Proceed</Button>}
          cancelButton={<Button variant="outline">Cancel</Button>}
        >
          <Trash2 size={14} />
        </ButtonWithConfirm>
      </div>
    </FloatingCard>
  );
}

export default VMBulkUpdate;
