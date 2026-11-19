import { baseApi } from '@/services/baseApi';

export const adapterApi = baseApi
  .enhanceEndpoints({
    addTagTypes: [
      'AssetInventoryAdapters',
      'AssetInventoryAssets',
      'AssetInventoryGlobalAssets',
    ],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAimAdapterList: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/v1/adapters/supported',
          params,
        }),
        providesTags: (result) => ['AssetInventoryAdapters'],
      }),

      installAimAdapter: builder.mutation({
        query: ({ adapterName, payload }) => ({
          url: `/asset-inventory/api/v1/adapters/install/${adapterName}`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['AssetInventoryAdapters', 'AssetInventoryAssets', 'AssetInventoryGlobalAssets'],
      }),

      installAimCSVAdapter: builder.mutation({
        query: (data) => ({
          url: '/csm/api/adapter/csv',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['AssetInventoryAdapters', 'AssetInventoryAssets', 'AssetInventoryGlobalAssets'],
      }),

      manualImportAimAdapter: builder.mutation({
        query: (payload) => ({
          url: `/asset-inventory/api/v1/adapters/manual-import`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['AssetInventoryAdapters', 'AssetInventoryAssets', 'AssetInventoryGlobalAssets'],
      }),

      deleteAimAdapter: builder.mutation({
        query: (integrationId) => ({
          url: `/asset-inventory/api/v1/adapters/remove/${integrationId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['AssetInventoryAdapters', 'AssetInventoryAssets', 'AssetInventoryGlobalAssets'],
      }),

      refreshAimAdapter: builder.mutation({
        query: (adapterId) => ({
          url: `/asset-inventory/api/v1/adapters/refresh/${adapterId}`,
          method: 'POST',
        }),
        invalidatesTags: ['AssetInventoryAdapters', 'AssetInventoryAssets', 'AssetInventoryGlobalAssets'],
      }),

      refreshAllAimAdapters: builder.mutation({
        query: () => ({
          url: '/asset-inventory/api/v1/adapters/refresh-all',
          method: 'POST',
        }),
        invalidatesTags: ['AssetInventoryAdapters', 'AssetInventoryAssets', 'AssetInventoryGlobalAssets'],
      }),

      getInstalledAimAdapters: builder.query({
        query: () => ({
          url: '/asset-inventory/api/v1/adapters/installed',
        }),
        providesTags: ['AssetInventoryAdapters'],
      }),

      getAimAdapterLogs: builder.query({
        query: (params) => ({
          url: `/asset-inventory/api/v1/adapters/logs`,
          method: 'GET',
          params,
        }),
        providesTags: ['AssetInventoryAdapters'],
      }),

      getAimActiveAdapter: builder.query({
        query: () => ({
          url: `/asset-inventory/api/v1/adapters/installed`,
          method: 'GET',
        }),
        providesTags: ['AssetInventoryAdapters'],
      }),

      // Refresh aim adapter by adapter type
      refreshAimAdapterByType: builder.mutation({
        query: ({adapterType}) => ({
          url: `/asset-inventory/api/v1/adapters/refresh/type/${adapterType}`,
          method: 'POST',
        }),
        invalidatesTags: ['AssetInventoryAssets', 'AssetInventoryGlobalAssets', 'AssetInventoryAdapters'],
      }),

    }),
  });

export const {
  useRefreshAimAdapterMutation,
  useGetAimAdapterListQuery,
  useGetInstalledAimAdaptersQuery,
  useInstallAimAdapterMutation,
  useDeleteAimAdapterMutation,
  useInstallAimCSVAdapterMutation,
  useGetAimAdapterLogsQuery,
  useGetAimActiveAdapterQuery,
  useRefreshAllAimAdaptersMutation,
  useManualImportAimAdapterMutation,
  useRefreshAimAdapterByTypeMutation,
} = adapterApi;
