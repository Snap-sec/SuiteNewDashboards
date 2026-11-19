import { ChevronRight, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleDot } from 'lucide-react';
import { formatDate } from '@/lib/helpers';
import MatchedAssetsTable from './tables/matched-assets-table';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { useNavigate, Link } from 'react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ClassifierJobsTab } from './classifier-jobs-tab';
import { PipelineBlock } from './rule-editor/components/pipeline-block';

export function ClassifierDetailsView({
  activeClassifier,
  isLoading,
}) {
  const navigate = useNavigate();

  if (!activeClassifier || isLoading) {
    return (
      <main className="flex-1 kt-scrollable-x-auto bg-background overflow-auto">
        <div className="p-6">
          {/* Header skeleton */}
          <header className="mb-4">
            <div className="flex items-start justify-between w-full">
              <div className="pl-3 space-y-2">
                <Skeleton className="h-6 w-64" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-4">
            {/* Description card skeleton */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-5/6" />
                <Skeleton className="h-3.5 w-4/6" />
              </CardContent>
            </Card>

            {/* Query card skeleton */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-36" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 flex-wrap p-3 bg-muted/30 rounded-lg border border-border/40 min-h-[50px]">
                  <Skeleton className="h-6 w-14 rounded-md" />
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-6 w-24 rounded-md" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 kt-scrollable-x-auto bg-background overflow-auto">
      <div className="p-6">
        {/* Header */}
        <header className="mb-4 flex items-start gap-3">
          <div className="flex items-start justify-between w-full">
            <div>
              <div className="relative pl-3">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
                <h1 className="text-xl font-semibold text-foreground leading-tight">
                  {activeClassifier.name}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 pl-3">
                <span>
                  Matched Assets: <span className="text-foreground/80 font-medium">{activeClassifier.matched_assets ?? 0}</span>
                </span>
                <span>•</span>
                <span>Created: <span className="text-foreground/80">{formatDate(activeClassifier.createdAt)}</span></span>
                <span>•</span>
                <AuthorityGuard forbidRoles={['Auditor']}>
                  <button
                    className="text-primary font-medium hover:underline flex items-center gap-0.5 group"
                    onClick={() => navigate(`/assetinventory/automation/new?policyId=${activeClassifier._id}`)}
                  >
                    Edit classifier <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </AuthorityGuard>
              </div>
            </div>

            <Link to="/assetinventory/engine/policy/library" className="text-primary font-medium hover:underline flex items-center gap-1 group text-sm mt-1 pr-2">
              Explore signal library <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </header>

        <Tabs defaultValue="details" className="w-full">
          <TabsList variant="line" className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 m-0">
            {/* Description */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activeClassifier.description || 'No description provided for this classifier.'}
                </p>
              </CardContent>
            </Card>

            {/* Conditions / Query */}
            {activeClassifier.match?.conditions?.length > 0 && (
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Associated Query</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 flex-wrap p-3 bg-muted/30 rounded-lg border border-border/40 min-h-[50px]">
                    <Badge variant="secondary" appearance="outline" size="md" className="text-[12px] font-medium bg-muted border-border/40">
                      <CircleDot className="size-3 mr-1.5" />
                      Asset
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium px-1.5">WHERE</span>

                    {activeClassifier.match.conditions.map((condition, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-1 min-w-0">
                        {idx > 0 && <span className="text-xs text-muted-foreground font-bold px-1">AND</span>}
                        <Badge variant="secondary" appearance="outline" size="md" className="text-[12px] font-medium bg-muted border-border/40 max-w-full whitespace-normal break-all h-auto py-1 leading-relaxed">
                          {condition.field}
                        </Badge>
                        <span className="text-[10px] font-mono text-muted-foreground px-0.5">{condition.operator}</span>
                        <Badge variant="secondary" appearance="outline" size="md" className="text-[12px] font-medium bg-muted border-border/40 max-w-full whitespace-normal break-all h-auto py-1 leading-relaxed">
                          {typeof condition.value === 'string' ? `"${condition.value}"` : String(condition.value)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action */}
            {activeClassifier.actions && Array.isArray(activeClassifier.actions) && activeClassifier.actions.length > 0 && (
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 w-full justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      Action pipeline
                      <span className="flex items-center justify-center bg-muted text-muted-foreground text-[10px] rounded-full h-5 w-5 font-medium">{activeClassifier.actions.length}</span>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto hide-scrollbar">
                    <div className="flex items-center gap-6 min-w-max">
                      {activeClassifier.actions.map((act, idx) => {
                        const title = act.type.charAt(0).toUpperCase() + act.type.slice(1);
                        
                        const getActionSummary = (action) => {
                          if (action.type === 'classify') {
                            const field = action.config?.set?.[0]?.field;
                            const value = action.config?.set?.[0]?.value;
                            if (field && value) return `${field} = ${value}`;
                            if (field) return `${field} = ...`;
                          }
                          if (action.type === 'alert') {
                            const ch = action.config?.channels?.[0]?.type;
                            if (ch) return ch;
                          }
                          if (action.type === 'trigger') {
                            const trig = action.config?.action;
                            if (trig) return trig;
                          }
                          return 'Configured';
                        };

                        return (
                          <div key={idx} className="flex items-center gap-6 shrink-0 py-2">
                            <PipelineBlock
                              title={title}
                              type={act.type}
                              step={idx + 1}
                              totalSteps={activeClassifier.actions.length}
                              summary={getActionSummary(act)}
                            />
                            {idx < activeClassifier.actions.length - 1 && (
                              <ArrowRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Matched Assets Table */}
            <section className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-foreground">Matched Assets</h2>
              </div>
              <MatchedAssetsTable
                policyId={activeClassifier._id}
              />
            </section>
          </TabsContent>

          <TabsContent value="jobs" className="m-0">
            <ClassifierJobsTab policyId={activeClassifier._id} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

