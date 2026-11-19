import { useState } from 'react';
import { DropdownMenu5 } from '@/partials/dropdown-menu/dropdown-menu-5';
import { Check, EllipsisVertical, Plus, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Profile } from '@/components/custom/profile';
import { CustomTooltip } from '@/components/custom/tooltip';

const Members = ({ title, members, onClap }) => {
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
        {!isCurrentUser && (
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
        )}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="gap-2">
        <CardTitle className="card-title">{title}</CardTitle>
      </CardHeader>
      <CardContent className="card-body kt-scrollable-y">
        <div className="flex flex-col gap-2 lg:gap-5">
          {sortedMembers.map((item, index) => renderItem(item, index))}
          <div className='w-full h-full flex items-center justify-center'>
            {!sortedMembers?.length && (
              <p className="text-[13px]">No Tickets have been resolved yet!</p>
            )}
          </div>
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
