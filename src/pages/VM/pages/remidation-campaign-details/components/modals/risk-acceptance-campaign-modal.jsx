import { useState } from 'react';
import {
  CheckCircle2,
  FileCheck,
  Info,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRiskAcceptVmRemediationCampaignMutation } from '@/services/vm/remidationCampaignApi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CustomTooltip } from '@/components/custom/tooltip';

export default function RiskAcceptanceCampaignModal({ campaign, trigger }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [justification, setJustification] = useState('');
  const [controls, setControls] = useState('');

  const [submitRiskAcceptance, { isLoading }] =
    useRiskAcceptVmRemediationCampaignMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason || !justification) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.promise(
      submitRiskAcceptance({
        id: campaign?._id,
        payload: {
          reason,
          businessJustification: justification,
          compensatingControls: controls,
        },
      }).unwrap(),
      {
        loading: 'Updating campaign state to Risk Accepted...',
        success: () => {
          setOpen(false);
          setReason('');
          setJustification('');
          setControls('');
          return 'Risk Acceptance Submitted Successfully';
        },
        error: (err) => err?.data?.message || 'Failed to submit request',
      },
    );
  };

  return (
    <CustomTooltip text="Risk Accept Campaign">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {
            <CustomTooltip text="Risk accept campaign">
              <Button variant="outline" size="sm" className="flex">
                <ShieldCheck className="size-4" />
              </Button>
            </CustomTooltip>
          }
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Risk Acceptance Form</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Document the acceptance of identified security vulnerabilities for
              this remediation campaign
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campaign Information */}
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Info size={14} /> Campaign Information
              </h3>

              <div className="grid gap-2">
                <Label>Campaign Name</Label>
                <Input
                  value={`${campaign?.name || ''}`}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Vulnerabilities Count</Label>
                  <Input
                    value={`${campaign?.vulnCount || 0}`}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Assets Count</Label>
                  <Input
                    value={`${campaign?.assetCount || 0}`}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>

            {/* Acceptance Details */}
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <FileCheck size={14} /> Acceptance Details
              </h3>

              <div className="grid gap-2">
                <Label htmlFor="reason">
                  Reason for Acceptance <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Explain why this risk is being accepted rather than remediated..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="justification">
                  Business Justification <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="justification"
                  placeholder="Provide business context and justification for accepting this risk..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="compensating">
                  Compensating Controls (Optional)
                </Label>
                <Textarea
                  id="compensating"
                  placeholder="Describe any compensating controls in place to mitigate this risk..."
                  value={controls}
                  onChange={(e) => setControls(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} variant="outline">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && <CheckCircle2 className="mr-2 h-4 w-4" />}
                Submit Risk Acceptance
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </CustomTooltip>
  );
}
