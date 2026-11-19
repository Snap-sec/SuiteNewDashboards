import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from "@/components/ui/skeleton";

function Assessment({ ReportDetail, isLoading }) {






  if (isLoading) {
    return (
      <TableRow>
        <TableCell className="py-2 min-w-28 text-secondary-foreground font-normal">
          Assessment
        </TableCell>
        <TableCell className="py-2 text-gray700 font-normal min-w-32">
          <Skeleton className="h-6 w-full" />
        </TableCell>
      </TableRow>
    );
  }



  return (
    <TableRow>
      <TableCell className="py-3 text-secondary-foreground font-normal">
        Assessment
      </TableCell>

      <TableCell className="py-2 text-foreground font-normal text-sm">
        {ReportDetail?.assessmentTitle ? (ReportDetail?.assessmentTitle || 'Unknown Assessment') : 'Unknown Assessment'}
      </TableCell>
    </TableRow>
  );
}

export default Assessment;
