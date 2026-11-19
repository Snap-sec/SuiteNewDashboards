'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUpdateTwoFactorMutation } from '@/services/auth/authApi';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';

function TwoFactorToggle({ userId, initialTwoFactorAuth }) {
  const [updateTwoFactor, { isLoading }] = useUpdateTwoFactorMutation();
  const [isChecked, setIsChecked] = useState(initialTwoFactorAuth || false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState(false);

  useEffect(() => {
    setIsChecked(initialTwoFactorAuth || false);
  }, [initialTwoFactorAuth]);

  const handleCheckedChange = (checked) => {
    setPendingValue(checked);
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    toast.promise(
      updateTwoFactor({ userId, twoFactorAuth: pendingValue }).unwrap(),
      {
        loading: pendingValue
          ? 'Enabling Two-Factor Authentication...'
          : 'Disabling Two-Factor Authentication...',
        success: () => {
          setIsChecked(pendingValue);
          return pendingValue
            ? 'Two-Factor Authentication Enabled'
            : 'Two-Factor Authentication Disabled';
        },
        error: (err) => {
          return (
            err?.data?.message || 'Failed to update Two-Factor Authentication'
          );
        },
      },
    );
  };

  return (
    <AuthorityGuard roles={['Admin']}>
      <div className="flex items-center gap-2 border border-border/50 rounded-lg px-3 py-1.5 shadow-sm bg-background">
        <Label
          htmlFor="two-factor-toggle"
          className="text-sm font-medium text-foreground select-none cursor-pointer"
        >
          2FA
        </Label>
        <Switch
          id="two-factor-toggle"
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
          disabled={isLoading}
          size="sm"
        />
        <ConfirmDialog
          open={isConfirmOpen}
          setOpen={setIsConfirmOpen}
          onConfirm={handleConfirm}
          title={pendingValue ? 'Enable 2FA' : 'Disable 2FA'}
          variant="warning"
          dialog={
            <p>
              Are you sure you want to {pendingValue ? 'enable' : 'disable'}{' '}
              Two-Factor Authentication (2FA) for this user?
            </p>
          }
        />
      </div>
    </AuthorityGuard>
  );
}

export default TwoFactorToggle;
