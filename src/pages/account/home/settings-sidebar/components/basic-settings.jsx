import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AvatarInput } from '@/partials/custom/avatar-input';
import { subYears } from 'date-fns';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { basicSettingsSchema } from './schemas/basic-settings-schema';
import { RemoveProfilePic } from './actions/remove-profile-pic';

const BasicSettings = ({
  org,
  profile,
  loading,
  handleUpdate,
  handleProfilePictureUpdate,
  isUpdatingProfile
}) => {
  const maxSelectableDate = subYears(new Date(), 13); // 13 years ago

  // --- Form Initialization ---
  const form = useForm({
    resolver: zodResolver(basicSettingsSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      company: profile?.orgName || "",
      birthDate: profile?.birthDate || "",
      companyLogoUrl: profile?.companyLogoUrl || "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        company: profile.orgName || "",
        birthDate: profile.birthDate || "",
        companyLogoUrl: profile.companyLogoUrl || "",
      });
    }
  }, [profile, form]);

  const firstNameCount = form.watch("firstName")?.length || 0;
  const lastNameCount = form.watch("lastName")?.length || 0;

  const onSubmit = (data) => {
    handleUpdate(data, 'Basic Settings');
  };

  const isFormDirty = form.formState.isDirty;

  return (
    <Card className="pb-2.5">
      <CardHeader id="basic_settings">
        <CardTitle>Basic Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
            {/* Photo Section */}
            <div className="flex items-center flex-wrap gap-2.5">
              <Label className="flex w-full max-w-56">Photo</Label>
              <div className="flex items-center justify-between flex-wrap grow gap-2.5">
                <span className="text-sm text-secondary-foreground">
                  150x150px JPEG, PNG Image
                </span>
                <div className="relative size-16">
                  <AvatarInput
                    profile={profile}
                    onAvatarChange={handleProfilePictureUpdate}
                  />
                  
                  <RemoveProfilePic profile={profile} />
                </div>
              </div>
            </div>

            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <FormLabel className="flex w-full items-center gap-1 max-w-56 mb-2 lg:mb-0">
                      First Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <div className="flex flex-col grow gap-1">
                      <div className="flex items-center gap-2">
                        <FormControl className="grow">
                          <Input {...field} />
                        </FormControl>
                        <span
                          className={cn(
                            "text-[10px] font-normal min-w-[32px] text-right",
                            firstNameCount > 10
                              ? "text-destructive"
                              : "text-muted-foreground"
                          )}
                        >
                          {firstNameCount}/10
                        </span>
                      </div>
                      <FormMessage className="text-[10px]" />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <FormLabel className="flex w-full items-center gap-1 max-w-56 mb-2 lg:mb-0">
                      Last Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <div className="flex flex-col grow gap-1">
                      <div className="flex items-center gap-2">
                        <FormControl className="grow">
                          <Input {...field} />
                        </FormControl>
                        <span
                          className={cn(
                            "text-[10px] font-normal min-w-[32px] text-right",
                            lastNameCount > 10
                              ? "text-destructive"
                              : "text-muted-foreground"
                          )}
                        >
                          {lastNameCount}/10
                        </span>
                      </div>
                      <FormMessage className="text-[10px]" />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Other fields are currently commented out in the original, so I'll keep them out or hidden */}

            <div className="flex justify-end pt-2.5">
              <Button
                type="submit"
                disabled={isUpdatingProfile || loading || !isFormDirty}
              >
                <Save className="size-4" />
                {isUpdatingProfile ? "Saving" : "Save"} Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { BasicSettings };

