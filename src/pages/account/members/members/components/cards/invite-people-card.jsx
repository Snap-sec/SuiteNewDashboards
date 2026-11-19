import { useState } from 'react';
import { toast } from 'sonner';
import { useInviteMemberMutation } from '@/services/auth/orgApi';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import RolesSelector from '@/components/common/roles-selector';
import Select from '@/components/custom/select';
import { UserPlus } from 'lucide-react';

const InvitePeople = ({ teams, loading }) => {
  const [invite, { isLoading: isInviting }] = useInviteMemberMutation();

  const [payload, setPayload] = useState({
    email: '',
    role: '',
    team: '',
  });

  const [resetKey, setResetKey] = useState(0);

  const handleChange = (field) => (value) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
  };

  const handleInvite = () => {
    if (!payload?.email || !payload?.role || !payload?.team)
      return toast.error('All feilds are Required!');

    toast.promise(
      invite({
        email: payload.email,
        role: payload.role,
        team: payload.team?.value,
      }).unwrap(),
      {
        loading: 'Inviting ...',
        success: (data) => {
          setPayload({ email: '', role: '', team: '' });
          setResetKey((prev) => prev + 1); // Triggers remount

          // If the API returns a message, show it, else fallback
          return data?.message || 'Member invited';
        },
        error: (err) => {
          // Try to extract the message from the error object
          return (
            err?.data?.message || err?.message || 'Failed to invite the member'
          );
        },
      },
    );
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="w-full h-[400px]" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Invite People</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-32">Email</Label>
          <Input
            type="text"
            name="email"
            placeholder="username@host.com"
            value={payload.email}
            onChange={(e) => handleChange('email')(e.target.value)}
          />
        </div>
        <div className="flex items-baseline flex-wrap gap-2.5">
          <Label className="flex w-full max-w-32">Role</Label>
          <div className="flex flex-col items-start grow gap-5">
            <RolesSelector
              value={payload.role}
              onValueChange={handleChange('role')}
              placeholder="Select Role..."
            />
          </div>
        </div>
        <div className="flex items-baseline flex-wrap gap-2.5">
          <Label className="flex w-full max-w-32">Team</Label>
          <div className="flex flex-col items-start grow gap-5">
            <Select
              key={`team-${resetKey}`}
              value={payload?.team?.value}
              options={
                loading
                  ? []
                  : teams?.map((team) => ({
                    label: team.name,
                    value: team._id,
                  }))
              }
              onChange={(option) => handleChange('team')(option)}
              placeholder="Select Team ..."
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button disabled={isInviting} onClick={handleInvite}>
          <UserPlus />
          Invite
        </Button>
      </CardFooter>
    </Card>
  );
};

export { InvitePeople };
