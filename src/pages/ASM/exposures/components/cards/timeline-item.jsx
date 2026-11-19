import React from 'react';
import { HelpCircleIcon, Bot } from 'lucide-react';

export default function TimelineItem({
  line = true,
  icon: Icon,
  avatar,
  children,
  removeSpace = false,
  userName = '',
  userId = null,
}) {
  const isSystem =
    userName?.toLowerCase() === 'system' ||
    userId === 'system' ||
    (!userId && !userName && !avatar && !Icon);

  return (
    <div className="flex items-start relative">
      {line && (
        <div className="w-9 start-0 top-9 absolute bottom-0 rtl:-translate-x-1/2 translate-x-1/2 border-s border-s-input"></div>
      )}
      <div className="flex items-center justify-center shrink-0 rounded-full bg-accent/60 border border-input size-9 text-secondary-foreground overflow-hidden">
        {avatar ? (
          avatar
        ) : Icon ? (
          <Icon size={16} className="text-base text-muted-foreground" />
        ) : isSystem ? (
          <Bot size={16} className="text-base text-muted-foreground" />
        ) : (
          <HelpCircleIcon size={16} className="text-base text-muted-foreground" />
        )}
      </div>
      <div className={`ps-2.5 ${!removeSpace ? 'mb-7' : ''} text-base grow min-w-0`}>
        {children}
      </div>
    </div>
  );
}
