import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toAbsoluteUrl } from '@/lib/helpers';
import { RefreshCcw, ArrowLeft } from 'lucide-react';

export function Error404() {
  const navigate = useNavigate();
  return (
    <>
      <div className="mb-10">
        <img
          src={toAbsoluteUrl('/media/illustrations/19.svg')}
          className="dark:hidden max-h-[160px]"
          alt="image"
        />

        <img
          src={toAbsoluteUrl('/media/illustrations/19-dark.svg')}
          className="hidden dark:block max-h-[160px]"
          alt="image"
        />
      </div>

      <span className="badge badge-primary badge-outline mb-3">404 Error</span>

      <h3 className="text-2xl font-semibold text-mono text-center mb-2">
        We have lost this page
      </h3>

      <div className="text-base text-center text-secondary-foreground mb-10 max-w-md mx-auto">
        The requested page is missing. Check the URL.
      </div>

      <div className="flex items-center gap-2.5 justify-center">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft /> Go Back
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCcw /> Reload Page
        </Button>
      </div>
    </>
  );
}
