import React from 'react';
import { Minus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import {
  authApi,
  useGetProfilePictureQuery,
  useRemoveProfilePicMutation,
} from '@/services/auth/authApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { clearProfileImageCache } from '@/components/custom/profile';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';

export function RemoveProfilePic({ profile }) {
  const dispatch = useDispatch();
  const { data: profilePicData } = useGetProfilePictureQuery(
    { email: profile?.email },
    { skip: !profile?.email },
  );

  const [removeProfilePic, { isLoading }] = useRemoveProfilePicMutation();

  const hasProfilePicture =
    profilePicData && profilePicData instanceof Blob && profilePicData.size > 0;

  if (!hasProfilePicture) return null;

  const handleRemoveProfile = () => {
    toast.promise(removeProfilePic().unwrap(), {
      loading: 'Removing profile picture...',
      success: () => {
        clearProfileImageCache(profile?.email);
        dispatch(
          authApi.util.updateQueryData(
            'getProfilePicture',
            { email: profile?.email },
            () => {
              return undefined;
            },
          ),
        );
        setTimeout(() => {
          window.location.href = '/profile/account/user-info#basic_settings';
          window.location.reload();
        }, 1000);
        return 'Profile picture removed successfully!';
      },
      error: 'Failed to remove profile picture',
    });
  };

  return (
    <div className="absolute -top-1 -end-1 z-10">
      <CustomTooltip text="Remove Profile">
        <ButtonWithConfirm
          type="button"
          confirm={true}
          variant="outline"
          confirmVariant="destructive"
          dialog="Are you sure you want to remove your profile picture?"
          onConfirm={handleRemoveProfile}
          disabled={isLoading}
          className="size-5 rounded-full p-0 flex items-center justify-center bg-background border shadow-xs hover:bg-muted text-secondary-foreground/80 hover:text-destructive transition-all"
          cancelButton={
            <Button type="button" variant="outline">
              Cancel
            </Button>
          }
          confirmButton={
            <Button type="button" variant="destructive">
              Remove
            </Button>
          }
        >
          <Minus className="size-3 text-red-500" />
        </ButtonWithConfirm>
      </CustomTooltip>
    </div>
  );
}
