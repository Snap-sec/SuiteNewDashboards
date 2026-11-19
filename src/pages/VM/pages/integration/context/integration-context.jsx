import React, { createContext, useContext, useState } from 'react';
import { useDeleteVmAdapterMutation } from '@/services/vm/adaptersApi';
import { useRefreshVmAdapterMutation } from '@/services/vm/adaptersApi';
import { useDeleteVmIntegrationMutation } from '@/services/vm/integrationsApi';
import { toast } from 'sonner';

export const IntegrationContext = createContext();

export const IntegrationProvider = ({ children }) => {
    const [deleteAdapter, { isSuccess: isAdapterDeleted }] = useDeleteVmAdapterMutation();
    const [refreshAdapter, { isSuccess: isAdapterRefreshed }] = useRefreshVmAdapterMutation();
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
                error: 'Failed to delete adapter'
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
                error: 'Failed to refresh adapter'
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
                error: 'Failed to remove integration'
            });
        } finally {
            setDeletingIntegrationId(null);
        }
    };

    /**
     * Unified delete dispatcher. Routes the request to the correct backend
     * endpoint based on the item kind so adapters and integrations stay
     * cleanly separated in storage and lifecycle.
     */
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