import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Tags = ({ title, className, data }) => {
  const renderItem = (item, index) => {
    return (
      <Badge key={index} variant="secondary">
        {item}
      </Badge>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {(!data || data.length === 0) ? (
          <p className="text-sm text-muted-foreground">No tags available</p>
        ) : (
          <div className="flex flex-wrap gap-2.5 mb-1">
            {data.map((item, index) => {
              return renderItem(item, index);
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { Tags };
