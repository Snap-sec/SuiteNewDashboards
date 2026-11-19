import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const Question = ({ question, answer }) => {
  return (
    <Card className="w-1/2">
      <CardContent className="px-10 py-5.5 lg:pe-12.5">
        <div className="flex flex-wrap md:flex-nowrap sm:flex-col md:flex-col lg:flex-row items-center gap-6 md:gap-10">
          <div className="flex flex-col gap-3">
            <div className='flex items-center gap-4'>
              <h2 className="text-xl font-semibold text-mono">
                {question}
              </h2>
              <img
                src={toAbsoluteUrl('/media/illustrations/1.svg')}
                className="dark:hidden max-h-[100px]"
                alt="Quick setup illustration"
              />
              <img
                src={toAbsoluteUrl('/media/illustrations/1-dark.svg')}
                className="light:hidden max-h-[100px]"
                alt="Quick setup illustration dark mode"
              />
            </div>
            <p className="text-sm text-secondary-foreground leading-5.5 mt-4">
              {answer}
            </p>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export { Question };
