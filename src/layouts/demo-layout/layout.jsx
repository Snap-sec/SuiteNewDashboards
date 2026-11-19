import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Outlet, useLocation } from 'react-router-dom';
import { VM_SIDEBAR } from '@/config/menu.config';
import { useMenu } from '@/hooks/use-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/providers/settings-provider';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Sidebar } from './components/sidebar';

export function DemoLayout() {


  const isMobile = useIsMobile();
  const { pathname, search } = useLocation();
  const { getCurrentItem } = useMenu(pathname);
  const item = getCurrentItem(VM_SIDEBAR);
  const { settings, setOption } = useSettings();


  const [user, setUser] = useState(null);



  // Sidebar collapse toggle
  useEffect(() => {
    const bodyClass = document.body.classList;
    if (settings.layouts.demo1.sidebarCollapse) {
      bodyClass.add('sidebar-collapse');
    } else {
      bodyClass.remove('sidebar-collapse');
    }
  }, [settings]);

  useEffect(() => {
    setOption('layout', 'demo1');
  }, [setOption]);

  useEffect(() => {
    const bodyClass = document.body.classList;

    bodyClass.add('demo1');
    bodyClass.add('sidebar-fixed');
    bodyClass.add('header-fixed');

    const timer = setTimeout(() => {
      bodyClass.add('layout-initialized');
    }, 1000);

    return () => {
      bodyClass.remove('demo1');
      bodyClass.remove('sidebar-fixed');
      bodyClass.remove('sidebar-collapse');
      bodyClass.remove('header-fixed');
      bodyClass.remove('layout-initialized');
      clearTimeout(timer);
    };
  }, []);

  const searchParams = new URLSearchParams(search);
  const origin = searchParams.get('origin');

  return (
    <>
      <Helmet>
        <title>{item?.title}</title>
      </Helmet>

      {!isMobile && <Sidebar origin={origin} />}

      <div className="wrapper flex grow flex-col">
        <Header />

        <main className="grow pt-5" role="content">
          <Outlet />
        </main>

        {/* <Footer /> */}
      </div>
    </>
  );
}
