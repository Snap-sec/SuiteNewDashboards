import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardTab } from './dashboard-tab';
import { VulnerabilitiesTab } from './vulnerabilities-tab';

function ScanDetailsTabs({ data, isLoading, error }) {
    const { id: scanId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const tabFromUrl = searchParams.get('tab') || 'Dashboard';
    const [activeTab, setActiveTab] = useState(tabFromUrl);

    useEffect(() => {
        if (tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('tab', tab);
            return next;
        });
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList variant="line" size="md" className="border-b">
                <TabsTrigger value="Dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="Vulnerabilities">Vulnerabilities</TabsTrigger>
            </TabsList>

            <TabsContent value="Dashboard">
                <div>
                    <DashboardTab data={data} loading={isLoading} error={error} />
                </div>
            </TabsContent>

            <TabsContent value="Vulnerabilities">
                <div>
                    <VulnerabilitiesTab scanId={scanId} status={data?.summary_metrics?.scan_status} />
                </div>
            </TabsContent>
        </Tabs>
    );
}

export default ScanDetailsTabs;
