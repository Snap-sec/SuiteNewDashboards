import { useState, useEffect, useRef } from 'react';
import { MoveLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'react-router-dom';

import { useVerifyOtpMutation } from '@/services/auth/authApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const RegisterTwoFactorAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userDetails = location.state;

  const [verifyOtp] = useVerifyOtpMutation();

  const [codeInputs, setCodeInputs] = useState(Array(4).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(60);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (secondsLeft <= 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setTimeout(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [secondsLeft]);

  const handleResendCode = () => {
    // Add your logic to resend the code here
    console.log('Resending code...');
    setSecondsLeft(60); // Reset timer
  };

  const handleInputChange = (index, value) => {
    // Allow only numeric input
    if (!/^\d*$/.test(value)) return;

    const newCodeInputs = [...codeInputs];
    newCodeInputs[index] = value;
    setCodeInputs(newCodeInputs);

    // Move to the next input if a value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to the previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !codeInputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    toast.promise(verifyOtp({ email: userDetails?.email, otp: Number(codeInputs.join('')) }).unwrap(), {
      loading: "Verifying OTP",
      success: (res) => { setTimeout(() => { navigate("/auth/signin") }, 500); return "OTP Verified"; },
      error: (err) => { return err?.data?.message || "Wrong OTP"; }
    })
  }

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
          Didn't receive a code?
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

      <Button className="grow" onClick={handleVerifyOtp}>Continue</Button>

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

export { RegisterTwoFactorAuth };
