import { Fragment } from 'react/jsx-runtime';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

export function Error500() {
  return (
    <Fragment>
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

      <Badge variant="destructive" appearance="outline" className="mb-3">
        500 Error
      </Badge>

      <h3 className="text-2xl font-semibold text-mono text-center mb-2">
        Internal Server Error
      </h3>

      <div className="text-base text-center text-secondary-foreground mb-10">
        Server error occurred. Please try again later.
      </div>

      <div className="flex items-center gap-2.5">
        <Button asChild variant="outline">
          <Link to="/">Back to Home</Link>
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCcw/> Reload Page
        </Button>
      </div>
    </Fragment>
  );
}
