import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Check, SquarePen, X } from 'lucide-react';
import { toast } from "sonner";
import { useGetOrgMembersQuery } from "@/services/auth/orgApi";
import { useUpdateTeamAuthMutation } from "@/services/auth/teamsApi";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import SelectDepartments from '@/components/common/multiple-departments-selector';
import MultiSelect from '@/components/custom/multi-select';
import { Profile } from '@/components/custom/profile';
import DeleteTeam from '../actions/delete-team';


const TeamInfo = ({ team, teamId }) => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();
  const isMember =
    role === 'member' ||
    role === 'auditor';
    
  // --- Inline edit control ---
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // --- Fetch members from org API ---
  const { data: orgMembersData, isLoading } = useGetOrgMembersQuery({ search: searchQuery });
  const [memberOptions, setMemberOptions] = useState([]);

  useEffect(() => {
    if (orgMembersData?.data?.members) {
      const formatted = orgMembersData.data.members.map((m) => ({
        id: m.userId || m.id,
        label: m.name || m.email,
        value: { id: m.userId || m.id, name: m.name, email: m.email },
      }));
      setMemberOptions(formatted);
    }
  }, [orgMembersData]);

  // --- Team update mutation ---
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamAuthMutation();

  // Find the team leads from members
  const teamLeads = team?.team_lead || [];

  const startEdit = (field, value) => {
    if (isMember) return;
    setEditField(field);

    if (field === "teamLead") {
      // For MultiSelect, we can pass the IDs or the full objects if they match options.
      // Passing IDs is safer if options are loaded.
      const leads = value.map(m => ({
        id: m.userId || m.id,
        label: m.name || m.email,
        value: { id: m.userId || m.id, name: m.name, email: m.email }
      }));
      setTempValue(leads);
    } else if (field === "department") {
      if (value && (value._id || value.id)) {
        const id = value._id || value.id;
        setTempValue([{ id: id, label: value.name, value: value }]);
      } else {
        setTempValue([]);
      }
    } else {
      setTempValue(value);
    }
  };

  const cancelEdit = () => {
    setEditField(null);
    setTempValue("");
  };

  const saveEdit = async () => {
    if (isMember) return;
    let payload = {};

    if (editField === "name") payload.name = tempValue;
    if (editField === "description") payload.description = tempValue;
    if (editField === "teamLead") {
      // tempValue from MultiSelect is array of option objects
      payload.team_lead = tempValue.map((v) => v.value); // align with AddTeam/UpdateTeamModel
    }
    if (editField === "department") {
      const isNone = tempValue?.length === 1 && tempValue[0].id === 'none';
      payload.departmentId = (tempValue?.length && !isNone) ? (tempValue[0]._id || tempValue[0].id) : null;
    }

    toast.promise(
      updateTeam({
        teamId: teamId,
        payload,
      }).unwrap(),
      {
        loading: () => 'Updating team...',
        success: () => 'Updated successfully!',
        error: (error) => error?.data?.error || 'Failed to update team',
      }
    );

    setEditField(null);
  };

  return (
    <Card className="min-w-full">
      <CardHeader>
        <CardTitle>Team Info</CardTitle>
        {!isMember && <DeleteTeam teamId={teamId}/>}
      </CardHeader>

      <CardContent className="card-table pb-3 p-0">
        <Table className="align-middle text-sm">
          <TableBody>

            {/* ---------------------------
                 Team Name
            ---------------------------- */}
            <TableRow>
              <TableCell className="py-6 text-secondary-foreground">
                Team Name
              </TableCell>

              <TableCell className="py-2">
                {editField === "name" ? (
                  <Input
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                ) : (
                  team?.name
                )}
              </TableCell>

              {!isMember && (
                <TableCell className="text-center">
                  {editField === "name" ? (
                    <div className="flex gap-2 justify-center">
                      <Button variant="ghost" onClick={saveEdit} disabled={isUpdating}>
                        <Check size={16} className="text-green-600" />
                      </Button>
                      <Button variant="ghost" onClick={cancelEdit}>
                        <X size={16} className="text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => startEdit("name", team?.name)}
                    >
                      <SquarePen size={16} className="text-blue-500" />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>

            {/* ---------------------------
                 Description
            ---------------------------- */}
            <TableRow>
              <TableCell className="py-6 text-secondary-foreground">
                Description
              </TableCell>

              <TableCell className="py-2">
                {editField === "description" ? (
                  <Textarea
                    rows={3}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                ) : (
                  team?.description || "N/A"
                )}
              </TableCell>

              {!isMember && (
                <TableCell className="text-center">
                  {editField === "description" ? (
                    <div className="flex gap-2 justify-center">
                      <Button variant="ghost" onClick={saveEdit} disabled={isUpdating}>
                        <Check size={16} className="text-green-600" />
                      </Button>
                      <Button variant="ghost" onClick={cancelEdit}>
                        <X size={16} className="text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => startEdit("description", team?.description)}
                    >
                      <SquarePen size={16} className="text-blue-500" />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>

            {/* ---------------------------
                 Department
            ---------------------------- */}
            <TableRow>
              <TableCell className="py-6 min-w-32 text-secondary-foreground align-top">
                Department
              </TableCell>

              <TableCell className="py-2">
                {editField === "department" ? (
                  <SelectDepartments
                    selectedDepartments={tempValue}
                    onChange={(val) => setTempValue(val)}
                    showLabel={false}
                  />
                ) : team?.departmentId?.name ? (
                  <span className="text-foreground">{team?.departmentId?.name}</span>
                ) : (
                  <span className="text-muted-foreground italic">
                    No Department Assigned
                  </span>
                )}
              </TableCell>

              {!isMember && (
                <TableCell className="text-center align-top pt-4">
                  {editField === "department" ? (
                    <div className="flex gap-2 justify-center">
                      <Button variant="ghost" onClick={saveEdit} disabled={isUpdating}>
                        <Check size={16} className="text-green-600" />
                      </Button>
                      <Button variant="ghost" onClick={cancelEdit}>
                        <X size={16} className="text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => startEdit("department", team?.department)}
                    >
                      <SquarePen size={16} className="text-blue-500" />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>

            {/* ---------------------------
                 Team Leads
            ---------------------------- */}
            <TableRow>
              <TableCell className="py-6 min-w-32 text-secondary-foreground align-top">
                Team Leads
              </TableCell>

              <TableCell className="py-2">
                {editField === "teamLead" ? (
                  <MultiSelect
                    placeholder="Select Team Leads"
                    options={memberOptions}
                    values={tempValue}
                    onChange={(values) => setTempValue(values)}
                    isLoading={isLoading}
                    enableSearch
                    onSearchChange={setSearchQuery}
                  />
                ) : teamLeads?.length > 0 ? (
                  <div className="flex flex gap-2">
                    {teamLeads.map((lead) => (
                      <Profile
                        key={lead.id || lead.userId}
                        email={lead.email}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">
                    No Team Leads Assigned
                  </span>
                )}
              </TableCell>

              {!isMember && (
                <TableCell className="text-center align-top pt-4">
                  {editField === "teamLead" ? (
                    <div className="flex gap-2 justify-center">
                      <Button variant="ghost" onClick={saveEdit} disabled={isUpdating}>
                        <Check size={16} className="text-green-600" />
                      </Button>
                      <Button variant="ghost" onClick={cancelEdit}>
                        <X size={16} className="text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => startEdit("teamLead", teamLeads)}
                    >
                      <SquarePen size={16} className="text-blue-500" />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { TeamInfo };