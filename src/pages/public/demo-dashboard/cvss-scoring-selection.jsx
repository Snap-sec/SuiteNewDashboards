import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Binary,
  Check,
  History,
  Info,
  Scale,
  Settings2,
  Shield,
  Target,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeading from '@/components/custom/page-heading';

const ScoringSelectionDemo = () => {
  const [selectedScoring, setSelectedScoring] = useState('cvss');

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Prioritization Strategy
          </h1>
          <p className="text-muted-foreground text-[15px]">
            Global configuration for vulnerability scoring and risk assessment
            methodology.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9">
            <History className="mr-2 h-4 w-4" /> View History
          </Button>
          <Button size="sm" className="h-9 px-5">
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Method Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Scoring Methodology
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select the primary framework for prioritizing remediation
                efforts.
              </p>
            </div>
            <Tabs
              value={selectedScoring}
              onValueChange={setSelectedScoring}
              className="w-auto"
            >
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="cvss" className="text-xs px-6">
                  Standard CVSS
                </TabsTrigger>
                <TabsTrigger value="true-risk" className="text-xs px-6">
                  True Risk
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CVSS Option Card */}
            <div
              onClick={() => setSelectedScoring('cvss')}
              className={cn(
                'group cursor-pointer rounded-xl border p-5 transition-all duration-200',
                selectedScoring === 'cvss'
                  ? 'bg-primary/[0.02] border-primary ring-1 ring-primary/20 shadow-sm'
                  : 'bg-background hover:bg-muted/30 border-border',
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      selectedScoring === 'cvss'
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <Shield size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px]">
                      Standard CVSS v3.1
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Baseline severity rating
                    </p>
                  </div>
                </div>
                {selectedScoring === 'cvss' && (
                  <Badge
                    variant="primary"
                    className="h-5 text-[10px] uppercase"
                  >
                    Active
                  </Badge>
                )}
              </div>
            </div>

            {/* True Risk Option Card */}
            <div
              onClick={() => setSelectedScoring('true-risk')}
              className={cn(
                'group cursor-pointer rounded-xl border p-5 transition-all duration-200',
                selectedScoring === 'true-risk'
                  ? 'bg-primary/[0.02] border-primary ring-1 ring-primary/20 shadow-sm'
                  : 'bg-background hover:bg-muted/30 border-border',
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      selectedScoring === 'true-risk'
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <Target size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px]">
                      True Risk Framework
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Adaptive context-aware scoring
                    </p>
                  </div>
                </div>
                {selectedScoring === 'true-risk' && (
                  <Badge
                    variant="primary"
                    className="h-5 text-[10px] uppercase"
                  >
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
          <div className="border-b bg-muted/30 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Binary size={16} className="text-muted-foreground" />
              <h3 className="font-semibold text-[14px]">
                {selectedScoring === 'cvss'
                  ? 'Methodology Details: CVSS v3.1'
                  : 'Methodology Details: True Risk Engine'}
              </h3>
            </div>
            <Badge
              variant="outline"
              className="bg-background font-mono text-[10px] uppercase tracking-tighter"
            >
              Final Score: 0.0 - 10.0
            </Badge>
          </div>

          <div className="p-6 space-y-8 italic">
            {selectedScoring === 'true-risk' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-bold uppercase tracking-wide flex items-center gap-2">
                        <Settings2 size={14} className="text-primary" />
                        Engine Parameters
                      </h4>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">
                        True Risk calculates priorities by augmenting CVSS base
                        metrics with real-time environmental context.
                      </p>
                    </div>
                    <div className="space-y-3 pt-2">
                      {[
                        {
                          label: 'CVSS Base Metric',
                          weight: '40%',
                          desc: 'Initial vulnerability severity',
                        },
                        {
                          label: 'Threat Exploitability',
                          weight: '25%',
                          desc: 'Known exploits and active targeting',
                        },
                        {
                          label: 'Business Criticality',
                          weight: '20%',
                          desc: 'Value of the target system/data',
                        },
                        {
                          label: 'Network Exposure',
                          weight: '15%',
                          desc: 'Inherent reachability of the asset',
                        },
                      ].map((param, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[13px] font-medium">
                              {param.label}
                            </span>
                            <span className="text-xs font-mono font-bold text-muted-foreground">
                              {param.weight}
                            </span>
                          </div>
                          <Progress
                            value={parseInt(param.weight, 10)}
                            indicatorClassName="bg-gray-500"
                            className="h-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-bold uppercase tracking-wide flex items-center gap-2">
                        <Info size={14} className="text-amber-500" />
                        Priority Policy
                      </h4>
                      <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                        <p className="text-[13px] text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                          Vulnerabilities with low CVSS but high business impact
                          or active exploitability will be elevated in
                          system-wide prioritization.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="px-0 h-auto text-xs text-primary font-bold hover:no-underline flex items-center gap-1 group"
                    >
                      Simulate Policy Impacts{' '}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Heuristic Prioritization Preview
                  </h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-left text-[13px]">
                      <thead className="bg-muted/30 border-b">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-muted-foreground w-1/2">
                            Vulnerability Identification
                          </th>
                          <th className="px-4 py-3 font-semibold text-center text-muted-foreground">
                            Legacy CVSS
                          </th>
                          <th className="px-4 py-3 font-semibold text-center text-primary">
                            True Risk
                          </th>
                          <th className="px-4 py-3 font-semibold text-right text-muted-foreground">
                            Adjust
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-[450] not-italic">
                        {[
                          {
                            name: 'Critical Authentication Bypass',
                            cvss: '9.8',
                            risk: '9.8',
                            delta: '+0.0',
                            deltaColor: 'text-muted-foreground',
                          },
                          {
                            name: 'Unprotected SSH on Public Endpoint',
                            cvss: '7.5',
                            risk: '9.4',
                            delta: '▲ +1.9',
                            deltaColor: 'text-red-500',
                          },
                          {
                            name: 'Legacy CMS Internal Vulnerability',
                            cvss: '8.1',
                            risk: '4.2',
                            delta: '▼ -3.9',
                            deltaColor: 'text-green-500',
                          },
                          {
                            name: 'Missing Strict-Transport-Security',
                            cvss: '3.7',
                            risk: '5.8',
                            delta: '▲ +2.1',
                            deltaColor: 'text-orange-500',
                          },
                        ].map((item, i) => (
                          <tr
                            key={i}
                            className="hover:bg-muted/10 transition-colors"
                          >
                            <td className="px-4 py-3.5 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-border"></div>
                              {item.name}
                            </td>
                            <td className="px-4 py-3.5 text-center font-mono text-muted-foreground">
                              {item.cvss}
                            </td>
                            <td className="px-4 py-3.5 text-center font-mono font-bold text-primary">
                              {item.risk}
                            </td>
                            <td
                              className={cn(
                                'px-4 py-3.5 text-right font-bold text-[11px]',
                                item.deltaColor,
                              )}
                            >
                              {item.delta}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-[13px] font-bold uppercase tracking-wide flex items-center gap-2">
                      <Scale size={14} className="text-primary" />
                      Base Metrics Policy
                    </h4>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                      Uses standard FIRST.org CVSS v3.1 calculations.
                      Prioritization is purely based on the vulnerability's
                      intrinsic severity, regardless of asset context.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-red-50 text-red-700 dark:bg-red-950/20 border-red-100"
                    >
                      Critical: 9.0-10.0
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-orange-50 text-orange-700 dark:bg-orange-950/20 border-orange-100"
                    >
                      High: 7.0-8.9
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 border-yellow-100"
                    >
                      Medium: 4.0-6.9
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/20 border-blue-100"
                    >
                      Low: 0.1-3.9
                    </Badge>
                  </div>
                </div>
                <div className="bg-muted/20 border rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm">
                    <Shield className="text-muted-foreground" size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[15px] font-semibold">
                      Legacy Industry Standard
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Standardized but lacks environmental context.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informational Footer */}
        <div className="flex items-center gap-2 text-muted-foreground border-t pt-6">
          <Info size={14} />
          <p className="text-[12px] font-medium leading-none">
            Changes to the scoring methodology will trigger a background
            re-prioritization of all active findings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoringSelectionDemo;
