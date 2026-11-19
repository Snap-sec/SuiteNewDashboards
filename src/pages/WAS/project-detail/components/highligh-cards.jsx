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
              How does quick account setup work?
            </h2>
            <p className="text-sm text-secondary-foreground leading-5.5">
              Quick account setup is a simple and fast way to get started. Just fill in your first name, last name, email, role, and team — and we’ll create your account instantly. No complicated forms, no extra steps — you're in and ready to go in seconds.
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
