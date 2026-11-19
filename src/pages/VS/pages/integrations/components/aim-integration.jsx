import { useEffect, useState } from "react";
import { Download, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ButtonWithConfirm } from "@/components/custom/button-with-confirmation";
import {
  useGetVsAdaptersQuery,
  useInstallVsAdapterMutation,
  useRefreshVsAdapterMutation,
} from "../../../../../services/vs/integrationApi";
import { Button } from "../../../../../components/ui/button";
import { DeleteAimIntegration } from "./actions/delete-aim-integration";


function AimIntegration() {
    const { data: adapters, isLoading: loadingAdapters, isError } = useGetVsAdaptersQuery();
    const [installAdapter] = useInstallVsAdapterMutation();
    const [refreshAdapter, {isLoading: isRefreshing}] = useRefreshVsAdapterMutation();

  const [apiKey, setApiKey] = useState("");

  const [payload, setPayload] = useState({
    name: "Asset Inventory",
    adapterName: 'aim'
  });

  // This effect now correctly populates the apiKey from the adapter data
  // only when the component mounts or the adapter data changes.
  useEffect(() => {
    if (adapters?.adapters?.length) {
      setApiKey(adapters.adapters[0]?.config?.apiKey || "");
    }
  }, [adapters]);

  const handleInstallAdapter = () => {
    const currentPayload = {
      ...payload,
    };

    console.log("Sending payload:", currentPayload);

    toast.promise(installAdapter(currentPayload).unwrap(), {
      loading: "Installing adapter",
      success: "Adapter installed",
      error: 'Failed to install adapter'
    });
  };

  const handleRefreshAdapter = () => {
    if (adapters?.adapters?.length) {
      const adapterId = adapters.adapters[0]._id;
      toast.promise(refreshAdapter(adapterId).unwrap(), {
        loading: "Refreshing adapter",
        success: "Adapter refreshed successfully",
        error: 'Failed to refresh adapter'
      });
    }
  };

  if (loadingAdapters) {
    return (
      <Card className="p-4 flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="flex gap-2 items-center">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </Card>
    );
  }

  if(isError) return null;

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.role === 'Admin' || user?.role === 'Platform Admin';

  const activeAdapter = adapters?.adapters?.[0];

  return (
    <Card className="p-4 flex flex-row items-center justify-between">
      <div className="">
        <h4 className="text-[17px] font-bold">Asset Inventory Integration</h4>
        <p className="text-[13px]">
          Connect your asset inventory to Vulnerability Scanner to get a
          comprehensive view of your assets and their vulnerabilities.
        </p>
      </div>
      <div className="mt-7 flex gap-2 items-end">
        {adapters?.adapters?.length ? (
          <>
            <ButtonWithConfirm
              disabled={!isAdmin || isRefreshing}
              variant="primary"
              confirm={true}
              dialog="This action requires confirmation, click refresh to proceed."
              onConfirm={() => {
                if (isRefreshing) return;
                handleRefreshAdapter();
              }}
              confirmButton={
                <Button disabled={isRefreshing}>
                  Refresh
                </Button>
              }
              cancelButton={<Button variant="outline">Cancel</Button>}
            >
              <RefreshCcw /> Refresh
            </ButtonWithConfirm>
            <DeleteAimIntegration
              adapter={activeAdapter}
              isAdmin={isAdmin}
              disabled={isRefreshing}
            />
          </>
        ) : (
          <ButtonWithConfirm
            disabled={!isAdmin}
            confirm={true}
            dialog={<p>Are you sure you want to install this integration?</p>}
            confirmButton={<Button>Install</Button>}
            onConfirm={handleInstallAdapter}
          >
            <Download /> Install
          </ButtonWithConfirm>
        )}
      </div>
    </Card>
  );
}

export default AimIntegration;