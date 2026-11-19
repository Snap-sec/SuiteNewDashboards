import { useRef } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { useConfigureApisecProjectMutation } from '@/services/apisec/projectsApi';
import { Button } from '@/components/ui/button';
import { ContentLoader } from '@/components/common/content-loader';
import AppInfo from '../web-app-components/app-info';
import Authentication from '../web-app-components/authentication';
import BlacklistedUrls from '../web-app-components/blacklisted-urls';
import Collections from '../web-app-components/collections';
import Environment from '../web-app-components/environment';
import ScanningScope from '../web-app-components/scanning-scope';
import ScanProfileSection from '../web-app-components/scan-profile-section';

function WebAppScanner({ data, isLoading }) {
  const [configureApisecProject, { isLoading: isSavingSettings }] =
    useConfigureApisecProjectMutation();

  const appInfoRef = useRef();
  const scanningScopeRef = useRef();
  const authenticationRef = useRef();
  const collectionsRef = useRef();
  const environmentRef = useRef();
  const blacklistedUrlsRef = useRef();
  const scanProfileRef = useRef();

  const pathname = window.location.pathname;
  const projectId = pathname.split('/').pop();

  const handleSaveSettings = async () => {
    const payload = {
      target_url: appInfoRef.current?.getData()?.targetUrl,
      collection_uids: collectionsRef.current?.getData()?.collectionIds,
      environment_id: environmentRef.current?.getData()?.environmentId,
      application_name: appInfoRef.current?.getData()?.applicationName,
      owner: appInfoRef.current?.getData()?.owner,
      tags: appInfoRef.current?.getData()?.tags,
      scope: scanningScopeRef.current
        ?.getData()
        ?.filter((item) => item?.type && item?.value)
        ?.map((item) => ({
          type: item?.type?.label?.toLowerCase?.(),
          value: item?.value,
        })),
      exclude_scope:
        blacklistedUrlsRef?.current
          ?.getData()
          ?.filter((item) => item?.value && item?.type)
          ?.map((item) => ({
            type: item?.type?.label?.toLowerCase?.(),
            value: item?.value,
          })) || [],
      scan_type: crawlerSettingRef.current?.getData(),
      auth_success_string:
        authenticationRef.current?.getData()?.authDetectionLogic,
      auth_profile_id: scanProfileRef.current?.getData()?.auth_profile_id,
    };

    // Input Validations
    // if (!payload?.target_url) return toast.error('Target URL is required!');
    // if (!payload?.application_name)
    //   return toast.error('Application name is required!');

    // if (!payload?.scope?.[0]?.type || !payload?.scope?.[0]?.value)
    //   return toast.error('Add atleast one Scanning Scope!');

    toast.promise(
      configureApisecProject({
        projectId,
        payload,
      }).unwrap(),
      {
        loading: 'Saving Settings..',
        success: 'Settings Saved successfully.',
        error: 'Error saving Settings!',
      },
    );
  };

  if (!data && isLoading) return <ContentLoader />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="font-medium">Application Information</p>
        <AppInfo ref={appInfoRef} data={data} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-medium">Scanning Scope</p>
        <ScanningScope ref={scanningScopeRef} data={data} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-medium">Blacklisted URL's</p>
        <BlacklistedUrls ref={blacklistedUrlsRef} data={data} />
      </div>

      <div className="flex flex-col gap-2">
        <div className=" flex justify-between items-center mr-2">
          <p className="font-medium">Authentication</p>
          <a
            href="https://suite.snapsec.co/sample/download/authenticate.js"
            className=" text-primary text-[11px] underline flex items-center justify-center gap-1"
          >
            Download Sample Script
          </a>
        </div>
        <Authentication
          ref={authenticationRef}
          isLoading={isLoading}
          data={data}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-medium">Scan Profiles</p>
        <ScanProfileSection ref={scanProfileRef} data={data} isLoading={isLoading} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-medium">Collections</p>
        <Collections ref={collectionsRef} data={data} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-medium">Environment</p>
        <Environment ref={environmentRef} data={data} />
      </div>

      {/* <div className="flex flex-col gap-2">
        <p className="font-medium">Crawler Settings</p>
        <CrawlerSetting ref={crawlerSettingRef} data={data} />
      </div> */}

      {/* <div className="flex flex-col gap-4 md:flex-row lg:flex-row w-full py-5">
        <Card className="w-full md:w-1/3 lg:w-1/3 ">
          <CardHeader>
            <CardTitle>Webhook URL</CardTitle>
          </CardHeader>
          <div className="flex px-2 py-5 flex-col ">
            <InputWithCopy
              value={`${appConfig.BASE_URL}/apisec/api/v1/projects/${projectId}/browser-requests/${user?.orgId}`}
              toastMsg="Web hook copied successfully!"
              className="w-full"
            />
          </div>
        </Card>

      </div> */}

      <div className="flex justify-end">
        <Button
          disabled={isSavingSettings}
          variant="primary"
          onClick={handleSaveSettings}
        >
          <Save /> {isSavingSettings ? 'Saving' : 'Save'} Settings
        </Button>
      </div>
    </div>
  );
}

export default WebAppScanner;
