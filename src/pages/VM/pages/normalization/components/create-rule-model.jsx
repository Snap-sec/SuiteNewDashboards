import { Loader2, Plus, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ActionTab from './tabs/action-tab';
import ConditionTab from './tabs/condition-tab';
import { usePostNormalizationMutation, useUpdateNormalizationMutation } from '../../../../../services/vm/normalizationApi';
import { useGetNormalizationFieldsQuery } from '../../../../../services/vm/normalizationApi';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { normalizeConditionsForPayload, operatorNeedsValue } from '../normalization-utils';
import { z } from 'zod';

const ruleSchema = z.object({
  name: z.string().min(1, "Name is required").max(35, "Name must be at most 35 characters"),
  description: z.string().min(1, "Description is required"),
});

function CreateRuleModel({ trigger, rule = null, open: externalOpen, setOpen: externalSetOpen }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOpen !== undefined ? externalSetOpen : setInternalOpen;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [conditions, setConditions] = useState([
    { field: "", operator: "", value: "" }
  ]);
  const [actionType, setActionType] = useState("discrete");
  const [severity, setSeverity] = useState(null);
  const [cvssOperation, setCvssOperation] = useState(null);
  const [cvssValue, setCvssValue] = useState("");
  const [enabled, setEnabled] = useState(true);

  const [postNormalization, { isLoading: isPosting }] = usePostNormalizationMutation();
  const [updateNormalization, { isLoading: isUpdating }] = useUpdateNormalizationMutation();
  const { data, error, isFieldsLoading, isFetching } = useGetNormalizationFieldsQuery();

  const isLoading = isPosting || isUpdating;

  useEffect(() => {
    if (open) {
      if (rule) {
        setName(rule.name || "");
        setDescription(rule.description || "");
        
        let initialConditions = [{ field: "", operator: "", value: "" }];
        if (rule.conditions && rule.conditions.length > 0) {
           initialConditions = rule.conditions.map(c => ({
              field: c.field,
              operator: c.operator,
              value: Array.isArray(c.value) ? c.value.join(",") : (c.value !== undefined && c.value !== null ? String(c.value) : "")
           }));
        }
        setConditions(initialConditions);

        if (rule.action?.type === 'transformCvss') {
          setActionType('cvss');
          setCvssOperation(rule.action.operation || null);
          setCvssValue(rule.action.operand !== undefined ? String(rule.action.operand) : "");
          setSeverity(null);
        } else {
          setActionType('discrete');
          setSeverity(rule.action?.severity || null);
          setCvssOperation(null);
          setCvssValue("");
        }
        setEnabled(rule.enabled !== undefined ? rule.enabled : true);
      } else {
        setName("");
        setDescription("");
        setConditions([{ field: "", operator: "", value: "" }]);
        setActionType("discrete");
        setSeverity(null);
        setCvssOperation(null);
        setCvssValue("");
        setEnabled(true);
      }
    }
  }, [open, rule]);

  const areConditionsValid = () =>
    conditions.length > 0 &&
    conditions.every(
      (cond) => cond.field && cond.operator && (!operatorNeedsValue(cond.operator) || cond.value?.toString().trim() !== "")
    );

  const isActionValid = () =>
    actionType === "discrete"
      ? Boolean(severity)
      : Boolean(
          cvssOperation &&
          cvssValue?.toString().trim() !== "" &&
          !Number.isNaN(parseFloat(cvssValue))
        );

  const buildPayload = () => {
    const action = 
      actionType === "discrete" 
        ? { type: "setSeverity", severity } 
        : { type: "transformCvss", operation: cvssOperation, operand: parseFloat(cvssValue) || 0 };

    return {
      name,
      description,
      conditions: normalizeConditionsForPayload(conditions, data?.data?.fields || []),
      action,
      enabled
    };
  };

  const handleSaveRule = async () => {
    try {
      try {
        ruleSchema.parse({ name, description });
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          toast.error(validationError.errors[0].message);
          return;
        }
      }

      if (actionType === "cvss") {
        const numVal = parseFloat(cvssValue);
        if (isNaN(numVal) || numVal < 0 || numVal > 10) {
          toast.error("CVSS value must be between 0 and 10.");
          return;
        }
      }

      const payload = buildPayload();
      if (rule && rule._id) {
        await updateNormalization({ ruleId: rule._id, ...payload }).unwrap();
        toast.success("Rule updated successfully");
      } else {
        await postNormalization(payload).unwrap();
        toast.success("Rule created successfully");
      }
      setOpen(false);
      if (!rule) {
        setName("");
        setDescription("");
        setConditions([{ field: "", operator: "", value: "" }]);
        setActionType("discrete");
        setSeverity(null);
        setCvssOperation(null);
        setCvssValue("");
        setEnabled(true);
      }
    } catch (error) {
      console.error("Error saving rule:", error);
      
      if (error?.data?.status === 0 && error?.data?.data?.length > 0) {
        const errorMessages = error.data.data.map(err => err.msg).join("\n");
        toast.error(errorMessages);
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error(`Failed to ${rule ? 'update' : 'create'} rule. Please try again.`);
      }
    }
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={rule ? "Edit Normalization Rule" : "Create Normalization Rule"}
      description={rule ? "Update the existing normalization rule." : "Create a new normalization rule to categorize vulnerabilities."}
      className="w-[40%]"
      trigger={trigger || <Button variant="outline"><Plus /> Create Rule</Button>}
    >
      
      <div className="flex flex-col gap-0.5">
        <div className="flex justify-between items-center text-sm">
          <p className="text-muted-foreground">Rule Name <span className=' text-destructive'>*</span></p>
          <p className="text-muted-foreground text-xs">{name.length}/35</p>
        </div>
        <Input 
          placeholder="Rule Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {name.length > 35 && (
          <p className="text-xs text-destructive mt-0.5">Name must be at most 35 characters</p>
        )}
      </div>

      <div className="flex flex-col gap-0.5 mt-4">
        <p className="text-sm text-muted-foreground">Description <span className=' text-destructive'>*</span></p>
        <Textarea 
          placeholder="Rule Description" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Tabs defaultValue="Conditions" className="text-sm mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Conditions">Conditions</TabsTrigger>
          <TabsTrigger value="Actions">Actions</TabsTrigger>
        </TabsList>


        <TabsContent value="Conditions" className="mt-4 flex flex-col gap-2">
          <ConditionTab 
            conditions={conditions}
            setConditions={setConditions}
            fieldsData={data?.data?.fields || []}
            operatorsData={data?.data?.operators || []}
            isLoading={isFieldsLoading || isFetching}
          />
        </TabsContent>


        <TabsContent value="Actions">
          <ActionTab 
            actionType={actionType}
            setActionType={setActionType}
            severity={severity}
            setSeverity={setSeverity}
            cvssOperation={cvssOperation}
            setCvssOperation={setCvssOperation}
            cvssValue={cvssValue}
            setCvssValue={setCvssValue}
            severityLevels={data?.data?.severityLevels || []}
            arithmeticOperations={data?.data?.arithmeticOperations || []}
            isLoading={isFieldsLoading || isFetching}
          />
        </TabsContent>
      </Tabs>


      <div className='flex justify-end mt-6'>
        <Button variant="ghost" className='mr-2' onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          variant="outline"
          onClick={handleSaveRule}
          disabled={isLoading || !areConditionsValid() || !isActionValid() || name.length > 35 || name.trim().length === 0}
        >
          {isLoading ?<Loader2 className=' animate-spin' /> : <Save />}
          {isLoading ? "Saving..." : "Save Rule"}
        </Button>
      </div>
    </Modal>
  );
}

export default CreateRuleModel;
export { CreateRuleModel as CrateteRuleModel };
