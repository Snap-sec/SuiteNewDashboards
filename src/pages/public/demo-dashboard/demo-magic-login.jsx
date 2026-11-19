import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/auth/context/auth-context';
import { Mail, CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DemoMagicLogin = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [storedEmail, setStoredEmail] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // used to make sure only 1 req is sent.
  const [state, setState] = useState(false);
  const { magicLoginLead } = useAuth();

  useEffect(() => {
    const email = localStorage.getItem('demoEmail');
    if (email) setStoredEmail(email);

    setState(true);
    if (state) setTimeout(() => {verifyToken();}, 2000);
  }, [state]);


  const verifyToken = async () => {
      const token = searchParams.get("magic_token");

      if (!token) {
        setStatus('error');
        return;
      }

      try {
        await magicLoginLead({ magic_token: token });
        setStatus('success');
        
        // Redirect after showing success state
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl flex flex-col items-center text-center transition-all duration-300">
        
        {/* --- ICON STATE --- */}
        <div className="mb-6 relative">
          {status === 'verifying' && (
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75" />
              <div className="relative bg-blue-50 p-4 rounded-full text-blue-600">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-green-50 p-4 rounded-full text-green-600 animate-in zoom-in duration-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 p-4 rounded-full text-red-600 animate-in zoom-in duration-300">
              <XCircle className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* --- TEXT CONTENT --- */}
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            {status === 'verifying' && "Verifying Magic Link"}
            {status === 'success' && "Successfully Verified"}
            {status === 'error' && "Verification Failed"}
          </h2>
          
          <p className="text-sm text-gray-500">
            {status === 'verifying' && (
              <span className="flex items-center justify-center gap-2">
                Authenticating for <span className="font-medium text-gray-700">{storedEmail || 'user'}</span>
              </span>
            )}
            {status === 'success' && "Redirecting you to your dashboard..."}
            {status === 'error' && "The token is invalid or has expired."}
          </p>
        </div>

        {/* --- ERROR ACTION --- */}
        {status === 'error' && (
          <Button 
            onClick={() => navigate('/auth/signin')}
            variant="outline"
            className="w-full"
          >
            Return to Login
          </Button>
        )}

        {/* --- LOADING DECORATION --- */}
        {status === 'verifying' && (
          <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>Secure Login</span>
            <Sparkles className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoMagicLogin;