import { useEffect } from 'react';
import { toast } from 'sonner';
import Select from '@/components/custom/select';
import {
  useGetVmJiraProjectsQuery,
  useGetVmJiraIssueTypesQuery,
  useGetVmJiraUsersQuery,
} from '@/services/vm/integrationsApi';
import { Skeleton } from '@/components/ui/skeleton';

function toArray(data, knownKey) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (knownKey && Array.isArray(data[knownKey])) return data[knownKey];
  const envelopes = ['data', 'results', 'items', 'list'];
  for (const key of envelopes) {
    if (Array.isArray(data[key])) return data[key];
  }
  return [];
}

function StepProjectConfig({ payload, onSelect, credentialsReady }) {
  const skip = !credentialsReady;

  const { data: projectsData, isLoading: projectsLoading, isError: isProjectsError } = useGetVmJiraProjectsQuery(
    undefined,
    { skip }
  );

  const projectOptions = toArray(projectsData, 'projects').map((p) => ({
    label: p.name,
    value: p.key,
  }));

  const { data: typesData, isLoading: typesLoading, isError: isTypesError } = useGetVmJiraIssueTypesQuery(
    payload.project,
    { skip: skip || !payload.project }
  );

  const typeOptions = toArray(typesData, 'issueTypes').map((t) => ({
    label: t.name,
    value: t.name,
  }));

  const { data: usersData, isLoading: usersLoading, isError: isUsersError } = useGetVmJiraUsersQuery(
    undefined,
    { skip }
  );

  const userOptions = toArray(usersData, 'users').map((u) => ({
    label: u.displayName,
    value: u.accountId,
  }));

  useEffect(() => {
    if (isProjectsError || isTypesError || isUsersError) {
      toast.error('Jira integration failed. Unable to fetch data.');
    }
  }, [isProjectsError, isTypesError, isUsersError]);

  const handleProjectChange = (opt) => {
    onSelect('project', opt?.value || '');
    onSelect('ticketType', '');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Select Project</label>
        {projectsLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={payload.project}
            onChange={handleProjectChange}
            options={projectOptions}
            placeholder="Select a project..."
            enableSearch={true}
          />
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Default Assignee</label>
        {usersLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={payload.assignee}
            onChange={(opt) => onSelect('assignee', opt?.value || '')}
            options={userOptions}
            placeholder="Select an assignee..."
            enableSearch={true}
          />
        )}
      </div>

      {payload.project && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Ticket Type</label>
          {typesLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={payload.ticketType}
              onChange={(opt) => onSelect('ticketType', opt?.value || '')}
              options={typeOptions}
              placeholder={isTypesError ? 'Failed to load ticket types' : 'Select ticket type...'}
              enableSearch={false}
              disabled={isTypesError}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default StepProjectConfig;
