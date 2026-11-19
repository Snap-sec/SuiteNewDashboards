import { baseApi } from '@/services/baseApi';

export const scaLicensesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ScaLicenses'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getScaLicenses: builder.query({
        query: (params) => ({
          url: '/sca/api/v1/licenses',
          params,
        }),
        providesTags: ['ScaLicenses'],
      }),
    }),
  });

export const { useGetScaLicensesQuery } = scaLicensesApi;
