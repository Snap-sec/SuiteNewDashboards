import React, { Suspense } from 'react';
import { ContentLoader } from '@/components/common/content-loader';
import { Route, Routes } from 'react-router';

const ServiceProviderMemberOrgs = React.lazy(() => import("@/pages/service-account/service-type-orgs"));
const OrgSettingsPage = React.lazy(() => import("@/pages/service-account/org-settings"));


export function ServiceProviderRoutingSetup() {
  return (
    <Routes>

        <Route path="/orgs" element={
            <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                <ServiceProviderMemberOrgs />
            </Suspense>
        } />

        <Route path="/orgs/:orgId/settings" element={
            <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
                <OrgSettingsPage />
            </Suspense>
        } />

    </Routes>
  );
}