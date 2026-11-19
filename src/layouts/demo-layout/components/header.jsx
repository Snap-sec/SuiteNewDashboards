import { useEffect, useState } from 'react';
import { Menu, Bell, LayoutGrid, CircleAlert } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
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
import { SidebarMenu } from './sidebar-menu';


function useSegment(index) {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const seg = segments[index];
  if (seg === 'sca-ui' || seg?.startsWith('sca')) {
    return 'sca';
  }
  return seg;
}

export function Header() {
  const [isSidebarSheetOpen, setIsSidebarSheetOpen] = useState(false);
  const { pathname } = useLocation();
  const mobileMode = useIsMobile();
  const segment = useSegment(0);
  const logoMap = {
    automation: 'agent',
    assetinventory: 'aim',
    caim: 'aim',
    aim: 'aim',
    apt: 'autopt',
    casm: 'asm',
    asm: 'asm',
    vm: 'vm',
  };
  const logoSlug = logoMap[segment] || segment;
  const scrollPosition = useScrollPosition();
  const headerSticky = scrollPosition > 0;


  useEffect(() => {
    setIsSidebarSheetOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'header fixed top-0 z-10 start-0 flex items-stretch shrink-0 border-b bg-background end-0 pe-[var(--removed-body-scroll-bar-size,0px)]',
        headerSticky && 'border-b border-border',
      )}
    >
      <Container className="flex justify-between items-stretch lg:gap-4">
        {/* Left: Logo and Sidebar Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/" className="shrink-0">
            <img
              src={`/media/logos/${logoSlug}.svg`}
              className="h-[25px] w-full"
              alt="logo"
            />
          </Link>

          {mobileMode && (
            <Sheet open={isSidebarSheetOpen} onOpenChange={setIsSidebarSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" mode="icon">
                  <Menu className="text-muted-foreground/70" />
                </Button>
              </SheetTrigger>
              <SheetContent className="p-0 gap-0 w-[275px]" side="left">
                <SheetHeader className="p-0 space-y-0" />
                <SheetBody className="p-0 overflow-y-auto">
                  <SidebarMenu />
                </SheetBody>
              </SheetContent>
            </Sheet>
          )}
        </div>


        {/* Right: Notifications + Product Switch */}
        <div className="flex items-center justify-end w-full gap-3">
          <>
            <Button
              variant="ghost"
              mode="icon"
              shape="circle"
              className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary relative"
            >
              <Bell className="size-4.5!" />
              <span
                className="
                            absolute top-1 end-0.5
                            flex items-center justify-center
                            text-[8px] py-[1px] px-1
                            rounded-full bg-red-500 text-white
                            text-xs font-bold shadow
                          "
              >
                20
              </span>
            </Button>
            <Button
              variant="ghost"
              mode="icon"
              shape="circle"
              className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
            >
              <LayoutGrid className="size-4.5!" />
            </Button>
          </>
        </div>
      </Container>
    </header>
  );
}
