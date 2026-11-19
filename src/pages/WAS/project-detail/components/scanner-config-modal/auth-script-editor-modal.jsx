import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Editor from "@/components/custom/Editor";
import { useGetProjectAuthScriptQuery, useUpdateProjectAuthScriptMutation } from "@/services/apisec/projectsApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthScriptEditorModal({ open, onOpenChange, projectId }) {
    const [scriptContent, setScriptContent] = useState("");
    const { data: authScriptData, isLoading: isFetching, refetch } = useGetProjectAuthScriptQuery(projectId, {
        skip: !open || !projectId
    });
    const [updateAuthScript, { isLoading: isUpdating }] = useUpdateProjectAuthScriptMutation();

    useEffect(() => {
        if (open && authScriptData?.data?.content) {
            const content = authScriptData.data.content;
            // Wrap in a JS code block if it's not already wrapped
            if (!content.trim().startsWith("```")) {
                setScriptContent(`\`\`\`javascript\n${content}\n\`\`\``);
            } else {
                setScriptContent(content);
            }
        }
    }, [open, authScriptData]);

    const handleSave = async () => {
        try {
            // Unwrap the code block before saving to Send only the raw JS back to the API
            let rawContent = scriptContent;
            const match = scriptContent.match(/^```(?:javascript|js)?\n([\s\S]*?)\n```$/i);
            if (match) {
                rawContent = match[1];
            } else {
                // fallback: just strip the markers if match fails for some reason
                rawContent = scriptContent.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
            }

            await updateAuthScript({
                projectId,
                payload: { content: rawContent.trim() }
            }).unwrap();
            toast.success("Authentication script updated successfully");
            onOpenChange(false);
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update authentication script");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold">Edit Authentication Script</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-auto px-6 pb-6">
                    {isFetching ? (
                        <div className="space-y-4">
                            <Skeleton className="h-[400px] w-full" />
                        </div>
                    ) : (
                        <div className="border rounded-md min-h-[500px] bg-background">
                            <Editor
                                defaultValue={scriptContent}
                                onChange={setScriptContent}
                                className="h-full"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 pt-2 bg-muted/20 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={isUpdating || isFetching}
                    >
                        {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
