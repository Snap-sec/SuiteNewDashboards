import React, { createContext, useContext, useState } from 'react';
import { useDeleteCsmAdapterMutation, useRefreshCsmAdapterMutation } from '@/services/csm/adaptersApi';
import { useDeleteVmIntegrationMutation } from '@/services/vm/integrationsApi';
import { toast } from 'sonner';

export const IntegrationContext = createContext();

export const IntegrationProvider = ({ children }) => {
  const [deleteAdapter, { isSuccess: isAdapterDeleted }] = useDeleteCsmAdapterMutation();
  const [refreshAdapter, { isSuccess: isAdapterRefreshed }] = useRefreshCsmAdapterMutation();
  const [deleteIntegration, { isSuccess: isIntegrationDeleted }] = useDeleteVmIntegrationMutation();

  const [deletingAdapterId, setDeletingAdapterId] = useState(null);
  const [refreshingAdapterId, setRefreshingAdapterId] = useState(null);
  const [deletingIntegrationId, setDeletingIntegrationId] = useState(null);

  const handleDeleteAdapter = async (adapterId) => {
    setDeletingAdapterId(adapterId);
    try {
      await toast.promise(deleteAdapter(adapterId).unwrap(), {
        loading: 'Deleting adapter...',
        success: 'Adapter deleted successfully',
        error: 'Failed to delete adapter',
      });
    } finally {
      setDeletingAdapterId(null);
    }
  };

  const handleRefreshAdapter = async (adapterId) => {
    setRefreshingAdapterId(adapterId);
    try {
      await toast.promise(refreshAdapter(adapterId).unwrap(), {
        loading: 'Refreshing adapter...',
        success: 'Adapter refreshed successfully',
        error: 'Failed to refresh adapter',
      });
    } finally {
      setRefreshingAdapterId(null);
    }
  };

  const handleDeleteIntegration = async (integrationId) => {
    setDeletingIntegrationId(integrationId);
    try {
      await toast.promise(deleteIntegration(integrationId).unwrap(), {
        loading: 'Removing integration...',
        success: 'Integration removed successfully',
        error: 'Failed to remove integration',
      });
    } finally {
      setDeletingIntegrationId(null);
    }
  };

  const handleDeleteItem = async (item) => {
    if (!item) return;
    if (item.kind === 'integration') {
      return handleDeleteIntegration(item.instance_id);
    }
    return handleDeleteAdapter(item.instance_id);
  };

  const value = {
    handleDeleteAdapter,
    handleRefreshAdapter,
    handleDeleteIntegration,
    handleDeleteItem,
    deletingAdapterId,
    refreshingAdapterId,
    deletingIntegrationId,
    isAdapterDeleted,
    isAdapterRefreshed,
    isIntegrationDeleted,
  };

  return (
    <IntegrationContext.Provider value={value}>
      {children}
    </IntegrationContext.Provider>
  );
};

export const useIntegrationContext = () => useContext(IntegrationContext);
