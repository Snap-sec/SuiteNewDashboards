import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/auth/context/auth-context';
import { useChangePasswordMutation } from '@/services/auth/authApi';
import { getSafeRedirect } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isPasswordStrong } from '@/auth/forms/password-rules';
import { PasswordChecklist } from '@/auth/components/password-checklist';

export function ForcePasswordChangePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, saveAuth } = useAuth();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [newVisible, setNewVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isAllFilled = Boolean(newPassword.trim() && confirmPassword.trim());
  const isPasswordMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const showMismatchError = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const isStrong = isPasswordStrong(newPassword, user?.email);
  const isFormValid = isAllFilled && isPasswordMatch && isStrong;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      if (!isStrong) {
        toast.error('Please ensure your password meets all complexity requirements');
      } else if (!isPasswordMatch) {
        toast.error('Passwords do not match');
      }
      return;
    }

    try {
      await toast.promise(
        changePassword({ newPassword }).unwrap(),
        {
          loading: 'Updating your password...',
          success: 'Password updated successfully!',
          error: (err) => {
            if (Array.isArray(err?.data?.data) && err.data.data.length > 0) {
              return err.data.data[0].msg || err.data.data[0].message;
            }
            if (Array.isArray(err?.data?.errors) && err.data.errors.length > 0) {
              return err.data.errors[0].msg || err.data.errors[0].message;
            }
            return err?.data?.message || err?.message || 'Failed to update password';
          },
        }
      );

      // Update user state and localStorage to remove forcePasswordChange flag
      const updatedUser = { ...user, forcePasswordChange: false };
      saveAuth(updatedUser);

      const nextPath = getSafeRedirect(searchParams.get('next'), '/');
      navigate(nextPath);
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <form onSubmit={handleSubmit}>
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-xl font-medium tracking-tight text-foreground">
            Reset Password
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your new password
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-xs">New Password</Label>
            <InputWrapper>
              <Input
                id="new-password"
                type={newVisible ? "text" : "password"}
                placeholder="Enter a new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                mode="icon"
                onClick={() => setNewVisible(!newVisible)}
                className="hover:bg-transparent"
              >
                {newVisible ? <EyeOff className="size-4 text-muted-foreground" /> : <Eye className="size-4 text-muted-foreground" />}
              </Button>
            </InputWrapper>
            <PasswordChecklist password={newPassword} email={user?.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-xs">Confirm New Password</Label>
            <InputWrapper>
              <Input
                id="confirm-password"
                type={confirmVisible ? "text" : "password"}
                placeholder="Re-enter a new Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                mode="icon"
                onClick={() => setConfirmVisible(!confirmVisible)}
                className="hover:bg-transparent"
              >
                {confirmVisible ? <EyeOff className="size-4 text-muted-foreground" /> : <Eye className="size-4 text-muted-foreground" />}
              </Button>
            </InputWrapper>
            {showMismatchError && (
              <p className="text-[11px] text-destructive">Passwords do not match</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-6"
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Submit
        </Button>
      </form>
    </div>
  );
}
