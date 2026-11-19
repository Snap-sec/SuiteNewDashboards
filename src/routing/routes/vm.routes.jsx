import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { ContentLoader } from '@/components/common/content-loader';

const MainDashboard = React.lazy(
  () => import('@/pages/VM/pages/dashboard/main-dashboard'),
);
const VulnerabilityPage = React.lazy(
  () => import('@/pages/VM/pages/vulnerabilities/vulnerabilities'),
);
const ArchivedVulnsPage = React.lazy(
  () => import('@/pages/VM/pages/archived-vulns/archived-vulns'),
);
const Assessment = React.lazy(
  () => import('@/pages/VM/pages/assessment/assessments'),
);
const Reports = React.lazy(() => import('@/pages/VM/pages/report/report'));
const Blockers = React.lazy(() => import('@/pages/VM/pages/blocker/blocker'));
const Assets = React.lazy(() => import('@/pages/VM/pages/assets/assets'));
const AssetDetails = React.lazy(
  () => import('@/pages/VM/pages/asset-details/components/asset-details'),
);
const VulnerabilityReport = React.lazy(
  () => import('@/pages/VM/pages/vulnerability-report/vulnerability-report'),
);
const VulnerabilityReportView = React.lazy(
  () =>
    import('@/pages/VM/pages/vulnerability-report/vulnerability-report-view'),
);
const AssessmentEdit = React.lazy(
  () => import('@/pages/VM/pages/asseessment-edit/assessment-edit'),
);
const Vendors = React.lazy(() => import('@/pages/VM/pages/vendors/vendors'));
const VulnerabilitySources = React.lazy(
  () => import('@/pages/VM/pages/vulnerability-sources/vulnerability-sources'),
);

const VulnerabilityListPage = React.lazy(
  () => import('@/pages/VM/pages/vulnerability-groups/vulnerability-groups-page'),
);
const ChangeManagement = React.lazy(
  () => import('@/pages/VM/pages/change-management/change-management'),
);
const RiskAcceptance = React.lazy(
  () => import('@/pages/VM/pages/risk-acceptance/risk-acceptance'),
);
const SearchVulns = React.lazy(
  () => import('@/pages/VM/pages/search-vulns/search-vulns'),
);
const Folders = React.lazy(() => import('@/pages/VM/pages/folders/folders'));
const FolderDetails = React.lazy(() => import('@/pages/VM/pages/folders/folder-details'));
const Integration = React.lazy(() => import('@/pages/VM/pages/integration/intregation'));
const BusinessUnits = React.lazy(() => import('@/pages/VM/pages/business-units/business-units'));
const BusinessUnitDetails = React.lazy(() => import('@/pages/VM/pages/business-unit-details/business-unit-details-page'));

const AutomationEngine = React.lazy(() => import('@/pages/VM/pages/automation-engine/automation-engine'));
const FalsePositiveWorkflow = React.lazy(() => import('@/pages/VM/pages/false-positive/false-positive'));

//Sla Pages
const SlaPage = React.lazy(() => import('@/pages/VM/pages/sla/sla.jsx'));

const TrueRisk = React.lazy(() => import('@/pages/VM/pages/true-risk/true-risk'));
const RiskAnalytics = React.lazy(() => import('@/pages/VM/pages/risk-analytics/risk-analytics'));
const RelevanceGroups = React.lazy(() => import('@/pages/VM/pages/relevance-groups/relevance-groups'));
const RelevanceGroupDetailsPage = React.lazy(() => import('@/pages/VM/pages/relevance-group-details/relevance-group-details-page'));


//Remidation
const RemidationCampaignsPage = React.lazy(
  () => import('@/pages/VM/pages/remidation-campaigns/remidation-campaigns'),
);
const RemidationCampaignDetailsPage = React.lazy(
  () =>
    import(
      '@/pages/VM/pages/remidation-campaign-details/remidation-campaign-details-page'
    ),
);

export function VMRoutingSetup() {
  return (
    <Routes>

      <Route path="/" element={
        <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
          <MainDashboard />
        </Suspense>
      } />

      <Route
        path="/true-risk"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <TrueRisk />
          </Suspense>
        }
      />

      <Route
        path="/relevance-groups"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <RelevanceGroups />
          </Suspense>
        }
      />

      <Route
        path="/relevance-groups/:id"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <RelevanceGroupDetailsPage />
          </Suspense>
        }
      />



      <Route path="/true-risk" element={
        <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
          <TrueRisk />
        </Suspense>
      } />

      <Route
        path="/vulnerabilities"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <VulnerabilityPage />
          </Suspense>
        }
      />

      <Route
        path="/archived-vulns"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ArchivedVulnsPage />
          </Suspense>
        }
      />

      <Route
        path="/assessments"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Assessment />
          </Suspense>
        }
      />

      <Route
        path="/reports"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Reports />
          </Suspense>
        }
      />

      <Route
        path="/assessments"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Assessment />
          </Suspense>
        }
      />

      <Route
        path="/reports"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Reports />
          </Suspense>
        }
      />
      <Route
        path="/blockers"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Blockers />
          </Suspense>
        }
      />

      <Route
        path="/integrations"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Integration />
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
        path="/asset-details"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AssetDetails />
          </Suspense>
        }
      />

      <Route
        path="/vulnerability-report"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <VulnerabilityReport />
          </Suspense>
        }
      />

      <Route
        path="/blockers"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Blockers />
          </Suspense>
        }
      />

      <Route
        path="/vulnerability-report-view"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <VulnerabilityReportView />
          </Suspense>
        }
      />

      <Route
        path="/assessment-edit"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AssessmentEdit />
          </Suspense>
        }
      />

      <Route
        path="/vulnerability-list"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <VulnerabilityListPage />
          </Suspense>
        }
      />

      <Route
        path="/change-management"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ChangeManagement />
          </Suspense>
        }
      />

      <Route
        path="/risk-acceptance"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <RiskAcceptance />
          </Suspense>
        }
      />

      <Route
        path="/search"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <SearchVulns />
          </Suspense>
        }
      />

      <Route
        path="/folders"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Folders />
          </Suspense>
        }
      />

      <Route
        path="/folders/:id"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <FolderDetails />
          </Suspense>
        }
      />

      <Route
        path="/assessment-edit"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AssessmentEdit />
          </Suspense>
        }
      />
      <Route
        path="/sla"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <SlaPage />
          </Suspense>
        }
      />

      <Route
        path="/business-units"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <BusinessUnits />
          </Suspense>
        }
      />

      <Route
        path="/business-units/:id"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <BusinessUnitDetails />
          </Suspense>
        }
      />


      <Route
        path="/risk-acceptance"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <RiskAcceptance />
          </Suspense>
        }
      />
      <Route
        path="/automation-engine"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AutomationEngine />
          </Suspense>
        }
      />

      <Route
        path="/service-vendors"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Vendors />
          </Suspense>
        }
      />

      <Route
        path="/vulnerability-sources"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <VulnerabilitySources />
          </Suspense>
        }
      />

      <Route
        path="/remidation-campaigns"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <RemidationCampaignsPage />
          </Suspense>
        }
      />

      <Route
        path="/automation-engine"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AutomationEngine />
          </Suspense>
        }
      />

      <Route
        path="/service-vendors"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Vendors />
          </Suspense>
        }
      />

      <Route
        path="/vulnerability-sources"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <VulnerabilitySources />
          </Suspense>
        }
      />

      <Route path="/false-positive-analysis" element={
        <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
          <FalsePositiveWorkflow />
        </Suspense>
      } />

      <Route
        path="/remidation-campaign-details"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <RemidationCampaignDetailsPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
