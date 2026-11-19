import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { ContentLoader } from '@/components/common/content-loader';

const Dashboard = React.lazy(() => import('@/pages/SCA/pages/dashboard/dashboard'));
const Projects = React.lazy(() => import('@/pages/SCA/pages/projects/projects'));
const ProjectDetail = React.lazy(() => import('@/pages/SCA/pages/projects/project-detail'));
const Vulnerabilities = React.lazy(() => import('@/pages/SCA/pages/vulnerabilities/vulnerabilities'));
const Dependencies = React.lazy(() => import('@/pages/SCA/pages/dependencies/dependencies'));
const DependencyDetail = React.lazy(() => import('@/pages/SCA/pages/dependencies/dependency-detail'));
const ContainerImages = React.lazy(() => import('@/pages/SCA/pages/container-images/container-images-page'));
const Scans = React.lazy(() => import('@/pages/SCA/pages/scans/scans'));
const ActionPlan = React.lazy(() => import('@/pages/SCA/pages/action-plan/action-plan'));
const Reports = React.lazy(() => import('@/pages/SCA/pages/reports/reports'));
const Integrations = React.lazy(() => import('@/pages/SCA/pages/integrations/integrations'));
const Settings = React.lazy(() => import('@/pages/SCA/pages/settings/settings'));

export function ScaRoutingSetup() {
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
        path="/dependencies"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <Dependencies />
          </Suspense>
        }
      />
      <Route
        path="/dependencies/:id"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <DependencyDetail />
          </Suspense>
        }
      />
      <Route
        path="/container-images"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <ContainerImages />
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
        path="/action-plan"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <ActionPlan />
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
