import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const IpInfoDetails = ({ title, className, data }) => {
  // Define the fields to display: key in data and label
  const fields = [
    { key: 'organization', label: 'Organisation' },
    { key: 'location', label: 'Location' },
    { key: 'country', label: 'Country' },
    { key: 'city', label: 'City' },
    { key: 'region', label: 'Region' },
    { key: 'postal', label: 'Postal' },
    { key: 'timezone', label: 'Timezone' },
  ];

  // Check if any field has a value
  const hasAnyValue = fields.some(({ key }) => data?.[key]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-1.5'>
          {!hasAnyValue ? (
            <p className='text-sm text-muted-foreground'>No Location Details available</p>
          ) : (
            fields.map(({ key, label }) => (
              <div className='flex items-center gap-4' key={key}>
                <p className='w-1/4 text-sm font-normal text-mono'>{label} :</p>
                <Badge variant="default" appearance="outline">{data?.[key] || 'Not Available'}</Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { IpInfoDetails };
