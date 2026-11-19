import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Select from "@/components/custom/select";

import useStore from '../store';

// Renders a single config field based on its schema type
function ConfigField({ fieldKey, fieldSchema, value, onChange }) {
    const isArray = fieldSchema?.type === 'array';

    if (isArray) {
        return (
            <div>
                <Label className="mb-1.5 block text-xs capitalize">{fieldKey.replace(/_/g, ' ')}</Label>
                <Input
                    placeholder={fieldSchema?.description || `Enter ${fieldKey}...`}
                    value={Array.isArray(value) ? value.join(', ') : (value || '')}
                    onChange={(e) => {
                        const arr = e.target.value
                            .split(',')
                            .map(s => s.trim())
                            .filter(Boolean);
                        onChange(arr);
                    }}
                />
                <p className="text-[11px] text-muted-foreground mt-1">Separate multiple values with commas</p>
            </div>
        );
    }

    return (
        <div>
            <Label className="mb-1.5 block text-xs capitalize">{fieldKey.replace(/_/g, ' ')}</Label>
            <Input
                placeholder={fieldSchema?.description || `Enter ${fieldKey}...`}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}


export function ClassifierTriggerActions({ properties, actionIndex }) {
    const currentRuleJson = useStore((state) => state.currentRuleJson);
    const setCurrentRuleJson = useStore((state) => state.setCurrentRuleJson);

    // Schema: properties.actions.find(a => a.value === 'trigger').config
    const triggerSchema = (properties?.actions || []).find(a => a.value === 'trigger')?.config || {};
    const availableTriggerTypes = (triggerSchema.actions || []).map(t => ({
        label: t,
        value: t,
    }));
    const actionConfigs = triggerSchema.actionConfigs || {};

    const trigger = currentRuleJson?.actions?.[actionIndex];
    if (!trigger) return null;
    
    // The specific trigger type is stored in config.action
    const specificType = trigger.config?.action || '';

    function updateTriggerAction(newType) {
        const configSchema = actionConfigs[newType] || {};
        const defaultConfig = Object.fromEntries(
            Object.keys(configSchema).map(k => [k, configSchema[k]?.type === 'array' ? [] : ''])
        );
        const newActions = [...currentRuleJson.actions];
        newActions[actionIndex] = {
            ...newActions[actionIndex],
            config: {
                action: newType,
                ...defaultConfig
            }
        };
        setCurrentRuleJson({ ...currentRuleJson, actions: newActions });
    }

    function updateTriggerConfig(fieldKey, fieldValue) {
        const newActions = [...currentRuleJson.actions];
        newActions[actionIndex] = {
            ...newActions[actionIndex],
            config: {
                ...newActions[actionIndex].config,
                [fieldKey]: fieldValue
            }
        };
        setCurrentRuleJson({ ...currentRuleJson, actions: newActions });
    }

    const configSchema = actionConfigs[specificType] || {};
    // Exclude 'action' from the dynamically rendered fields since it's handled by the dropdown
    const configFields = Object.keys(configSchema).filter(k => k !== 'action');

    return (
        <div className="space-y-4 mt-2">
            <div className="flex items-center gap-3">
                <div className="w-[220px]">
                    <Select
                        searchPlaceholder="Select action type"
                        value={specificType}
                        options={availableTriggerTypes}
                        onChange={(val) => updateTriggerAction(val.value)}
                    />
                </div>
            </div>

            {configFields.length > 0 && (
                <div className="grid gap-3">
                    {configFields.map((fieldKey) => (
                        <ConfigField
                            key={fieldKey}
                            fieldKey={fieldKey}
                            fieldSchema={configSchema[fieldKey]}
                            value={trigger.config?.[fieldKey]}
                            onChange={(val) => updateTriggerConfig(fieldKey, val)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
