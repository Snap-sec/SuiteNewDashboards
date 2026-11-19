import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const Question = () => {
  return (
    <Card>
      <CardContent className="px-10 py-5.5 lg:pe-12.5">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-6 md:gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-mono">
              Who is the Threat Owner?
            </h2>
            <p className="text-sm text-secondary-foreground leading-5.5">
              The Threat Owner is the person who created the project and holds primary responsibility for identified threats. Threat Owners serve as the main point of contact for security decisions, can assign threats to team members and monitor the overall security status of the system being modeled. As project creator, a Threat Owner has full control over threat management and tracking on this project.
            </p>
          </div>
          <img
            src={toAbsoluteUrl('/media/illustrations/1.svg')}
            className="dark:hidden max-h-[140px]"
            alt="Quick setup illustration"
          />
          <img
            src={toAbsoluteUrl('/media/illustrations/1-dark.svg')}
            className="light:hidden max-h-[140px]"
            alt="Quick setup illustration dark mode"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export { Question };
