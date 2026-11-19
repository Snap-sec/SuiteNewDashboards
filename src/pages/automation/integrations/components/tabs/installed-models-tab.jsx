import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useGetInstalledAutomationAdaptersQuery } from '@/services/automation/adaptersApi';
import { EmptyScreen } from '@/components/common/empty-screen';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { IntegrationCard } from '../integration-card';
import { useStore } from '../../store';

export default function InstalledModelsTab({
  adapterPayload = {},
  adaptersLoading = false,
}) {
  const {
    data: installedData,
    isLoading: installedLoading,
    isFetching: installedFetching,
    isError: isInstalledError,
    error: installedError,
  } = useGetInstalledAutomationAdaptersQuery();

  const searchQuery = useStore((s) => s.searchQuery);

  const activeAdapters = useMemo(() => {
    const installedPayload =
      installedData?.data?.data || installedData?.data || installedData || {};
    const installedListRaw =
      installedPayload?.adapters ||
      (Array.isArray(installedPayload) ? installedPayload : []);

    if (!installedListRaw.length || !adapterPayload?.adapters) return [];

    const installedList = installedListRaw
      ?.map((installed) => {
        const typeMatch =
          installed.adapterName || installed.adapterType || installed.type;
        const definition = adapterPayload.adapters.find(
          (d) => d.type?.toLowerCase() === typeMatch?.toLowerCase(),
        );
        if (!definition) return null;

        return {
          ...definition,
          ...installed,
          instance_id: installed.type,
          is_installed: true,
        };
      })
      .filter(Boolean);

    if (!searchQuery?.trim()) return installedList;
    const query = searchQuery.toLowerCase().trim();
    return installedList.filter(
      (adapter) =>
        adapter.title?.toLowerCase().includes(query) ||
        adapter.description?.toLowerCase().includes(query) ||
        adapter.category?.some((cat) => cat.toLowerCase().includes(query)),
    );
  }, [installedData, adapterPayload, searchQuery]);

  const isLoading = installedLoading || adaptersLoading;

  return (
    <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading ? (
        [...Array(3)].map((_, i) => (
          <IntegrationCard key={i} isLoading={true} />
        ))
      ) : isInstalledError ? (
        <div className="col-span-full">
          <ApiErrorHandler error={installedError} />
        </div>
      ) : activeAdapters?.length > 0 ? (
        activeAdapters.map((adapter) => (
          <IntegrationCard
            key={adapter.instance_id}
            adapter={adapter}
            view="active"
          />
        ))
      ) : (
        <div className="col-span-full">
          {searchQuery ? (
            <NoSearchResultsFound
              title="No active models found"
              subTitle={`We couldn't find any active models matching "${searchQuery}". Try a different search term.`}
            />
          ) : (
            <EmptyScreen
              title="No active models found"
              subTitle="You haven't installed any models yet."
            />
          )}
        </div>
      )}
    </div>
  );
}

InstalledModelsTab.propTypes = {
  adapterPayload: PropTypes.object,
  adaptersLoading: PropTypes.bool,
};
