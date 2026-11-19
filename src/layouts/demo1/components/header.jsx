import { useEffect, useState } from 'react';
import { SearchDialog } from '@/partials/dialogs/search/search-dialog';
import { AppsDropdownMenu } from '@/partials/topbar/apps-dropdown-menu';
import { ChatSheet } from '@/partials/topbar/chat-sheet';
import { UserDropdownMenu } from '@/partials/custom/user-dropdown-menu';
import {
  Bell,
  Home,
  LayoutGrid,
  Menu,
  MessageCircleMore,
  Search,
  SquareChevronRight,
  Calendar,
} from 'lucide-react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Container } from '@/components/common/container';
import { Breadcrumb } from './breadcrumb';
import { HeaderBreadcrumb } from './header-breadcrumb';
import { MegaMenu } from './mega-menu';
import { MegaMenuMobile } from './mega-menu-mobile';
import { SidebarMenu } from './sidebar-menu';
import { ProductSwitch } from '@/components/custom/product-switch';
import { Profile } from "@/components/custom/profile";
import { useAuth } from '@/auth/context/auth-context';
import { NotificationsSheet } from '@/partials/topbar/notifications-sheet';
// import { NotificationsSheet } from "@/components/custom/notifications/notification-sheet"
import { useGetNotificationsQuery } from '@/services/notify/activityApi';
import { CircleAlert } from 'lucide-react';
import SearchCommandPalette from '../../../components/common/search-snapsec-docs-input-field';
import DemoModal from '@/components/custom/demo/demo-model';


function useSegment(index) {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const seg = segments[index];
  if (seg === 'sca-ui' || seg?.startsWith('sca')) {
    return 'sca';
  }
  if (seg === 'ui-sast' || seg?.startsWith('sast')) {
    return 'sast';
  }
  if (seg === 'csp-m') {
    return 'cspm';
  }
  return seg;
}

export function Header() {
  const [isSidebarSheetOpen, setIsSidebarSheetOpen] = useState(false);
  const [, setIsMegaMenuSheetOpen] = useState(false);
  const { user } = useAuth();
  const { pathname } = useLocation();
  const mobileMode = useIsMobile();
  const segment = useSegment(0);
  const logoMap = {
    apt: 'autopt',
    assetinventory: 'aim',
    caim: 'aim',
    aim: 'aim',
    casm: 'asm',
    asm: 'asm',
    vm: 'vm',
  };
  const logoSlug = logoMap[segment] || segment;

  const scrollPosition = useScrollPosition();
  const headerSticky = scrollPosition > 0;

  // Fetch unseen notifications count
  const { data: notificationsData } = useGetNotificationsQuery({ limit: 1, origin: 'all' });
  const notificationsUnseen = notificationsData?.unseen;

  // Check if user is a demo user
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setIsDemoUser(userData?.is_demo_account === true);
      }
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
    }
  }, []);

  // Licence expiry countdown state (shown only when <= 7 days remaining)
  const [countdown, setCountdown] = useState(null);

  // Helper to zero-pad time units
  const pad = (value) => String(value).padStart(2, '0');

  // Close sheet when route changes
  useEffect(() => {
    setIsSidebarSheetOpen(false);
    setIsMegaMenuSheetOpen(false);
  }, [pathname]);


  // Compute and update countdown until licence expiry when within 7 days
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const expiryString = parsed?.licenceExpiry || parsed?.licenseExpiry;
      if (!expiryString) return;

      const expiryDate = new Date(expiryString);
      if (isNaN(expiryDate.getTime())) return;

      const updateCountdown = () => {
        const now = new Date();
        const diffMs = expiryDate.getTime() - now.getTime();

        if (diffMs <= 0) {
          setCountdown(null);
          return;
        }

        const msInDay = 24 * 60 * 60 * 1000;
        const daysRemainingFloat = diffMs / msInDay;

        if (daysRemainingFloat <= 30) {
          const totalSeconds = Math.floor(diffMs / 1000);
          const days = Math.floor(totalSeconds / 86400);
          const hours = Math.floor((totalSeconds % 86400) / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          setCountdown({ days, hours, minutes, seconds });
        } else {
          setCountdown(null);
        }
      };

      updateCountdown();
      const intervalId = setInterval(updateCountdown, 1000);
      return () => clearInterval(intervalId);
    } catch {
      // Fail silently if localStorage parsing fails
    }
  }, []);



  return (
    <header
      className={cn(
        'header fixed top-0 z-10 start-0 flex items-stretch shrink-0 border-b border-default bg-background end-0 pe-[var(--removed-body-scroll-bar-size,0px)]',
        headerSticky && 'border-b border-border',
      )}
    >
      <Container className="flex justify-between items-stretch lg:gap-4">
        {/* HeaderLogo */}
        <div className="flex lg:hidden items-center gap-2.5">
          <Link to="/" className="shrink-0">
            <img
              src={`/media/logos/${logoSlug}.svg`}
              className="h-[25px] w-full"
              alt="mini-logo"
            />
          </Link>
          <div className="flex items-center">
            {mobileMode && (
              <Sheet
                open={isSidebarSheetOpen}
                onOpenChange={setIsSidebarSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" mode="icon">
                    <Menu className="text-muted-foreground/70" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  className="p-0 gap-0 w-[275px]"
                  side="left"
                  close={false}
                >
                  <SheetHeader className="p-0 space-y-0" />
                  <SheetBody className="p-0 overflow-y-auto">
                    <SidebarMenu />
                  </SheetBody>
                </SheetContent>
              </Sheet>
            )}
            {/* {mobileMode && (
              <Sheet
                open={isMegaMenuSheetOpen}
                onOpenChange={setIsMegaMenuSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" mode="icon">
                    <SquareChevronRight className="text-muted-foreground/70" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  className="p-0 gap-0 w-[275px]"
                  side="left"
                  close={false}
                >
                  <SheetHeader className="p-0 space-y-0" />
                  <SheetBody className="p-0 overflow-y-auto">
                    <MegaMenuMobile />
                  </SheetBody>
                </SheetContent>
              </Sheet>
            )} */}
          </div>
        </div>

        {/* Main Content (MegaMenu or Breadcrumbs) */}
        {/* {pathname.startsWith('/account') ? (
          <Breadcrumb />
        ) : (
          !mobileMode && <MegaMenu />
        )} */}
        {/* Main Content (Breadcrumbs for details pages) */}
        <div className="flex items-center min-w-0 my-auto py-1">
          <HeaderBreadcrumb />
        </div>

        {countdown && (
          <div className='mt-5'>
            <p className='relative transition-colors hover:text-foreground/80 inline-flex items-center gap-1 text-foreground/60 '>
              <CircleAlert className='w-5 h-5 pr-1 text-[#e7000b]' /> Your Licence will expire in {countdown.days} days
              {/* {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)} */}
            </p>
          </div>
        )}



        {isDemoUser && (
          <div className='mt-6'>
            <p className='relative transition-colors inline-flex items-center gap-1 text-amber-500 text-sm font-medium'>
              <CircleAlert className='w-4 h-4 shrink-0' /> This account is only for exploratory purpose, you cannot make any changes
            </p>
          </div>
        )}

        {/* 
        {isDemoUser && (
          <div className='mt-5 ml-34'>
            <DemoModal
              trigger={
                <Button
                  variant="outline"
                  className="text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <Calendar className="size-4" />
                  Explore the platform — Book a demo
                </Button>
              }
            />
          </div>
        )} */}

        {/* HeaderTopbar */}
        <div className="flex items-center gap-3">
          {pathname.startsWith('/store-client') ? (
            <></>
          ) : (
            <>
              {/* {!mobileMode && (
                <SearchDialog
                  trigger={
                    <Button
                      variant="ghost"
                      mode="icon"
                      shape="circle"
                      className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                    >
                      <Search className="size-4.5!" />
                    </Button>
                  }
                />
              )} */}
              <SearchCommandPalette apiEndpoint="https://suite.snapsec.co/util/v1/docs/search" />

              <NotificationsSheet
                trigger={
                  <Button
                    variant="ghost"
                    mode="icon"
                    shape="circle"
                    className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary relative"
                  >
                    <Bell className="size-4.5!" />
                    {typeof notificationsUnseen === 'number' && notificationsUnseen > 0 && (
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

              {/* <ChatSheet
                trigger={
                  <Button
                    variant="ghost"
                    mode="icon"
                    shape="circle"
                    className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                  >
                    <MessageCircleMore className="size-4.5!" />
                  </Button>
                }
              /> */}


              <Button
                asChild
                variant="ghost"
                mode="icon"
                shape="circle"
                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                title="Home"
              >
                <Link to="/">
                  <Home className="size-4.5!" />
                </Link>
              </Button>

              <ProductSwitch
                trigger={
                  <Button
                    variant="ghost"
                    mode="icon"
                    shape="circle"
                    className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                  >
                    <LayoutGrid className="size-4.5!" />
                  </Button>
                }
              />


              <UserDropdownMenu
                trigger={
                  <span>
                    <Profile
                      email={user?.email}
                      showNoOwnerTitle={false}
                    />
                  </span>
                }
              />
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
