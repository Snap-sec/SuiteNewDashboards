
import {Profile} from "@/components/custom/profile"
import { CustomTooltip } from '@/components/custom/tooltip';


export default function TimelineItem({ userId, email, line, children, removeSpace, userName}) {
  console.log("xxxxxxxx", userName);

  return (
    <div className="flex items-start relative">
      {line && (
        <div className="w-9 start-0 top-9 absolute bottom-0 rtl:-translate-x-1/2 translate-x-1/2 border-s border-s-input"></div>
      )}
      <div className="flex items-center justify-center shrink-0 rounded-full bg-accent/60 border border-input size-8 text-secondary-foreground">
        <CustomTooltip text={userName}>
          <Profile userId={userId} size="30px"/>
        </CustomTooltip>
      </div>
      <div className={`ps-2.5 ${!removeSpace ? 'mb-7' : ''} text-base grow`}>
        {children}
      </div>
    </div>
  );
}
