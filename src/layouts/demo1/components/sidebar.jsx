import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { SidebarHeader } from './sidebar-header';
import { SidebarMenu } from './sidebar-menu';
import Select from '@/components/custom/select';
import ServiceGuard from '@/components/custom/authority-guard/ServiceGuard';
import { Button } from '@/components/ui/button';
import { PlusIcon, Building2 } from 'lucide-react';
import SidebarCreateOrgModal from '../../../pages/service-account/components/create-org-modal';
import { useListOwnedOrgsQuery } from '@/services/auth/serviceProviderApi';
import { useListOrgsQuery } from '@/services/auth/authApi';
import { useAuth } from '@/auth/context/auth-context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';


export function Sidebar({ origin }) {
  const navigate = useNavigate();
  const { user, serviceAccountOrgLogin, loginIntoOrg, switchOrg, resetApi } = useAuth();
  const { settings } = useSettings();
  const { pathname } = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const isServiceProvider = user?.account_type === 'service-provider';
  const { data: ownedOrgs, isLoading: isOwnedLoading, isFetching: isOwnedFetching } = useListOwnedOrgsQuery({ limit: 999 }, { skip: !isServiceProvider });
  const { data: memberOrgs, isLoading: isMemberLoading, isFetching: isMemberFetching } = useListOrgsQuery({
    skip: isServiceProvider || (
      !user?.requiresOrgSelection &&
      !(user?.membershipsCount > 1) &&
      user?.multiTenant !== true &&
      user?.loginMetadata?.multiTenant !== true
    )
  });

  const orgsData = isServiceProvider ? ownedOrgs?.data : memberOrgs?.data?.orgs;
  const isLoading = isServiceProvider ? isOwnedLoading : isMemberLoading;
  const isFetching = isServiceProvider ? isOwnedFetching : isMemberFetching;
  const isOrgLoading = isLoading || isFetching;

  const handleOrgChange = (orgId) => {
    // Use serviceAccountOrgLogin for service providers, and switchOrg for regular users
    const loginMethod = isServiceProvider ? serviceAccountOrgLogin : switchOrg;

    toast.promise(loginMethod(orgId), {
      loading: 'Switching organization...',
      success: () => {
        resetApi();
        return 'Organization switched successfully';
      },
      error: 'Failed to switch organization',
    });
  };

  return (
    <div
      className={cn(
        'sidebar bg-background lg:border-e lg:border-border lg:fixed lg:top-0 lg:bottom-0 lg:z-20 lg:flex flex-col items-stretch shrink-0',
        (settings.layouts.demo1.sidebarTheme === 'dark' ||
          pathname.includes('dark-sidebar')) &&
        'dark',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarHeader />


      <div className="overflow-hidden">
        <div className="w-(--sidebar-default-width)">
          <SidebarMenu origin={origin} />
        </div>
      </div>


      {(!settings.layouts.demo1.sidebarCollapse || isHovered) && (
        isServiceProvider ||
        user?.requiresOrgSelection ||
        user?.membershipsCount > 1 ||
        user?.multiTenant === true ||
        user?.loginMetadata?.multiTenant === true
      ) && (
          <div className='overflow-hidden'>
            <div className="px-3 mb-2 mt-2 flex items-center gap-2">
              <div className='w-[70%]'>
                <Select
                  placeholder="Select Organization"
                  options={orgsData?.map((o) => ({
                    label: isServiceProvider ? (o?.name || o?.website) : o?.orgName,
                    value: isServiceProvider ? o?._id : o?.orgId
                  }))}
                  value={user?.orgId}
                  onChange={(v) => handleOrgChange(v.value)}
                  isLoading={isOrgLoading}
                  isSearching={isOrgLoading}
                />
              </div>

              <ServiceGuard showAccessDenied={false}>
                <div className='w-[15%]'>
                  <SidebarCreateOrgModal
                    trigger={
                      <Button variant="outline" title="Create Organization">
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    }
                  />
                </div>

                <div className='w-[15%]'>
                  <Button
                    variant="outline"
                    title="Goto Organizations"
                    onClick={() => navigate('/service-provider/orgs')}
                  >
                    <Building2 className="w-4 h-4" />
                  </Button>
                </div>
              </ServiceGuard>
            </div>
          </div>
        )}



    </div>
  );
}
