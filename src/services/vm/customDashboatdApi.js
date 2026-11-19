import { baseApi } from '@/services/baseApi';

export const customDashboardApi = baseApi.enhanceEndpoints({ addTagTypes: ['VmCustomDashboard'] }).injectEndpoints({
    endpoints: (builder) => ({

        getVmCustomDashboard: builder.query({
          query: () => ({
            url: `/csm/api/custom-dashboards`,
          }),
          providesTags: (result) => ['VmCustomDashboard', 'VmStats'],
        }),

        createVmCustomDashboard: builder.mutation({
          query: (payload) => ({
            url: '/csm/api/custom-dashboards',
            method: 'POST',
            body: payload,
          }),
          invalidatesTags: ['VmCustomDashboard', 'VmStats'],
        }),

        updateVmCustomDashboard: builder.mutation({
          query: ({ id, ...customDashboardData }) => ({
            url: `/csm/api/custom-dashboards/${id}`,
            method: 'PATCH',
            body: customDashboardData,
          }),
          invalidatesTags: ['VmCustomDashboard', 'VmStats'],
        }),

        deleteVmCustomDashboard: builder.mutation({
          query: (dashboardId) => ({
            url: `/csm/api/custom-dashboards/${dashboardId}`,
            method: 'DELETE'
          }),
          invalidatesTags: ['VmCustomDashboard', 'VmStats'],
        }),

    }),
});


export const { 
    useCreateVmCustomDashboardMutation,
    useGetVmCustomDashboardQuery,
    useUpdateVmCustomDashboardMutation,
    useDeleteVmCustomDashboardMutation
 } = customDashboardApi;
