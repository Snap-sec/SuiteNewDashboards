import { baseApi } from '@/services/baseApi';

export const scaSettingsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ScaSettings'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getScaSettings: builder.query({
        query: (params) => ({
          url: '/sca/api/v1/settings',
          params,
        }),
        providesTags: ['ScaSettings'],
      }),

      updateScaSettings: builder.mutation({
        query: (payload) => ({
          url: '/sca/api/v1/settings',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ScaSettings'],
      }),
    }),
  });

export const {
  useGetScaSettingsQuery,
  useUpdateScaSettingsMutation,
} = scaSettingsApi;
