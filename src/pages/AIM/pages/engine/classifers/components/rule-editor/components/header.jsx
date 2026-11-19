import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Edit, Save } from "lucide-react";
import { YamlPreview } from "./yaml-preview";

export function Header({ isCreatingRule, isUpdatingRule, handleSave = () => { }, handleUpdateRule = () => { } }) {

    const navigate = useNavigate();
    const url = new URL(window.location.href);
    const policyId = url.searchParams.get("policyId");

    return (
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
            <div className="flex items-center gap-3">
                <YamlPreview
                  trigger={
                    <Button variant="outline">
                        <Code className="w-4 h-4 mr-2" />
                        Preview YAML
                    </Button>
                  }
                />
                <Button
                    onClick={policyId ? handleUpdateRule : handleSave}
                    disabled={isCreatingRule || isUpdatingRule}
                >
                    {policyId ? <Edit className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {policyId ? "Update" : "Save"} Rule
                </Button>
            </div>
        </div>
    )
}