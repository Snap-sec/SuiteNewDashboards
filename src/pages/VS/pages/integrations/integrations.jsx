import AssessmentConfig from "./components/assessment-config"
import AimIntegration from "./components/aim-integration"
import { Helmet } from "react-helmet"
import PageHeading from "../../../../components/custom/page-heading"

function Integrations() {

    return (
        <div className="py-2 px-4 flex gap-1 flex-col">
            <Helmet><title>VS | Integrations</title></Helmet>

            <PageHeading
             title="Settings" 
             description="Manage configurations and integrations for VS, including AIM integration and assessment settings."
             />

            <AimIntegration />

            <div className="mt-4">
            <AssessmentConfig />
            </div>
        </div>
    )
}

export default Integrations