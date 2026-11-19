import { baseApi } from '@/services/baseApi';

export const dashboardApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['TMdashboard'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      
      getTmDashboard: builder.query({
        query: (params) => ({
          url: '/tm/api/dashboard',
          params,
        }),
        providesTags: (result) => ['TMdashboard'],
      }),


    }),
  });

export const {
  useGetTmDashboardQuery,
} = dashboardApi;
