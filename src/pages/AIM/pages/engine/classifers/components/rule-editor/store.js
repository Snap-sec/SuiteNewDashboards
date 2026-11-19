import { create } from 'zustand';
import YAML from 'yaml';

export function generateYamlFromJson(json) {
    if (!json) return '';
    const yamlObj = {
        name: json.name || '',
        description: json.description || '',
        enabled: true,
    };

    if (json.match && json.match.length > 0) {
        yamlObj.match = {
            and: {
                conditions: json.match.map(cond => ({
                    field: cond.field,
                    operator: cond.operator,
                    value: cond.value
                }))
            }
        };
    }

    yamlObj.actions = json.actions || [];

    return YAML.stringify(yamlObj);
}


const useStore = create((set) => ({
    yamlPreview: '',
    currentRuleYaml: '',
    currentRuleJson: { type: "classifier", name: "", description: "", match: [], actions: [] },
    isEditingRule: false,

    setCurrentRuleYaml: (yaml) => set({ currentRuleYaml: yaml }),
    setCurrentRuleJson: (json) => set({
        currentRuleJson: json,
        currentRuleYaml: generateYamlFromJson(json)
    }),
    setIsEditingRule: (state) => set({ isEditingRule: state }),
    setYamlPreview: (yaml) => set({ yamlPreview: yaml }),
}));


export default useStore;