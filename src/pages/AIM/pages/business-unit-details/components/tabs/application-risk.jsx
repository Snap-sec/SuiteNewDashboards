import React, { useEffect, useState, useMemo } from 'react';
import { Save } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetAimBusinessUnitRiskConfigQuery, useUpdateAimBusinessUnitMutation } from '@/services/asset-inventory/businessUnitsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EnhancedGauge } from '@/pages/VM/pages/vulnerability-report/components/graph';
import Select from '@/components/custom/select';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';
import { useAuth } from '@/auth/context/auth-context';


const RISK_LEVELS = [
    {
        label: 'Not Assessed',
        min: 0,
        max: 0,
        color: '#94a3b8',
        twColor: 'text-slate-400',
    },
    {
        label: 'Low Risk',
        min: 1,
        max: 11,
        color: '#16a34a',
        twColor: 'text-green-600',
    },
    {
        label: 'Medium Risk',
        min: 12,
        max: 16,
        color: '#ca8a04',
        twColor: 'text-yellow-600',
    },
    {
        label: 'High Risk',
        min: 17,
        max: 22,
        color: '#ef4444',
        twColor: 'text-red-500',
    },
    {
        label: 'Critical Risk',
        min: 23,
        max: 27,
        color: '#b91c1c',
        twColor: 'text-red-700',
    },
];

function ApplicationRiskTab({ businessUnitStats }) {
    const { user } = useAuth();
    const currentUserRole = user?.role;

    const { id } = useParams();
    const [updateBusinessUnit, { isLoading: isUpdating }] =
        useUpdateAimBusinessUnitMutation();
    const { data: riskConfig, isLoading: isConfigLoading } =
        useGetAimBusinessUnitRiskConfigQuery();

    const [selections, setSelections] = useState({});

    useEffect(() => {
        const riskData = businessUnitStats?.business_unit?.riskAssessment || {};

        if (riskConfig && riskData) {
            setSelections((prev) => ({
                ...prev,
                ...riskData,
            }));
        }
    }, [businessUnitStats, riskConfig]);

    // Calculate Scores based on Config
    const totalScore = useMemo(() => {
        if (!riskConfig) return 0;
        return Object.keys(selections).reduce((acc, key) => {
            const selectedLabel = selections[key];
            const config = riskConfig[key];
            if (!config) return acc;
            const option = config.options.find((opt) => opt.label === selectedLabel);
            return acc + (option ? option.score : 0);
        }, 0);
    }, [selections, riskConfig]);

    const riskLevel = useMemo(() => {
        return (
            RISK_LEVELS.find(
                (level) => totalScore >= level.min && totalScore <= level.max,
            ) || RISK_LEVELS[0]
        );
    }, [totalScore]);



    const handleParameterChange = (key, value) => {
        setSelections((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = () => {
        toast.promise(
            updateBusinessUnit({
                id,
                riskAssessment: selections,
            }).unwrap(),
            {
                loading: 'Saving changes...',
                success: 'Risk assessment updated successfully',
                error: (err) => {
                    return 'Failed to update risk assessment';
                },
            },
        );
    };

    if (isConfigLoading) {
        return (
            <div className="flex flex-col gap-6 p-4">
                <div className="grid grid-cols-2 gap-6">
                    {/* Chart Card Skeleton */}
                    <Card className="flex flex-col items-center justify-center p-6 shadow-sm">
                        <Skeleton className="h-[200px] rounded-full" />
                        <Skeleton className="mt-4 h-8 w-32 rounded-md" />
                    </Card>

                    {/* Risk Level Guide Skeleton */}
                    <Card className="shadow-sm">
                        <CardHeader className="border-none">
                            <Skeleton className="h-6 w-36" />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {[1, 2, 3, 4, 5].map((v) => (
                                <Skeleton key={v} className="h-16 w-full rounded-xl" />
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Risk Parameters Card Skeleton */}
                <Card className="shadow-sm">
                    <CardHeader className="border-none flex flex-row items-center justify-between">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-9 w-28" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {[1, 2, 3, 4].map((v) => (
                            <div key={v} className="flex flex-col gap-1.5">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!riskConfig) {
        return (
            <div className="p-8 text-center text-red-500">
                Failed to load risk configuration.
            </div>
        );
    }

    // Construct riskParameters dynamically from fetched config
    const riskParameters = Object.keys(riskConfig).map((key) => {
        const config = riskConfig[key];
        const currentLabel = selections[key]; // If undefined, will be treated as missing

        return {
            key: key,
            label: config.label,
            value: currentLabel || '', // Pass string directly. Empty string triggers placeholder.
            options: config.options.map((opt) => ({
                label: `${opt.label} (Rating: ${opt.score})`,
                value: opt.label,
            })),
            placeholder: 'Select',
        };
    });

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="grid grid-cols-2 gap-6">
                <Card className="flex flex-col items-center justify-center p-6 shadow-sm">
                    <EnhancedGauge
                        key={`${riskLevel.color}-${totalScore}`}
                        value={totalScore}
                        max={27}
                        size={180}
                        thickness={12}
                        strokeColor={riskLevel.color}
                        textColor={riskLevel.color}
                    />
                    <Badge
                        variant="outline"
                        appearance="outline"
                        className="mt-4 text-sm font-normal py-2 px-4"
                    >
                        {riskLevel.label}
                    </Badge>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="border-none">
                        <CardTitle className="font-medium">Risk Level Guide</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {RISK_LEVELS.map((risk, index) => {
                            const isActive = risk.label === riskLevel.label;
                            return (
                                <div
                                    key={index}
                                    className={`p-3 rounded-xl border flex flex-col gap-1 transition-all duration-300 ${risk.twColor} ${isActive ? ' dark:border-muted-foreground ring-offset-2 ring-current scale-[1.02]' : ''}`}
                                >
                                    <span className="font-medium text-sm tracking-wide">
                                        {risk.label}
                                    </span>
                                    <span className="text-[11px] opacity-80 font-medium">
                                        Score: {risk.min} - {risk.max}
                                    </span>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="border-none flex flex-row items-center justify-between">
                    <CardTitle className="font-medium">Risk Parameters</CardTitle>
                    <AuthorityGuard forbidRoles={['Auditor']}>
                        <Button onClick={handleSave} disabled={isUpdating} size="sm">
                            <Save /> {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </AuthorityGuard>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {riskParameters.map((param, index) => (
                        <div key={index} className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold text-slate-500 px-1 uppercase tracking-wider">
                                {param.label}
                            </label>
                            <Select
                                disabled={currentUserRole === 'Auditor'}
                                value={param.value}
                                options={param.options}
                                placeholder={param.placeholder}
                                onChange={(option) =>
                                    handleParameterChange(param.key, option.value)
                                }
                                searchPlaceholder={`Search by ${param.label}`}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

export default ApplicationRiskTab;