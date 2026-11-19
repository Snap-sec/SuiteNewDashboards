import { useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useListOrgsQuery } from '@/services/auth/authApi';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { SearchInput } from '@/components/custom/search';
import PaginationView from '@/components/custom/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { CardUserMini } from '@/pages/service-account/components/card-user-mini';
import { Card } from '@/components/ui/card';
import { Helmet } from 'react-helmet';

const ITEMS_PER_PAGE = 12;

export default function SelectOrgPage() {
  const navigate = useNavigate();
  const { user, logout, loginIntoOrg } = useAuth();
  const [loggingInOrgId, setLoggingInOrgId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useListOrgsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery,
  });

  const handleLogin = async (orgId) => {
    if (loggingInOrgId) return;
    setLoggingInOrgId(orgId);
    const loginPromise = loginIntoOrg(orgId);
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

  const handleLogout = () => {
    logout();
    navigate('/auth/signin', { replace: true });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const rawOrgsList = data?.data?.orgs || data?.data || [];
  const filteredOrgs = rawOrgsList.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.orgName?.toLowerCase().includes(q) ||
      item.name?.toLowerCase().includes(q) ||
      item.role?.toLowerCase().includes(q)
    );
  });

  const totalCount = data?.total || data?.data?.total || filteredOrgs.length;
  const totalPages = Math.ceil(
    (data?.total || data?.data?.total ? totalCount : filteredOrgs.length) / ITEMS_PER_PAGE
  );

  const displayOrgs = data?.total || data?.data?.total
    ? filteredOrgs
    : filteredOrgs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const renderItem = (item, index) => (
    <CardUserMini
      avatar={item.orgLogo}
      name={item.orgName || item.name}
      email={item.role}
      url={item.orgLogo}
      key={item.orgId || item._id || index}
      handleLogin={() => handleLogin(item.orgId || item._id)}
      disabled={!!loggingInOrgId}
      isLoading={loggingInOrgId === (item.orgId || item._id)}
      action={null}
    />
  );

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
              Welcome Back {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Choose the organization you want to access.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ButtonWithConfirm
              variant="outline"
              confirm={true}
              onConfirm={handleLogout}
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
        {!isLoading && !isFetching && displayOrgs.length > 0 && (
          <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {displayOrgs.map((item, index) => renderItem(item, index))}
            </div>

            {/* Pagination */}
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
        {!isLoading && !isFetching && displayOrgs.length === 0 && (
          <EmptyScreen title="No Organizations Found." />
        )}
      </div>
    </div>
  );
}
