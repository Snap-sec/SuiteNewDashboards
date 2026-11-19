import { RefreshCcw } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';


export function Error403({ message }) {
  return (
    <div className="flex items-center justify-center mt-30">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-10">
          <img
            src={toAbsoluteUrl('/media/illustrations/23.svg')}
            className="dark:hidden max-h-[160px]"
            alt="image"
          />

          <img
            src={toAbsoluteUrl('/media/illustrations/23-dark.svg')}
            className="hidden dark:block max-h-[160px]"
            alt="image"
          />
        </div>

        <span className="badge badge-primary badge-outline mb-3">
          403 Error
        </span>

        <h3 className="text-2xl font-semibold text-mono text-center mb-2">
          Access Forbidden
        </h3>

        <div className="text-base text-center text-secondary-foreground mb-10">
          {message ||
            "You don't have permission to access this resource. Please contact your administrator."}
        </div>

        <Button
          mode="link"
          underlined="dashed"
          onClick={() => window.location.reload()}
        >
          <RefreshCcw /> Try Again
        </Button>
      </div>
    </div>
  );
}