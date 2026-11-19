import { Loader2, Plus, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePostAutomationRuleMutation, useGetAutomationSchemaQuery } from '@/services/vm/automationApi';
import AutomationConditionTab from '@/pages/VM/pages/automation-engine/components/tabs/automation-condition-tab';
import AutomationActionTab from '@/pages/VM/pages/automation-engine/components/tabs/automation-action-tab';
import AutomationPolicyTab from '@/pages/VM/pages/automation-engine/components/tabs/automation-policy-tab';

const ruleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80, 'Name must be at most 80 characters'),
  description: z.string().min(1, 'Description is required'),
});

export const generateId = () => Math.random().toString(36).substring(2, 9);
const DEFAULT_TRIGGER_EVENTS = ['vuln.created', 'vuln.updated'];

const getFirstOperatorForField = (fieldValue, fields = [], operatorsSchema = []) => {
  const fieldSchema = fields.find((f) => f.field === fieldValue);
  if (!fieldSchema) return 'equals';
  const opSchema = operatorsSchema.find((o) => o.valueType === fieldSchema.valueType);
  return opSchema?.supported?.[0] || 'equals';
};

const createDefaultConditionGroup = (fields = [], operatorsSchema = []) => {
  const firstField = fields[0]?.field || '';
  const firstOperator = getFirstOperatorForField(firstField, fields, operatorsSchema);

  return {
    id: generateId(),
    type: 'group',
    logicalOp: 'AND',
    children: [
      { id: generateId(), type: 'condition', field: firstField, operator: firstOperator, value: '' },
    ],
  };
};

function CreateAutomationRuleModal({ 
  trigger, 
  origin = "", 
  defaultConditions = [], 
  context = {} 
}) {
  const { data: schemaData } = useGetAutomationSchemaQuery();
  const schema = schemaData?.data || schemaData;
  const fields = schema?.fields || [];
  const operatorsSchema = schema?.operators || [];

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [conditions, setConditions] = useState(() => createDefaultConditionGroup(fields, operatorsSchema));
  const [triggerEvents, setTriggerEvents] = useState([...DEFAULT_TRIGGER_EVENTS]);
  const [actions, setActions] = useState([]);
  const [isEventBased, setIsEventBased] = useState(true);
  const [isScheduled, setIsScheduled] = useState(false);
  const [frequency, setFrequency] = useState('daily');

  const [postRule, { isLoading }] = usePostAutomationRuleMutation();

  const supportedActions = schemaData?.data?.actions || schemaData?.actions || schemaData?.data || schemaData || [];

  const isRuleValid = (node) => {
    if (!node) return false;
    if (node.type === 'condition') {
      const needsValue = !['exists', 'notExists'].includes(node.operator);
      return Boolean(node.field && node.operator && (!needsValue || node.value?.toString().trim() !== ''));
    }
    if (node.type === 'group') {
      if (!node.children || node.children.length === 0) return false;
      return node.children.every(isRuleValid);
    }
    return false;
  };

  const areConditionsValid = () => isRuleValid(conditions);

  const isActionValid = () => Array.isArray(actions) && actions.length > 0;

  const buildPayload = () => {
    const policy = {
      type: isEventBased ? 'event' : 'schedule',
    };
    if (isEventBased) {
      policy.events = triggerEvents;
    } else {
      policy.frequency = frequency;
    }
    
    const formatNode = (node) => {
      if (!node) return null;
      if (node.type === 'condition') {
        const cond = { ...node };
        delete cond.id;
        if (['in', 'notIn'].includes(cond.operator)) {
          let valArray = [];
          if (typeof cond.value === 'string') {
            valArray = cond.value.split(',').map((v) => v.trim()).filter(Boolean);
          } else if (Array.isArray(cond.value)) {
            valArray = cond.value;
          } else if (cond.value) {
            valArray = [cond.value];
          }
          cond.value = valArray;
        }
        return cond;
      }
      if (node.type === 'group') {
        return {
          type: 'group',
          logicalOp: node.logicalOp || 'AND',
          children: (node.children || []).map(formatNode).filter(Boolean),
        };
      }
      return null;
    };

    const formattedConditions = formatNode(conditions);

    const relevanceGroupId = context?.relevanceGroupId;
    const parentResource = context?.parentResource || (relevanceGroupId ? 'risk_relevance' : undefined);
    const parentResourceId = context?.parentResourceId || relevanceGroupId || context?.assessmentId;

    const payload = {
      name,
      description,
      enabled: true,
      execution_policy: policy,
      conditions: formattedConditions,
      actions,
    };

    if (parentResource && parentResourceId) {
      payload.parent_resource = parentResource;
      payload.parent_resource_id = parentResourceId;
    }

    if (relevanceGroupId) {
      payload.origin = origin || 'relevance-group';
      payload.relevance_group_id = relevanceGroupId;
    } else if (origin) {
      payload.origin = origin;
    }

    return payload;
  };

  useEffect(() => {
    if (fields.length > 0) {
      setConditions((prev) => {
        const firstChild = prev?.children?.[0];
        if (
          !prev ||
          !prev.children ||
          prev.children.length === 0 ||
          (prev.children.length === 1 && !firstChild?.field)
        ) {
          return createDefaultConditionGroup(fields, operatorsSchema);
        }
        return prev;
      });
    }
  }, [fields, operatorsSchema]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setConditions(createDefaultConditionGroup(fields, operatorsSchema));
    setTriggerEvents([...DEFAULT_TRIGGER_EVENTS]);
    setActions([]);
    setIsEventBased(true);
    setIsScheduled(false);
    setFrequency('daily');
  };

  const handleSaveRule = async () => {
    try {
      ruleSchema.parse({ name, description });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        return;
      }
    }

    const payload = buildPayload();
    const relevanceGroupId = context?.relevanceGroupId;
    const parentResource = payload.parent_resource;
    const parentResourceId = payload.parent_resource_id;

    try {
      if (relevanceGroupId) {
        await postRule({ payload, params: { relevance_group_id: relevanceGroupId } }).unwrap();
      } else if (parentResource && parentResourceId) {
        await postRule({ payload, params: { parent_resource: parentResource, parent_resource_id: parentResourceId } }).unwrap();
      } else {
        await postRule(payload).unwrap();
      }
      toast.success('Automation rule created successfully');
      setOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error creating automation rule:', err);
      if (err?.data?.data?.length > 0) {
        toast.error(err.data.data.map((e) => e.msg).join('\n'));
      } else if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error('Failed to create rule. Please try again.');
      }
    }
  };

  return (
    <Modal
      open={open}
      setOpen={(val) => {
        setOpen(val);
        if (!val) {
          resetForm();
        } else if (fields.length > 0) {
          setConditions((prev) => {
            const firstChild = prev?.children?.[0];
            if (!firstChild?.field) {
              return createDefaultConditionGroup(fields, operatorsSchema);
            }
            return prev;
          });
        }
      }}
      title="Create Automation Rule"
      description="Define conditions and an action to automate vulnerability workflows."
      className="w-[45%] max-h-[90vh] overflow-y-auto hide-scrollbar"
      trigger={trigger || <Button variant="outline"><Plus /> Create Rule</Button>}
    >
      {/* Name */}
      <div className="flex flex-col gap-0.5">
        <div className="flex justify-between items-center text-sm">
          <p className="text-muted-foreground">Rule Name <span className="text-destructive">*</span></p>
          <p className="text-muted-foreground text-xs">{name.length}/80</p>
        </div>
        <Input
          placeholder="e.g. Auto-push criticals"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-0.5 mt-4">
        <p className="text-sm text-muted-foreground">Description <span className="text-destructive">*</span></p>
        <Textarea
          placeholder="Describe what this rule does"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="conditions" className="text-sm mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="action">Action</TabsTrigger>
          <TabsTrigger value="policy">Execution Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="conditions" className="mt-4 flex flex-col gap-2">
          <AutomationConditionTab
            conditions={conditions}
            setConditions={setConditions}
            schemaData={schemaData?.data || schemaData}
            context={context}
          />
        </TabsContent>

        <TabsContent value="action" className="mt-4">
          <AutomationActionTab
            actions={actions}
            setActions={setActions}
            supportedActions={supportedActions}
            schemaData={schemaData?.data}
          />
        </TabsContent>

        <TabsContent value="policy" className="mt-4">
          <AutomationPolicyTab
            isEventBased={isEventBased}
            setIsEventBased={setIsEventBased}
            isScheduled={isScheduled}
            setIsScheduled={setIsScheduled}
            triggerEvents={triggerEvents}
            setTriggerEvents={setTriggerEvents}
            frequency={frequency}
            setFrequency={setFrequency}
          />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex justify-end mt-6 gap-2">
        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          variant="outline"
          onClick={handleSaveRule}
          disabled={
            isLoading ||
            !areConditionsValid() ||
            !isActionValid() ||
            name.trim().length === 0 ||
            name.length > 80 ||
            (!isEventBased && !isScheduled) ||
            (isEventBased && triggerEvents.length === 0)
          }
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
          {isLoading ? 'Saving...' : 'Save Rule'}
        </Button>
      </div>
    </Modal>
  );
}

export default CreateAutomationRuleModal;
