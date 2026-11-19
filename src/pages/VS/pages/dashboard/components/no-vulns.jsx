import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Starter } from '@/partials/custom/starter';
import { FilePlus } from 'lucide-react';

function NoVulns() {

    return (
        <div className="w-full h-full p-4">
            <Starter
                image={
                    <>
                        <img
                            src={toAbsoluteUrl("/media/illustrations/32.svg")}
                            className="dark:hidden max-h-[230px]"
                        />

                        <img
                            src={toAbsoluteUrl("/media/illustrations/32-dark.svg")}
                            className="light:hidden max-h-[230px]"
                        />
                    </>
                }
                title="No Vulnerabilities Found"
                subTitle="When new vulnerabilities are report, they will show here."
            />
        </div>
    )
}


export default NoVulns;