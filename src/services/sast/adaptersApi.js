import { baseApi } from '@/services/baseApi';

export const sastAdaptersApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['SastAdapters'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSupportedAdapters: builder.query({
        query: () => ({
          url: '/sast/api/v1/adapters/supported',
        }),
        providesTags: ['SastAdapters'],
      }),

      getInstalledAdapters: builder.query({
        query: () => ({
          url: '/sast/api/v1/adapters/installed',
        }),
        providesTags: ['SastAdapters'],
      }),

      installAdapter: builder.mutation({
        query: ({ adapterType, apiKey, ...data }) => ({
          url: `/sast/api/v1/adapters/install/${adapterType}`,
          method: 'POST',
          body: apiKey ? { apiKey, ...data } : data,
        }),
        invalidatesTags: ['SastAdapters'],
      }),

      uninstallAdapter: builder.mutation({
        query: (adapterType) => ({
          url: `/sast/api/v1/adapters/${adapterType}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['SastAdapters'],
      }),

      getAdapterLogs: builder.query({
        query: (params) => ({
          url: '/sast/api/v1/adapters/logs',
          params,
        }),
        providesTags: ['SastAdapters'],
      }),
    }),
  });

export const {
  useGetSupportedAdaptersQuery,
  useGetInstalledAdaptersQuery,
  useInstallAdapterMutation,
  useUninstallAdapterMutation,
  useGetAdapterLogsQuery,
} = sastAdaptersApi;
