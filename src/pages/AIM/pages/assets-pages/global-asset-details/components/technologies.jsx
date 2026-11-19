import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Technologies = ({ title, className, data }) => {
  const renderItem = (item, index) => {
    return (
      <Badge key={index} variant="secondary">
        {`${item.name}:${item.version}`}
      </Badge>
    );
  };

  return (
    <div className={className}>
      {(!data || data.length === 0) ? (
        <p className="text-sm text-muted-foreground p-4">No technologies available</p>
      ) : (
        <div className="flex flex-wrap gap-2.5 p-4">
          {data.map((item, index) => {
            return renderItem(item, index);
          })}
        </div>
      )}
    </div>
  );
};

export { Technologies };
