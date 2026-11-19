import { baseApi } from '@/services/baseApi';

export const csmAdapterApi = baseApi.enhanceEndpoints({ addTagTypes: ['CsmAdapters'] }).injectEndpoints({
  endpoints: (builder) => ({

    getInstalledCsmAdapters: builder.query({
      query: (params) => ({
        url: '/cspm/api/v1/adapters/installed',
        params,
      }),
      providesTags: (result) => ['CsmAdapters'],
    }),


    getCsmAdapterList: builder.query({
      query: (params) => ({
        url: '/cspm/api/v1/adapters/supported',
        params
      }),
      providesTags: (result) => ['CsmAdapters'],
    }),


    installCsmAdapter: builder.mutation({
      query: (data) => {
        if (data.adapterType) {
          const { adapterType, ...body } = data;
          return {
            url: `/cspm/api/v1/adapters/install/${adapterType}`,
            method: "POST",
            body: body
          };
        }
        return {
          url: '/cspm/api/v1/adapters',
          method: "POST",
          body: data
        };
      },
      invalidatesTags: ["CsmAdapters"]
    }),

    installCsmCSVAdapter: builder.mutation({
      query: (data) => ({
        url: '/cspm/api/v1/adapters/csv',
        method: "POST",
        body: data
      }),
      invalidatesTags: ["CsmAdapters"]
    }),


    deleteCsmAdapter: builder.mutation({
      query: (id) => ({
        url: `/cspm/api/v1/adapters/remove/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["CsmAdapters"]
    }),

    refreshCsmAdapter: builder.mutation({
      query: (adapterId) => ({
        url: `/cspm/api/v1/adapters/refresh/${adapterId}`,
        method: "POST"
      }),
      invalidatesTags: ["CsmAdapters"]
    }),

    getCsmAdapterLogs: builder.query({
      query: (params) => ({
        url: '/cspm/api/v1/adapters/logs',
        method: 'GET',
        params,
      }),
      providesTags: ['CsmAdapters'],
    }),

    configureCsmAdapter: builder.mutation({
      query: ({ adapterId, data }) => ({
        url: `/cspm/api/v1/adapters/configure/${adapterId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['CsmAdapters'],
    }),

  }),
});

export const { useRefreshCsmAdapterMutation, useGetCsmAdapterListQuery, useGetInstalledCsmAdaptersQuery, useInstallCsmAdapterMutation, useDeleteCsmAdapterMutation, useInstallCsmCSVAdapterMutation, useGetCsmAdapterLogsQuery, useConfigureCsmAdapterMutation } = csmAdapterApi;
