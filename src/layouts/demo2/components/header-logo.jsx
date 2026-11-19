import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MENU_ROOT } from '@/config/menu.config';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function HeaderLogo() {
  const { pathname } = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState(MENU_ROOT[1]);

  useEffect(() => {
    MENU_ROOT.forEach((item) => {
      if (item.rootPath && pathname.includes(item.rootPath)) {
        setSelectedMenuItem(item);
      }
    });
  }, [pathname]);

  return (
    <div className="flex items-center gap-2 lg:gap-2">
      {/* Logo Section */}
      <Link to="/" className="shrink-0">
        <img
          src="/media/logos/snapsec.svg"
          className="dark:hidden min-h-[25px]"
          alt="logo"
        />

        <img
          src="/media/logos/snapsec.svg"
          className="hidden dark:inline-block min-h-[25px]"
          alt="logo"
        />
      </Link>

      {/* Menu Section */}
      <div className="flex items-center gap-3">
        <h3 className="text-accent-foreground text-base hidden md:block">
          {JSON.parse(localStorage.getItem("user"))?.orgName} | Settings
        </h3>


      </div>
    </div>
  );
}
