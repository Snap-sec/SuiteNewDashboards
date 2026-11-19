import { IpInfoDetails } from '../ip-info-details';

export function LocationTab({ asset }) {
    return (
        <div className="flex flex-col gap-4">
            <IpInfoDetails
                title="Location Details"
                data={asset?.ip || asset?.ips?.[0]?.ip || asset?.workstation?.location}
                className={`w-full`}
            />
        </div>
    );
}
