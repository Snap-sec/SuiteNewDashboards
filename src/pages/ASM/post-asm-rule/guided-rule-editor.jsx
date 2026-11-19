import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Copy, Edit, Plus, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import YAML from 'yaml';
import { ruleConfigSchema } from './schemas/rule-config-schema';
import {
  useCreateAsmRuleMutation,
  useGetAsmRulePropertiesQuery,
  useUpdateAsmRuleMutation
} from '@/services/asm/ruleApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinners';
import { Textarea } from '../../../components/ui/textarea';
import useGlobalStore from '../store';
import SearchSelect from '@/components/custom/select';
import DatePicker from '@/components/custom/date-picker';

function toBoolString(value) {
  if (value === true) return 'true';
  if (value === false) return 'false';
  return value;
}

// USED TO FORMAT UPDATED RULE YAML TO FIT ON UI
const mapApiRuleToUiRule = (apiRule) => {
  return {
    id: apiRule._id || Date.now(),

    name: apiRule.name || '',
    description: apiRule.description || '',
    severity: apiRule.severity || 'info',
    product: apiRule.product || 'asm',
    isUniversal: apiRule.isUniversal || false,

    conditions: {
      type: 'group',
      operator: 'AND',
      children: (apiRule.match?.conditions || []).map((c) => ({
        type: 'condition',
        key: c.field,
        operator: c.operator || '==',
        value: toBoolString(c.value),
        transformer: c.transformer || null,
      })),
    },

    properties: (apiRule.set || []).reduce((acc, item) => {
      if (item.field === 'risk' && item.value === 'none') return acc;
      if (item.field === 'exposure_reason' && !item.value) return acc;
      acc[item.field] = item.value;
      return acc;
    }, {}),
  };
};

// THIS RULE EDITOR IS USED TO ADD AND UPDATE RULE
const GuidedRuleEditor = () => {
  // STATES FOR UPDATING RULE > used to avoid prop drilling!
  const setGlobalSelectedRule = useGlobalStore(
    (state) => state.setSelectedRule,
  );
  const globalSelectedRule = useGlobalStore((state) => state.selectedRule);
  const isEditingRule = useGlobalStore((state) => state.isEditingRule);

  const navigate = useNavigate();
  const { data: schemaResponse, isLoading: isSchemaLoading } =
    useGetAsmRulePropertiesQuery({ product: 'asm' });
  const schema = schemaResponse?.data || schemaResponse;

  const [createRule, { isLoading: isCreatingRule }] =
    useCreateAsmRuleMutation();

  const [updateAsmRule, { isLoading: isUpdatingRule }] =
    useUpdateAsmRuleMutation();

  const [rules, setRules] = useState([]);
  const [yamlPreview, setYamlPreview] = useState('');
  const [selectedRule, setSelectedRule] = useState(null);
  const [touched, setTouched] = useState({ name: false, description: false });
  const isSyncingFromYaml = useRef(false);

  // CALLED WHEN UPDATE RULE
  useEffect(() => {
    if (!isEditingRule || !globalSelectedRule || !schema) return;

    const uiRule = mapApiRuleToUiRule(globalSelectedRule);

    setRules([uiRule]);
    setSelectedRule(uiRule.id);
  }, [isEditingRule, globalSelectedRule, schema]);

  // Effect to generate YAML when rules change
  useEffect(() => {
    if (isSyncingFromYaml.current) {
      isSyncingFromYaml.current = false;
      return;
    }
    generateYAML();
  }, [rules, selectedRule]);

  // Initial dummy rule if empty
  useEffect(() => {
    if (!isSchemaLoading && schema && rules.length === 0 && !isEditingRule) {
      addRule();
    }
  }, [schema, isSchemaLoading]);

  const generateYAML = () => {
    if (!selectedRule) {
      setYamlPreview('# Select a rule to view YAML');
      return;
    }

    const rule = rules.find((r) => r.id === selectedRule);
    if (!rule) return;

    let ruleStr = `name: '${rule.name}'\n`;
    ruleStr += `description: >-\n  ${rule.description || 'No description'}\n`;
    ruleStr += `product: ${rule.product || 'asm'}\n`;
    ruleStr += `severity: ${rule.severity || 'info'}\n`;
    ruleStr += `isUniversal: ${rule.isUniversal || false}\n`;

    // Match Conditions
    if (rule.conditions) {
      ruleStr += `match:\n  conditions:\n`;
      ruleStr += formatConditions(rule.conditions, 2);
    }

    // Set Properties
    if (rule.properties && Object.keys(rule.properties).length > 0) {
      const setEntries = Object.entries(rule.properties).filter(([key, value]) => {
        if (key === 'risk' && value === 'none') return false;
        if (key === 'exposure_reason' && !value) return false;
        return true;
      });

      if (setEntries.length > 0) {
        ruleStr += `set:\n`;
        setEntries.forEach(([key, value]) => {
          ruleStr += `  - field: ${key}\n    value: ${value}\n`;
        });
      }
    }

    setYamlPreview(ruleStr);
  };

  const formatConditions = (conditions, indent = 0) => {
    const spaces = '  '.repeat(indent);

    if (conditions.type === 'group') {
      let str = '';
      conditions.children.forEach((child) => {
        if (child.type === 'condition') {
          str += `${spaces}- field: ${child.key}\n${spaces}  operator: '${child.operator}'\n${spaces}  value: ${child.value}`;
          if (child.transformer) {
            str += `\n${spaces}  transformer: ${child.transformer}`;
          }
          str += '\n';
        }
      });
      return str;
    } else {
      let str = `${spaces}- field: ${conditions.key}\n${spaces}  operator: '${conditions.operator}'\n${spaces}  value: ${conditions.value}`;
      if (conditions.transformer) {
        str += `\n${spaces}  transformer: ${conditions.transformer}`;
      }
      return str + '\n';
    }
  };

  const addRule = () => {
    const defaultFields = [
      ...(schema.actions?.fields || []),
      ...(schema.properties_to_set || []),
    ];
    const defaultProperties = {};
    defaultFields.forEach((f) => {
      const val = f.options?.[0] ?? '';
      if (f.key === 'risk' && val === 'none') return;
      if (f.key === 'exposure_reason' && !val) return;
      defaultProperties[f.key] = val;
    });

    const newRule = {
      id: Date.now(),
      name: '',
      description: '',
      severity: 'info',
      product: 'asm',
      isUniversal: false,
      properties: defaultProperties,
      conditions: {
        type: 'group',
        operator: 'AND',
        children: [
          {
            type: 'condition',
            key: 'type',
            operator: '==',
            value: 'subdomain',
          },
        ],
      },
    };
    setRules([...rules, newRule]);
    setSelectedRule(newRule.id);
  };

  const deleteRule = (id) => {
    setRules(rules.filter((r) => r.id !== id));
    if (selectedRule === id) setSelectedRule(null);
  };

  const updateRule = (id, updates) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const handleYamlChange = (e) => {
    const value = e.target.value;
    setYamlPreview(value);

    try {
      const parsed = YAML.parse(value);
      if (parsed && typeof parsed === 'object' && selectedRule) {
        updateRuleFromYaml(selectedRule, parsed);
      }
    } catch (err) {
      // Invalid YAML
    }
  };

  const updateRuleFromYaml = (id, parsed) => {
    const updates = {
      name: parsed.name,
      description: parsed.description,
      product: parsed.product,
      severity: parsed.severity,
      isUniversal: parsed.isUniversal,
      properties: {},
      conditions: { type: 'group', operator: 'AND', children: [] },
    };

    // Map Conditions
    if (parsed.match?.conditions && Array.isArray(parsed.match.conditions)) {
      parsed.match.conditions.forEach((cond) => {
        updates.conditions.children.push({
          type: 'condition',
          key: cond.field,
          operator: cond.operator || '==',
          value: toBoolString(cond.value),
          transformer: cond.transformer || null,
        });
      });
    }

    // Map Properties
    if (parsed.set && Array.isArray(parsed.set)) {
      parsed.set.forEach((p) => {
        updates.properties[p.field] = p.value;
      });
    }

    isSyncingFromYaml.current = true;
    updateRule(id, updates);
  };

  // -- Condition Logic --
  const addCondition = (ruleId) => {
    setRules(
      rules.map((r) => {
        if (r.id !== ruleId) return r;
        const usedKeys = r.conditions.children.map((c) => c.key);
        const firstAvailable = schema?.conditions?.fields?.find(
          (f) => !usedKeys.includes(f.key)
        );
        if (!firstAvailable) return r; // all fields already used

        const newCondition = {
          type: 'condition',
          key: firstAvailable.key,
          operator: '==',
          value: '',
          transformer: null,
        };
        const updatedConditions = JSON.parse(JSON.stringify(r.conditions));
        updatedConditions.children.push(newCondition);
        return { ...r, conditions: updatedConditions };
      }),
    );
  };

  const updateCondition = (ruleId, index, updates) => {
    setRules(
      rules.map((r) => {
        if (r.id !== ruleId) return r;
        const updatedConditions = JSON.parse(JSON.stringify(r.conditions));
        updatedConditions.children[index] = {
          ...updatedConditions.children[index],
          ...updates,
        };
        return { ...r, conditions: updatedConditions };
      }),
    );
  };

  const deleteCondition = (ruleId, index) => {
    setRules(
      rules.map((r) => {
        if (r.id !== ruleId) return r;
        const updatedConditions = JSON.parse(JSON.stringify(r.conditions));
        updatedConditions.children.splice(index, 1);
        return { ...r, conditions: updatedConditions };
      }),
    );
  };

  const handleSave = () => {
    toast.promise(createRule(yamlPreview).unwrap().then(() => navigate('/casm/signals')), {
      loading: 'Saving Rules...',
      success: 'Rules saved successfully',
      error: 'Failed to save rules',
    });
  };


  // USED WHEN WHEN RULE IS UPDATED
  const handleUpdateRule = () => {
    toast.promise(updateAsmRule({ ruleId: globalSelectedRule?._id, yaml: yamlPreview }).unwrap().then(() => navigate('/casm/signals')), {
      loading: 'Updating Rule...',
      success: 'Rule Updated successfully',
      error: 'Failed to Update a rule',
    });
  };

  // -- Render Components --

  // if (isSchemaLoading) return <div className="p-10 flex justify-center"><Spinner /></div>;
  if (!schema && !isSchemaLoading)
    return <div className="p-10 text-red-500">Failed to load rule schema.</div>;

  const currentRule = rules.find((r) => r.id === selectedRule);

  const nameLength = currentRule?.name?.length || 0;
  const descriptionLength = currentRule?.description?.length || 0;
  const isNameInvalid = nameLength > 60;
  const isDescriptionInvalid = descriptionLength > 500;

  const configValidation = ruleConfigSchema.safeParse({
    name: currentRule?.name ?? '',
    description: currentRule?.description ?? '',
  });
  const configErrorsByField = configValidation.success
    ? {}
    : configValidation.error.flatten().fieldErrors;
  const nameError = (touched.name || isEditingRule) ? configErrorsByField?.name?.[0] : '';
  const descriptionError = (touched.description || isEditingRule) ? configErrorsByField?.description?.[0] : '';
  const isConfigValid = configValidation.success;

  const isSaveDisabled =
    isCreatingRule ||
    isUpdatingRule ||
    isNameInvalid ||
    isDescriptionInvalid ||
    !isConfigValid;

  return (
    <div className="h-screen flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center Panel - Rule Editor */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentRule ? (
            <div className="flex flex-col space-y-6">
              {/* Toolbar / Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h1 className="text-2xl font-bold ">Guided Rule Editor</h1>
                </div>
              </div>

              {/* Configuration */}
              <Card className="border-none shadow-sm ring-1 ring-gray-900/5">
                <CardHeader>
                  <CardTitle>Rule Configuration</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <Label className="mb-1.5 block">Rule Name<span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      className={(isNameInvalid || !!nameError) ? 'border-destructive/60 focus-visible:ring-destructive/10' : ''}
                      value={currentRule.name}
                      onChange={(e) => {
                        updateRule(currentRule.id, { name: e.target.value });
                        setTouched((prev) => ({ ...prev, name: true }));
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                      placeholder="Enter rule name"
                    />
                    <div className="flex justify-between mt-1 px-1">
                      <p className="text-[10px] text-destructive font-medium">
                        {nameError || (isNameInvalid ? 'Rule name cannot exceed 60 characters' : '')}
                      </p>
                      <span
                        className={`text-[10px] font-medium ${isNameInvalid ? 'text-destructive' : 'text-muted-foreground'
                          }`}
                      >
                        {nameLength}/60
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label className="mb-1.5 block">Description<span className="text-red-500">*</span></Label>
                    <Textarea
                      className={(isDescriptionInvalid || !!descriptionError) ? 'border-destructive/60 focus-visible:ring-destructive/10' : ''}
                      value={currentRule.description}
                      onChange={(e) => {
                        updateRule(currentRule.id, {
                          description: e.target.value,
                        });
                        setTouched((prev) => ({ ...prev, description: true }));
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
                      placeholder="Enter description here"
                      rows={4}
                    />
                    <div className="flex justify-between mt-1 px-1">
                      <p className="text-[10px] text-destructive font-medium">
                        {descriptionError || (isDescriptionInvalid ? 'Description cannot exceed 500 characters' : '')}
                      </p>
                      <span
                        className={`text-[10px] font-medium ${isDescriptionInvalid ? 'text-destructive' : 'text-muted-foreground'
                          }`}
                      >
                        {descriptionLength}/500
                      </span>
                    </div>
                  </div>


                  {/* Dynamic Config Fields from Schema */}
                  {Object.entries(schema.configuration)
                    .filter(([key]) => !['isUniversal', 'product'].includes(key)) // Exclude 'isUniversal' and 'product'
                    .map(([key, config]) => {
                      if (key === 'name' || key === 'description') return null;
                      return (
                        <div key={key} className={key === 'severity' ? 'col-span-2' : ''}>
                          <Label className="mb-1.5 block">{config.label}<span className="text-red-500">*</span></Label>
                          {config.type === 'enum' ? (
                            <SearchSelect
                              disabled={config.label.toLowerCase() === 'product'}
                              value={currentRule[key] || config.default}
                              onChange={(val) =>
                                updateRule(currentRule.id, { [key]: val?.value })
                              }
                              options={config.options.map((opt) => ({
                                label: opt,
                                value: opt,
                              }))}
                              enableSearch={true}
                              placeholder="Select..."
                            />
                          ) : config.type === 'boolean' ? (
                            <SearchSelect
                              value={(currentRule[key] ?? false) ? 'true' : 'false'}
                              onChange={(val) =>
                                updateRule(currentRule.id, {
                                  [key]: val?.value === 'true',
                                })
                              }
                              options={[
                                { label: 'True', value: 'true' },
                                { label: 'False', value: 'false' },
                              ]}
                              enableSearch={true}
                              placeholder="Select..."
                            />
                          ) : (
                            <Input
                              type={
                                config.type === 'number' ? 'number' : 'text'
                              }
                              value={currentRule[key] || ''}
                              onChange={(e) =>
                                updateRule(currentRule.id, {
                                  [key]: e.target.value,
                                })
                              }
                            />
                          )}
                        </div>
                      );
                    })}
                </CardContent>
              </Card>

              {/* Conditions */}
              <Card className="border-none shadow-sm ">
                <CardHeader>
                  <div className="flex items-center gap-2 w-full justify-between">
                    <CardTitle>Conditions</CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addCondition(currentRule.id)}
                    >
                      + Condition
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentRule.conditions.children.map((child, idx) => {
                    const fieldSchema = schema.conditions.fields.find(
                      (f) => f.key === child.key,
                    );
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3  border  rounded-lg group"
                      >
                        <div className="w-1/3 min-w-[200px]">
                          <SearchSelect
                            value={child.key}
                            onChange={(val) =>
                              updateCondition(currentRule.id, idx, {
                                key: val?.value,
                                value: '',
                              })
                            }
                            options={schema.conditions.fields
                              .filter(
                                (f) =>
                                  f.key === child.key ||
                                  !currentRule.conditions.children.some(
                                    (c, i) => i !== idx && c.key === f.key
                                  )
                              )
                              .map((f) => ({ label: f.label, value: f.key }))}
                            enableSearch={true}
                            placeholder="Select field..."
                          />
                        </div>

                        <div className="w-[120px]">
                          <SearchSelect
                            value={child.operator}
                            onChange={(val) =>
                              updateCondition(currentRule.id, idx, {
                                operator: val?.value,
                              })
                            }
                            options={(fieldSchema?.operators || ['==']).map((op) => ({
                              label: op,
                              value: op,
                            }))}
                            enableSearch={true}
                            placeholder="Operator..."
                          />
                        </div>

                        {fieldSchema?.transformers && fieldSchema.transformers.length > 0 && (
                          <div className="w-[120px]">
                            <SearchSelect
                              value={child.transformer || 'none'}
                              onChange={(val) =>
                                updateCondition(currentRule.id, idx, {
                                  transformer: val?.value === 'none' ? null : val?.value,
                                })
                              }
                              options={[
                                { label: 'None', value: 'none' },
                                ...(fieldSchema?.transformers || []).map((t) => ({
                                  label: t,
                                  value: t,
                                })),
                              ]}
                              enableSearch={true}
                              placeholder="Transform..."
                            />
                          </div>
                        )}

                        <div className="flex-1">
                          {fieldSchema?.type === 'enum' ? (
                            <SearchSelect
                              value={child.value}
                              onChange={(val) =>
                                updateCondition(currentRule.id, idx, {
                                  value: val?.value,
                                })
                              }
                              options={fieldSchema.options.map((opt) => ({
                                label: opt,
                                value: opt,
                              }))}
                              enableSearch={true}
                              placeholder="Select..."
                            />
                          ) : fieldSchema?.type === 'boolean' ? (
                            <SearchSelect
                              value={toBoolString(child.value)}
                              onChange={(val) =>
                                updateCondition(currentRule.id, idx, {
                                  value: val?.value,
                                })
                              }
                              options={[
                                { label: 'True', value: 'true' },
                                { label: 'False', value: 'false' },
                              ]}
                              enableSearch={true}
                              placeholder="Select..."
                            />
                          ) : fieldSchema?.type?.toLowerCase() === 'date' ? (
                            <DatePicker
                              value={child.value ? new Date(child.value) : undefined}
                              onChange={(date) =>
                                updateCondition(currentRule.id, idx, {
                                  value: date ? date.toISOString() : '',
                                })
                              }
                            />
                          ) : (
                            <Input
                              type={
                                fieldSchema?.type === 'number'
                                  ? 'number'
                                  : 'text'
                              }
                              value={child.value}
                              onChange={(e) =>
                                updateCondition(currentRule.id, idx, {
                                  value: e.target.value,
                                })
                              }
                              placeholder="Value"
                            />
                          )}
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteCondition(currentRule.id, idx)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Actions Properties */}
              {/* <Card className="border-none shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between w-full gap-2">
                    <CardTitle>Actions / Set Exposures</CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const firstUnset = schema.actions.fields
                          .concat(schema.properties_to_set)
                          .find((f) => !currentRule.properties[f?.key]);
                        if (firstUnset) {
                          updateRule(currentRule.id, {
                            properties: {
                              ...currentRule.properties,
                              [firstUnset.key]: '',
                            },
                          });
                        }
                      }}
                    >
                      <Plus size={14} className="mr-1" />
                      Add Property
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(currentRule.properties).map(
                    ([key, value]) => {
                      const allFields = [
                        ...(schema.actions?.fields || []),
                        ...(schema.properties_to_set || []),
                      ];
                      const fieldInfo = allFields.find((f) => f.key === key);

                      return (
                        <div key={key} className="flex items-center gap-3">
                          <div className="w-1/3 min-w-[200px]">
                            <SearchSelect
                              value={key}
                              onChange={(val) => {
                                const selectedVal = val?.value;
                                if (!selectedVal) return;
                                const newProps = { ...currentRule.properties };
                                delete newProps[key];
                                const newField = allFields.find(
                                  (f) => f.key === selectedVal
                                );
                                const newValue = newField?.options
                                  ? newField.options[0]
                                  : '';

                                newProps[selectedVal] = newValue;
                                updateRule(currentRule.id, {
                                  properties: newProps,
                                });
                              }}
                              options={allFields.map((f) => ({
                                label: f.label,
                                value: f.key,
                                disabled:
                                  currentRule.properties[f.key] !== undefined &&
                                  f.key !== key,
                              }))}
                              enableSearch={true}
                              placeholder="Select property..."
                            />
                          </div>

                          <span className="text-muted-foreground font-mono">
                            =
                          </span>

                          {fieldInfo?.type === 'enum' && fieldInfo.options ? (
                            <div className="flex-1">
                              <SearchSelect
                                value={value}
                                onChange={(val) =>
                                  updateRule(currentRule.id, {
                                    properties: {
                                      ...currentRule.properties,
                                      [key]: val?.value,
                                    },
                                  })
                                }
                                options={fieldInfo.options.map((opt) => ({
                                  label: opt,
                                  value: opt,
                                }))}
                                enableSearch={true}
                                placeholder="Select..."
                              />
                            </div>
                          ) : fieldInfo?.type === 'boolean' ? (
                            <div className="flex-1">
                              <SearchSelect
                                value={(value ?? false) ? 'true' : 'false'}
                                onChange={(val) =>
                                  updateRule(currentRule.id, {
                                    properties: {
                                      ...currentRule.properties,
                                      [key]: val?.value === 'true',
                                    },
                                  })
                                }
                                options={[
                                  { label: 'True', value: 'true' },
                                  { label: 'False', value: 'false' },
                                ]}
                                enableSearch={true}
                                placeholder="Select..."
                              />
                            </div>
                          ) : fieldInfo?.type?.toLowerCase() === 'date' ? (
                            <div className="flex-1">
                              <DatePicker
                                value={value ? new Date(value) : undefined}
                                onChange={(date) =>
                                  updateRule(currentRule.id, {
                                    properties: {
                                      ...currentRule.properties,
                                      [key]: date ? date.toISOString() : '',
                                    },
                                  })
                                }
                              />
                            </div>
                          ) : (
                            <Input
                              type={
                                fieldInfo?.type === 'number' ? 'number' : 'text'
                              }
                              value={value}
                              onChange={(e) =>
                                updateRule(currentRule.id, {
                                  properties: {
                                    ...currentRule.properties,
                                    [key]: e.target.value,
                                  },
                                })
                              }
                              className="flex-1"
                              placeholder="Value"
                            />
                          )}

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              const newProps = { ...currentRule.properties };
                              delete newProps[key];
                              updateRule(currentRule.id, {
                                properties: newProps,
                              });
                            }}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      );
                    },
                  )}
                </CardContent>
              </Card> */}

              <div className="flex w-full justify-end">
                <Button onClick={isEditingRule ? handleUpdateRule : handleSave} disabled={isSaveDisabled}>
                  {isEditingRule ? <Edit className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {isEditingRule ? "Update Rule" : isCreatingRule ? 'Saving...' : 'Save Rule'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Spinner className=" animate-spin" />
            </div>
          )}
        </div>

        {/* Right Panel - YAML Preview */}
        <div className="w-[450px] border border-l-muted-foreground flex flex-col ">
          <div className="px-4 py-3 border-b  flex justify-between items-center backdrop-blur">
            <h2 className="font-semibold text-sm tracking-wide">
              YAML Preview
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(yamlPreview);
                toast.success('Copied!');
              }}
              className="h-7 text-xs "
            >
              <Copy size={12} className="mr-1.5" /> Copy
            </Button>
          </div>
          <Textarea
            className="flex-1 p-4 text-xs font-mono leading-relaxed resize-none outline-none border-none"
            value={yamlPreview}
            onChange={handleYamlChange}
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

export default GuidedRuleEditor;
