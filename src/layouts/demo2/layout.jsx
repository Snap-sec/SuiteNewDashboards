import { useEffect, useState } from 'react';
import { addDays, format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { Helmet } from "react-helmet"
import { Outlet, useLocation } from 'react-router-dom';
import { MENU_SIDEBAR } from '@/config/menu.config';
import { useBodyClass } from '@/hooks/use-body-class';
import { useMenu } from '@/hooks/use-menu';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Navbar } from './components/navbar';
import { Toolbar, ToolbarActions, ToolbarHeading } from './components/toolbar';

export function Demo2Layout() {
  const { pathname } = useLocation();
  const { getCurrentItem } = useMenu(pathname);
  const item = getCurrentItem(MENU_SIDEBAR);
  const { setOption } = useSettings();

  useEffect(() => {
    // Set current layout
    setOption('layout', 'demo2');
  }, [setOption]);

  useBodyClass(`
    [--header-height-default:100px]  
    data-[sticky-header=on]:[--header-height:60px]
    [--header-height:var(--header-height-default)]	
  `);

  const [date, setDate] = useState({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  });

  return (
    <>
      <Helmet>
        <title>{item?.title}</title>
      </Helmet>
      <div className="flex grow flex-col in-data-[sticky-header=on]:pt-(--header-height-default)">
        <div className="w-full mx-auto">
          <Header />
        </div>

        <div className="w-full mx-auto">
          <Navbar />
        </div>

        <main className="grow w-full mx-auto" role="content">
          {/* {!pathname.includes('/public-profile/') && (
            <Toolbar>
              <ToolbarHeading />
            </Toolbar>
          )} */}
          <Outlet />
        </main>

        {/* <Footer /> */}
      </div>
    </>
  );
}
