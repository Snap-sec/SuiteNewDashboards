import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import SeverityLabel from '../../../../../../components/custom/severity-label';

const AverageAgeBySeverity = ({ data }) => {
  const ageData = data || {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  const severities = ['critical', 'high', 'medium', 'low'];

  const renderItem = (severity, index) => {
    const value = ageData[severity] || 0;
    return (
      <TableRow key={index}>
        <TableCell className="text-start py-3">
          <div className="flex items-center gap-2">
            <SeverityLabel severity={severity.charAt(0).toUpperCase() + severity.slice(1)} size="sm" />
          </div>
        </TableCell>
        <TableCell className="text-end text-sm font-medium">
          <span className="text-foreground">{value} Days</span>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
          Average Vulnerability Age by Severity
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
                This table shows the average number of days vulnerabilities have been open, categorized by their severity levels.
              </p>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-medium text-xs h-10">Severity</TableHead>
              <TableHead className="text-end font-medium text-xs h-10">Average Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {severities.map((severity, index) => renderItem(severity, index))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AverageAgeBySeverity;
