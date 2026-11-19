import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { Skeleton } from "@/components/ui/skeleton";
import { LinkIcon } from 'lucide-react';


function State({assessmentId, vulnId, ReportDetail, isLoading}){

  if (isLoading) {
    return (
      <TableRow>
        <TableCell className="py-2 min-w-28 text-secondary-foreground font-normal">
          State
        </TableCell>
        <TableCell className="py-2 text-gray700 font-normal min-w-32">
          <Skeleton className="h-6 w-full" />
        </TableCell>
      </TableRow>
    );
  }

    return(
        <TableRow>
              <TableCell className="py-2 text-secondary-foreground font-normal">
                State
              </TableCell>
              <TableCell className="py-2 text-foreground font-normaltext-sm flex gap-2 items-center">
                {ReportDetail?.state}
                {
                  ReportDetail?.duplicateVulnId && ReportDetail?.state?.toLowerCase() == "duplicate" ?
                  <Link target="_blank" to={`/vm/vulnerability-report?id=${ReportDetail?.duplicateVulnId?._id}&assessmentId=${ReportDetail?.duplicateVulnId?.assessmentId}`} className="flex items-center gap-2 ml-4 bg-orange-600/60 py-1 px-2 rounded-md cursor-pointer text-[8px]">{ReportDetail?.duplicateVulnId?.title?.slice(0,50)}{ReportDetail?.duplicateVulnId?.title?.length > 50 ? '...' : ''} {<LinkIcon className="w-3 h-3" />}</Link>
                  // <p className="flex items-center gap-2 ml-4 bg-orange-600/60 py-1 px-2 rounded-md cursor-pointer text-[9px]">{ReportDetail?.duplicateVulnId?.title?.slice(0,50)}{ReportDetail?.duplicateVulnId?.title?.length > 24 ? '...' : ''}</p>
                  :
                  ''
                }
              </TableCell>
        </TableRow>
    )
}

export default State;