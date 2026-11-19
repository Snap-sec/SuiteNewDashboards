import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { ContentLoader } from '@/components/common/content-loader';

const AgentDashboard = React.lazy(
  () => import('@/pages/Agent/pages/dashboard/dashboard'),
);

const AgentDeployment = React.lazy(
  () => import('@/pages/Agent/pages/agent-settings/agent-settings'),
);

const AgentSettingsTabsPage = React.lazy(
  () => import('@/pages/Agent/pages/settings/settings'),
);

const AgentInventory = React.lazy(
  () => import('@/pages/Agent/pages/agent-inventory/agent-inventory'),
);

export function AgentRoutingSetup() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <AgentDashboard />
          </Suspense>
        }
      />
      <Route
        path="/deployment"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <AgentDeployment />
          </Suspense>
        }
      />
      <Route
        path="/settings"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <AgentSettingsTabsPage />
          </Suspense>
        }
      />
      <Route
        path="/inventory"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <AgentInventory />
          </Suspense>
        }
      />
    </Routes>
  );
}
