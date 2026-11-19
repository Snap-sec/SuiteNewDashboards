import React, { Suspense } from 'react';

import { ContentLoader } from '@/components/common/content-loader';

const Dashboard = React.lazy(() => import('@/pages/TM/pages/dashboard/dashboard'));
const Projects = React.lazy(() => import('@/pages/TM/pages/projects/projects'));
const ProjectDetail = React.lazy(() => import('@/pages/TM/pages/project-detail/project-detail'));
const Threats = React.lazy(() => import('@/pages/TM/pages/threats/threats'));
const ThreatsDetail = React.lazy(() => import('@/pages/TM/pages/threats-detail/threats-detail'));
const PromptSetting = React.lazy(() => import('@/pages/TM/pages/prompt-setting/prompt-setting'));
const Requests = React.lazy(() => import('@/pages/TM/pages/requests/requests'));



import { Route, Routes } from 'react-router';

export function TMRoutingSetup() {
  return (
    <Routes>

        <Route path="/" element={
            <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                <Dashboard />
            </Suspense>
        } />


        <Route path="/projects" element={
            <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                <Projects />
            </Suspense>
        } />

        <Route path="/projects/:projectId" element={
            <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                <ProjectDetail />
            </Suspense>
        } />
        
        <Route path="/threats" element={
            <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                <Threats />
            </Suspense>
        } />


        <Route path="/threat-detail/:threatId" element={
            <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                <ThreatsDetail />
            </Suspense>
        } />

        
        <Route path="/projects/:projectId/settings" element={
            <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                <PromptSetting />
            </Suspense>
        } />

        <Route path="/requests" element={
            <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                <Requests />
            </Suspense>
        } />




        
    </Routes>
  );
}