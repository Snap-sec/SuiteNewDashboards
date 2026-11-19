import {
  AlertTriangle,
  Check,
  X,
  ExternalLink,
  Calendar,
  User,
  Server,
  ShieldQuestion,
  Brain,
  Activity,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Editor } from '@/components/custom/Editor/Editor';
import { useVmActionFalsePositiveMutation } from '@/services/vm/falsePositiveApi';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { StateLabels } from '@/components/custom/state-labels';
import SeverityLabel from '@/components/custom/severity-label';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';

function MetaRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground text-xs">{label}:</span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function FalsePositiveDetailView({ activeVuln: item, onDecision, isLoading }) {
  const [actionFalsePositive, { isLoading: isActionLoading }] = useVmActionFalsePositiveMutation();

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Header Skeleton */}
        <div className="border-b border-border px-6 py-4 flex items-center justify-between gap-4 shrink-0 animate-pulse">
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>

        {/* Meta info bar Skeleton */}
        <div className="border-b border-border px-6 py-3 flex flex-wrap items-center gap-5 shrink-0 bg-muted/20 animate-pulse">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>

        <div className="flex-1 px-6 py-5 flex flex-col gap-5 overflow-hidden animate-pulse">
          {/* AI Decision Summary Skeleton */}
          <Card className="border-border shadow-none">
            <CardHeader className="px-5 pt-4 pb-2">
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent className="px-5 pb-4 flex flex-col gap-2.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>

          {/* Full Markdown Report Skeleton */}
          <Card className="shadow-none border-border flex-1 flex flex-col overflow-hidden">
            <CardHeader className="px-5 pt-4 pb-2 w-full">
              <div className="flex items-center justify-between w-full">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 flex-1 flex flex-col gap-4">
              <Skeleton className="h-6 w-1/4 mt-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3 bg-background">
        <ShieldQuestion className="size-12 text-muted-foreground/40" />
        <p className="text-sm">Select a vulnerability to review</p>
      </div>
    );
  }

  const vuln = item.vuln;
  const analysis = item.exploitabilityAnalysis;
  const decision = analysis?.decision;

  const markdown = vuln?.fullMarkdownReport || `# ${vuln?.title || 'Vulnerability'}\n\nNo report content available.`;

  const handleAction = async (action) => {
    try {
      await actionFalsePositive({ vulnId: item.vulnId, action }).unwrap();
      toast.success(
        action === 'accept'
          ? 'Approved as False Positive — vulnerability will be suppressed.'
          : 'False Positive Rejected — vulnerability remains active.'
      );
      onDecision?.(item.vulnId, action);
    } catch {
      toast.error('Failed to submit decision. Please try again.');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">


      {/* Meta info bar */}
      <div className="border-b border-border px-6 py-3 flex flex-wrap items-center gap-5 shrink-0 bg-muted/20">
        <MetaRow icon={User} label="Assignee" value={vuln?.assignee?.name} />
        <MetaRow icon={Calendar} label="Created" value={formatDate(vuln?.createdAt)} />
        <MetaRow icon={Server} label="Asset" value={analysis?.affected_asset?.name} />
        <MetaRow icon={AlertTriangle} label="CVSS" value={vuln?.cvssScore !== '0' ? vuln?.cvssScore : null} />
        {/* <SeverityLabel severity={vuln?.severity} /> */}
        <MetaRow icon={Activity} label="State" value={vuln?.state} />
      </div>

      <ScrollArea className="flex-1">
        <div className="px-6 py-5 flex flex-col gap-5">

          {/* AI Decision Summary & Actions */}
          <Card className="border-border shadow-none">
            <CardHeader className="px-5 pt-4 pb-2 w-full">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  AI Explanation
                </span>
                <AuthorityGuard forbidRoles={"Auditor"}>
                  <div className="flex items-center gap-2 shrink-0">
                    <ButtonWithConfirm
                      variant="secondary"
                      confirm={true}
                      confirmVariant="destructive"
                      confirmTitle="Reject False Positive"
                      dialog="Are you sure you want to reject this false positive request? The vulnerability will remain active."
                      onConfirm={() => handleAction('reject')}
                      disabled={isActionLoading}
                    >
                      <X className="size-3.5" />
                      Reject
                    </ButtonWithConfirm>
                    <ButtonWithConfirm
                      variant="secondary"
                      confirm={true}
                      confirmVariant="success"
                      confirmTitle="Approve False Positive"
                      dialog="Are you sure you want to approve this false positive request? The vulnerability will be suppressed."
                      onConfirm={() => handleAction('accept')}
                      disabled={isActionLoading}
                    >
                      <Check className="size-3.5" />
                      Approve
                    </ButtonWithConfirm>
                  </div>
                </AuthorityGuard>
              </div>
            </CardHeader>
            {(decision?.summary || item.reason) && (
              <CardContent className="px-5 pb-4 flex flex-col gap-3">
                {item?.falsePositiveAnalysis?.decision?.summary && (
                  <p className="text-sm text-foreground">{item?.falsePositiveAnalysis?.decision?.summary}</p>
                )}
                {item.reason && item.reason !== decision?.summary && (
                  <p className="tracking-tight font-normal text-sm text-gray-500 flex items-center gap-2">
                    {item.reason}
                  </p>
                )}
              </CardContent>
            )}
          </Card>

          {/* Full Markdown Report */}
          <Card className="shadow-none border-border">
            <CardHeader className="px-5 pt-4 pb-2 w-full">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Vulnerability Report
                </span>
                {vuln && (
                  <Link
                    to={`/vm/vulnerability-report?id=${vuln?._id || item?.vulnId}&assessmentId=${vuln?.assessmentId}`}
                    className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 hover:underline transition-colors font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Full Report
                    <ExternalLink className="size-3" />
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <Editor
                key={vuln?._id || item?.vulnId}
                defaultValue={markdown}
                readOnly={true}
                className="min-h-[300px]"
              />
            </CardContent>
          </Card>

        </div>
      </ScrollArea>
    </div>
  );
}
