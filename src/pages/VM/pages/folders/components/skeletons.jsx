import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderCardSkeleton } from './cards/folder-card';
import { AssessmentColumnCardSkeleton } from './cards/assessment-info-card';

/** Skeleton for Page Heading (Title + Description) */
export function PageHeadingSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-7 w-48 rounded-md" />
      <Skeleton className="h-4 w-80 rounded-md" />
    </div>
  );
}

/** Skeleton for Breadcrumb Navigation Card */
export function BreadcrumbSkeleton() {
  return (
    <Card className="w-full border shadow-none">
      <CardContent className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-12 rounded" />
          <span className="text-muted-foreground/30 text-xs">/</span>
          <Skeleton className="h-4 w-20 rounded" />
          <span className="text-muted-foreground/30 text-xs">/</span>
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

/** Skeleton for Search Input Box */
export function SearchInputSkeleton() {
  return <Skeleton className="h-9 w-64 rounded-md" />;
}

/** Skeleton for Tab Triggers Bar */
export function TabsSkeleton() {
  return (
    <div className="flex items-center gap-6 border-b border-border pb-2 mb-[-1px]">
      <Skeleton className="h-6 w-24 rounded-md" />
      <Skeleton className="h-6 w-20 rounded-md" />
      <Skeleton className="h-6 w-16 rounded-md" />
    </div>
  );
}

/** Skeleton for Section Header titles (e.g. Folders, Assessments) */
export function SectionHeaderSkeleton() {
  return <Skeleton className="h-5 w-28 rounded-md mt-6 mb-2" />;
}

/** Skeleton for Add / Create Card */
export function AddCardSkeleton() {
  return (
    <Card className="border-2 border-dashed border-muted p-2.5 h-[160px] flex flex-col items-center justify-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-3.5 w-24 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </div>
    </Card>
  );
}

/** Full Page Skeleton for Folders Page */
export function FoldersPageSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Header & Search */}
      <div className="flex items-center justify-between">
        <PageHeadingSkeleton />
      </div>

      {/* Breadcrumb Skeleton */}
      <BreadcrumbSkeleton />

      {/* Tabs & Search controls */}
      <div className="flex items-end justify-between border-b border-border mb-4 pt-2">
        <TabsSkeleton />
        <div className="mb-2">
          <SearchInputSkeleton />
        </div>
      </div>

      {/* Folder Grid Skeleton */}
      <div className="grid sm:grid-cols-6 gap-5 mb-2 mt-2 2xl:grid-cols-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <FolderCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/** Full Page Skeleton for Folder Details Page */
export function FolderDetailsPageSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Header & Search */}
      <div className="flex items-center justify-between mb-4">
        <PageHeadingSkeleton />
        <SearchInputSkeleton />
      </div>

      {/* Breadcrumb */}
      <BreadcrumbSkeleton />

      {/* Folders Section */}
      <SectionHeaderSkeleton />
      <div className="grid sm:grid-cols-8 gap-5 mb-2 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <FolderCardSkeleton key={i} />
        ))}
      </div>

      {/* Assessments Section */}
      <SectionHeaderSkeleton />
      <div className="grid gap-5 mb-2 mt-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <AssessmentColumnCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
