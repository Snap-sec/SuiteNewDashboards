import { Rocket } from 'lucide-react';
import TimelineItem  from './timeline-item';
import {DateFormatter} from "@/components/custom/date-formatter"
import { Paperclip } from 'lucide-react';
import { Button } from "@/components/ui/button";

import { Card, CardContent } from '@/components/ui/card';
import appConfig from '../../../../../../config/appConfig';


const Attachment = ({ attachment }) => {
  return (
    // <TimelineItem icon={Rocket} line={true}>
      // <div className="flex flex-col">
      //   <div className="text-sm text-foreground">
      //    {text.commentText}
      //   </div>
      //   <span className="text-xs text-secondary-foreground">
      //     <DateFormatter date={text.date} />
      //   </span>
      // </div>
      <Card className="shadow-none mt-2">
        <CardContent className="lg:py-2">
          <div className="flex gap-1.5 items-center">
            <a href={`${appConfig.BASE_URL}/csm/uploads/${attachment?.uid}`} download={`${attachment?.uid}`} >
              <Button variant="ghost" mode="icon">
                <Paperclip size={16} className='text-destructive'/>
              </Button>
            </a>
            <div className="text-sm text-mono">
              {attachment?.name || "Unknown"}
            </div>
          </div>
        </CardContent>
      </Card>
    // </TimelineItem>
  );
};

export { Attachment };
