
import { useState } from 'react';
import { SquarePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from "@/components/ui/skeleton";

function CWE({ReportDetail, isLoading}){

  if (isLoading) {
    return (
      <TableRow>
        <TableCell className="py-2 min-w-28 text-secondary-foreground font-normal">
          CWE
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
        CWE
      </TableCell>
      <TableCell className="py-3 text-foreground font-normal">
       <p>{ReportDetail?.cwe || "Not Available"}</p>
      </TableCell>

    </TableRow>
  );
}

export default CWE;