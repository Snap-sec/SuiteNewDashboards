import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { ContentLoader } from '@/components/common/content-loader';

const DemoDashboard = React.lazy(() => import('@/pages/public/demo-dashboard/demo-dashboard'));

const Metrics1Page = React.lazy(() => import('@/pages/public/demo-dashboard/metrics1'));

const Metrics2Page = React.lazy(() => import('@/pages/public/demo-dashboard/metrics2'));

const Metrics3Page = React.lazy(() => import('@/pages/public/demo-dashboard/metrics3'));

const Metrics4Page = React.lazy(() => import('@/pages/public/demo-dashboard/metrics4'));

const ExposureSignals = React.lazy(() => import('@/pages/public/demo-dashboard/exposure-signals'));
const ExposureSignalsV2 = React.lazy(() => import('@/pages/public/demo-dashboard/exposure-signals-2'));

const AsmDashboard = React.lazy(() => import('@/pages/public/demo-dashboard/asm-dashboard'));

const CisoDashPage = React.lazy(() => import('@/pages/public/demo-dashboard/ciso-dash'));

const DemoListPage = React.lazy(() => import('@/pages/public/demo-dashboard/demo-list'));

const VendorsPage = React.lazy(() => import('@/pages/public/demo-dashboard/vendors'));
const VulnSourcesPage = React.lazy(() => import('@/pages/public/demo-dashboard/vuln-sources'));
const VulnerabilityInfoPage = React.lazy(() => import('@/pages/public/demo-dashboard/vulnerability-info'));
const VulnerabilityInfoV2Page = React.lazy(() => import('@/pages/public/demo-dashboard/vulnerability-info-v2'));
const ModuleSelectionPage = React.lazy(() => import('@/pages/public/demo-dashboard/module-selection'));
const ModuleChoose2Page = React.lazy(() => import('@/pages/public/demo-dashboard/module-choose-2'));
const AssessmentReportPage = React.lazy(() => import('@/pages/public/demo-dashboard/assessment-report'));
const OrgExecutiveReportPage = React.lazy(() => import('@/pages/public/demo-dashboard/org-executive-report'));
const CVSSScoringSelectionPage = React.lazy(() => import('@/pages/public/demo-dashboard/cvss-scoring-selection'));

export function DemoRoutingSetup() {
    return (
        <Routes>

            <Route path="/service-vendors" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <VendorsPage />
                </Suspense>
            } />

            <Route path="/vuln-sources" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <VulnSourcesPage />
                </Suspense>
            } />

            <Route path="/asm-dashboard" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <AsmDashboard />
                </Suspense>
            } />

            <Route path="/exposures" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <ExposureSignals />
                </Suspense>
            } />

            <Route path="/exposures-2" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <ExposureSignalsV2 />
                </Suspense>
            } />

            <Route path="/" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <DemoDashboard />
                </Suspense>
            } />

            <Route path="/metrics1" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <Metrics1Page />
                </Suspense>
            } />

            <Route path="/metrics2" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <Metrics2Page />
                </Suspense>
            } />

            <Route path="/metrics3" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <Metrics3Page />
                </Suspense>
            } />

            <Route path="/metrics4" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <Metrics4Page />
                </Suspense>
            } />

            <Route path="/ciso-dash" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <CisoDashPage />
                </Suspense>
            } />

            <Route path="/list" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <DemoListPage />
                </Suspense>
            } />

            {/* <Route path="/magic-login" element={
            <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                <DemoMagicLogin />
            </Suspense>
        } /> */}


            <Route path="/vulnerability-info" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <VulnerabilityInfoPage />
                </Suspense>
            } />

            <Route path="/vulnerability-info-v2" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <VulnerabilityInfoV2Page />
                </Suspense>
            } />

            <Route path="/module-selection" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <ModuleSelectionPage />
                </Suspense>
            } />

            <Route path="/module-choose-2" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <ModuleChoose2Page />
                </Suspense>
            } />

            <Route path="/assessment-report" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <AssessmentReportPage />
                </Suspense>
            } />

            <Route path="/org-executive-report" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <OrgExecutiveReportPage />
                </Suspense>
            } />

            <Route path="/scoring-selection" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <CVSSScoringSelectionPage />
                </Suspense>
            } />

        </Routes>
    );
}