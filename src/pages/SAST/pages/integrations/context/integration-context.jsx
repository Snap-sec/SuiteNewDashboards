import React, { createContext, useContext, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useGetSupportedAdaptersQuery,
  useGetInstalledAdaptersQuery,
  useInstallAdapterMutation,
  useUninstallAdapterMutation,
  useGetAdapterLogsQuery,
} from '@/services/sast/adaptersApi';

export const IntegrationContext = createContext();

export const useIntegration = () => useContext(IntegrationContext);

export const IntegrationProvider = ({ children }) => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all-integrations';

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deletingId, setDeletingId] = useState(null);

  // Queries
  const {
    data: supportedRes,
    isLoading: isSupportedLoading,
    error: supportedError,
    isError: isSupportedError,
  } = useGetSupportedAdaptersQuery(undefined, {
    skip: activeTab !== 'all-integrations' && activeTab !== 'active-integrations',
  });

  const {
    data: installedRes,
    isLoading: isInstalledLoading,
    error: installedError,
    isError: isInstalledError,
  } = useGetInstalledAdaptersQuery(undefined, {
    skip: activeTab !== 'active-integrations' && activeTab !== 'all-integrations',
  });

  const {
    data: logsRes,
    isLoading: isLogsLoading,
    error: logsError,
    isError: isLogsError,
  } = useGetAdapterLogsQuery(undefined, {
    skip: activeTab !== 'logs',
  });

  // Mutations
  const [installAdapter, { isLoading: isInstalling }] = useInstallAdapterMutation();
  const [uninstallAdapter, { isLoading: isUninstalling }] = useUninstallAdapterMutation();

  // Process installed list
  const installedList = useMemo(() => {
    const raw =
      installedRes?.data?.data?.adapters ||
      installedRes?.data?.adapters ||
      installedRes?.data?.data ||
      installedRes?.data ||
      installedRes ||
      [];

    if (Array.isArray(raw)) {
      return raw.map((item) => {
        const type = (item.type || item.adapterType || item.id || '').toLowerCase();
        return {
          ...item,
          id: type || item.id || item._id,
          type,
          adapterType: type,
          title: item.title || item.name || type.toUpperCase(),
          logo: item.logo || `/new-adapter-logos/${type}.svg`,
          is_installed: true,
          status: 'Installed',
        };
      });
    }
    return [];
  }, [installedRes]);

  const installedSet = useMemo(() => {
    return new Set(installedList.map((i) => (i.type || i.adapterType || '').toLowerCase()));
  }, [installedList]);

  // Process supported list from API response
  const integrationsList = useMemo(() => {
    const rawSupported =
      supportedRes?.data?.data?.adapters ||
      supportedRes?.data?.adapters ||
      supportedRes?.data?.data ||
      supportedRes?.data ||
      supportedRes ||
      [];

    if (Array.isArray(rawSupported)) {
      return rawSupported.map((item) => {
        const type = (item.type || item.adapterType || item.id || '').toLowerCase();
        const isInstalled = item.is_installed || installedSet.has(type);
        return {
          ...item,
          id: type || item.id || item._id,
          type,
          adapterType: type,
          title: item.title || item.name || type.toUpperCase(),
          logo: item.logo || `/new-adapter-logos/${type}.svg`,
          category: item.category || ['AI'],
          is_installed: isInstalled,
        };
      });
    }
    return [];
  }, [supportedRes, installedSet]);

  const categories = useMemo(() => {
    const catSet = new Set();
    integrationsList.forEach((item) => {
      if (Array.isArray(item.category)) {
        item.category.forEach((c) => catSet.add(c));
      } else if (item.category) {
        catSet.add(item.category);
      }
    });
    return ['All', ...Array.from(catSet)];
  }, [integrationsList]);

  const categoryOptions = useMemo(
    () => categories.map((cat) => ({ label: cat, value: cat })),
    [categories],
  );

  const filteredAdapters = useMemo(() => {
    if (selectedCategory === 'All') return integrationsList;
    return integrationsList.filter((adapter) => {
      if (Array.isArray(adapter.category)) return adapter.category.includes(selectedCategory);
      return adapter.category === selectedCategory;
    });
  }, [integrationsList, selectedCategory]);

  const activeAdapters = useMemo(() => {
    return installedList;
  }, [installedList]);

  const syncLogs = useMemo(() => {
    const rawLogs =
      logsRes?.data?.data?.logs ||
      logsRes?.data?.logs ||
      logsRes?.data?.data ||
      logsRes?.data ||
      logsRes ||
      [];
    if (Array.isArray(rawLogs)) return rawLogs;
    return [];
  }, [logsRes]);

  // Handle Install (POST /v1/adapters/install/{adapterType})
  const handleInstallAdapter = async (adapterType, configPayload) => {
    const targetType = (
      typeof adapterType === 'string'
        ? adapterType
        : adapterType?.type || adapterType?.adapterType || adapterType?.id || ''
    ).toLowerCase();

    const payloadObj = typeof configPayload === 'object' && configPayload !== null
      ? configPayload
      : { apiKey: configPayload };

    try {
      await toast.promise(installAdapter({ adapterType: targetType, ...payloadObj }).unwrap(), {
        loading: `Installing ${targetType} adapter...`,
        success: `Adapter ${targetType} installed successfully!`,
        error: (err) => err?.data?.message || err?.data?.error || `Failed to install ${targetType} adapter.`,
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSaveConfig = handleInstallAdapter;
  const isConfiguring = isInstalling;

  // Handle Uninstall (DELETE /v1/adapters/{adapterType})
  const handleDisconnect = async (adapterType) => {
    const targetType = (
      typeof adapterType === 'string'
        ? adapterType
        : adapterType?.type || adapterType?.adapterType || adapterType?.id || ''
    ).toLowerCase();

    setDeletingId(targetType);
    try {
      await toast.promise(uninstallAdapter(targetType).unwrap(), {
        loading: `Uninstalling ${targetType} adapter...`,
        success: `Adapter ${targetType} uninstalled successfully.`,
        error: (err) => err?.data?.message || err?.data?.error || `Failed to uninstall ${targetType} adapter.`,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const value = {
    adaptersLoading: isSupportedLoading,
    installedLoading: isInstalledLoading,
    isLogsLoading,
    error: supportedError,
    integrationsList,
    categories,
    categoryOptions,
    selectedCategory,
    setSelectedCategory,
    filteredAdapters,
    activeAdapters,
    syncLogs,
    deletingId,
    isInstalling,
    isUninstalling,
    isConfiguring,
    handleInstallAdapter,
    handleSaveConfig,
    handleDisconnect,

    isAllIntegrationsError: isSupportedError,
    isActiveIntegrationsError: isInstalledError,
    activeIntegrationsError: installedError,
    isLogsError,
    logsError,
  };

  return <IntegrationContext.Provider value={value}>{children}</IntegrationContext.Provider>;
};
