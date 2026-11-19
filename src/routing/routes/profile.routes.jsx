import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { ContentLoader } from '@/components/common/content-loader';
// const DepartmentsDetailsPage = React.lazy(() => import('@/pages/account/members/department-details/departments-details'))

// import DepartmentsPage from '../../pages/account/members/departments/departments-basic-page';

import AuthorityGuard from '../../components/custom/authority-guard/AuthorityGuard';

const GetStartedPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountGetStartedPage,
  })),
);

const IntegrationPage = React.lazy(
  () => import('@/pages/account/integration/integration'),
);

const AccountActivityPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountActivityPage,
  })),
);
const AccountAllowedIPAddressesPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountAllowedIPAddressesPage,
  })),
);
const AccountApiKeysPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountApiKeysPage,
  })),
);
const AccountMcpAccessPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountMcpAccessPage,
  })),
);
const AccountAppearancePage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountAppearancePage,
  })),
);
const AccountBackupAndRecoveryPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountBackupAndRecoveryPage,
  })),
);
const AccountBasicPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountBasicPage,
  })),
);
const AccountCompanyProfilePage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountCompanyProfilePage,
  })),
);
const AccountCurrentSessionsPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountCurrentSessionsPage,
  })),
);
const AccountDeviceManagementPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountDeviceManagementPage,
  })),
);
const AccountEnterprisePage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountEnterprisePage,
  })),
);
const AccountGetStartedPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountGetStartedPage,
  })),
);
const AccountHistoryPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountHistoryPage,
  })),
);
const AccountImportMembersPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountImportMembersPage,
  })),
);
const AccountIntegrationsPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountIntegrationsPage,
  })),
);
const AccountInviteAFriendPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountInviteAFriendPage,
  })),
);
const AccountMembersStarterPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountMembersStarterPage,
  })),
);
const AccountNotificationsPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountNotificationsPage,
  })),
);
const AccountOverviewPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountOverviewPage,
  })),
);
const AccountPermissionsCheckPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountPermissionsCheckPage,
  })),
);
const AccountPermissionsTogglePage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountPermissionsTogglePage,
  })),
);
const AccountPlansPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountPlansPage,
  })),
);
const AccountPrivacySettingsPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountPrivacySettingsPage,
  })),
);
const AccountRolesPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountRolesPage,
  })),
);
const AccountSecurityGetStartedPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountSecurityGetStartedPage,
  })),
);
const AccountSecurityLogPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountSecurityLogPage,
  })),
);
const AccountSettingsEnterprisePage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountSettingsEnterprisePage,
  })),
);
const AccountSettingsModalPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountSettingsModalPage,
  })),
);
const AccountSettingsPlainPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountSettingsPlainPage,
  })),
);
const AccountSettingsSidebarPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountSettingsSidebarPage,
  })),
);
const AccountTeamInfoPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountTeamInfoPage,
  })),
);
const MembersPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.MembersPage,
  })),
);
const TeamsPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({ default: module.TeamsPage })),
);
const AccountTeamsStarterPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountTeamsStarterPage,
  })),
);
const AccountUserProfilePage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AccountUserProfilePage,
  })),
);

const AccountConfigrationPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.ConfigrationPage,
  })),
);

const DepartmentsPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.DepartmentsPage,
  })),
);

const DepartmentsDetailsPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.DepartmentsDetailsPage,
  })),
);

const TeamDetailsPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.TeamDetailsPage,
  })),
);

const CompanyProfilePage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.CompanyProfilePage,
  })),
);

const AIConfigrationsPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.AIConfigrationsPage,
  })),
);

const DataBackupPage = React.lazy(() =>
  import('@/pages/account').then((module) => ({
    default: module.DataBackupPage,
  })),
);

export function ProfileRoutingSetup() {
  return (
    <Routes>
      <Route
        path="/account/integrations"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <IntegrationPage />
          </Suspense>
        }
      />

      <Route
        path="/started"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <GetStartedPage />
          </Suspense>
        }
      />
      <Route
        path="/account/user-profile"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountUserProfilePage />
          </Suspense>
        }
      />

      <Route
        path="/account/company-profile"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <CompanyProfilePage />
          </Suspense>
        }
      />

      <Route
        path="/account/ai-config"
        element={
          <AuthorityGuard forbidRoles={['Developer']} showAccessDenied={true}>
            <Suspense
              fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
            >
              <AIConfigrationsPage />
            </Suspense>
          </AuthorityGuard>
        }
      />

      <Route
        path="/account/data-backup"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <DataBackupPage />
          </Suspense>
        }
      />

      <Route
        path="/account/user-info"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountSettingsSidebarPage />
          </Suspense>
        }
      />

      <Route
        path="/account/settings-enterprise"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountSettingsEnterprisePage />
          </Suspense>
        }
      />

      <Route
        path="/account/settings-plain"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountSettingsPlainPage />
          </Suspense>
        }
      />

      <Route
        path="/account/settings-modal"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountSettingsModalPage />
          </Suspense>
        }
      />

      <Route
        path="/account/billing/basic"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountBasicPage />
          </Suspense>
        }
      />

      <Route
        path="/account/billing/enterprise"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountEnterprisePage />
          </Suspense>
        }
      />

      <Route
        path="/account/billing/plans"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountPlansPage />
          </Suspense>
        }
      />

      <Route
        path="/account/billing/history"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountHistoryPage />
          </Suspense>
        }
      />

      <Route
        path="/account/security/get-started"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountSecurityGetStartedPage />
          </Suspense>
        }
      />

      <Route
        path="/account/security/overview"
        element={
          <AuthorityGuard roles={['Admin']} showAccessDenied={true}>
            <Suspense
              fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
            >
              <AccountOverviewPage />
            </Suspense>
          </AuthorityGuard>
        }
      />

      <Route
        path="/account/security/allowed-ip-addresses"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountAllowedIPAddressesPage />
          </Suspense>
        }
      />

      <Route
        path="/account/security/privacy-settings"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountPrivacySettingsPage />
          </Suspense>
        }
      />

      <Route
        path="/account/security/device-management"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountDeviceManagementPage />
          </Suspense>
        }
      />

      <Route
        path="/account/security/backup-and-recovery"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountBackupAndRecoveryPage />
          </Suspense>
        }
      />

      <Route
        path="/account/security/current-sessions"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountCurrentSessionsPage />
          </Suspense>
        }
      />

      <Route
        path="/account/security/security-log"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountSecurityLogPage />
          </Suspense>
        }
      />

      <Route
        path="/account/members/team-starter"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountTeamsStarterPage />
          </Suspense>
        }
      />

      <Route
        path="/account/members/teams"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <TeamsPage />
          </Suspense>
        }
      />

      <Route
        path="/account/members/team-info"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountTeamInfoPage />
          </Suspense>
        }
      />

      <Route
        path="/account/members/members-starter"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountMembersStarterPage />
          </Suspense>
        }
      />

      <Route
        path="/account/members/team-members"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <MembersPage />
          </Suspense>
        }
      />

      <Route
        path="/account/members/departments"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <DepartmentsPage />
          </Suspense>
        }
      />

      <Route
        path="/account/members/import-members"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountImportMembersPage />
          </Suspense>
        }
      />

      <Route
        path="/account/members/roles"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountRolesPage />
          </Suspense>
        }
      />

      <Route
        path="/account/members/permissions-toggle"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountPermissionsTogglePage />
          </Suspense>
        }
      />

      <Route
        path="/account/members/permissions-check"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountPermissionsCheckPage />
          </Suspense>
        }
      />

      <Route
        path="/account/integrations"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountIntegrationsPage />
          </Suspense>
        }
      />

      <Route
        path="/account/notifications"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountNotificationsPage />
          </Suspense>
        }
      />

      <Route
        path="/account/api-keys"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountApiKeysPage />
          </Suspense>
        }
      />

      <Route
        path="/account/mcp-access"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountMcpAccessPage />
          </Suspense>
        }
      />

      <Route
        path="/account/configration"
        element={
          <AuthorityGuard roles={['Admin']} showAccessDenied={true}>
            <Suspense
              fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
            >
              <AccountConfigrationPage />
            </Suspense>
          </AuthorityGuard>
        }
      />

      <Route
        path="/account/appearance"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountAppearancePage />
          </Suspense>
        }
      />

      <Route
        path="/account/invite-a-friend"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountInviteAFriendPage />
          </Suspense>
        }
      />

      {/* new route for department details */}
      <Route
        path="/account/members/departments/:departmentId"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <DepartmentsDetailsPage />
          </Suspense>
        }
      />

      <Route
        path="/account/members/teams/:teamId"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <TeamDetailsPage />
          </Suspense>
        }
      />

      <Route
        path="/account/activity"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AccountActivityPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
