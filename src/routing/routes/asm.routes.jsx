import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import { ContentLoader } from "@/components/common/content-loader";

const Dashboard = React.lazy(
  () => import("@/pages/ASM/dashboards/executive/executive-dashboard-page.jsx"),
);
const CisoDashboard = React.lazy(() => import("@/pages/ASM/dashboard3"));
const CisoCommandDashboard = React.lazy(() => import("@/pages/ASM/dashboard4"));
const CisoRiskBriefing = React.lazy(() => import("@/pages/ASM/dashboard5"));
const SurfaceCommandPort = React.lazy(() => import("@/pages/ASM/dashboard6"));
const AllAssetsPage = React.lazy(() => import("@/pages/ASM/allasset"));
const AnalyticsDashboardPage = React.lazy(
  () => import("@/pages/ASM/dashboards/analytics/analytics-dashboard-page.jsx"),
);
const Exposures = React.lazy(() => import("@/pages/ASM/exposures/exposures"));
const Signals = React.lazy(() => import("@/pages/ASM/signals/signals"));
const SignalLibrary = React.lazy(
  () => import("@/pages/ASM/signal-library/signal-library"),
);
const FalseExposures = React.lazy(
  () => import("@/pages/ASM/exposures/false-exposures"),
);

const ScansPage = React.lazy(() => import("@/pages/ASM/scans/scans"));

const ReportsPage = React.lazy(() => import("@/pages/ASM/reports/reports"));
const Subdomains = React.lazy(
  () => import("@/pages/ASM/attack-surface/subdomains/subdomains"),
);

const Rules = React.lazy(() => import("@/pages/ASM/rules/rules"));

const IPAddresses = React.lazy(
  () => import("@/pages/ASM/attack-surface/ip-addresses/ipAddresses"),
);
const DNSRecords = React.lazy(
  () => import("@/pages/ASM/attack-surface/dns-records/dnsRecords"),
);
const Ports = React.lazy(
  () => import("@/pages/ASM/attack-surface/ports/ports"),
);
const Apis = React.lazy(() => import("@/pages/ASM/attack-surface/apis/apis"));
const Certificates = React.lazy(
  () => import("@/pages/ASM/attack-surface/certificates/certificates"),
);
const Technologies = React.lazy(
  () => import("@/pages/ASM/attack-surface/technologies/technologies"),
);

const Technologies2 = React.lazy(
  () => import("@/pages/ASM/attack-surface/technologies2/technologies2"),
);

const Integrations = React.lazy(
  () => import("@/pages/ASM/integrations/integrations"),
);

const GuidedRuleEditor = React.lazy(
  () => import("@/pages/ASM/post-asm-rule/guided-rule-editor"),
);

const BlacklistRulesPage = React.lazy(
  () => import("@/pages/ASM/blacklist-rules/blacklist-rules-page"),
);
const BlacklistGuidedRuleEditor = React.lazy(
  () => import("@/pages/ASM/blacklist-rules/guided-editor/guided-rule-editor"),
);

const WebServers = React.lazy(
  () => import("@/pages/ASM/attack-surface/web-servers/web-servers"),
);

const RoiDashboard = React.lazy(
  () => import("@/pages/ASM/roi-dashboard/roi-dashboard"),
);

const GlobalAssetDetails = React.lazy(
  () => import("@/pages/ASM/attack-surface/asset-edit/asset-edit"),
);

// const Integration = React.lazy(
//   () => import('@/pages/ASM/intregation/integration'),
// );

const AllAssets = React.lazy(
  () => import("@/pages/ASM/attack-surface/all-assets/all-assets"),
);

export function ASMRoutingSetup() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <SurfaceCommandPort />
          </Suspense>
        }
      />

      <Route
        path="/dashboard3"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <CisoDashboard />
          </Suspense>
        }
      />

      <Route
        path="/dashboard4"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <CisoCommandDashboard />
          </Suspense>
        }
      />

      <Route
        path="/dashboard5"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <CisoRiskBriefing />
          </Suspense>
        }
      />

      <Route
        path="/dashboard6"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <SurfaceCommandPort />
          </Suspense>
        }
      />

      <Route
        path="/allasset"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AllAssetsPage />
          </Suspense>
        }
      />

      <Route
        path="/allassets"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AllAssetsPage />
          </Suspense>
        }
      />

      <Route
        path="/dashboards/analytics"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AnalyticsDashboardPage />
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
        path="/assets"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AllAssets />
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
        path="/asset-details/:assetId"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <GlobalAssetDetails />
          </Suspense>
        }
      />

      <Route
        path="/exposures"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Exposures />
          </Suspense>
        }
      />

      <Route
        path="/signals"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Signals />
          </Suspense>
        }
      />

      <Route
        path="/signal-library"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <SignalLibrary />
          </Suspense>
        }
      />

      <Route
        path="/exposures/false-exposures"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <FalseExposures />
          </Suspense>
        }
      />
      <Route
        path="/assets/subdomains"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Subdomains />
          </Suspense>
        }
      />

      <Route
        path="/rules"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            {/* <Rules /> */}
            <Rules />
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
        path="/assets/ip-addresses"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <IPAddresses />
          </Suspense>
        }
      />
      <Route
        path="/assets/ports"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Ports />
          </Suspense>
        }
      />
      <Route
        path="/assets/apis"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Apis />
          </Suspense>
        }
      />
      <Route
        path="/assets/technologies"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Technologies2 />
          </Suspense>
        }
      />

      <Route
        path="/assets/technologies2"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Technologies2 />
          </Suspense>
        }
      />
      <Route
        path="/assets/certificates"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Certificates />
          </Suspense>
        }
      />
      <Route
        path="/assets/dns-records"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <DNSRecords />
          </Suspense>
        }
      />

      <Route
        path="/assets/web-servers"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <WebServers />
          </Suspense>
        }
      />

      <Route
        path="/roi-dashboard"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <RoiDashboard />
          </Suspense>
        }
      />

      {/* Used to add or updated rule */}
      <Route
        path="/rules/guided-editor"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <GuidedRuleEditor />
          </Suspense>
        }
      />

      <Route
        path="/blacklist-rules"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <BlacklistRulesPage />
          </Suspense>
        }
      />
      <Route
        path="/blacklist-rules/guided-editor"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <BlacklistGuidedRuleEditor />
          </Suspense>
        }
      />

      {/* <Route
        path="/integration"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Integration />
          </Suspense>
        }
      /> */}
    </Routes>
  );
}
