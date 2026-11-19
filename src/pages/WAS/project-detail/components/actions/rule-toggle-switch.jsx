import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

function RuleToggleSwitch({
  ruleId,
  initialChecked,
  projectId,
  updateRule, // destructed from mutation
  disabled,
  setActiveMap,
  setLoadingRowId,
}) {
  const [checked, setChecked] = useState(initialChecked);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markFalsePositive, setMarkFalsePositive] = useState(false);

  const submitChange = async (active, markFP = false) => {
    // Optimistic UI
    setActiveMap((prev) => ({ ...prev, [ruleId]: checked }));
    setLoadingRowId(ruleId);

    setLoading(true);
    setChecked(active);

    const payload = {
      ruleId,
      active,
      ...(markFP ? { mark_false_positive: true } : {}),
    };

    try {
      await toast.promise(updateRule({ projectId, payload }).unwrap(), {
        loading: `${active ? 'Enabling' : 'Disabling'} rule...`,
        success: `Rule ${active ? 'enabled' : 'disabled'} successfully.`,
        error: () => {
          setChecked(!active); // revert on failure
          return `Failed to ${active ? 'enable' : 'disable'} rule.`;
        },
      });
    } finally {
      setLoading(false);
      setMarkFalsePositive(false);
    }
  };

  const handleSwitchChange = (value) => {
    // Disable → direct action
    if (!value) {
      setDialogOpen(true);
      return;
    }

    // Enable → show dialog
    submitChange(value);
    return;
  };

  const handleConfirm = () => {
    submitChange(false, markFalsePositive);
    setDialogOpen(false);
  };

  return (
    <>
      <Switch
        checked={checked}
        onCheckedChange={handleSwitchChange}
        disabled={disabled || loading}
      />

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable Rule</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to disable this rule.
              <div className="flex items-center gap-2 mt-4">
                <Checkbox
                  id="mark-fp"
                  checked={markFalsePositive}
                  onCheckedChange={(v) => setMarkFalsePositive(!!v)}
                />
                <label htmlFor="mark-fp" className="text-sm cursor-pointer">
                  Mark related vulns as false positives
                </label>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default RuleToggleSwitch;
