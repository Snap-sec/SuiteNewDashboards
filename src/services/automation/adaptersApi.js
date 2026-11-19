import { baseApi } from '@/services/baseApi';

export const automationAdapterApi = baseApi.enhanceEndpoints({ addTagTypes: ['AutomationAdapters'] }).injectEndpoints({
  endpoints: (builder) => ({

    getInstalledAutomationAdapters: builder.query({
      query: (params) => ({
        url: '/automations/api/v1/adapters/installed',
        params,
      }),
      providesTags: (result) => ['AutomationAdapters'],
    }),

    getAutomationAdapterList: builder.query({
      query: (params) => ({
        url: '/automations/api/v1/adapters/supported',
        params
      }),
      providesTags: (result) => ['AutomationAdapters'],
    }),

    installAutomationAdapter: builder.mutation({
      query: ({ adapterType, data }) => ({
        url: `/automations/api/v1/adapters/install/${adapterType}`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["AutomationAdapters"]
    }),

    deleteAutomationAdapter: builder.mutation({
      query: (id) => ({
        url: `/automations/api/v1/adapters/${id}`, // guess
        method: "DELETE"
      }),
      invalidatesTags: ["AutomationAdapters"]
    }),

    refreshAutomationAdapter: builder.mutation({
      query: (adapterId) => ({
        url: `/automations/api/v1/adapters/refresh/${adapterId}`, // guess
        method: "PATCH"
      }),
      invalidatesTags: ["AutomationAdapters"]
    }),

    getAutomationAdapterLogs: builder.query({
      query: (params) => ({
        url: '/automations/api/v1/adapters/logs', // guess
        method: 'GET',
        params,
      }),
      providesTags: ['AutomationAdapters'],
    }),

    configureAutomationAdapter: builder.mutation({
      query: ({ type, data, method = 'PUT' }) => ({
        url: `/automations/api/v1/adapters/${type}`,
        method,
        body: data,
      }),
      invalidatesTags: ['AutomationAdapters'],
    }),

  }),
});

export const {
  useRefreshAutomationAdapterMutation,
  useGetAutomationAdapterListQuery,
  useGetInstalledAutomationAdaptersQuery,
  useInstallAutomationAdapterMutation,
  useDeleteAutomationAdapterMutation,
  useGetAutomationAdapterLogsQuery,
  useConfigureAutomationAdapterMutation
} = automationAdapterApi;
