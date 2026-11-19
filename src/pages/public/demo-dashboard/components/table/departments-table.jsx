import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CustomAvatarGroup } from '@/components/custom/avatar-group';
import { Badge } from '@/components/ui/badge';

const DepartmentTable = ({ title, assessments }) => {
  const sortedAssessments = [...assessments].sort(
    (a, b) => b.remediationProgress - a.remediationProgress,
  );

  // Check if there are no assessments
  const hasNoData = !assessments || assessments.length === 0;

  const renderItem = (item, index) => {
    let collaborators = item?.collaborators || [];
    let totalMembers = collaborators.length;

    const team = {
      group: collaborators?.slice(0, 3)?.map((member) => ({
        fallback: <img src={`https://robohash.org/${member?.email}`} />,
      })),
      more: {
        number: totalMembers > 3 ? totalMembers - 3 : 0,
        variant: 'text-white ring-background bg-green-500',
      },
    };

    return (
      <TableRow key={index}>
        <TableCell className="text-start py-2">
          <Link
            to={`/vm/assessment-edit?assessmentId=${item?._id}`}
            className="text-sm font-medium text-mono hover:text-primary"
          >
            {item.name}
          </Link>
        </TableCell>
        {/* <TableCell>
          <Progress
            value={item.remediationProgress}
            indicatorClassName="bg-primary"
            className="h-1"
          />
        </TableCell> */}
        <TableCell>
          <div className="flex justify-end rtl:justify-start shrink-0">
            <CustomAvatarGroup
              emails={item?.members.map((member) => member.email)}
              size={'30px'}
              more={{
                number: 10,
                variant: 'text-white ring-background bg-green-500',
              }}
            />
          </div>
        </TableCell>
        <TableCell className="text-end text-sm font-medium text-secondary-foreground space-x-1">
          <Badge variant="primary" shape="circle">
            {item.performance.openVulns}
          </Badge>

          <Badge variant="destructive" shape="circle">
            {item.performance.closedVulns}
          </Badge>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="kt-scrollable-x-auto p-0">
        {hasNoData ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
              <Building2 />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No departments found
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              There are currently no departments available. Create your first
              department to get started.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="min-w-52 font-normal! text-secondary-foreground! h-10">
                  Department Name
                </TableHead>
                {/* <TableHead className="min-w-40 font-normal! text-secondary-foreground! h-10">
                  Remediation
                </TableHead> */}
                <TableHead className="text-end min-w-32 font-normal! text-secondary-foreground! h-10">
                  Members
                </TableHead>
                <TableHead className="text-end min-w-38 font-normal! text-secondary-foreground! h-10">
                  Open/Closed vulns
                </TableHead>
                <TableHead className="w-[30px] h-10"></TableHead>
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
