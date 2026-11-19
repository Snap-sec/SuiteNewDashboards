import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetApisecScanProfileQuery } from '@/services/apisec/scan-profile';

const ScanProfileSection = forwardRef(function ScanProfileSection(
  { data, isLoading },
  ref,
) {
  const { data: scanProfiles, isLoading: isLoadingProfiles } = useGetApisecScanProfileQuery();
  const [selectedProfile, setSelectedProfile] = useState('');

  useImperativeHandle(ref, () => ({
    getData: () => ({
      auth_profile_id: selectedProfile,
    }),
  }));

  useEffect(() => {
    if (data?.data?.scanSettings?.auth_profile_id) {
        setSelectedProfile(data.data.scanSettings.auth_profile_id);
    }
  }, [data]);

  if (isLoading || isLoadingProfiles) {
    return (
        <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Select Scan Profile</p>
            <Select
                value={selectedProfile}
                onValueChange={setSelectedProfile}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a scan profile" />
                </SelectTrigger>
                <SelectContent>
                    {scanProfiles?.data?.map((profile) => (
                        <SelectItem key={profile._id} value={profile._id}>
                            {profile.name}
                        </SelectItem>
                    ))}
                    {!scanProfiles?.data?.length && (
                         <div className="p-2 text-sm text-muted-foreground text-center">No profiles found</div>
                    )}
                </SelectContent>
            </Select>
             <p className="text-[13px] text-muted-foreground">
                Select a scan profile to use for this scan.
            </p>
        </div>
    </div>
  );
});

export default ScanProfileSection;
