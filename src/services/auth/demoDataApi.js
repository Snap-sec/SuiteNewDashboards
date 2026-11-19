import { baseApi } from '@/services/baseApi';

export const demoDataApi = baseApi
  .enhanceEndpoints({ addTagTypes: [] })
  .injectEndpoints({
    endpoints: (builder) => ({
      loadDemoData: builder.mutation({
        query: () => ({
          url: '/auth/api/demo-data/load',
          method: 'POST',
        }),
      }),
    }),
  });

export const { useLoadDemoDataMutation } = demoDataApi;
