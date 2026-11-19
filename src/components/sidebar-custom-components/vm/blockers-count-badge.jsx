import React from 'react';
import { useGetAllVmBlockersQuery } from '@/services/vm/blockersApi';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '../../ui/skeleton';

function BlockersCountBadge() {
  const {
    data: blockers,
    isLoading: isBlockersLoading,
    isFetching: isBlockersFetching,
    isError: isBlockersError,
  } = useGetAllVmBlockersQuery({status: "pending"});

  return isBlockersLoading ? (
    <div className=" w-full">
      <Skeleton className={'h-5 w-10 rounded-full'} />
    </div>
  ) : (
    <div className=' w-full'>
    {blockers?.total > 0 && <Badge variant="destructive" size="sm" shape="circle">
      {blockers?.total}
    </Badge>}
    </div>
  );
}

export default BlockersCountBadge;
