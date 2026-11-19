import { baseApi } from '../../baseApi';

export const technologiesApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['AssetInventoryTechnologies'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // Get assets by specifying assetType
      getAimTechnologies: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/transformed-assets/meta/technologies',
          params,
        }),

        providesTags: ['AssetInventoryTechnologies'],
      }),
    }),
  });

export const { useGetAimTechnologiesQuery } = technologiesApi;
