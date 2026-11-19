import { useEffect } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { getOnboardingSchema } from '@/auth/forms/onboarding-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building, Globe, LogOut } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateOrgMutation } from '@/services/auth/orgApi';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, InputWrapper } from '@/components/ui/input';

function Onboarding() {
  const { setUser, saveAuth, logout, auth } = useAuth();
  const navigate = useNavigate();

  const [createOrg, { isLoading }] = useCreateOrgMutation();

  const form = useForm({
    resolver: zodResolver(getOnboardingSchema()),
    defaultValues: {
      name: '',
      website: '',
    },
    mode: 'onChange',
  });

  const onSuccess = async (res) => {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));

    setUser(res.data);
    saveAuth(res.data);

    setTimeout(() => navigate('/'), 1000);

    return 'Organization created';
  };

  const onSubmit = (values) => {
    toast.promise(createOrg(values).unwrap(), {
      loading: 'Creating Organization',
      success: (res) => onSuccess(res),
      error: 'Failed to create the organization',
    });
  };

  // If oralready created g is redirech to page Home
  useEffect(() => {
    if (auth.orgId) navigate('/');
  }, [auth]);

  return (
    <div className="space-y-5">
      <Helmet>
        <title>Auth | Onboarding</title>
      </Helmet>

      <div className="text-center space-y-1 pb-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Set Up Your Organization
        </h1>
        <p className="text-sm text-muted-foreground">
          Almost there! Fill in your organization details to get started.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <InputWrapper>
                      <Building />
                      <Input placeholder="Enter Company Name" {...field} />
                    </InputWrapper>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company Website <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <InputWrapper>
                      <Globe />
                      <Input placeholder="Enter Company Website" {...field} />
                    </InputWrapper>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                logout();
                navigate('/auth/signin');
              }}
            >
              <LogOut className="size-4" /> Logout
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={isLoading || form.formState.isSubmitting}
            >
              Complete
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Onboarding;
