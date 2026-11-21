import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { ContentLoader } from '@/components/common/content-loader';
import AuthorityGuard from '../../components/custom/authority-guard/AuthorityGuard';


const Dashboard = React.lazy(
  () => import('@/pages/AIM/pages/dashboard/dashboard'),
);
const Dashboard2 = React.lazy(
  () => import('@/pages/AIM/pages/dashboard2'),
);
const UnifiedAssetInventory = React.lazy(
  () => import('@/pages/AIM/pages/assets-pages/unified-inventory'),
);
const ExpiredAssets = React.lazy(
  () => import('@/pages/AIM/pages/assets-pages/expired-assets'),
);
const SensorsPage = React.lazy(
  () => import('@/pages/AIM/pages/sensors'),
);
const Assets = React.lazy(
  () => import('@/pages/AIM/pages/assets-pages/assets/assets'),
);
const Subdomain = React.lazy(
  () =>
    import('@/pages/AIM/pages/assets-pages/subdomains/subdomains'),
);
const Apis = React.lazy(
  () => import('@/pages/AIM/pages/assets-pages/apis/apis'),
);
const IpAddress = React.lazy(
  () =>
    import(
      '@/pages/AIM/pages/assets-pages/ip-addresses/ip-addresses'
    ),
);

const Repositories = React.lazy(
  () =>
    import(
      '@/pages/AIM/pages/assets-pages/repositories/repositories'
    ),
);
const Certificates = React.lazy(
  () =>
    import(
      '@/pages/AIM/pages/assets-pages/certificates/certificates'
    ),
);
const Emplyees = React.lazy(
  () =>
    import('@/pages/AIM/pages/assets-pages/employees/employees'),
);
const Application = React.lazy(
  () =>
    import(
      '@/pages/AIM/pages/assets-pages/applications/applications'
    ),
);
const Workstation = React.lazy(
  () =>
    import(
      '@/pages/AIM/pages/assets-pages/workstations/workstations'
    ),
);
const Servers = React.lazy(
  () =>
    import(
      '@/pages/AIM/pages/assets-pages/servers/servers'
    ),
);
const Registries = React.lazy(
  () =>
    import('@/pages/AIM/pages/assets-pages/registries/registries'),
);
const ObjectStorage = React.lazy(
  () =>
    import(
      '@/pages/AIM/pages/assets-pages/object-storages/object-storages'
    ),
);
const Licenses = React.lazy(
  () => import('@/pages/AIM/pages/assets-pages/licenses/licenses'),
);
const Vendors = React.lazy(
  () => import('@/pages/AIM/pages/assets-pages/vendors/vendors'),
);

const AssetClassifersPage = React.lazy(
  () =>
    import('@/pages/AIM/pages/engine/classifers/classifers-page'),
);



// const LogsPage = React.lazy(
//   () =>
//     import('@/pages/AIM/pages/engine/logs/logs-page'),
// );

const ExportPage = React.lazy(
  () => import('@/pages/AIM/pages/export/export.jsx'),
);
const SettingsPage = React.lazy(
  () => import('@/pages/AIM/pages/settings/settings.jsx'),
);
const AdaptersPage = React.lazy(
  () => import('@/pages/AIM/pages/adapters/adapters.jsx'),
);
const AssetEdit = React.lazy(
  () =>
    import('@/pages/AIM/pages/assets-pages/asset-edit/asset-edit'),
);

const EditAssetGridPage = React.lazy(
  () => import('@/pages/AIM/pages/assets-pages/edit-asset/manage-assets-page.jsx'),
);

const BusinessUnitsPage = React.lazy(
  () =>
    import('@/pages/AIM/pages/business-units/business-units.jsx'),
);

const BusinessUnitDetailsPage = React.lazy(
  () =>
    import('@/pages/AIM/pages/business-unit-details/business-unit-details-page.jsx'),
);

const RuleEditor = React.lazy(
  () =>
    import('@/pages/AIM/pages/engine/classifers/components/rule-editor/rule-editor.jsx'),
);
const SignalLibrary = React.lazy(
  () => import('@/pages/AIM/pages/engine/signal-library/signal-library'),
);



// const AssetEdit3 = React.lazy(
//   () =>
//     import('@/pages/AIM/pages/assets-pages/asset-edit/asset-edit3'),
// );


const AgentSettingsPage = React.lazy(
  () =>
    import('@/pages/AIM/pages/sensor management/sensor-deployment'),
);

const AgentListPage = React.lazy(
  () =>
    import('@/pages/AIM/pages/settings/components/registered-agents'),
);

const Decomissioned = React.lazy(
  () =>
    import('@/pages/AIM/pages/assets-pages/decomissioned/decomissioned'),
);


const Staged = React.lazy(
  () =>
    import('@/pages/AIM/pages/assets-pages/staged/staged'),
);







export function AssetInventoryRoutingSetup() {

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Dashboard />
          </Suspense>
        }
      />

      <Route
        path="/dashboard2"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Dashboard2 />
          </Suspense>
        }
      />



      <Route
        path="/assets/retired"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ExpiredAssets />
          </Suspense>
        }
      />

      <Route
        path="/assets/retired/"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ExpiredAssets />
          </Suspense>
        }
      />

      <Route
        path="/retired-assets"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ExpiredAssets />
          </Suspense>
        }
      />

      <Route
        path="/assets/expired"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ExpiredAssets />
          </Suspense>
        }
      />

      <Route
        path="/assets/expired/"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ExpiredAssets />
          </Suspense>
        }
      />

      <Route
        path="/expired-assets"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ExpiredAssets />
          </Suspense>
        }
      />

      <Route
        path="/assets/decomissioned"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ExpiredAssets defaultTab="decommissioned" />
          </Suspense>
        }
      />

      <Route
        path="/assets/staged"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ExpiredAssets defaultTab="staged" />
          </Suspense>
        }
      />



      <Route
        path="/sensors"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <SensorsPage />
          </Suspense>
        }
      />

      <Route
        path="/sensors/"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <SensorsPage />
          </Suspense>
        }
      />

      <Route
        path="/sensor-management"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <SensorsPage />
          </Suspense>
        }
      />

      <Route
        path="/agent-settings"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <SensorsPage defaultTab="deployment" />
          </Suspense>
        }
      />

      <Route
        path="/agent-list"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <SensorsPage defaultTab="inventory" />
          </Suspense>
        }
      />

      <Route
        path="/advance-search"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Assets />
          </Suspense>
        }
      />

      <Route
        path="/assets/subdomains"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Subdomain />
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
        path="/assets/ips"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <IpAddress />
          </Suspense>
        }
      />

      <Route
        path="/assets/repositories"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Repositories />
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
        path="/assets/employees"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Emplyees />
          </Suspense>
        }
      />

      <Route
        path="/assets/applications"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Application />
          </Suspense>
        }
      />

      <Route
        path="/assets/workstation"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Workstation />
          </Suspense>
        }
      />

      <Route
        path="/assets/servers"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Servers />
          </Suspense>
        }
      />

      <Route
        path="/assets/registries"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Registries />
          </Suspense>
        }
      />

      <Route
        path="/assets/object-storage"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ObjectStorage />
          </Suspense>
        }
      />

      <Route
        path="/assets/licenses"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Licenses />
          </Suspense>
        }
      />

      <Route
        path="/assets/vendors"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Vendors />
          </Suspense>
        }
      />

      <Route
        path="/assets/service-vendors"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Vendors />
          </Suspense>
        }
      />

      <Route
        path="/assets/licensing"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <Licenses />
          </Suspense>
        }
      />

      <Route
        path="/assets"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <UnifiedAssetInventory />
          </Suspense>
        }
      />

      <Route
        path="/assets/"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <UnifiedAssetInventory />
          </Suspense>
        }
      />

      <Route
        path="/business-units/"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <BusinessUnitsPage />
          </Suspense>
        }
      />

      <Route
        path="/business-unit/:id"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <BusinessUnitDetailsPage />
          </Suspense>
        }
      />

      <Route
        path="/automation"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AssetClassifersPage />
          </Suspense>
        }
      />


      <Route
        path="/automation/new"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <RuleEditor />
          </Suspense>
        }
      />

      <Route
        path="/engine/policy/library"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <SignalLibrary />
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
        path="/export/"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <ExportPage />
          </Suspense>
        }
      />

      <Route
        path="/settings/"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AuthorityGuard forbidRoles={['Auditor']}>
              <SettingsPage />
            </AuthorityGuard>
          </Suspense>
        }
      />

      <Route
        path="/adapters/"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AdaptersPage />
          </Suspense>
        }
      />



      <Route
        path="/asset-edit/:id"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AssetEdit />
          </Suspense>
        }
      />

      <Route
        path="/edit-asset"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <EditAssetGridPage />
          </Suspense>
        }
      />

      <Route
        path="/edit-asset/:orgId"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <EditAssetGridPage />
          </Suspense>
        }
      />

      {/* <Route
        path="/asset-edit3/:id"
        element={
          <Suspense
            fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}
          >
            <AssetEdit3 />
          </Suspense>
        }
      /> */}
    </Routes>
  );
}