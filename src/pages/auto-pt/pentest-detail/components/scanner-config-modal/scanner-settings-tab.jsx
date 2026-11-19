import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileCode, Shield, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import Select from "@/components/custom/select";
import { FileUpload } from "@/components/custom/file-upload";
import { useGetOrgMembersQuery } from "@/services/auth/orgApi";
import { useUploadProjectAuthScriptMutation } from "@/services/apisec/projectsApi";
import { formatFileSize } from "@/lib/helpers";

function ScannerSettingsTab({ formData, setFormData, projectId }) {
    const [search, setSearch] = useState("");
    const [memberOptions, setMemberOptions] = useState([]);
    const [showFileUpload, setShowFileUpload] = useState(!formData.authScript);

    const { data: orgMembers, isFetching } = useGetOrgMembersQuery({ search });
    const [uploadAuthScript, { isLoading: isUploading }] = useUploadProjectAuthScriptMutation();

    useEffect(() => {
        if (orgMembers?.data?.members) {
            const formatted = orgMembers.data.members.map((m) => ({
                id: m.userId,
                label: m.name || m.email,
                value: { id: m.userId, name: m.name, email: m.email },
            }));
            setMemberOptions(formatted);
        }
    }, [orgMembers]);

    useEffect(() => {
        setShowFileUpload(!formData.authScript);
    }, [formData.authScript]);

    const handleOwnerChange = (val) => {
        setFormData({
            ...formData,
            owner: val ? {
                userId: val.id,
                name: val.value?.name,
                email: val.value?.email
            } : null
        });
    };

    const handleFileUpload = async (files) => {
        if (!files?.length) return;
        const file = files[0];
        if (!file.name.endsWith('.js')) {
            toast.error('Please upload a .js file');
            return;
        }

        try {
            const response = await uploadAuthScript({ file, projectId }).unwrap();
            setFormData({
                ...formData,
                authScript: response.data // Assuming API returns the script object
            });
            setShowFileUpload(false);
            toast.success('Authentication script uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload authentication script');
        }
    };

    return (
        <div className="flex flex-col gap-6 py-2">
            {/* Application Owner */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground tracking-wider">
                    <User className="w-3 h-3" />
                    Application Owner
                </div>
                <Select
                    placeholder="Select Owner"
                    options={memberOptions}
                    value={formData.owner?.userId}
                    onChange={handleOwnerChange}
                    onSearchChange={setSearch}
                    isSearching={isFetching}
                />
            </div>

            {/* Playwright Script */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground tracking-wider">
                    <FileCode className="w-3 h-3" />
                    Playwright Script
                </div>

                {showFileUpload ? (
                    <FileUpload
                        onFilesChange={handleFileUpload}
                        disabled={isUploading}
                        variant="compact"
                    />
                ) : (
                    <div className="flex items-center gap-4 p-3 border rounded-lg bg-muted/30">
                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary">
                            <FileCode className="w-5 h-5" />
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="font-medium text-sm truncate">
                                {formData.authScript?.original_name || "Script uploaded"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formData.authScript?.file_size ? formatFileSize(formData.authScript.file_size) : "Ready for scan"}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFileUpload(true)}
                            className="text-primary hover:text-primary/80"
                        >
                            Change
                        </Button>
                    </div>
                )}
            </div>

            {/* Is In Tab Scanner Settings */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5 border-primary/20">
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 font-medium text-sm">
                        <Shield className="w-4 h-4 text-primary" />
                        Scanner Settings Tab
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Toggle visibility in the main scanner settings tab
                    </p>
                </div>
                <Switch
                    checked={formData.isInScannerTab}
                    onCheckedChange={(val) => setFormData({ ...formData, isInScannerTab: val })}
                />
            </div>
        </div>
    );
}

export default ScannerSettingsTab;
