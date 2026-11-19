import { useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { LogOut, Plus } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import appConfig from '@/config/appConfig';
import { useListOwnedOrgsQuery } from '@/services/auth/serviceProviderApi';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import PaginationView from '@/components/custom/pagination';
import { SearchInput } from '@/components/custom/search';
import { Card } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { CardUserMini } from './components/card-user-mini';
import CreateOrgModal from './components/create-org-modal';

const ITEMS_PER_PAGE = 12;

function ServiceTypeOrgs() {
  const navigate = useNavigate();

  const { user, logout, serviceAccountOrgLogin } = useAuth();
  const isServiceProvider = user?.account_type === 'service-provider';

  const [loggingInOrgId, setLoggingInOrgId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useListOwnedOrgsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery,
  });

  const handleLogin = async (orgId) => {
    if (loggingInOrgId) return;
    setLoggingInOrgId(orgId);
    const loginPromise = serviceAccountOrgLogin(orgId);
    toast.promise(loginPromise, {
      loading: 'Logging in...',
      success: 'Logged in successfully',
      error: 'Failed to login',
    });
    try {
      await loginPromise;
      navigate('/');
    } catch (err) {
      setLoggingInOrgId(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const orgsList = data?.data || [];

  const getOrgAvatar = (website, logo) => {
    if (
      logo &&
      typeof logo === 'string' &&
      logo.trim() &&
      logo !== 'null' &&
      logo !== 'undefined'
    ) {
      return logo;
    }

    if (!website || typeof website !== 'string') return '';

    // Extract clean domain (strip protocol, www, paths, queries)
    let domain = website.trim();
    domain = domain.replace(/^https?:\/\//i, '');
    domain = domain.replace(/^www\./i, '');
    domain = domain.split('/')[0].split('?')[0].split('#')[0].trim();

    if (!domain) return '';

    // Call logo dev endpoint with domain
    return appConfig?.getLogoUrl
      ? appConfig.getLogoUrl(domain)
      : `https://img.logo.dev/${domain}?token=pk_AynlgqJFRdCbrstdHMjw4g`;
  };

  const renderItem = (item, index) => {
    const avatarUrl = getOrgAvatar(item.website, item.logo);
    
    return (
      <CardUserMini
        avatar={avatarUrl}
        name={item.name}
        email={item.website}
        url={item.website}
        key={`${item._id || index}-${avatarUrl}`}
        handleLogin={() => handleLogin(item._id)}
        // disabled={!!loggingInOrgId}
        disabled={item?.locked}
        isLoading={loggingInOrgId === item._id}
        orgDetails={item}
        isServiceProvider={isServiceProvider}
      />
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-start justify-start p-8 lg:p-12 bg-background text-foreground">
      <Helmet>
        <title>Auth | Select Organization</title>
      </Helmet>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 pb-4 border-b border-border/30">
          <div>
            <h1 className="text-2xl font-medium text-foreground">
              Welcome Back{' '}
              <Link
                to="/profile/account/user-info"
                className="text-primary cursor-pointer"
              >
                {user?.firstName} {user?.lastName}
              </Link>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Choose the organization you want to access.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isServiceProvider && (
              <CreateOrgModal
                trigger={
                  <Button variant="outline" className="gap-1.5">
                    <Plus className="size-4" /> Add New Organization
                  </Button>
                }
              />
            )}
            <ButtonWithConfirm
              variant="outline"
              confirm={true}
              onConfirm={() => logout()}
            >
              <LogOut className="size-4" /> Logout
            </ButtonWithConfirm>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full">
          <SearchInput
            placeholder="Search organizations..."
            className="w-full"
            inputClass="w-full h-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Loading Skeleton */}
        {(isLoading || isFetching) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {[1, 2, 3, 4, 5, 6].map((v) => (
              <Card key={v} className="p-4 flex flex-col justify-between h-28">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="space-y-1.5 grow">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Organizations Grid */}
        {!isLoading && !isFetching && orgsList.length > 0 && (
          <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {orgsList.map((item, index) => renderItem(item, index))}
            </div>

            {/* Pagination Component */}
            {totalPages > 1 && (
              <div className="flex justify-center w-full mt-2">
                <PaginationView
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isFetching && orgsList.length === 0 && (
          <EmptyScreen title="No Organizations Found." />
        )}
      </div>
    </div>
  );
}

export default ServiceTypeOrgs;
