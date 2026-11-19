import React, { Suspense } from 'react';
import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { Demo1Layout } from '@/layouts/demo1/layout';
import { Demo2Layout } from '@/layouts/demo2/layout';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { ContentLoader } from '@/components/common/content-loader';
import { ErrorBoundary } from '../components/common/error-boundary';
import { CrashError } from '../errors/crash-error';
import { DemoLayout } from '../layouts/demo-layout/layout';
import { AgentRoutingSetup } from './routes/agent.routes';
import { ASMRoutingSetup } from './routes/asm.routes';
// NEW AIM routes
import { AssetInventoryRoutingSetup } from './routes/asset.inventory.routes';
import { AutomationRoutingSetup } from './routes/automation.routes';
import { CSMRoutingSetup } from './routes/csm.routes';
import { DemoRoutingSetup } from './routes/demo.routes';
import { ErrorRoutesSetup } from './routes/error.routes';
import { ProfileRoutingSetup } from './routes/profile.routes';
import { PublicRoutingSetup } from './routes/public.routes';
import { SastRoutingSetup } from './routes/sast.routes';
import { ScaRoutingSetup } from './routes/sca.routes';
import { ServiceProviderRoutingSetup } from './routes/serivce-provider.routes';
import { TMRoutingSetup } from './routes/tm.routes';
import { VMRoutingSetup } from './routes/vm.routes';
// other routes
import { VsRoutingSetup } from './routes/vs.routes';
import { ApiSecRoutingSetup } from './routes/was.routes';
import { AutoPTRoutingSetup } from './routes/auto.pt.routes';

const DemoMagicLogin = React.lazy(
  () => import('@/pages/public/demo-dashboard/demo-magic-login'),
);

const DemoOTP = React.lazy(
  () => import('@/pages/public/demo-dashboard/demo-otp'),
);

const ShareReport = React.lazy(
  () => import('@/pages/VM/pages/share-report/share-report'),
);

const ChartCatalogue = React.lazy(
  () => import('@/pages/public/chart-catalogue/charts'),
);

const DefaultPage = React.lazy(() =>
  import('@/pages/dashboards').then((module) => ({
    default: module.DefaultPage,
  })),
);

const Home = React.lazy(() => import('@/pages/Home'));
const Home2 = React.lazy(() => import('@/pages/Home/home2'));
const Home3 = React.lazy(() => import('@/pages/Home/home3'));
const NotificationsPage = React.lazy(() => import('@/pages/notifications'));
const DemoDashboard = React.lazy(
  () => import('@/pages/public/demo-dashboard/demo-dashboard'),
);

const LoadDemoDataPage = React.lazy(
  () => import('@/pages/other-pages/load-demo-data/load-demo-data'),
);

const AutoPentestVulnReport = React.lazy(
  () => import('@/pages/public/apt-reports/vuln-report/auto-pentest-vuln-report'),
);

export function AppRoutingSetup() {
  const location = useLocation();

  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route
          path="/"
          element={
            <Suspense
              fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
            >
              <Home3 />
            </Suspense>
          }
        />

        <Route
          path="/load-demo-data"
          element={
            <Suspense
              fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
            >
              <LoadDemoDataPage />
            </Suspense>
          }
        />

        <Route
          path="/service-provider/*"
          element={<ServiceProviderRoutingSetup />}
        />

        <Route
          path="/home2"
          element={
            <Suspense
              fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
            >
              <Home2 />
            </Suspense>
          }
        />

        <Route
          path="/home3"
          element={
            <Suspense
              fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
            >
              <Home3 />
            </Suspense>
          }
        />

        <Route element={<Demo1Layout />}>
          <Route
            path="/notifications-page"
            element={
              <Suspense
                fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
              >
                <NotificationsPage />
              </Suspense>
            }
          />

          <Route
            path="/vs/*"
            element={
              <ErrorBoundary
                resetKey={location.pathname}
                fallback={<CrashError />}
              >
                <VsRoutingSetup />
              </ErrorBoundary>
            }
          />

          <Route
            path="/vm/*"
            element={
              <ErrorBoundary
                resetKey={location.pathname}
                fallback={<CrashError />}
              >
                <VMRoutingSetup />
              </ErrorBoundary>
            }
          />

          <Route
            path="/casm/*"
            element={
              <ErrorBoundary
                resetKey={location.pathname}
                fallback={<CrashError />}
              >
                <ASMRoutingSetup />
              </ErrorBoundary>
            }
          />

          <Route
            path="/threat-modeler/*"
            element={
              <ErrorBoundary
                resetKey={location.pathname}
                fallback={<CrashError />}
              >
                <TMRoutingSetup />
              </ErrorBoundary>
            }
          />

          <Route
            path="/was/*"
            element={
              <ErrorBoundary
                resetKey={location.pathname}
                fallback={<CrashError />}
              >
                <ApiSecRoutingSetup />
              </ErrorBoundary>
            }
          />

          <Route
            path="/assetinventory/*"
            element={
              <ErrorBoundary
                resetKey={location.pathname}
                fallback={<CrashError />}
              >
                <AssetInventoryRoutingSetup />
              </ErrorBoundary>
            }
          />

          <Route
            path="/csp-m/*"
            element={
              <ErrorBoundary
                resetKey={location.pathname}
                fallback={<CrashError />}
              >
                <CSMRoutingSetup />
              </ErrorBoundary>
            }
          />

          <Route
            path="/agent/*"
            element={
              <ErrorBoundary
                resetKey={location.pathname}
                fallback={<CrashError />}
              >
                <AgentRoutingSetup />
              </ErrorBoundary>
            }
          />

          <Route
            path="/sca-ui/*"
            element={
              <ErrorBoundary
                resetKey={location.pathname}
                fallback={<CrashError />}
              >
                <ScaRoutingSetup />
              </ErrorBoundary>
            }
          />

          <Route
            path="/ai-agent-builder/*"
            element={
              <ErrorBoundary
                resetKey={location.pathname}
                fallback={<CrashError />}
              >
                <AutomationRoutingSetup />
              </ErrorBoundary>
            }
          />

          <Route
            path="/ui-sast/*"
            element={
              <ErrorBoundary
                resetKey={location.pathname}
                fallback={<CrashError />}
              >
                <SastRoutingSetup />
              </ErrorBoundary>
            }
          />


          <Route
            path="/apt/*"
            element={
              <ErrorBoundary
                resetKey={location.pathname}
                fallback={<CrashError />}
              >
                <AutoPTRoutingSetup />
              </ErrorBoundary>
            }
          />
        </Route>

        <Route element={<Demo2Layout />}>
          <Route
            path="/profile/*"
            element={
              <ErrorBoundary
                resetKey={location.pathname}
                fallback={<CrashError />}
              >
                <ProfileRoutingSetup />
              </ErrorBoundary>
            }
          />
        </Route>
      </Route>

      <Route
        path="/vm/share-report"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ShareReport />
          </Suspense>
        }
      />
      <Route path="/demo" element={<DemoDashboard />} />

      <Route element={<DemoLayout />}>
        <Route path="/demo/*" element={<DemoRoutingSetup />} />
      </Route>

      <Route
        path="/demo/otp"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <DemoOTP />
          </Suspense>
        }
      />

      <Route
        path="/demo/magic-login"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <DemoMagicLogin />
          </Suspense>
        }
      />

      <Route
        path="/pages/public/chart-catalogue"
        element={<ChartCatalogue />}
      />

      <Route
        path="/auto-pentest-vuln-report"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <AutoPentestVulnReport />
          </Suspense>
        }
      />

      <Route path="/pages/public/*" element={<PublicRoutingSetup />} />
      <Route path="/public/*" element={<ErrorRoutesSetup />} />

      <Route path="error/*" element={<ErrorRouting />} />
      <Route path="auth/*" element={<AuthRouting />} />
      <Route path="*" element={<Navigate to="/error/404" replace />} />
    </Routes>
  );
}
