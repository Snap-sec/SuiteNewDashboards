import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Archive, Send, Zap, User, Bell } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useGetMembersQuery } from '@/services/vm/members';
import SelectWithAvatar from '@/components/custom/select-with-avatar';
import Select from '@/components/custom/select';
import DatePicker from '@/components/custom/date-picker';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import { useGetAimBusinessUnitsQuery } from '@/services/asset-inventory/businessUnitsApi';
import { useGetAimGlobalAssetsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { useGetVmRelevanceGroupsQuery } from '@/services/vm/relevanceGroupsApi';
import useDebounce from '@/hooks/use-debounce';
import { CustomTooltip } from '@/components/custom/tooltip';

// Human-readable metadata for known action types (label now comes from schema)
const ACTION_META = {
  pushToJira: { description: 'Push matching vulnerabilities to a Jira project', Icon: Send },
  archiveVulnerability: { description: 'Archive matching vulnerabilities into the archive store', Icon: Archive },
  setAssignee: { description: 'Assign matching vulnerabilities to a member', Icon: User },
  transformCvss: { description: 'Adjust the CVSS score of matching vulnerabilities', Icon: Zap },
  runFalsePositiveAnalysis: { description: 'Run false positive analysis on matching vulnerabilities', Icon: Zap },
  falsePositiveAnalysis: { description: 'Run false positive analysis on matching vulnerabilities', Icon: Zap },
  runFalsePositive: { description: 'Run false positive analysis on matching vulnerabilities', Icon: Zap },
  falsePositive: { description: 'Run false positive analysis on matching vulnerabilities', Icon: Zap },
  setField: { description: 'Update a specific field of matching vulnerabilities', Icon: Zap },
  alert: { description: 'Notify a channel when vulnerabilities match this rule', Icon: Bell },
};

const FALLBACK_ACTIONS = ['pushToJira', 'archiveVulnerability', 'setAssignee'];

const CVSS_OPERATIONS = [
  { label: 'Add', value: 'add' },
  { label: 'Subtract', value: 'subtract' },
  { label: 'Multiply', value: 'multiply' },
  { label: 'Divide', value: 'divide' },
  { label: 'Set', value: 'set' },
];

function AutomationActionTab({
  actions = [],
  setActions,
  supportedActions = [],
  schemaData,
}) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  // Extract already-selected assignee IDs (handling both object and string formats)
  const selectedAssigneeIds = actions
    .filter((a) => a.type === 'setAssignee' && a.config?.assignee)
    .map((a) => typeof a.config.assignee === 'string' ? a.config.assignee : a.config.assignee?.userId)
    .filter(Boolean);

  const {
    data: membersData,
    isLoading: membersLoading,
    isFetching: membersFetching,
  } = useGetMembersQuery({
    search: debouncedSearch,
    ...(selectedAssigneeIds.length > 0 && { includeIds: selectedAssigneeIds.join(',') }),
  });

  const memberList = (membersData?.data?.members || []).filter(
    (u) => u.hasSignedUp === true,
  );

  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [buSearch, setBuSearch] = useState('');
  const [assetSearch, setAssetSearch] = useState('');
  const [relevanceGroupSearch, setRelevanceGroupSearch] = useState('');

  const debouncedAssessmentSearch = useDebounce(assessmentSearch, 400);
  const debouncedBuSearch = useDebounce(buSearch, 400);
  const debouncedAssetSearch = useDebounce(assetSearch, 400);
  const debouncedRelevanceGroupSearch = useDebounce(relevanceGroupSearch, 400);

  const getFieldSchema = (fieldValue) => schemaData?.fields?.find(f => f.field === fieldValue);

  const hasActionAssessmentField = actions.some(a => a.type === 'setField' && getFieldSchema(a.config?.field)?.valueType === 'Assessment');
  const hasActionBuField = actions.some(a => a.type === 'setField' && getFieldSchema(a.config?.field)?.valueType === 'BusinessUnit');
  const hasActionAssetField = actions.some(a => a.type === 'setField' && getFieldSchema(a.config?.field)?.valueType === 'Asset');
  const hasActionRelevanceGroupField = actions.some(a => a.type === 'setField' && (getFieldSchema(a.config?.field)?.valueType === 'RelevanceGroup' || a.config?.field === 'riskRelevanceGroups'));

  const { data: assessmentsData, isLoading: assessmentsLoading } = useGetVmAssessmentsQuery(
    { search: debouncedAssessmentSearch, limit: 30 },
    { skip: !hasActionAssessmentField }
  );
  const assessmentList = assessmentsData?.assessments || assessmentsData?.data?.assessments || [];

  const { data: buData, isLoading: buLoading } = useGetAimBusinessUnitsQuery(
    { search: debouncedBuSearch, limit: 30 },
    { skip: !hasActionBuField }
  );
  const buList = buData?.businessUnits || [];

  const { data: assetsData, isLoading: assetsLoading } = useGetAimGlobalAssetsQuery(
    { search: debouncedAssetSearch, limit: 30 },
    { skip: !hasActionAssetField }
  );
  const assetList = assetsData?.data?.assets || assetsData?.assets || [];

  const { data: relevanceGroupsData, isLoading: relevanceGroupsLoading } = useGetVmRelevanceGroupsQuery(
    { search: debouncedRelevanceGroupSearch, limit: 30 },
    { skip: !hasActionRelevanceGroupField }
  );
  const relevanceGroupList = relevanceGroupsData?.data || relevanceGroupsData || [];

  // Normalize to [{label, value}] — works with both string[] and object[] inputs
  const availableActions = supportedActions.length
    ? supportedActions.map((a) => (typeof a === 'string' ? { label: a, value: a } : a))
    : FALLBACK_ACTIONS.map((v) => ({ label: v, value: v }));

  const isSelected = (type) => actions.some((a) => a.type === type);

  const toggleAction = (type, checked) => {
    if (checked) {
      if (isSelected(type)) return;
      setActions([...actions, { type, config: {} }]);
    } else {
      setActions(actions.filter((a) => a.type !== type));
    }
  };

  const updateActionConfig = (type, key, value) => {
    setActions(
      actions.map((a) =>
        a.type === type ? { ...a, config: { ...(a.config || {}), [key]: value } } : a,
      ),
    );
  };

  const getAction = (type) => actions.find((a) => a.type === type);

  return (
    <div className="flex flex-col gap-5 mt-2">
      <div>
        <p className="text-sm font-medium mb-1">
          Actions <span className="text-destructive">*</span>
        </p>
        <p className="text-xs text-muted-foreground mb-2">
          Select one or more actions to run when this rule matches.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {availableActions.map(({ label: actionLabel, value: type, active }) => {
            const meta = ACTION_META[type] || { description: '', Icon: Zap };
            const { Icon } = meta;
            const selected = isSelected(type);
            const isDisabled = active === false;

            const isJira = type === 'pushToJira';
            const isFP = type === 'runFalsePositiveAnalysis' || type === 'falsePositiveAnalysis' || type === 'runFalsePositive' || type === 'falsePositive';

            if (isDisabled && (isJira || isFP)) {
              const tooltipText = isJira
                ? "Connect a Jira project in Integrations to use this action"
                : "Please enble Ai feature to enable this features";

              return (
                <CustomTooltip key={type} text={tooltipText}>
                  <label
                    className={`flex items-start gap-3 p-3 border rounded-lg transition-colors opacity-50 cursor-not-allowed bg-muted/20 ${selected ? 'border-primary bg-primary/5' : ''}`}
                  >
                    <Checkbox
                      checked={selected}
                      disabled={isDisabled}
                      onCheckedChange={(checked) => {
                        if (!isDisabled) toggleAction(type, !!checked);
                      }}
                      className="mt-1"
                    />
                    <div className="flex items-start gap-2">
                      <Icon className="size-4 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{actionLabel}</p>
                        {meta.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{meta.description}</p>
                        )}
                      </div>
                    </div>
                  </label>
                </CustomTooltip>
              );
            }

            return (
              <label
                key={type}
                className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${isDisabled ? 'opacity-50 cursor-not-allowed bg-muted/20' : 'cursor-pointer hover:bg-muted/50'
                  } ${selected ? 'border-primary bg-primary/5' : ''}`}
              >
                <Checkbox
                  checked={selected}
                  disabled={isDisabled}
                  onCheckedChange={(checked) => {
                    if (!isDisabled) toggleAction(type, !!checked);
                  }}
                  className="mt-1"
                />
                <div className="flex items-start gap-2">
                  <Icon className="size-4 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{actionLabel}</p>
                    {meta.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{meta.description}</p>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {actions.filter(a => ['setAssignee', 'transformCvss', 'setField', 'alert'].includes(a.type)).length > 0 && (
          <div className="flex flex-col gap-4 mt-6">
            {actions.filter(a => ['setAssignee', 'transformCvss', 'setField', 'alert'].includes(a.type)).map((action) => {
              const { type } = action;
              const actionLabel = availableActions.find((a) => a.value === type)?.label || type;
              const meta = ACTION_META[type] || { description: '', Icon: Zap };
              const { Icon } = meta;

              return (
                <div key={type} className="flex flex-col gap-3 p-4 border rounded-lg bg-muted/20">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Icon className="size-4 text-primary" />
                    Configure {actionLabel}
                  </h4>

                  {type === 'setAssignee' && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Select Assignee</p>
                      <SelectWithAvatar
                        onSearchChange={(val) => setSearch(val)}
                        users={memberList}
                        value={action?.config?.assignee?.userId || ''}
                        onChange={(value) => {
                          const selectedMember = memberList.find((m) => m._id === value);
                          if (selectedMember) {
                            updateActionConfig(type, 'assignee', {
                              email: selectedMember.email,
                              name: selectedMember.name,
                              userId: selectedMember._id,
                            });
                          }
                        }}
                        searchFields={['name', 'email']}
                        isLoading={membersLoading || membersFetching}
                        placeholder="Select a member..."
                      />
                    </div>
                  )}

                  {type === 'transformCvss' && (
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">CVSS Operation <span className="text-destructive">*</span></p>
                        <Select
                          options={CVSS_OPERATIONS}
                          placeholder="Select operation"
                          value={action?.config?.operation}
                          onChange={(s) => updateActionConfig(type, 'operation', s?.value)}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Value <span className="text-destructive">*</span></p>
                        <Input
                          type="number"
                          placeholder="e.g. 1.5"
                          min="0"
                          max="10"
                          value={action?.config?.operand ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (Number(val) >= 0 && Number(val) <= 10)) {
                              updateActionConfig(type, 'operand', val === '' ? '' : parseFloat(val));
                            }
                          }}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Applied to CVSS score when rule executes (0–10)</p>
                      </div>
                    </div>
                  )}

                  {type === 'setField' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs text-muted-foreground">Field <span className="text-destructive">*</span></p>
                        <Select
                          placeholder="Select field"
                          options={schemaData?.fields?.map(f => ({ label: f.label, value: f.field })) || []}
                          value={action?.config?.field}
                          onChange={(s) => {
                            setActions(
                              actions.map((a) =>
                                a.type === type
                                  ? { ...a, config: { ...(a.config || {}), field: s?.value, value: '' } }
                                  : a
                              )
                            );
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs text-muted-foreground">Value <span className="text-destructive">*</span></p>
                        {(() => {
                          const fieldSchema = getFieldSchema(action?.config?.field);

                          if (!action?.config?.field) {
                            return (
                              <Input
                                placeholder="Select a field first"
                                disabled
                              />
                            );
                          }

                          if (fieldSchema?.valueType === 'User') {
                            const selectedId = memberList.find((m) => m.email === action?.config?.value || m._id === action?.config?.value || m.userId === action?.config?.value)?._id || action?.config?.value || '';
                            return (
                              <SelectWithAvatar
                                onSearchChange={(val) => setSearch(val)}
                                users={memberList}
                                value={selectedId}
                                onChange={(userId) => {
                                  const member = memberList.find((m) => m._id === userId || m.userId === userId);
                                  updateActionConfig(type, 'value', member?.userId || member?._id || userId);
                                }}
                                searchFields={['name', 'email']}
                                isLoading={membersLoading || membersFetching}
                                placeholder="Select a member..."
                              />
                            );
                          }

                          if (fieldSchema?.valueType === 'Assessment') {
                            const options = assessmentList.map((a) => ({ label: a.name || a.title || a._id, value: a._id }));
                            const selectedOpt = options.find((o) => o.value === action?.config?.value);
                            return (
                              <Select
                                placeholder="Select assessment..."
                                options={options}
                                value={selectedOpt?.value}
                                onChange={(s) => updateActionConfig(type, 'value', s?.value)}
                                onSearchChange={(val) => setAssessmentSearch(val)}
                                isSearching={assessmentsLoading}
                              />
                            );
                          }

                          if (fieldSchema?.valueType === 'BusinessUnit') {
                            const options = buList.map((b) => ({ label: b.name || b._id, value: b._id }));
                            const selectedOpt = options.find((o) => o.value === action?.config?.value);
                            return (
                              <Select
                                placeholder="Select business unit..."
                                options={options}
                                value={selectedOpt?.value}
                                onChange={(s) => updateActionConfig(type, 'value', s?.value)}
                                onSearchChange={(val) => setBuSearch(val)}
                                isSearching={buLoading}
                              />
                            );
                          }

                          if (fieldSchema?.valueType === 'Asset') {
                            const options = assetList.map((a) => ({ label: a.name || a.value || a._id, value: a.value || a._id }));
                            const selectedOpt = options.find((o) => o.value === action?.config?.value);
                            return (
                              <Select
                                placeholder="Select asset..."
                                options={options}
                                value={selectedOpt?.value}
                                onChange={(s) => updateActionConfig(type, 'value', s?.value)}
                                onSearchChange={(val) => setAssetSearch(val)}
                                isSearching={assetsLoading}
                              />
                            );
                          }

                          if (fieldSchema?.valueType === 'RelevanceGroup' || action?.config?.field === 'riskRelevanceGroups') {
                            const options = relevanceGroupList.map((g) => ({ label: g.name || g.title || g._id, value: g._id }));
                            const selectedOpt = options.find((o) => o.value === action?.config?.value);
                            return (
                              <Select
                                placeholder="Select relevance group..."
                                options={options}
                                value={selectedOpt?.value}
                                onChange={(s) => updateActionConfig(type, 'value', s?.value)}
                                onSearchChange={(val) => setRelevanceGroupSearch(val)}
                                isSearching={relevanceGroupsLoading}
                              />
                            );
                          }

                          if (fieldSchema?.valueType === 'Date') {
                            const dateValue = action?.config?.value ? new Date(action?.config?.value) : undefined;
                            return (
                              <DatePicker
                                value={dateValue}
                                onChange={(date) => updateActionConfig(type, 'value', date ? date.toISOString() : '')}
                              />
                            );
                          }

                          if (fieldSchema?.valueType === 'Number') {
                            return (
                              <Input
                                type="number"
                                placeholder="Enter number"
                                value={action?.config?.value}
                                onChange={(e) => updateActionConfig(type, 'value', e.target.value)}
                              />
                            );
                          }

                          if (fieldSchema?.values) {
                            const options = fieldSchema.values.map(v => ({
                              label: typeof v === 'string' ? v.charAt(0).toUpperCase() + v.slice(1) : v,
                              value: v
                            }));
                            return (
                              <Select
                                placeholder="Select value"
                                options={options}
                                value={action?.config?.value}
                                onChange={(s) => updateActionConfig(type, 'value', s?.value)}
                              />
                            );
                          }
                          return (
                            <Input
                              placeholder="Enter value"
                              value={action?.config?.value || ''}
                              onChange={(e) => updateActionConfig(type, 'value', e.target.value)}
                              disabled={!action?.config?.field}
                            />
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {type === 'alert' && (() => {
                    const alertSchema = availableActions.find(a => a.value === 'alert');
                    const channels = alertSchema?.supportedChannels || ['email'];
                    const channelOptions = channels.map(c => ({
                      label: c.charAt(0).toUpperCase() + c.slice(1),
                      value: c
                    }));

                    return (
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-0.5">
                            <p className="text-xs text-muted-foreground">Channel</p>
                            <Select
                              placeholder="Select channel"
                              options={channelOptions}
                              value={action?.config?.channel}
                              onChange={(s) => updateActionConfig(type, 'channel', s?.value)}
                            />
                          </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-xs text-muted-foreground">Destination</p>
                          <Input
                            placeholder="e.g. security-team@company.com"
                            value={action?.config?.destination || ''}
                            onChange={(e) => updateActionConfig(type, 'destination', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Message</p>
                          <p className="text-[10px] text-muted-foreground">{(action?.config?.message || '').length}/500</p>
                        </div>
                        <Textarea
                          placeholder="e.g. {{severity}} vulnerability found in {{asset}} — review required"
                          value={action?.config?.message || ''}
                          onChange={(e) => updateActionConfig(type, 'message', e.target.value)}
                          maxLength={500}
                          rows={3}
                          className="resize-none"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          You can use variables like {`{{severity}}`}, {`{{asset}}`}, and {`{{title}}`} — they'll be filled in when the alert fires.
                        </p>
                      </div>
                    </div>
                  );
                })()}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AutomationActionTab;

