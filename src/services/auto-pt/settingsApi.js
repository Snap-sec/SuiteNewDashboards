import { baseApi } from '@/services/baseApi';

const settingsUrl = '/autopentest/api/v1/settings/code-security';
const validateStatus = (response, result) =>
  response.ok && result?.status !== 0;

export const autoPtSettingsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AutoPtCodeSecuritySettings'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCodeSecuritySettings: builder.query({
        query: () => ({ url: settingsUrl, validateStatus }),
        providesTags: ['AutoPtCodeSecuritySettings'],
      }),
      updateCodeSecuritySettings: builder.mutation({
        query: (body) => ({
          url: settingsUrl,
          method: 'PATCH',
          body,
          validateStatus,
        }),
        invalidatesTags: ['AutoPtCodeSecuritySettings'],
      }),
    }),
  });

export const {
  useGetCodeSecuritySettingsQuery,
  useUpdateCodeSecuritySettingsMutation,
} = autoPtSettingsApi;
