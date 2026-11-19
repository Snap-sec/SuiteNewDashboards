
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from "@/components/ui/skeleton";

function AffectedAsset({ReportDetail, isLoading}){


   if (isLoading) {
    return (
      <TableRow>
        <TableCell className="py-2 min-w-28 text-secondary-foreground font-normal">
          Affected Asset
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
                 Affected Asset
              </TableCell>
              <TableCell className="py-2 text-foreground font-normaltext-sm">
                  <div className='flex items-center gap-1'>
                    {(!ReportDetail?.affectedAssets || !Array.isArray(ReportDetail.affectedAssets) || !ReportDetail.affectedAssets.length || !ReportDetail.affectedAssets[0]?.value) ? (
                      <p>No Associated Asset</p>
                    ) : (
                      <>
                        <p>
                          [{ReportDetail?.affectedAssets?.at(0)?.type}] -
                        </p>
                        <p>
                          {ReportDetail?.affectedAssets?.at(0)?.value?.length > 20 ? `${ReportDetail?.affectedAssets?.at(0)?.value?.substring(0, 20)}...` : ReportDetail?.affectedAssets?.at(0)?.value}
                        </p>
                      </>
                    )}
                  </div>
              </TableCell>

        </TableRow>
    )
}

export default AffectedAsset;