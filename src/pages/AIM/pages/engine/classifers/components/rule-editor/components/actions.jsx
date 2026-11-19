import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import Select from "@/components/custom/select";
import DatePicker from "@/components/custom/date-picker";

import useStore from '../store';

export function Actions({ properties, actionIndex }) {

    const currentRuleJson = useStore((state) => state.currentRuleJson);
    const setCurrentRuleJson = useStore((state) => state.setCurrentRuleJson);

    // Find the selected action from the schema and read its setKeys
    const selectedAction = (properties?.actions || []).find(a => a.value === 'classify');
    const setKeys = selectedAction?.config?.setKeys || [];
    const keys = setKeys.map(prop => ({
        label: prop.label,
        value: prop.field,
        options: prop.options,
        type: prop.type,
    }));

    const currentSet = currentRuleJson?.actions?.[actionIndex]?.config?.set || [];

    if (setKeys.length === 0) return null;


    function addAction() {
        const newActions = [...currentRuleJson.actions];
        newActions[actionIndex] = {
            ...newActions[actionIndex],
            config: {
                ...newActions[actionIndex].config,
                set: [...currentSet, { field: '', value: '' }]
            }
        };
        setCurrentRuleJson({ ...currentRuleJson, actions: newActions });
    }

    function updateAction(idx, { key, value }) {
        const newSet = [...currentSet];
        const currentAction = newSet[idx];
        let update = { [key]: value };

        // If field changes, determine transformer and reset value if needed
        if (key === 'field') {
            const selectedProp = setKeys.find(p => p.field === value);

            // Set transformer
            if (selectedProp?.type === 'date') {
                update.transformer = 'Date';
            } else {
                update.transformer = undefined;
            }

            // Reset value if current value is not compatible
            if (selectedProp?.options?.length > 0) {
                if (!selectedProp.options.includes(currentAction.value)) {
                    update.value = '';
                }
            } else if (selectedProp?.type === 'date') {
                if (isNaN(Date.parse(currentAction.value))) {
                    update.value = new Date().toISOString();
                }
            }
        }

        newSet[idx] = { ...currentAction, ...update };

        const newActions = [...currentRuleJson.actions];
        newActions[actionIndex] = {
            ...newActions[actionIndex],
            config: {
                ...newActions[actionIndex].config,
                set: newSet
            }
        };
        setCurrentRuleJson({ ...currentRuleJson, actions: newActions });
    }

    function deleteAction(idx) {
        const newSet = [...currentSet];
        newSet.splice(idx, 1);

        const newActions = [...currentRuleJson.actions];
        newActions[actionIndex] = {
            ...newActions[actionIndex],
            config: {
                ...newActions[actionIndex].config,
                set: newSet
            }
        };
        setCurrentRuleJson({ ...currentRuleJson, actions: newActions });
    }

    return (
        <div className="space-y-4">
            {currentSet.map((action, idx) => {
                const selectedProp = setKeys.find(p => p.field === action.field);
                const hasOptions = selectedProp?.options?.length > 0;
                const isDate = selectedProp?.type === 'date';
                const isBoolean = hasOptions && selectedProp.options.every(o => typeof o === 'boolean');

                return (
                    <div
                        key={idx}
                        className="flex items-center gap-3 "
                    >
                        <div className="w-1/3 min-w-[200px]">
                            <Select
                                searchPlaceholder="Search available fields"
                                value={action.field}
                                options={keys}
                                onChange={(val) =>
                                    updateAction(idx, {
                                        key: "field",
                                        value: val.value
                                    })}
                            />
                        </div>

                        <div className="flex-1">
                            {hasOptions ? (
                                <Select
                                    searchPlaceholder="Search available values"
                                    value={action.value !== undefined ? String(action.value) : ''}
                                    options={selectedProp.options.map(opt => ({
                                        label: String(opt),
                                        value: String(opt)
                                    }))}
                                    onChange={(val) => {
                                        let finalValue = val.value;
                                        if (isBoolean) {
                                            finalValue = val.value === 'true';
                                        }
                                        updateAction(idx, {
                                            key: "value",
                                            value: finalValue
                                        })
                                    }}
                                />
                            ) : isDate ? (
                                <DatePicker
                                    value={action.value ? new Date(action.value) : undefined}
                                    onChange={(date) =>
                                        updateAction(idx, {
                                            key: "value",
                                            value: date ? date.toISOString() : ''
                                        })}
                                />
                            ) : (
                                <Input
                                    value={action.value}
                                    onChange={(e) =>
                                        updateAction(idx, {
                                            key: "value",
                                            value: e.target.value
                                        })}
                                />
                            )}
                        </div>

                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteAction(idx)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                );
            })}
            <Button
                size="sm"
                variant="outline"
                onClick={() => addAction()}
                className="mt-2 text-xs h-7"
            >
                + Field
            </Button>
        </div>
    )
}