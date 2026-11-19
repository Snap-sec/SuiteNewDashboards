import { DateFormatter } from '@/components/custom/date-formatter';
import { CircleMinus, Link2, PlusCircle, Server, FileText, Settings, Activity, Tags as TagsIcon, Terminal, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Modal } from '@/components/custom/modal';
import {
  useSendVsToVmMutation,
  useSuppressVsVulnMutation,
  useUnSuppressVsVulnMutation,
} from '../../../../../services/vs/vsApi';
import useStore from '../store';
import { Timeline } from './ui/timeline';
import SeverityLabel from '../../../../../components/custom/severity-label';
import { StateLabels } from '../../../../../components/custom/state-labels';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

import { useState } from 'react';

function VulnInfo() {
  const [copied, setCopied] = useState(false);

  const showInfo = useStore((state) => state.showInfo);
  const setShowInfo = useStore((state) => state.setShowInfo);
  const vuln = useStore((state) => state.selectedVuln);

  const [sendToVm, { isLoading: isSendingToVm }] = useSendVsToVmMutation();
  const [suppressVuln, { isLoading: isSuppressing }] = useSuppressVsVulnMutation();
  const [unsuppressVuln, { isLoading: isUnsuppressing }] = useUnSuppressVsVulnMutation();

  const handleSendToVm = () => {
    toast.promise(sendToVm({ vulnIds: [vuln?._id] }).unwrap(), {
      loading: 'Sending to VM',
      error: 'Failed to send to VM',
      success: () => {
        setShowInfo(false);
        return 'Ticket created in VM';
      },
    });
  };

  const handleActions = {
    suppress: async () => {
      const payload = {
        vulnId: vuln._id,
        matcher_name: vuln?.matcher_name,
        template_id: vuln?.template_id,
        matched_at: vuln.matched_at,
        host: vuln?.host,
      };

      toast.promise(suppressVuln(payload).unwrap(), {
        loading: 'Suppressing vulnerability',
        success: () => {
          setShowInfo(false);
          return 'Vulnerability suppressed successfully';
        },
        error: 'Failed to suppress vulnerability',
      });
    },

    unsuppress: async () => {
      const payload = {
        vulnId: vuln._id,
        matcher_name: vuln.matcher_name,
        template_id: vuln.template_id,
        matched_at: vuln.matched_at,
        host: vuln.host,
      };

      toast.promise(unsuppressVuln(payload).unwrap(), {
        loading: 'Un Suppressing vulnerability',
        success: () => {
          setShowInfo(false);
          return 'Vulnerability Un suppressed successfully';
        },
        error: 'Failed to unsuppress vulnerability',
      });
    },
  };

  const reverseTimeline = [...(vuln?.timeline || [])]?.reverse?.();

  if (!vuln) return null;

  return (
    <Modal
      className="max-w-6xl p-0 overflow-hidden gap-0"
      open={showInfo}
      setOpen={setShowInfo}
    >
      <div className="flex flex-col max-h-[90vh]">

        {/* Two-column body */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left: main details ── */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <div className="p-6 space-y-8 mt-4">

              {/* Header Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <SeverityLabel severity={vuln?.severity} />
                  <StateLabels state={vuln?.state || vuln?.status || 'Unknown'} />
                  {vuln?.cve_id && <Badge variant="secondary" className="font-normal text-xs">{vuln.cve_id}</Badge>}
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-foreground tracking-tight pr-6">
                    {vuln?.title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Server className="w-4 h-4" />
                    <span>{vuln?.host}</span>
                  </div>
                </div>
              </div>

              {/* Top Metrics Row */}
              <div className="grid grid-cols-4 gap-3">
                <div className="border border-border/50 rounded-lg p-3 flex flex-col justify-between gap-2 bg-card">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    Scanner
                  </span>
                  <span className="text-base font-semibold text-foreground truncate" title={vuln?.scannerId?.name || 'N/A'}>
                    {vuln?.scannerId?.name || 'N/A'}
                  </span>
                </div>
                <div className="border border-border/50 rounded-lg p-3 flex flex-col justify-between gap-2 bg-card">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    Type
                  </span>
                  <span className="text-base font-semibold text-foreground truncate" title={vuln?.type || 'N/A'}>
                    {vuln?.type || 'N/A'}
                  </span>
                </div>
                <div className="border border-border/50 rounded-lg p-3 flex flex-col justify-between gap-2 bg-card">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    First Seen
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">
                    <DateFormatter date={vuln?.createdAt} />
                  </span>
                </div>
                <div className="border border-border/50 rounded-lg p-3 flex flex-col justify-between gap-2 bg-card">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    Last Seen
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">
                    <DateFormatter date={vuln?.latestFoundOn} />
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Description
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {vuln?.description || 'No description available.'}
                </p>
              </div>

              {/* Remediation Section */}
              {vuln?.remediation && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    Remediation
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {vuln.remediation}
                  </p>
                </div>
              )}

              {/* Vulnerability Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Vulnerability Details
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-border/50 rounded-lg p-3 flex flex-col gap-1.5 bg-card shadow-sm">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Template ID</span>
                    <span className="text-sm font-medium text-foreground truncate">{vuln?.template_id || 'N/A'}</span>
                  </div>
                  <div className="border border-border/50 rounded-lg p-3 flex flex-col gap-1.5 bg-card shadow-sm">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Asset</span>
                    <span className="text-sm font-medium text-foreground truncate">{vuln?.asset || 'N/A'}</span>
                  </div>
                  <div className="border border-border/50 rounded-lg p-3 flex flex-col gap-1.5 bg-card shadow-sm">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Matched At (URL)</span>
                    <a href={vuln?.matched_at} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline truncate">
                      {vuln?.matched_at}
                    </a>
                  </div>
                  <div className="border border-border/50 rounded-lg p-3 flex flex-col gap-1.5 bg-card shadow-sm">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Port</span>
                    <span className="text-sm font-medium text-foreground truncate">{vuln?.port || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* References */}
              {vuln?.reference && vuln.reference.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Link2 className="w-4 h-4 text-muted-foreground" />
                    References
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {vuln.reference.map((ref, idx) => (
                      <a key={idx} href={ref} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-2 truncate">
                        <Link2 className="w-3 h-3 shrink-0" />
                        {ref}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Curl Command */}
              {vuln?.curl && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Terminal className="w-4 h-4 text-muted-foreground" />
                    Curl Command
                  </div>
                  <div className="relative group">
                    <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap border border-border/50 text-muted-foreground pr-10">
                      {vuln?.curl}
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80"
                      onClick={() => {
                        navigator.clipboard.writeText(vuln.curl);
                        setCopied(true);
                        toast.success('Copied to clipboard');
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </div>
              )}

              {/* Tags */}
              {vuln?.tags && vuln.tags.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <TagsIcon className="w-4 h-4 text-muted-foreground" />
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vuln.tags.map((tag) => (
                      <Badge variant="secondary" key={tag} className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ── Right: Activity Timeline sidebar ── */}
          <div className="w-110 shrink-0 border-l border-border/50 overflow-y-auto hide-scrollbar">
            <div className="p-4 sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border/50 z-10">
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Activity className="w-4 h-4 text-muted-foreground" />
                Activity Timeline
              </div>
            </div>
            <div className="p-4">
              <Timeline timeline={reverseTimeline} />
            </div>
          </div>

        </div>


        {/* Footer Section */}
        <div className="border-t border-border/50 p-4 bg-muted/10 flex justify-between items-center shrink-0 rounded-b-md">
          <div className="text-xs text-muted-foreground">
            Matched via <span className="font-medium text-foreground">{vuln?.matcher_name || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <AuthorityGuard forbidRoles={['Auditor']}>
              {!vuln?.is_suppressed ? (
                <ButtonWithConfirm
                  confirm={true}
                  variant="outline"
                  className="text-foreground"
                  dialog="Suppressing this vulnerability will remove it from the dashboard and exclude it from future scans. Are you sure you want to proceed?"
                  onConfirm={handleActions.suppress}
                  disabled={isSuppressing}
                >
                  Suppress
                </ButtonWithConfirm>
              ) : (
                <Button
                  disabled={isUnsuppressing}
                  variant="outline"
                  className="text-primary hover:bg-primary/10"
                  onClick={handleActions.unsuppress}
                >
                  Un-Suppress
                </Button>
              )}
            </AuthorityGuard>

            {vuln && !vuln.sentToVm ? (
              <AuthorityGuard forbidRoles={['Auditor']}>
                <ButtonWithConfirm
                  confirm={true}
                  variant="outline"
                  onConfirm={() => handleSendToVm()}
                  disabled={isSendingToVm}
                >
                  Send To VM
                </ButtonWithConfirm>
              </AuthorityGuard>
            ) : (
              <Button
                variant="secondary"
                onClick={() =>
                  window.open(
                    `/vm/vulnerability-report?id=${vuln?.universalVulnId}&assessmentId=${vuln?.assessmentId}`,
                    '_blank'
                  )
                }
              >
                View Ticket
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default VulnInfo;
