// import { StoreClientTopbar } from '@/pages/store-client/components/common/topbar';
import { SearchDialog } from '@/partials/dialogs/search/search-dialog';
import { ChatSheet } from '@/partials/topbar/chat-sheet';
import { NotificationsSheet } from '@/partials/topbar/notifications-sheet';
import { UserDropdownMenu } from '@/partials/custom/user-dropdown-menu';
import { MessageCircleMore, MessageSquareDot, Search } from 'lucide-react';
import { useLocation } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import {ProductSwitch} from '@/components/custom/product-switch';
import { LayoutGrid, Bell, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Profile } from "@/components/custom/profile";
import { useAuth } from '@/auth/context/auth-context';

export function HeaderTopbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <>
      {pathname.startsWith('/store-client') ? (
        // <StoreClientTopbar />
        <></>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
{/*             
            <NotificationsSheet
              trigger={
                <Button
                  variant="ghost"
                  mode="icon"
                  size="sm"
                  shape="circle"
                  className="size-9"
                >
                  <Bell className="size-4.5!" />
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
            
          </div>
          <UserDropdownMenu
            trigger={
              <span>
                <Profile
                  email={user?.email}
                />
              </span>
            }
          />
        </div>
      )}
    </>
  );
}
