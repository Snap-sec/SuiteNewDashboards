import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

import { Profile } from '@/components/custom/profile';
import { Skeleton } from "@/components/ui/skeleton";

function Owner({ ReportDetail, isLoading}) {
  

  if (isLoading) {
    return (
      <TableRow>
        <TableCell className="py-2 min-w-28 text-secondary-foreground font-normal">
          Owner
        </TableCell>
        <TableCell className="py-2 text-gray700 font-normal min-w-32">
          <Skeleton className="h-6 w-full" />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="py-2 min-w-28 text-secondary-foreground font-normal">
        Owner
      </TableCell>

      <TableCell className="py-2 text-gray700 font-normal min-w-32 text-sm">
         <Profile
            name={ReportDetail?.assignee?.name || 'Unknown'}
            email={ReportDetail?.assignee?.email}
          />
      </TableCell>
    </TableRow>
  );
}


export default Owner;
