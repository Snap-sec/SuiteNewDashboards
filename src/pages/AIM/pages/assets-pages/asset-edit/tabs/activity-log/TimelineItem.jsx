import { Profile } from "@/components/custom/profile";
import { CustomTooltip } from '@/components/custom/tooltip';
import { Bot } from "lucide-react";

export default function TimelineItem({ userId, email, line, children, removeSpace, userName, icon: Icon, iconClassName }) {
  return (
    <div className="flex items-start relative gap-3">
      {/* Connector line */}
      {line && (
        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border/60" />
      )}

      {/* Avatar / Icon */}
      <div className="shrink-0 z-10">
        {Icon ? (
          <div className={`flex items-center justify-center rounded-full border size-8 ${iconClassName || 'bg-accent/60 text-muted-foreground border-input'}`}>
            <Icon size={14} />
          </div>
        ) : (
          <CustomTooltip text={`${userName}${email ? ` (${email})` : ''}`}>
            <div className="flex items-center justify-center shrink-0 rounded-full bg-accent/60 border border-input size-8 text-secondary-foreground">
              {userName?.toLowerCase() === "system"
                ? <Bot size={15} />
                : <Profile userId={userId} graphicsUserName={userName} size="30px" />
              }
            </div>
          </CustomTooltip>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${!removeSpace ? 'mb-6' : ''}`}>
        {children}
      </div>
    </div>
  );
}
