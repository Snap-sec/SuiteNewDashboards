import { Helmet } from 'react-helmet';
import { useParams } from 'react-router';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '@/components/common/api-error-handler';
import ScanDetailsTabs from './tabs/tabs';
import { useGetScanDetailsQuery } from '../../../../services/vs/scansApi';

function ScanDetails() {
    const { id } = useParams();
    const { data: scanDetails, isLoading, error, isError } = useGetScanDetailsQuery(id);

    if (isError) {
        return <ApiErrorHandler error={error} />;
    }

    return (
        <div className="p-4">
            <Helmet>
                <title>VS | Scan Details</title>
            </Helmet>
            <PageHeading
                title="Scan Details"
                description="View scan results and vulnerability insights"
            />
            <div className="mt-4">
                <ScanDetailsTabs
                    data={scanDetails}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </div>
    );
}

export default ScanDetails;