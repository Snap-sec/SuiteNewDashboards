import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinners';
import { useGetMemberInviteDetailsQuery } from '../../services/auth/authApi';
import { getSignupSchema } from '../forms/signup-schema';
import InvisibleRecaptcha from './components/invisible-recaptcha';
import Select from "@/components/custom/select";
import { Helmet } from 'react-helmet';
import { PasswordChecklist } from '../components/password-checklist';


export function SignUpPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [params, setParams] = useSearchParams();
  const inviteId = params.get('invite');

  const { data, isLoading: isLoadingInivite } = useGetMemberInviteDetailsQuery({
    inviteId,
  });


  const options = [
    { label: "Normal", value: "normal" },
    { label: "Service Provider", value: "service-provider" },
  ];


  const recaptchaRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(getSignupSchema()),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      account_type: 'normal',
      terms: false,
    },
  });

  useEffect(() => {
    if (data?.data?.email) {
      // set the email field to the invited user's email
      form.setValue('email', data?.data?.email, { shouldValidate: true });
    }
    // invited users are always normal accounts
    if (inviteId) {
      form.setValue('account_type', 'normal');
    }
  }, [data, inviteId]);

  async function onSubmit(values) {
    try {
      setIsProcessing(true);
      setError(null);

      // return setParams(({ showReason: true }));

      const token = await recaptchaRef.current.execute();

      // Register the user with Supabase
      // Prepare registration payload
      const registrationPayload = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        account_type: values.account_type,
        recaptcha: token,
      };

      console.log("Registration payload:", registrationPayload);

      // Add inviteId to payload if it exists
      if (inviteId) {
        registrationPayload.inviteId = inviteId;
      }

      const res = await register(registrationPayload);

      // ERROR HANDLING
      if (res?.error?.status >= 400) {
        const errorMessage =
          res?.error?.data?.data?.[0]?.msg ||
          res?.error?.data?.message || // fallback if `msg` not present
          'Something went wrong. Please try again.';

        setError(errorMessage);
        return;
      }



      // Set success message and metadata
      setSuccessMessage(
        'Registration successful! Please check your email to confirm your account.',
      );

      // After successful registration, you might want to update the user profile
      // with additional metadata (firstName, lastName, etc.)

      // Optionally redirect to login page after a delay
      setTimeout(() => {
        navigate('/auth/register-2fa', { state: values });
      }, 500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during registration. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div>
      {isLoadingInivite && inviteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Spinner className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      <Helmet>
        <title>Auth | Sign Up</title>
      </Helmet>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="block w-full space-y-5"
        >
          <div className="text-center space-y-1 pb-3">
            <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
            <p className="text-sm text-muted-foreground">
              Create your account to get started
            </p>
          </div>

          {error && (
            <Alert
              variant="destructive"
              appearance="light"
              onClose={() => setError(null)}
            >
              <AlertIcon>
                <AlertCircle />
              </AlertIcon>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          {successMessage && (
            <Alert appearance="light" onClose={() => setSuccessMessage(null)}>
              <AlertIcon>
                <Check />
              </AlertIcon>
              <AlertTitle>{successMessage}</AlertTitle>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your email address"
                    type="email"
                    {...field}
                    disabled={!!data?.data?.email} // disable if email came from invite
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password <span className="text-destructive">*</span></FormLabel>
                <div className="relative">
                  <Input
                    placeholder="Create a password"
                    type={passwordVisible ? 'text' : 'password'}
                    {...field}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    mode="icon"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  >
                    {passwordVisible ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <PasswordChecklist
                  password={field.value}
                  email={form.watch('email')}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password <span className="text-destructive">*</span></FormLabel>
                <div className="relative">
                  <Input
                    placeholder="Confirm your password"
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    {...field}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    mode="icon"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  >
                    {confirmPasswordVisible ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />


          {!inviteId && (
            <FormField
              control={form.control}
              name="account_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <div className="relative">
                    <Select
                      options={options}
                      placeholder="Select Account Type"
                      value={field?.value}
                      onChange={(option) => {
                        console.log("changing payload: ", option);
                        field.onChange(option.value);
                      }}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}


          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-0.5 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="hover: cursor-pointer"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm text-muted-foreground">
                    I agree to the and{' '}
                    <a
                      href="https://snapsec.co/privacy-policy"
                      target='_blank'
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-foreground hover:text-primary"
                    >
                      Privacy Policy
                    </a>{' '}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />







          <InvisibleRecaptcha ref={recaptchaRef} />

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4 animate-spin" /> Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/auth/signin"
              className="text-sm font-semibold text-foreground hover:text-primary"
            >
              Sign In
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
