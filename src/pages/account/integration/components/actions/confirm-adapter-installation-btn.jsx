/**
 * ConnfirmAdapterInstallation Component
 * -------------------------------------
 * This component renders a confirmation-based installation button for integrating an adapter.
 * It uses a confirmation dialog that prompts the user with "Cancel" and "Proceed" options before proceeding.
 *
 * 🔧 Key Features:
 * - Shows a confirmation dialog before integrating an adapter.
 * - Uses `@/components/custom/button-with-confirmation` for confirm/cancel handling.
 * - Displays toast notifications for loading, success, and failure states using `sonner`.
 * - Disables the button while the installation is in progress.
 *
 * 🧩 Props:
 * - `type` (string): The name/type of the adapter to be installed.
 *
 *
 * 🛠 Example Usage:
 * ```jsx
 * <ConnfirmAdapterInstallation type="my-adapter" />
 * ```
 */

import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { useAddConnectApiSecIntegrationMutation } from '@/services/apisec/integrationApi';

const ConnfirmAdapterInstallation = ({ type }) => {
  const [addIntegration, { isLoading: isIntegratingAdptr }] =
    useAddConnectApiSecIntegrationMutation();

  const handleAdptrInstallation = () => {
    const payload = {
      name: type,
      description: `Install adapter ${type}`,
      environment: { base_url: window.location.host },
    };

    toast.promise(addIntegration({ payload }).unwrap(), {
      loading: 'Starting Adapter Installation',
      success: 'Adapter Integrated Successfully',
      error: 'Failed to Integrate an Adapter',
    });
  };

  return (
    <ButtonWithConfirm
      disabled={isIntegratingAdptr}
      variant="ghost"
      confirm={true}
      onConfirm={() => handleAdptrInstallation()}
      dialog={<p>Are You Sure You Want To Install this Adapter?</p>}
      // confirmOnInput={'install-adapter'}
      confirmButton={
        <Button variant="primary" disabled={isIntegratingAdptr}>
          Proceed
        </Button>
      }
      cancelButton={<Button variant="outline">Cancel</Button>}
    >
      <Download /> Install
    </ButtonWithConfirm>
  );
};

export default ConnfirmAdapterInstallation;
