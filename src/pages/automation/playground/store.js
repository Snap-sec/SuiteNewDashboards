import { create } from 'zustand';

export const usePlaygroundStore = create((set) => ({
  primaryAgent: '',
  agentDetails: null,
  selectedSkills: [],
  files: [],
  contextType: 'text',
  contextData: '',
  customPrompt: '',
  isRunning: false,
  isSaving: false,
  isUploading: false,
  isSessionLoaded: false,

  setPrimaryAgent: (agentId) => set({ primaryAgent: agentId }),
  setAgentDetails: (details) => set({ agentDetails: details }),
  setSelectedSkills: (skills) =>
    set({
      selectedSkills: Array.isArray(skills) ? skills : skills ? [skills] : [],
    }),
  setFiles: (updater) =>
    set((state) => ({
      files: typeof updater === 'function' ? updater(state.files) : updater,
    })),
  addFiles: (newFiles) =>
    set((state) => ({
      files: [...state.files, ...newFiles],
    })),
  removeFile: (index) =>
    set((state) => ({
      files: state.files.filter((_, i) => i !== index),
    })),
  clearFiles: () => set({ files: [] }),
  setContextType: (type) => set({ contextType: type }),
  setContextData: (data) => set({ contextData: data }),
  setCustomPrompt: (prompt) => set({ customPrompt: prompt }),
  setIsRunning: (running) => set({ isRunning: running }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setIsUploading: (uploading) => set({ isUploading: uploading }),
  setIsSessionLoaded: (loaded) => set({ isSessionLoaded: loaded }),

  populateFromSession: (session) => {
    if (!session) return;
    const rawFiles =
      session.contextFile ||
      session.contextFiles ||
      session.files ||
      session.artifacts;

    const parsedFiles = rawFiles
      ? (Array.isArray(rawFiles) ? rawFiles : [rawFiles])
        .filter(Boolean)
        .map((f) => ({
          name: f.originalName || f.name || f.filename || 'Context File',
          size: f.sizeBytes || f.size || 0,
          type: f.mimeType || f.type || '',
          ...f,
        }))
      : [];

    const agentObj =
      (typeof session.agentId === 'object' && session.agentId !== null ? session.agentId : null) ||
      (typeof session.selectedAgent === 'object' && session.selectedAgent !== null ? session.selectedAgent : null) ||
      (typeof session.agent === 'object' && session.agent !== null ? session.agent : null);

    const agentIdValue =
      agentObj?._id ||
      agentObj?.id ||
      (typeof session.agentId === 'string' ? session.agentId : null) ||
      (typeof session.agent === 'string' ? session.agent : null) ||
      agentObj?.name ||
      session.model ||
      '';

    set((state) => ({
      primaryAgent: agentIdValue || state.primaryAgent,
      agentDetails: agentObj || state.agentDetails,
      selectedSkills: Array.isArray(session.skills)
        ? session.skills
        : session.skills
          ? [session.skills]
          : state.selectedSkills,
      customPrompt:
        session.systemprompt ||
        session.systemPrompt ||
        session.prompt ||
        state.customPrompt,
      contextType: session.contextType || session.context_type || state.contextType || 'text',
      contextData: session.contextText || session.context || state.contextData,
      files: parsedFiles,
      isSessionLoaded: true,
    }));
  },

  resetForm: () =>
    set({
      primaryAgent: '',
      agentDetails: null,
      selectedSkills: [],
      files: [],
      contextType: 'text',
      contextData: '',
      customPrompt: '',
      isRunning: false,
      isSaving: false,
      isUploading: false,
      isSessionLoaded: false,
    }),
}));
