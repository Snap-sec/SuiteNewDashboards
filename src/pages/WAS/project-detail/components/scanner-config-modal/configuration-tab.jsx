import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from "@/components/custom/select";
import MultiSelect from "@/components/custom/multi-select";
import { Plus, Globe, FileCode, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetApisecScanProfileQuery } from "@/services/apisec/scan-profile";
import { useGetOrgMembersQuery } from "@/services/auth/orgApi";
import { useUploadProjectAuthScriptMutation, useUploadProjectAuthScript2Mutation, useTestProjectAuthScriptMutation } from "@/services/apisec/projectsApi";
import { formatFileSize } from "@/lib/helpers";
import { useGetApisecEnvironmentsQuery, useGetApisecEnvironmentCollectionsQuery } from "@/services/apisec/environmentApi";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import useScannerStore from "./scanner-store";
import { AuthScriptEditorModal } from "./auth-script-editor-modal";
import { ScanSearch, FastForward, Brain, Webhook } from "lucide-react";
import { configurationSchema } from "./schemas/configuration-schema";
import appConfig from "@/config/appConfig";
import { useAuth } from "@/auth/context/auth-context";
import InputWithCopy from "@/components/custom/input-with-copy";
import { Switch } from "@/components/ui/switch";

function ConfigurationTab({ isTabContent = true }) {
    const { formData, setFormData, scanTarget, setScanTarget, projectId } = useScannerStore();
    const { user } = useAuth();

    const [search, setSearch] = useState("");
    const [memberOptions, setMemberOptions] = useState([]);
    const [showFileUpload, setShowFileUpload] = useState(!formData.authScript);
    const [testStatus, setTestStatus] = useState(null); // 'success' | 'failed' | null
    const [testMessage, setTestMessage] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);

    const [showFileUpload2, setShowFileUpload2] = useState(!formData.authScript2);
    const [testStatus2, setTestStatus2] = useState(null); // 'success' | 'failed' | null
    const [testMessage2, setTestMessage2] = useState("");

    const { data: orgMembers, isFetching: isMembersFetching } = useGetOrgMembersQuery({ search });
    const [uploadAuthScript, { isLoading: isUploadingScript }] = useUploadProjectAuthScriptMutation();
    const [uploadAuthScript2, { isLoading: isUploadingScript2 }] = useUploadProjectAuthScript2Mutation();
    const [testAuthScript, { isLoading: isTestingScript }] = useTestProjectAuthScriptMutation();
    const [testAuthScript2, { isLoading: isTestingScript2 }] = useTestProjectAuthScriptMutation();

    const form = useForm({
        resolver: zodResolver(configurationSchema),
        mode: "onChange",
        defaultValues: {
            targetUrl: formData.targetUrl || "",
            inScopeUrls: (formData.inScopeUrls && formData.inScopeUrls.length > 0) ? formData.inScopeUrls : [""],
            exclusionPatterns: (formData.exclusionPatterns && formData.exclusionPatterns.length > 0) ? formData.exclusionPatterns : [""],
            scanProfile: formData.scanProfile || null,
        },
    });

    const { fields: scopeFields, append: appendScope, remove: removeScope } = useFieldArray({
        control: form.control,
        name: "inScopeUrls"
    });

    const { fields: exclusionFields, append: appendExclusion, remove: removeExclusion } = useFieldArray({
        control: form.control,
        name: "exclusionPatterns"
    });

    // Sync form changes to store
    const formValues = form.watch();
    useEffect(() => {
        const formInScope = formValues.inScopeUrls || [];
        const formExclude = formValues.exclusionPatterns || [];
        const storeInScope = formData.inScopeUrls || [];
        const storeExclude = formData.exclusionPatterns || [];

        // Only update if store values are different
        const hasFormChanges =
            formValues.targetUrl !== formData.targetUrl ||
            formValues.scanProfile !== formData.scanProfile ||
            JSON.stringify(formInScope) !== JSON.stringify(storeInScope) ||
            JSON.stringify(formExclude) !== JSON.stringify(storeExclude);

        if (hasFormChanges) {
            setFormData({
                targetUrl: formValues.targetUrl,
                inScopeUrls: formValues.inScopeUrls,
                exclusionPatterns: formValues.exclusionPatterns,
                scanProfile: formValues.scanProfile,
            });
        }
    }, [formValues, formData, setFormData]);

    useEffect(() => {
        setShowFileUpload(!formData.authScript);
    }, [formData.authScript]);

    useEffect(() => {
        setShowFileUpload2(!formData.authScript2);
    }, [formData.authScript2]);

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

    const handleFileUpload = async (files) => {
        if (!files?.length) return;
        const file = files[0];
        if (!file.name.endsWith('.js')) {
            toast.error('Please upload a .js file');
            return;
        }

        toast.promise(uploadAuthScript({ file, projectId }).unwrap(), {
            loading: 'Uploading Authentication script...',
            success: (response) => {
                setFormData({
                    authScript: response.data
                });
                setShowFileUpload(false);
                setTestStatus(null);
                setTestMessage("");
                return 'Authentication script uploaded successfully';
            },
            error: 'Failed to upload authentication script'
        });
    };

    const handleFileUpload2 = async (files) => {
        if (!files?.length) return;
        const file = files[0];
        if (!file.name.endsWith('.js')) {
            toast.error('Please upload a .js file');
            return;
        }

        toast.promise(uploadAuthScript2({ file, projectId }).unwrap(), {
            loading: 'Uploading second Authentication script...',
            success: (response) => {
                setFormData({
                    authScript2: response.data
                });
                setShowFileUpload2(false);
                setTestStatus2(null);
                setTestMessage2("");
                return 'Second authentication script uploaded successfully';
            },
            error: 'Failed to upload second authentication script'
        });
    };

    const handleTestScript = async () => {
        try {
            const response = await testAuthScript({ projectId, id: "1" }).unwrap();
            setTestMessage(response.message || "");
            if (response.success) {
                setTestStatus('success');
                toast.success('Script test successful');
            } else {
                setTestStatus('failed');
                toast.error('Script test failed');
            }
        } catch (error) {
            setTestStatus('failed');
            setTestMessage(error?.data?.message || "Failed to test script");
            toast.error('Failed to test script');
        }
    };

    const handleTestScript2 = async () => {
        try {
            const response = await testAuthScript2({ projectId, id: "2" }).unwrap();
            setTestMessage2(response.message || "");
            if (response.success) {
                setTestStatus2('success');
                toast.success('Script 2 test successful');
            } else {
                setTestStatus2('failed');
                toast.error('Script 2 test failed');
            }
        } catch (error) {
            setTestStatus2('failed');
            setTestMessage2(error?.data?.message || "Failed to test script 2");
            toast.error('Failed to test script 2');
        }
    };

    // Fetch scan profiles from API
    const { data: scanProfiles, isLoading: profilesLoading } = useGetApisecScanProfileQuery();

    const scanProfileOptions = scanProfiles?.data?.map((profile) => ({
        label: profile.name,
        value: profile._id,
    })) || [];

    // Fetch environments and collections
    const { data: environments, isLoading: environmentsLoading } = useGetApisecEnvironmentsQuery();
    const { data: collections, isLoading: collectionsLoading } = useGetApisecEnvironmentCollectionsQuery("");


    const content = (
        <div className="flex flex-col gap-6">
            {/* Scan Target */}
            <div className="flex flex-col gap-3">
                <label className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
                    Scan Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={() => setScanTarget("aggressive")}
                        className={cn(
                            "relative flex items-center gap-3 p-4 rounded-lg border transition-all",
                            scanTarget === "aggressive"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-muted-foreground/50"
                        )}
                    >
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0",
                            scanTarget === "aggressive" ? "bg-primary" : "bg-muted"
                        )}>
                            <ScanSearch className={cn("w-5 h-5", scanTarget === "aggressive" ? "text-primary-foreground" : "text-muted-foreground")} />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-sm">Aggressive</p>
                            <p className="text-xs text-muted-foreground">In depth scanning of the application</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setScanTarget("quick")}
                        className={cn(
                            "relative flex items-center gap-3 p-4 rounded-lg border transition-all",
                            scanTarget === "quick"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-muted-foreground/50"
                        )}
                    >
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0",
                            scanTarget === "quick" ? "bg-primary" : "bg-muted"
                        )}>
                            <FastForward className={cn("w-5 h-5", scanTarget === "quick" ? "text-primary-foreground" : "text-muted-foreground")} />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-sm">Quick</p>
                            <p className="text-xs text-muted-foreground">Quickly scan an application for vulnerabilities</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setScanTarget("manual")}
                        className={cn(
                            "relative flex items-center gap-3 p-4 rounded-lg border transition-all",
                            scanTarget === "manual"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-muted-foreground/50"
                        )}
                    >
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0",
                            scanTarget === "manual" ? "bg-primary" : "bg-muted"
                        )}>
                            <Webhook className={cn("w-5 h-5", scanTarget === "manual" ? "text-primary-foreground" : "text-muted-foreground")} />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-sm">Manual</p>
                            <p className="text-xs text-muted-foreground">Forward traffic to a webhook for manual scanning</p>
                        </div>
                    </button>
                </div>

                {scanTarget === "manual" && (
                    <div className="flex flex-col gap-2.5 p-4 rounded-lg border border-border bg-muted/20 mt-1 transition-all animate-fade-in">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Webhook className="w-4 h-4 text-primary" />
                                <span>Webhook URL</span>
                            </div>
                            <a
                                href="https://github.com/Snap-sec/reqMapper/archive/refs/heads/main.zip"
                                className="text-primary text-xs hover:underline font-medium"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Download Extension
                            </a>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Configure your browser or proxy to forward HTTP/S traffic to this webhook URL to feed the scanner.
                        </p>
                        <InputWithCopy
                            value={`${appConfig.BASE_URL}/apisec/api/v1/projects/${projectId}/browser-requests/${user?.orgId}`}
                            className="w-full mt-1"
                            toastMsg="Webhook URL copied successfully!"
                        />

                        <div className="border-t border-border/60 my-2 pt-3 flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-semibold">Ingest Traffic</span>
                                <span className="text-[11px] text-muted-foreground">
                                    Enable this to allow ingestion of proxy/webhook requests
                                </span>
                            </div>
                            <Switch
                                checked={formData.manual_ingestion_enabled || false}
                                onCheckedChange={(checked) => setFormData({ manual_ingestion_enabled: checked })}
                            />
                        </div>
                    </div>
                )}
            </div>

            <Form {...form}>
                <div className="flex flex-col gap-6">
                    {/* Divider with label */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-background px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                Authentication
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3.5 -mt-2">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-medium text-muted-foreground">Auth Type</span>
                            <Select
                                options={[
                                    { label: "Cookie", value: "cookie" },
                                    { label: "Bearer Token", value: "bearer_token" }
                                ]}
                                value={formData.auth_type}
                                onChange={(opt) => setFormData({ auth_type: opt?.value || null })}
                                placeholder="Select authentication type..."
                                enableSearch={false}
                            />
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <label className="text-sm flex items-center gap-1.5 font-medium">
                                <FileCode className="w-3.5 h-3.5 text-primary" />
                                Authentication Scripts
                            </label>
                            <a
                                // href="https://suite.snapsec.co/sample/download/authenticate.js"
                                href="https://docs.snapsec.co/products/was/applications#configuration"
                                className="text-primary text-[10px] hover:underline flex items-center gap-1"
                                target="_blank"
                                rel="noreferrer"
                            >
                            Read documentation
                            </a>
                        </div>

                        {/* First Script upload */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-medium text-muted-foreground">Primary Script</span>
                            {showFileUpload ? (
                                <div className="border border-dashed rounded-md p-1">
                                    <input
                                        type="file"
                                        accept=".js"
                                        className="hidden"
                                        id="playwright-upload"
                                        onChange={(e) => handleFileUpload(e.target.files)}
                                    />
                                    <label
                                        htmlFor="playwright-upload"
                                        className="flex items-center justify-center gap-2 h-12 cursor-pointer hover:bg-muted/50 transition-colors text-sm text-muted-foreground"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Upload .js script
                                    </label>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-2.5 border rounded-md bg-muted/40 group">
                                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-primary">
                                        <FileCode className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium truncate">
                                                {formData.authScript?.original_name || "Script uploaded"}
                                            </p>
                                            {testStatus === 'success' && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium border border-emerald-500/20">
                                                    Test Success
                                                </span>
                                            )}
                                            {testStatus === 'failed' && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium border border-destructive/20">
                                                    Test Failed
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">
                                            {formData.authScript?.file_size ? formatFileSize(formData.authScript.file_size) : "Ready for scan"}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleTestScript}
                                        disabled={isTestingScript}
                                        className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/5 ml-auto"
                                    >
                                        {isTestingScript ? 'Testing...' : 'Test Script'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowEditModal(true)}
                                        className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/5"
                                    >
                                        Edit Script
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setShowFileUpload(true);
                                            setTestStatus(null);
                                            setTestMessage("");
                                        }}
                                        className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/5"
                                    >
                                        Change
                                    </Button>
                                </div>
                            )}

                            {/* Show message here  */}
                            {testMessage && (
                                <p className={cn(
                                    "text-[11px] font-medium mt-1.5 px-2 py-1 rounded border",
                                    testStatus === 'success'
                                        ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10"
                                        : "text-destructive bg-destructive/5 border-destructive/10"
                                )}>
                                    {testMessage}
                                </p>
                            )}
                        </div>

                        {/* Second Script upload */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-medium text-muted-foreground">Secondary Script (Optional)</span>
                            {showFileUpload2 ? (
                                <div className="border border-dashed rounded-md p-1">
                                    <input
                                        type="file"
                                        accept=".js"
                                        className="hidden"
                                        id="playwright-upload2"
                                        onChange={(e) => handleFileUpload2(e.target.files)}
                                    />
                                    <label
                                        htmlFor="playwright-upload2"
                                        className="flex items-center justify-center gap-2 h-12 cursor-pointer hover:bg-muted/50 transition-colors text-sm text-muted-foreground"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Upload second .js script
                                    </label>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-2.5 border rounded-md bg-muted/40 group">
                                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-primary">
                                        <FileCode className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium truncate">
                                                {formData.authScript2?.original_name || "Script uploaded"}
                                            </p>
                                            {testStatus2 === 'success' && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium border border-emerald-500/20">
                                                    Test Success
                                                </span>
                                            )}
                                            {testStatus2 === 'failed' && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium border border-destructive/20">
                                                    Test Failed
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">
                                            {formData.authScript2?.file_size ? formatFileSize(formData.authScript2.file_size) : "Ready for scan"}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleTestScript2}
                                        disabled={isTestingScript2}
                                        className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/5 ml-auto"
                                    >
                                        {isTestingScript2 ? 'Testing...' : 'Test Script'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setShowFileUpload2(true);
                                            setTestStatus2(null);
                                            setTestMessage2("");
                                        }}
                                        className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/5"
                                    >
                                        Change
                                    </Button>
                                </div>
                            )}

                            {/* Show message here  */}
                            {testMessage2 && (
                                <p className={cn(
                                    "text-[11px] font-medium mt-1.5 px-2 py-1 rounded border",
                                    testStatus2 === 'success'
                                        ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10"
                                        : "text-destructive bg-destructive/5 border-destructive/10"
                                )}>
                                    {testMessage2}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Divider with label */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-background px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {"Crawl Target"}
                            </span>
                        </div>
                    </div>

                    {/* Web Application Fields */}
                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                            control={form.control}
                            name="targetUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target URL <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="https://example.com"
                                            className="h-9"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* In-Scope URLs */}
                    <div className="flex flex-col gap-1.5">
                        <FormLabel>In-Scope URLs</FormLabel>
                        <div className="flex flex-col gap-2">
                            {scopeFields.map((field, index) => (
                                <div key={field.id} className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <FormField
                                                control={form.control}
                                                name={`inScopeUrls.${index}`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="https://..."
                                                                className="h-9"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        {scopeFields.length > 1 && (
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeScope(index)}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                        {index === scopeFields.length - 1 && (
                                            <Button type="button" className=" rounded-lg" variant="outline" size="icon" onClick={() => appendScope("")}>
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {scopeFields.length === 0 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 border-dashed h-9"
                                    onClick={() => appendScope("")}
                                >
                                    <Plus className="w-4 h-4" />
                                    Add URL
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Exclusion Patterns */}
                    <div className="flex flex-col gap-1.5">
                        <FormLabel>Exclusion Patterns</FormLabel>
                        <div className="flex flex-col gap-2">
                            {exclusionFields.map((field, index) => (
                                <div key={field.id} className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <FormField
                                                control={form.control}
                                                name={`exclusionPatterns.${index}`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="regex pattern..."
                                                                className="h-9"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        {exclusionFields.length > 1 && (
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeExclusion(index)}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                        {index === exclusionFields.length - 1 && (
                                            <Button type="button" className=" rounded-lg" variant="outline" size="icon" onClick={() => appendExclusion("")}>
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {exclusionFields.length === 0 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 border-dashed h-9"
                                    onClick={() => appendExclusion("")}
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Pattern
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-background px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                Scan Profile
                            </span>
                        </div>
                    </div>

                    {/* Scan Profile */}
                    <div className="flex flex-col gap-1.5 pb-6">
                        <FormField
                            control={form.control}
                            name="scanProfile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Scan Profile</FormLabel>
                                    <FormControl>
                                        <Select
                                            options={scanProfileOptions}
                                            value={field.value}
                                            onChange={(opt) => field.onChange(opt?.value)}
                                            placeholder="Select a scan profile..."
                                            isLoading={profilesLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </Form>
        </div>
    );

    if (isTabContent) {
        return (
            <ScrollArea className="h-[468px] pr-3">
                {content}
            </ScrollArea>
        );
    }

    return (
        <>
            {content}
            <AuthScriptEditorModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                projectId={projectId}
            />
        </>
    );
}

export default ConfigurationTab;
