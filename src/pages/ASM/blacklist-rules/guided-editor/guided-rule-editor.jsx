import React, { useEffect } from 'react';
import { Edit, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateAsmBlacklistRuleMutation,
  useGetAsmBlacklistRulePropertiesQuery,
  useUpdateAsmBlacklistRuleMutation,
} from '@/services/asm/blacklistRulesApi';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinners';
import { Form } from '@/components/ui/form';
import useStore from '../store';
import { blacklistRuleSchema } from './schemas/blacklist-rule-schema';
import EditorHeader from './components/editor-header';
import RuleMetadataForm from './components/rule-metadata-form';
import RuleConditionsForm from './components/rule-conditions-form';
import RuleYamlPreview from './components/rule-yaml-preview';

const mapApiToUiCondition = (node) => {
  if (!node) return null;
  if (node.type === 'group' || node.logicalOp) {
    return {
      type: 'group',
      operator: node.logicalOp || node.operator || 'AND',
      children: (node.children || node.conditions || [])
        .map(mapApiToUiCondition)
        .filter(Boolean),
    };
  }
  let val = node.value;
  if (Array.isArray(val)) {
    val = val.join(', ');
  }
  return {
    type: 'condition',
    key: node.field || node.key || '',
    operator: node.operator || 'equals',
    value: val !== undefined && val !== null ? val : '',
    transformer: node.transformer || null,
  };
};

const mapApiRuleToUiRule = (apiRule) => {
  if (!apiRule) return null;
  const rawConditions = apiRule.conditions || apiRule.match;
  return {
    name: apiRule.name || '',
    description: apiRule.description || '',
    conditions: mapApiToUiCondition(rawConditions) || {
      type: 'group',
      operator: 'AND',
      children: [],
    },
  };
};

const mapUiToApiCondition = (node) => {
  if (node.type === 'group') {
    return {
      type: 'group',
      logicalOp: node.operator || 'AND',
      children: (node.children || []).map(mapUiToApiCondition),
    };
  }
  let val = node.value;
  if ((node.operator === 'in' || node.operator === 'notIn') && typeof val === 'string') {
    val = val.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return {
    type: 'condition',
    field: node.key,
    operator: node.operator,
    value: val,
    children: [],
    ...(node.transformer ? { transformer: node.transformer } : {}),
  };
};

export const BlacklistGuidedRuleEditor = () => {
  const setSelectedRule = useStore((state) => state.setSelectedRule);
  const selectedRule = useStore((state) => state.selectedRule);
  const isEditingRule = useStore((state) => state.mode) === 'update';

  const navigate = useNavigate();
  const { data: schemaResponse, isLoading: isSchemaLoading } =
    useGetAsmBlacklistRulePropertiesQuery();

  const rawSchemaData = schemaResponse?.data || schemaResponse;

  const schema = React.useMemo(() => {
    const defaultFields = [
      { field: 'type', type: 'String', description: 'Asset type', values: ['subdomain', 'web_server', 'dns', 'port', 'ip', 'certificate', 'technology'] },
      { field: 'value', type: 'String', description: 'Asset value' },
      { field: 'domain', type: 'String', description: 'Domain' },
      { field: 'subdomain', type: 'String', description: 'Subdomain' },
      { field: 'ip', type: 'String', description: 'IP address' },
      { field: 'properties.technology_description', type: 'String', description: 'Technology description' },
      { field: 'properties.technology_website', type: 'String', description: 'Technology website' },
      { field: 'properties.technology_cpe', type: 'String', description: 'Technology CPE' },
      { field: 'properties.dns_class', type: 'String', description: 'DNS class' },
      { field: 'properties.dns_ttl', type: 'Number', description: 'DNS TTL' },
      { field: 'properties.port_service', type: 'String', description: 'Port service' },
      { field: 'properties.port_protocol', type: 'String', description: 'Port protocol' },
      { field: 'properties.port_status', type: 'String', description: 'Port status' },
      { field: 'properties.ip_country', type: 'String', description: 'IP country' },
      { field: 'properties.ip_region', type: 'String', description: 'IP region' },
      { field: 'properties.ip_city', type: 'String', description: 'IP city' },
      { field: 'properties.ip_org', type: 'String', description: 'IP organization' },
      { field: 'properties.subdomain_status', type: 'String', description: 'Subdomain status' },
      { field: 'properties.subdomain_is_public', type: 'Boolean', description: 'Is subdomain public' },
      { field: 'properties.subdomain_status_code', type: 'String', description: 'Subdomain HTTP status code' },
      { field: 'properties.subdomain_title', type: 'String', description: 'Subdomain page title' },
      { field: 'properties.certificate_common_name', type: 'String', description: 'Certificate common name' },
      { field: 'properties.certificate_issuer', type: 'String', description: 'Certificate issuer' },
      { field: 'properties.certificate_is_expired', type: 'Boolean', description: 'Is certificate expired' },
      { field: 'scanner', type: 'String', description: 'Scanner name' },
      { field: 'network_scope', type: 'String', description: 'Network scope (internal/external)' },
    ];

    const defaultOperators = [
      'equals',
      'notEquals',
      'contains',
      'notContains',
      'greaterThan',
      'lessThan',
      'greaterThanOrEqual',
      'lessThanOrEqual',
      'in',
      'notIn',
      'regex',
      'exists',
      'notExists',
    ];

    const fieldsList = rawSchemaData?.fields?.length ? rawSchemaData.fields : defaultFields;
    const operatorsList = rawSchemaData?.operators?.length ? rawSchemaData.operators : defaultOperators;

    return {
      keys: fieldsList.map((f) => ({
        label: f.description ? `${f.description} (${f.field})` : f.field,
        value: f.field,
        type: f.type?.toLowerCase() === 'boolean'
          ? 'boolean'
          : f.type?.toLowerCase() === 'number'
          ? 'number'
          : f.values?.length
          ? 'enum'
          : 'string',
        options: f.values || [],
      })),
      operators: operatorsList,
    };
  }, [rawSchemaData]);

  const [createRule, { isLoading: isCreatingRule }] =
    useCreateAsmBlacklistRuleMutation();
  const [updateRule, { isLoading: isUpdatingRule }] =
    useUpdateAsmBlacklistRuleMutation();

  const form = useForm({
    resolver: zodResolver(blacklistRuleSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      conditions: {
        type: 'group',
        operator: 'AND',
        children: [
          {
            type: 'condition',
            key: 'domain',
            operator: 'contains',
            value: '',
          },
        ],
      },
    },
  });

  useEffect(() => {
    if (!isEditingRule || !selectedRule || isSchemaLoading) return;
    const mapped = mapApiRuleToUiRule(selectedRule);
    if (mapped) {
      form.reset(mapped);
    }
  }, [isEditingRule, selectedRule, isSchemaLoading, form]);

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      description: values.description,
      conditions: mapUiToApiCondition(values.conditions),
    };

    const ruleId = selectedRule?._id || selectedRule?.id;

    if (isEditingRule && ruleId) {
      toast.promise(
        updateRule({ id: ruleId, ...payload })
          .unwrap()
          .then(() => {
            setSelectedRule(null);
            useStore.setState({ mode: 'create' });
            navigate('/casm/blacklist-rules');
          }),
        {
          loading: 'Updating Rule...',
          success: 'Rule Updated successfully',
          error: (err) => err?.data?.message || err?.message || 'Failed to Update rule',
        },
      );
    } else {
      toast.promise(
        createRule(payload)
          .unwrap()
          .then(() => {
            setSelectedRule(null);
            useStore.setState({ mode: 'create' });
            navigate('/casm/blacklist-rules');
          }),
        {
          loading: 'Saving Rule...',
          success: 'Rule saved successfully',
          error: (err) => err?.data?.message || err?.message || 'Failed to save rule',
        },
      );
    }
  };

  if (isSchemaLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-muted-foreground">
        <Spinner className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const watchAllFields = form.watch();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-[calc(100vh-64px)] flex flex-col"
      >
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6">
            {/* Header Component */}
            <EditorHeader isEditingRule={isEditingRule} />

            {/* Metadata Form Card Component */}
            <RuleMetadataForm control={form.control} />

            {/* Conditions Form Card Component */}
            <RuleConditionsForm
              control={form.control}
              schema={schema}
              watch={form.watch}
              setValue={form.setValue}
            />

            {/* Submit Action Bar */}
            <div className="flex w-full justify-end pb-8">
              <Button
                type="submit"
                disabled={
                  isCreatingRule || isUpdatingRule || !form.formState.isValid
                }
              >
                {isEditingRule ? (
                  <Edit className="w-4 h-4 mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isEditingRule
                  ? 'Update Rule'
                  : isCreatingRule || isUpdatingRule
                  ? 'Saving...'
                  : 'Save Rule'}
              </Button>
            </div>
          </div>

          {/* Right Panel - Structure YAML Preview Component */}
          <RuleYamlPreview formValues={watchAllFields} />
        </div>
      </form>
    </Form>
  );
};

export default BlacklistGuidedRuleEditor;
