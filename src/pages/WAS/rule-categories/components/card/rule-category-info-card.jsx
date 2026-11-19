import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function RuleCategoryInfoCardSkeleton() {
  return (
    <Card>
      <div className="flex flex-col justify-between p-2.5 gap-4 relative">
        <div className="flex items-center justify-center relative w-full">
          <Skeleton className="h-[80px] w-full rounded-lg shrink-0" />
        </div>
        <div className="flex justify-center px-2.5">
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      </div>
    </Card>
  );
}

export function RuleCategoryInfoCard({
  id,
  logo,
  title,
  folders,
  allFolders,
  onClick,
  logoClassName,
}) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col justify-between p-2.5 gap-4 relative">
        {/* Menu Buttons */}
        <div
          className="absolute top-0 right-0 m-2 z-10"
          onClick={(e) => e.stopPropagation()} // ✅ prevent card click
        >
          {/* <EditButtons
            folders={folders}
            allFolders={allFolders}
            folderId={id}
            trigger={
              <Button
                variant="ghost"
                mode="icon"
                onClick={(e) => e.stopPropagation()} // prevent opening when clicking menu
              >
                <EllipsisVertical />
              </Button>
            }
          /> */}
        </div>

        {/* Folder Image */}
        <div className="flex items-center justify-center relative w-full">
          <img
            src={`/media/file-types/${logo}`}
            className={`h-[80px] shrink-0 ${logoClassName || ''}`}
            alt="folder"
          />
        </div>

        {/* Folder Title */}
        <div className="hover:text-primary text-center text-sm font-medium text-mono px-2.5 leading-5.5 whitespace-normal break-words">
          {title}
        </div>
      </div>
    </Card>
  );
}
