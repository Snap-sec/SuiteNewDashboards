import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ASSET_TYPES_COUNT = 14;

export default function DefaultOwnershipSkeleton() {
  return (
    <div className="py-4">
      <Card>
        {/* Header */}
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Asset Ownership Mapping
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-28" />
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.from({ length: ASSET_TYPES_COUNT }).map((_, idx) => (
                <TableRow key={idx}>
                  {/* Asset Type */}
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>

                  {/* Owner Select */}
                  <TableCell>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </TableCell>

                  {/* Team Select */}
                  <TableCell>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </TableCell>

                  {/* Department Select */}
                  <TableCell>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Footer Action */}
          <div className="flex justify-end mt-6">
            <Skeleton className="h-11 w-40 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
