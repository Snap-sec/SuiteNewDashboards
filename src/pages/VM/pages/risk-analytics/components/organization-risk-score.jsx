import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleAlert, Bug, Server, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { EnhancedGauge } from '../../vulnerability-report/components/graph';

export default function OrganizationRiskScore({ data, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-card h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center pt-4 pb-6 px-6 gap-6">
          <div className="relative flex items-center justify-center">
            <Skeleton className="size-[170px] rounded-full" />
            <div className="absolute inset-0 m-auto size-[140px] bg-card rounded-full flex flex-col items-center justify-center gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

    const score = data?.riskOverview?.organizationRiskScore || 0;

    const getRiskLabel = (s) => {
        if (s >= 80) return 'CRITICAL RISK';
        if (s >= 60) return 'HIGH RISK';
        if (s >= 40) return 'MEDIUM RISK';
        if (s >= 20) return 'MODERATE RISK';
        return 'LOW RISK';
    };

    const getRiskColor = (s) => {
        if (s >= 80) return '#ef4444';
        if (s >= 60) return '#e74c3c';
        if (s >= 40) return '#ff9800';
        if (s >= 20) return '#3b82f6';
        return '#0ea5e9';
    };

    const color = getRiskColor(score);

    // Extract data from API response or use fallback
    const riskFactors = data?.riskOverview?.riskFactors || [];

    const getFactorData = (key, defaultLabel, defaultColor, defaultFallback) => {
        const factor = riskFactors.find(f => f.factor === key);
        if (factor) {
            return {
                score: factor.scoreContribution || 0,
                weight: factor.weight || 0,
                points: factor.points || 0,
                label: factor.label || defaultLabel,
                color: defaultColor
            };
        }
        return defaultFallback;
    };

    const factors = {
        vulnerabilityRisk: getFactorData('vulnerability', 'Vulnerability Risk', '#ff9800', { score: 0, weight: 0, points: 0, label: 'Vulnerability Risk', color: '#ff9800' }),
        assetRisk: getFactorData('asset', 'Asset Risk', '#3b82f6', { score: 0, weight: 0, points: 0, label: 'Asset Risk', color: '#3b82f6' }),
        slaRisk: getFactorData('sla', 'SLA Risk', '#8b5cf6', { score: 0, weight: 0, points: 0, label: 'SLA Risk', color: '#8b5cf6' }),
    };

    return (
        <Card className="bg-card h-full flex flex-col">
            <CardHeader>
                <CardTitle className="font-normal text-sm text-gray-500 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        Organization Risk Score
                        <DetailedHoverPopover
                            buttonText={<CircleAlert className="h-4 w-4 text-muted-foreground" />}
                            popoverTitle="Organization Risk Score"
                            popoverContent={<p className="text-muted-foreground">The overall risk score for the organization based on the number and severity of identified vulnerabilities.</p>}
                            showBadge={false}
                        />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-4 pb-6 px-6 gap-6">
                <div className="flex flex-col items-center justify-center ">
                    <EnhancedGauge
                        value={score}
                        max={100}
                        size={170}
                        thickness={14}
                        strokeColor={color}
                        textColor={color}
                    />
                    {/* <span className="text-xs font-semibold mt-4 uppercase tracking-wider" style={{ color: color }}>
                        {getRiskLabel(score)}
                    </span> */}
                    {data?.riskOverview?.riskTrend && (
                        <div className="flex items-center mt-4 text-xs text-muted-foreground">
                            {data.riskOverview.riskTrend.direction === 'up' ? (
                                <TrendingUp className="h-3 w-3 mr-1 text-[#e74c3c]" />
                            ) : data.riskOverview.riskTrend.direction === 'down' ? (
                                <TrendingDown className="h-3 w-3 mr-1 text-[#10b981]" />
                            ) : null}
                            <span className={data.riskOverview.riskTrend.direction === 'down' ? 'text-[#10b981] font-medium' : data.riskOverview.riskTrend.direction === 'up' ? 'text-[#e74c3c] font-medium' : ''}>
                                {data.riskOverview.riskTrend.direction === 'up' ? '+' : data.riskOverview.riskTrend.direction === 'down' ? '-' : ''}{data.riskOverview.riskTrend.change} pts
                            </span>
                            <span className="ml-1">from prev. score of {data.riskOverview.riskTrend.previousScore}</span>
                        </div>
                    )}
                </div>

            </CardContent>
        </Card>
    );
}
