import { useState } from 'react';
import { DropdownMenu5 } from '@/partials/dropdown-menu/dropdown-menu-5';
import { Check, CircleAlert, EllipsisVertical, Plus, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Profile } from '@/components/custom/profile';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';
import { Badge } from '../../../../../../components/ui/badge';

const Members = ({ title, members, onClap, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="gap-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="card-body kt-scrollable-y">
          <div className="flex flex-col h-full gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="size-8 rounded-full shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get current user email from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserEmail = currentUser.email;

  // Sort all (including current user) by closedVulns
  const sortedMembers = [...members].sort((a, b) => b.closedVulns - a.closedVulns);

  function handleClap(email, name) {
    toast.promise(onClap({ email, name }).unwrap(), {
      loading: 'Sending clap to user',
      success: (data) => data?.message || 'Clap sent',
      error: (error) => error?.data?.message || 'Failed to send the clap',
    });
  }

  const renderItem = (item, index) => {
    const isCurrentUser = item.email === currentUserEmail;
    return (
      <div key={index} className="flex items-center gap-2">
        <div className="flex items-center grow gap-2.5">
          <Profile
            name={item.name || "Unknown"}
            role={`Resolved ${item.closedVulns} issues`}
            email={item.email}
          />
        </div>
        <CustomTooltip text={"Points"}>
          <div className="inline-flex items-center gap-1.5">
            {/* <span className="w-2 h-2 rounded-full bg-[#3B82F6]" /> */}
            <span className="text-sm font-medium">
              {item?.points} Points
            </span>
          </div>
        </CustomTooltip>
        {/* {!isCurrentUser && (
          <CustomTooltip text="Clap for him">
            <Button
              className={`rounded-full ${
                item.connected
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-50 border border-blue-300 text-blue-600 hover:text-white hover:bg-blue-500 dark:border-blue-950 dark:bg-blue-950/30'
              }`}
              size="sm"
              mode="icon"
              variant={item.connected ? 'primary' : 'outline'}
              onClick={() => handleClap(item.email, item.name)}
            >
              {item.connected ? <Check size={18} /> : <ThumbsUp size={18} />}
            </Button>
          </CustomTooltip>
        )} */}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="gap-2">
        <CardTitle className="card-title font-normal text-sm text-gray-500 flex items-center gap-2">
          {title}
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="About this Panel"
            popoverContent={
              <p className="text-muted-foreground">
                This panel shows the top performing team members based on the number of issues they resolved and the points they earned. It highlights individual contributions and overall performance.
              </p>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="card-body kt-scrollable-y">
        <div className="flex flex-col h-full gap-2 lg:gap-5">
          {sortedMembers?.length > 0 ? (
            sortedMembers.map((item, index) => renderItem(item, index))
          ) : (
            <p className="flex items-center justify-center h-full text-muted-foreground text-sm">No Tickets have been resolved yet!</p>
          )}
        </div>
      </CardContent>
      {/* Uncomment if needed
      <CardFooter className="justify-center">
        <Button mode="link" underlined="dashed" asChild>
          <Link to="/public-profile/network">All Contributors</Link>
        </Button>
      </CardFooter>
      */}
    </Card>
  );
};

export default Members;
