import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

export function CrashError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-10">
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
                Looks like an unexpected error has occurred.
            </h3>

            <div className="text-base text-center text-secondary-foreground mb-10 max-w-md">
                Our development team is working hard to fix this issue. Please try again later.
            </div>

            <Button
                onClick={() => window.location.reload()}
                variant="outline"
            >
                <RefreshCcw /> Reload Page
            </Button>
        </div>
    );
}
