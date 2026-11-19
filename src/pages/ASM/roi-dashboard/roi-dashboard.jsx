
import PageHeading from '@/components/custom/page-heading';
import Metrics from "./components/metrics";
import ReductionGraph from './components/reduction-graph';
import CurrentPostureTable from './components/table';
import { useGetAsmROIDashboardStatsQuery } from '../../../services/asm/dashboardApi';
import { useNavigate } from 'react-router-dom';
import Select from '@/components/custom/select';
import { EmptyScreen } from '@/components/common/empty-screen';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';


function RoiDashboard() {

    const { data, error, isLoading } = useGetAsmROIDashboardStatsQuery();
    const navigate = useNavigate();


    if (!isLoading && data?.data == null) {
        return (
            <>
                <Helmet><title>Xpose | Dashboard</title></Helmet>
                <EmptyScreen
                    title="No data available"
                    subTitle="There are no data to show, please create a scan to see dashboard data"
                // engage={<CreateNewScanModel />}
                />
            </>
        )
    }

    return (
        <div className="p-4">
            <Helmet><title>Xpose | Dashboard</title></Helmet>
            <div className='flex items- gap-4 mb-4 justify-between'>
                <h1 className="text-lg font-medium ">Risk Reduction Dashboard</h1>

                <div>
                    <Select
                        options={[
                            { value: '/casm', label: 'Executive Dashboard' },
                            { value: '/casm/roi-dashboard', label: 'Analytics Dashboard' },
                        ]}
                        placeholder="Select Main Dashboard."
                        onChange={(selectedOption) => {
                            if (selectedOption?.value) {
                                toast.success(`Switching to ${selectedOption.label}`);
                                navigate(selectedOption.value);
                            }
                        }}
                        enableSearch={false}
                        defaultValue={'/casm/roi-dashboard'}
                    />
                </div>
            </div>

            <div className='flex flex-col gap-6'>
                <Metrics metrics={data?.data?.metrics} isLoading={isLoading} />

                <ReductionGraph data={data?.data?.reduction_timeline} isLoading={isLoading} />

                <CurrentPostureTable data={data?.data?.attack_surface_posture} isLoading={isLoading} />
            </div>
        </div>
    )
}


export default RoiDashboard;