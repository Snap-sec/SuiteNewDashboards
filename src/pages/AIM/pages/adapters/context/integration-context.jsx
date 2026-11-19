import React, { createContext, useContext } from 'react';
import { useDeleteAimAdapterMutation, useRefreshAimAdapterMutation } from '@/services/asset-inventory/adaptersApi';
import { toast } from 'sonner';

export const IntegrationContext = createContext();

export const IntegrationProvider = ({ children }) => {
    const [deleteAdapter, { isLoading: isDeletingAdapter, isSuccess: isAdapterDeleted }] = useDeleteAimAdapterMutation();
    const [refreshAdapter, { isLoading: isRefreshingAdapter, isSuccess: isAdapterRefreshed }] = useRefreshAimAdapterMutation();

    const handleDeleteAdapter = async (adapterId) => {
        toast.promise(deleteAdapter(adapterId).unwrap(), {
            loading: 'Deleting adapter...',
            success: 'Adapter deleted successfully',
            error: 'Failed to delete adapter'
        });
    };

    const handleRefreshAdapter = async (adapterId) => {
        toast.promise(refreshAdapter(adapterId).unwrap(), {
            loading: 'Refreshing adapter...',
            success: 'Adapter refreshed successfully',
            error: 'Failed to refresh adapter'
        });
    };

    const value = {
        handleDeleteAdapter,
        handleRefreshAdapter,
        isDeletingAdapter,
        isRefreshingAdapter,
        isAdapterDeleted,
        isAdapterRefreshed,
    };

    return (
        <IntegrationContext.Provider value={value}>
            {children}
        </IntegrationContext.Provider>
    );
};
