import React, { createContext, useContext, useState } from 'react';
import {
  useRemoveAutoPtIntegrationMutation,
  useRefreshAutoPtIntegrationMutation,
  useRefreshAllAutoPtIntegrationsMutation,
} from '@/services/integration/integrationsApi';
import { toast } from 'sonner';

export const IntegrationContext = createContext();

export const IntegrationProvider = ({ children }) => {
  const [removeIntegration, { isSuccess: isAdapterDeleted }] =
    useRemoveAutoPtIntegrationMutation();
  const [refreshIntegration, { isSuccess: isAdapterRefreshed }] =
    useRefreshAutoPtIntegrationMutation();
  const [refreshAllIntegrations, { isLoading: isRefreshingAll }] =
    useRefreshAllAutoPtIntegrationsMutation();

  const [deletingAdapterId, setDeletingAdapterId] = useState(null);
  const [refreshingAdapterId, setRefreshingAdapterId] = useState(null);

  const handleDeleteAdapter = async (adapterId) => {
    setDeletingAdapterId(adapterId);
    try {
      await toast.promise(removeIntegration(adapterId).unwrap(), {
        loading: 'Deleting integration...',
        success: 'Integration deleted successfully',
        error: 'Failed to delete integration',
      });
    } finally {
      setDeletingAdapterId(null);
    }
  };

  const handleRefreshAdapter = async (adapterId) => {
    setRefreshingAdapterId(adapterId);
    try {
      await toast.promise(refreshIntegration(adapterId).unwrap(), {
        loading: 'Refreshing integration...',
        success: 'Integration refreshed successfully',
        error: 'Failed to refresh integration',
      });
    } finally {
      setRefreshingAdapterId(null);
    }
  };

  const handleRefreshAll = async () => {
    try {
      await toast.promise(refreshAllIntegrations().unwrap(), {
        loading: 'Refreshing all integrations...',
        success: 'All integrations refreshed successfully',
        error: 'Failed to refresh all integrations',
      });
    } catch {
      // Handled by toast
    }
  };

  const handleDeleteItem = async (item) => {
    if (!item) return;
    const id = item.instance_id || item._id || item.id;
    return handleDeleteAdapter(id);
  };

  const value = {
    handleDeleteAdapter,
    handleRefreshAdapter,
    handleRefreshAll,
    handleDeleteIntegration: handleDeleteAdapter,
    handleDeleteItem,
    deletingAdapterId,
    refreshingAdapterId,
    deletingIntegrationId: deletingAdapterId,
    isAdapterDeleted,
    isAdapterRefreshed,
    isIntegrationDeleted: isAdapterDeleted,
    isRefreshingAll,
  };

  return (
    <IntegrationContext.Provider value={value}>
      {children}
    </IntegrationContext.Provider>
  );
};