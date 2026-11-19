import { useEffect, useState } from 'react';
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
import { getSigninSchema } from '../forms/signin-schema';
import InvisibleRecaptcha from './components/invisible-recaptcha';
import { useRef } from 'react';
import { useGetDeploymentInfoQuery } from '../../services/auth/joinApi';
import { getSafeRedirect } from '@/lib/utils';

export function SignInPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const recaptchaRef = useRef(null);

  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Get deployment info to determine if we're on onprem
  const { data: deploymentInfo, isLoading: isDeploymentLoading } = useGetDeploymentInfoQuery();
  const isOnprem = deploymentInfo?.data?.environment === 'onprem';
  const joinToken = deploymentInfo?.data?.joinToken;
  const orgName = deploymentInfo?.data?.orgName;

  // Check if we're in testing mode
  const isTestingMode = import.meta.env.VITE_TESTING;
  // Check for success message from password reset or error messages
  useEffect(() => {
    const pwdReset = searchParams.get('pwd_reset');
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (pwdReset === 'success') {
      setSuccessMessage(
        'Your password has been successfully reset. You can now sign in with your new password.',
      );
    }

    if (errorParam) {
      switch (errorParam) {
        case 'auth_callback_failed':
          setError(
            errorDescription || 'Authentication failed. Please try again.',
          );
          break;
        case 'auth_callback_error':
          setError(
            errorDescription ||
            'An error occurred during authentication. Please try again.',
          );
          break;
        case 'auth_token_error':
          setError(
            errorDescription ||
            'Failed to set authentication session. Please try again.',
          );
          break;
        default:
          setError(
            errorDescription || 'Authentication error. Please try again.',
          );
          break;
      }
    }
  }, [searchParams]);

  const form = useForm({
    resolver: zodResolver(getSigninSchema()),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  async function onSubmit(values) {
    try {
      setIsProcessing(true);
      setError(null);

      console.log('Attempting to sign in with email:', values.email);

      // Simple validation
      if (!values.email.trim() || !values.password) {
        setError('Email and password are required');
        return;
      }

      let token = null;
      // Only execute reCAPTCHA if not in testing mode
      if (!isTestingMode) {
        token = await recaptchaRef.current?.execute();
      } else {
        console.log('🧪 Testing mode: Skipping reCAPTCHA for signin');
      }

      const bypass = isTestingMode;
      const result = await login(values.email, values.password, token, bypass, values.rememberMe);

      // Resolve next path once and carry it across optional 2FA redirect.
      const nextPath = getSafeRedirect(searchParams.get('next'), '/');

      // Check if password change is forced
      if (result.forcePasswordChange === true) {
        return navigate(`/auth/force-password-change?next=${encodeURIComponent(nextPath)}`);
      }

      if (result.tfa) {
        return navigate('/auth/login-2fa', { state: { ...values, nextPath } });
      }

      if (result.account_type === 'service-provider') {
        navigate('/service-provider/orgs');
        return;
      }

      if (result.requiresOrgSelection === true) {
        navigate('/auth/orgs');
        return;
      }

      if (result.onboarding === true) {
        navigate('/auth/onboarding');
        return;
      }

      // If a regular user is sent to any organization selection path via 'next' param, 
      // override it to go to the dashboard instead.
      if (nextPath.includes('orgs')) {
        navigate('/');
        return;
      }

      // Use navigate for navigation
      navigate(nextPath);
    } catch (err) {
      console.error('Unexpected sign-in error:', err);

      let message = err?.data?.message || 'An Unexpected error occurred. Please try again';

      setError(message);
    } finally {
      setIsProcessing(false);
    }
  }


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="block w-full space-y-5"
      >
        <div className="text-center space-y-1 pb-3">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Log in with your credentials.
          </p>
          {isTestingMode && (
            <p className="text-xs text-orange-600 bg-orange-50 p-1 rounded">
              🧪 Testing Mode - reCAPTCHA will be bypassed
            </p>
          )}
        </div>

        {/* <Alert appearance="light" size="sm" close={false}>
          <AlertIcon>
            <AlertCircle className="text-primary" />
          </AlertIcon>
          <AlertTitle className="text-accent-foreground">
            Use <strong>demo@kt.com</strong> username and {` `}
            <strong>demo123</strong> password for demo access.
          </AlertTitle>
        </Alert> */}

        {/* <div className="flex flex-col gap-3.5">
          <Button
            variant="outline"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4! animate-spin" /> Signing in with
                Google...
              </span>
            ) : (
              <>
                <Icons.googleColorful className="size-5!" /> Sign in with Google
              </>
            )}
          </Button>
        </div> */}

        {/* <div className="relative py-1.5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div> */}

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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Your email" {...field} />
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
              <div className="flex justify-between items-center gap-2.5">
                <FormLabel>Password <span className="text-destructive">*</span></FormLabel>
              </div>
              <div className="relative">
                <Input
                  placeholder="Your password"
                  type={passwordVisible ? 'text' : 'password'} // Toggle input type
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
                    <EyeOff className="text-muted-foreground" />
                  ) : (
                    <Eye className="text-muted-foreground" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      className="cursor-pointer"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-[13px] font-normal cursor-pointer">
                    Keep me logged in
                  </FormLabel>
                </div>
                <Link
                  to="/auth/reset-password"
                  className="text-sm font-semibold text-foreground hover:text-primary"
                >
                  Forgot Password?
                </Link>
              </div>
            </FormItem>
          )}
        />

        <div className="w-full flex items-center justify-center mt-2">
          {/* <ReCAPTCHA
            sitekey="6LfcQmwmAAAAACYY1KKGAuPuEWawiR8AI0sxw1jp"
            onChange={handleRecaptcha}
          /> */}
          <InvisibleRecaptcha
            ref={recaptchaRef}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Spinner className="h-4 w-4 animate-spin" /> Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground flex flex-col gap-3">
          <div>
            Don't have an account?{' '}
            {isOnprem && joinToken ? (
              <Link
                to={`/auth/join?token=${joinToken}`}
                className="text-sm font-semibold text-foreground hover:text-primary"
              >
                Join {orgName || 'Organization'}
              </Link>
            ) : (
              <Link
                to="/auth/signup"
                className="text-sm font-semibold text-foreground hover:text-primary"
              >
                Sign Up
              </Link>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <a
              href="https://snapsec.co/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-foreground hover:text-primary"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </form>
    </Form>
  );
}
