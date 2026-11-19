import { Edit, Loader2, SquarePen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUpdateAutomationRuleMutation, useGetAutomationSchemaQuery } from '@/services/vm/automationApi';
import AutomationConditionTab from './tabs/automation-condition-tab';
import AutomationActionTab from './tabs/automation-action-tab';
import AutomationPolicyTab from './tabs/automation-policy-tab';

const generateId = () => Math.random().toString(36).substring(2, 9);
const DEFAULT_CONDITION = {
  id: generateId(),
  type: 'group',
  logicalOp: 'AND',
  children: [
    { id: generateId(), type: 'condition', field: 'severity', operator: 'equals', value: '' }
  ]
};

function EditAutomationRuleModal({ rule = null, trigger, origin }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [conditions, setConditions] = useState({ ...DEFAULT_CONDITION });
  const [triggerEvents, setTriggerEvents] = useState(['vuln.created', 'vuln.updated']);
  const [actions, setActions] = useState([]);
  const [isEventBased, setIsEventBased] = useState(true);
  const [isScheduled, setIsScheduled] = useState(false);
  const [frequency, setFrequency] = useState('daily');

  const [updateRule, { isLoading }] = useUpdateAutomationRuleMutation();
  const { data: schemaData } = useGetAutomationSchemaQuery();
  let supportedActions = schemaData?.data?.actions || schemaData?.actions || schemaData?.data || schemaData || [];

  if (origin === 'falsepositive_analysis') {
    supportedActions = supportedActions?.filter(a => {
      const type = typeof a === 'string' ? a : a.value;
      return ['runFalsePositiveAnalysis', 'falsePositiveAnalysis', 'runFalsePositive', 'falsePositive'].includes(type);
    });
  }

  useEffect(() => {
    if (open && rule) {
      setName(rule.name || '');
      setDescription(rule.description || '');
      
      const hydrateNode = (node) => {
        if (node.type === 'condition') {
          const c = { ...node, id: generateId() };
          if (['in', 'notIn'].includes(c.operator) && Array.isArray(c.value)) {
            c.value = c.value.join(', ');
          }
          return c;
        }
        if (node.type === 'group') {
          return {
            ...node,
            id: generateId(),
            children: (node.children || []).map(hydrateNode)
          };
        }
        return { ...DEFAULT_CONDITION }; // fallback
      };
      
      let hydratedConditions;
      if (rule.conditions && rule.conditions.type === 'group') {
        hydratedConditions = hydrateNode(rule.conditions);
      } else if (Array.isArray(rule.conditions) && rule.conditions.length > 0) {
        // Fallback for old flat arrays if any still exist
        hydratedConditions = {
          id: generateId(),
          type: 'group',
          logicalOp: 'AND',
          children: rule.conditions.map(c => ({
            ...c,
            id: generateId(),
            type: 'condition',
            value: (['in', 'notIn'].includes(c.operator) && Array.isArray(c.value)) ? c.value.join(', ') : c.value
          }))
        };
      } else {
        hydratedConditions = { ...DEFAULT_CONDITION };
      }
      
      setConditions(hydratedConditions);

      const policyType = rule.execution_policy?.type || (rule.trigger?.events?.length ? 'event' : 'schedule');
      const isEvent = policyType === 'event';
      
      setIsEventBased(isEvent);
      setIsScheduled(!isEvent);
      
      setTriggerEvents(rule.execution_policy?.events || rule.trigger?.events || ['vuln.created', 'vuln.updated']);
      setFrequency(rule.execution_policy?.frequency || rule.trigger?.frequency || rule.trigger?.schedule?.frequency || 'daily');

      // Hydrate from new `actions[]` or fall back to legacy single `action`.
      if (Array.isArray(rule.actions) && rule.actions.length) {
        setActions(rule.actions.map((a) => ({ type: a.type, config: a.config || {} })));
      } else if (rule.action?.type) {
        setActions([{ type: rule.action.type, config: rule.action.config || {} }]);
      } else {
        setActions([]);
      }
    }
  }, [open, rule]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setConditions({ ...DEFAULT_CONDITION });
    setTriggerEvents(['vuln.created', 'vuln.updated']);
    setActions([]);
    setIsEventBased(true);
    setIsScheduled(false);
    setFrequency('daily');
  };

  const isRuleValid = (node) => {
    if (node.type === 'condition') {
      const needsValue = !['exists', 'notExists'].includes(node.operator);
      return node.field && node.operator && (!needsValue || node.value?.toString().trim() !== '');
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
          logicalOp: node.logicalOp,
          children: (node.children || []).map(formatNode)
        };
      }
    };

    const formattedConditions = formatNode(conditions);

    return {
      id: rule._id,
      name,
      description,
      execution_policy: policy,
      conditions: formattedConditions,
      actions,
    };
  };

  const handleSave = async () => {
    try {
      await updateRule(buildPayload()).unwrap();
      toast.success('Automation rule updated successfully');
      setOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error updating automation rule:', err);
      if (err?.data?.data?.length > 0) {
        toast.error(err.data.data.map((e) => e.msg).join('\n'));
      } else if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error('Failed to update rule. Please try again.');
      }
    }
  };

  return (
    <Modal
      open={open}
      setOpen={(val) => {
        setOpen(val);
        if (!val) resetForm();
      }}
      title="Edit Automation Rule"
      description="Update this automation rule's conditions and action."
      className="w-[45%] max-h-[90vh] overflow-y-auto hide-scrollbar"
      trigger={
        trigger || (
          <Button variant="ghost" mode="icon">
            <SquarePen />
          </Button>
        )
      }
    >
      {/* Name */}
      <div className="flex flex-col gap-0.5">
        <p className="text-sm text-muted-foreground">Rule Name</p>
        <Input
          placeholder="e.g. Auto-push criticals"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-0.5 mt-4">
        <p className="text-sm text-muted-foreground">Description</p>
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
            schemaData={schemaData?.data}
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
          onClick={handleSave}
          disabled={
            isLoading ||
            !areConditionsValid() ||
            !isActionValid() ||
            name.trim().length === 0 ||
            (!isEventBased && !isScheduled) ||
            (isEventBased && triggerEvents.length === 0)
          }
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Edit />}
          {isLoading ? 'Saving...' : 'Update Rule'}
        </Button>
      </div>
    </Modal>
  );
}

export default EditAutomationRuleModal;
