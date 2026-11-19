import { baseApi } from '@/services/baseApi';

export const adapterApi = baseApi.enhanceEndpoints({ addTagTypes: ['VmAdapters'] }).injectEndpoints({
    endpoints: (builder) => ({

      getInstalledVmAdapters: builder.query({
        query: (params) => ({
          url: '/csm/api/adapter',
          params,
        }),
        providesTags: (result) => ['VmAdapters'],
      }),


      getVmAdapterList: builder.query({
          query: (params) => ({
              url: '/csm/api/adapter/supported',
              params
          }),
          providesTags: (result) => ['VmAdapters'],
      }),


      installVmAdapter: builder.mutation({
          query: (data) => ({
              url: '/csm/api/adapter',
              method: "POST",
              body: data
          }),
          invalidatesTags: ["VmAdapters"]
      }),

      installVmCSVAdapter: builder.mutation({
          query: (data) => ({
              url: '/csm/api/adapter/csv',
              method: "POST",
              body: data
          }),
          invalidatesTags: ["VmAdapters"]
      }),


      deleteVmAdapter: builder.mutation({
        query: (id) => ({
          url: `/csm/api/adapter/${id}`,
          method: "DELETE"
        }),
        invalidatesTags: ["VmAdapters"]
      }),

      refreshVmAdapter: builder.mutation({
        query: (adapterId) => ({
          url: `/csm/api/adapter/refresh/${adapterId}`,
          method: "PATCH"
        }),
        invalidatesTags: ["VmAdapters"]
      }),

      getVmAdapterLogs: builder.query({
        query: (params) => ({
          url: '/csm/api/adapter/logs',
          method: 'GET',
          params,
        }),
        providesTags: ['VmAdapters'],
      }),

      configureVmAdapter: builder.mutation({
        query: ({ adapterId, data }) => ({
          url: `/csm/api/adapter/configure/${adapterId}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: ['VmAdapters'],
      }),

    }),
  });

export const { useRefreshVmAdapterMutation, useGetVmAdapterListQuery, useGetInstalledVmAdaptersQuery, useInstallVmAdapterMutation, useDeleteVmAdapterMutation, useInstallVmCSVAdapterMutation, useGetVmAdapterLogsQuery, useConfigureVmAdapterMutation } = adapterApi;