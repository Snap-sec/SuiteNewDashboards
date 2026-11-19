import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { onAuthority } from '@/lib/helpers';
import { useGetOrgMembersQuery } from '@/services/auth/orgApi';
import {
  useCreateTeamMutation,
  useUpdateTeamAuthMutation,
} from '@/services/auth/teamsApi';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, InputWrapper } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import MultiSelect from '@/components/custom/multi-select';
import useStore from '../../store';
import { teamSchema } from './schemas/add-team-schema';

function AddTeam() {
  // --- Modal state ---
  const showAddTeamModal = useStore((state) => state.showAddTeamModal);
  const setShowAddTeamModal = useStore((state) => state.setShowAddTeamModal);

  const updateTeamDetail = useStore((state) => state.updateTeamDetail);
  const setUpdateTeamDetail = useStore((state) => state.setUpdateTeamDetail);

  // --- Search state ---
  const [search, setSearch] = useState('');

  // --- API hooks ---
  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const {
    data: orgMembers,
    isLoading,
    isFetching: isSearching,
  } = useGetOrgMembersQuery({ search });
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamAuthMutation();

  // --- Local state ---
  const [allMemberOptions, setAllMemberOptions] = useState([]);

  const isUpdateMode = updateTeamDetail?.name && updateTeamDetail?.description;

  // --- Form Initialization ---
  const form = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      teamLeads: [],
      selectedMembers: [],
    },
  });

  // --- Format org members for selection ---
  useEffect(() => {
    if (orgMembers?.data?.members) {
      const formatted = orgMembers.data.members.map((member) => ({
        id: member.userId || member.id,
        label: member.name || member.email,
        value: {
          id: member.userId || member.id,
          name: member.name,
          email: member.email,
        },
      }));
      setAllMemberOptions(formatted);
    }
  }, [orgMembers]);

  // --- Handle update mode ---
  useEffect(() => {
    if (updateTeamDetail && updateTeamDetail.id) {
      const leads = Array.isArray(updateTeamDetail.members)
        ? updateTeamDetail.members
            .filter((m) => m.isLead)
            .map((lead) => ({
              id: lead.id,
              label: lead.name || lead.email,
              value: { id: lead.id, email: lead.email, name: lead.name },
            }))
        : [];

      const others = Array.isArray(updateTeamDetail.members)
        ? updateTeamDetail.members
            .filter((m) => !m.isLead)
            ?.map?.((m) => ({
              id: m.id,
              label: m.name || m.email,
              value: { id: m.id, email: m.email, name: m.name },
            }))
        : [];

      form.reset({
        name: updateTeamDetail.name || '',
        description: updateTeamDetail.description || '',
        teamLeads: leads,
        selectedMembers: others,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        teamLeads: [],
        selectedMembers: [],
      });
    }
  }, [updateTeamDetail, form]);

  // --- Derived: members excluding the team leads ---
  const name = form.watch('name') || '';
  const description = form.watch('description') || '';
  const teamLeads = form.watch('teamLeads') || [];
  const unassignedMembers = allMemberOptions.filter(
    (member) => !teamLeads.some((lead) => lead.id === member.id),
  );

  // --- Handlers ---
  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const onSubmit = (data) => {
    if (isUpdateMode) {
      handleUpdateTeam(data);
    } else {
      handleCreateTeam(data);
    }
  };

  const handleCreateTeam = onAuthority(['Admin'], (data) => {
    const membersPayload = [
      ...data.teamLeads.map((l) => ({ ...l.value, isLead: true })),
      ...data.selectedMembers.map((m) => ({ ...m.value, isLead: false })),
    ];

    const finalPayload = {
      name: data.name,
      description: data.description,
      members: membersPayload,
      team_lead: data.teamLeads.map((l) => l.value), // align with TeamInfo
    };

    toast.promise(createTeam(finalPayload), {
      loading: 'Creating team...',
      success: (res) => {
        if (res?.error?.status === 409)
          throw new Error(res?.error?.data?.error || 'Conflict');
        setShowAddTeamModal(false);
        resetForm();
        return 'Team created successfully';
      },
      error: (err) =>
        err?.message ||
        err?.data?.error ||
        err?.error?.data?.error ||
        'Failed to create team',
    });
  });

  const handleUpdateTeam = onAuthority(['Admin'], (data) => {
    if (!updateTeamDetail?.id) {
      toast.error('Missing team ID.');
      return;
    }

    const membersPayload = [
      ...data.teamLeads.map((l) => ({ ...l.value, isLead: true })),
      ...data.selectedMembers.map((m) => ({ ...m.value, isLead: false })),
    ];

    const finalPayload = {
      name: data.name,
      description: data.description,
      members: membersPayload,
      team_lead: data.teamLeads.map((l) => l.value), // align with TeamInfo
    };

    toast.promise(
      updateTeam({ payload: finalPayload, teamId: updateTeamDetail.id }),
      {
        loading: 'Updating team...',
        success: () => {
          setShowAddTeamModal(false);
          resetForm();
          return 'Team updated successfully';
        },
        error: (err) => err?.data?.message || 'Failed to update team',
      },
    );
  });

  const resetForm = () => {
    form.reset({
      name: '',
      description: '',
      teamLeads: [],
      selectedMembers: [],
    });
    setUpdateTeamDetail({ id: '', name: '', description: '', members: [] });
  };

  return (
    <Modal
      open={showAddTeamModal}
      setOpen={() => {
        setShowAddTeamModal(!showAddTeamModal);
        resetForm();
      }}
      title={isUpdateMode ? 'Update Team' : 'Add New Team'}
      description="Assign a lead and members to a new team in your organization."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Team Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center w-full">
                  <span>
                    Team Name <span className="text-destructive">*</span>
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-normal',
                      name.length > 40
                        ? 'text-destructive'
                        : 'text-muted-foreground',
                    )}
                  >
                    {name.length}/40
                  </span>
                </FormLabel>
                <FormControl>
                  <InputWrapper>
                    <Users />
                    <Input
                      {...field}
                      type="text"
                      placeholder="e.g. Frontend Developers"
                      className="pl-9"
                    />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Team Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center w-full">
                  <span>
                    Team Description <span className="text-destructive">*</span>
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-normal',
                      description.length > 60
                        ? 'text-destructive'
                        : 'text-muted-foreground',
                    )}
                  >
                    {description.length}/60
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="What is this team responsible for?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 🔥 Team Lead with remote search */}
          <FormField
            control={form.control}
            name="teamLeads"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Team Leads <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  {isLoading ? (
                    <Skeleton className=" h-9 w-full" />
                  ) : (
                    <MultiSelect
                      placeholder="Select Team Leads"
                      options={allMemberOptions}
                      values={field.value}
                      onChange={(options) => {
                        field.onChange(options);
                        // Remove selected leads from selected members to avoid duplicates
                        if (options?.length > 0) {
                          const leadIds = options.map((o) => o.value?.id);
                          const currentMembers =
                            form.getValues('selectedMembers') || [];
                          form.setValue(
                            'selectedMembers',
                            currentMembers.filter(
                              (m) => !leadIds.includes(m.value?.id),
                            ),
                          );
                        }
                      }}
                      onSearchChange={handleSearchChange}
                      enableSearch
                      isLoading={isSearching}
                      searchPlaceholder="Search members..."
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Team Members */}
          <FormField
            control={form.control}
            name="selectedMembers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Members (Optional)</FormLabel>
                <FormControl>
                  <MultiSelect
                    placeholder="Search and select members"
                    options={unassignedMembers}
                    values={field.value}
                    onChange={field.onChange}
                    onSearchChange={handleSearchChange} // 👈 shared search
                    enableSearch
                    emptyPlaceholder={
                      orgMembers?.length === 0
                        ? 'No items found'
                        : "You've added all available members."
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="w-full flex items-center justify-end mt-4">
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
            >
              <Plus />
              {isUpdateMode
                ? isUpdating
                  ? 'Updating Team...'
                  : 'Update Team'
                : isCreating
                  ? 'Creating...'
                  : 'Create Team'}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

export default AddTeam;