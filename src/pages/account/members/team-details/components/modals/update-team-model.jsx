import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/custom/modal";
import MultiSelect from "@/components/custom/multi-select";
import { onAuthority } from "@/lib/helpers";
import { useUpdateTeamAuthMutation } from "@/services/auth/teamsApi";
import { useGetOrgMembersQuery } from "@/services/auth/orgApi";
import useStore from "../../../teams/store";

function UpdateTeamModel() {
  const [memberSearchQuery, setMemberSearchQuery] = useState("");

  const showAddTeamModal = useStore((state) => state.showAddTeamModal);
  const setShowAddTeamModal = useStore((state) => state.setShowAddTeamModal);

  const updateTeamDetail = useStore((state) => state.updateTeamDetail);
  const setUpdateTeamDetail = useStore((state) => state.setUpdateTeamDetail);

  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamAuthMutation();

  const { data: members } = useGetOrgMembersQuery({ search: memberSearchQuery });

  const [allMembersOptions, setAllMembersOptions] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [teamLeads, setTeamLeads] = useState([]);


  // Build members dropdown list from all org members
  useEffect(() => {
    if (members?.data?.members) {
      const formatted = members.data.members.map((member) => ({
        id: member.userId || member._id,
        label: member.name,
        value: {
          id: member.userId || member._id,
          name: member.name,
          email: member.email,
          isLead: member.isLead || false,
        },
      }));
      setAllMembersOptions(formatted);
    }
  }, [members]);

  // Initialize selected members from team details
  useEffect(() => {
    if (updateTeamDetail?.teamMembers) {
      const mappedMembers = updateTeamDetail.teamMembers.map((m) => ({
        id: m.id || m.userId || m._id,
        label: m.name,
        value: {
          id: m.id || m.userId || m._id,
          name: m.name,
          email: m.email,
          isLead: m.isLead || false,
        },
      }));

      const leads = mappedMembers.filter(m => m.value.isLead);
      const others = mappedMembers.filter(m => !m.value.isLead);

      setTeamLeads(leads);
      setSelectedMembers(others);
    } else {
      setSelectedMembers([]);
      setTeamLeads([]);
    }
  }, [updateTeamDetail]);

  const handleLeadersChange = (options) => {
    setTeamLeads(options);
    // Remove selected leads from selected members to avoid duplicates
    if (options?.length > 0) {
      const leadIds = options.map((o) => o.value?.id);
      setSelectedMembers((prev) =>
        prev.filter((m) => !leadIds.includes(m.value?.id)),
      );
    }
  };

  const handleMembersChange = (options) => {
    setSelectedMembers(options);
  };

  // Filter out leads from member options
  const unassignedMembers = allMembersOptions.filter(
    (member) => !teamLeads.some((lead) => lead.id === member.id)
  );

  const handleUpdateMembers = onAuthority(["Admin"], () => {
    if (!updateTeamDetail?.id) {
      toast.error("Team ID missing!");
      return;
    }

    if (teamLeads.length === 0) {
      toast.error("Please select at least one team lead.");
      return;
    }

    const membersPayload = [
      ...teamLeads.map(l => ({ ...l.value, isLead: true })),
      ...selectedMembers.map(m => {
        // Ensure we preserve email if it's missing in value but present in options (though value usually has it)
        const fullMemberData = allMembersOptions.find(opt => opt.id === m.id);
        return {
          id: m.id,
          name: m.label,
          email: fullMemberData?.value?.email || m.value?.email,
          isLead: false,
        };
      })
    ];

    const payload = {
      members: membersPayload,
      team_lead: teamLeads.map(l => l.value)
    };

    toast.promise(
      updateTeam({
        teamId: updateTeamDetail.id,
        payload,
      }).unwrap(),
      {
        loading: "Updating members...",
        success: () => {
          setShowAddTeamModal(false);
          setSelectedMembers([]);
          setUpdateTeamDetail({});
          return "Members updated successfully";
        },
        error: (err) => err?.data?.message || err?.message || "Failed to update members",
      }
    );
  });

  return (
    <Modal
      open={showAddTeamModal}
      setOpen={() => {
        setShowAddTeamModal(false);
        setSelectedMembers([]);
        setTeamLeads([]);
        setUpdateTeamDetail({});
      }}
      title={updateTeamDetail?.teamMembers?.length > 0 ? "Update Team Members" : "Add Team Members"}
      description="Manage the list of members assigned to this team."
    >
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Team Leads</h4>
          <MultiSelect
            placeholder="Select Team Leads"
            options={allMembersOptions}
            values={teamLeads}
            onSearchChange={setMemberSearchQuery}
            onChange={handleLeadersChange}
            maxShownItems={5}
          />
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Team Members</h4>
          <MultiSelect
            placeholder="Select Members"
            options={unassignedMembers}
            values={selectedMembers}
            onSearchChange={setMemberSearchQuery}
            onChange={handleMembersChange}
            maxShownItems={5}
          />
        </div>

        <div className="w-full flex items-center justify-end mt-4">
          <Button onClick={handleUpdateMembers} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Members"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default UpdateTeamModel;
