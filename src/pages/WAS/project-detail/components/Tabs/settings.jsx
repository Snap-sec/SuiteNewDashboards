import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon, Clock, Save, Loader2, Link2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useConfigureApisecProjectMutation,
    useUpdateApisecProjectScanSettingsMutation
} from "@/services/apisec/projectsApi";

import ConfigurationTab from "../scanner-config-modal/configuration-tab";
import ScheduleTab from "../scanner-config-modal/schedule-tab";
import useScannerStore from "../scanner-config-modal/scanner-store";

function ProjectSettings({ projectData, isLoading }) {
    const {
        scanTarget,
        formData,
        projectId,
        initFromProject
    } = useScannerStore();

    // Track which section is currently being saved to show isolated loading states
    const [savingStates, setSavingStates] = useState({
        config: false,
        schedule: false,
        integration: false
    });

    const [savedProjectRef, setSavedProjectRef] = useState(null);
    const [initCounter, setInitCounter] = useState(0);

    // Initialize store from project data if the project has changed or not yet set
    useEffect(() => {
        if (projectData && projectData._id !== projectId) {
            initFromProject(projectData);
            setInitCounter(prev => prev + 1);
        }
    }, [projectData, projectId, initFromProject]);

    useEffect(() => {
        if (savedProjectRef && projectData !== savedProjectRef) {
            initFromProject(projectData);
            setInitCounter(prev => prev + 1);
            setSavedProjectRef(null);
        }
    }, [projectData, savedProjectRef, initFromProject]);

    const [configureProject] = useConfigureApisecProjectMutation();
    const [updateScanSettings] = useUpdateApisecProjectScanSettingsMutation();

    const mapFrequencyToApi = (freq) => {
        if (freq === 'one-time') return 'once';
        return freq;
    };

    const handleSave = async (section) => {
        setSavingStates(prev => ({ ...prev, [section]: true }));
        try {
            const configPayload = {
                scan_method: scanTarget,
                test_sync: "confirmed",
                target_url: formData.targetUrl,
                application_name: formData.applicationName,
                tags: formData.tagsArray,
                scope: formData.inScopeUrls.filter(url => url.trim() !== "").map(url => ({ type: "url", value: url })),
                exclude_scope: formData.exclusionPatterns.filter(p => p.trim() !== "").map(p => ({ type: "regex", value: p })),
                collection_uids: formData.apiCollection || [],
                environment_id: formData.environment,
                success_criteria: formData.successCriteria,
                auth_profile_id: formData.scanProfile,
                manual_ingestion_enabled: formData.manual_ingestion_enabled,
            };

            const settingsPayload = {
                frequency: mapFrequencyToApi(formData.frequency),
                auto_sync: formData.autoSync,
                time: formData.scanTime?.toISOString(),
                assessmentId: formData.linkedAssessment,
                notifications: formData.notifications,
                auth_profile_id: formData.scanProfile,
                ...(formData.frequency === 'weekly' && formData.dayOfWeek && { weekday: parseInt(formData.dayOfWeek) }),
                ...(formData.frequency === 'monthly' && formData.dayOfMonth && { day_of_month: parseInt(formData.dayOfMonth) }),
            };

            await Promise.all([
                configureProject({ projectId, payload: configPayload }).unwrap(),
                updateScanSettings({ projectId, payload: settingsPayload }).unwrap()
            ]);

            setSavedProjectRef(projectData);
            toast.success('Settings updated successfully');
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update settings');
        } finally {
            setSavingStates(prev => ({ ...prev, [section]: false }));
        }
    };

    const savingSection = ""

    if (isLoading) {
        return (
            <div className="flex flex-col gap-8 pb-10 animate-pulse">
                {/* Configuration Card Skeleton */}
                <Card>
                    <CardHeader className="border-b border-border/60">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-5 h-5 rounded" />
                            <div className="flex flex-col gap-1.5">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-3.5 w-80" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 flex flex-col gap-6">
                        {/* Scripts section skeleton */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Skeleton className="h-3.5 w-32" />
                                <Skeleton className="h-12 w-full rounded-md" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Skeleton className="h-3.5 w-44" />
                                <Skeleton className="h-12 w-full rounded-md" />
                            </div>
                        </div>

                        {/* Crawl Target Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-background px-3">
                                    <Skeleton className="h-4 w-28 rounded" />
                                </span>
                            </div>
                        </div>

                        {/* Target URL */}
                        <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-3.5 w-24" />
                            <Skeleton className="h-9 w-full rounded-md" />
                        </div>

                        {/* In-Scope URLs */}
                        <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-3.5 w-28" />
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <Skeleton className="h-9 flex-1 rounded-md" />
                                    <Skeleton className="h-9 w-9 rounded-md" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <Skeleton className="h-9 w-32 rounded-md" />
                        </div>
                    </CardContent>
                </Card>

                {/* Schedule Card Skeleton */}
                <Card>
                    <CardHeader className="border-b border-border/60">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-5 h-5 rounded" />
                            <div className="flex flex-col gap-1.5">
                                <Skeleton className="h-5 w-36" />
                                <Skeleton className="h-3.5 w-72" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 flex flex-col gap-6">
                        {/* Scan Frequency Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-background px-3">
                                    <Skeleton className="h-4 w-32 rounded" />
                                </span>
                            </div>
                        </div>

                        {/* Frequency buttons skeleton */}
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3.5 w-28" />
                            <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="h-16 rounded-lg" />
                                ))}
                            </div>
                        </div>

                        {/* Vuln Sync Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-background px-3">
                                    <Skeleton className="h-4 w-60 rounded" />
                                </span>
                            </div>
                        </div>

                        {/* Switch block skeleton */}
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/10">
                            <div className="flex flex-col gap-1.5">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-3 w-80" />
                            </div>
                            <Skeleton className="h-6 w-11 rounded-full" />
                        </div>

                        <div className="flex justify-end mt-6">
                            <Skeleton className="h-9 w-32 rounded-md" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Configuration Card */}
            <Card>
                <CardHeader className="border-b border-border/60">
                    <div className="flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5 text-primary" />
                        <div>
                            <CardTitle>Scanner Configuration</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <ConfigurationTab key={initCounter} isTabContent={false} />
                    <div className="flex justify-end mt-6">
                        <Button
                            variant="primary"
                            onClick={() => handleSave('config')}
                            disabled={savingSection === 'config'}
                            className="gap-2"
                        >
                            {savingStates.config ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="w-4 h-4" /> Save Changes</>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Schedule Card */}
            <Card>
                <CardHeader className="border-b border-border/60">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <div>
                            <CardTitle>Scan Schedule</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <ScheduleTab isTabContent={false} hideIntegration={true} />
                    <div className="flex justify-end mt-6">
                        <Button
                            variant="primary"
                            onClick={() => handleSave('schedule')}
                            disabled={savingSection === 'schedule'}
                            className="gap-2"
                        >
                            {savingStates.schedule ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="w-4 h-4" /> Save Changes</>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Integration Card */}
            <Card>
                <CardHeader className="border-b border-border/60">
                    <div className="flex items-center gap-2">
                        <Link2 className="w-5 h-5 text-primary" />
                        <div>
                            <CardTitle>Vulnerability Reporting Synchronization</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <ScheduleTab isTabContent={false} onlyIntegration={true} />
                    <div className="flex justify-end mt-6">
                        <Button
                            variant="primary"
                            onClick={() => handleSave('integration')}
                            disabled={savingSection === 'integration'}
                            className="gap-2"
                        >
                            {savingStates.integration ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="w-4 h-4" /> Save Changes</>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ProjectSettings;
