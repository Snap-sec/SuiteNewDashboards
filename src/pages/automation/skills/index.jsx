import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import PageHeading from '@/components/custom/page-heading';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import SkillsTable from './components/SkillsTable';
import CreateSkillModal from './components/CreateSkillModal';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
import {
  useGetSkillsQuery,
  useCreateSkillMutation,
  useRefreshSkillsMutation,
} from '@/services/automation/skillsApi';

export default function AutomationSkills() {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSyncConfirmOpen, setIsSyncConfirmOpen] = useState(false);
  const [createSkill, { isLoading: isCreatingSkill }] = useCreateSkillMutation();
  const [refreshSkills, { isLoading: isSyncing }] = useRefreshSkillsMutation();

  const { data: apiData, isLoading, isFetching, isError, error } = useGetSkillsQuery({ page: 1, limit: 10 });

  const handleSyncSkills = useCallback(async () => {
    try {
      await refreshSkills().unwrap();
      toast.success('Skills synced successfully');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to sync skills');
    } finally {
      setIsSyncConfirmOpen(false);
    }
  }, [refreshSkills]);

  if (!isLoading && !isFetching && isError) {
    return <ApiErrorHandler error={error} />;
  }

  const rawSkills =
    apiData?.data?.skills ||
    apiData?.data?.data ||
    apiData?.data ||
    apiData?.skills ||
    (Array.isArray(apiData) ? apiData : []);
  const skillsList = Array.isArray(rawSkills) ? rawSkills : [];

  const isEmpty = !isLoading && !isFetching && skillsList.length === 0;

  const handleCreateSkill = useCallback(
    async (payload) => {
      try {
        const res = await createSkill(payload).unwrap();
        const created = res?.data || res;
        const newId = created?._id || created?.id;
        toast.success(`Skill "${payload.name}" created successfully!`);
        setIsCreateOpen(false);
        if (newId) {
          navigate(`/ai-agent-builder/skills/${newId}`);
        }
      } catch (err) {
        toast.error(err?.data?.message || err?.message || 'Failed to create skill');
        throw err;
      }
    },
    [createSkill, navigate]
  );

  return (
    <div className="p-4 flex flex-col gap-4">
      <Helmet>
        <title>Automation | Skills</title>
      </Helmet>

      {isEmpty ? (
        <EmptyScreen
          title="No skills found"
          subTitle="Create or sync skills to get started."
          engage={
            <div className="flex items-center gap-2 mt-2 justify-center">
              <Button
                variant="outline"
                onClick={() => setIsSyncConfirmOpen(true)}
                disabled={isSyncing}
                className="gap-2"
              >
                <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                {isSyncing ? 'Syncing...' : 'Sync Skills'}
              </Button>
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                <Plus size={14} /> Create Skill
              </Button>
            </div>
          }
        />
      ) : (
        <>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <PageHeading
              title="Skills"
              description="Develop, validate, and manage autonomous skill packages and execution directives."
            />
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                onClick={() => setIsSyncConfirmOpen(true)}
                disabled={isSyncing}
                className="gap-1.5"
              >
                <RefreshCw className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Skills'}
              </Button>
              <Button onClick={() => setIsCreateOpen(true)} className="gap-1.5">
                <Plus className="size-4" />
                Create Skill
              </Button>
            </div>
          </div>

          <SkillsTable
            onOpenCreateModal={() => setIsCreateOpen(true)}
            onSyncSkills={() => setIsSyncConfirmOpen(true)}
            isSyncing={isSyncing}
          />
        </>
      )}

      <ConfirmDialog
        open={isSyncConfirmOpen}
        setOpen={setIsSyncConfirmOpen}
        onConfirm={handleSyncSkills}
        variant="warning"
        title="Sync Skills"
        dialog="Are you sure you want to sync skills? This will refresh all skills from the server."
        confirmButton={
          <Button disabled={isSyncing} className="gap-2">
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Skills'}
          </Button>
        }
      />

      <CreateSkillModal
        open={isCreateOpen}
        setOpen={setIsCreateOpen}
        onCreateSkill={handleCreateSkill}
        isLoading={isCreatingSkill}
      />
    </div>
  );
}
