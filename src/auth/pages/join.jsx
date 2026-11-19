import { useRef, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, Eye, EyeOff, Users } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getSignupSchema } from '../forms/signup-schema';
import InvisibleRecaptcha from './components/invisible-recaptcha';
import { PasswordChecklist } from '../components/password-checklist';
import { toast } from 'sonner';
import { ContentLoader } from "@/components/common/content-loader";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useVerifyJoinTokenQuery, useCreateRegisterationMutation } from '../../services/auth/joinApi';



export function Join() {

  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');


  const [params] = useSearchParams();


  const { data: tokenData, isLoading: verifyingToken, isError: isTokenInvalid } = useVerifyJoinTokenQuery({ token: params.get("token") });
  const [createRegisteration] = useCreateRegisterationMutation();

  // Extract teams and org info from token validation response
  const availableTeams = tokenData?.data?.availableTeams || [];
  const orgName = tokenData?.data?.orgName || 'Organization';
  const requiresApproval = tokenData?.data?.requiresApproval;

  useEffect(() => {
    if (!verifyingToken) {
      if (isTokenInvalid) {
        toast.error("Invalid or expired registration link");
        navigate("/auth/signin");
      }
    }
  }, [tokenData, verifyingToken, isTokenInvalid, navigate]);

  const recaptchaRef = useRef(null);


  const form = useForm({
    resolver: zodResolver(getSignupSchema()),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      terms: false,
      account_type: 'normal',
    },
  });

  if (verifyingToken) {
    return <ContentLoader />
  }

  async function onSubmit(values) {
    try {
      setIsProcessing(true);
      setError(null);

      const token = await recaptchaRef.current.execute();

      // Register the user with team selection
      // 'none' value means no team selected, send undefined
      const teamIdToSend = selectedTeamId && selectedTeamId !== 'none' ? selectedTeamId : undefined;

      const res = await createRegisteration({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        linkToken: params.get("token"),
        teamId: teamIdToSend,
        captcha: token
      }).unwrap();

      // ERROR HANDLING
      if (res?.error?.status >= 400) {
        const errorMessage =
          res?.error?.data?.data?.[0]?.msg ||
          res?.error?.data?.message || // fallback if `msg` not present
          'Something went wrong. Please try again.';

        setError(errorMessage);
        return;
      }

      // Set success message based on approval status
      const isPending = res?.data?.approvalStatus === 'Pending';
      if (isPending) {
        setSuccessMessage(
          `Registration successful! Your account is pending approval from ${orgName} administrators. You will receive an email once your account is approved.`,
        );
      } else {
        setSuccessMessage(
          'Registration successful! Please check your email to confirm your account.',
        );
      }

      // Optionally redirect to OTP verification page after a delay
      setTimeout(() => {
        localStorage.setItem('snapsec_registration_email', values.email);
        navigate('/auth/join-2fa', { state: { ...values, isPending } });
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err?.data?.data?.at(0)?.msg || err?.data?.message || 'Unexpected error occurred',
      );
    } finally {
      setIsProcessing(false);
    }
  }



  let website_url = tokenData?.data?.orgWebsite;

  if (website_url?.startsWith?.("http://") || website_url?.startsWith?.("https://")) {
    website_url = new URL(tokenData?.data?.orgWebsite).hostname;
  }
  else {
    website_url = new URL("https://" + tokenData?.data?.orgWebsite).hostname;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="block w-full space-y-5"
      >
        <div className="text-center space-y-1 pb-3">
          <div className="flex items-center justify-center">
            <Avatar className="size-10">
              <AvatarImage className="rounded-lg"
                src={`https://img.logo.dev/${website_url}?token=pk_YDuXMfwrRe2kQtBuzc3Etg`} alt="@reui" />
            </Avatar>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{orgName}</h1>
          <p className="text-sm text-muted-foreground">
            Create your account to join the organization
          </p>
          {requiresApproval && (
            <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 p-2 rounded mt-2">
              Note: Your account will require admin approval before you can access the platform.
            </p>
          )}
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Team Selection Dropdown */}
        {availableTeams.length > 0 && (
          <FormItem>
            <FormLabel>Select Team</FormLabel>
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a team to join (optional)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">No team (join organization only)</SelectItem>
                {availableTeams.map((team) => (
                  <SelectItem key={team._id} value={team._id}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{team.name}</span>
                      {team.departmentName && (
                        <span className="text-xs text-muted-foreground">
                          ({team.departmentName})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Joining a team will give you access to team-specific assessments
            </p>
          </FormItem>
        )}
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

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-0.5 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm text-muted-foreground">
                  I agree to the and{' '}
                  <a
                    href="https://snapsec.co/privacy"
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
  );
}
