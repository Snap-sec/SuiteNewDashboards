import { baseApi } from '@/services/baseApi';

export const asmSettingsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AsmScansDashboard', 'AsmSettings'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      createAsmSettings: builder.mutation({
        query: (payload) => ({
          url: `/op/api/v1/settings`,
          method: 'POST',
          body: payload
        }),
        invalidatesTags: ['AsmSettings'],
      }),


    }),
  });

export const {
  useCreateAsmSettingsMutation,
} = asmSettingsApi;
