import { baseApi } from '@/services/baseApi';

export const scaActionPlanApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ScaActionPlan'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getScaActionPlan: builder.query({
        query: (params) => ({
          url: '/sca/api/v1/action-plan',
          params,
        }),
        providesTags: ['ScaActionPlan'],
      }),
    }),
  });

export const { useGetScaActionPlanQuery } = scaActionPlanApi;
