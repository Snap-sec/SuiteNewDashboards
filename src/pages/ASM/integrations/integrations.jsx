import { Helmet } from "react-helmet";
import { useGetAsmSettingsQuery } from "@/services/asm/configApi";
import PageHeading from "@/components/custom/page-heading";
import ASMConfiguration from "./components/asm-configrations-form";
import LaunchNewScan from "./components/buttons/launch-new-scan";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PauseCircle } from "lucide-react";

function Integrations() {
  const { data: asmSettingsData } = useGetAsmSettingsQuery();
  const isScanningActive = asmSettingsData?.data?.scanning_enabled ?? true;

  return (
    <div className="w-full min-w-0 p-6 lg:p-8 flex flex-col gap-6">
      <Helmet>
        <title>Xpose | ASM Configuration & Settings</title>
      </Helmet>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <PageHeading
          title="ASM Configuration"
          description="Configure external perimeter targets, automated scan cadences, and vulnerability synchronization."
        />

        <div className="flex items-center gap-3 shrink-0">
          <Badge
            variant={isScanningActive ? "success" : "warning"}
            appearance="light"
            size="md"
            className="gap-1.5"
          >
            {isScanningActive ? (
              <>
                <CheckCircle2 className="size-3.5" />
                Scanning Active
              </>
            ) : (
              <>
                <PauseCircle className="size-3.5" />
                Scanning Paused
              </>
            )}
          </Badge>

          <LaunchNewScan size="sm" />
        </div>
      </div>

      {/* Main Form & Configuration Content */}
      <ASMConfiguration
        isDisabled={asmSettingsData?.data?.scanning_enabled === false}
      />
    </div>
  );
}

export default Integrations;
