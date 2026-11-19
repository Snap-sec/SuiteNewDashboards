import { Fragment, useState } from 'react';
import { TimelineItems } from './timeline-item';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Timeline = ({timeline}) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const handleSwitchToggle = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  return (
    <Card className="full">
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
        <CardContent className="max-h-[560px] kt-scrollable-y-auto">
        {timeline && timeline.length > 0 ? (
                timeline.map((item, index) => (
                   <TimelineItems key={index} item={item}/>
                ))
            ) : (
                <p>No timeline data available.</p>
            )}
        </CardContent>
    </Card>
  );
};

export { Timeline };
