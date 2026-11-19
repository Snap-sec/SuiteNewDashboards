import React, { useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import {
  Building2,
  ChartPie,
  FileSpreadsheet,
  FileText,
  List,
  ShieldUser,
  Trash2,
  TriangleDashed,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetAimBusinessUnitsQuery } from '@/services/asset-inventory/businessUnitsApi';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import Select from '@/components/custom/select';
import SelectWithAvatar from '@/components/custom/select-with-avatar';
import FloatingCard from '../../../../../components/custom/floating-card';
import { generateCsv } from '../../../../../hooks/use-generate-csv';
import cweJson from '../../../../../pages/public/report-new-vuln/data/cwe.json';
import { useGetOrgMembersQuery } from '../../../../../services/auth/orgApi';
import { useGetVmAssessmentsQuery } from '../../../../../services/vm/assessmentsApi';
import {
  useBulkDeleteVmVulnsMutation,
  useBulkUpdateVmVulnsMutation,
} from '../../../../../services/vm/vulnerabilityApi';
import { useGetVmVulnerabilityListQuery } from '../../../../../services/vm/vulnerabilityListApi';
import { useSubmitVmBulkRiskAcceptanceMutation } from '@/services/vm/riskAcceptanceApi';
import useStore from '../store';
import BulkArchive from './actions/bulk-archive';
import FalsePositiveAnalysis from './actions/false-positive-analysis';
import BulkAffectedAsset from './actions/bulk-affected-asset';
import BulkRiskAcceptanceForm from './bulk-risk-acceptance-form';
import RevalidationInfo from '@/pages/VM/pages/vulnerability-report/components/report-details/revalidation-info';

const StatusOptions = [
  { value: 'Triaged', label: 'Triaged' },
  { value: 'In Review', label: 'In Review' },
  { value: 'False Positive', label: 'False Positive' },
  { value: 'Not Applicable', label: 'Not Applicable' },
  { value: 'Risk Accepted', label: 'Risk Accepted' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Fixed In Staging', label: 'Fixed In Staging' },
  { value: 'Re Test', label: 'Re Test' },
  { value: 'Duplicate', label: 'Duplicate' },
  { value: 'Unresolved', label: 'Unresolved' },
];

const CweOptions = cweJson.map((cwe) => ({
  value: `CWE-${cwe['CWE-ID']}`,
  label: `CWE-${cwe['CWE-ID']}: ${cwe.Name}`,
  email: '',
  description: cwe.Description,
}));

function VMBulkUpdate({
  vulns,
  rowSelection: rowSelectionProp,
  setRowSelection: setRowSelectionProp,
}) {
  const { user } = useAuth();
  const { data: orgMembers } = useGetOrgMembersQuery();
  const { data: vulnerabilityListData } = useGetVmVulnerabilityListQuery();
  const [bulkUpdate, { isLoading: isUpdating }] = useBulkUpdateVmVulnsMutation();
  const [submitBulkRiskAcceptance, { isLoading: isSubmittingRisk }] =
    useSubmitVmBulkRiskAcceptanceMutation();
  const rowSelectionStore = useStore((state) => state.rowSelection);
  const setRowSelectionStore = useStore((state) => state.setRowSelection);
  const rowSelection = rowSelectionProp ?? rowSelectionStore;
  const setRowSelection = setRowSelectionProp ?? setRowSelectionStore;

  const vulnerabilities = vulns?.filter((vuln) => rowSelection[vuln._id]);

  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [businessUnitSearch, setBusinessUnitSearch] = useState('');
  const [showSelect, setShowSelect] = useState(false);
  const [showSelect2, setShowSelect2] = useState(false);
  const [showSelect3, setShowSelect3] = useState(false);
  const [showSelect4, setShowSelect4] = useState(false);
  const [showBusinessUnitSelect, setShowBusinessUnitSelect] = useState(false);

  const [showCollaboratorSelect, setShowCollaboratorSelect] = useState(false);

  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCwe, setSelectedCwe] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState(null);
  const [selectedAffectedAsset, setSelectedAffectedAsset] = useState(null);

  const [selectedCollaborators, setSelectedCollaborators] = useState([]);

  const [showRiskAcceptanceModal, setShowRiskAcceptanceModal] = useState(false);
  const [riskAcceptanceDetails, setRiskAcceptanceDetails] = useState(null);

  const [showRevalidationModal, setShowRevalidationModal] = useState(false);
  const [revalidationDetails, setRevalidationDetails] = useState(null);
  const [revalidationInfoTemp, setRevalidationInfoTemp] = useState({});

  const handleCloseRiskAcceptanceModal = () => {
    setShowRiskAcceptanceModal(false);
    if (!riskAcceptanceDetails?.reason) {
      setSelectedStatus(null);
    }
  };

  const handleCloseRevalidationModal = () => {
    setShowRevalidationModal(false);
    if (!revalidationDetails?.reason) {
      setSelectedStatus(null);
    }
  };

  const handleStatusChange = (option) => {
    setSelectedStatus(option);
    if (option?.value === 'Risk Accepted') {
      setShowRiskAcceptanceModal(true);
    } else if (option?.value === 'Resolved') {
      setShowRevalidationModal(true);
    }
  };

  const [bulkDeleteVulns, { isLoading: isDeleting }] =
    useBulkDeleteVmVulnsMutation();

  const { data: assessmentData, isLoading: assessmentLoading } =
    useGetVmAssessmentsQuery({
      page: 1,
      limit: 10,
      search: assessmentSearch,
    });

  const { data: businessUnitsData, isLoading: businessUnitsLoading } =
    useGetAimBusinessUnitsQuery({ search: businessUnitSearch });

  const assessmentOptions =
    assessmentData?.data?.assessments?.map((item) => ({
      value: item._id,
      label: item.title,
    })) || [];

  const businessUnitOptions =
    businessUnitsData?.businessUnits?.map((bu) => ({
      label: bu.name,
      value: bu._id,
    })) || [];

  const vulnIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

  // BUILD PAYLOAD FOR UPDATE
  let updateField = {};
  if (selectedCwe) updateField.cwe = selectedCwe.value;
  if (selectedStatus) updateField.state = selectedStatus.value;

  if (selectedStatus?.value === 'Risk Accepted' && riskAcceptanceDetails) {
    updateField.reason = riskAcceptanceDetails.reason;
    updateField.businessJustification = riskAcceptanceDetails.businessJustification;
    updateField.compensatingControls = riskAcceptanceDetails.compensatingControls;
  }

  if (selectedStatus?.value === 'Resolved' && revalidationDetails) {
    updateField.revalidation = revalidationDetails;
  }

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
  if (selectedBusinessUnit)
    updateField.businessUnitIds = [selectedBusinessUnit.value];

  if (selectedAffectedAsset) {
      if (selectedAffectedAsset.value === 'none') {
          updateField.affectedAssets = {}; 
      } else {
          updateField.affectedAssets = {
              assetName: selectedAffectedAsset.asset.value,
              vulnerableLocation: selectedAffectedAsset.asset.value,
              value: selectedAffectedAsset.asset.value,
              type: selectedAffectedAsset.asset.type || 'subdomain'
          };
      }
  }

  // ADD COLLABORATORS PAYLOAD
  if (selectedCollaborators.length) {
    updateField.collaborators = selectedCollaborators.map((u) => ({
      userId: u._id,
      name: u.name,
      email: u.email,
    }));
  }

  const handleBulkRiskAcceptanceSubmit = async (details) => {
    if (!vulnIds.length) return;

    toast.promise(
      submitBulkRiskAcceptance({
        vulnIds,
        reason: details.reason,
        businessJustification: details.businessJustification,
        compensatingControls: details.compensatingControls,
      }).unwrap(),
      {
        loading: 'Submitting bulk risk acceptance...',
        success: (data) => {
          setRowSelection(() => ({}));

          setSelectedOwner(null);
          setSelectedStatus(null);
          setSelectedCwe(null);
          setSelectedAssessment(null);
          setSelectedList(null);
          setSelectedBusinessUnit(null);
          setSelectedAffectedAsset(null);
          setSelectedCollaborators([]);
          setRiskAcceptanceDetails(null);
          setRevalidationDetails(null);
          setShowRiskAcceptanceModal(false);

          return data?.message || 'Bulk risk acceptance submitted successfully';
        },
        error: (e) => e?.data?.message || 'Bulk risk acceptance failed',
      }
    );
  };

  const handleBulkUpdate = async () => {
    if (!vulnIds.length || !Object.keys(updateField).length) return;

    if (selectedStatus?.value === 'Risk Accepted' && !riskAcceptanceDetails?.reason) {
      setShowRiskAcceptanceModal(true);
      return;
    }

    if (selectedStatus?.value === 'Resolved' && !revalidationDetails?.reason) {
      setShowRevalidationModal(true);
      return;
    }

    const firstVuln = vulnerabilities?.[0];
    const assessmentId =
      firstVuln?.assessmentId?._id ||
      firstVuln?.assessmentId ||
      'static-assessment-id';
    const body = { vulnIds, ...updateField };

    toast.promise(bulkUpdate({ assessmentId, body }).unwrap(), {
      loading: 'Updating vulnerabilities...',
      success: (data) => {
        setRowSelection(() => ({}));

        setSelectedOwner(null);
        setSelectedStatus(null);
        setSelectedCwe(null);
        setSelectedAssessment(null);
        setSelectedList(null);
        setSelectedBusinessUnit(null);
        setSelectedAffectedAsset(null);
        setSelectedCollaborators([]);
        setRiskAcceptanceDetails(null);
        setRevalidationDetails(null);

        return data?.message || 'Bulk update successful';
      },
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
        text: isUpdating
          ? 'Updating...'
          : `Update ${vulnerabilities?.length} Vulnerabilities`,
        onClick: handleBulkUpdate,
        disabled:
          isUpdating || !vulnIds.length || !Object.keys(updateField).length,
      }}
    >
      <div className="flex flex-row items-center justify-between w-full gap-4">
        <div className="flex items-center gap-3 px-2 border-r pr-4 mr-2">
          <Checkbox
            checked={vulnerabilities?.length > 0}
            onCheckedChange={() => setRowSelection(() => ({}))}
            className="hover:cursor-pointer"
          />
          <span className="text-sm font-semibold whitespace-nowrap">
            {vulnerabilities?.length} Selected
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* OWNER */}
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

          {/* STATUS */}
          <div>
            {showSelect ? (
              <Select
                options={StatusOptions}
                placeholder="Select Status"
                className="w-40"
                enableSearch={false}
                value={selectedStatus?.value}
                onChange={handleStatusChange}
              />
            ) : (
              <Button variant="outline" onClick={() => setShowSelect(true)}>
                <ChartPie />
                Status
              </Button>
            )}
          </div>

          {/* CWE */}
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

          {/* ASSESSMENT */}
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

          {/* BUSINESS UNIT */}
          <div>
            {showBusinessUnitSelect ? (
              <Select
                options={businessUnitOptions}
                placeholder="Select Business Unit"
                className="w-60"
                onChange={setSelectedBusinessUnit}
                onSearchChange={(searchText) =>
                  setBusinessUnitSearch(searchText || '')
                }
                isLoading={businessUnitsLoading}
              />
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowBusinessUnitSelect(true)}
              >
                <Building2 />
                Business Unit
              </Button>
            )}
          </div>

          {/* AFFECTED ASSET */}
          <div>
            <BulkAffectedAsset
              selectedAffectedAsset={selectedAffectedAsset}
              setSelectedAffectedAsset={setSelectedAffectedAsset}
            />
          </div>

          {/* LIST */}
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
                // value={selectedList}
              />
            ) : (
              <Button variant="outline" onClick={() => setShowSelect4(true)}>
                <List />
                Lists
              </Button>
            )}
          </div>

          {/* COLLABORATORS (MULTI SELECT) */}
          <div>
            {showCollaboratorSelect ? (
              <SelectWithAvatar
                multiple
                users={orgMembers?.data?.members}
                placeholder="Select Collaborators"
                searchFields={['name', 'email']}
                onChange={(selectedIds) => {
                  const fullUsers = selectedIds.map((id) =>
                    orgMembers?.data?.members?.find((u) => u._id === id),
                  );
                  setSelectedCollaborators(fullUsers);
                }}
              />
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowCollaboratorSelect(true)}
              >
                <Users />
                Collaborators
              </Button>
            )}
          </div>

          {/* EXPORT CSV */}
          <Button variant="outline" onClick={handleExportCsv}>
            <FileSpreadsheet />
            Export CSV
          </Button>

          {/* Bulk Archive Button */}
          <BulkArchive vulnIds={vulnIds} />

          {user?.ai_configuration?.enabled && (
            <FalsePositiveAnalysis vulnIds={vulnIds} />
          )}
        </div>

        {/* DELETE BUTTON */}
        {/* <ButtonWithConfirm
          disabled={isDeleting}
          variant="ghost"
          confirm={true}
          onConfirm={handleBulkDelete}
          confirmButton={<Button variant="primary">Proceed</Button>}
          cancelButton={<Button variant="outline">Cancel</Button>}
        >
          <Trash2 size={14} />
        </ButtonWithConfirm> */}
      </div>
      <BulkRiskAcceptanceForm
        show={showRiskAcceptanceModal}
        onClose={handleCloseRiskAcceptanceModal}
        onSubmit={handleBulkRiskAcceptanceSubmit}
        vulnCount={vulnIds.length}
        initialValues={riskAcceptanceDetails}
        isLoading={isSubmittingRisk}
      />
      <RevalidationInfo
        revalidation={revalidationDetails}
        show={showRevalidationModal}
        onSubmit={() => {
          setRevalidationDetails(revalidationInfoTemp);
          setShowRevalidationModal(false);
        }}
        onChange={setRevalidationInfoTemp}
        onClose={handleCloseRevalidationModal}
      />
    </FloatingCard>
  );
}


export default VMBulkUpdate;
