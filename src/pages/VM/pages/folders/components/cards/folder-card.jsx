import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EditButtons } from '../dropdowns/edit-buttons';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';

export function FolderCard({ id, logo, title, folders, allFolders, onClick, readOnly = false }) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col justify-between p-2.5 gap-4 relative">
        {/* Menu Buttons — hidden in readOnly (By Time / Category) tabs */}
        {!readOnly && (
          <AuthorityGuard forbidRoles={['Auditor']}>
            <div
              className="absolute top-0 right-0 m-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <EditButtons
                folders={folders}
                allFolders={allFolders}
                folderId={id}
                trigger={
                  <Button
                    variant="ghost"
                    mode="icon"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EllipsisVertical />
                  </Button>
                }
              />
            </div>
          </AuthorityGuard>
        )}

        {/* Folder Image */}
        <div className="flex items-center justify-center relative w-full">
          <img
            src={`/media/file-types/${logo}`}
            className="h-[80px] shrink-0"
            alt="folder"
          />
        </div>

        {/* Folder Title */}
        <div className="hover:text-primary text-center text-sm font-medium text-mono px-2.5 leading-5.5 whitespace-normal break-words line-clamp-2 overflow-hidden min-h-[44px]">
          {title}
        </div>
      </div>
    </Card>
  );
}

export function FolderCardSkeleton({ readOnly = false }) {
  return (
    <Card>
      <div className="flex flex-col justify-between p-2.5 gap-4 relative">
        {/* Menu Icon Placeholder */}
        {!readOnly && (
          <div className="absolute top-0 right-0 m-2 z-10">
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        )}

        {/* Folder Image Placeholder */}
        <div className="flex items-center justify-center relative w-full">
          <Skeleton className="h-[80px] w-[80px] rounded-lg" />
        </div>

        {/* Folder Title Placeholder */}
        <div className="flex flex-col items-center justify-center gap-1.5 min-h-[44px] px-2.5">
          <Skeleton className="h-3.5 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
    </Card>
  );
}

