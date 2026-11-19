import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Select from "@/components/custom/select";
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import DatePicker from "@/components/custom/date-picker";
import YAML from 'yaml';

import useStore from '../store';


// New schema shape:
// properties.fields   → [{ field, label, type, options }]
// properties.operators → ["==", "!=", ...]

export function MatchConditions({ properties }) {

    const currentRuleJson = useStore((state) => state.currentRuleJson);
    const setCurrentRuleYaml = useStore((state) => state.setCurrentRuleYaml);
    const setCurrentRuleJson = useStore((state) => state.setCurrentRuleJson);

    // Build keys/operators from new schema
    const available_fields = properties?.fields || [];
    const keys = available_fields.map(prop => ({
        label: prop.label,
        value: prop.field,
        options: prop.options,
        type: prop.type,
    }));

    const operators = (properties?.operators || []).map(op => ({
        label: op,
        value: op,
    }));


    function addCondition() {
        const new_json = {
            ...currentRuleJson,
            // match is a flat array of conditions
            match: [
                ...(currentRuleJson?.match || []),
                { field: '', operator: '==', value: '' },
            ],
        };
        setCurrentRuleJson(new_json);
        // setCurrentRuleYaml handled by store
    }

    function updateCondition(idx, { key, value }) {
        let new_conditions = [...(currentRuleJson.match || [])];
        const currentCondition = new_conditions[idx];
        let update = { [key]: value };

        // If field changes, determine transformer and reset value if needed
        if (key === 'field') {
            const selectedProp = available_fields.find(p => p.field === value);

            // Set transformer based on type
            if (selectedProp?.type === 'date') {
                update.transformer = 'Date';
            } else {
                update.transformer = undefined;
            }

            // Reset value if current value is not compatible
            if (selectedProp?.options?.length > 0) {
                if (!selectedProp.options.includes(currentCondition.value)) {
                    update.value = '';
                }
            } else if (selectedProp?.type === 'date') {
                if (isNaN(Date.parse(currentCondition.value))) {
                    update.value = new Date().toISOString();
                }
            }
        }

        new_conditions[idx] = { ...currentCondition, ...update };

        const new_json = {
            ...currentRuleJson,
            match: new_conditions,
        };

        setCurrentRuleJson(new_json);
        // setCurrentRuleYaml handled by store
    }

    function deleteCondition(idx) {
        const updatedConditions = [...(currentRuleJson.match || [])];
        updatedConditions.splice(idx, 1);

        const new_json = {
            ...currentRuleJson,
            match: updatedConditions,
        };

        setCurrentRuleJson(new_json);
        // setCurrentRuleYaml handled by store
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2 w-full justify-between">
                    <CardTitle>Conditions</CardTitle>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addCondition()}
                    >
                        + Condition
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {(currentRuleJson?.match || []).map((condition, idx) => {
                    const selectedProp = available_fields.find(p => p.field === condition.field);
                    const hasOptions = selectedProp?.options?.length > 0;
                    const isDate = selectedProp?.type === 'date';
                    const isBoolean = hasOptions && selectedProp.options.every(o => typeof o === 'boolean');
                    const totalConditions = (currentRuleJson?.match || []).length;

                    return (
                        <div
                            key={idx}
                            className="flex items-center gap-3 group"
                        >
                            {idx > 0 && (
                                <span className="text-[11px] font-medium text-muted-foreground w-7 text-right shrink-0">
                                    AND
                                </span>
                            )}
                            <div className={`w-1/3 min-w-[200px] ${(idx === 0 && totalConditions > 1) ? 'ml-[40px]' : ''}`}>
                                <Select
                                    searchPlaceholder="Search available fields"
                                    value={condition.field}
                                    options={keys}
                                    onChange={(val) =>
                                        updateCondition(idx, {
                                            key: "field",
                                            value: val.value
                                        })}
                                />
                            </div>

                            <div className="w-[120px]">
                                <Select
                                    searchPlaceholder="Operator"
                                    value={condition.operator}
                                    options={operators}
                                    onChange={(val) =>
                                        updateCondition(idx, {
                                            key: "operator",
                                            value: val.value
                                        })}
                                />
                            </div>

                            <div className="flex-1">
                                {hasOptions ? (
                                    <Select
                                        searchPlaceholder="Search available values"
                                        value={condition.value !== undefined ? String(condition.value) : ''}
                                        options={selectedProp.options.map(opt => ({
                                            label: String(opt),
                                            value: String(opt)
                                        }))}
                                        onChange={(val) => {
                                            let finalValue = val.value;
                                            if (isBoolean) {
                                                finalValue = val.value === 'true';
                                            }
                                            updateCondition(idx, {
                                                key: "value",
                                                value: finalValue
                                            })
                                        }}
                                    />
                                ) : isDate ? (
                                    <DatePicker
                                        value={condition.value ? new Date(condition.value) : undefined}
                                        onChange={(date) =>
                                            updateCondition(idx, {
                                                key: "value",
                                                value: date ? date.toISOString() : ''
                                            })}
                                    />
                                ) : (
                                    <Input
                                        type="text"
                                        value={condition.value}
                                        onChange={(e) =>
                                            updateCondition(idx, {
                                                key: "value",
                                                value: e.target.value
                                            })}
                                    />
                                )}
                            </div>

                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deleteCondition(idx)}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    )
}