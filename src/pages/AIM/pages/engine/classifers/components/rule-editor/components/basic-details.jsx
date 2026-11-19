import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import YAML from 'yaml';

import useStore from '../store';


export function BasicDetailsForm() {

    const currentRuleJson = useStore((state) => state.currentRuleJson);

    const setCurrentRuleYaml = useStore((state) => state.setCurrentRuleYaml);
    const setCurrentRuleJson = useStore((state) => state.setCurrentRuleJson);


    const handleFieldChange = (event) => {
        const { name, value } = event.target;

        let updatedJson = { ...currentRuleJson, [name]: value };

        setCurrentRuleJson(updatedJson);
        // setCurrentRuleYaml handled by store
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Rule Configuration</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                    <Label className="mb-1.5 block">Rule Name <span className="text-red-500">*</span></Label>
                    <Input
                        name="name"
                        type="text"
                        placeholder="Rule Name"
                        value={currentRuleJson.name}
                        onChange={handleFieldChange}
                    />
                </div>
                <div className="col-span-2">
                    <Label className="mb-1.5 block">Description <span className="text-red-500">*</span></Label>
                    <Input
                        name="description"
                        type="text"
                        value={currentRuleJson.description}
                        onChange={handleFieldChange}
                        placeholder="Optional description"
                    />
                </div>
            </CardContent>
        </Card>
    )
}