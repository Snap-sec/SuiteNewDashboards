import { baseApi } from '@/services/baseApi';

export const settingsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AimAdaptersSettings'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAimAdapterSettings: builder.query({
        query: () => ({
          url: `/asset-inventory/api/v1/settings`,
        }),

        providesTags: ['AimAdaptersSettings'],
      }),

      updateAimAdapterSettings: builder.mutation({
        query: (payload) => ({
          url: `/asset-inventory/api/v1/settings`,
          method: 'PUT',
          body: payload,
        }),
        invalidatesTags: ['AimAdaptersSettings'],
      }),

      getAimDecommissionPolicy: builder.query({
        query: () => ({
          url: `/asset-inventory/api/v1/settings/decommission-policy`,
        }),
        providesTags: ['AimDecommissionPolicy'],
      }),

      updateAimDecommissionPolicy: builder.mutation({
        query: (payload) => ({
          url: `/asset-inventory/api/v1/settings/decommission-policy`,
          method: 'PUT',
          body: payload,
        }),
        invalidatesTags: ['AimDecommissionPolicy'],
      }),
    }),
  });

export const {
  useGetAimAdapterSettingsQuery,
  useUpdateAimAdapterSettingsMutation,
  useGetAimDecommissionPolicyQuery,
  useUpdateAimDecommissionPolicyMutation,
} = settingsApi;
