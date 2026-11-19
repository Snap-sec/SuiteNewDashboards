import { RefreshCcw } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';


export function Error500() {
  return (
    <div className="w-full flex justify-center items-center flex-col">
      <div className="mb-10">
        <img
          src={toAbsoluteUrl('/media/illustrations/20.svg')}
          className="dark:hidden max-h-[160px]"
          alt="image"
        />

        <img
          src={toAbsoluteUrl('/media/illustrations/20-dark.svg')}
          className="light:hidden max-h-[160px]"
          alt="image"
        />
      </div>

      <h3 className="text-2xl font-semibold text-mono text-center mb-2">
        Internal Server Error
      </h3>

      <div className="text-base text-center text-secondary-foreground mb-10">
        Server error occurred. Please try again later.
      </div>

      <Button
        mode="link"
        underlined="dashed"
        onClick={() => window.location.reload()}
      >
        <RefreshCcw /> Try Again
      </Button>
    </div>
  );
}