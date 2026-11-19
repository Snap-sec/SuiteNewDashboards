import React, { useState } from "react";
import SelectWithAvatar from "@/components/custom/select-with-avatar";
import { ShieldUser, TriangleDashed, ChartPie } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Select from '@/components/custom/select';
import FloatingCard from "@/components/custom/floating-card";
import { toast } from 'sonner';
import { useGetOrgMembersQuery } from "@/services/auth/orgApi";
import { useBulkUpdateThreatsMutation } from "../../../../services/tm/threatApi";
import { useGetProjectEndpointsQuery } from '@/services/tm/projectApi';
import { Logs } from 'lucide-react';

const STATES = [
  { label: 'Pending', value: 'pending' },
  { label: 'Acknowledge', value: 'acknowledged' },
  { label: 'Risk Accepted', value: 'risk_accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Need More Info', value: 'need_more_info' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Fixed', value: 'fixed' },
  { label: 'Fix Verified', value: 'fix_verified' },
];

const SEVERITY = [
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

function ThreatsBulkUpdate({ threats, rowSelection, setRowSelection, projectId, showEndpoints }) {
  const { data: orgMembers, isLoading: membersLoading } = useGetOrgMembersQuery();
  const [bulkUpdateThreats, { isLoading: isUpdating }] = useBulkUpdateThreatsMutation();
  const [search, setSearch] = useState(''); // if you want search for endpoints later
  const { data: endpointsData, isLoading: endpointsLoading, isFetching } = useGetProjectEndpointsQuery({ projectId, search, limit: 10 });

  // State for selected values
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  // State for showing select dropdowns
  const [showStateSelect, setShowStateSelect] = useState(false);
  const [showSeveritySelect, setShowSeveritySelect] = useState(false);
  const [showEndpointSelect, setShowEndpointSelect] = useState(false);

  // Get selected threat IDs
  const selectedThreatIds = Object.keys(rowSelection || {});

  // Convert endpoints data to options format for Select component
  const endpointOptions = endpointsData?.endpoints?.map(endpoint => ({
    label: endpoint.name || endpoint.url || `Endpoint ${endpoint._id}`, // Adjust as needed to show endpoint name
    value: endpoint._id,
  })) || [];

  // Build the update payload based on selected fields
  let updateField = {};
  if (selectedState) updateField.state = selectedState.value;
  if (selectedSeverity) updateField.severity = selectedSeverity.value;
  if (selectedOwner) {
    updateField.owner = {
      name: selectedOwner.name,
      email: selectedOwner.email,
      userId: selectedOwner._id || selectedOwner.userId
    };
  }
  if (selectedEndpoint) updateField.endpointId = selectedEndpoint.value;

 const handleBulkUpdate = async () => {
        if (!selectedThreatIds.length || !Object.keys(updateField).length) {
          toast.error('Please select threats and at least one field to update');
          return;
        }
      
        const payload = {
          threatIds: selectedThreatIds,
          updates: updateField
        };
      
        try {
          toast.loading('Updating threats...');
          const result = await bulkUpdateThreats({ body: payload }).unwrap();
          
          console.log("BULK UPDATE SUCCESS DATA:", result);
          
          // Reset form state
          setSelectedOwner(null);
          setSelectedState(null);
          setSelectedSeverity(null);
          setSelectedEndpoint(null);
          setShowStateSelect(false);
          setShowSeveritySelect(false);
          setShowEndpointSelect(false);
          setRowSelection({});
          
          // Handle success message
          let successMessage = 'Bulk update successful';
          if (result?.modifiedCount !== undefined) {
            successMessage = `Successfully updated ${result.modifiedCount} of ${result.matchedCount} threats`;
          } else if (result?.message) {
            successMessage = result.message;
          }
          
          toast.dismiss();
          toast.success(successMessage);
          
        } catch (error) {
          console.log("BULK UPDATE ERROR:", error);
          toast.dismiss();
          toast.error(error?.data?.message || 'Bulk update failed');
        }
      };

  return (
    <FloatingCard
      updateButton={{
        text: isUpdating ? "Updating..." : `Update ${selectedThreatIds.length} Threats`,
        onClick: handleBulkUpdate,
        disabled: isUpdating || !selectedThreatIds.length || !Object.keys(updateField).length,
      }}
    >
      <div className="flex justify-center items-center gap-6">
        {/* Owner Select */}
        <div>
          <SelectWithAvatar
            users={orgMembers?.data?.members}
            onChange={userId => {
              const user = orgMembers?.data?.members?.find(u => u._id === userId);
              setSelectedOwner(user || null);
            }}
            searchFields={["name", "email"]}
            placeholder="Owner"
            icon={<ShieldUser />}
            disabled={membersLoading}
          />
        </div>

        {/* State Select */}
        <div>
          {showStateSelect ? (
            <Select
              options={STATES}
              placeholder="Select State"
              className="w-40"
              enableSearch={false}
              onChange={setSelectedState}
              value={selectedState?.value}
            />
          ) : (
            <Button variant="outline" onClick={() => setShowStateSelect(true)}>
              <ChartPie />
              State
            </Button>
          )}
        </div>

        {/* Severity Select */}
        <div>
          {showSeveritySelect ? (
            <Select
              options={SEVERITY}
              placeholder="Select Severity"
              className="w-40"
              enableSearch={false}
              onChange={setSelectedSeverity}
              value={selectedSeverity?.value}
            />
          ) : (
            <Button variant="outline" onClick={() => setShowSeveritySelect(true)}>
              <TriangleDashed />
              Severity
            </Button>
          )}
        </div>

        {/* Endpoint Select */}
        {showEndpoints ? 
        <div>
          {showEndpointSelect ? (
            <Select
              options={endpointOptions}
              placeholder="Select Endpoint"
              className="w-56"
              isLoading={endpointsLoading}
              enableSearch={true} // optional: can add search feature
              onChange={setSelectedEndpoint}
              value={selectedEndpoint}
            />
          ) : (
            <Button variant="outline" onClick={() => setShowEndpointSelect(true)}>
              <Logs />
              Endpoint
            </Button>
          )}
        </div>
:
''

        }
        
      </div>
    </FloatingCard>
  );
}

export default ThreatsBulkUpdate;
