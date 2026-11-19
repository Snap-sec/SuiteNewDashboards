import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { ContentLoader } from '@/components/common/content-loader';

const Dashboard = React.lazy(() => import('@/pages/SAST/pages/dashboard/dashboard'));
const Projects = React.lazy(() => import('@/pages/SAST/pages/projects/projects'));
const ProjectDetail = React.lazy(() => import('@/pages/SAST/pages/project-detail/project-detail'));
const Vulnerabilities = React.lazy(() => import('@/pages/SAST/pages/vulnerabilities/vulnerabilities'));
const Scans = React.lazy(() => import('@/pages/SAST/pages/scans/scans'));
const Reports = React.lazy(() => import('@/pages/SAST/pages/reports/reports'));
const Integrations = React.lazy(() => import('@/pages/SAST/pages/integrations/integrations'));
const Settings = React.lazy(() => import('@/pages/SAST/pages/settings/settings'));

export function SastRoutingSetup() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <Dashboard />
          </Suspense>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <Dashboard />
          </Suspense>
        }
      />
      <Route
        path="/projects"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <Projects />
          </Suspense>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <ProjectDetail />
          </Suspense>
        }
      />
      <Route
        path="/vulnerabilities"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <Vulnerabilities />
          </Suspense>
        }
      />
      <Route
        path="/scans"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <Scans />
          </Suspense>
        }
      />
      <Route
        path="/reports"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <Reports />
          </Suspense>
        }
      />
      <Route
        path="/integrations"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <Integrations />
          </Suspense>
        }
      />
      <Route
        path="/settings"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <Settings />
          </Suspense>
        }
      />
    </Routes>
  );
}
