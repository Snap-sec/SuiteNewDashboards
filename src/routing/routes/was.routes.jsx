import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { ContentLoader } from '@/components/common/content-loader';

const Dashboard = React.lazy(() => import('@/pages/WAS/dashboard/dashboard'));
const Vulnerabilities = React.lazy(() => import('@/pages/WAS/vulnerabilities/vulnerabilities'));
const Integration = React.lazy(() => import('@/pages/WAS/integration/integration'));
const Requests = React.lazy(() => import('@/pages/WAS/requests/requests'));
const Environment = React.lazy(() => import('@/pages/WAS/environment/environment'));
const Environments = React.lazy(() => import('@/pages/WAS/environments/environments'));
const Projects = React.lazy(() => import('@/pages/WAS/projects/projects'));
const ProjectDetail = React.lazy(() => import('@/pages/WAS/project-detail/project-detail'));
const ScanProfile = React.lazy(() => import('@/pages/WAS/scan-profile/scan-profile'));

const RuleCategories = React.lazy(() => import('@/pages/WAS/rule-categories/rule-categories'));
const CategoryRules = React.lazy(() => import('@/pages/WAS/category-rules/category-rules'));
const TransformedRequests = React.lazy(() => import('@/pages/WAS/project-detail/components/Tabs/transformed-requests'));


export function ApiSecRoutingSetup() {
    return (
        <Routes>

            <Route path="/" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <Dashboard />
                </Suspense>
            } />


            <Route path="/projects/:id/transformed-requests" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <TransformedRequests />
                </Suspense>
            } />

            <Route path="/vulnerablities" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <Vulnerabilities />
                </Suspense>
            } />

            <Route path="/integrations" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <Integration />
                </Suspense>
            } />

            <Route path="/requests" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <Requests />
                </Suspense>
            } />


            <Route path="/rules" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <RuleCategories />
                </Suspense>
            } />

            <Route path="/category-rules/:categoryName" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <CategoryRules />
                </Suspense>
            } />


            <Route path="/environments" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <Environments />
                </Suspense>
            } />

            {/* Env details by id  */}
            <Route path="/environment/:envId" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <Environment />
                </Suspense>
            } />


            <Route path="/projects" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <Projects />
                </Suspense>
            } />


            <Route path="/projects/:id" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <ProjectDetail />
                </Suspense>
            } />

            <Route path="/scan-profile" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <ScanProfile />
                </Suspense>
            } />

        </Routes>
    );
}