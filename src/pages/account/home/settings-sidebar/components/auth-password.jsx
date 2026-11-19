import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeOff, Eye, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/auth/context/auth-context';
import { isPasswordStrong } from '@/auth/forms/password-rules';
import { PasswordChecklist } from '@/auth/components/password-checklist';

const AuthPassword = ({ handleUpdate, isChangingPassword }) => {
  const { user } = useAuth();

  const [currentVisible, setCurrentVisible] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isAllFilled = Boolean(
    currentPassword.trim() &&
    newPassword.trim() &&
    confirmPassword.trim()
  );

  const isPasswordMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;

  const showMismatchError =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const isStrong = isPasswordStrong(newPassword, user?.email);

  const isFormValid = isAllFilled && isPasswordMatch && isStrong;

  const onUpdateClick = () => {
    if (!isAllFilled) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isPasswordMatch) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (!isStrong) {
      toast.error("Please ensure your new password meets all security requirements");
      return;
    }

    handleUpdate({
      currentPassword,
      newPassword,
    }, () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentVisible(false);
      setNewVisible(false);
      setConfirmVisible(false);
    });
  };

  return (
    <Card>
      <CardHeader id="auth_password">
        <CardTitle>Password</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-5">
        {/* Current Password */}
        <div className="flex items-baseline gap-2.5">
          <Label className="w-56">Current Password</Label>
          <InputWrapper>
            <Input
              type={currentVisible ? "text" : "password"}
              placeholder="Your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              mode="icon"
              onClick={() => setCurrentVisible(!currentVisible)}
            >
              {currentVisible ? <EyeOff /> : <Eye />}
            </Button>
          </InputWrapper>
        </div>

        {/* New Password */}
        <div className="flex items-baseline gap-2.5">
          <Label className="w-56">New Password</Label>
          <div className="flex-1 flex flex-col">
            <InputWrapper>
              <Input
                type={newVisible ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                mode="icon"
                onClick={() => setNewVisible(!newVisible)}
              >
                {newVisible ? <EyeOff /> : <Eye />}
              </Button>
            </InputWrapper>
            <PasswordChecklist password={newPassword} email={user?.email} />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2.5">
            <Label className="w-56">Confirm New Password</Label>
            <InputWrapper>
              <Input
                type={confirmVisible ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                mode="icon"
                onClick={() => setConfirmVisible(!confirmVisible)}
              >
                {confirmVisible ? <EyeOff /> : <Eye />}
              </Button>
            </InputWrapper>
          </div>

          {/* 🔴 Inline mismatch message */}
          {showMismatchError && (
            <p className="text-[11px] text-destructive sm:ml-58.5">
              Passwords do not match
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2.5">
          <Button
            onClick={onUpdateClick}
            disabled={!isFormValid || isChangingPassword}
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Updating Password
              </>
            ) : (
              <>
                <KeyRound className="size-4" />
                Update Password
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { AuthPassword };
