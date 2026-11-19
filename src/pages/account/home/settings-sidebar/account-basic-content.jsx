import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { AccountSettingsSidebar } from '@/pages/account/home/settings-sidebar';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { useSettings } from '@/providers/settings-provider';
import {
  useChangeEmailMutation,
  useChangePasswordMutation,
  useDeactivateAccountMutation,
  useDeleteAccountMutation,
  useUpdateProfilePictureMutation,
} from '@/services/auth/authApi';
import {
  useGetOrgQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '@/services/auth/orgApi';
import { Scrollspy } from '@/components/ui/scrollspy';
import { Skeleton } from '@/components/ui/skeleton';
import { clearProfileImageCache } from '@/components/custom/profile';
import {
  AdvancedSettingsAddress,
  AdvancedSettingsAppearance,
  AdvancedSettingsNotifications,
  AdvancedSettingsPreferences,
  AuthEmail,
  AuthPassword,
  AuthSingleSingOn,
  AuthSocialSignIn,
  AuthTwoFactor,
  BasicSettings,
  DeleteAccount,
  ExternalServicesIntegrations,
  ExternalServicesManageApi,
} from './components';
import { AccountSettingsSkeleton } from './components/skeletons/account-settings-skeleton';
import { ApiErrorHandler } from '@/components/common/api-error-handler';

const stickySidebarClasses = {
  'demo1-layout': 'top-[calc(var(--header-height)+1rem)]',
  'demo2-layout': 'top-[calc(var(--header-height)+1rem)]',
  'demo3-layout': 'top-[calc(var(--header-height)+var(--navbar-height)+1rem)]',
  'demo4-layout': 'top-[3rem]',
  'demo5-layout': 'top-[calc(var(--header-height)+1.5rem)]',
  'demo6-layout': 'top-[3rem]',
  'demo7-layout': 'top-[calc(var(--header-height)+1rem)]',
  'demo8-layout': 'top-[3rem]',
  'demo9-layout': 'top-[calc(var(--header-height)+1rem)]',
  'demo10-layout': 'top-[1.5rem]',
};

export function AccountSettingsSidebarContent() {
  const { updateUserInLocalstorage } = useAuth();

  const navigate = useNavigate();

  const { data: org, isLoading: orgLoading } = useGetOrgQuery();
  const {
    data: profile,
    isLoading: profileLoading,
    isError,
    error,
  } = useGetProfileQuery();

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updateProfilePicture] = useUpdateProfilePictureMutation();
  const [changeEmail] = useChangeEmailMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [deactivateAccount] = useDeactivateAccountMutation();
  const [deleteAccount] = useDeleteAccountMutation();

  // advancedSttngName : used to show relevant toast texts
  // const handleUpdateProfile = (payload) => {
  //   toast.promise(updateProfile(payload).unwrap(), {
  //     loading: 'Updating Profile',
  //     success: 'Profile has been updated',
  //     error: 'Failed to update profile',
  //   });
  // };

  // advancedSttngName : used to show relevant toast texts
  const handleUpdateProfile = (payload, advancedSttngName = 'Profile') => {
    toast.promise(updateProfile(payload).unwrap(), {
      loading: `Updating ${advancedSttngName}`,
      success: (res) => {
        try {
          updateUserInLocalstorage(res || {});
        } catch (err) {
          console.error('Error updating user in localStorage:', err);
        }
        return `${advancedSttngName} has been updated`;
      },
      error: (err) => {
        return `Failed to update ${advancedSttngName}`;
      },
    });
  };

  const handleProfilePictureUpdate = (file) => {
    const formdata = new FormData();
    formdata.append('file', file);
    toast.promise(updateProfilePicture(formdata).unwrap(), {
      loading: 'Updating Profile picture',
      success: () => {
        clearProfileImageCache();
        return 'Profile picture updated';
      },
      error: 'Failed to update profile picture',
    });
  };

  const handleUpdatePassword = (payload, onSuccess) => {
    toast.promise(changePassword(payload).unwrap(), {
      loading: 'Updating Password',
      success: () => {
        if (onSuccess) onSuccess();
        return 'Password updated';
      },
      error: (err) => {
        console.log(err, 'LLLLLLLLLLLLLLLLLLLLLl');
        return err?.data?.message || 'Failed to update password';
      },
    });
  };

  const handleEmailUpdate = (payload) => {
    toast.promise(changeEmail(payload).unwrap(), {
      loading: 'Updating Email',
      success: 'Email Updated',
      error: 'Failed to update email',
    });
  };

  const handleDeleteAccount = () => {
    const onSuccess = (res) => {
      localStorage.clear();
      navigate('/auth/signin');
    };

    toast.promise(deleteAccount().unwrap(), {
      loading: 'Deleting the account',
      success: onSuccess,
      error: 'Failed to delete account',
    });
  };

  const handleDeactivateAccount = () => {
    const onSuccess = (res) => {
      localStorage.clear();
      navigate('/auth/signin');
    };

    toast.promise(deactivateAccount().unwrap(), {
      loading: 'Deactivate the account',
      success: onSuccess,
      error: 'Failed to deactivate account',
    });
  };

  const isMobile = useIsMobile();
  const { settings } = useSettings();
  const [sidebarSticky, setSidebarSticky] = useState(false);

  // Initialize ref for parentEl
  const parentRef = useRef(document); // Default to document
  const scrollPosition = useScrollPosition({ targetRef: parentRef });

  // Effect to update parentRef after the component mounts
  useEffect(() => {
    const scrollableElement = document.getElementById('scrollable_content');
    if (scrollableElement) {
      parentRef.current = scrollableElement;
    }
  }, []);

  // Handle scroll position and sidebar stickiness
  useEffect(() => {
    setSidebarSticky(scrollPosition > 100);
  }, [scrollPosition]);

  // Get the sticky class based on the current layout, provide a default if not found
  const stickyClass = settings?.layout
    ? stickySidebarClasses[settings?.layout] ||
      'top-[calc(var(--header-height)+1rem)]'
    : 'top-[calc(var(--header-height)+1rem)]';

  if (orgLoading || profileLoading) {
    return <AccountSettingsSkeleton />;
  }

  if (isError) return <ApiErrorHandler error={error} />;

  return (
    <div className="flex grow gap-5 lg:gap-7.5">
      <Helmet>
        <title>Auth | Profile</title>
      </Helmet>
      {!isMobile && (
        <div className="w-[230px] shrink-0">
          <div
            className={cn(
              'w-[230px]',
              sidebarSticky && `fixed z-10 start-auto ${stickyClass}`,
            )}
          >
            <Scrollspy offset={200} targetRef={parentRef}>
              <AccountSettingsSidebar />
            </Scrollspy>
          </div>
        </div>
      )}
      <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5 pb-4">
        <BasicSettings
          org={org?.data}
          profile={profile?.data}
          handleUpdate={handleUpdateProfile}
          handleProfilePictureUpdate={handleProfilePictureUpdate}
          isUpdatingProfile={isUpdatingProfile}
        />
        {/* <AuthEmail profile={profile?.data} handleUpdate={handleEmailUpdate} /> */}
        <AuthPassword
          handleUpdate={handleUpdatePassword}
          isChangingPassword={isChangingPassword}
        />
        {/* <AuthSocialSignIn /> */}
        {/* <AuthSingleSingOn /> */}
        <AuthTwoFactor
          profile={profile?.data}
          handleUpdate={handleUpdateProfile}
        />
        {/* <AdvancedSettingsPreferences
          profile={profile?.data}
          handleUpdate={handleUpdateProfile}
        /> */}
        <AdvancedSettingsAppearance title={''} />
        {/* <AdvancedSettingsNotifications
          profile={profile?.data}
          handleUpdate={handleUpdateProfile}
        /> */}
        {/* <AdvancedSettingsAddress
          profile={profile?.data}
          handleUpdate={handleUpdateProfile}
        /> */}
        {/* <ExternalServicesManageApi title={''} switch={false} /> */}
        {/* <ExternalServicesIntegrations /> */}
        {/* <DeleteAccount
          profile={profile?.data}
          handleDelete={handleDeleteAccount}
          handleDeactivate={handleDeactivateAccount}
        /> */}
      </div>
    </div>
  );
}
