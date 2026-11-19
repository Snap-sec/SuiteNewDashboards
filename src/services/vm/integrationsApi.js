import { baseApi } from '@/services/baseApi';

export const integrationsApi = baseApi.enhanceEndpoints({ addTagTypes: ['VmIntegrations', 'VmAdapters'] }).injectEndpoints({
    endpoints: (builder) => ({
        // List all integrations (Jira/ClickUp/Asana) installed for the org.
        // Backend returns `{ integrations: [...] }`.
        installVmIntegration: builder.mutation({
            query: (data) => ({
                url: `/csm/api/adapter`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['VmIntegrations', 'VmAdapters'],
        }),

        updateVmIntegration: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/csm/api/adapter/configure/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['VmIntegrations', 'VmAdapters'],
        }),

        deleteVmIntegration: builder.mutation({
            query: (id) => ({
                url: `/csm/api/integrations/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['VmIntegrations'],
        }),

        getVmJiraProjects: builder.query({
            query: () => ({ url: '/csm/api/ticket/jira/projects' }),
        }),

        getVmJiraIssueTypes: builder.query({
            query: (projectKey) => ({ url: `/csm/api/ticket/jira/project/${projectKey}/types` }),
        }),

        getVmJiraUsers: builder.query({
            query: () => ({ url: '/csm/api/ticket/jira/users' }),
        }),

        getVmJiraStatuses: builder.query({
            query: (projectKey) => ({ url: `/csm/api/ticket/jira/project/${projectKey}/statuses` }),
        }),

        // Diagnostic: returns { status, webhookUrl, webhookIds, hasSecret,
        // manualSetup? } so the UI can show a copy-paste panel for Jira
        // basic-auth integrations (which can't register webhooks via API).
        getVmWebhookStatus: builder.query({
            query: (carrier) => ({ url: `/csm/api/ticket/${carrier}/webhook/status` }),
            providesTags: ['VmIntegrations'],
        }),

        registerVmWebhook: builder.mutation({
            query: (carrier) => ({
                url: `/csm/api/ticket/${carrier}/webhook/register`,
                method: 'POST',
            }),
            invalidatesTags: ['VmIntegrations'],
        }),
    }),
});

export const {
    useInstallVmIntegrationMutation,
    useUpdateVmIntegrationMutation,
    useDeleteVmIntegrationMutation,
    useGetVmJiraProjectsQuery,
    useGetVmJiraIssueTypesQuery,
    useGetVmJiraUsersQuery,
    useGetVmJiraStatusesQuery,
    useGetVmWebhookStatusQuery,
    useRegisterVmWebhookMutation,
} = integrationsApi;
