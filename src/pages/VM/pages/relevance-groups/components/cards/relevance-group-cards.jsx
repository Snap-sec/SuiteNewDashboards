import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyScreen } from "@/components/common/empty-screen";
import { Profile } from "@/components/custom/profile";

export function RelevanceGroupCards({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 h-[calc(100vh-170px)] overflow-y-auto pb-4 custom-scrollbar pr-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-5 px-5 py-4 bg-card border border-border rounded-xl">
            <Skeleton className="w-14 h-[60px] rounded-lg shrink-0" />
            <Skeleton className="w-14 h-[60px] rounded-lg shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <EmptyScreen
        title="No Relevance Groups Found"
        description="Try adjusting your search query."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-170px)] overflow-y-auto pb-4 custom-scrollbar pr-2">
      {data.data.map((group) => {
        const totalVulns = group?.vulnCount
          ? Object.values(group.vulnCount).reduce((a, b) => a + (Number(b) || 0), 0)
          : 0;

        return (
          <Link
            key={group._id}
            to={`/vm/relevance-groups/${group._id}`}
            className="group block"
          >
            <div className="flex items-center gap-5 px-5 py-4 bg-card border border-border rounded-xl transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
              <div className='flex items-center gap-2'>
                <Badge
                  variant="warning"
                  appearance="outline"
                  className="flex flex-col items-center justify-center w-14 h-[60px] rounded-lg shrink-0 "
                >
                  <span className="text-[10px] font-medium  tracking-wide leading-none mb-1">
                    Vulns
                  </span>
                  <span className="text-[15px]  leading-none">
                    {totalVulns}
                  </span>
                </Badge>
                <Badge
                  variant="warning"
                  appearance="outline"
                  className="flex flex-col items-center justify-center w-14 h-[60px] rounded-lg shrink-0"
                >
                  <span className="text-[10px] font-medium tracking-wide leading-none mb-1">
                    Risk
                  </span>
                  <span className="text-[15px]  leading-none">
                    {group.exposureScoreReduction}
                  </span>
                </Badge>
              </div>

              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                  {group.name || group.title || group.campaignKey || group._id}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {group.description || group.name || group.campaignKey || group._id}
                </span>
              </div>

              {/* {group.assignee && (
                <div className="shrink-0 flex items-center justify-end min-w-32">
                  <Profile
                    email={group.assignee.email}
                    name={group.assignee.name}
                    userId={group.assignee.userId || group.assignee._id}
                    size={28}
                    showName={true}
                  />
                </div>
              )} */}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
