import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Switch, SwitchWrapper } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import Select from "@/components/custom/select";
import SeverityLabel from "@/components/custom/severity-label";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useGetApisecProjectRulesQuery,
    useUpdateApisecProjectRulesMutation,
} from "@/services/apisec/projectsApi";
import useScannerStore from "./scanner-store";

function RulesTab({ isTabContent = true }) {
    const { projectId } = useScannerStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [severityFilter, setSeverityFilter] = useState("all");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
    const observerRef = useRef(null);

    // Fetch rules from API
    const { data, isLoading, isFetching } = useGetApisecProjectRulesQuery(
        {
            projectId,
            search: searchQuery,
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
        },
        { skip: !projectId }
    );

    // Mutation to update project rules
    const [updateApisecProjectRules, { isLoading: isUpdating }] =
        useUpdateApisecProjectRulesMutation();

    // Local state to track per-row active state
    const [activeMap, setActiveMap] = useState({});
    const [loadingRuleId, setLoadingRuleId] = useState(null);

    // Initialize local activeMap when data loads
    useEffect(() => {
        const map = {};
        (data?.data?.availableRules || []).forEach((r) => {
            const rid = r?.id ?? r?._id ?? r?._id ?? r?.ruleId ?? r?.rule_id;
            if (rid !== undefined) map[rid] = !!r?.isInProject;
        });
        setActiveMap((map));
    }, [data]);

    const rules = data?.data?.availableRules || [];
    const stats = data?.data?.stats || {};
    const totalRulesCount = stats.totalRules || rules.length;

    // Intersection Observer for infinite scrolling
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetching) {
                    setPagination((prev) => {
                        if (totalRulesCount && prev.pageSize >= totalRulesCount) return prev;
                        return { ...prev, pageSize: prev.pageSize + 25 };
                    });
                }
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [isFetching, totalRulesCount]);

    const severityOptions = [
        { label: "All Severities", value: "all" },
        { label: "Critical", value: "critical" },
        { label: "High", value: "high" },
        { label: "Medium", value: "medium" },
        { label: "Low", value: "low" },
    ];

    const getRuleId = (rule) =>
        rule?.id ?? rule?._id ?? rule?.ruleId ?? rule?.rule_id;

    const toggleRule = async (rule) => {
        const ruleId = getRuleId(rule);
        const currentState = activeMap[ruleId] ?? rule?.isInProject;
        const newState = !currentState;

        setLoadingRuleId(ruleId);

        try {
            await updateApisecProjectRules({
                projectId,
                payload: {
                    ruleId,
                    isActive: newState,
                },
            }).unwrap();

            setActiveMap((prev) => ({
                ...prev,
                [ruleId]: newState,
            }));
        } catch (error) {
            console.error("Error updating rule:", error);
        } finally {
            setLoadingRuleId(null);
        }
    };

    // Filter rules by severity locally
    const filteredRules = rules.filter((rule) => {
        if (severityFilter === "all") return true;
        const ruleSeverity = rule?.report?.severity || rule?.parsed_yaml?.report?.severity;
        return ruleSeverity?.toLowerCase() === severityFilter;
    });

    const activeRulesCount = stats.activeRules || Object.values(activeMap).filter(Boolean).length;

    // Loading skeleton
    if (isLoading && pagination.pageSize === 25) {
        return (
            <div className="flex flex-col gap-6">
                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="p-4 bg-muted/30 rounded-lg border border-border">
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
                {/* Search Skeleton */}
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-40" />
                </div>
                {/* Rules List Skeleton */}
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32 mb-2" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 ">


            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <p className="text-2xl font-semibold text-primary">{activeRulesCount}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Rules</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <p className="text-2xl font-semibold">{totalRulesCount}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Available</p>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search rules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="w-40">
                    <Select
                        options={severityOptions}
                        value={severityFilter}
                        onChange={(opt) => setSeverityFilter(opt?.value || "all")}
                        placeholder="All Severities"
                        enableSearch={false}
                    />
                </div>
            </div>

            {/* Divider */}
            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-background px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Security Rules
                    </span>
                </div>
            </div>

            {/* Rules Section */}
            <div className="flex flex-col gap-2">
                <label className="text-sm">
                    Execution Rules {isFetching && <Loader2 className="inline w-3 h-3 ml-2 animate-spin" />}
                </label>
                <ScrollArea className={cn(isTabContent ? "h-[280px]" : "h-[450px]", "pr-3")}>
                    <div className="flex flex-col gap-2">
                        {filteredRules.length === 0 ? (
                            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                                No rules found
                            </div>
                        ) : (
                            <>
                                {filteredRules.map((rule) => {
                                    const ruleId = getRuleId(rule);
                                    const isActive = activeMap[ruleId] ?? rule?.isInProject;
                                    const isRuleLoading = loadingRuleId === ruleId;
                                    const severity = rule?.report?.severity || rule?.parsed_yaml?.report?.severity;
                                    const cwe = rule?.parsed_yaml?.report?.cwe || "N/A";

                                    return (
                                        <div
                                            key={ruleId}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-lg border transition-colors",
                                                isActive
                                                    ? "border-border hover:bg-muted/30"
                                                    : "border-border/50 bg-muted/20 opacity-60"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <SwitchWrapper>
                                                    <Switch
                                                        checked={isActive}
                                                        onCheckedChange={() => toggleRule(rule)}
                                                        size="sm"
                                                        disabled={isRuleLoading || isUpdating}
                                                    />
                                                </SwitchWrapper>
                                                <div className="flex flex-col gap-0.5 max-w-[320px]">
                                                    <span
                                                        className={cn(
                                                            "text-sm font-medium truncate",
                                                            !isActive && "text-muted-foreground"
                                                        )}
                                                        title={rule?.rule_name}
                                                    >
                                                        {rule?.rule_name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground truncate" title={rule?.parsed_yaml?.report?.description}>
                                                        {cwe} · {rule?.category?.replace(/_/g, ' ') || 'Uncategorized'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={cn("flex items-center gap-4", !isActive && "opacity-70")}>
                                                <SeverityLabel severity={severity} size="sm" />
                                                <div className="text-right min-w-[50px]">
                                                    <p className={cn(
                                                        "text-sm font-medium",
                                                        rule?.vulnerability_count > 0 ? "text-yellow-500" : "text-muted-foreground"
                                                    )}>
                                                        {rule?.vulnerability_count || 0}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground uppercase">Vulns</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* Intersection Observer Sentinel */}
                                {pagination.pageSize < totalRulesCount && (
                                    <div ref={observerRef} className="py-4 flex justify-center w-full">
                                        {isFetching && <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

export default RulesTab;
