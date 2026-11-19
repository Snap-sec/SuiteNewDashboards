import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { ContentLoader } from '@/components/common/content-loader';

const Dashboard = React.lazy(
  () => import('@/pages/VS/pages/dashboard/dashboard'),
);
const Vulns = React.lazy(
  () => import('@/pages/VS/pages/vulnerabilities/vulnerabilities'),
);
const Assets = React.lazy(() => import('@/pages/VS/pages/assets/assets'));
const Scanners = React.lazy(() => import('@/pages/VS/pages/scanners/scanners'));
const Scans = React.lazy(() => import('@/pages/VS/pages/scans/scans'));
const Groups = React.lazy(() => import('@/pages/VS/pages/groups/groups'));
const Integrations = React.lazy(() => import('@/pages/VS/pages/integrations/integrations'));
const ScanDetails = React.lazy(() => import('@/pages/VS/pages/scan-details/scan-details'));
const SuppressionRules = React.lazy(() => import('@/pages/VS/pages/suppression-rules/rules'));
const GuidedRuleEditor = React.lazy(() => import('@/pages/VS/pages/suppression-rules/guided-editor/guided-rule-editor'));
const Agents = React.lazy(() => import('@/pages/VS/pages/agents/agents'));
const Deployment = React.lazy(() => import('@/pages/VS/pages/deployment/deployment'));



export function VsRoutingSetup() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Dashboard />
          </Suspense>
        }
      />
      <Route
        path="/agents"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Agents />
          </Suspense>
        }
      />
      <Route
        path="/deployment"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Deployment />
          </Suspense>
        }
      />
      <Route
        path="/scans/:id"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ScanDetails />
          </Suspense>
        }
      />
      <Route
        path="/assets"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Assets />
          </Suspense>
        }
      />
      <Route
        path="/vulns"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Vulns />
          </Suspense>
        }
      />
      <Route
        path="/scanners"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Scanners />
          </Suspense>
        }
      />
      <Route
        path="/scans"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Scans />
          </Suspense>
        }
      />

      <Route
        path="/groups"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Groups />
          </Suspense>
        }
      />
      <Route
        path="/settings"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Integrations />
          </Suspense>
        }
      />
      <Route
        path="/suppression-rules"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <SuppressionRules />
          </Suspense>
        }
      />
      <Route
        path="/suppression-rules/guided-editor"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <GuidedRuleEditor />
          </Suspense>
        }
      />
    </Routes>
  );
}
