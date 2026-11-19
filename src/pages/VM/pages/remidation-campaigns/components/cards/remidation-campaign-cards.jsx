import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PaginationView from '@/components/custom/pagination';
import VulnerabilitiesBadges from '@/components/custom/vulnerabilities-badges';
import { StateLabels } from '@/components/custom/state-labels';
import { Profile } from '../../../../../../components/custom/profile';
import useStore from '../../store';
import RemidationCampaignsSkeleton from '../skeletons/remidation-campaign-cards-skeleton';
import { NoSearchResultsFound } from '@/components/common/no-search-found.jsx';

export function RemidationCampaignCards({ data, isLoading }) {
  const pagination = useStore((state) => state.pagination);
  const setPage = useStore((state) => state.setPage);

  if (isLoading) {
    return <RemidationCampaignsSkeleton />;
  }

  // Handle API data wrapper vs raw array, fallback to empty array
  const apiList = data?.items;
  const campaigns = Array.isArray(apiList) && apiList.length > 0 ? apiList : [];
  const totalPages = data?.totalPages || 0;

  if (campaigns.length === 0) {
    return <NoSearchResultsFound subTitle="Nothing matched your filters or search criteria" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {campaigns.map((campaign) => {
        const progressPercent =
          campaign.vulnCount > 0
            ? Math.round(
              ((campaign.closedVulnCount || 0) / campaign.vulnCount) * 100,
            )
            : 0;

        return (
          <Link
            key={campaign._id}
            to={`/vm/remidation-campaign-details?id=${campaign._id}`}
            className="group block"
          >
            <div className="flex items-center gap-5 px-5 py-4 bg-card border border-border rounded-xl transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
              {/* Vulns Badge */}
              <div className='flex items-center gap-2'>
                <Badge
                  variant="warning"
                  appearance="outline"
                  className="flex flex-col items-center justify-center w-14 h-[60px] rounded-lg shrink-0 "
                >
                  <span className="text-[10px] font-medium  tracking-wide leading-none mb-1">
                    Vulns
                  </span>
                  <span className="text-[15px] leading-none">
                    {campaign?.openVulnCount || 0}
                  </span>
                </Badge>

                <Badge
                  variant="warning"
                  appearance="outline"
                  className="flex flex-col items-center justify-center w-14 h-[60px] rounded-lg shrink-0"
                >
                  <span className="text-[10px] font-medium  tracking-wide leading-tight mb-1 text-center whitespace-normal">
                    Risk
                  </span>
                  <span className="text-[15px] leading-none">
                    {campaign.exposureScoreReduction || 0}
                  </span>
                </Badge>
              </div>

              {/* Title + Description */}
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                    {campaign.name || campaign.campaignKey}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  {campaign.description || campaign.campaignKey}
                </span>
              </div>

              {/* Score Reduction */}
              {/* {campaign.exposureScoreReduction !== undefined && (
                <div className="flex flex-row items-end justify-center shrink-0 min-w-16">
                  <span className="text-[10px] font-medium text-muted-foreground tracking-wider leading-none mb-1">
                    Exposure Score Reduction:{" "}
                  </span>
                  <span className="text-sm font-medium ml-2">
                    {campaign.exposureScoreReduction}
                  </span>
                </div>
              )} */}

              {/* Severity Badges */}
              <div>
                <VulnerabilitiesBadges
                  vulnerabilities={{
                    low: campaign.severityCounts?.low || 0,
                    high: campaign.severityCounts?.high || 0,
                    critical: campaign.severityCounts?.critical || 0,
                    medium: campaign.severityCounts?.medium || 0,
                    info: campaign.severityCounts?.none || 0,
                  }}
                  assetName={campaign.campaignKey}
                />
              </div>

              {/* View Button */}
              {/* <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                tabIndex={-1}
              >
                View
              </Button> */}
              {campaign.status && <StateLabels state={campaign.status} />}

              {campaign?.owner && <Profile
                userId={campaign?.owner?.userId}
                name={campaign?.owner?.name}
                email={campaign?.owner?.email}
                showEmail={false}
                showName={false}
              />}
            </div>
          </Link>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
          <PaginationView
            currentPage={pagination.pageIndex + 1}
            totalPages={totalPages}
            onPageChange={setPage}
            className="justify-end mt-2"
          />
      )}
    </div>
  );
}
