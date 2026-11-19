import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from "@/components/custom/button-with-confirmation";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck } from 'lucide-react';


const ConfirmDialog = () => {
  return (
    <div className='flex gap-3 items-center flex-col'>
      <ShieldCheck className='w-9 h-9' />
      This action will log you out of current session. You will have to login again using the new email.
    </div>
  )
}


const AuthEmail = ({ profile, handleUpdate }) => {

    const [emailInput, setEmailInput] = useState(profile?.email);

    return (
      <Card className="pb-2.5">
        <CardHeader id="auth_email">
          <CardTitle>Email</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 pt-7.5">
          <div className="w-full">
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <Label className="flex w-full max-w-56">Email</Label>
              <div className="flex flex-col items-start grow gap-7.5 w-full">
                <Input
                  className="input"
                  type="text"
                  defaultValue={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />

                {/* <div className="flex items-center gap-7.5">
                  <Label
                    htmlFor="auto-update"
                    className="text-foreground text-sm"
                  >
                    Active
                  </Label>
                  <Switch defaultChecked size="sm" />
                  <Label
                    htmlFor="auto-update"
                    className="text-foreground text-sm"
                  >
                    Primary
                  </Label>
                  <Switch size="sm" />
                </div> */}
                <span className="form-info text-foreground text-sm font-normal">Change your email and its preferences</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <ButtonWithConfirm onConfirm={() => handleUpdate({ email: emailInput })} confirm={true} confirmWithInput={true} confirmOnInput={`Change email to ${emailInput}`} dialog={<ConfirmDialog />}>Save Changes</ButtonWithConfirm>
          </div>
        </CardContent>
      </Card>
    );
};

export { AuthEmail };
