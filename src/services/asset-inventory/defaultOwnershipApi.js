import { baseApi } from '@/services/baseApi';

export const defaultOwnershipApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AimDefaultOwnership'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAimDefaultOwnership: builder.query({
        query: () => ({
          url: `/asset-inventory/api/v1/settings/ownership-mapping`,
        }),

        providesTags: ['AimDefaultOwnership'],
      }),

      setBulkDefaultOwnersToMultipleAimAssets: builder.mutation({
        query: (payload) => ({
          url: `/asset-inventory/api/v1/settings/ownership-mapping`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['AimDefaultOwnership'],
      }),
    }),
  });

export const {
  useGetAimDefaultOwnershipQuery,

  useSetBulkDefaultOwnersToMultipleAimAssetsMutation,
} = defaultOwnershipApi;
