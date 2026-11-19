import { baseApi } from '@/services/baseApi';

export const scanprofileApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ApisecScanProfile'] })
  .injectEndpoints({
    endpoints: (builder) => ({


      getApisecScanProfile: builder.query({
        query: (search="") => ({
          url: `/apisec/api/v1/auth-profiles`,
        }),
        providesTags: ['ApisecScanProfile'],
      }),

      createApisecScanProfile: builder.mutation({
        query: (payload) => ({
          url: `/apisec/api/v1/auth-profiles`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ApisecScanProfile'],
      }),

      updateApisecScanProfile: builder.mutation({
        query: ({ payload, scanId }) => ({
          url: `/apisec/api/v1/auth-profiles/${scanId}`,
          method: 'PUT',
          body: payload,
        }),
        invalidatesTags: ['ApisecScanProfile'],
      }),

      deleteApisecScanProfile: builder.mutation({
        query: ( scanId) => ({
          url: `/apisec/api/v1/auth-profiles/${scanId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['ApisecScanProfile'],
      }),


    }),
  });

export const {
  useGetApisecScanProfileQuery,
  useCreateApisecScanProfileMutation,
  useUpdateApisecScanProfileMutation,
  useDeleteApisecScanProfileMutation,
} = scanprofileApi;
