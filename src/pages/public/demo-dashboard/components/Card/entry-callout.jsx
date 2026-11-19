import { Fragment } from 'react';
import { AvatarGroup } from '@/partials/common/avatar-group';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const EntryCallout = ({ className }) => {
  return (
    <Fragment>
      <style>
        {`
          .entry-callout-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/dashboard3.png')}');
          }
          .dark .entry-callout-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/dashboard3.png')}');
          }
        `}
      </style>

      <Card className={`h-full ${className}`}>
        <CardContent className="p-6 bg-[length:80%] rtl:[background-position:-70%_25%] [background-position:175%_25%] bg-no-repeat entry-callout-bg">
          <div className="flex flex-col justify-center gap-4">
            <AvatarGroup
              size="size-10"
              group={[
                { filename: '300-4.png' },
                { filename: '300-1.png' },
                { filename: '300-2.png' },
                {
                  fallback: 'S',
                  variant: 'text-white text-xs ring-background bg-green-500',
                },
              ]}
            />

            <h2 className="text-xl font-semibold text-mono">
              Download Our Vulnerability Management <br />
              Guide {' '}
              <Button mode="link" asChild className="text-xl font-semibold">
                <Link to="#">Today</Link>
              </Button>
            </h2>
            <p className="text-sm font-normal text-secondary-foreground leading-5.5">
              Download our Vulnerability Management Strategy Guide to enhance <br />
              security, streamline remediation, and build a proactive <br />
              cybersecurity defense approach today.
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button mode="link" underlined="dashed" asChild>
            <Link to="https://raw.githubusercontent.com/Snap-sec/Snap-sec.github.io/refs/heads/main/public/brochures/Snapsec%20Profile%20Brochure.pdf">Download</Link>
          </Button>
        </CardFooter>
      </Card>
    </Fragment>
  );
};

export default EntryCallout;
