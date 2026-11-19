import React, { useEffect, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
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
  CircleAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useToggleTrueRiskEnabledMutation } from '@/services/vm/true-riskApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
import { Progress } from '@/components/ui/progress';
import PageHeading from '@/components/custom/page-heading';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import RiskComparisonTable from './risk-comparison-table';

const ScoringSelection = ({ policyData }) => {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';
  const [selectedScoring, setSelectedScoring] = useState(
    policyData?.data?.viewEnabled ? 'true-risk' : 'cvss',
  );
  const [toggleTrueRiskEnabled] = useToggleTrueRiskEnabledMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingScoring, setPendingScoring] = useState(null);

  useEffect(() => {
    if (policyData?.data) {
      setSelectedScoring(policyData.data.viewEnabled ? 'true-risk' : 'cvss');
    }
  }, [policyData?.data?.viewEnabled]);

  const handleScoringChange = (value) => {
    if (value === selectedScoring) return;
    setPendingScoring(value);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!pendingScoring) return;
    const enabled = pendingScoring === 'true-risk';
    setSelectedScoring(pendingScoring);
    setPendingScoring(null);
    setConfirmOpen(false);
    toast.promise(toggleTrueRiskEnabled(enabled).unwrap(), {
      loading: 'Updating scoring methodology...',
      success: enabled
        ? 'True Risk Framework enabled'
        : 'Standard CVSS v3.1 enabled',
      error: 'Failed to update scoring methodology',
    });
  };

  return (
    <>
      <ConfirmDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleConfirm}
        variant="warning"
        title="Change Scoring Methodology?"
        dialog={
          pendingScoring === 'true-risk'
            ? 'Switching to True Risk Framework will re-prioritize all findings using contextual risk scoring. This may affect your current vulnerability triage.'
            : 'Switching to Standard CVSS v3.1 will use baseline severity ratings only, without contextual adjustments.'
        }
      />
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold">Scoring Methodology</h2>
            <p className="text-sm text-muted-foreground">
              Select the primary framework for prioritizing remediation efforts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CVSS Option Card */}
            <div
              onClick={() => {
                if (isAuditor) return;
                handleScoringChange('cvss');
              }}
              className={cn(
                'group relative rounded-lg border p-4 transition-all duration-200',
                isAuditor ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                selectedScoring === 'cvss'
                  ? 'bg-primary/5 border-primary ring-1 ring-primary/20 shadow-sm'
                  : 'bg-card hover:bg-accent/50 border-border',
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-md transition-colors',
                      selectedScoring === 'cvss'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <Shield size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Standard CVSS v3.1</h3>
                    <p className="text-xs text-muted-foreground">
                      Baseline severity rating
                    </p>
                  </div>
                </div>
                {selectedScoring === 'cvss' && (
                  <Badge variant="primary" size="xs" className="uppercase">
                    Active
                  </Badge>
                )}
              </div>
            </div>

            {/* True Risk Option Card */}
            <div
              onClick={() => {
                if (isAuditor) return;
                handleScoringChange('true-risk');
              }}
              className={cn(
                'group relative rounded-lg border p-4 transition-all duration-200',
                isAuditor ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                selectedScoring === 'true-risk'
                  ? 'bg-primary/5 border-primary ring-1 ring-primary/20 shadow-sm'
                  : 'bg-card hover:bg-accent/50 border-border',
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-md transition-colors',
                      selectedScoring === 'true-risk'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <Target size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">True Risk Framework</h3>
                    <p className="text-xs text-muted-foreground">
                      Adaptive context-aware scoring
                    </p>
                  </div>
                </div>
                {selectedScoring === 'true-risk' && (
                  <Badge variant="primary" size="xs" className="uppercase">
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {selectedScoring === 'true-risk' ? (
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Settings2 size={16} className="text-muted-foreground" />
                Engine Parameters
                <DetailedHoverPopover
                  buttonText={
                    <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <CircleAlert className="h-4 w-4" />
                    </Button>
                  }
                  showBadge={false}
                  popoverTitle="Priority Policy"
                  popoverContent={
                    <p className="text-muted-foreground">
                      Vulnerabilities with low CVSS but high business impact or active exploitability will be elevated in system-wide prioritization.
                    </p>
                  }
                />
              </CardTitle>
              <CardDescription>
                True Risk calculates priorities by augmenting CVSS base metrics with real-time environmental context.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'CVSS Base Metric', weight: '40%' },
                  { label: 'Threat Exploitability', weight: '25%' },
                  { label: 'Business Criticality', weight: '20%' },
                  { label: 'Network Exposure', weight: '15%' },
                ].map((param, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{param.label}</span>
                      <span className="text-xs font-bold text-muted-foreground">{param.weight}</span>
                    </div>
                    <Progress value={parseInt(param.weight, 10)} indicatorClassName="bg-gray-500" className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Scale size={16} className="text-muted-foreground" />
                Base Metrics Policy
              </CardTitle>
              <CardDescription>
                Uses standard FIRST.org CVSS v3.1 calculations. Prioritization is purely based on the vulnerability's intrinsic severity, regardless of asset context.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="dangerSoft" appearance="light">Critical: 9.0-10.0</Badge>
                  <Badge variant="warning" appearance="light">High: 7.0-8.9</Badge>
                  <Badge variant="secondary" appearance="light">Medium: 4.0-6.9</Badge>
                  <Badge variant="primary" appearance="light">Low: 0.1-3.9</Badge>
                </div>
                <div className="bg-muted/30 border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                    <Shield className="text-muted-foreground" size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Legacy Industry Standard</p>
                    <p className="text-xs text-muted-foreground">Standardized but lacks environmental context.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedScoring === 'true-risk' && (
          <Card className="shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <RiskComparisonTable />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default ScoringSelection;
