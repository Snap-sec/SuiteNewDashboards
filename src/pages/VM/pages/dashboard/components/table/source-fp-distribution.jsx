import { Shield } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const SourceFpDistribution = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="h-full w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="h-10">
                  <Skeleton className="h-3.5 w-24" />
                </TableHead>
                <TableHead className="text-end h-10">
                  <Skeleton className="h-3.5 w-32 ms-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="text-start py-3">
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell className="text-end py-3">
                    <Skeleton className="h-4 w-24 ms-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  const sourceData = data || [];

  const renderItem = (item, index) => {
    const valid = item.valid || 0;
    const fp = item.fp || 0;
    const signals = valid + fp;

    return (
      <TableRow key={index}>
        <TableCell className=" py-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-normal  text-mono ">
              {item.source || 'Unknown Source'}
            </span>
            <span className="text-xs text-muted-foreground">
              {signals} vulnerabilities
            </span>
          </div>
        </TableCell>
        <TableCell className="text-end text-sm font-medium space-x-4">
          {/* <Badge variant="secondary" appearance="outline" size="sm" >
            {valid} Valid
          </Badge>
          <Badge variant="secondary" appearance="outline" size="sm" >
            {fp} FP
          </Badge> */}

          <div className="text-sm">
            {valid} <span className="text-muted-foreground text-xs">Valid &nbsp; &nbsp;</span>
            {fp} <span className="text-muted-foreground text-xs">FP</span>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
          Vulnerability Sources Breakdown
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="About this Panel"
            popoverContent={
              <p className="text-muted-foreground">
                This table shows the distribution of vulnerabilities across different scanning sources, categorized by their validity and false positive status.
              </p>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-medium text-xs h-10">Source Name</TableHead>
              <TableHead className="text-end font-medium text-xs h-10">Status Distribution</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sourceData.length > 0 ? (
              sourceData.map((item, index) => renderItem(item, index))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-[200px] text-center text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SourceFpDistribution;
