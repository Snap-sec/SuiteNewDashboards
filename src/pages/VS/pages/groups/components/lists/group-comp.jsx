import GroupInfoCard, { GroupInfoCardSkeleton } from '../cards/group-info-card';

const GroupComponent = ({ groupData, isLoading, isError }) => {
  // Skeleton loader
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5 mt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <GroupInfoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5 mt-4">
        {groupData?.groups?.map((group) => (
          <GroupInfoCard key={group._id} item={group} dropdown={true} />
        ))}
      </div>
    </>
  );
};

export default GroupComponent;
