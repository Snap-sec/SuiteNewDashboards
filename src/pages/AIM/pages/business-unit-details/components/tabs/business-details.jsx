import { useAuth } from '@/auth/context/auth-context';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Profile } from '@/components/custom/profile';
import EditBusinessUnitModal from '../../../business-units/components/modals/edit-business-unit-modal';
import { Statistics } from './../../components';
import DeleteBusinessUnit from './../actions/delete-business-unit';
import Chart2 from './../charts/chart2';
import Chart3 from './../charts/chart3';
import VulnTimeline from './../charts/vuln-timeline-chart';

function BusinessDetailsTab({ businessUnitStats, isLoading }) {
    const { id } = useParams();
    const { user } = useAuth();
    // Safely access user ID
    const loggedInUserId = user?._id || user?.id || user?.userId;

    const owner = businessUnitStats?.business_unit?.owner;
    // Check multiple possible ID fields to be safe, consistent with observed patterns
    const isOwner =
        owner &&
        loggedInUserId &&
        (owner.id === loggedInUserId ||
            owner._id === loggedInUserId ||
            owner.userId === loggedInUserId);


    return (
        <div className="p-4">
            {isLoading ? (
                <div className="flex flex-col items-center gap-2.5 lg:gap-3.5 py-4 lg:pt-5 lg:pb-10 animate-pulse">
                    <Skeleton className="size-20 rounded-full" />
                    <Skeleton className="h-5 w-48 rounded" />
                    <Skeleton className="h-4 w-96 rounded" />
                    <div className="flex items-center gap-2 mt-1">
                        <Skeleton className="size-6 rounded-full" />
                        <Skeleton className="h-3.5 w-32 rounded" />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2 lg:gap-3.5 py-4 lg:pt-5 lg:pb-10">
                    <div>
                        <Avatar className="size-20">
                            <AvatarImage
                                src={businessUnitStats?.business_unit?.logo}
                                alt="@reui"
                            />
                            <AvatarFallback>CH</AvatarFallback>
                        </Avatar>
                    </div>
                    <p className="text-lg leading-5 font-semibold text-mono">
                        {businessUnitStats?.business_unit?.name}
                    </p>
                    <p>{businessUnitStats?.business_unit?.description}</p>
                    <Profile
                        role={businessUnitStats?.business_unit?.owner?.role || ' '}
                        email={
                            businessUnitStats?.business_unit?.owner?.email ||
                            ' '
                        }
                        size={24}
                    />
                </div>
            )}

            <div className=" flex justify-between mt-1 mb-2 items-center mr-8 gap-2">
                <div className=" flex  w-full gap-2 justify-end">
                    {isOwner && (
                        <>
                            <EditBusinessUnitModal
                                id={businessUnitStats?.business_unit?._id}
                                avatar={businessUnitStats?.business_unit?.logo}
                                name={businessUnitStats?.business_unit?.name}
                                info={businessUnitStats?.business_unit?.description}
                                owner={businessUnitStats?.business_unit?.owner}
                            />

                            <DeleteBusinessUnit id={id} />
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
                <div className="col-span-1 lg:col-span-3">
                    <Statistics businessUnitStats={businessUnitStats?.metrics} isLoading={isLoading} />
                </div>

                <div className="col-span-1 lg:col-span-3">
                    <div>
                        <VulnTimeline data={businessUnitStats?.asset_trend} isLoading={isLoading} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 sm:mt-3 md:mt-4 lg:mt-6 gap-5 lg:gap-7.5">
                        <div>
                            {/* Severity distributions chart */}
                            <Chart3 data={businessUnitStats?.severity_distribution} isLoading={isLoading} />
                        </div>
                        <div>
                            {/* vulnBySeverity chart */}
                            <Chart2 data={businessUnitStats?.asset_distribution_by_type} isLoading={isLoading} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BusinessDetailsTab;
