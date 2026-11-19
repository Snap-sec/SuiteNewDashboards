import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { ContentLoader } from '@/components/common/content-loader';
const Pentests = React.lazy(() => import('@/pages/auto-pt/pentest/pentest'));
const PentestCreate = React.lazy(() => import('@/pages/auto-pt/pentest-create/pentest-create'));
const PentestDetail = React.lazy(() => import('@/pages/auto-pt/pentest-detail/pentest-detail'));
const Vulnerabilities = React.lazy(() => import('@/pages/auto-pt/vulnerabilities/vulnerabilities'));
const Assets = React.lazy(() => import('@/pages/auto-pt/assets/assets'));
const Integrations = React.lazy(() => import('@/pages/integrations/intregation'));
const AutoPentestVulnReport = React.lazy(
  () => import('@/pages/public/apt-reports/vuln-report/auto-pentest-vuln-report'),
);

const AgentsPage = React.lazy(() => import('@/pages/auto-pt/agents/agents'));
const DeploymentsPage = React.lazy(() => import('@/pages/auto-pt/deployment/deployment'));
const ScansPage = React.lazy(() => import('@/pages/auto-pt/scans/scans'));
const Dashboard = React.lazy(() => import('@/pages/auto-pt/dashboard/dashboard'));

// Pentesting Module
const PentestingOverview = React.lazy(() => import('@/pages/auto-pt/pentesting/overview'));
const PentestingProjects = React.lazy(() => import('@/pages/auto-pt/pentesting/projects'));
const PentestingFindings = React.lazy(() => import('@/pages/auto-pt/pentesting/findings'));

// Vulnerability Scanning Module
const VulnScanningOverview = React.lazy(() => import('@/pages/auto-pt/vulnerability-scanning/overview'));
const VulnScanningProjects = React.lazy(() => import('@/pages/auto-pt/vulnerability-scanning/projects'));
const VulnScanningFindings = React.lazy(() => import('@/pages/auto-pt/vulnerability-scanning/findings'));

// Cloud Security Module
const CloudSecurityOverview = React.lazy(() => import('@/pages/auto-pt/cloud-security/overview'));
const CloudSecurityProjects = React.lazy(() => import('@/pages/auto-pt/cloud-security/projects'));
const CloudSecurityFindings = React.lazy(() => import('@/pages/auto-pt/cloud-security/findings'));
const CloudSecurityConnect = React.lazy(() => import('@/pages/auto-pt/cloud-security/connect'));

// Code Security Module
const CodeSecurityOverview = React.lazy(() => import('@/pages/auto-pt/code-security/overview'));
const CodeSecurityProjects = React.lazy(() => import('@/pages/auto-pt/code-security/projects'));
const CodeSecurityFindings = React.lazy(() => import('@/pages/auto-pt/code-security/findings'));
const CodeSecurityConnect = React.lazy(() => import('@/pages/auto-pt/code-security/connect'));
const CodeSecuritySettings = React.lazy(() => import('@/pages/auto-pt/code-security/settings'));

const VulnerabilityReport = React.lazy(
  () => import('@/pages/VM/pages/vulnerability-report/vulnerability-report'),
);

export function AutoPTRoutingSetup() {
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

      {/* Pentesting Module */}
      <Route
        path="/pentesting"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <PentestingOverview />
          </Suspense>
        }
      />
      <Route
        path="/pentesting/overview"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <PentestingOverview />
          </Suspense>
        }
      />
      <Route
        path="/pentesting/projects"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <PentestingProjects />
          </Suspense>
        }
      />
      <Route
        path="/pentesting/findings"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <PentestingFindings />
          </Suspense>
        }
      />

      {/* Vulnerability Scanning Module */}
      <Route
        path="/vulnerability-scanning"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <VulnScanningOverview />
          </Suspense>
        }
      />
      <Route
        path="/vulnerability-scanning/overview"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <VulnScanningOverview />
          </Suspense>
        }
      />
      <Route
        path="/vulnerability-scanning/projects"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <VulnScanningProjects />
          </Suspense>
        }
      />
      <Route
        path="/vulnerability-scanning/findings"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <VulnScanningFindings />
          </Suspense>
        }
      />

      {/* Cloud Security Module */}
      <Route
        path="/cloud-security"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <CloudSecurityOverview />
          </Suspense>
        }
      />
      <Route
        path="/cloud-security/overview"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <CloudSecurityOverview />
          </Suspense>
        }
      />
      <Route
        path="/cloud-security/projects"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <CloudSecurityProjects />
          </Suspense>
        }
      />
      <Route
        path="/cloud-security/findings"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <CloudSecurityFindings />
          </Suspense>
        }
      />
      <Route
        path="/cloud-security/connect"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <CloudSecurityConnect />
          </Suspense>
        }
      />
      <Route
        path="/cloud-security/add-account"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <CloudSecurityConnect />
          </Suspense>
        }
      />

      {/* Code Security Module */}
      <Route
        path="/code-security"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <CodeSecurityOverview />
          </Suspense>
        }
      />
      <Route
        path="/code-security/overview"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <CodeSecurityOverview />
          </Suspense>
        }
      />
      <Route
        path="/code-security/projects"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <CodeSecurityProjects />
          </Suspense>
        }
      />
      <Route
        path="/code-security/findings"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <CodeSecurityFindings />
          </Suspense>
        }
      />
      <Route
        path="/code-security/connect"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <CodeSecurityConnect />
          </Suspense>
        }
      />
      <Route
        path="/code-security/settings"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <CodeSecuritySettings />
          </Suspense>
        }
      />
      <Route
        path="/code-security/add-account"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <CodeSecurityConnect />
          </Suspense>
        }
      />
      <Route
        path="/pentests/create"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <PentestCreate />
          </Suspense>
        }
      />
      <Route
        path="/pentests/new"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <PentestCreate />
          </Suspense>
        }
      />
      <Route
        path="/pentests/:id"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <PentestDetail />
          </Suspense>
        }
      />
      <Route
        path="/pentests"
        element={<Navigate to="/apt/pentesting/projects" replace />}
      />
      {/* Backwards compatibility aliases */}
      <Route
        path="/applications"
        element={<Navigate to="/apt/pentesting/projects" replace />}
      />
      <Route
        path="/applications/:id"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <PentestDetail />
          </Suspense>
        }
      />
      <Route
        path="/projects"
        element={<Navigate to="/apt/pentesting/projects" replace />}
      />
      <Route
        path="/all-projects"
        element={<Navigate to="/apt/pentesting/projects" replace />}
      />
      <Route
        path="/projects/:id"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <PentestDetail />
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
        path="/vulnerability-report"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <VulnerabilityReport />
          </Suspense>
        }
      />

      <Route
        path="/vulnerablities"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <Vulnerabilities />
          </Suspense>
        }
      />
      <Route
        path="/assets"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <Assets />
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
        path="/scans"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <ScansPage />
          </Suspense>
        }
      />

      <Route
        path="/agents"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <AgentsPage />
          </Suspense>
        }
      />

      <Route
        path="/deployment"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <DeploymentsPage />
          </Suspense>
        }
      />
      <Route
        path="/reports/vuln-report"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <AutoPentestVulnReport />
          </Suspense>
        }
      />
      <Route
        path="/auto-pentest-vuln-report"
        element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <AutoPentestVulnReport />
          </Suspense>
        }
      />
    </Routes>
  );
}
