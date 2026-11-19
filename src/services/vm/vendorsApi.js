import { baseApi } from '@/services/baseApi';

function normalizeVendor(v) {
  if (!v || typeof v !== 'object') return v;
  const contact = v.contact_details ?? v.contactDetails ?? {};
  return {
    ...v,
    id: v.id ?? v._id ?? v.vendorId ?? v.vendor_id,
    createdAt: v.createdAt ?? v.created_at ?? v.createdOn ?? v.created_on,
    // Flatten for UI components (table/search/dialogs)
    email: v.email ?? contact.email,
    phone: v.phone ?? contact.phone,
    address: v.address ?? contact.address,
    logo_url: v.logo_url ?? v.logoUrl ?? v.logo,
    isActive:
      typeof v.isActive === 'boolean'
        ? v.isActive
        : typeof v.is_active === 'boolean'
          ? v.is_active
          : typeof v.active === 'boolean'
            ? v.active
            : true,
    isDefault: !!(v.is_default || v.isDefault),
  };
}

function normalizeVendorsResponse(response) {
  const data = response?.data ?? response;
  const vendors = data?.vendors ?? (Array.isArray(data) ? data : []);
  
  return {
    ...response,
    data: {
      ...data,
      vendors: vendors.map(normalizeVendor)
    }
  };
}

export const vendorsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['VmVendors', 'VmVendor'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getVmVendors: builder.query({
        query: (params) => ({
          url: '/csm/api/vendors',
          method: 'GET',
          params,
        }),
        transformResponse: (response) => normalizeVendorsResponse(response),
        providesTags: (result) => [
          { type: 'VmVendors', id: 'LIST' },
          ...(result?.data?.vendors ?? []).map((v) => ({ type: 'VmVendor', id: v.id ?? v._id })),
        ],
      }),

      getVmVendor: builder.query({
        query: (vendorId) => ({
          url: `/csm/api/vendors/${vendorId}`,
          method: 'GET',
        }),
        transformResponse: (response) => normalizeVendor(response?.data ?? response?.vendor ?? response),
        providesTags: (result, _error, vendorId) => [{ type: 'VmVendor', id: result?.id ?? vendorId }],
      }),

      createVmVendor: builder.mutation({
        query: (payload) => ({
          url: '/csm/api/vendors',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: [{ type: 'VmVendors', id: 'LIST' }],
      }),

      updateVmVendor: builder.mutation({
        query: ({ vendorId, ...updates }) => ({
          url: `/csm/api/vendors/${vendorId}`,
          method: 'PUT',
          body: updates,
        }),
        invalidatesTags: (_result, _error, { vendorId }) => [
          { type: 'VmVendors', id: 'LIST' },
          { type: 'VmVendor', id: vendorId },
        ],
      }),

      deleteVmVendor: builder.mutation({
        query: (vendorId) => ({
          url: `/csm/api/vendors/${vendorId}`,
          method: 'DELETE',
        }),
        invalidatesTags: (_result, _error, vendorId) => [
          { type: 'VmVendors', id: 'LIST' },
          { type: 'VmVendor', id: vendorId },
        ],
      }),
 
      markVmVendorAsDefault: builder.mutation({
        query: (vendorId) => ({
          url: `/csm/api/vendors/${vendorId}/default`,
          method: 'PUT',
        }),
        invalidatesTags: [{ type: 'VmVendors', id: 'LIST' }],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetVmVendorsQuery,
  useGetVmVendorQuery,
  useCreateVmVendorMutation,
  useUpdateVmVendorMutation,
  useDeleteVmVendorMutation,
  useMarkVmVendorAsDefaultMutation,
} = vendorsApi;

