import React, { useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import TimelineItem from '@/pages/ASM/exposures/components/cards/timeline-item';
import { Starter } from '@/partials/custom/starter';
import { AlertTriangle, CircleMinus, CirclePlus, FileText, Link2, RefreshCcw, Server, Shield, Target } from 'lucide-react';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useSendAutoPtVulnToVmMutation, useSuppressAutoPtVulnMutation, useUnsuppressAutoPtVulnMutation } from '@/services/auto-pt/autoPtVulnerabilityApi';
import { useGetVmVulnReportByIdQuery } from '@/services/vm/vulnerabilityReportApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinners';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Modal } from '@/components/custom/modal';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import { CustomTooltip } from '@/components/custom/tooltip';


function VulnerabilityInfoModal({
  trigger,
  vulnId,
  assessmentId,
  universalVulnId,
  row,
  data,
  title,
  open,
  setOpen,
}) {
  const { user } = useAuth();
  const isAuditor = user?.role?.toLowerCase() === 'auditor';

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && setOpen !== undefined;
  const modalOpen = isControlled ? open : internalOpen;
  const setModalOpen = isControlled ? setOpen : setInternalOpen;

  const rowData = data || row || {};
  const effectiveAssessmentId = assessmentId || rowData?.assessmentId;
  const effectiveVulnId =
    vulnId || rowData?.universalVulnId || rowData?._id || universalVulnId;

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

  const [sendToVm, { isLoading: isSendingToVm }] = useSendAutoPtVulnToVmMutation();
  const [suppressVuln, { isLoading: isSuppressing }] = useSuppressAutoPtVulnMutation();
  const [unsuppressVuln, { isLoading: isUnsuppressing }] = useUnsuppressAutoPtVulnMutation();

  const vuln = reportRes?.data || rowData || {};
  const isSentToVm = vuln?.sentToVm || rowData?.sentToVm;

  const handleSendToVm = () => {
    const idToSend = rowData?._id || vuln?._id;
    if (!idToSend) {
      toast.error('Vulnerability ID missing');
      return;
    }

    toast.promise(sendToVm({ vulnId: idToSend }).unwrap(), {
      loading: 'Sending to VM...',
      success: 'Ticket created in VM',
      error: (err) => err?.data?.message || 'Failed to send to VM',
    });
  };

  const handleSuppress = async () => {
    if (isAuditor) return;
    const idToSuppress = rowData?._id || vuln?._id;
    toast.promise(suppressVuln({ vulnId: idToSuppress }).unwrap(), {
      loading: 'Suppressing vulnerability...',
      success: () => {
        setModalOpen(false);
        return 'Vulnerability suppressed successfully';
      },
      error: (err) => err?.data?.message || 'Failed to suppress vulnerability',
    });
  };

  const handleUnsuppress = async () => {
    if (isAuditor) return;
    const idToUnsuppress = rowData?._id || vuln?._id;
    toast.promise(unsuppressVuln({ vulnId: idToUnsuppress }).unwrap(), {
      loading: 'Unsuppressing vulnerability...',
      success: () => {
        setModalOpen(false);
        return 'Vulnerability unsuppressed successfully';
      },
      error: (err) => err?.data?.message || 'Failed to unsuppress vulnerability',
    });
  };

  const displayAssetValue =
    data?.asset?.value ||
    vuln?.url ||
    rowData?.url ||
    rowData?.transformedRequestSnapshot?.url ||
    rowData?.evidence?.request?.url ||
    vuln?.affectedAssets?.[0]?.value ||
    'N/A';

  const assetType =
    rowData?.pentest_name ||
    rowData?.project_name ||
    rowData?.application_name ||
    'Auto-PT';

  const severity =
    vuln?.severity ||
    rowData?.severity ||
    'info';

  const state = vuln?.state || rowData?.status || rowData?.state || 'In Review';
  const isSuppressed = rowData?.isSuppressed || vuln?.isSuppressed;

  const modalTitle = title || vuln?.title || rowData?.title || 'Vulnerability Details';

  return (
    <>
      {trigger ? (
        <div
          onClick={() => setModalOpen(true)}
          className="cursor-pointer w-full"
        >
          {trigger}
        </div>
      ) : (
        <div className="flex flex-col">
          <p
            onClick={() => setModalOpen(true)}
            className="font-medium text-sm cursor-pointer hover:text-primary transition-colors truncate"
            title={modalTitle}
          >
            {modalTitle}
          </p>

        </div>
      )}

      <Modal
        className="max-w-4xl p-0 overflow-hidden gap-0"
        open={modalOpen}
        setOpen={setModalOpen}
      >
        <div className="flex flex-col max-h-[90vh]">
          {/* Main Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* ── Main Vulnerability Details ── */}
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

                        {Boolean(rowData?.cwe) && (
                          <Badge
                            variant="outline"
                            className="font-normal text-xs"
                          >
                            {typeof rowData.cwe === 'object' &&
                              rowData.cwe !== null
                              ? rowData.cwe.name || rowData.cwe.value || 'CWE'
                              : rowData.cwe}
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
                          {modalTitle}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Server className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono font-medium text-foreground truncate max-w-md">
                              {displayAssetValue}
                            </span>
                          </div>
                          {/* <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-normal"
                          >
                            {assetType}
                          </Badge> */}
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-6 pt-2">
                      {/* Description First */}
                      {(vuln?.description || rowData?.description) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            Description
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {vuln?.description || rowData?.description}
                          </p>
                        </div>
                      )}

                      {/* Steps To Reproduce Second */}
                      {(vuln?.steps_to_reproduce || rowData?.steps_to_reproduce) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            Steps To Reproduce
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {vuln?.steps_to_reproduce ||
                              rowData?.steps_to_reproduce}
                          </p>
                        </div>
                      )}

                      {(vuln?.impact || rowData?.impact) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
                            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                            Impact
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {vuln?.impact || rowData?.impact}
                          </p>
                        </div>
                      )}

                      {(vuln?.remediation || rowData?.remediation) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                            Remediation
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {vuln?.remediation || rowData?.remediation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* References */}
                    {((vuln?.references && vuln.references.length > 0) ||
                      (rowData?.references &&
                        rowData.references.length > 0)) && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <Link2 className="w-4 h-4 text-muted-foreground" />
                            References
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {(vuln?.references || rowData?.references || []).map(
                              (ref, idx) => (
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
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer Section */}
          {/* <div className="border-t border-border/50 p-3 bg-muted/10 flex justify-end items-center shrink-0 rounded-b-md">
            <div className="flex items-center gap-2">
              <AuthorityGuard forbidRoles={['Auditor']}>
                {!isSuppressed ? (
                  <CustomTooltip text="Suppress selected vulnerability to hide from dashboards and reports">
                    <ButtonWithConfirm
                      confirm={true}
                      variant="outline"
                      size="sm"
                      confirmVariant="warning"
                      confirmTitle="Suppress Vulnerability"
                      dialog="Suppressing this vulnerability will remove it from active views. Are you sure?"
                      onConfirm={handleSuppress}
                      disabled={isSuppressing}
                    >
                      {isSuppressing ? (
                        <Spinner className="size-3.5 mr-1 animate-spin" />
                      ) : (
                        <CircleMinus className="size-3.5 mr-1" />
                      )}
                      Suppress
                    </ButtonWithConfirm>
                  </CustomTooltip>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUnsuppress}
                    disabled={isUnsuppressing}
                  >
                    {isUnsuppressing ? (
                      <Spinner className="size-3.5 mr-1 animate-spin" />
                    ) : (
                      <CirclePlus className="size-3.5 mr-1" />
                    )}
                    Unsuppress
                  </Button>
                )}

                {!isSentToVm ? (
                  <ButtonWithConfirm
                    confirm={true}
                    variant="outline"
                    size="sm"
                    onConfirm={handleSendToVm}
                    disabled={isSendingToVm}
                    confirmVariant="warning"
                    confirmTitle="Create Ticket in VM"
                    dialog="Are you sure you want to send this vulnerability to Vulnerability Management? This will create a new ticket."
                    confirmButton={
                      <Button disabled={isSendingToVm}>Confirm</Button>
                    }
                  >
                    <RefreshCcw
                      size={13}
                      className={isSendingToVm ? 'animate-spin mr-1' : 'mr-1'}
                    />
                    Escalate Ticket
                  </ButtonWithConfirm>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() =>
                      window.open(
                        `/vm/vulnerability-report?id=${vuln?.universalVulnId || vuln?._id || rowData?._id}&assessmentId=${effectiveAssessmentId}`,
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
          </div> */}
        </div>
      </Modal>
    </>
  );
}

export default VulnerabilityInfoModal;