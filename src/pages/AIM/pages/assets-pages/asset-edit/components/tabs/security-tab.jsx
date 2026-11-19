
import { SeverityGraph } from '../severity-graph';

import VulnList from '../vuln-table';
import { VulnerabilityTrendGraph } from '../vulnerability-trend-graph';

export function SecurityTab({ asset, severity_distribution, vulns, showModal, setShowModal, triggerButton }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8">
                    <VulnerabilityTrendGraph
                        asset={asset?.security?.vuln_timeline}
                    />
                </div>
                <div className="col-span-4">
                    <SeverityGraph
                        title="Severity Distribution"
                        asset={severity_distribution}
                    />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-stretch">

                {vulns?.length > 0 && (
                    <div className="col-span-12 w-full">
                        <VulnList data={vulns} />
                    </div>
                )}
            </div>
        </div>
    );
}
