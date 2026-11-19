import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import { useAddConnectApiSecIntegrationMutation } from '@/services/apisec/integrationApi';
import EightFeilderForm from '../forms/eight-feilder-adapter-installation-form';
import ThreeFeilderForm from '../forms/three-fielder-adapter-installation-form';
import TwoFeilderForm from '../forms/two-fielder-adapter-installation-form';

function InstallAdapterModal({
  onClose,
  onCreate,
  triggeredBtnText = 'Install',
  title = '',
  adapterType = '',
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [adapterPayload, setAdapterPayload] = useState({});

  const [addIntegration, { isLoading: isInstallingAdapter }] =
    useAddConnectApiSecIntegrationMutation();

  const threeFeilderAdapters = ['censys', 'gitlab'];
  const twoFeilderAdapters = [
    'crt',
    'hackertarget',
    'github',
    'slack',
    'cloudflare',
    'gsheet',
    'swagger',
    'postman',
    'asm',
    'sm',
    'vm',
  ];
  const eightFeilderAdapters = ['oci'];

  const handleAdapterInstall = () => {
    const requiredFields = (() => {
      if (
        [
          'github',
          'slack',
          'cloudflare',
          'postman',
          'asm',
          'vm',
          'sm',
        ].includes(adapterType)
      )
        return ['apiKey', 'name'];
      if (['crt', 'hackertarget', 'gsheet', 'swagger'].includes(adapterType))
        return ['domain', 'name'];

      if (['censys', 'gitlab'].includes(adapterType))
        return ['apiKey', 'domain', 'name']; // default

      if (['oci'].includes(adapterType))
        return [
          'domain',
          'apiUrl',
          'fingerprint',
          'tenancyId',
          'privateKey',
          'userId',
          'region',
          'name',
        ];
    })();

    for (const field of requiredFields) {
      if (!adapterPayload[field]) {
        toast.error(`Please enter ${field}`);
        return;
      }
    }

    // Build payload matching apisec expected shape. For adapters that require
    // apiKey (eg. Postman) include apiKey and environment; otherwise include
    // available fields. This keeps payload consistent with the example:
    // { apiKey, name, description, environment: { base_url } }
    const payload = {
      name: adapterPayload?.name || adapterType,
      description: adapterPayload?.description || `Integration for ${adapterType}`,
      environment: { base_url: window.location.host },
    };

    if (adapterPayload?.apiKey) payload.apiKey = adapterPayload.apiKey;
    if (adapterPayload?.domain) payload.domain = adapterPayload.domain;

    // Include other OCI-like config under otherConfig if present
    const otherConfigFields = [
      'apiUrl',
      'fingerprint',
      'privateKey',
      'region',
      'tenancyId',
      'userId',
    ];
    const otherConfig = {};
    otherConfigFields.forEach((k) => {
      if (adapterPayload[k]) otherConfig[k] = adapterPayload[k];
    });
    if (Object.keys(otherConfig).length) payload.otherConfig = otherConfig;

    toast.promise(
      addIntegration({ payload })
        .unwrap()
        .then(() => {
          setIsOpen(false);
        }),
      {
        loading: 'Installing an Adapter',
        success: 'Adapter has been Installed',
        error: 'Failed to install an Adapter',
      },
    );
  };

  // Reset state after closing modal
  useEffect(() => {
    if (!isOpen) setAdapterPayload({});
  }, [isOpen]);

  return (
    <Modal
      className="w-full sm:w-[90%] md:w-[500px] lg:w-[600px] xl:w-[700px]"
      open={isOpen}
      setOpen={setIsOpen}
      title={`Install with ${title}`}
      description="Fill the form to install the Adapter"
      trigger={
        <Button variant="outline" disabled={isInstallingAdapter}>
          <Download />
          Install
        </Button>
      }
      footer={
        <div className="mt-2">
          <Button
            variant="outline"
            disabled={isInstallingAdapter}
            onClick={handleAdapterInstall}
          >
            <Download /> Install Now
          </Button>
        </div>
      }
    >
      {threeFeilderAdapters.includes(adapterType) && (
        <ThreeFeilderForm
          adapterType={adapterType}
          adapterPayload={adapterPayload}
          onPayloadChange={setAdapterPayload}
        />
      )}

      {twoFeilderAdapters.includes(adapterType) && (
        <TwoFeilderForm
          adapterType={adapterType}
          adapterPayload={adapterPayload}
          onPayloadChange={setAdapterPayload}
        />
      )}

      {eightFeilderAdapters.includes(adapterType) && (
        <EightFeilderForm
          adapterType={adapterType}
          adapterPayload={adapterPayload}
          onPayloadChange={setAdapterPayload}
        />
      )}
    </Modal>
  );
}

export default InstallAdapterModal;
