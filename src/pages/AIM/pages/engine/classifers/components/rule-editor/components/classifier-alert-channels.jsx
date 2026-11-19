import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import Select from "@/components/custom/select";
import YAML from 'yaml';

import useStore from '../store';


const DEFAULT_TEMPLATE_PLACEHOLDER = `Hello,

This is an automated notification to inform you that {{matchedAssetCount}} asset(s) have been matched to the rule {{ruleName}}.

Rule Description:
{{ruleDescription}}

Matched Assets:
{{matchedAssets}}

Please review the matched assets and take any necessary action as per your security policies.`;

function ConfigField({ fieldKey, fieldSchema, value, onChange }) {
    const isArray = fieldSchema?.type === 'array';
    const isTextarea = fieldKey.toLowerCase() === 'template' || fieldKey.toLowerCase() === 'body' || fieldSchema?.type === 'textarea';

    if (isTextarea) {
        return (
            <div>
                <Label className="mb-1.5 block text-xs font-medium capitalize">
                    {fieldKey === 'to' ? 'To (comma separated)' : fieldKey}
                </Label>
                <Textarea
                    placeholder={fieldKey.toLowerCase() === 'template' ? DEFAULT_TEMPLATE_PLACEHOLDER : (fieldSchema?.description || `Enter ${fieldKey}...`)}
                    value={Array.isArray(value) ? value.join('\n') : (value || '')}
                    onChange={(e) => {
                        if (isArray) {
                            onChange(e.target.value.split('\n'));
                        } else {
                            onChange(e.target.value);
                        }
                    }}
                    rows={8}
                    className="resize-y"
                />
            </div>
        );
    }

    if (isArray) {
        return (
            <div>
                <Label className="mb-1.5 block text-xs font-medium capitalize">
                    {fieldKey === 'to' ? 'To (comma separated)' : fieldKey}
                </Label>
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
            </div>
        );
    }

    return (
        <div>
            <Label className="mb-1.5 block text-xs font-medium capitalize">
                {fieldKey === 'to' ? 'To (comma separated)' : fieldKey}
            </Label>
            <Input
                placeholder={fieldSchema?.description || `Enter ${fieldKey}...`}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}


export function ClassifierAlertChannels({ properties, actionIndex }) {
    const currentRuleJson = useStore((state) => state.currentRuleJson);
    const setCurrentRuleJson = useStore((state) => state.setCurrentRuleJson);

    // Schema: properties.actions.find(a => a.value === 'alert').config
    const alertSchema = (properties?.actions || []).find(a => a.value === 'alert')?.config || {};
    const availableChannelTypes = (alertSchema.channels || []).map(ch => ({
        label: ch.charAt(0).toUpperCase() + ch.slice(1),
        value: ch,
    }));
    const channelConfigs = alertSchema.channelConfigs || {};

    // Current alert channels in the rule JSON
    const channels = currentRuleJson?.actions?.[actionIndex]?.config?.channels || [];

    function setChannels(newChannels) {
        const newActions = [...currentRuleJson.actions];
        newActions[actionIndex] = {
            ...newActions[actionIndex],
            config: {
                ...newActions[actionIndex].config,
                channels: newChannels
            }
        };
        setCurrentRuleJson({ ...currentRuleJson, actions: newActions });
    }

    function addChannel() {
        const firstType = availableChannelTypes[0]?.value || '';
        // Build default config from schema
        const configSchema = channelConfigs[firstType] || {};
        const defaultConfig = Object.fromEntries(
            Object.keys(configSchema)
                .filter(k => k !== 'cc' && k !== 'bcc')
                .map(k => [k, configSchema[k]?.type === 'array' ? [] : ''])
        );
        setChannels([...channels, { type: firstType, config: defaultConfig }]);
    }

    function updateChannelType(idx, newType) {
        const configSchema = channelConfigs[newType] || {};
        const defaultConfig = Object.fromEntries(
            Object.keys(configSchema)
                .filter(k => k !== 'cc' && k !== 'bcc')
                .map(k => [k, configSchema[k]?.type === 'array' ? [] : ''])
        );
        const updated = channels.map((ch, i) =>
            i === idx ? { type: newType, config: defaultConfig } : ch
        );
        setChannels(updated);
    }

    function updateChannelConfig(idx, fieldKey, fieldValue) {
        const updated = channels.map((ch, i) => {
            if (i !== idx) return ch;
            return { ...ch, config: { ...ch.config, [fieldKey]: fieldValue } };
        });
        setChannels(updated);
    }

    function deleteChannel(idx) {
        setChannels(channels.filter((_, i) => i !== idx));
    }

    return (
        <div className="space-y-6">
            {channels.map((channel, idx) => {
                const configSchema = channelConfigs[channel.type] || {};
                const configFields = Object.keys(configSchema).filter(k => k !== 'cc' && k !== 'bcc');

                return (
                    <div
                        key={idx}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <Select
                                    searchPlaceholder="Select channel type"
                                    value={channel.type}
                                    options={availableChannelTypes}
                                    onChange={(val) => updateChannelType(idx, val.value)}
                                />
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deleteChannel(idx)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>

                        {configFields.length > 0 && (
                            <div className="grid gap-4 mt-2">
                                {configFields.map((fieldKey) => (
                                    <ConfigField
                                        key={fieldKey}
                                        fieldKey={fieldKey}
                                        fieldSchema={configSchema[fieldKey]}
                                        value={channel.config?.[fieldKey]}
                                        onChange={(val) => updateChannelConfig(idx, fieldKey, val)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
            <Button size="sm" variant="outline" onClick={addChannel} className="mt-2 text-xs h-7">
                + Channel
            </Button>
        </div>
    );
}
