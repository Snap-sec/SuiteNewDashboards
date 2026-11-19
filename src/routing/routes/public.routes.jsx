import React, { Suspense } from 'react';

import { ContentLoader } from '@/components/common/content-loader';

const ReportNewVuln = React.lazy(() => import("@/pages/public/report-new-vuln/report-new"));
const ReportNewVulnerability = React.lazy(() => import('@/pages/VM/pages/report-new-vulnerability/reportNewVulnerability'));
const ShareReport = React.lazy(() => import('@/pages/VM/pages/share-report/share-report'));
const GlobalSearch = React.lazy(() => import('@/pages/AIM/pages/assets-pages/global-search/global-search'));
const GlobalAssetDetails = React.lazy(() => import('@/pages/AIM/pages/assets-pages/global-asset-details/global-asset-details'));
const VulnAddSuccess = React.lazy(() => import('@/pages/public/report-new-vuln/components/on-success'));

const ChangeMgmtMultiReqModal = React.lazy(() => import("@/pages/public/change-mgmt-req/basic-content"));
const AccountExpiryDateContent = React.lazy(() => import('@/pages/public/expiry-date/account-basic-content'));


// report routes
const FullExecutiveReport = React.lazy(() => import('@/pages/public/vm-reports/full-executive/full-executive-report'));
const RevalidationReport = React.lazy(() => import('@/pages/public/vm-reports/revalidation/revalidation-report'));
const FullRevalidationReport = React.lazy(() => import('@/pages/public/vm-reports/fullrevalidation/full-revalidation-report'));
const ExecutiveReport = React.lazy(() => import('@/pages/public/vm-reports/executive-report/executive-report'));
const AssetReport = React.lazy(() => import('@/pages/public/vm-reports/asset-report/asset-report'));
const VulnerabilityReport = React.lazy(() => import('@/pages/public/vm-reports/vulnerability-report/vulnerability-report'));
const AsmExecutiveReport = React.lazy(() => import('@/pages/public/asm-reports/executive/asm-exective-report'));
const AsmExposureReport = React.lazy(() => import('@/pages/public/asm-reports/exposure/exposure-report'));
const AutoPentestVulnReport = React.lazy(() => import('@/pages/public/apt-reports/vuln-report/auto-pentest-vuln-report'));


const PentestScope = React.lazy(() => import('@/pages/public/pentest-scope/pentest-scope'));
const Certificate = React.lazy(() => import('@/pages/public/vm-reports/completion-cert/certificate'));
const AsmGlobalAssetDetails = React.lazy(() => import('@/pages/ASM/global-asset-details/global-asset-details'));

import { Route, Routes } from 'react-router';


export function PublicRoutingSetup() {
    return (
        <Routes>
            <Route path="/vm-reports/fullexec" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <FullExecutiveReport />
                </Suspense>
            } />

            <Route path="/vm-reports/certificate" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <Certificate />
                </Suspense>
            } />


            <Route path="/asset-details/:assetId" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <AsmGlobalAssetDetails />
                </Suspense>
            } />

            <Route path="/pentest-scope/:id" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <PentestScope />
                </Suspense>
            } />

            <Route path="/vm-reports/revalidation" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <RevalidationReport />
                </Suspense>
            } />

            <Route path="/vm-reports/fullrevalidation" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <FullRevalidationReport />
                </Suspense>
            } />

            <Route path="/vm-reports/executive" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <ExecutiveReport />
                </Suspense>
            } />

            <Route path="/vm-reports/asset" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <AssetReport />
                </Suspense>
            } />

            <Route path="/vm-reports/vulnerability" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <VulnerabilityReport />
                </Suspense>
            } />

            <Route path="/asm-reports/executive" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <AsmExecutiveReport />
                </Suspense>
            } />

            <Route path="/asm-reports/exposure" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <AsmExposureReport />
                </Suspense>
            } />

            <Route path="/auto-pentest-vuln-report" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <AutoPentestVulnReport />
                </Suspense>
            } />

            <Route path="/apt-reports/vuln-report" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <AutoPentestVulnReport />
                </Suspense>
            } />


            <Route path="/report-new" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <ReportNewVuln />
                </Suspense>
            } />

            <Route path="/report-new/success" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <VulnAddSuccess />
                </Suspense>}
            />

            <Route path="/report-new-vuln" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <ReportNewVulnerability />
                </Suspense>}
            />


            <Route path="/share-report" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <ShareReport />
                </Suspense>}
            />

            <Route path="/:id/search" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <GlobalSearch />
                </Suspense>}
            />


            <Route path="/asset-detail/:id/:id" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <GlobalAssetDetails />
                </Suspense>}
            />

            <Route path="/:orgId/change-request" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <ChangeMgmtMultiReqModal />
                </Suspense>}
            />


            <Route path="/licence/expiry0x01" element={
                <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                    <AccountExpiryDateContent />
                </Suspense>
            } />







        </Routes>
    );
}