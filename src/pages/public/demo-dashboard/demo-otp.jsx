import { useState, useEffect, useRef } from 'react';
import { MoveLeft } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/auth/context/auth-context';
import { toast } from 'sonner';
import { MailCheck } from 'lucide-react';

const DemoOTP = () => {
  const [codeInputs, setCodeInputs] = useState(Array(6).fill(''));
  const inputRefs = useRef([]); // 👈 Create refs for inputs
  const [storedEmail, setStoredEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyDemoOTP } = useAuth();

  useEffect(() => {
    const email = localStorage.getItem('demoEmail');
    if (email) setStoredEmail(email);
  }, []);

  const maskEmail = (email) => {
    if (!email) return 'your email';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return `${localPart[0]}****@${domain}`;
    const maskedLocal = `${localPart[0]}${localPart[1]}****${localPart.slice(-2)}`;
    return `${maskedLocal}@${domain}`;
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    const digits = pasteData.replace(/\D/g, '').slice(0, codeInputs.length);
    if (!digits) return;

    const updatedInputs = [...codeInputs];
    for (let i = 0; i < updatedInputs.length; i++) {
      updatedInputs[i] = digits[i] || '';
    }
    setCodeInputs(updatedInputs);

    const focusIndex =
      digits.length < codeInputs.length ? digits.length : codeInputs.length - 1;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleInputChange = (index, value) => {
    const digits = value.replace(/\D/g, '');

    // Handle multiple digits (e.g. paste or autofill)
    if (digits.length > 1) {
      const updatedInputs = [...codeInputs];
      for (let i = 0; i < updatedInputs.length; i++) {
        updatedInputs[i] = digits[i] || '';
      }
      setCodeInputs(updatedInputs);
      const focusIndex =
        digits.length < codeInputs.length
          ? digits.length
          : codeInputs.length - 1;
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    if (!/^[0-9]?$/.test(value)) return; // allow only digits

    const updatedInputs = [...codeInputs];
    updatedInputs[index] = value;
    setCodeInputs(updatedInputs);

    // 👇 Automatically move to next input if a digit is entered
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // 👇 Move back on delete (if empty)
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codeInputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = codeInputs.join('');
    if (otpCode.length !== 6) return toast.error('Please enter a complete 6-digit code');
    if (!storedEmail) return toast.error('Email not found. Please try again.');

    setIsLoading(true);
    try {
      const result = await verifyDemoOTP({ otp: otpCode, email: storedEmail });
      if (result) {
        toast.success('Email verified successfully! Redirecting...');
        localStorage.removeItem('demoEmail');
        const nextPath = searchParams.get('next');
        const validPaths = ['vm', 'casm', 'caim', 'vs', 'threat-modeler', 'rr'];
        if (nextPath && validPaths.includes(nextPath.toLowerCase())) {
          navigate(`/${nextPath.toLowerCase()}`);
        } else {
          navigate('/');
        }
      } else {
        toast.error('Something went wrong, please try again.');
      }
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        'OTP verification failed due to an unknown error. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center w-full'>
      <div className='flex flex-col gap-5 p-12 overflow-hidden rounded-lg shadow-lg'>
        <div className='flex items-center justify-center'>
          <MailCheck className='w-15 h-15' />
        </div>
        <div className='text-center mb-2'>
          <h3 className='text-lg font-medium text-mono mb-5'>Verify your email</h3>
          <div className='flex flex-col'>
            <span className='text-sm text-secondary-foreground mb-1.5'>
              Enter the verification code we sent to
            </span>
            <span className='text-sm font-medium text-mono'>{maskEmail(storedEmail)}</span>
          </div>
        </div>

        <div className='flex flex-wrap justify-center gap-1.5'>
          {codeInputs.map((value, index) => (
            <Input
              key={index}
              type='text'
              maxLength={1}
              inputMode='numeric'
              className='size-10 shrink-0 px-0 text-center'
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)} // 👈 Store ref
            />
          ))}
        </div>

        {/* <div className='flex items-center justify-center mb-2'>
          <span className='text-sm text-secondary-foreground me-1.5'>
            Didn’t receive a code? (37s)
          </span>
          <Link
            to='/auth/classic/login'
            className='font-semibold text-foreground hover:text-primary'>
            Resend
          </Link>
        </div> */}

        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Continue'}
        </Button>

        <Link
          to='/demo'
          className='gap-2.5 flex items-center justify-center text-sm font-semibold text-foreground hover:text-primary'>
          <MoveLeft className='size-3.5 opacity-70' />
          Back to Demo
        </Link>
      </div>
    </div>
  );
};

export default DemoOTP;
