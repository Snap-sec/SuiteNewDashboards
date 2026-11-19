import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { timeAgo } from '../../../../../../lib/helpers';
const SecurityTimeline = ({ title, className, data }) => {


  const renderItem = (item, index) => {
    return (
        <div key={index} className={`border-l-2 ${item.borderColor}`}>
         <div className="flex gap-3 items-center ps-3 mb-0.5">
          <span className="text-xs text-secondary-foreground">
            {item.createdAt ? timeAgo(item.createdAt) : 'N/A'}
          </span>
         </div>
         <p className="text-sm font text-foreground leading-5.5 ps-3">{item.assessmentName}</p>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5 max-h-[200px] grow kt-scrollable-y-auto">
          {data.map((item, index) => {
            return renderItem(item, index);
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export { SecurityTimeline };
