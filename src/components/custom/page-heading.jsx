




import { cn } from '@/lib/utils';

function PageHeading({ title, description, className }) {
  return (
     <div className={cn("flex flex-col justify-center gap-2 mb-5", className)}>
        <h1 className="text-xl font-medium leading-none text-mono">{title}</h1>
        <span className="text-sm text-secondary-foreground">
            {description}
        </span>
    </div>
  );
}

export default PageHeading;