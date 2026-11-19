import { baseApi } from '@/services/baseApi';

export const licensesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AimLicenses', 'AssetInventoryAssets'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAimLicenses: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/v1/transformed-assets',
          params: { type: 'license', ...params },
        }),
        providesTags: ['AimLicenses', 'AssetInventoryAssets'],
      }),

      createAimLicense: builder.mutation({
        query: (payload) => {
          const body = payload?.data
            ? payload
            : {
                type: 'license',
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
        invalidatesTags: ['AimLicenses', 'AssetInventoryAssets'],
      }),

      updateAimLicense: builder.mutation({
        query: ({ id, ...payload }) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${id}`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['AimLicenses', 'AssetInventoryAssets'],
      }),

      deleteAimLicense: builder.mutation({
        query: (id) => ({
          url: `/asset-inventory/api/v1/transformed-assets/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['AimLicenses', 'AssetInventoryAssets'],
      }),
    }),
  });

export const {
  useGetAimLicensesQuery,
  useCreateAimLicenseMutation,
  useUpdateAimLicenseMutation,
  useDeleteAimLicenseMutation,
} = licensesApi;
