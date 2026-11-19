import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CustomAvatarGroup } from '@/components/custom/avatar-group';
import { Badge } from '../../../../../../components/ui/badge';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const DepartmentTable = ({ title, assessments = [], isLoading }) => {
  if (isLoading) {
    return (
      <Card className="h-full w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="kt-scrollable-x-auto p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="min-w-45 h-10">
                  <Skeleton className="h-3.5 w-28" />
                </TableHead>
                <TableHead className="text-end min-w-50 h-10">
                  <Skeleton className="h-3.5 w-16 ms-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="text-start py-2">
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="text-end py-2">
                    <Skeleton className="h-4 w-28 ms-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  const sortedAssessments = [...assessments].sort(
    (a, b) => b.remediationProgress - a.remediationProgress,
  );

  // Check if there are no assessments
  const hasNoData = !assessments || assessments.length === 0;

  const renderItem = (item, index) => {
    const openVulns = item?.totalOpenVulns ?? item?.performance?.openVulns ?? 0;
    const closedVulns = item?.totalClosedVulns ?? item?.performance?.closedVulns ?? 0;
    const deptAssessments = item?.assessments || [];

    return (
      <TableRow key={index}>
        <TableCell className="text-start py-2">
          <div className="flex flex-col gap-1">
            <Link
              to={item?._id && `/vm/vulnerabilities?filters=departmentId:${item?._id}`}
              className="text-sm text-mono hover:text-primary"
            >
              {item.name}
            </Link>
            {deptAssessments.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <span>{deptAssessments.length} Assessments</span>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="text-end text-sm font-medium space-x-4">
          <div className="text-sm">
            {openVulns} <span className="text-muted-foreground text-xs">Open &nbsp; &nbsp;</span>
            {closedVulns} <span className="text-muted-foreground text-xs">Closed</span>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
          {title}
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
                This table lists departments along with their remediation progress, detailing the number of open and resolved vulnerabilities to gauge team performance.
              </p>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="kt-scrollable-x-auto p-0">
        {hasNoData ? (
          <div className="flex flex-col justify-center items-center text-muted-foreground text-sm h-[330px]">
            <p>No data available</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="min-w-45 font-normal! text-secondary-foreground! h-10">
                  Department Name
                </TableHead>
                {/* <TableHead className="min-w-40 font-normal! text-secondary-foreground! h-10">
                  Remediation
                </TableHead> */}
                {/* <TableHead className="text-end min-w-32 font-normal! text-secondary-foreground! h-10">
                  Members
                </TableHead> */}
                <TableHead className="text-end min-w-50 font-normal! text-secondary-foreground! h-10">
                  Tickets
                </TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAssessments.map((item, index) => {
                return renderItem(item, index);
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {/* <CardFooter className="justify-center">
        <Button mode="link" underlined="dashed" asChild>
          <Link to="/vm/assessments">All Assessments</Link>
        </Button>
      </CardFooter> */}
    </Card>
  );
};

export default DepartmentTable;
