import { Button } from '@/components/ui/button';
import { Edit, Save, Code } from 'lucide-react';

import useStore from '../store';


export function Footer({ isCreatingRule, isUpdatingRule, handleSave = () => { }, handleUpdateRule = () => { }, showYaml, setShowYaml }) {

    const url = new URL(window.location.href);
    const policyId = url.searchParams.get("policyId");

    const isEditingRule = useStore((state) => state.isEditingRule);


    const isRuleBeingCreated = isCreatingRule && !isEditingRule;
    const isRuleBeingUpdated = isUpdatingRule && isEditingRule;

    let ButtonText = "";

    if (isRuleBeingCreated) ButtonText = 'Saving...';
    if (isRuleBeingUpdated) ButtonText = 'Updating...';
    if (!isRuleBeingCreated && !isRuleBeingUpdated) ButtonText = 'Save Rule';


    return (
        <div className="flex w-full justify-end items-center gap-3 bg-card p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setShowYaml(!showYaml)}>
                    <Code className="w-4 h-4 mr-2" />
                    Preview YAML
                </Button>
            </div>
            <Button
                onClick={policyId ? handleUpdateRule : handleSave}
                disabled={isCreatingRule || isUpdatingRule}
            >
                {policyId && <Edit className="w-4 h-4 mr-2" />}
                {!policyId && <Save className="w-4 h-4 mr-2" />}

                {policyId ? "Update" : "Save"} Rule
            </Button>
        </div>
    )
}