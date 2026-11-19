import { useState } from 'react';
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
import RolesSelector from '@/components/common/roles-selector';
import { useCreateUserMutation } from '@/services/auth/authApi';
import { toast } from 'sonner';
import Select from "@/components/custom/select";
import InputWithCopy from '@/components/custom/input-with-copy';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const QuickAccountSetup = ({ teams, loading }) => {
  const [createUser] = useCreateUserMutation();

  const [generatedPassword, setGeneratedPassword] = useState("");

  // ✅ STORE PRIMITIVES, NOT OBJECTS
  const [payload, setPayload] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    team: "",
  });

  const handleChange = (field) => (value) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(payload.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!payload.firstName || !payload.lastName || !payload?.role || !payload?.team)
      return toast.error("All feilds are Required!")

    toast.promise(
      createUser({
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        teamId: payload.team,
      }).unwrap(),
      {
        loading: "Inviting...",
        success: (res) => {
          setGeneratedPassword(res?.data?.password);
          return res?.message || "Member invited";
        },
        error: (err) =>
          err?.data?.message || err?.message || "Failed to invite the member",
      }
    );
  };

  if (loading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quick Account Setup</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex items-baseline gap-2.5">
          <Label className="w-32">Email</Label>
          <Input
            type="email"
            placeholder="username@host.com"
            value={payload.email}
            onChange={(e) => handleChange("email")(e.target.value)}
          />
        </div>

        {/* First Name */}
        <div className="flex items-baseline gap-2.5">
          <Label className="w-32">First Name</Label>
          <Input
            value={payload.firstName}
            placeholder="John"
            onChange={(e) => handleChange("firstName")(e.target.value)}
          />
        </div>

        {/* Last Name */}
        <div className="flex items-baseline gap-2.5">
          <Label className="w-32">Last Name</Label>
          <Input
            value={payload.lastName}
            placeholder="Doe"
            onChange={(e) => handleChange("lastName")(e.target.value)}
          />
        </div>

        {/* Role */}
        <div className="flex items-baseline gap-2.5">
          <Label className="w-32">Role</Label>
          <RolesSelector
            value={payload.role}
            onValueChange={handleChange("role")}
            placeholder="Select Role..."
          />
        </div>

        {/* Team */}
        <div className="flex items-baseline gap-2.5">
          <Label className="w-32">Team</Label>
          <Select
            value={payload.team}
            options={teams?.map((team) => ({
              label: team.name,
              value: team._id,
            }))}
            placeholder="Select Team..."
            onChange={(option) =>
              handleChange("team")(option?.value)
            }
          />
        </div>

        {/* Generated Password */}
        {generatedPassword && (
          <div className="flex items-baseline gap-2.5 w-full" >
            <Label className="w-32">Generated Password</Label>
            <InputWithCopy value={generatedPassword} className="w-full" />
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-end">
        <Button onClick={handleCreateUser}>
          <Plus />
          Create Account
        </Button>
      </CardFooter>
    </Card>
  );
};

export { QuickAccountSetup };
