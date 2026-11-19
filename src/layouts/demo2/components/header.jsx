import { useEffect, useState } from 'react'; // Add useState to the imports

import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { useSettings } from '@/providers/settings-provider';
import { useGetNotificationsQuery } from '@/services/notify/activityApi';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { HeaderLogo } from './header-logo';
import { HeaderTopbar } from './header-topbar';
import { NotificationsSheet } from '@/partials/topbar/notifications-sheet';

export function Header() {
  // Fetch unseen notifications count
  const { data: notificationsData } = useGetNotificationsQuery({
    limit: 1,
    origin: 'all',
  });
  const notificationsUnseen = notificationsData?.unseen;

  const { settings } = useSettings();
  const scrollPosition = useScrollPosition();
  const [headerStickyOn, setHeaderStickyOn] = useState(false);

  useEffect(() => {
    const isSticky = scrollPosition > settings.layouts.demo2.headerStickyOffset;
    setHeaderStickyOn(isSticky);
  }, [scrollPosition, settings]);

  useEffect(() => {
    if (headerStickyOn === true) {
      document.body.setAttribute('data-sticky-header', 'on');
    } else {
      document.body.removeAttribute('data-sticky-header');
    }
  }, [headerStickyOn]);

  return (
    <header
      className={cn(
        'flex items-center transition-[height] shrink-0 h-(--header-height) in-data-[sticky-header=on]:pe-[var(--removed-body-scroll-bar-size,0px)]',
        settings.layouts.demo2.headerSticky &&
          headerStickyOn &&
          'transition-[height] fixed z-10 top-0 start-0 end-0 shadow-xs backdrop-blur-md bg-background/70',
      )}
    >
      <Container className="flex justify-between items-center lg:gap-4">
        <HeaderLogo />

        <div className=' flex items-center justify-center gap-2'>
          <NotificationsSheet
            trigger={
              <Button
                variant="ghost"
                mode="icon"
                shape="circle"
                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary relative"
              >
                <Bell className="size-4.5!" />
                {typeof notificationsUnseen === 'number' &&
                  notificationsUnseen > 0 && (
                    <span
                      className="
                        absolute top-1 end-0.5
                        flex items-center justify-center
                        text-[8px]
                        py-[1px]
                        px-1
                        rounded-full
                        bg-red-500
                        text-white text-xs font-bold
                        shadow
                      "
                    >
                      {notificationsUnseen}
                    </span>
                  )}
              </Button>
            }
            notificationsUnseen={notificationsUnseen}
          />
          <HeaderTopbar />
        </div>
      </Container>
    </header>
  );
}
