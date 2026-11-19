import { DateFormatter } from '@/components/custom/date-formatter';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SquarePen,Trash2 } from 'lucide-react';
import { ButtonWithConfirm } from '../../../../components/custom/button-with-confirmation';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { Skeleton } from '@/components/ui/skeleton';

const CardProfileCardSkeleton = () => {
  return (
    <Card className="p-4">
      <div className="flex flex-col mb-3 lg:mb-6">
        <Skeleton className="h-6 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="flex items-center gap-5 mb-3.5 lg:mb-7 justify-between">
        <Skeleton className="h-4 w-36" />
      </div>

      <div className="flex items-center justify-end gap-4">
        <Skeleton className="h-9 rounded-md" />
        <Skeleton className="h-9 rounded-md" />
      </div>
    </Card>
  );
};

const CardProfileCard = ({
  name,
  overrideHost,
  createdAt,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="p-4">
        <div className="flex flex-col mb-3 lg:mb-6">
          <p className="text-lg font-media/brand text-mono hover:text-primary-active mb-px">
            {name}
          </p>
          {overrideHost && (
            <p className="text-sm text-muted-foreground break-words">Override Host: <span className="font-medium text-foreground">{overrideHost}</span></p>
          )}
        </div>

        <div className="flex items-center gap-5 mb-3.5 lg:mb-7 justify-between">
          <span className="text-sm text-secondary-foreground">
            Created At:{' '}
            <span className="text-sm font-medium text-foreground">
              <DateFormatter date={createdAt} />
            </span>
          </span>
        </div>

        <AuthorityGuard forbidRoles={['Auditor']}>
        <div className='flex items-center justify-end gap-4'>
            <Button variant="outline" onClick={onEdit}>
                <SquarePen />Edit
            </Button>

            <ButtonWithConfirm
              confirm
              onConfirm={onDelete}
              variant="outline"
              confirmTitle="Delete Profile"
              dialog="Are you sure you want to delete this profile?"
              confirmVariant="danger"
              className={"text-red-500 hover:bg-red-200/20 "}
            >
             Delete
            </ButtonWithConfirm>
     
        </div>
        </AuthorityGuard>
    </Card>
  );
};

export { CardProfileCard, CardProfileCardSkeleton };

