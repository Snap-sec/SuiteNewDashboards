import { baseApi } from '@/services/baseApi';

export const backupsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Backup'] })
  .injectEndpoints({
    endpoints: (builder) => ({

      getBackups: builder.query({
        query: () => ({
          url: '/auth/api/v1/backups',
        }),
        providesTags: ['Backup'],
      }),

      getBackupSettings: builder.query({
        query: () => ({
          url: '/auth/api/v1/backups/settings',
        }),
        providesTags: ['BackupSettings'],
      }),

      updateBackupSettings: builder.mutation({
        query: (body) => ({
          url: '/auth/api/v1/backups/settings',
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['BackupSettings'],
      }),

      createBackup: builder.mutation({
        query: () => ({
          url: '/auth/api/v1/backups/trigger',
          method: 'POST',
        }),
        invalidatesTags: ['Backup'],
      }),

      deleteBackup: builder.mutation({
        query: (id) => ({
          url: `/auth/api/v1/backups/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Backup'],
      }),


      restoreBackup: builder.mutation({
        query: (id) => ({
          url: `/auth/api/v1/backups/${id}/restore`,
          method: 'POST',
        }),
        invalidatesTags: ['Backup'],
      }),

    }),
  });

export const {
  useGetBackupsQuery,
  useGetBackupSettingsQuery,
  useUpdateBackupSettingsMutation,
  useCreateBackupMutation,
  useDeleteBackupMutation,
  useRestoreBackupMutation,
} = backupsApi;
