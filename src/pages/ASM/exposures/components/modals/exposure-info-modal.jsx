import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Building,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Layers,
  Link2,
  RefreshCcw,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  User,
  Bot,
  Info,
  Search,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useSyncAsmVulnsMutation } from '@/services/asm/exposureApi';
import { useGetVmVulnReportByIdQuery } from '@/services/vm/vulnerabilityReportApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { DateFormatter } from '@/components/custom/date-formatter';
import Editor from '@/components/custom/Editor';
import { Modal } from '@/components/custom/modal';
import { Profile } from '@/components/custom/profile';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import { CustomTooltip } from '@/components/custom/tooltip';
import TimelineCard from '../cards/exposure-timeline-info-card';
import TimelineItem from '../cards/timeline-item';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Starter } from '@/partials/custom/starter';

const getDiscoveryIcon = (vuln) => {
  const origin = (vuln?.reportOrigin || vuln?.scannerId?.name || '').toLowerCase();
  if (origin.includes('manual') || origin.includes('bug') || origin.includes('bounty')) return User;
  if (origin.includes('integration')) return Layers;
  if (origin.includes('asm') || origin.includes('scanner')) return Bot;
  return Search;
};

function ExposureInfoModal({
  associatedAsset,
  trigger,
  vulnId,
  assessmentId,
  universalVulnId,
  row,
  open,
  setOpen,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isControlled = open !== undefined && setOpen !== undefined;
  const modalOpen = isControlled ? open : internalOpen;
  const setModalOpen = isControlled ? setOpen : setInternalOpen;

  const effectiveAssessmentId = assessmentId || row?.assessmentId;
  const effectiveVulnId =
    vulnId || row?.universalVulnId || row?._id || universalVulnId;

  const {
    data: reportRes,
    isLoading,
  } = useGetVmVulnReportByIdQuery(
    {
      assessmentId: effectiveAssessmentId,
      vulnId: effectiveVulnId,
    },
    {
      skip: !modalOpen || !effectiveAssessmentId || !effectiveVulnId,
    },
  );

  const [syncVulns, { isLoading: isSyncing }] = useSyncAsmVulnsMutation();

  const vuln = reportRes?.data || row || {};
  const isSentToVm = vuln?.sentToVm || row?.sentToVm;

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToVm = () => {
    const idToSync = row?._id || vuln?._id;
    if (!idToSync) {
      toast.error('Exposure ID missing');
      return;
    }

    toast.promise(syncVulns(idToSync).unwrap(), {
      loading: 'Sending to VM...',
      success: () => {
        return 'Ticket created in VM';
      },
      error: (err) => err?.data?.message || 'Failed to send to VM',
    });
  };

  const hasComments = Array.isArray(vuln?.comments) && vuln.comments.length > 0;
  const reverseComments = hasComments ? [...vuln.comments].reverse() : [];

  const assetValue =
    vuln?.affectedAssets?.[0]?.value ||
    vuln?.vulnerableComponent?.value ||
    associatedAsset?.value ||
    associatedAsset?.subdomain ||
    row?.associatedAsset?.value ||
    row?.associatedAsset?.subdomain ||
    row?.value ||
    'N/A';

  const assetType =
    vuln?.affectedAssets?.[0]?.type ||
    vuln?.vulnerableComponent?.type ||
    associatedAsset?.type ||
    row?.associatedAsset?.type ||
    'Asset';

  const domainForPort =
    vuln?.affectedAssets?.[0]?.subdomain ||
    vuln?.vulnerableComponent?.subdomain ||
    associatedAsset?.subdomain ||
    row?.associatedAsset?.subdomain ||
    '';

  const displayAssetValue = vuln?.url || row?.url || (assetType?.toLowerCase() === 'port' && domainForPort
    ? `http://${domainForPort}:${assetValue}`
    : assetValue);

  const severity =
    vuln?.severity ||
    (vuln?.cvssRating && vuln?.cvssRating !== 'none'
      ? vuln.cvssRating
      : row?.severity || 'info');

  const state = vuln?.state || row?.state || 'In Review';

  return (
    <>
      {trigger && (
        <div
          onClick={() => setModalOpen(true)}
          className="cursor-pointer w-full"
        >
          {trigger}
        </div>
      )}

      <Modal
        className="max-w-6xl p-0 overflow-hidden gap-0"
        open={modalOpen}
        setOpen={setModalOpen}
      >
        <div className="flex flex-col max-h-[90vh]">
          {/* Main Two-Column Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* ── Left Column: Main Exposure Details ── */}
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              <div className="p-6 space-y-8 mt-4">
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-7 w-3/4" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-44 w-full" />
                  </div>
                ) : (
                  <>
                    {/* Header Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <SeverityLabel severity={severity} />
                        <StateLabels state={state} />

                        {vuln?.cvssScore && vuln?.cvssScore !== '0' && (
                          <Badge
                            variant="secondary"
                            className="font-normal text-xs"
                          >
                            CVSS {vuln.cvssScore}
                          </Badge>
                        )}

                        {vuln?.isKev && (
                          <Badge
                            variant="destructive"
                            className="font-semibold text-xs"
                          >
                            KEV
                          </Badge>
                        )}




                      </div>

                      <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-foreground tracking-tight pr-6">
                          {vuln?.title || row?.reason || 'Exposure Details'}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Server className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono font-medium text-foreground">
                              {displayAssetValue}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-normal"
                          >
                            {assetType}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Top Metrics Row */}
                    {/* <div className="grid grid-cols-4 gap-3">
                      <div className="border border-border/50 rounded-lg p-3 flex flex-col justify-between gap-2 bg-card">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          Scanner
                        </span>
                        <span
                          className="text-base font-semibold text-foreground truncate"
                          title={
                            vuln?.scannerId?.name || vuln?.reportOrigin || 'ASM'
                          }
                        >
                          {vuln?.scannerId?.name ||
                            (vuln?.reportOrigin
                              ? vuln.reportOrigin.toUpperCase()
                              : 'ASM Scanner')}
                        </span>
                      </div>

                      <div className="border border-border/50 rounded-lg p-3 flex flex-col justify-between gap-2 bg-card">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          Type
                        </span>
                        <span
                          className="text-base font-semibold text-foreground capitalize truncate"
                          title={assetType}
                        >
                          {assetType}
                        </span>
                      </div>

                      <div className="border border-border/50 rounded-lg p-3 flex flex-col justify-between gap-2 bg-card">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          First Seen
                        </span>
                        <span className="text-sm font-medium text-foreground truncate">
                          <DateFormatter
                            date={vuln?.createdAt || row?.createdAt}
                          />
                        </span>
                      </div>

                      <div className="border border-border/50 rounded-lg p-3 flex flex-col justify-between gap-2 bg-card">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          Last Seen
                        </span>
                        <span className="text-sm font-medium text-foreground truncate">
                          <DateFormatter
                            date={
                              vuln?.updatedAt ||
                              vuln?.latestFoundOn ||
                              row?.updatedAt ||
                              row?.createdAt
                            }
                          />
                        </span>
                      </div>
                    </div> */}

                    {/* Additional Details */}
                    <div className="space-y-6 pt-2">
                      {(vuln?.description || row?.description) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            Description
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {vuln?.description || row?.description}
                          </p>
                        </div>
                      )}

                      {(vuln?.impact || row?.impact) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
                            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                            Impact
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {vuln?.impact || row?.impact}
                          </p>
                        </div>
                      )}

                      {(vuln?.remediation || row?.remediation) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                            Remediation
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {vuln?.remediation || row?.remediation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* References */}
                    {vuln?.references && vuln.references.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                          <Link2 className="w-4 h-4 text-muted-foreground" />
                          References
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {vuln.references.map((ref, idx) => (
                            <a
                              key={idx}
                              href={ref}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-2 truncate"
                            >
                              <Link2 className="w-3 h-3 shrink-0" />
                              {ref}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ── Right: Attack Path sidebar ── */}
            <div className="w-110 shrink-0 border-l border-border/50 overflow-y-auto hide-scrollbar">
              <div className="p-4 sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border/50 z-10">
                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  Attack Path
                </div>
              </div>

              <div className="p-4">
                {isLoading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="size-9 rounded-full shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {/* Attack Path */}
                    {(vuln?.attack_path || row?.attack_path)?.length > 0 ? (
                      (vuln?.attack_path || row?.attack_path).map((path, idx, arr) => (
                        <TimelineItem
                          key={`attack-path-${idx}`}
                          line={idx < arr.length - 1}
                          icon={Target}
                        >
                          <div className="flex flex-col gap-0.5 pt-1">
                            <div className="text-sm text-foreground leading-relaxed">
                              {path.step}
                            </div>
                          </div>
                        </TimelineItem>
                      ))
                    ) : (
                      <Starter
                        image={
                          <>
                            <img
                              src={toAbsoluteUrl('/media/illustrations/21.svg')}
                              className="dark:hidden max-h-[200px]"
                            />

                            <img
                              src={toAbsoluteUrl('/media/illustrations/21-dark.svg')}
                              className="light:hidden max-h-[200px]"
                            />
                          </>
                        }
                        title="No attack path available"
                        subTitle="No attack path recorded for this exposure."
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="border-t border-border/50 p-3 bg-muted/10 flex justify-between items-center shrink-0 rounded-b-md">
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              {vuln?.assessment?.title && (
                <span>{vuln.assessment.title}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <AuthorityGuard forbidRoles={['Auditor']}>
                {!isSentToVm ? (
                  <ButtonWithConfirm
                    confirm={true}
                    variant="outline"
                    onConfirm={handleSendToVm}
                    disabled={isSyncing}
                    confirmVariant="warning"
                    confirmTitle="Escalate Ticket"
                    dialog="Are you sure you want to send this exposure to Vulnerability Management? This will create a new ticket."
                    confirmButton={
                      <Button disabled={isSyncing}>Confirm</Button>
                    }
                  >
                    <RefreshCcw
                      size={13}
                      className={isSyncing ? 'animate-spin mr-1' : 'mr-1'}
                    />
                    Escalate Ticket
                  </ButtonWithConfirm>
                ) : (
                  <Button
                    variant="secondary"
                    className="flex items-center gap-1.5"
                    onClick={() =>
                      window.open(
                        `/vm/vulnerability-report?id=${vuln?.universalVulnId || vuln?._id}&assessmentId=${effectiveAssessmentId}`,
                        '_blank',
                      )
                    }
                  >
                    <Link2 size={13} />
                    View Ticket
                  </Button>
                )}
              </AuthorityGuard>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ExposureInfoModal;
