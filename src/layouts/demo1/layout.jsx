import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { VM_SIDEBAR } from '@/config/menu.config';
import { useMenu } from '@/hooks/use-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/providers/settings-provider';
import DemoModal from '@/components/custom/demo/demo-model';
import { BreadcrumbProvider } from '@/context/breadcrumb-context';
import { useAuth } from '../../auth/context/auth-context';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Sidebar } from './components/sidebar';

// Product access mapping by URL prefix
const ACCESS_MAP = {
  '/vm': 'VM',
  '/casm': 'ASM',
  '/caim': 'AIM',
};

export function Demo1Layout() {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { getCurrentItem } = useMenu(pathname);
  const item = getCurrentItem(VM_SIDEBAR);
  const { settings, setOption } = useSettings();

  const { getUser } = useAuth();
  const [user, setUser] = useState(null);

  // Fetch user once on mount
  useEffect(() => {
    async function fetchUser() {
      const loggedUser = await getUser();
      setUser(loggedUser);
    }
    fetchUser();
  }, [getUser]);

  // Redirect if user lacks access
  useEffect(() => {
    if (!user) return; // wait for user data

    // Find product by matching pathname prefix
    const matchedEntry = Object.entries(ACCESS_MAP).find(([prefix]) =>
      pathname.startsWith(prefix),
    );

    if (matchedEntry) {
      const productCode = matchedEntry[1];
      console.log(productCode);
      // Check if user has access
      if (!user.accessTo || !user.accessTo.includes(productCode)) {
        toast.error("You don't have access to this product.");
        // Redirect to home if no access
        navigate('/', { replace: true });
      }
    }
    // else no specific product matched; no redirect
  }, [user, pathname, navigate]);

  // ...your existing effects and JSX below remain same...

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

  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const origin = searchParams.get('origin');

  const isApt =
    pathname.includes('/apt/pentests/create')

  return (
    <BreadcrumbProvider>
      <Helmet>
        <title>{item?.title}</title>
      </Helmet>

      {!isMobile && <Sidebar origin={origin} />}

      <div className="wrapper flex min-w-0 grow flex-col">
        <Header />

        <main className="grow pt-5 min-w-0" role="content">
          {isApt ? (
            <div className="w-full min-w-[320px] max-w-[1600px] mx-auto px-2 sm:px-4 md:px-6 transition-all">
              <Outlet />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      {/* Demo booking modal - shows for demo users after 1 minute */}
      <DemoModal autoShow />
    </BreadcrumbProvider>
  );
}
