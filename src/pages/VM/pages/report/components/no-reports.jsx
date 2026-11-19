import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Starter } from '@/partials/custom/starter';
import { FilePlus } from 'lucide-react';
import GenerateReportModel from './modals/generate-report.modal';

function NoReports() {

    return (
        <div className="w-full h-full p-4">
            <Starter
                image={
                    <>
                        <img
                            src={toAbsoluteUrl("/media/illustrations/22.svg")}
                            className="dark:hidden max-h-[230px]"
                        />

                        <img
                            src={toAbsoluteUrl("/media/illustrations/22-dark.svg")}
                            className="light:hidden max-h-[230px]"
                        />
                    </>
                }
                title="No Reports Found"
                subTitle="To get started, generate a new report on an assessment"
                engage={<GenerateReportModel />}
            />
        </div>
    )
}


export default NoReports;