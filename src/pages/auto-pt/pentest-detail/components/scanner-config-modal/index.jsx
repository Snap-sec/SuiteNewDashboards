import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Clock, TableOfContents } from "lucide-react";
import {
    useConfigureApisecProjectMutation,
    useUpdateApisecProjectScanSettingsMutation
} from "@/services/apisec/projectsApi";

import ConfigurationTab from "./configuration-tab";
import ScheduleTab from "./schedule-tab";
import RulesTab from "./rules-tab";
import useScannerStore from "./scanner-store";

function ScannerConfigurationModal({ open, onOpenChange, projectData }) {
    const {
        activeTab,
        setActiveTab,
        scanTarget,
        formData,
        projectId,
        initFromProject
    } = useScannerStore();

    const [savedProjectRef, setSavedProjectRef] = useState(null);
    const [initCounter, setInitCounter] = useState(0);
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        if (!open) {
            setHasInitialized(false);
            return;
        }

        if (open && projectData && !hasInitialized) {
            initFromProject(projectData);
            setInitCounter(prev => prev + 1);
            setHasInitialized(true);
        }
    }, [open, projectData, hasInitialized, initFromProject]);

    useEffect(() => {
        if (savedProjectRef && projectData !== savedProjectRef) {
            initFromProject(projectData);
            setInitCounter(prev => prev + 1);
            setSavedProjectRef(null);
        }
    }, [projectData, savedProjectRef, initFromProject]);

    const scannerType = scanTarget === "aggressive" ? "Aggressive" : scanTarget === "manual" ? "Manual" : "Quick";

    const [configureProject, { isLoading: isConfiguring }] = useConfigureApisecProjectMutation();
    const [updateScanSettings, { isLoading: isUpdatingSettings }] = useUpdateApisecProjectScanSettingsMutation();
    const isUpdating = isConfiguring || isUpdatingSettings;

    const isFormValid = useMemo(() => {
        if (scanTarget === "aggressive") {
            return !!formData.targetUrl?.trim();
        } else if (scanTarget === "manual") {
            return true;
        } else {
            return formData.apiCollection?.length > 0;
        }
    }, [formData, scanTarget]);

    // Map frequency from UI format back to API format
    const mapFrequencyToApi = (freq) => {
        if (freq === 'one-time') return 'once';
        return freq;
    };

    const handleSave = async (isDraft = false) => {
        try {
            // Build the configuration payload
            const configPayload = {
                scan_method: scanTarget,
                target_url: formData.targetUrl,
                application_name: formData.applicationName,
                tags: formData.tagsArray,
                scope: formData.inScopeUrls.filter(url => url.trim() !== "").map(url => ({ type: "url", value: url })),
                exclude_scope: formData.exclusionPatterns.filter(p => p.trim() !== "").map(p => ({ type: "regex", value: p })),
                collection_uids: formData.apiCollection || [],
                environment_id: formData.environment,
                auth_profile_id: formData.scanProfile,
                manual_ingestion_enabled: formData.manual_ingestion_enabled,
                auth_type: formData.auth_type,
            };

            // Build the scan settings payload
            const settingsPayload = {
                frequency: mapFrequencyToApi(formData.frequency),
                auto_sync: formData.autoSync,
                time: formData.scanTime?.toISOString(),
                assessmentId: formData.linkedAssessment === 'none' ? null : formData.linkedAssessment,
                notifications: formData.notifications,
                ...(formData.frequency === 'weekly' && formData.dayOfWeek && { weekday: parseInt(formData.dayOfWeek) }),
                ...(formData.frequency === 'monthly' && formData.dayOfMonth && { day_of_month: parseInt(formData.dayOfMonth) }),
            };

            // Execute updates
            await Promise.all([
                configureProject({ projectId, payload: configPayload }).unwrap(),
                updateScanSettings({ projectId, payload: settingsPayload }).unwrap()
            ]);

            setSavedProjectRef(projectData);
            toast.success(isDraft ? 'Draft saved successfully' : 'Configuration saved and deployed successfully');
            // onOpenChange(false);
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to save configuration');
            console.error('Error saving configuration:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[880px] max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-xl font-bold">Scanner Configuration</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                    <TabsList variant="line" size="sm" className="flex-shrink-0 w-full">
                        <TabsTrigger value="configuration">
                            <Settings className="w-3.5 h-3.5" />
                            Configuration
                        </TabsTrigger>
                        <TabsTrigger value="schedule">
                            <Clock className="w-3.5 h-3.5" />
                            Schedule
                        </TabsTrigger>
                        <TabsTrigger value="rules">
                            <TableOfContents className="w-3.5 h-3.5" />
                            Rules
                        </TabsTrigger>
                    </TabsList>

                    <ScrollArea className="flex-1 -mx-6 px-6">
                        <TabsContent value="configuration" className="mt-4 pb-4">
                            <ConfigurationTab key={initCounter} />
                        </TabsContent>

                        <TabsContent value="schedule" className="mt-4 pb-4">
                            <ScheduleTab />
                        </TabsContent>

                        <TabsContent value="rules" className="mt-4 pb-4">
                            <RulesTab />
                        </TabsContent>
                    </ScrollArea>
                </Tabs>

                <DialogFooter className="flex-shrink-0 flex justify-between sm:justify-between">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
                        Cancel
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            onClick={() => handleSave(false)}
                            disabled={isUpdating || !isFormValid}
                        >
                            {isUpdating ? 'Saving...' : 'Save & Deploy'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ScannerConfigurationModal;
