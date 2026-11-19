import React, { Fragment, useCallback, useState } from 'react';
import { CheckCheck, RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';
// import { ActivitiesFollowersMilestone } from './components/milestone';
// import { ActivitiesProductWebinar } from './components/product-webinar';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SearchInput } from '@/components/custom/search';
import AuthorityGuard from '../../components/custom/authority-guard/AuthorityGuard';
import FilterButton from '../../components/custom/filter-toolbar/filter-button';
import PageHeading from '../../components/custom/page-heading';
import { debounce } from '../../lib/helpers';
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsSeenMutation,
} from '../../services/notify/activityApi';
import { ActivitiesFollowersMilestone } from './components/milestone';
import { ActivitiesProductWebinar } from './components/product-webinar';
import PaginationView from '@/components/custom/pagination';

const Notifications = () => {
  const origins = [
    { label: 'All', value: 'all' },
    { label: 'VM', value: 'vm' },
    { label: 'AIM', value: 'aim' },
    { label: 'ASM', value: 'asm' },
    { label: 'Strike', value: 'strike' },
  ];
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState('all');
  const [search, setSearch] = useState('');
  const [emailFilterValues, setEmailFilterValues] = useState([]);

  
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: 20 }));
  }, [currentOrigin]);

  const { data: activities, error, isLoading, isFetching } = useGetNotificationsQuery({ page: pagination.pageIndex + 1, limit: pagination.pageSize, origin: currentOrigin, search,
    email: emailFilterValues.join(','), });

  const [markAllNotificationsAsSeen, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsAsSeenMutation();

  const handleEmailFilterChange = (checked, value) => {
    if (checked || value?.length > 0) {
      setEmailFilterValues(value);
    } else {
      setEmailFilterValues([]);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 500),
    [],
  );

  // Email filter
  const emailFilter =
    activities?.filters?.users?.map((email) => ({
      id: email,
      label: email,
      value: email,
    })) || [];

  return (
    <div className="p-4">
      <PageHeading
        title="Activities"
        description="Central Hub for Notifications"
      />

      <div className="flex gap-5 lg:gap-7.5">
        <Card className="grow" id={`activity_${currentOrigin}`}>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <div className="flex items-center space-x-2.5">
              <SearchInput
                placeholder="Search here..."
                onChange={(e) => debouncedSearch(e.target.value)}
                isSearching={isFetching}
              />

              <FilterButton
                title="Emails"
                defaultValue={emailFilterValues}
                filters={emailFilter}
                onChange={handleEmailFilterChange}
              />
              <Button
                variant="outline"
                onClick={() => setEmailFilterValues([])}
              >
                <RefreshCcw />
                Reset
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  toast.promise(
                    markAllNotificationsAsSeen({
                      origin: currentOrigin,
                    }).unwrap(),
                    {
                      loading: 'Marking all as read...',
                      success: 'All notifications marked as read!',
                      error: 'Failed to mark all as read',
                    },
                  )
                }
                disabled={isMarkingAll}
              >
                <CheckCheck />
                Mark all as read
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div>Loading...</div>
            ) : !activities?.notifications?.length ? (
              <div className="text-center text-muted-foreground py-8 flex flex-col justify-center">
                <img src='/media/illustrations/3-dark.svg' className='light:hidden max-h-[160px]'/>
                <img src='/media/illustrations/3.svg' className='dark:hidden max-h-[160px]'/>
                <p className='text-base font-medium text-mono text-center'>
                          Nothing to see here yet!
                        </p>
                        <p>
                          Check back later or explore some features to see updates.
                </p>
                <p>Check back later or explore some features to see updates.</p>
              </div>
            ) : (
              activities.notifications.map((notification) => (
                <ActivitiesFollowersMilestone
                  data={notification}
                  key={notification.id || Math.random()}
                />
              ))
            )}
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-end">
              <PaginationView
                currentPage={pagination.pageIndex + 1}
                totalPages={Math.ceil((activities?.total || 0) / pagination.pageSize)}
                className="flex justify-end"
                onPageChange={(newPage) => {
                  setPagination((prev) => ({ ...prev, pageIndex: newPage - 1 }));
                }}
              />
            </div>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-2.5 px-4">
          {origins.map((origin) => (
            <AuthorityGuard roles={['Admin']} key={origin.value}>
              <Button
                key={origin.value}
                variant={origin.value === currentOrigin ? 'primary' : 'dim'}
                appearance="ghost"
                size="sm"
                className="justify-start gap-1"
                onClick={() => setCurrentOrigin(origin.value)}
              >
                {origin.label}
              </Button>
            </AuthorityGuard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
