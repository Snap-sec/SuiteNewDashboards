import { baseApi } from '@/services/baseApi';

export const vendorsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AimVendors', 'AssetInventoryAssets'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAimVendors: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/v1/transformed-assets',
          params: { type: 'vendor', ...params },
        }),
        providesTags: ['AimVendors', 'AssetInventoryAssets'],
      }),

      createAimVendor: builder.mutation({
        query: (payload) => {
          const body = payload?.data
            ? payload
            : {
                type: 'vendor',
                value: payload?.name || payload?.value || '',
                data: {
                  ...payload,
                  source: payload?.source || 'manual',
                },
              };
          return {
            url: '/asset-inventory/api/v1/raw-assets',
            method: 'POST',
            body,
          };
        },
        invalidatesTags: ['AimVendors', 'AssetInventoryAssets'],
      }),

      updateAimVendor: builder.mutation({
        query: ({ id, ...payload }) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${id}`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['AimVendors', 'AssetInventoryAssets'],
      }),

      deleteAimVendor: builder.mutation({
        query: (id) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['AimVendors', 'AssetInventoryAssets'],
      }),
    }),
  });

export const {
  useGetAimVendorsQuery,
  useCreateAimVendorMutation,
  useUpdateAimVendorMutation,
  useDeleteAimVendorMutation,
} = vendorsApi;
