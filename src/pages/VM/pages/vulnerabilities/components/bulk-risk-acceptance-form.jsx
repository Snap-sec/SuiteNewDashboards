import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle2, FileCheck, Info, Loader2 } from 'lucide-react';

function BulkRiskAcceptanceForm({ show, onClose, onSubmit, vulnCount, initialValues, isLoading }) {
  const [reason, setReason] = useState('');
  const [justification, setJustification] = useState('');
  const [controls, setControls] = useState('');

  useEffect(() => {
    if (show) {
      setReason(initialValues?.reason || '');
      setJustification(initialValues?.businessJustification || '');
      setControls(initialValues?.compensatingControls || '');
    }
  }, [show, initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason) {
      toast.error('Reason for Acceptance is required');
      return;
    }
    if (!justification) {
      toast.error('Business Justification is required');
      return;
    }

    onSubmit({
      reason,
      businessJustification: justification,
      compensatingControls: controls,
    });
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Risk Acceptance Form</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Document the acceptance of security risks for {vulnCount} selected vulnerabilities
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vulnerability Information */}
          <div className="border rounded-md p-4 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Info size={14} /> Vulnerabilities Selected
            </h3>

            <div className="grid gap-2">
              <Label>Count</Label>
              <Input value={`${vulnCount} vulnerabilities`} disabled className="bg-muted" />
            </div>
          </div>

          {/* Acceptance Details */}
          <div className="border rounded-md p-4 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <FileCheck size={14} /> Acceptance Details
            </h3>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Acceptance <span className="text-red-500">*</span></Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Explain why this risk is being accepted rather than remediated..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="justification">Business Justification <span className="text-red-500">*</span></Label>
              <Textarea
                id="justification"
                placeholder="Provide business context and justification for accepting this risk..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="compensating">Compensating Controls (Optional)</Label>
              <Textarea
                id="compensating"
                placeholder="Describe any compensating controls in place to mitigate this risk..."
                value={controls}
                onChange={(e) => setControls(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="outline" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Save Risk Details
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default BulkRiskAcceptanceForm;
