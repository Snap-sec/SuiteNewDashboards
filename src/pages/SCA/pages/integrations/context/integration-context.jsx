import React, { createContext, useContext, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useGetScaIntegrationsQuery,
  useGetActiveScaIntegrationsQuery,
  useLazyGetScaIntegrationByIdQuery,
  useConfigureScaIntegrationMutation,
  useDisconnectScaIntegrationMutation,
  useTriggerScaSyncMutation,
  useGetScaSyncLogsQuery,
} from '@/services/sca/integrationsApi';
import {
  useGetScaWebhooksQuery,
  useRotateScaWebhookMutation,
} from '@/services/sca/projectsApi';

export const IntegrationContext = createContext();

export const useIntegration = () => useContext(IntegrationContext);

export const IntegrationProvider = ({ children }) => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all-integrations';

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  const [refreshingId, setRefreshingId] = useState(null);
  const [rotatingId, setRotatingId] = useState(null);

  // Real Backend API Queries - only fetch when the relevant tab is active
  const {
    data: apiIntegrationsRes,
    isLoading: isAllLoading,
    error: allIntegrationsError,
    isError: isAllIntegrationsError,
    refetch: refetchIntegrations,
  } = useGetScaIntegrationsQuery(undefined, {
    skip: activeTab !== 'all-integrations' && activeTab !== 'active-integrations',
  });

  const {
    data: activeApiRes,
    isLoading: isActiveLoading,
    refetch: refetchActive,
    isError: isActiveIntegrationsError,
    error: activeIntegrationsError,
  } = useGetActiveScaIntegrationsQuery(undefined, {
    skip: activeTab !== 'active-integrations',
    pollingInterval: 3000,
  });

  const {
    data: logsApiRes,
    isLoading: isLogsLoading,
    refetch: refetchLogs,
    isError: isLogsError,
    error: logsError,
  } = useGetScaSyncLogsQuery(undefined, {
    skip: activeTab !== 'logs',
    pollingInterval: 2500,
  });

  const {
    data: webhooksRes,
    refetch: refetchWebhooks,
    isError: isWebhooksError,
    error: webhooksError,
  } = useGetScaWebhooksQuery(undefined, {
    skip: activeTab !== 'webhooks',
  });

  const [triggerGetIntegrationById] = useLazyGetScaIntegrationByIdQuery();

  // Backend API Mutations
  const [configureIntegration, { isLoading: isConfiguring }] = useConfigureScaIntegrationMutation();
  const [disconnectIntegration, { isLoading: isDisconnecting }] = useDisconnectScaIntegrationMutation();
  const [triggerSync] = useTriggerScaSyncMutation();
  const [rotateWebhook] = useRotateScaWebhookMutation();

  const integrationsList = useMemo(() => {
    return (
      apiIntegrationsRes?.data?.adapters || []
    );
  }, [apiIntegrationsRes]);

  const categories = useMemo(() => {
    if (apiIntegrationsRes?.data?.categories) {
      return ['All', ...apiIntegrationsRes.data.categories];
    }
    const catSet = new Set();
    integrationsList.forEach((item) => {
      if (Array.isArray(item.category)) {
        item.category.forEach((c) => catSet.add(c));
      } else if (item.category) {
        catSet.add(item.category);
      }
    });
    return ['All', ...Array.from(catSet)];
  }, [apiIntegrationsRes, integrationsList]);

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      label: cat,
      value: cat,
    }));
  }, [categories]);

  const filteredAdapters = useMemo(() => {
    if (selectedCategory === 'All') return integrationsList;
    return integrationsList?.filter((adapter) => {
      if (Array.isArray(adapter.category)) return adapter.category.includes(selectedCategory);
      return adapter.category === selectedCategory;
    });
  }, [integrationsList, selectedCategory]);

  const activeAdapters = useMemo(() => {
    if (activeApiRes?.data?.data && Array.isArray(activeApiRes.data.data)) {
      return activeApiRes.data.data.map((installed) => ({
        ...installed,
        instance_id: installed.id || installed._id || installed.instance_id,
        is_installed: true,
      }));
    }
    return integrationsList
      .filter((i) => i.isInstalled || i.status === 'Installed')
      .map((item) => ({
        ...item,
        instance_id: item.id || item._id || item.instance_id,
        is_installed: true,
      }));
  }, [activeApiRes, integrationsList]);

  const syncLogs = logsApiRes?.data || [];
  const systemWebhookToken = webhooksRes?.data?.token || '';

  const handleDisconnect = async (id) => {
    setDeletingId(id);
    try {
      await toast.promise(disconnectIntegration(id).unwrap(), {
        loading: 'Disconnecting integration...',
        success: 'Integration disconnected successfully.',
        error: (err) => err?.data?.error || 'Failed to disconnect integration.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSync = async (id) => {
    setRefreshingId(id);
    try {
      await toast.promise(triggerSync(id).unwrap(), {
        loading: 'Refreshing integration...',
        success: (res) => res?.message || 'Integration refreshed! All repos and dependencies refetched.',
        error: (err) => err?.data?.error || err?.data?.message || 'Failed to refresh integration.',
      });
    } finally {
      setRefreshingId(null);
    }
  };

  const handleRotateSystemToken = async () => {
    setRotatingId('global');
    try {
      await toast.promise(rotateWebhook().unwrap(), {
        loading: 'Rotating webhook secret...',
        success: 'System Webhook Secret rotated successfully! All repository URLs updated.',
        error: (err) => err?.data?.error || 'Failed to rotate system webhook secret.',
      });
      refetchWebhooks();
    } finally {
      setRotatingId(null);
    }
  };

  const handleSaveConfig = async (id, configData) => {
    try {
      await configureIntegration({
        id: id || 'github-sca',
        data: configData,
      }).unwrap();

      toast.success('Integration configured successfully! Repositories scanning in background.');
      return true;
    } catch (err) {
      toast.error(err?.data?.error || err?.data?.message || 'Failed to save integration settings.');
      return false;
    }
  };

  const getIntegrationById = async (id) => {
    try {
      const res = await triggerGetIntegrationById(id).unwrap();
      return res?.data || res;
    } catch (err) {
      toast.error(err?.data?.error || err?.data?.message || 'Failed to fetch integration details.');
      return null;
    }
  };

  const value = {
    adaptersLoading: isAllLoading,
    installedLoading: isActiveLoading,
    isLogsLoading,
    error: allIntegrationsError,
    integrationsList,
    categories,
    categoryOptions,
    selectedCategory,
    setSelectedCategory,
    filteredAdapters,
    activeAdapters,
    syncLogs,
    systemWebhookToken,
    deletingId,
    refreshingId,
    rotatingId,
    isConfiguring,
    isDisconnecting,
    handleDisconnect,
    handleSync,
    handleRotateSystemToken,
    handleSaveConfig,

    isAllIntegrationsError,
    isActiveIntegrationsError,
    activeIntegrationsError,
    isWebhooksError,
    webhooksError,
    isLogsError,
    logsError,
    getIntegrationById,
  };

  return <IntegrationContext.Provider value={value}>{children}</IntegrationContext.Provider>;
};
