import { baseApi } from '@/services/baseApi';

export const dashboardApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AutomationDashboard'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAutomationDashboard: builder.query({
        query: () => '/automations/api/v1/dashboard',
        providesTags: ['AutomationDashboard'],
      }),
    }),
  });

export const { useGetAutomationDashboardQuery } = dashboardApi;
