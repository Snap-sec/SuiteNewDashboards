import { baseApi } from '@/services/baseApi';

export const skillsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['AutomationSkills'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      // GET /automations/api/v1/skills - List all root skills
      getSkills: builder.query({
        query: (params) => ({
          url: '/automations/api/v1/skills',
          params,
        }),
        providesTags: ['AutomationSkills'],
      }),

      // POST /automations/api/v1/skills/upload - Import skill zip archive
      importSkillZip: builder.mutation({
        query: (arg) => {
          let body;
          if (arg instanceof FormData) {
            body = arg;
          } else {
            const formData = new FormData();
            if (arg?.file) formData.append("file", arg.file);
            if (arg?.name) formData.append("name", arg.name);
            if (arg?.description) formData.append("description", arg.description);
            if (arg?.tags) {
              if (Array.isArray(arg.tags)) {
                formData.append("tags", JSON.stringify(arg.tags));
              } else {
                formData.append("tags", arg.tags);
              }
            }
            body = formData;
          }

          return {
            url: "/automations/api/v1/skills/upload",
            method: "POST",
            body,
          };
        },
        invalidatesTags: ["AutomationSkills"],
      }),

      // POST /automations/api/v1/skills - Create and template a new skill
      createSkill: builder.mutation({
        query: (body) => ({
          url: '/automations/api/v1/skills',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['AutomationSkills'],
      }),

      // GET /automations/api/v1/skills/{skillId} - Get root skill details and tree
      getSkillById: builder.query({
        query: (skillId) => `/automations/api/v1/skills/${skillId}`,
        providesTags: (result, error, id) => [{ type: 'AutomationSkills', id }],
      }),

      // PUT /automations/api/v1/skills/{skillId} - Update an existing root skill
      updateSkill: builder.mutation({
        query: ({ skillId, ...body }) => ({
          url: `/automations/api/v1/skills/${skillId}`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: (result, error, { skillId }) => [
          'AutomationSkills',
          { type: 'AutomationSkills', id: skillId },
        ],
      }),

      // DELETE /automations/api/v1/skills/{skillId} - Delete a skill and all internal files/folders
      deleteSkill: builder.mutation({
        query: (skillId) => ({
          url: `/automations/api/v1/skills/${skillId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['AutomationSkills'],
      }),

      // GET /automations/api/v1/skills/{skillId}/tree - Get complete hierarchical tree of a skill
      getSkillTree: builder.query({
        query: (skillId) => `/automations/api/v1/skills/${skillId}/tree`,
        providesTags: (result, error, skillId) => [
          { type: 'AutomationSkills', id: `${skillId}-tree` },
        ],
      }),

      // POST /automations/api/v1/skills/{skillId}/nodes - Create a file or folder inside a skill
      createSkillNode: builder.mutation({
        query: ({ skillId, ...body }) => ({
          url: `/automations/api/v1/skills/${skillId}/nodes`,
          method: 'POST',
          body,
        }),
        invalidatesTags: (result, error, { skillId }) => [
          { type: 'AutomationSkills', id: `${skillId}-tree` },
          { type: 'AutomationSkills', id: skillId },
        ],
      }),

      // PUT /automations/api/v1/skills/{skillId}/nodes/{nodeId} - Update a file or folder inside a skill
      updateSkillNode: builder.mutation({
        query: ({ skillId, nodeId, ...body }) => ({
          url: `/automations/api/v1/skills/${skillId}/nodes/${nodeId}`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: (result, error, { skillId }) => [
          { type: 'AutomationSkills', id: `${skillId}-tree` },
          { type: 'AutomationSkills', id: skillId },
        ],
      }),

      // POST /automations/api/v1/skills/refresh - Refresh/sync skills
      refreshSkills: builder.mutation({
        query: () => ({
          url: '/automations/api/v1/skills/refresh',
          method: 'POST',
        }),
        invalidatesTags: ['AutomationSkills'],
      }),

      // DELETE /automations/api/v1/skills/{skillId}/nodes/{nodeId} - Delete a file or folder inside a skill
      deleteSkillNode: builder.mutation({
        query: ({ skillId, nodeId }) => ({
          url: `/automations/api/v1/skills/${skillId}/nodes/${nodeId}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, { skillId }) => [
          { type: 'AutomationSkills', id: `${skillId}-tree` },
          { type: 'AutomationSkills', id: skillId },
        ],
      }),
    }),
  });

export const {
  useGetSkillsQuery,
  useCreateSkillMutation,
  useImportSkillZipMutation,
  useRefreshSkillsMutation,
  useGetSkillByIdQuery,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useGetSkillTreeQuery,
  useCreateSkillNodeMutation,
  useUpdateSkillNodeMutation,
  useDeleteSkillNodeMutation,
} = skillsApi;
