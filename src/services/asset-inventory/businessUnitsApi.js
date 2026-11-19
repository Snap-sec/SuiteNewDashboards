import { baseApi } from '@/services/baseApi';

export const businessUnitApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['BusinessUnits'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAimBusinessUnits: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/v1/business-units',
          params,
        }),
        providesTags: (result) => ['BusinessUnits'],
      }),

      // get business unit data by id
      getAimBusinessUnitById: builder.query({
        query: (businessUnitId) => ({
          url: `/asset-inventory/api/v1/business-units/${businessUnitId}`,
        }),
        providesTags: (result) => ['BusinessUnits'],
      }),

      createAimBusinessUnit: builder.mutation({
        query: (payload) => ({
          url: '/asset-inventory/api/v1/business-units',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['BusinessUnits'],
      }),

      updateAimBusinessUnit: builder.mutation({
        query: (payload) => ({
          url: `/asset-inventory/api/v1/business-units/${payload.id}`,
          method: 'PATCH',
          body: payload,
        }),
        invalidatesTags: ['BusinessUnits'],
      }),

      deleteAimBusinessUnit: builder.mutation({
        query: (id) => ({
          url: `/asset-inventory/api/v1/business-units/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['BusinessUnits'],
      }),
      getAimBusinessUnitRiskConfig: builder.query({
        query: () => '/asset-inventory/api/v1/business-units/risk-config',
      }),

      getAimAssetBusinessUnitById: builder.query({
        query: (businessUnitId) => ({
          url: `/asset-inventory/api/v1/business-units/${businessUnitId}/assets`,
        }),
        providesTags: (result) => ['BusinessUnits'],
      }),

      aimBusinessUnitBulkAssign: builder.mutation({
        query: (payload) => ({
          url: '/asset-inventory/api/v1/business-units/bulk-assign',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['BusinessUnits', 'AssetInventoryAssets', 'AssetInventoryGlobalAssets'],
      }),

      addAimBusinessUnitAssets: builder.mutation({
        query: (payload) => ({
          url: `/asset-inventory/api/v1/business-units/${payload.businessUnitId}/assets`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['BusinessUnits', 'AssetInventoryAssets'],
      }),

      // Take array of asset ids
      removeAimBusinessUnitAssociatedAssets: builder.mutation({
        query: (payload) => ({
          url: `/asset-inventory/api/v1/business-units/${payload.businessUnitId}/assets/${payload.assetId}`,
          method: 'DELETE',
          body: payload,
        }),
        invalidatesTags: ['BusinessUnits', 'AssetInventoryAssets'],
      }),


    }),
  });

export const {
  useGetAimBusinessUnitsQuery,
  useGetAimBusinessUnitByIdQuery,
  useCreateAimBusinessUnitMutation,
  useUpdateAimBusinessUnitMutation,
  useDeleteAimBusinessUnitMutation,
  useGetAimBusinessUnitRiskConfigQuery,
  useGetAimAssetBusinessUnitByIdQuery,
  useAimBusinessUnitBulkAssignMutation,
  useAddAimBusinessUnitAssetsMutation,

  useRemoveAimBusinessUnitAssociatedAssetsMutation
} = businessUnitApi;
