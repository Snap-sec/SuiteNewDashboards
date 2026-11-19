import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import PageHeading from '@/components/custom/page-heading';
import { Skeleton } from '../../../components/ui/skeleton';
import {
  useCreateApisecScanProfileMutation,
  useDeleteApisecScanProfileMutation,
  useGetApisecScanProfileQuery,
  useUpdateApisecScanProfileMutation,
} from '../../../services/apisec/scan-profile';
import { CardProfileCard, CardProfileCardSkeleton } from './components/scan-profile-card';
import { scanProfileSchema } from './schemas/scan-profile-schema';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import ApiErrorHandler from '../../../components/common/api-error-handler';

function ScanProfile() {
  const [editingProfile, setEditingProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // API hooks
  const {
    data: profiles,
    isLoading: isLoadingProfiles,
    refetch,
    error: fetchError,
    isError,
  } = useGetApisecScanProfileQuery();
  const [createScanProfile, { isLoading: isCreating }] =
    useCreateApisecScanProfileMutation();
  const [updateScanProfile, { isLoading: isUpdating }] =
    useUpdateApisecScanProfileMutation();
  const [deleteScanProfile] = useDeleteApisecScanProfileMutation();

  const form = useForm({
    resolver: zodResolver(scanProfileSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      overrideHost: '',
      customHeaders: [],
      ratelimitingConfig: {
        requests_per_second: 10,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'customHeaders',
  });

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      toast.error('Failed to load scan profiles');
    }
  }, [fetchError]);

  // Reset form
  const handleReset = () => {
    form.reset({
      name: '',
      overrideHost: '',
      customHeaders: [],
      ratelimitingConfig: {
        requests_per_second: 10,
      },
    });
    setEditingProfile(null);
    setIsEditing(false);
  };

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      overrideHost: values.overrideHost || undefined,
      customHeaders: (values.customHeaders || [])
        .filter((h) => h.key && h.value)
        .map((h) => ({ key: h.key, value: h.value })),
      ratelimitingConfig: {
        requests_per_second:
          Number(values.ratelimitingConfig.requests_per_second) || 0,
      },
    };

    // Normalize overrideHost (ensure origin is stored)
    if (payload.overrideHost) {
      try {
        let h = payload.overrideHost;
        if (!/^https?:\/\//i.test(h)) h = 'http://' + h;
        payload.overrideHost = new URL(h).origin;
      } catch (err) {
        // leave as-is if invalid
      }
    }

    try {
      if (isEditing && editingProfile) {
        await updateScanProfile({
          payload,
          scanId: editingProfile._id,
        }).unwrap();
        toast.success('Profile updated successfully!');
      } else {
        await createScanProfile(payload).unwrap();
        toast.success('Profile created successfully!');
      }
      handleReset();
      refetch();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(
        isEditing ? 'Failed to update profile' : 'Failed to create profile',
      );
    }
  };

  const handleEdit = (profile) => {
    setEditingProfile(profile);
    setIsEditing(true);
    form.reset({
      name: profile.name || '',
      overrideHost: profile.overrideHost || '',
      customHeaders: (profile.customHeaders || []).map((h) => ({
        key: h.key,
        value: h.value,
      })),
      ratelimitingConfig: {
        requests_per_second:
          profile.ratelimitingConfig?.requests_per_second ?? 10,
      },
    });
    toast.info(`Editing profile: ${profile.name}`);
  };

  const handleDelete = async (profileId) => {
    try {
      await deleteScanProfile(profileId).unwrap();
      toast.success('Profile deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile');
    }
  };

  const handleCancel = () => {
    handleReset();
    toast.info('Edit cancelled');
  };

  if (isError) {
    return <ApiErrorHandler error={fetchError} />;
  }

  return (
    <>
      <Helmet>
        <title>WAS | Scan Profile</title>
      </Helmet>
      <div className="p-4">
        <PageHeading
          title="Scan Profiles"
          description="Configure reusable API scan profiles with headers, hosts, and request rate limits."
        />

        <AuthorityGuard forbidRoles={['Auditor']}>
          <Form {...form}>
            <form
              className="p-4 rounded-lg  border"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div>
                <p className="text-base font-semibold leading-none tracking-tight">
                  Profile Details
                </p>
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Profile Name{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter a name of this profile."
                            className="h-9"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold leading-none tracking-tight">
                    Custom Headers
                  </p>
                  <Button
                    type="button"
                    onClick={() => append({ key: '', value: '' })}
                    variant="outline"
                  >
                    <Plus /> Add Header
                  </Button>
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  {fields.map((header, idx) => (
                    <div
                      key={header.id}
                      className="flex items-center gap-4 justify-between w-full"
                    >
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`customHeaders.${idx}.key`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Header Name"
                                  className="h-9"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`customHeaders.${idx}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Header Value"
                                  className="h-9"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => remove(idx)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="overrideHost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Override Host</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="https://example.com"
                              className="h-9"
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">
                            Provide a base URL (e.g.{' '}
                            <code>https://example.com</code>) to replace the
                            origin of transformed requests.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="ratelimitingConfig.requests_per_second"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <span>Rate limit</span>
                            <span className="text-xs text-muted-foreground font-normal">
                              (requests/second)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="h-9"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ''
                                    ? ''
                                    : Number(e.target.value),
                                )
                              }
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">
                            The maximum number of requests per second that will
                            hit your web service when scans are run.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6 justify-end border-t pt-4">
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating || !form.formState.isValid}
                >
                  {isEditing ? <SquarePen /> : <Plus />}{' '}
                  {isEditing ? 'Update Profile' : 'Create Profile'}
                </Button>
              </div>
            </form>
          </Form>
        </AuthorityGuard>

        <div
          className={`mt-12 ${!isLoadingProfiles && profiles?.data?.length === 0 && 'hidden'}`}
        >
          <PageHeading
            title="Existing Scan Profiles"
            description="Existing scan profiles for API security scans."
          />
        </div>

        {isLoadingProfiles ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <CardProfileCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          profiles &&
          profiles?.data?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {profiles?.data?.map((profile) => (
                <CardProfileCard
                  key={profile._id}
                  name={profile.name}
                  overrideHost={profile.overrideHost}
                  createdAt={profile.createdAt || profile.created_at}
                  onEdit={() => handleEdit(profile)}
                  onDelete={() => handleDelete(profile._id)}
                />
              ))}
            </div>
          )
        )}

        {!isLoadingProfiles && profiles && profiles?.data?.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">No scan profiles found</p>
        )}

        

      </div>
    </>
  );
}

export default ScanProfile;
