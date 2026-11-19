import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { MoveLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLoginMutation } from '../../../services/auth/authApi';
import InvisibleRecaptcha from '../components/invisible-recaptcha';

const LoginTwoFactorAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [login] = useLoginMutation();

  const recaptchaRef = useRef(null);

  const { confirmOtp } = useAuth();

  const userDetails = location.state;

  const [codeInputs, setCodeInputs] = useState(Array(4).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(60);
  const inputRefs = useRef([]);

  // Timer effect
  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [secondsLeft]);

  const handleResendCode = async () => {
    const token = await recaptchaRef.current.execute();

    // Reset timer before sending OTP
    setSecondsLeft(60);

    toast.promise(
      login({
        email: userDetails?.email,
        password: userDetails?.password,
        recaptcha: token,
        remember_me: userDetails?.rememberMe,
      }).unwrap(),
      {
        loading: 'Resending OTP',
        success: 'OTP Resent',
        error: 'Failed to resent OTP',
      },
    );
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    const digits = pasteData.replace(/\D/g, '').slice(0, codeInputs.length);
    if (!digits) return;

    const newCodeInputs = [...codeInputs];
    for (let i = 0; i < codeInputs.length; i++) {
      newCodeInputs[i] = digits[i] || '';
    }
    setCodeInputs(newCodeInputs);

    const focusIndex =
      digits.length < codeInputs.length ? digits.length : codeInputs.length - 1;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleInputChange = (index, value) => {
    const digits = value.replace(/\D/g, '');

    // Handle case where multiple digits are entered at once (e.g., autofill)
    if (digits.length > 1) {
      const newCodeInputs = [...codeInputs];
      for (let i = 0; i < codeInputs.length; i++) {
        newCodeInputs[i] = digits[i] || '';
      }
      setCodeInputs(newCodeInputs);
      const focusIndex =
        digits.length < codeInputs.length
          ? digits.length
          : codeInputs.length - 1;
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newCodeInputs = [...codeInputs];
    newCodeInputs[index] = value;
    setCodeInputs(newCodeInputs);

    // Move to the next input if a value is entered
    if (value && index < codeInputs.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to the previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !codeInputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const token = await recaptchaRef.current.execute();

    toast.promise(
      confirmOtp(userDetails?.email, Number(codeInputs.join('')), token, userDetails?.rememberMe),
      {
        loading: 'Verifying OTP',
        success: (res) => {
          setTimeout(() => {
            if (res?.account_type === 'service-provider') {
              navigate('/service-provider/orgs');
              return;
            }

            if (res?.requiresOrgSelection === true) {
              navigate('/auth/orgs');
              return;
            }

            if (res?.onboarding === true) {
              navigate('/auth/onboarding');
              return;
            }

            const nextPath = userDetails?.nextPath || '/';
            if (nextPath.includes('orgs')) {
              navigate('/');
              return;
            }

            navigate(nextPath);
          }, 500);
          return 'OTP Verified';
        },
        error: (err) => {
          return err?.data?.message || 'Wrong OTP';
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-5 p-10">
      <img
        src={toAbsoluteUrl('/media/illustrations/30.svg')}
        className="dark:hidden h-20 mb-2"
        alt="Illustration"
      />

      <img
        src={toAbsoluteUrl('/media/illustrations/30-dark.svg')}
        className="light:hidden h-20 mb-2"
        alt="Dark Illustration"
      />

      <div className="text-center mb-2">
        <h3 className="text-lg font-medium text-mono mb-5">
          Verify your Email
        </h3>
        <div className="flex flex-col">
          <span className="text-sm text-secondary-foreground mb-1.5">
            Enter the verification code we sent to
          </span>
          <p className="select-none text-sm font-medium text-mono">
            {userDetails?.email}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {codeInputs.map((value, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="tel" // Use 'tel' for numeric keypad on mobile devices
            maxLength={1}
            className="size-10 shrink-0 px-0 text-center"
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
      </div>

      <div className="flex items-center justify-center mb-2">
        <span className="text-sm text-secondary-foreground me-1.5">
          Didn’t receive a code?
        </span>
        <Button
          variant="link"
          className="p-0 h-auto font-semibold text-foreground hover:text-primary disabled:text-secondary-foreground disabled:opacity-70"
          onClick={handleResendCode}
          disabled={secondsLeft > 0}
        >
          {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend'}
        </Button>
      </div>

      <InvisibleRecaptcha ref={recaptchaRef} />

      <Button
        disabled={codeInputs.some((val) => val === '')} // Disable if any input is empty
        className="grow"
        onClick={handleVerifyOtp}
      >
        Continue
      </Button>

      <Link
        to="/auth/signin"
        className="gap-2.5 flex items-center justify-center text-sm font-semibold text-foreground hover:text-primary"
      >
        <MoveLeft className="size-3.5 opacity-70" />
        Back to Login
      </Link>
    </div>
  );
};

export { LoginTwoFactorAuth };
