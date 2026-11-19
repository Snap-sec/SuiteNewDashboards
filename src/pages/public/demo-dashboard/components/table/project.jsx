import { AvatarGroup } from '@/partials/common/avatar-group';
import { DropdownMenu1 } from '@/partials/dropdown-menu/dropdown-menu-1';
import { DropdownMenu2 } from '@/partials/dropdown-menu/dropdown-menu-2';
import { EllipsisVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

const Projects = ({ title, assessments }) => {
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
          <div
            className="text-sm font-medium text-mono hover:text-primary"
          >
            {item.title}
          </div>
        </TableCell>
        <TableCell>
          <Progress
            value={item.remediationProgress}
            indicatorClassName="bg-primary"
            className="h-1"
          />
        </TableCell>
        <TableCell>
          <div className="flex justify-end rtl:justify-start shrink-0">
            <CustomAvatarGroup
              emails={collaborators.map((member) => member.email)}
              size={'30px'}
              more={{
                number: 10,
                variant: 'text-white ring-background bg-green-500',
              }}
            />
          </div>
        </TableCell>
        <TableCell className="text-end text-sm font-medium text-secondary-foreground space-x-1">
          <Badge variant="destructive" shape="circle">
            {item.openVulns}
          </Badge>

          <Badge className="bg-green-500 text-white" shape="circle">
            {item.closedVulns}
          </Badge>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="kt-scrollable-x-auto p-0">
        {hasNoData ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No assessments found
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              There are currently no assessments available. Create your first
              assessment to get started.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="min-w-52 font-normal! text-secondary-foreground! h-10">
                  Assessment Name
                </TableHead>
                <TableHead className="min-w-40 font-normal! text-secondary-foreground! h-10">
                  Remediation
                </TableHead>
                <TableHead className="text-end min-w-32 font-normal! text-secondary-foreground! h-10">
                  Collaborators
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

export default Projects;
