import { Helmet } from "react-helmet";
import { useGetAsmSettingsQuery } from "@/services/asm/configApi";
import PageHeading from '@/components/custom/page-heading';
import ASMConfiguration from "./components/asm-configrations-form";
import LaunchNewScan from './components/buttons/launch-new-scan';

function Integrations() {
    const { data: asmSettingsData } = useGetAsmSettingsQuery();

    return (
      <div className="p-4">
        <Helmet>
          <title>Xpose | Settings</title>
        </Helmet>

        <div className="flex justify-between items-center ">
          <PageHeading
            title="ASM Configuration"
            description="Configure scanning, targets, schedules, integrations, and synchronization settings."
          />
          <LaunchNewScan />
        </div>

        <ASMConfiguration
          isDisabled={asmSettingsData?.data?.scanning_enabled === false}
        />

        {/* <AssessmentConfig /> */}
      </div>
    );
}

export default Integrations;