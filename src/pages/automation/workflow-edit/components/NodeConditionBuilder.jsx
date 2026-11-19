import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Custom Components and Hooks for advanced field inputs
import SelectCustom from '@/components/custom/select';
import DatePicker from '@/components/custom/date-picker';
import SelectWithAvatar from '@/components/custom/select-with-avatar';
import { useGetMembersQuery } from '@/services/vm/members';
import { useGetOrgMemberQuery } from '@/services/auth/orgApi';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import { useGetAimBusinessUnitsQuery } from '@/services/asset-inventory/businessUnitsApi';
import { useGetAimGlobalAssetsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { useGetVmRelevanceGroupsQuery } from '@/services/vm/relevanceGroupsApi';
import useDebounce from '@/hooks/use-debounce';

const OPERATOR_LABELS = {
  equals: 'Equals',
  notEquals: 'Not Equals',
  contains: 'Contains',
  notContains: 'Not Contains',
  greaterThan: 'Greater Than',
  lessThan: 'Less Than',
  greaterThanOrEqual: 'Greater Than Or Equal',
  lessThanOrEqual: 'Less Than Or Equal',
  in: 'In',
  notIn: 'Not In',
  regex: 'Regex Match',
  exists: 'Exists',
  notExists: 'Does Not Exist',
  '==': 'Equals',
  '!=': 'Not Equals',
};

const DEFAULT_OPERATORS = [
  'equals',
  'notEquals',
  'contains',
  'notContains',
  'greaterThan',
  'lessThan',
];

function getFields(schema) {
  if (!schema) return [];
  if (Array.isArray(schema)) return schema;
  if (schema.fields) return schema.fields;
  if (schema.keys) return schema.keys;
  if (schema.data) return getFields(schema.data);
  return [];
}

function getOperators(schema) {
  if (!schema) return [];
  if (schema.operators) return schema.operators;
  if (schema.data) return getOperators(schema.data);
  return [];
}

const operatorNeedsValue = (op) => !['exists', 'notExists'].includes(op);

function UserSelectInput({
  condition,
  handleChange,
  memberList,
  setMemberSearch,
  membersLoading
}) {
  const isMultiple = ['in', 'notIn'].includes(condition.operator);
  
  // If it's a multiple select, condition.value might be a string (comma separated) or array
  const values = isMultiple 
    ? (Array.isArray(condition.value) ? condition.value : condition.value ? String(condition.value).split(',').map(v=>v.trim()) : []) 
    : [condition.value].filter(Boolean);

  const isSelected = values.length > 0;
  
  // For single select, check if member is in list
  const isMemberInList = !isMultiple && isSelected && memberList.some(
    (m) => m._id === values[0] || m.userId === values[0] || m.email === values[0]
  );

  // We only fetch specifically for single select currently. For multiple, we rely on the search.
  const { data: specificMemberData } = useGetOrgMemberQuery(values[0], {
    skip: isMultiple || !isSelected || isMemberInList,
  });

  const specificMemberRaw = specificMemberData?.data || specificMemberData?.user || specificMemberData;
  const specificMember = useMemo(() => {
    if (!specificMemberRaw) return null;
    return {
      ...specificMemberRaw,
      name: (specificMemberRaw.firstName || specificMemberRaw.lastName) 
        ? `${specificMemberRaw.firstName || ''} ${specificMemberRaw.lastName || ''}`.trim() 
        : specificMemberRaw.name || specificMemberRaw.email
    };
  }, [specificMemberRaw]);

  const combinedMembers = useMemo(() => {
    let list = [...memberList];
    if (specificMember && !isMemberInList && !isMultiple) {
      list.push(specificMember);
    }
    
    // The backend sometimes populates `.name` with the role name.
    // We enforce the actual user name here.
    return list.map(m => ({
      ...m,
      name: (m.firstName || m.lastName) ? `${m.firstName || ''} ${m.lastName || ''}`.trim() : m.name
    }));
  }, [memberList, specificMember, isMemberInList, isMultiple]);

  const selectedValue = isMultiple
    ? values.map(val => {
        const found = combinedMembers.find(m => m.email === val || m._id === val || m.userId === val);
        return found ? found._id : val;
      })
    : (combinedMembers.find(m => m.email === values[0] || m._id === values[0] || m.userId === values[0])?._id || values[0] || '');

  return (
    <SelectWithAvatar
      onSearchChange={setMemberSearch}
      users={combinedMembers}
      value={selectedValue}
      multiple={isMultiple}
      onChange={(selectedIds) => {
        if (isMultiple) {
          // selectedIds is an array
          const mappedIds = selectedIds.map(id => {
            const member = combinedMembers.find((m) => m._id === id || m.userId === id);
            return member?.userId || member?._id || id;
          });
          handleChange('value', mappedIds);
        } else {
          // selectedIds is a single string
          const member = combinedMembers.find((m) => m._id === selectedIds || m.userId === selectedIds);
          handleChange('value', member?.userId || member?._id || selectedIds);
        }
      }}
      searchFields={['name', 'email']}
      isLoading={membersLoading}
      placeholder={isMultiple ? "Select members..." : "Select a member..."}
    />
  );
}

function RuleConditionRow({
  condition,
  onChange,
  onRemove,
  schema,
  memberList,
  assessmentList,
  buList,
  assetList,
  relevanceGroupList,
  setMemberSearch,
  setAssessmentSearch,
  setBuSearch,
  setAssetSearch,
  setRelevanceGroupSearch,
  membersLoading,
  assessmentsLoading,
  buLoading,
  relevanceGroupsLoading,
  isUpdateMode,
  availableVariables,
}) {
  const fields = getFields(schema);
  const operatorsData = getOperators(schema);
  
  const currentFieldDef = fields.find(
    (f) => f.value === condition.key || f.name === condition.key || f.field === condition.key
  );
  
  // Operators are grouped by valueType (e.g. { valueType: "String", operators: ["equals", ...] })
  const fieldOperatorsGroup = operatorsData.find(
    (opGrp) => opGrp.valueType === currentFieldDef?.valueType
  );
  const operators = fieldOperatorsGroup?.operators || DEFAULT_OPERATORS;

  const isUnaryOperator = condition.operator === 'exists' || condition.operator === 'notExists';

  const handleChange = (field, value) => {
    onChange({ ...condition, [field]: value });
  };

  const renderValueInput = () => {
    if (!operatorNeedsValue(condition.operator)) {
      return (
        <Input
          disabled
          value=""
          placeholder="N/A (unary operator)"
          className="h-8 text-xs bg-muted text-muted-foreground"
        />
      );
    }

    if (isUpdateMode) {
      return (
        <SelectCustom
          placeholder="Enter value or pick variable..."
          options={availableVariables || []}
          value={condition.value || ''}
          onChange={(s) => handleChange('value', s ? (typeof s === 'object' ? s.value : s) : '')}
          allowCustomValue={true}
        />
      );
    }

    if (currentFieldDef?.valueType === 'User') {
      return (
        <UserSelectInput
          condition={condition}
          handleChange={handleChange}
          memberList={memberList}
          setMemberSearch={setMemberSearch}
          membersLoading={membersLoading}
        />
      );
    }

    if (currentFieldDef?.valueType === 'Assessment') {
      const options = assessmentList?.map?.((a) => ({ label: a.name || a.title || a._id, value: a._id }));
      const selectedOpt = options.find((o) => o.value === condition.value);
      return (
        <SelectCustom
          placeholder="Select assessment..."
          options={options}
          value={selectedOpt?.value}
          onChange={(s) => handleChange('value', s?.value)}
          onSearchChange={setAssessmentSearch}
          isSearching={assessmentsLoading}
        />
      );
    }

    if (currentFieldDef?.valueType === 'BusinessUnit') {
      const options = buList?.map?.((b) => ({ label: b.name || b._id, value: b._id }));
      const selectedOpt = options.find((o) => o.value === condition.value);
      return (
        <SelectCustom
          placeholder="Select business unit..."
          options={options}
          value={selectedOpt?.value}
          onChange={(s) => handleChange('value', s?.value)}
          onSearchChange={setBuSearch}
          isSearching={buLoading}
        />
      );
    }

    if (currentFieldDef?.valueType === 'Asset') {
      const options = assetList?.map?.((a) => ({ label: a.name || a.value || a._id, value: a.value || a._id }));
      const selectedOpt = options.find((o) => o.value === condition.value);
      return (
        <SelectCustom
          placeholder="Select asset..."
          options={options}
          value={selectedOpt?.value}
          onChange={(s) => handleChange('value', s?.value)}
          onSearchChange={setAssetSearch}
          isSearching={assetsLoading}
        />
      );
    }

    if (currentFieldDef?.valueType === 'RelevanceGroup' || condition.key === 'riskRelevanceGroups') {
      const options = relevanceGroupList?.map?.((g) => ({ label: g.name || g.title || g._id, value: g._id }));
      const selectedOpt = options.find((o) => o.value === condition.value);
      return (
        <SelectCustom
          placeholder="Select relevance group..."
          options={options}
          value={selectedOpt?.value}
          onChange={(s) => handleChange('value', s?.value)}
          onSearchChange={setRelevanceGroupSearch}
          isSearching={relevanceGroupsLoading}
        />
      );
    }

    if (currentFieldDef?.valueType === 'Date') {
      const dateValue = condition.value ? new Date(condition.value) : undefined;
      return (
        <DatePicker
          value={dateValue}
          onChange={(date) => handleChange('value', date ? date.toISOString() : '')}
        />
      );
    }

    if (currentFieldDef?.type === 'boolean' || currentFieldDef?.valueType === 'Boolean') {
      return (
        <UiSelect
          value={condition.value !== undefined ? String(condition.value) : ''}
          onValueChange={(val) => handleChange('value', val === 'true')}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select boolean..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true" className="text-xs">true</SelectItem>
            <SelectItem value="false" className="text-xs">false</SelectItem>
          </SelectContent>
        </UiSelect>
      );
    }

    if (currentFieldDef?.options) {
      const options = currentFieldDef.options?.map?.(v => ({
        label: typeof v === 'string' ? v.charAt(0).toUpperCase() + v.slice(1) : v,
        value: v
      }));

      return (
        <SelectCustom
          placeholder="Select value..."
          options={options}
          value={condition.value}
          onChange={(s) => handleChange('value', s?.value)}
        />
      );
    }

    return (
      <SelectCustom
        placeholder={['in', 'notIn'].includes(condition.operator) ? 'Comma separated values' : 'Enter value or pick variable...'}
        options={availableVariables || []}
        value={condition.value || ''}
        onChange={(s) => handleChange('value', s ? (typeof s === 'object' ? s.value : s) : '')}
        allowCustomValue={true}
      />
    );
  };

  return (
    <div className="p-3 border border-border/60 rounded-lg bg-card/40 flex flex-col md:flex-row items-start md:items-end gap-3 group">
      {/* Field Selection */}
      <div className="w-full md:w-1/3 space-y-1.5">
        <Label className="text-[10px] font-medium text-muted-foreground flex items-center gap-0.5">
          Field <span className="text-destructive">*</span>
        </Label>
        <UiSelect
          value={condition.key}
          onValueChange={(val) => {
            onChange({ ...condition, key: val, value: '' });
          }}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select field..." />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {fields.map((f) => {
              const val = f.value || f.name || f.field;
              return (
                <SelectItem key={val} value={val} className="text-xs">
                  {f.label || val}
                </SelectItem>
              );
            })}
          </SelectContent>
        </UiSelect>
      </div>

      {/* Operator Selection */}
      {!isUpdateMode && (
        <div className="w-full md:w-1/4 space-y-1.5">
          <Label className="text-[10px] font-medium text-muted-foreground flex items-center gap-0.5">
            Operator <span className="text-destructive">*</span>
          </Label>
          <UiSelect
            value={condition.operator}
            onValueChange={(val) => handleChange('operator', val)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select operator..." />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {operators.map((op) => (
                <SelectItem key={op} value={op} className="text-xs">
                  {OPERATOR_LABELS[op] || op}
                </SelectItem>
              ))}
            </SelectContent>
          </UiSelect>
        </div>
      )}

      {/* Value Input */}
      <div className="w-full flex-1 space-y-1.5">
        <Label className="text-[10px] font-medium text-muted-foreground flex items-center gap-0.5">
          Value <span className="text-destructive">*</span>
        </Label>
        {renderValueInput()}
      </div>

      {/* Remove Button */}
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={onRemove}
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 self-end"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

function ConditionGroupBuilder({ 
  node, 
  onChange, 
  onRemove, 
  schema, 
  isRoot = false,
  sharedProps
}) {
  const handleOperatorChange = (op) => {
    onChange({ ...node, operator: op });
  };

  const handleAddCondition = () => {
    const fields = getFields(schema);
    const defaultKey = fields?.[0]?.value || fields?.[0]?.name || fields?.[0]?.field || '';
    const newNode = {
      type: 'condition',
      key: defaultKey,
      operator: 'equals',
      value: '',
    };
    onChange({
      ...node,
      children: [...(node.children || []), newNode],
    });
  };

  const handleAddGroup = () => {
    const fields = getFields(schema);
    const defaultKey = fields?.[0]?.value || fields?.[0]?.name || fields?.[0]?.field || '';
    const newGroup = {
      type: 'group',
      operator: 'AND',
      children: [
        {
          type: 'condition',
          key: defaultKey,
          operator: 'equals',
          value: '',
        },
      ],
    };
    onChange({
      ...node,
      children: [...(node.children || []), newGroup],
    });
  };

  const handleChildChange = (index, newChild) => {
    const newChildren = [...(node.children || [])];
    newChildren[index] = newChild;
    onChange({ ...node, children: newChildren });
  };

  const handleChildRemove = (index) => {
    const newChildren = [...(node.children || [])];
    newChildren.splice(index, 1);
    onChange({ ...node, children: newChildren });
  };

  const { isUpdateMode } = sharedProps || {};

  return (
    <div className={`space-y-3 ${!isRoot ? 'mt-3 pl-3 border-l-2 border-primary/30' : ''}`}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {!isUpdateMode ? (
          <div className="inline-flex items-center p-1 rounded-md bg-secondary/80 border border-border/50 gap-1">
            {['AND', 'OR', 'NOT'].map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => handleOperatorChange(op)}
                className={`px-2.5 py-0.5 text-[10px] font-semibold rounded transition-colors ${
                  (node.operator || 'AND').toUpperCase() === op
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        ) : (
          <div /> // Spacer
        )}

        <div className="flex items-center gap-2">
          {!isUpdateMode && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleAddCondition}
              className="h-7 text-[10px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 px-2"
            >
              <Plus className="w-3 h-3" /> Add Condition
            </Button>
          )}
          {!isUpdateMode && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleAddGroup}
              className="h-7 text-[10px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 px-2"
            >
              <Plus className="w-3 h-3" /> Add Group
            </Button>
          )}
          {!isRoot && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onRemove}
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {(!node.children || node.children.length === 0) && (
          <div className="text-center py-4 border border-dashed border-border/60 rounded-md text-muted-foreground text-xs">
            No conditions in this group. Click '+ Add Condition' to start.
          </div>
        )}

        {(node.children || []).map((child, idx) => {
          if (child.type === 'group') {
            return (
              <ConditionGroupBuilder
                key={idx}
                node={child}
                onChange={(newChild) => handleChildChange(idx, newChild)}
                onRemove={() => handleChildRemove(idx)}
                schema={schema}
                isRoot={false}
                sharedProps={sharedProps}
              />
            );
          }

          return (
            <RuleConditionRow
              key={idx}
              condition={child}
              onChange={(newChild) => handleChildChange(idx, newChild)}
              onRemove={() => handleChildRemove(idx)}
              schema={schema}
              {...sharedProps}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function NodeConditionBuilder({ value, onChange, schema, title = 'Matching Criteria', isUpdateMode = false, availableVariables = [] }) {
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

  // Initialize if empty
  const rootNode = useMemo(() => {
    const fieldsList = getFields(schema);
    const defaultKey = fieldsList?.[0]?.value || fieldsList?.[0]?.name || fieldsList?.[0]?.field || '';
    
    if (value?.type === 'group') {
      if (isUpdateMode && (!value.children || value.children.length === 0)) {
        return {
          ...value,
          children: [
            {
              type: 'condition',
              key: defaultKey,
              operator: 'equals',
              value: '',
            }
          ]
        };
      }
      return value;
    }

    return {
      type: 'group',
      operator: 'AND',
      children: isUpdateMode ? [
        {
          type: 'condition',
          key: defaultKey,
          operator: 'equals',
          value: '',
        }
      ] : [],
    };
  }, [value, isUpdateMode, schema]);

  const fields = getFields(schema);
  const getFieldSchema = useCallback((fieldValue) => fields.find(f => f.field === fieldValue || f.name === fieldValue || f.value === fieldValue), [fields]);

  const hasFieldInTree = useCallback((node, predicate) => {
    if (!node) return false;
    if (node.type === 'condition') return predicate(node);
    if (node.type === 'group') return (node.children || []).some(c => hasFieldInTree(c, predicate));
    return false;
  }, []);

  const hasUserField = hasFieldInTree(rootNode, c => getFieldSchema(c.key)?.valueType === 'User');
  const hasAssessmentField = hasFieldInTree(rootNode, c => getFieldSchema(c.key)?.valueType === 'Assessment');
  const hasBuField = hasFieldInTree(rootNode, c => getFieldSchema(c.key)?.valueType === 'BusinessUnit');
  const hasAssetField = hasFieldInTree(rootNode, c => getFieldSchema(c.key)?.valueType === 'Asset');
  const hasRelevanceGroupField = hasFieldInTree(rootNode, c => getFieldSchema(c.key)?.valueType === 'RelevanceGroup' || c.key === 'riskRelevanceGroups');

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

  const sharedProps = {
    memberList,
    assessmentList,
    buList,
    assetList,
    relevanceGroupList,
    setMemberSearch,
    setAssessmentSearch,
    setBuSearch,
    setAssetSearch,
    setRelevanceGroupSearch,
    membersLoading,
    assessmentsLoading,
    buLoading,
    assetsLoading,
    relevanceGroupsLoading,
    isUpdateMode,
    availableVariables,
  };

  if (!schema) return null;

  const handleChange = (newNode) => {
    onChange(newNode);
  };

  return (
    <div className="space-y-2 mt-4 pt-4 border-t border-border">
      <Label className="text-xs font-semibold text-foreground">{title}</Label>
      <ConditionGroupBuilder
        node={rootNode}
        onChange={handleChange}
        schema={schema}
        isRoot={true}
        sharedProps={sharedProps}
      />
    </div>
  );
}
