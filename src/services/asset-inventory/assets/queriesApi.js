import { baseApi } from '../../baseApi';

export const queriesApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['SavedQueries', 'QuerySchema', 'AdvancedAssets'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // Get the schema definition for the Query Wizard
      getAimQuerySchema: builder.query({
        query: () => ({
          url: '/asset-inventory/api/v1/queries/schema',
        }),
        providesTags: ['QuerySchema'],
      }),

      // List all saved queries
      getAimSavedQueries: builder.query({
        query: (params) => ({
          url: '/asset-inventory/api/v1/queries',
          params,
        }),
        providesTags: ['SavedQueries'],
      }),

      // Create a new saved query
      createAimSavedQuery: builder.mutation({
        query: (body) => ({
          url: '/asset-inventory/api/v1/queries',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['SavedQueries'],
      }),

      // Update a saved query
      updateAimSavedQuery: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/asset-inventory/api/v1/queries/${id}`,
          method: 'PATCH',
          body,
        }),
        invalidatesTags: ['SavedQueries'],
      }),

      // Delete a saved query
      deleteAimSavedQuery: builder.mutation({
        query: (id) => ({
          url: `/asset-inventory/api/v1/queries/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['SavedQueries'],
      }),

      // Perform search using Query AST (Query version for list views)
      getAimAdvancedAssets: builder.query({
        query: ({ body, params }) => ({
          url: '/asset-inventory/api/v1/transformed-assets/advanced-search',
          method: 'POST',
          body,
          params,
        }),
        providesTags: ['AdvancedAssets'],
      }),

      // Perform advanced search using Query AST (Mutation version for one-off actions)
      performAimAdvancedSearch: builder.mutation({
        query: ({ body, params }) => ({
          url: '/asset-inventory/api/v1/transformed-assets/advanced-search',
          method: 'POST',
          body,
          params,
        }),
      }),
    }),
  });

export const {
  useGetAimQuerySchemaQuery,
  useGetAimSavedQueriesQuery,
  useCreateAimSavedQueryMutation,
  useUpdateAimSavedQueryMutation,
  useDeleteAimSavedQueryMutation,
  usePerformAimAdvancedSearchMutation,
  useGetAimAdvancedAssetsQuery,
} = queriesApi;
