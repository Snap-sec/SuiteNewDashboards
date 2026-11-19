import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import EmailValidation from 'emailvalid';
import { countries } from 'countries-list';
import {
  Shield,
  ShieldCheck,
  Clock,
  Users,
  SendHorizontal,
  TrendingDown,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import InvisibleRecaptcha from '../../../../auth/pages/components/invisible-recaptcha';
import { useCrateLeadMutation } from '../../../../services/auth/authApi';

// Build sorted list of country calling codes (all countries worldwide)
const countryCallingCodes = (() => {
  const list = Object.entries(countries)
    .map(([code, item]) => ({
      code,
      name: item.name,
      phone: item.phone?.[0] ? `+${item.phone[0]}` : '',
    }))
    .filter((c) => c.phone);

  const priority = [
    '+966', // Saudi Arabia (Default)
    '+971', // UAE
    '+965', // Kuwait
    '+974', // Qatar
    '+973', // Bahrain
    '+968', // Oman
    '+1',   // US / Canada
    '+44',  // UK
    '+91',  // India
    '+92',  // Pakistan
    '+61',  // Australia
    '+49',  // Germany
    '+33',  // France
    '+65',  // Singapore
    '+81',  // Japan
    '+20',  // Egypt
    '+962', // Jordan
    '+961', // Lebanon
    '+212', // Morocco
  ];

  const unique = Array.from(new Set(list.map((c) => c.phone))).map((phone) => {
    const matching = list.filter((m) => m.phone === phone);
    const countryNames = matching.map((m) => m.name).slice(0, 2).join(', ');
    return {
      phone,
      label: `${phone} (${countryNames}${matching.length > 2 ? '...' : ''})`,
    };
  });

  return unique.sort((a, b) => {
    const aIdx = priority.indexOf(a.phone);
    const bIdx = priority.indexOf(b.phone);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return a.phone.localeCompare(b.phone, undefined, { numeric: true });
  });
})();

function FormModel({ isOpen, callback }) {
  const recaptchaRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [countryCode, setCountryCode] = useState('+966');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { demoLogin } = useAuth();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    companyEmail: '',
    companyName: '',
    referrer: document.referrer,
    recaptcha: '',
  });

  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Email validation state
  const [emailError, setEmailError] = useState('');
  const [emailValidation, setEmailValidation] = useState(null);

  const [, { isLoading }] = useCrateLeadMutation();
  const navigate = useNavigate();

  // Initialize email validator
  const ev = new EmailValidation({
    allowFreemail: true, // Allow free emails like Gmail, Yahoo
    allowDisposable: false, // Block disposable emails
  });

  // Check if all required fields are filled and email is valid
  const isFormValid =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.companyEmail.trim() !== '' &&
    formData.companyName.trim() !== '' &&
    !emailError;

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  // Modal cannot be closed by the user
  const handleOpenChange = () => {
    return false;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate email on change
    if (name === 'companyEmail') {
      validateEmail(value);
    }
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    if (!/^[0-9\s\-()]*$/.test(val)) {
      return;
    }
    setPhoneNumber(val);
    setFormData((prev) => ({
      ...prev,
      mobileNumber: val.trim() ? `${countryCode} ${val.trim()}` : '',
    }));
  };

  const handleCountryCodeChange = (newCode) => {
    setCountryCode(newCode);
    setFormData((prev) => ({
      ...prev,
      mobileNumber: phoneNumber.trim() ? `${newCode} ${phoneNumber.trim()}` : '',
    }));
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      setEmailError('');
      setEmailValidation(null);
      return;
    }

    const result = ev.check(email);
    setEmailValidation(result);

    if (!result.valid) {
      // Handle different error types
      if (result.errors.includes('invalid')) {
        setEmailError('Please enter a valid email address');
      } else if (result.errors.includes('freemail')) {
        setEmailError('Please use a company email address');
      } else if (result.errors.includes('disposable')) {
        setEmailError('Disposable email addresses are not allowed');
      } else {
        setEmailError('Invalid email address');
      }

      // Check for typo suggestions
      if (result.typo) {
        setEmailError(`Did you mean ${result.typo}?`);
      }
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async () => {
    // Final validation before submit
    if (!emailValidation?.valid) {
      toast.error('Please enter a valid company email address');
      return;
    }

    setIsSendingOtp(true);

    try {
      // Save email to localStorage for OTP component
      localStorage.setItem('demoEmail', formData.companyEmail);

      await demoLogin(formData);

      const nextPath = searchParams.get('next');

      setIsSendingOtp(false);
      if (nextPath) {
        navigate(`/demo/otp?next=${nextPath.toLowerCase()}`);
      } else {
        navigate('/demo/otp');
      }
      if (callback) {
        callback({ ...formData });
      }
    } catch (err) {
      toast.error(
        err?.data?.message || 'Registration failed. Please try again.',
      );
      setIsSendingOtp(false);
      console.error('Error:', err);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          close={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="p-0 border-0 outline-none max-w-[890px] w-[94vw] sm:w-[90vw] md:w-[94vw] lg:w-[890px] max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-[26px] shadow-2xl bg-white dark:bg-zinc-950 gap-0"
        >
          <DialogTitle className="sr-only">Start your demo</DialogTitle>
          <DialogDescription className="sr-only">
            Enter your details to receive your one-time verification code.
          </DialogDescription>

          <div className="flex flex-col md:flex-row w-full min-h-0">
            {/* Left Tech / Cyber Stats Hero Banner */}
            <div className="w-full md:w-[46%] lg:w-[48%] relative flex flex-col justify-between p-5 sm:p-7 md:p-8 lg:p-9 overflow-hidden bg-gradient-to-b from-[#0b1736] via-[#09142e] to-[#060e22] text-white select-none">
              {/* Subtle Cyber Grid Background */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />

              {/* Radial Top Corner Glow */}
              <div className="absolute -top-16 -left-16 w-40 sm:w-52 h-40 sm:h-52 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Radar Graphics in Bottom-Right Corner */}
              <div className="absolute -bottom-8 -right-8 sm:-bottom-10 sm:-right-10 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 pointer-events-none">
                <svg
                  viewBox="0 0 240 240"
                  fill="none"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Concentric rings */}
                  <circle
                    cx="180"
                    cy="180"
                    r="35"
                    stroke="#60a5fa"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                  <circle
                    cx="180"
                    cy="180"
                    r="70"
                    stroke="#60a5fa"
                    strokeWidth="1"
                    strokeOpacity="0.22"
                  />
                  <circle
                    cx="180"
                    cy="180"
                    r="110"
                    stroke="#60a5fa"
                    strokeWidth="1"
                    strokeOpacity="0.16"
                  />
                  <circle
                    cx="180"
                    cy="180"
                    r="150"
                    stroke="#60a5fa"
                    strokeWidth="1"
                    strokeOpacity="0.1"
                  />
                  <circle
                    cx="180"
                    cy="180"
                    r="190"
                    stroke="#60a5fa"
                    strokeWidth="1"
                    strokeOpacity="0.05"
                  />

                  {/* Radar beam slice */}
                  <path
                    d="M 180 180 L 180 40 A 140 140 0 0 0 81 81 Z"
                    fill="url(#radarGradient)"
                  />
                  <line
                    x1="180"
                    y1="180"
                    x2="81"
                    y2="81"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                  />

                  <defs>
                    <radialGradient
                      id="radarGradient"
                      cx="180"
                      cy="180"
                      r="140"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Top Branding & Headline */}
              <div className="relative z-10">
                {/* Shield Badge */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-400/25 flex items-center justify-center shadow-inner">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>

                <div className="text-[11px] sm:text-xs font-semibold text-slate-300 tracking-wide mt-3 sm:mt-4">
                  Snapsec Suite
                </div>

                <h2 className="text-lg sm:text-2xl md:text-[25px] lg:text-[27px] font-bold text-white tracking-tight leading-[1.25] mt-2 sm:mt-2.5">
                  See your attack surface before attackers do.
                </h2>

                <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed mt-2 sm:mt-3.5 font-normal">
                  A quick walkthrough of live vulnerability tracking, asset discovery, and remediation — set up for your team.
                </p>
              </div>

              {/* Bottom Section with Value Metrics & Charts */}
              <div className="relative z-10 mt-5 sm:mt-7 md:mt-8 pt-4 sm:pt-6 border-t border-white/10 space-y-3 sm:space-y-4">
                {/* Stat 1: Vulnerabilities Triaged + Mini Severity Breakdown Bar */}
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="w-full">
                    <div className="text-xs sm:text-sm font-bold text-white leading-tight">4,200+</div>
                    <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                      vulnerabilities triaged every month
                    </div>
                    {/* Mini Severity Breakdown Chart Bar */}
                    <div className="mt-1.5 flex h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-slate-800/80">
                      <div className="bg-red-500 w-[16%]" title="Critical" />
                      <div className="bg-orange-500 w-[28%]" title="High" />
                      <div className="bg-amber-400 w-[36%]" title="Medium" />
                      <div className="bg-blue-400 w-[20%]" title="Low" />
                    </div>
                  </div>
                </div>

                {/* Stat 2: MTTR Velocity + Mini Sparkline */}
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white leading-tight">3.1x</span>
                      <span className="inline-flex items-center text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1 rounded">
                        <TrendingDown className="w-3 h-3 mr-0.5" /> 68% MTTR
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                      faster mean time to remediation
                    </div>
                  </div>
                </div>

                {/* Stat 3: Security Teams Onboard */}
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white leading-tight">600+</div>
                    <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                      security teams already onboard
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Section */}
            <div className="flex-1 p-5 sm:p-7 md:p-8 lg:p-9 flex flex-col justify-between bg-white dark:bg-zinc-950 text-foreground relative">
              <div>
                {/* Header */}
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Start your demo
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Enter your work details to get instant demo access.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  className="space-y-3 sm:space-y-3.5 md:space-y-4 mt-4 sm:mt-5"
                >
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        First name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Jordan"
                        className="h-9 sm:h-10 px-3 sm:px-3.5 text-xs sm:text-sm rounded-lg border-slate-200 dark:border-zinc-800 focus-visible:border-primary"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        Last name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <Input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Reyes"
                        className="h-9 sm:h-10 px-3 sm:px-3.5 text-xs sm:text-sm rounded-lg border-slate-200 dark:border-zinc-800 focus-visible:border-primary"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Phone number
                      </label>
                      <span className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-normal">
                        optional
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={countryCode}
                        onValueChange={handleCountryCodeChange}
                      >
                        <SelectTrigger className="w-[82px] sm:w-[88px] h-9 sm:h-10 px-2 sm:px-3 rounded-lg border-slate-200 dark:border-zinc-800 bg-background text-xs font-medium shrink-0 focus-visible:border-primary">
                          <SelectValue placeholder="+966" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 z-50">
                          {countryCallingCodes.map((item) => (
                            <SelectItem key={item.phone} value={item.phone}>
                              <span className="font-mono text-xs">{item.phone}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {item.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        type="tel"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="501 234 567"
                        className="h-9 sm:h-10 px-3 sm:px-3.5 text-xs sm:text-sm rounded-lg border-slate-200 dark:border-zinc-800 flex-1 focus-visible:border-primary"
                      />
                    </div>
                  </div>

                  {/* Company Email */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      Company email <span className="text-red-500 font-bold">*</span>
                    </label>
                    <Input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      placeholder="jordan@company.com"
                      className={`h-9 sm:h-10 px-3 sm:px-3.5 text-xs sm:text-sm rounded-lg border-slate-200 dark:border-zinc-800 focus-visible:border-primary ${
                        emailError ? 'border-red-500 focus-visible:border-red-500' : ''
                      }`}
                    />
                    {emailError ? (
                      <p className="text-[11px] text-red-500 mt-1">{emailError}</p>
                    ) : (
                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        We'll send a 6-digit verification code (OTP) to your work email.
                      </p>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      Company name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <Input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Acme Inc."
                      className="h-9 sm:h-10 px-3 sm:px-3.5 text-xs sm:text-sm rounded-lg border-slate-200 dark:border-zinc-800 focus-visible:border-primary"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1.5 sm:pt-2">
                    <Button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isSendingOtp || isLoading || !isFormValid}
                      className={`w-full h-10 sm:h-11 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
                        isFormValid
                          ? 'bg-primary hover:bg-primary/80 text-white cursor-pointer active:scale-[0.99]'
                          : 'bg-primary/60 text-white/80 cursor-not-allowed'
                      }`}
                    >
                      {isSendingOtp ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending verification code...</span>
                        </>
                      ) : (
                        <>
                          <SendHorizontal className="w-4 h-4" />
                          <span>Start demo</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Footnote */}
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed mt-2 sm:mt-2.5">
                    No credit card required. Enter your 6-digit OTP on the next screen to log in.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <InvisibleRecaptcha ref={recaptchaRef} />
    </>
  );
}

export default FormModel;


