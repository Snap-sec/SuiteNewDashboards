import { useState } from 'react';
import { FileCheck, Shield, Timer, CheckCircle2, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/helpers';
import { Modal } from '@/components/custom/modal';
import SeverityLabel from '@/components/custom/severity-label';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import RiskAcceptance from '../actions/risk-acceptance';

function EscalationDetailsModal({ trigger, escalationData = {} }) {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Risk Acceptance Details"
      description={`You are viewing escalation details for ${escalationData?.type === 'campaign' ? 'campaign' : 'vulnerability'}:`}
      trigger={trigger}
      className=" w-1/2 max-h-[95vh] overflow-y-auto"
    >
      <div>
        <div>
          <h3 className="text-sm font-semibol mb-3">
            {escalationData?.type === 'campaign' ? 'Campaign' : 'Vulnerability'}
          </h3>
          <div className="border rounded-lg p-4">
            <p className="font-medium mb-2">
              {escalationData?.type === 'campaign' ? escalationData?.campaignId?.name : escalationData?.vulnId?.title}
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              {escalationData?.type !== 'campaign' && (
                <SeverityLabel score={escalationData?.vulnId?.cvssScore} />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <p>Submitted By</p>
            <p className="font-medium">{escalationData?.requestedBy?.name}</p>
          </div>
          <div>
            <p>Submitted Date</p>
            <p className="font-medium ">
              {formatDate(escalationData?.createdAt)}
            </p>
          </div>
        </div>

        <div className=" mt-6">
          <div>
            <h3 className="text-sm font-semibold  mb-2 flex items-center gap-2">
              <FileCheck size={14} />
              Reason for Acceptance
            </h3>
            <div className="light:bg-slate-50 border light:border-slate-200 rounded-lg p-4">
              <p>{escalationData?.reason}</p>
            </div>
          </div>

          <div className=" mt-4">
            <h3 className="text-sm font-semibold  mb-2 flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Business Justification
            </h3>
            <div className="light:bg-slate-50 border light:border-slate-200 rounded-lg p-4">
              <p>{escalationData?.businessJustification}</p>
            </div>
          </div>

          {/* Compensating Controls */}
          <div className=" mt-4">
            <h3 className="text-sm font-semibold  mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Compensating Controls
            </h3>
            <div className="light:bg-slate-50 border light:border-slate-200 rounded-lg p-4">
              <p>{escalationData.compensatingControls}</p>
            </div>
          </div>

          {escalationData?.resolutionReason && (
            <div className=" mt-4">
              <h3 className="text-sm font-semibold  mb-2 flex items-center gap-2">
                {escalationData.status === 'approved' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Acceptance Reason
                  </>
                ) : (
                  <>
                     <XCircle className="w-4 h-4" />
                     Rejection Reason
                  </>
                )}
              </h3>
              <div className="light:bg-slate-50 border light:border-slate-200 rounded-lg p-4">
                <p>{escalationData.resolutionReason}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className=" flex w-full justify-end mt-4 gap-3">
          <RiskAcceptance
            escalationDetails={escalationData}
            closeParentModal={() => setOpen(false)}
          />
        </div>
      </div>
    </Modal>
  );
}

export default EscalationDetailsModal;
