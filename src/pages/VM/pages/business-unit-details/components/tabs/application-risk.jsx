import React, { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetAimBusinessUnitRiskConfigQuery, useUpdateAimBusinessUnitMutation } from '@/services/asset-inventory/businessUnitsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import Select from '@/components/custom/select';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';
import { useAuth } from '@/auth/context/auth-context';
import ApiErrorHandler from '../../../../../../components/common/api-error-handler';


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
    const { data: riskConfig, isLoading: isConfigLoading, isError, error } =
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

    // Prepare donut chart data - showing score achieved vs remaining
    const chartData = useMemo(
        () => [
            { name: 'Score', value: totalScore },
            { name: 'Remaining', value: 27 - totalScore },
        ],
        [totalScore],
    );

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

    if (!isError && isConfigLoading) {
        return (
            <div className="flex flex-col gap-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Chart Card Skeleton */}
                    <Card className="flex flex-col items-center justify-center p-6 shadow-none border animate-pulse">
                        <Skeleton className="h-[200px] rounded-full" />
                        <Skeleton className="mt-6 h-8 w-32 rounded-md" />
                    </Card>

                    {/* Risk Level Guide Skeleton */}
                    <Card className="shadow-none border animate-pulse">
                        <CardHeader className="border-b px-6 py-4">
                            <Skeleton className="h-6 w-36 rounded" />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 p-6">
                            {[1, 2, 3, 4, 5].map((v) => (
                                <Skeleton key={v} className="h-[60px] w-full rounded-xl" />
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Risk Parameters Card Skeleton */}
                <Card className="shadow-none border animate-pulse">
                    <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between">
                        <Skeleton className="h-6 w-40 rounded" />
                        <Skeleton className="h-9 w-28 rounded-md" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5 p-6">
                        {[1, 2, 3, 4].map((v) => (
                            <div key={v} className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-32 rounded" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError) return <ApiErrorHandler error={error} />;
    if (!isError && !riskConfig) {
        return (
            <div className="p-8 text-center text-gray-500">
                No risk configuration available.
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
            options: [
                { label: 'None', value: 'None' },
                ...config.options.map((opt) => ({
                    label: `${opt.label} (Rating: ${opt.score})`,
                    value: opt.label,
                })),
            ],
            placeholder: 'Select',
        };
    });

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex flex-col items-center justify-center p-6 shadow-none border">
                    <div className="relative w-[250px] h-[250px] flex items-center justify-center">
                        <DonutChart
                            key={`${riskLevel.color}-${totalScore}`}
                            data={chartData}
                            colors={[riskLevel.color, 'var(--muted)']}
                            height={250}
                            showLegend={false}
                            noCard
                            centerValue={String(totalScore)}
                            centerLabel="Risk Score"
                        />
                    </div>
                    <Badge
                        className="mt-6 text-sm font-semibold py-1.5 px-4 shadow-xs border"
                        style={{
                            backgroundColor: `${riskLevel.color}15`,
                            color: riskLevel.color,
                            borderColor: `${riskLevel.color}30`,
                        }}
                    >
                        {riskLevel.label}
                    </Badge>
                </Card>

                <Card className="shadow-none border">
                    <CardHeader className="border-b px-6 py-4">
                        <CardTitle className="font-semibold text-base">Risk Level Guide</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 p-6">
                        {RISK_LEVELS.map((risk, index) => {
                            const isActive = risk.label === riskLevel.label;
                            return (
                                <div
                                    key={index}
                                    className={`p-3 rounded-xl border flex flex-col gap-1 transition-all duration-300 ${isActive ? 'scale-[1.02] shadow-xs' : 'opacity-70'}`}
                                    style={{
                                        borderColor: isActive ? risk.color : 'var(--border)',
                                        backgroundColor: isActive ? `${risk.color}15` : 'transparent',
                                    }}
                                >
                                    <span
                                        className="font-semibold text-sm tracking-wide"
                                        style={{ color: isActive ? risk.color : 'var(--foreground)' }}
                                    >
                                        {risk.label}
                                    </span>
                                    <span className="text-[11px] font-medium text-muted-foreground">
                                        Score: {risk.min} - {risk.max}
                                    </span>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-none border">
                <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between">
                    <CardTitle className="font-semibold text-base">Risk Parameters</CardTitle>
                    <AuthorityGuard forbidRoles={['Auditor']}>
                        <Button onClick={handleSave} disabled={isUpdating} size="sm">
                            <Save className="w-4 h-4 mr-2" /> {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </AuthorityGuard>
                </CardHeader>
                <CardContent className="flex flex-col gap-5 p-6">
                    {riskParameters.map((param, index) => (
                        <div key={index} className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
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