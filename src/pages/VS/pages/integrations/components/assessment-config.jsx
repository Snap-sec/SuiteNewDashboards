import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Select from "@/components/custom/select";
import { useGetVmAssessmentsQuery } from "../../../../../services/vm/assessmentsApi";
import { useGetVsConfigQuery, useUpdateVsConfigMutation } from "../../../../../services/vs/integrationApi";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Upload, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import MultiSelect from "@/components/custom/multi-select";


import { Switch } from "@/components/ui/switch";
import CreateAssessmentModel from "@/pages/VM/pages/assessment/components/Modal/create-assessment-model";
import { useAuth } from "@/auth/context/auth-context";
import ApiErrorHandler from "../../../../../components/common/api-error-handler";

function AssessmentConfig() {

    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState("");
    const [selectedSeverities, setSelectedSeverities] = useState([]);
    const [autoSync, setAutoSync] = useState(false);
    const [headers, setHeaders] = useState([{ name: '', value: '' }]);
    const [createAssessmentOpen, setCreateAssessmentOpen] = useState(false);
    const CREATE_ASSESSMENT_VALUE = '__create_assessment__';
    const { user } = useAuth();
    const isAuditor = user?.role === 'Auditor';

    const [updateConfig, { isLoading: isUpdating }] = useUpdateVsConfigMutation();

    const { data: config, isLoading: configLoading, isError, error } = useGetVsConfigQuery();
    const activeAssessmentId = selected || config?.assessmentId;
    const { data: assessments, isLoading: assessmentsLoading } = useGetVmAssessmentsQuery({
        search,
        limit: 20,
        ...(activeAssessmentId ? { includeIds: activeAssessmentId } : {}),
    });

    useEffect(() => {
        if (config?.autoSyncSeverities) {
            setSelectedSeverities(config.autoSyncSeverities);
        }
        if (config?.autoSync !== undefined) {
            setAutoSync(config.autoSync);
        }
        if (config?.customHeaders && config.customHeaders.length > 0) {
            setHeaders(config.customHeaders.map(h => ({ name: h.key, value: h.value })));
        } else {
            setHeaders([{ name: '', value: '' }]);
        }
    }, [config]);

    const handleUpdate = (overrides = {}) => {
        const severitiesSource = overrides.severities !== undefined ? overrides.severities : selectedSeverities;
        const severitiesToSave = severitiesSource.map(v => typeof v === 'string' ? v : v.id);

        const customHeaders = headers
            .filter((h) => h.name && h.value)
            .map((h) => ({ key: h.name, value: h.value }));

        const autoSyncValue = overrides.autoSync !== undefined ? overrides.autoSync : autoSync;
        const assessmentIdValue = overrides.assessmentId !== undefined ? overrides.assessmentId : (selected || config?.assessmentId);
        const finalAssessmentId = assessmentIdValue === 'none' ? null : assessmentIdValue;

        toast.promise(updateConfig({
            assessmentId: finalAssessmentId,
            autoSyncSeverities: severitiesToSave,
            autoSync: autoSyncValue,
            customHeaders
        }).unwrap(), {
            loading: "Updating config",
            success: "Config updated",
            error: "Failed to update config"
        });
    }


    if (configLoading || assessmentsLoading) {
        return (
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-80 rounded-md" />
                        <Skeleton className="h-3.5 w-96 rounded-md" />
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                        <Skeleton className="h-5 w-9 rounded-full" />
                        <Skeleton className="h-4 w-44 rounded-md" />
                    </div>
                </div>

                <div className="mt-7 flex flex-col gap-4">
                    <div>
                        <Skeleton className="h-4 w-64 rounded-md mb-1.5" />
                        <Skeleton className="h-9 w-full rounded-md" />
                    </div>

                    <div>
                        <Skeleton className="h-4 w-40 rounded-md mb-1.5" />
                        <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                </div>

                <div className="flex justify-end mt-6 mb-2 mr-2">
                    <Skeleton className="h-9 w-28 rounded-md" />
                </div>
            </Card>
        );
    }

    if(isError) return null;

    const isAdmin = user?.role === 'Admin';

    const severityOptions = [
        { id: 'critical', label: 'Critical' },
        { id: 'high', label: 'High' },
        { id: 'medium', label: 'Medium' },
        { id: 'low', label: 'Low' },
        { id: 'info', label: 'Info' }
    ];

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold">Vulnerability Synchronization Configuration</h4>
                    <p className="text-[12px]">Configure the vulnerability synchronization to your asset inventory.</p>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                    <Switch id="auto-sync" checked={autoSync} onCheckedChange={(e) => {
                        setAutoSync(e)
                        handleUpdate({ autoSync: e })
                    }} />
                    <Label htmlFor="auto-sync">Automatic Synchronization</Label>
                </div>
            </div>

            <div className="mt-7 flex flex-col gap-4">



                <div>
                    <Label className="font-normal text-[13px]">Assessment for storing vulnerabilities</Label>
                    <div className="w-full flex gap-2 items-center mt-1">
                        <Select
                            value={selected || config?.assessmentId || 'none'}
                            options={[
                                ...(!isAuditor ? [{ label: '+ Create Assessment', value: CREATE_ASSESSMENT_VALUE, className: 'text-primary font-medium', noNavigate: true }] : []),
                                { label: 'None', value: 'none', noNavigate: true },
                                ...[...(assessments?.data?.assessments || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(assessment => ({ label: assessment.title, value: assessment._id })),
                            ]}
                            onSearchChange={(search) => setSearch(search)}
                            onChange={(option) => {
                                if (option?.value === CREATE_ASSESSMENT_VALUE) {
                                    setCreateAssessmentOpen(true);
                                } else {
                                    setSelected(option.value)
                                    handleUpdate({ assessmentId: option.value })
                                }
                            }}
                            searchPlaceholder="Search by Assessment name"
                        />
                        <CreateAssessmentModel
                            open={createAssessmentOpen}
                            setOpen={setCreateAssessmentOpen}
                        />
                    </div>
                </div>

                <div>
                    <Label className="font-normal text-[13px]">Auto-sync Severities</Label>
                    <div className="w-full flex gap-2 items-center mt-1">
                        <MultiSelect
                            options={severityOptions}
                            values={selectedSeverities}
                            onChange={(values) => {
                                setSelectedSeverities(values);
                                handleUpdate({ severities: values });
                            }}
                            placeholder="Select severities to auto-sync"
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* <Card className=" p-4 mt-4">
                    <div className='flex items-center justify-between'>
                        <div>
                        <h4 className="font-bold">Custom Headers</h4>
                        <p className="text-[12px]">Add Custom Header to the requests generated from scanners</p>
                        </div>

                        <Button
                            type="button"
                            onClick={() => setHeaders(prev => [...prev, { name: '', value: '' }])}
                            variant="outline"
                            size="sm"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Header
                        </Button>
                    </div>
                    <div className='flex flex-col gap-4 mt-2'>
                        {headers.map((header, idx) => (
                            <div key={idx} className='flex items-center gap-4 justify-between w-full'>
                                <Input
                                    type="text"
                                    placeholder="Header Name"
                                    value={header.name}
                                    className="h-9"
                                    onChange={e => {
                                        const value = e.target.value;
                                        setHeaders(prev => prev.map((h, i) =>
                                            i === idx ? { ...h, name: value } : h
                                        ));
                                    }}
                                />
                                <Input
                                    type="text"
                                    placeholder="Header Value"
                                    value={header.value}
                                    className="h-9"
                                    onChange={e => {
                                        const value = e.target.value;
                                        setHeaders(prev => prev.map((h, i) =>
                                            i === idx ? { ...h, value: value } : h
                                        ));
                                    }}
                                />
                                <Button
                                    disabled={headers?.length == 1}
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setHeaders(prev => prev.filter((_, i) => i !== idx))}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
        </Card> */}

            <div className="flex justify-end mt-6 mb-2 mr-2">
                <Button disabled={!isAdmin || isUpdating} onClick={() => handleUpdate()}><Upload className="mr-2 h-4 w-4" /> {!isUpdating ? "Update" : "Updating.."}</Button>
            </div>
        </Card>


    )
}

export default AssessmentConfig