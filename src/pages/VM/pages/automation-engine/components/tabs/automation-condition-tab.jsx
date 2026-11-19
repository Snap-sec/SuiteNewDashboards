import { Plus, Trash2 } from 'lucide-react';
import { useState, memo,useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Select from '@/components/custom/select';
import DatePicker from '@/components/custom/date-picker';
import SelectWithAvatar from '@/components/custom/select-with-avatar';
import { useGetMembersQuery } from '@/services/vm/members';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import { useGetAimBusinessUnitsQuery } from '@/services/asset-inventory/businessUnitsApi';
import { useGetAimGlobalAssetsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { useGetVmRelevanceGroupsQuery } from '@/services/vm/relevanceGroupsApi';
import useDebounce from '@/hooks/use-debounce';
import { generateId } from '../create-automation-rule-modal';

const operatorNeedsValue = (op) => !['exists', 'notExists'].includes(op);

const LogicToggle = memo(function LogicToggle({ value, onChange }) {
  return (
    <div className="flex bg-muted/60 rounded-md p-1 items-center border border-border">
      {['AND', 'OR', 'NOT']?.map((op) => (
        <Button
          key={op}
          variant={value === op ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onChange(op)}
          className={cn(
            "h-7 px-3 text-xs rounded-sm transition-all",
            value === op ? "shadow-sm" : "text-muted-foreground/60 hover:text-foreground"
          )}
        >
          {op}
        </Button>
      ))}
    </div>
  );
});

const ConditionGroup = memo(function ConditionGroup({
  group,
  onUpdate,
  onRemove,
  depth,
  isOnly,
  fieldOptions,
  getOperatorOptions,
  getFieldSchema,
  memberList,
  assessmentList,
  buList,
  assetList,
  relevanceGroupList,
  context,
  setMemberSearch,
  setAssessmentSearch,
  setBuSearch,
  setAssetSearch,
  setRelevanceGroupSearch,
  membersLoading,
  assessmentsLoading,
  buLoading,
  assetsLoading,
  relevanceGroupsLoading
}) {
  const groupChildren = Array.isArray(group?.children) ? group.children : [];

  const updateChild = useCallback(
    (id, updated) => {
      onUpdate({
        ...group,
        children: groupChildren.map((c) => (c.id === id ? updated : c)),
      });
    },
    [group, groupChildren, onUpdate],
  );

  const removeChild = useCallback(
    (id) => {
      const next = groupChildren.filter((c) => c.id !== id);
      onUpdate({ ...group, children: next?.length ? next : [{ id: generateId(), type: 'condition', field: '', operator: '', value: '' }] });
    },
    [group, groupChildren, onUpdate],
  );

  const addRule = useCallback(() =>
    onUpdate({ ...group, children: [...groupChildren, { id: generateId(), type: 'condition', field: '', operator: '', value: '' }] }), [group, groupChildren, onUpdate]);

  const addGroup = useCallback(() =>
    onUpdate({ ...group, children: [...groupChildren, { id: generateId(), type: 'group', logicalOp: 'AND', children: [{ id: generateId(), type: 'condition', field: '', operator: '', value: '' }] }] }), [group, groupChildren, onUpdate]);

  const childRules = groupChildren.filter((c) => c?.type === 'condition');
  const isOnlyRule = childRules.length <= 1;

  const handleLogicOp = useCallback((op) => onUpdate({ ...group, logicalOp: op }), [group, onUpdate]);

  const renderValueInput = (condition, id) => {
    if (!operatorNeedsValue(condition.operator)) {
      return (
        <div className="h-9 rounded-md border bg-muted/50 px-3 text-sm text-muted-foreground flex items-center">
          No value required
        </div>
      );
    }

    const fieldSchema = getFieldSchema(condition.field);
    const updateCond = (key, value) => updateChild(id, { ...condition, [key]: value });

    if (fieldSchema?.valueType === 'User') {
      const selectedId = memberList.find((m) => m.email === condition.value || m._id === condition.value || m.userId === condition.value)?._id || condition.value || '';
      return (
        <SelectWithAvatar
          onSearchChange={setMemberSearch}
          users={memberList}
          value={selectedId}
          onChange={(userId) => {
            const member = memberList.find((m) => m._id === userId || m.userId === userId);
            updateCond('value', member?.userId || member?._id || userId);
          }}
          searchFields={['name', 'email']}
          isLoading={membersLoading}
          placeholder="Select a member..."
        />
      );
    }

    if (fieldSchema?.valueType === 'Assessment') {
      const options = assessmentList?.map?.((a) => ({ label: a.name || a.title || a._id, value: a._id }));
      const selectedOpt = options.find((o) => o.value === condition.value);
      return (
        <Select
          placeholder="Select assessment..."
          options={options}
          value={selectedOpt?.value}
          onChange={(s) => updateCond('value', s?.value)}
          onSearchChange={setAssessmentSearch}
          isSearching={assessmentsLoading}
        />
      );
    }

    if (fieldSchema?.valueType === 'BusinessUnit') {
      const options = buList?.map?.((b) => ({ label: b.name || b._id, value: b._id }));
      const selectedOpt = options.find((o) => o.value === condition.value);
      return (
        <Select
          placeholder="Select business unit..."
          options={options}
          value={selectedOpt?.value}
          onChange={(s) => updateCond('value', s?.value)}
          onSearchChange={setBuSearch}
          isSearching={buLoading}
        />
      );
    }

    if (fieldSchema?.valueType === 'Asset') {
      const options = assetList?.map?.((a) => ({ label: a.name || a.value || a._id, value: a.value || a._id }));
      const selectedOpt = options.find((o) => o.value === condition.value);
      return (
        <Select
          placeholder="Select asset..."
          options={options}
          value={selectedOpt?.value}
          onChange={(s) => updateCond('value', s?.value)}
          onSearchChange={setAssetSearch}
          isSearching={assetsLoading}
        />
      );
    }

    if (fieldSchema?.valueType === 'RelevanceGroup' || condition.field === 'riskRelevanceGroups') {
      let options = relevanceGroupList?.map?.((g) => ({ label: g.name || g.title || g._id, value: g._id }));
      const contextGroupId = context?.relevanceGroupId;
      const contextGroupName = context?.relevanceGroupName;
      if (contextGroupId && !options.some(o => o.value === contextGroupId)) {
        options = [{ label: contextGroupName || 'Current Relevance Group', value: contextGroupId }, ...options];
      }
      const selectedOpt = options.find((o) => o.value === condition.value);
      return (
        <Select
          placeholder="Select relevance group..."
          options={options}
          value={selectedOpt?.value}
          onChange={(s) => updateCond('value', s?.value)}
          onSearchChange={setRelevanceGroupSearch}
          isSearching={relevanceGroupsLoading}
        />
      );
    }

    if (fieldSchema?.valueType === 'Date') {
      const dateValue = condition.value ? new Date(condition.value) : undefined;
      return (
        <DatePicker
          value={dateValue}
          onChange={(date) => updateCond('value', date ? date.toISOString() : '')}
        />
      );
    }

    if (fieldSchema?.valueType === 'Number') {
      return (
        <Input
          type="number"
          placeholder="Enter number"
          value={condition.value}
          onChange={(e) => updateCond('value', e.target.value)}
        />
      );
    }

    if (fieldSchema?.values) {
      const options = fieldSchema.values?.map?.(v => ({
        label: typeof v === 'string' ? v.charAt(0).toUpperCase() + v.slice(1) : v,
        value: v
      }));

      return (
        <Select
          placeholder="Select value"
          options={options}
          value={condition.value}
          onChange={(s) => updateCond('value', s?.value)}
        />
      );
    }

    return (
      <Input
        placeholder={['in', 'notIn'].includes(condition.operator) ? 'Comma separated values' : 'Enter value'}
        value={condition.value}
        onChange={(e) => updateCond('value', e.target.value)}
      />
    );
  };

  const sharedProps = {
    fieldOptions, getOperatorOptions, getFieldSchema, memberList, assessmentList,
    buList, assetList, relevanceGroupList, context, setMemberSearch, setAssessmentSearch,
    setBuSearch, setAssetSearch, setRelevanceGroupSearch, membersLoading, assessmentsLoading,
    buLoading, assetsLoading, relevanceGroupsLoading
  };

  return (
    <div className={cn("relative space-y-4", depth > 0 && "ml-4 pl-4 border-l border-border/60")}>
      <div className="flex items-center justify-between py-2 group/header">
        <div className="flex items-center gap-4">
          <LogicToggle value={group.logicalOp} onChange={handleLogicOp} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={addRule} className="h-7 text-xs hover:bg-primary/10 hover:text-primary">
            <Plus className="size-3 mr-1.5" />
            Add Condition
          </Button>
          {depth < 3 && (
            <Button variant="ghost" size="sm" onClick={addGroup} className="h-7 text-xs hover:bg-primary/10 hover:text-primary">
              <Plus className="size-3 mr-1.5" />
              Add Group
            </Button>
          )}
          {!isOnly && (
            <Button variant="ghost" size="sm" onClick={onRemove} className="h-7 text-xs text-destructive hover:bg-destructive/10">
              Remove
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {group?.children?.map?.((child) => (
          <div key={child.id} className="relative">
            {child.type === 'condition' ? (
              <div className="flex items-start gap-2 border p-3 bg-card rounded-lg">
                <div className="grid grid-cols-3 gap-3 items-start flex-1">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">Field <span className="text-destructive">*</span></p>
                    <Select
                      placeholder="Select field"
                      options={fieldOptions}
                      value={child.field}
                      onChange={(s) => updateChild(child.id, { ...child, field: s?.value, operator: 'equals', value: '' })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">Operator <span className="text-destructive">*</span></p>
                    <Select
                      placeholder="Select operator"
                      options={getOperatorOptions(child.field)}
                      value={child.operator}
                      onChange={(s) => {
                        const newOp = s?.value;
                        const needsVal = operatorNeedsValue(newOp);
                        updateChild(child.id, { ...child, operator: newOp, value: needsVal ? child.value : '' });
                      }}
                      disabled={!child.field}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">Value {operatorNeedsValue(child.operator) && <span className="text-destructive">*</span>}</p>
                    {renderValueInput(child, child.id)}
                  </div>
                </div>
                <div className="mt-5">
                  <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5" onClick={() => removeChild(child.id)} disabled={isOnlyRule && group?.children?.length === 1}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <ConditionGroup
                group={child}
                onUpdate={(updated) => updateChild(child.id, updated)}
                onRemove={() => removeChild(child.id)}
                depth={depth + 1}
                isOnly={false}
                {...sharedProps}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

function AutomationConditionTab({ conditions, setConditions, schemaData, context }) {
  const [memberSearch, setMemberSearch] = useState('');
  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [buSearch, setBuSearch] = useState('');
  const [assetSearch, setAssetSearch] = useState('');
  const [relevanceGroupSearch, setRelevanceGroupSearch] = useState('');

  const debouncedMemberSearch = useDebounce(memberSearch, 400);
  const debouncedAssessmentSearch = useDebounce(assessmentSearch, 400);
  const debouncedBuSearch = useDebounce(buSearch, 400);
  const debouncedAssetSearch = useDebounce(assetSearch, 400);
  const debouncedRelevanceGroupSearch = useDebounce(relevanceGroupSearch, 400);

  const safeConditions = useMemo(() => {
    if (!conditions) {
      return { id: generateId(), type: 'group', logicalOp: 'AND', children: [{ id: generateId(), type: 'condition', field: '', operator: '', value: '' }] };
    }
    if (Array.isArray(conditions)) {
      return {
        id: generateId(),
        type: 'group',
        logicalOp: 'AND',
        children: conditions.map((c) => ({
          id: c.id || generateId(),
          type: c.type || 'condition',
          field: c.field || '',
          operator: c.operator || 'equals',
          value: c.value ?? '',
        })),
      };
    }
    return conditions;
  }, [conditions]);

  const fields = schemaData?.fields || [];
  const operatorsSchema = schemaData?.operators || [];

  const fieldOptions = fields?.map?.(f => ({ label: f.label, value: f.field }));
  const getFieldSchema = useCallback((fieldValue) => fields.find(f => f.field === fieldValue), [fields]);

  const hasFieldInTree = useCallback((node, predicate) => {
    if (!node) return false;
    if (node.type === 'condition') return predicate(node);
    if (node.type === 'group') return (node.children || []).some(c => hasFieldInTree(c, predicate));
    return false;
  }, []);

  const hasUserField = hasFieldInTree(safeConditions, c => getFieldSchema(c.field)?.valueType === 'User');
  const hasAssessmentField = hasFieldInTree(safeConditions, c => getFieldSchema(c.field)?.valueType === 'Assessment');
  const hasBuField = hasFieldInTree(safeConditions, c => getFieldSchema(c.field)?.valueType === 'BusinessUnit');
  const hasAssetField = hasFieldInTree(safeConditions, c => getFieldSchema(c.field)?.valueType === 'Asset');
  const hasRelevanceGroupField = hasFieldInTree(safeConditions, c => getFieldSchema(c.field)?.valueType === 'RelevanceGroup' || c.field === 'riskRelevanceGroups');

  const { data: membersData, isLoading: membersLoading } = useGetMembersQuery({ search: debouncedMemberSearch }, { skip: !hasUserField });
  const memberList = (membersData?.data?.members || []).filter((u) => u.hasSignedUp === true);

  const { data: assessmentsData, isLoading: assessmentsLoading } = useGetVmAssessmentsQuery({ search: debouncedAssessmentSearch, limit: 30 }, { skip: !hasAssessmentField });
  const assessmentList = assessmentsData?.assessments || assessmentsData?.data?.assessments || [];

  const { data: buData, isLoading: buLoading } = useGetAimBusinessUnitsQuery({ search: debouncedBuSearch, limit: 30 }, { skip: !hasBuField });
  const buList = buData?.businessUnits || [];

  const { data: assetsData, isLoading: assetsLoading } = useGetAimGlobalAssetsQuery({ search: debouncedAssetSearch, limit: 30 }, { skip: !hasAssetField });
  const assetList = assetsData?.data?.assets || assetsData?.assets || [];

  const { data: relevanceGroupsData, isLoading: relevanceGroupsLoading } = useGetVmRelevanceGroupsQuery({ search: debouncedRelevanceGroupSearch, limit: 30 }, { skip: !hasRelevanceGroupField });
  const relevanceGroupList = relevanceGroupsData?.data || relevanceGroupsData || [];

  const getOperatorOptions = useCallback((fieldValue) => {
    const fieldSchema = getFieldSchema(fieldValue);
    if (!fieldSchema) return [];
    const opSchema = operatorsSchema.find(o => o.valueType === fieldSchema.valueType);
    if (!opSchema) return [];
    return opSchema.supported?.map?.(op => ({
      label: op.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: op
    }));
  }, [getFieldSchema, operatorsSchema]);

  return (
    <div className="max-h-[60vh] overflow-y-auto pr-2 pb-4 hide-scrollbar">
      <ConditionGroup
        group={safeConditions}
        onUpdate={setConditions}
        onRemove={() => { }}
        depth={0}
        isOnly={true}
        fieldOptions={fieldOptions}
        getOperatorOptions={getOperatorOptions}
        getFieldSchema={getFieldSchema}
        memberList={memberList}
        assessmentList={assessmentList}
        buList={buList}
        assetList={assetList}
        relevanceGroupList={relevanceGroupList}
        context={context}
        setMemberSearch={setMemberSearch}
        setAssessmentSearch={setAssessmentSearch}
        setBuSearch={setBuSearch}
        setAssetSearch={setAssetSearch}
        setRelevanceGroupSearch={setRelevanceGroupSearch}
        membersLoading={membersLoading}
        assessmentsLoading={assessmentsLoading}
        buLoading={buLoading}
        assetsLoading={assetsLoading}
        relevanceGroupsLoading={relevanceGroupsLoading}
      />
    </div>
  );
}

export default AutomationConditionTab;
