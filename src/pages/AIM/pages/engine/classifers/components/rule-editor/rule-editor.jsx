import { useEffect } from 'react';
import { useGetAimPolicyPropertiesQuery, useGetAimPolicyByIdQuery, useCreateAimPolicyMutation, useUpdateAimPolicyMutation, } from '@/services/asset-inventory/policyApi';
import { Header } from './components/header';
import { BasicDetailsForm } from './components/basic-details';
import { MatchConditions } from './components/match-conditions';
import { useSearchParams } from 'react-router-dom';
import { ContentLoader } from "@/components/common/content-loader";
import { ActionTypeSelector } from './components/action-type-selector';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import useStore from './store';

const BASE_RULE = {
  type: "classifier",
  name: "",
  description: "",
  match: [],
  actions: []
}

const GuidedRuleEditor = () => {

  const [params] = useSearchParams();
  const navigate = useNavigate();

  const policyId = params.get("policyId");

  const currentRuleYaml = useStore((state) => state.currentRuleYaml);
  const currentRuleJson = useStore((state) => state.currentRuleJson);
  const setCurrentRuleJson = useStore((state) => state.setCurrentRuleJson);

  // New schema: { fields: [...], operators: [...], actions: [{ value, label, config: { setKeys: [...] } }] }
  const { data: properties, isLoading: propertiesAreLoading } = useGetAimPolicyPropertiesQuery('classifier');
  const { data: policy, isLoading: policyIsLoading } = useGetAimPolicyByIdQuery(policyId, { skip: !policyId });

  const [createPolicy, { isLoading: policyIsBeingCreated }] = useCreateAimPolicyMutation();
  const [updatePolicy, { isLoading: policyIsBeingUpdated }] = useUpdateAimPolicyMutation();

  // Initialize yaml contents from existing policy or BASE_RULE
  useEffect(() => {
    if (policy) {
      const mappedJson = {
        type: "classifier",
        name: policy.name || '',
        description: policy.description || '',
        match: policy.match?.and?.conditions || [],
        actions: policy.actions || []
      };

      setCurrentRuleJson(mappedJson);
    } else {
      setCurrentRuleJson(BASE_RULE);
    }
  }, [policy]);

  // When creating a new classifier, pre-populate one default match condition
  // and one default set action using the first available keys/operators from the new schema
  useEffect(() => {
    if (policy || !properties) return;

    const hasConditions = (currentRuleJson?.match || []).length > 0;
    const hasActions = (currentRuleJson?.set || []).length > 0;

    if (hasConditions || hasActions) return;

    // fields array: [{ field, label, type, options }]
    const firstMatchProp = properties?.fields?.[0];
    const firstMatchField = firstMatchProp?.field || '';
    const firstOperator = properties?.operators?.[0] || '==';

    // classify config
    const classifySchema = properties?.actions?.find(a => a.value === 'classify')?.config || {};
    const setKeys = classifySchema.setKeys || [];
    const firstSetField = setKeys[0]?.field || '';

    // alert config
    const alertSchema = properties?.actions?.find(a => a.value === 'alert')?.config || {};
    const firstChannelType = (alertSchema.channels || [])[0] || '';
    const alertFirstSchema = (alertSchema.channelConfigs || {})[firstChannelType] || {};
    const defaultAlertConfig = Object.fromEntries(
      Object.keys(alertFirstSchema).map(k => [k, alertFirstSchema[k]?.type === 'array' ? [] : ''])
    );

    // trigger config
    const triggerSchema = properties?.actions?.find(a => a.value === 'trigger')?.config || {};
    const firstTriggerType = (triggerSchema.actions || [])[0] || '';
    const triggerFirstSchema = (triggerSchema.actionConfigs || {})[firstTriggerType] || {};
    const defaultTriggerConfig = Object.fromEntries(
      Object.keys(triggerFirstSchema).map(k => [k, triggerFirstSchema[k]?.type === 'array' ? [] : ''])
    );

    const defaultActions = [];
    if (firstSetField) {
      defaultActions.push({ type: 'classify', config: { set: [{ field: firstSetField, value: '' }] } });
    }
    if (firstChannelType) {
      defaultActions.push({ type: 'alert', config: { channels: [{ type: firstChannelType, config: defaultAlertConfig }] } });
    }
    if (firstTriggerType) {
      defaultActions.push({ type: 'trigger', config: { action: firstTriggerType, ...defaultTriggerConfig } });
    }

    const defaultJson = {
      ...BASE_RULE,
      match: [
        {
          field: firstMatchField,
          operator: firstOperator,
          value: '',
        },
      ],
      actions: defaultActions,
    };

    setCurrentRuleJson(defaultJson);
  }, [policy, properties, currentRuleJson, setCurrentRuleJson]);

  const handleCreatePolicy = (policyYaml) => {
    toast.promise(createPolicy(policyYaml).unwrap(), {
      loading: 'Creating policy...',
      success: () => {
        navigate(-1);
        return 'Policy created successfully';
      },
      error: 'Failed to create policy',
    });
  }

  const handleUpdatePolicy = (policyYaml) => {
    toast.promise(updatePolicy({ policyId, payload: policyYaml }).unwrap(), {
      loading: 'Updating policy...',
      success: () => {
        navigate(-1);
        return 'Policy updated successfully';
      },
      error: 'Failed to update policy',
    });
  }

  if (policyIsLoading) {
    return <ContentLoader />
  }

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-6">
        <Header
          isCreatingRule={policyIsBeingCreated}
          isUpdatingRule={policyIsBeingUpdated}
          handleSave={() => handleCreatePolicy(currentRuleYaml)}
          handleUpdateRule={() => handleUpdatePolicy(currentRuleYaml)}
        />

        <BasicDetailsForm />

        <MatchConditions properties={properties} isLoading={propertiesAreLoading} />

        <ActionTypeSelector properties={properties} />
      </div>
    </div>
  );
};

export default GuidedRuleEditor;
