import React, { useEffect } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Building2, Lock, LogOut, User } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import appConfig from '@/config/appConfig';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { useGetProductsOverviewQuery } from '@/services/auth/authApi';
import { Card2 } from './components/cards';
import { HomeSkeleton } from './components/HomeSkeleton';

export default function Home3() {
  const { logout, auth } = useAuth();
  const navigate = useNavigate();

  const userAccess = auth?.accessTo || [];
  const userName = auth?.firstName || 'User';

  const { data: overviewResponse, isLoading } = useGetProductsOverviewQuery();

  const rawProducts = overviewResponse?.data?.products || [];
  const rawTools = overviewResponse?.data?.tools || [];

  const productsList = (
    rawProducts.length > 0 ? rawProducts : appConfig.PRODUCT_LIST
  ).map((prod) => {
    const isLocked =
      typeof prod.access === 'boolean'
        ? !prod.access
        : !userAccess?.includes(prod.id);

    const isApt =
      prod.id?.toLowerCase() === 'apt' ||
      prod.title?.toLowerCase() === 'apt' ||
      prod.name?.toLowerCase()?.includes('pentest') ||
      prod.name?.toLowerCase()?.includes('penetration');

    const logoFile = isApt
      ? 'autopt.svg'
      : prod.logo || `${prod.id?.toLowerCase()}.svg`;

    return {
      id: prod.id,
      title: prod.title || prod.id,
      logo: logoFile,
      name: prod.name,
      link: prod.link || '/',
      lock: isLocked,
    };
  });

  const toolsList = rawTools.map((tool) => {
    const isLocked =
      typeof tool.access === 'boolean'
        ? !tool.access
        : !userAccess?.includes(tool.id);

    return {
      id: tool.id,
      title: tool.title || tool.id,
      logo: tool.logo || 'workflow.svg',
      name: tool.name,
      description: tool.description || 'Build and deploy AI agents.',
      link: tool.link || '/ai-agent-builder',
      lock: isLocked,
    };
  });

  // Redirect to onboarding if orgId is missing
  useEffect(() => {
    if (auth && !auth.orgId) navigate('/auth/onboarding');
  }, [auth, navigate]);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start overflow-auto p-4 bg-background">
      <Helmet>
        <title>Snapsec Suite | Home</title>
      </Helmet>

      {/* Header section matching Home.jsx */}
      <div className="flex flex-col items-center gap-6 mb-12 mx-auto text-center lg:mt-16 max-w-2xl">
        <div className="space-y-2">
          <p className="text-4xl font-semibold tracking-tight text-foreground">
            Welcome Back,{' '}
            <Link to="/profile/account/user-info" className="text-primary">
              {userName}!
            </Link>
          </p>

          <p className="text-muted-foreground text-lg">
            Choose a product to access its dashboard.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-4 w-full max-w-7xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
          Product Workspace
        </p>

        {/* Product Cards using Card2 design */}
        <div className="flex flex-wrap justify-center gap-5 mb-5">
          {productsList.map((item, index) => (
            <div
              key={item.id || index}
              className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
            >
              <Card2
                logo={item.logo}
                title={item.title}
                name={item.name}
                link={item.link}
                lock={item.lock}
              />
            </div>
          ))}
        </div>

        {/* Infrastructure & Settings */}
        <div className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
            Infrastructure & Settings
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Dynamic Tools (e.g. AI Agent Builder) */}
            {toolsList.map((tool) => (
              <div
                key={tool.id}
                className={`flex flex-col justify-between gap-4 rounded-xl border bg-card px-5 py-4 transition-colors group ${tool.lock
                    ? 'opacity-80 cursor-not-allowed'
                    : 'cursor-pointer hover:border-primary'
                  }`}
                onClick={() => !tool.lock && navigate(tool.link)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                    <img
                      src={toAbsoluteUrl(`/media/logos/${tool.logo}`)}
                      alt={tool.title || tool.name}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {tool.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <div className="text-start">
                  {tool.lock ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Lock className="size-3.5 text-yellow-500" /> Access Restricted
                    </span>
                  ) : (
                    <span className="cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 gap-1.5 text-[0.8125rem] h-auto p-0 bg-transparent rounded-none hover:bg-transparent font-medium text-primary hover:text-primary/90 underline underline-offset-4 decoration-dashed decoration-1">
                      Go to {tool.title || tool.name}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Fallback Agent Fleet if no tools returned */}
            {toolsList.length === 0 && (
              <AuthorityGuard roles={['Admin']}>
                <div
                  className="flex flex-col justify-between gap-4 rounded-xl border bg-card px-5 py-4 cursor-pointer hover:border-primary transition-colors group"
                  onClick={() => navigate('/agent')}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                      <img
                        src="/media/logos/agent.svg"
                        alt="Agent Logo"
                        className="w-5 h-5"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        Agent Fleet
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Manage deployment and health of your agent fleet.
                      </p>
                    </div>
                  </div>
                  <div className="text-start">
                    <span className="cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 gap-1.5 text-[0.8125rem] h-auto p-0 bg-transparent rounded-none hover:bg-transparent font-medium text-primary hover:text-primary/90 underline underline-offset-4 decoration-dashed decoration-1">
                      Manage Agents
                    </span>
                  </div>
                </div>
              </AuthorityGuard>
            )}

            {/* User Settings */}
            <div
              className="flex flex-col justify-between gap-4 rounded-xl border bg-card px-5 py-4 cursor-pointer hover:border-primary transition-colors group"
              onClick={() => navigate('/profile/account/user-info')}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    User Settings
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Manage your account details, profile, and preferences.
                  </p>
                </div>
              </div>
              <div className="text-start">
                <span className="cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 gap-1.5 text-[0.8125rem] h-auto p-0 bg-transparent rounded-none hover:bg-transparent font-medium text-primary hover:text-primary/90 underline underline-offset-4 decoration-dashed decoration-1">
                  Go to User Settings
                </span>
              </div>
            </div>

            {/* Company Settings */}
            <AuthorityGuard roles={['Admin']}>
              <div
                onClick={() => navigate('/profile/account/company-profile')}
                className="flex flex-col justify-between gap-4 rounded-xl border bg-card px-5 py-4 cursor-pointer hover:border-primary transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      Company Settings
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Manage your organization profile, details, and branding.
                    </p>
                  </div>
                </div>
                <div className="text-start">
                  <span className="cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 gap-1.5 text-[0.8125rem] h-auto p-0 bg-transparent rounded-none hover:bg-transparent font-medium text-primary hover:text-primary/90 underline underline-offset-4 decoration-dashed decoration-1">
                    Go to Company Settings
                  </span>
                </div>
              </div>
            </AuthorityGuard>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-8 flex items-center justify-center gap-1">
          <LogOut className="text-primary" size={17} />
          <Button mode="link" underlined="dashed" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
