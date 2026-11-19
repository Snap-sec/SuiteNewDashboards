import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function EditAssetPagination({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  isFetching = false,
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const isDisabled = isLoading || isFetching;

  // Helper to generate page number buttons with group ellipsis
  const renderPageButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    let startGroup = Math.max(1, currentPage - 2);
    let endGroup = Math.min(totalPages, startGroup + maxVisible - 1);

    if (endGroup - startGroup < maxVisible - 1) {
      startGroup = Math.max(1, endGroup - maxVisible + 1);
    }

    if (startGroup > 1) {
      buttons.push(
        <Button
          key={1}
          size="sm"
          variant="ghost"
          disabled={isDisabled}
          className="size-7 p-0 text-xs text-muted-foreground"
          onClick={() => onPageChange(1)}
        >
          1
        </Button>
      );
      if (startGroup > 2) {
        buttons.push(
          <span key="dots-1" className="text-xs px-1 text-muted-foreground">
            ...
          </span>
        );
      }
    }

    for (let i = startGroup; i <= endGroup; i++) {
      buttons.push(
        <Button
          key={i}
          size="sm"
          variant="ghost"
          disabled={isDisabled}
          className={cn('size-7 p-0 text-xs text-muted-foreground', {
            'bg-accent text-accent-foreground font-semibold': currentPage === i,
          })}
          onClick={() => {
            if (currentPage !== i) onPageChange(i);
          }}
        >
          {i}
        </Button>
      );
    }

    if (endGroup < totalPages) {
      if (endGroup < totalPages - 1) {
        buttons.push(
          <span key="dots-2" className="text-xs px-1 text-muted-foreground">
            ...
          </span>
        );
      }
      buttons.push(
        <Button
          key={totalPages}
          size="sm"
          variant="ghost"
          disabled={isDisabled}
          className="size-7 p-0 text-xs text-muted-foreground"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex flex-wrap flex-col sm:flex-row justify-between items-center gap-2.5 w-full px-5 py-3 bg-card border-0 rounded-b-xl">
      <div className="flex flex-wrap items-center space-x-2.5 order-2 sm:order-1">
        {isLoading ? (
          <Skeleton className="h-8 w-44" />
        ) : (
          <>
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={String(pageSize)}
              disabled={isDisabled}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-fit h-8 text-xs">
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent side="top" className="min-w-[60px]">
                {[5, 10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-3 order-1 sm:order-2">
        {isLoading ? (
          <Skeleton className="h-8 w-60" />
        ) : (
          <>
            <div className="text-sm text-muted-foreground text-nowrap">
              {startItem} - {endItem} of {totalItems}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="size-7 p-0 text-sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={isDisabled || currentPage <= 1}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="size-4" />
                </Button>

                {renderPageButtons()}

                <Button
                  size="sm"
                  variant="ghost"
                  className="size-7 p-0 text-sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={isDisabled || currentPage >= totalPages}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EditAssetPagination;
