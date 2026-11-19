import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const TechnicalInformation = ({ changeRequestData, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent className="pt-3.5 pb-3.5 space-y-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-36" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  const items = [
    {
      label: 'Api Docs',
      info: changeRequestData?.apiDocsOrSwaggerUrl || 'N/A',
    },
    {
      label: 'Tech Stack',
      info: changeRequestData?.techStackFrameworks || 'N/A',
    },
    {
      label: 'Third-Party Integrations',
      info: changeRequestData?.thirdPartyIntegrations || 'N/A',
    },
    {
      label: 'Data Sensitivity',
      info: changeRequestData?.dataSensitivity || 'N/A',
    },
    {
      label: 'Production Impact',
      info: changeRequestData?.isProductionImpacted ? 'Yes' : 'No',
    },
    {
      label: 'Criticality',
      info: changeRequestData?.isCriticalChange ? 'Yes' : 'No',
    },
    {
      label: 'Application Name',
      info: changeRequestData?.applicationServiceName || 'N/A',
    },
  ];

  const renderItems = (item, index) => (
    <TableRow key={index} className="border-0">
      <TableCell className="text-sm text-secondary-foreground pb-3 pe-4 lg:pe-8 py-2">
        {item.label}
      </TableCell>
      {item?.label == 'Production Impact' || item?.label == 'Criticality' ? (
        <div className='px-3'> 
          <Badge
            variant={item.info == 'No' ? 'destructive' : 'success'}
            appearance="outline"
            >
              {item.info}
            </Badge>
        </div>
      ) : (
        <TableCell className="text-sm text-mono pb-3 py-2">
          {item.info}
        </TableCell>
      )}
    </TableRow>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-3.5 pb-3.5">
        <Table>
          <TableBody>{items.map(renderItems)}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { TechnicalInformation };
