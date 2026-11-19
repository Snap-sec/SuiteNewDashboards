import { baseApi } from '@/services/baseApi';

export const serviceProviderApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ServiceProviders'] })
  .injectEndpoints({

    endpoints: (builder) => ({

      listOwnedOrgs: builder.query({
        query: (params) => ({
          url: '/auth/api/service-provider/orgs',
          params,
        }),
        providesTags: (result) => ['ServiceProviders'],
      }),

      createNewOrg: builder.mutation({
        query: (payload) => ({
          url: '/auth/api/service-provider/create-org',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ServiceProviders'],
      }),

      loginIntoOwnedOrg: builder.mutation({
        query: ({ payload }) => ({
          url: `/auth/api/service-provider/login-into-org`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ServiceProviders'],
      }),

      // Get details of a specific owned org: GET /service-provider/org/:orgId
      getOrgDetails: builder.query({
        query: (orgId) => ({
          url: `/auth/api/service-provider/org/${orgId}`,
        }),
        providesTags: (result, error, orgId) => [{ type: 'ServiceProviders', id: orgId }],
      }),

      // Update basic org details: { orgId, name, website, logo, locked }
      updateOrgDetails: builder.mutation({
        query: ({ payload }) => ({
          url: `/auth/api/service-provider/update-org`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ServiceProviders'],
      }),

      // Update license expiry: { orgId, licenceExpiry }
      updateLicense: builder.mutation({
        query: (payload) => ({
          url: `/auth/api/service-provider/update-license`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ServiceProviders'],
      }),

      // Update allowed product access: { orgId, accessTo: ["VM", "ASM", ...] }
      updateProductAccess: builder.mutation({
        query: (payload) => ({
          url: `/auth/api/service-provider/update-product-access`,
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['ServiceProviders'],
      }),

    }),
  });

export const {
  useListOwnedOrgsQuery,
  useCreateNewOrgMutation,
  useLoginIntoOwnedOrgMutation,
  useGetOrgDetailsQuery,
  useUpdateOrgDetailsMutation,
  useUpdateLicenseMutation,
  useUpdateProductAccessMutation,
} = serviceProviderApi;
