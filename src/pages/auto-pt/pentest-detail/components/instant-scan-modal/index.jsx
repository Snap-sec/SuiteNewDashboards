import { useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, FileText, Target, Info } from 'lucide-react';
import { cn } from "@/lib/utils";
import MultiSelect from "@/components/custom/multi-select";
import { useGetApisecProjectRulesQuery } from '@/services/apisec/projectsApi';

/**
 * InstantScanModal provides two options for launching a scan:
 * 1. Use Existing Configuration: Launch with current project settings.
 * 2. Select Custom Rules: Choose specific rules to run.
 */
export default function InstantScanModal({ open, onOpenChange, onLaunch, isLaunching, projectId, projectName }) {
    const [scanConfig, setScanConfig] = useState('existing'); // 'existing' or 'custom'
    const [selectedRules, setSelectedRules] = useState([]);

    // Fetch rules for the custom rules selection
    const { data: rulesData } = useGetApisecProjectRulesQuery({
        projectId,
        limit: 1000,
    }, { skip: !open });

    const ruleOptions = useMemo(() => {
        return (rulesData?.data?.availableRules || []).map(rule => ({
            label: rule.rule_name,
            value: rule.id || rule._id || rule.ruleId
        }));
    }, [rulesData]);

    const handleLaunch = () => {
        const payload = scanConfig === 'custom'
            ? { ruleIds: selectedRules.map(r => r.value) }
            : {};

        onLaunch(payload);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Instant Scan
                        </DialogTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {projectName} · Launch an immediate scan session
                    </p>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Scan Configuration
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setScanConfig('existing')}
                                className={cn(
                                    "flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all text-left group",
                                    scanConfig === 'existing'
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border hover:border-muted-foreground/50 bg-background"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    scanConfig === 'existing' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-foreground"
                                )}>
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={cn(
                                        "font-bold text-sm",
                                        scanConfig === 'existing' ? "text-primary" : "text-foreground"
                                    )}>Use Existing Configuration</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Use rules configured for this project</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setScanConfig('custom')}
                                className={cn(
                                    "flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all text-left group",
                                    scanConfig === 'custom'
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border hover:border-muted-foreground/50 bg-background"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    scanConfig === 'custom' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-foreground"
                                )}>
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={cn(
                                        "font-bold text-sm",
                                        scanConfig === 'custom' ? "text-primary" : "text-foreground"
                                    )}>Select Custom Rules</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Choose specific rules for this scan only</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {scanConfig === 'existing' ? (
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <Info className="w-5 h-5 text-primary mt-0.5" />
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                The scan will run using the rules and settings already configured for this project. This is the fastest way to start a full scan.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Select Rules <span className="text-destructive">*</span>
                            </label>
                            <MultiSelect
                                options={ruleOptions}
                                values={selectedRules}
                                onChange={setSelectedRules}
                                placeholder="Choose scan rules..."
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-shrink-0 mt-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLaunching}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLaunch}
                        disabled={isLaunching || (scanConfig === 'custom' && selectedRules.length === 0)}
                        className="gap-2"
                    >
                        {isLaunching ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <Zap className="w-4 h-4 fill-current" />
                        )}
                        {isLaunching ? 'Starting...' : 'Start Scan Now'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
