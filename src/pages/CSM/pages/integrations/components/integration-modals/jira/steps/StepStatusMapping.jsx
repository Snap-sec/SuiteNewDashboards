import { useEffect } from 'react';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';
import { useGetVmJiraStatusesQuery } from '@/services/vm/integrationsApi';
import Select from '@/components/custom/select';

export const SNAPSEC_STATUSES = [
  'In Review',
  'Triaged',
  'Re Test',
  'Unresolved',
  'Resolved',
  'Fixed In Staging',
  'Risk Accepted',
  'Not Applicable',
  'False Positive',
  'Duplicate',
];

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

function StatusMappingRow({ leftKey, rightKey, onChange, index, jiraStatusOptions, isLoading }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 group">
      <div className="flex items-center h-9 px-3 rounded-md border border-border bg-muted/40 text-sm font-mono text-foreground truncate">
        {leftKey}
      </div>

      <div className="flex items-center justify-center">
        <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <div className="relative">
        <Select
          value={rightKey}
          onChange={(opt) => onChange(index, opt?.value || '')}
          options={jiraStatusOptions.map((s) => ({ label: s, value: s }))}
          placeholder={isLoading ? 'Loading statuses...' : 'Select Jira status'}
          disabled={isLoading}
          enableSearch={false}
          isSearching={isLoading}
          className="h-9"
        />
      </div>
    </div>
  );
}

function StepStatusMapping({ projectKey, ticketType, mappings, onChange }) {
  const { data: statusesData, isLoading, isError } = useGetVmJiraStatusesQuery(projectKey, {
    skip: !projectKey,
  });

  useEffect(() => {
    if (isError) {
      toast.error('Jira integration failed. Unable to fetch status mappings.');
    }
  }, [isError]);

  const allData = toArray(statusesData);
  const selectedType = allData.find((t) => t.name === ticketType);
  const jiraStatuses = selectedType?.statuses || [];
  const jiraStatusOptions = jiraStatuses.map((s) => s.name || s);

  const rows = mappings?.length
    ? mappings
    : SNAPSEC_STATUSES.map((s) => ({ left: s, right: '' }));

  const handleChange = (index, value) => {
    const updated = rows.map((row, i) =>
      i === index ? { ...row, right: value } : row
    );
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 px-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          SnapSec Status
        </span>
        <span className="w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Jira Status
        </span>
      </div>

      <div className="border-t border-border" />

      <div className="flex flex-col gap-2.5">
        {rows.map((row, index) => (
          <StatusMappingRow
            key={index}
            index={index}
            leftKey={row.left}
            rightKey={row.right}
            onChange={handleChange}
            jiraStatusOptions={jiraStatusOptions}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}

export default StepStatusMapping;
