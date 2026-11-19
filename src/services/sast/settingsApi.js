import { baseApi } from '@/services/baseApi';

export const sastSettingsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['SastSettings'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSastSettings: builder.query({
        query: (params) => ({
          url: '/sast/api/v1/settings',
          params,
        }),
        providesTags: ['SastSettings'],
      }),

      updateSastSettings: builder.mutation({
        query: (payload) => ({
          url: '/sast/api/v1/settings',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['SastSettings'],
      }),
    }),
  });

export const scaSettingsApi = sastSettingsApi;

export const {
  useGetSastSettingsQuery,
  useUpdateSastSettingsMutation,
} = sastSettingsApi;

export const useGetScaSettingsQuery = useGetSastSettingsQuery;
export const useUpdateScaSettingsMutation = useUpdateSastSettingsMutation;

