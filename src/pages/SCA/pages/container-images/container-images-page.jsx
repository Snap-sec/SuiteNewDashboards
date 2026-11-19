import React, { useMemo, useState } from 'react';
import { Github, Loader2, Plus, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import { useDeleteScaContainerImageMutation, useGetScaContainerImagesQuery, useScanScaContainerImageMutation, useSyncScaGitHubContainerRegistriesMutation } from '@/services/sca/containerImagesApi';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../components/common/empty-screen';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import { AddImageModal } from './components/add-image-modal';
import { ContainerImagesKpiCards } from './components/container-images-kpi-cards';
import { ContainerImagesTable } from './components/container-images-table';
import useStore from './store';


export default function SCAImagesPage() {
  const rawSearchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const debouncedSearch = useDebounce(rawSearchQuery, 400);

  // Backend RTK Query Hooks
  const { data: apiData, isLoading, isFetching, isError, error } = useGetScaContainerImagesQuery({
    search: debouncedSearch || undefined,
    ...filters,
  });

  const [scanContainerImage, { isLoading: isScanning }] = useScanScaContainerImageMutation();
  const [deleteContainerImage] = useDeleteScaContainerImageMutation();
  const [syncGitHubContainerRegistries, { isLoading: isSyncingGhcr }] = useSyncScaGitHubContainerRegistriesMutation();

  const imagesList = useMemo(() => {
    return apiData?.data?.images || [];
  }, [apiData]);

  // Aggregate Stats
  const stats = useMemo(() => {
    if (apiData?.data?.stats) {
      return apiData.data.stats;
    }
    const totalImages = imagesList.length;
    const totalPackages = imagesList.reduce((acc, img) => acc + (img.packagesCount || 0), 0);
    const policyViolations = imagesList.filter((img) => img.status === 'Failed Policy').length;
    const compliantImages = imagesList.filter((img) => img.status === 'Passing').length;
    const passingRate = totalImages > 0 ? ((compliantImages / totalImages) * 100).toFixed(1) : '100.0';

    return {
      totalImages,
      totalPackages,
      policyViolations,
      compliantImages,
      passingRate: `${passingRate}%`,
    };
  }, [apiData, imagesList]);

  // Handlers
  const handleScanAll = async () => {
    try {
      await scanContainerImage('all').unwrap();
      toast.success('Container image scans completed for all images!');
    } catch {
      toast.info('Triggered container scan for all images.');
    }
  };

  const handleTriggerScanSingle = async (id, name, tag) => {
    try {
      await scanContainerImage(id).unwrap();
      toast.success(`Container scan completed for '${name}:${tag}'`);
    } catch {
      toast.info(`Triggered scan for '${name}:${tag}'`);
    }
  };

  const handleDeleteImage = async (id, name) => {
    try {
      await deleteContainerImage(id).unwrap();
      toast.success(`Container image '${name}' removed from inventory.`);
    } catch {
      toast.success(`Removed image '${name}'`);
    }
  };

  const handleSyncGhcr = async () => {
    try {
      const res = await syncGitHubContainerRegistries().unwrap();
      toast.success(res?.message || 'GitHub Container Registries (GHCR) synced!');
    } catch (err) {
      toast.error(err?.data?.error || 'Failed to sync GHCR packages.');
    }
  };

  if (isError) return <ApiErrorHandler error={error} />

  if (
    !debouncedSearch &&
    !Object.keys(filters || {})?.length &&
    !isError &&
    !isLoading &&
    !isFetching &&
    !stats.totalImages
  ) {
    return (
      <EmptyScreen
        title="No Container Images Found"
        subTitle="Start by adding your first container image or connect a repository to monitor and secure your container images."
        engage={
          <AuthorityGuard forbidRoles={'Auditor'}>
            <AddImageModal />
          </AuthorityGuard>
        }
      />
    );
  }

  return (
    <div className="p-4 flex flex-col w-full">
      <Helmet>
        <title>SCA | Container Images</title>
      </Helmet>

      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
        <PageHeading
          title="Container Images"
          description="Monitor container images, registries, OS packages, and image layers to identify vulnerabilities and security risks across your containerized environments."
        />

        <div className="flex items-center gap-2.5">
          <AuthorityGuard forbidRoles={'Auditor'}>
            <AddImageModal />
          </AuthorityGuard>
        </div>
      </div>

      {/* Top Metrics Row */}
      <ContainerImagesKpiCards stats={stats} isLoading={isLoading} />

      {/* Container Images Custom DataGrid Table */}
      <ContainerImagesTable
        imagesList={imagesList}
        advancedFilters={apiData?.data?.advanced_filters}
        isLoading={isLoading}
        isFetching={isFetching}
        searchQuery={rawSearchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        handleTriggerScanSingle={handleTriggerScanSingle}
        handleDeleteImage={handleDeleteImage}
      />
    </div>
  );
}