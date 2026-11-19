import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from "@/components/custom/button-with-confirmation";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const DeleteAccount = ({ profile, handleDelete, handleDeactivate }) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Card>
      <CardHeader id="delete_account">
        <CardTitle>Delete Account</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col lg:py-7.5 lg:gap-7.5 gap-3">
        <div className="flex flex-col gap-5">
          <div className="text-sm text-foreground">
            We regret to see you leave. Confirm account deletion below. Your
            data will be permanently removed. Thank you for being part of our
            community.{' '}
            if you still wish continue.
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox checked={confirmed} onClick={() => setConfirmed(!confirmed)} />
            <Label>Confirm deleting account</Label>
          </div>
        </div>
        <div className="flex justify-end gap-2.5">
          <ButtonWithConfirm variant="outline" disabled={!confirmed} onClick={() => handleDeactivate()} confirm={true} confirmWithInput={true} confirmOnInput={profile?.email}>
            <p>Deactivate Instead</p>
          </ButtonWithConfirm>
          <ButtonWithConfirm disabled={true} variant="destructive" onClick={() => handleDeactivate()}  confirm={true} confirmWithInput={true} confirmOnInput={profile?.email} >
            <Trash2 className="size-4" />
            Delete Account
          </ButtonWithConfirm>
        </div>
      </CardContent>
    </Card>
  );
};

export { DeleteAccount };
