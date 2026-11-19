import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { ContentLoader } from '@/components/common/content-loader';

const DashboardPage = React.lazy(
  () => import('@/pages/CSM/pages/dashboard/dashboard-page'),
);
const VulnerablitiesPage = React.lazy(
  () => import('@/pages/CSM/pages/vulnerabilities/vulns-page'),
);
const IntegrationsPage = React.lazy(
  () => import('@/pages/CSM/pages/integrations/integrations-page'),
);
const ScansPage = React.lazy(
  () => import('@/pages/CSM/pages/scans/scans'),
);
const ReportsPage = React.lazy(
  () => import('@/pages/CSM/pages/reports/reports-page'),
);
const ProjectsPage = React.lazy(
  () => import('@/pages/CSM/pages/projects/projects'),
);
const VulnerabilityReport = React.lazy(
  () => import('@/pages/VM/pages/vulnerability-report/vulnerability-report'),
);

export function CSMRoutingSetup() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <DashboardPage />
          </Suspense>
        }
      />

      <Route
        path="/vulnerabilities"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <VulnerablitiesPage />
          </Suspense>
        }
      />

      <Route
        path="/scans"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ScansPage />
          </Suspense>
        }
      />

      <Route
        path="/integrations"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <IntegrationsPage />
          </Suspense>
        }
      />

      <Route
        path="/reports"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ReportsPage />
          </Suspense>
        }
      />
      <Route
        path="/accounts"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ProjectsPage />
          </Suspense>
        }
      />
      <Route
        path="/vulnerability-report"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <VulnerabilityReport />
          </Suspense>
        }
      />
    </Routes>
  );
}
