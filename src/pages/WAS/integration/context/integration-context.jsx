import React, { createContext, useContext } from 'react';
import { useDeleteApisecIntegrationMutation, useRefreshApisecIntegrationMutation } from '@/services/apisec/integrationApi';
import { toast } from 'sonner';

export const IntegrationContext = createContext();

export const IntegrationProvider = ({ children }) => {
    const [deleteIntegration, { isLoading: isDeletingAdapter, isSuccess: isAdapterDeleted }] = useDeleteApisecIntegrationMutation();
    const [refreshIntegration, { isLoading: isRefreshingAdapter, isSuccess: isAdapterRefreshed }] = useRefreshApisecIntegrationMutation();


    const handleDeleteAdapter = async (integrationId) => {
        toast.promise(deleteIntegration({ integrationId }).unwrap(), {
            loading: 'Deleting integration...',
            success: 'Integration deleted successfully',
            error: 'Failed to delete integration'
        });
    };

    const handleRefreshAdapter = async (integrationId) => {
        toast.promise(refreshIntegration({ integrationId }).unwrap(), {
            loading: 'Refreshing integration...',
            success: 'Integration refreshed successfully',
            error: 'Failed to refresh integration'
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
