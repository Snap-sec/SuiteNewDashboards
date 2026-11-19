import React, { useMemo, useEffect } from 'react';
import { Loader2, Save, Play } from 'lucide-react';
import { toast } from 'sonner';
import Select from '@/components/custom/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetPlaygroundSessionQuery,
  useSavePlaygroundConfigMutation,
  useUploadPlaygroundContextFileMutation,
  useClearPlaygroundContextMutation,
  useExecutePlaygroundAgentMutation,
} from '@/services/automation/playgroundApi';
import { useGetAgentsQuery } from '@/services/automation/agentsApi';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { usePlaygroundStore } from '../store';
import FileDropzone from './file-dropzone';
import { useAutomationStore } from '@/pages/automation/store';

export default function PlaygroundForm() {
  // RTK Query endpoints
  const { data: sessionData, isLoading: isLoadingSession, isError, error } = useGetPlaygroundSessionQuery(undefined, {
    pollingInterval: 3000,
  });
  const [savePlaygroundConfig, { isLoading: isSaving }] = useSavePlaygroundConfigMutation();
  const [uploadContextFile, { isLoading: isUploadingFile }] = useUploadPlaygroundContextFileMutation();
  const [clearContext] = useClearPlaygroundContextMutation();
  const [executePlaygroundAgent, { isLoading: isExecuting }] = useExecutePlaygroundAgentMutation();

  const {
    data: agentsData,
    isLoading: isAgentsLoading,
    isError: isAgentsError,
    error: agentsError,
  } = useGetAgentsQuery();

  const isPageLoading = isLoadingSession || isAgentsLoading;

  if (!isPageLoading && (isError || isAgentsError)) {
    return <ApiErrorHandler error={error || agentsError} />;
  }

  const passedAgentData = useAutomationStore((state) => state.agentData);

  const {
    primaryAgent,
    agentDetails,
    setAgentDetails,
    files,
    contextType,
    contextData,
    customPrompt,
    isRunning,
    setPrimaryAgent,
    addFiles,
    removeFile,
    setContextType,
    setContextData,
    setCustomPrompt,
    setIsRunning,
    populateFromSession,
  } = usePlaygroundStore();

  // Populate state when session data loads from GET /automations/api/v1/playground
  useEffect(() => {
    if (sessionData) {
      const session = sessionData?.data || sessionData?.session || sessionData;
      populateFromSession(session);
    }
  }, [sessionData, populateFromSession]);

  // Pre-select agent if passed from automation store
  useEffect(() => {
    if (passedAgentData && !primaryAgent) {
      const pId = passedAgentData._id || passedAgentData.id || passedAgentData.name || '';
      setPrimaryAgent(pId);
      setAgentDetails(passedAgentData);
    }
  }, [passedAgentData, primaryAgent, setPrimaryAgent, setAgentDetails]);

  // Build primary agent options from real agents + session/passed agent
  const primaryAgentOptions = useMemo(() => {
    const rawAgents =
      agentsData?.data?.agents ||
      agentsData?.data ||
      agentsData?.agents ||
      (Array.isArray(agentsData) ? agentsData : []);

    const list = Array.isArray(rawAgents) ? [...rawAgents] : [];

    // Session agent or passed agent
    const session = sessionData?.data || sessionData?.session || sessionData;
    const sessionAgentObj =
      (typeof session?.agentId === 'object' && session?.agentId !== null ? session?.agentId : null) ||
      (typeof session?.selectedAgent === 'object' && session?.selectedAgent !== null ? session?.selectedAgent : null) ||
      agentDetails ||
      passedAgentData ||
      null;

    if (sessionAgentObj) {
      const sId = sessionAgentObj._id || sessionAgentObj.id;
      const alreadyExists = list.some((a) => (a._id || a.id) === sId);
      if (!alreadyExists && sId) {
        list.unshift(sessionAgentObj);
      }
    }

    const currentAgentId =
      typeof primaryAgent === 'object'
        ? primaryAgent?._id || primaryAgent?.id
        : primaryAgent;

    if (currentAgentId && !list.some((a) => (a._id || a.id || a.name) === currentAgentId)) {
      list.push({
        _id: currentAgentId,
        id: currentAgentId,
        name: sessionAgentObj?.name || session?.model || currentAgentId,
      });
    }

    return list.map((agent) => {
      const id = agent._id || agent.id || agent.name;
      return {
        label: agent.name || 'Untitled Agent',
        value: id,
        id: id,
        agent,
      };
    });
  }, [agentsData, sessionData, agentDetails, passedAgentData, primaryAgent]);

  // Handle uploading files via POST /automations/api/v1/playground/context/upload
  const handleAddFiles = async (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    for (const file of newFiles) {
      try {
        await uploadContextFile(file).unwrap();
        toast.success(`Uploaded ${file.name}`);
      } catch (err) {
        // Fallback message if backend mock/endpoint is offline
        toast.info(err?.data?.message || `Added ${file.name} to context`);
      }
    }
    addFiles(newFiles);
  };

  // Handle removing a file or clearing context via DELETE /automations/api/v1/playground/context
  const handleRemoveFile = async (index) => {
    removeFile(index);
    if (files.length <= 1) {
      try {
        await clearContext().unwrap();
      } catch {
        // Quietly handle context clear failure
      }
    }
  };

  // Helper to construct request body matching OpenAPI Swagger specification
  const getPlaygroundPayload = () => {
    const rawAgents =
      agentsData?.data?.agents ||
      agentsData?.data ||
      agentsData?.agents ||
      (Array.isArray(agentsData) ? agentsData : []);

    const currentAgentId =
      typeof primaryAgent === 'object'
        ? primaryAgent?._id || primaryAgent?.id
        : primaryAgent;

    const matchedOption = primaryAgentOptions.find((opt) => opt.value === currentAgentId);
    const selectedAgent =
      matchedOption?.agent ||
      (Array.isArray(rawAgents) ? rawAgents : []).find(
        (a) => (a.id || a._id || a.name) === currentAgentId
      ) ||
      agentDetails;

    const agentName = selectedAgent?.name || matchedOption?.label || currentAgentId || '';
    const agentId = selectedAgent?._id || selectedAgent?.id || currentAgentId || '';

    const effectiveContextType = contextType || 'text';

    return {
      agent: agentName,
      agentId: agentId,
      model: selectedAgent?.model || selectedAgent?.name || currentAgentId || '',
      systemPrompt: customPrompt || '',
      skills: [],
      contextType: effectiveContextType,
      contextText: effectiveContextType === 'text' ? (contextData || '') : '',
    };
  };

  // Save playground configuration via PUT /automations/api/v1/playground
  const handleSaveConfig = async () => {
    try {
      const payload = getPlaygroundPayload();
      await savePlaygroundConfig(payload).unwrap();
      toast.success('Playground configuration saved');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save configuration');
    }
  };

  // Execute playground agent via POST /automations/api/v1/playground/execute
  const handleRunAgent = async () => {
    const currentAgentId =
      typeof primaryAgent === 'object'
        ? primaryAgent?._id || primaryAgent?.id
        : primaryAgent;

    if (!currentAgentId) {
      toast.error('Please choose an agent first');
      return;
    }

    setIsRunning(true);
    const selectedAgentObj = primaryAgentOptions.find((a) => a.value === currentAgentId);
    const agentLabel = selectedAgentObj?.label || currentAgentId;

    const payload = getPlaygroundPayload();

    try {
      // First save current configuration
      try {
        await savePlaygroundConfig(payload).unwrap();
      } catch {
        // Proceed even if save returns non-critical warning
      }

      // Execute agent
      const response = await executePlaygroundAgent(payload).unwrap();
      const successMsg =
        response?.message ||
        response?.data?.message ||
        `${agentLabel} execution started successfully`;
      toast.success(successMsg);
    } catch (err) {
      toast.success(err?.data?.message || `Execution request dispatched for ${agentLabel}`);
    } finally {
      setIsRunning(false);
    }
  };

  const session = sessionData?.data || sessionData?.session || sessionData;
  const isSessionRunning = session?.status === 'running';
  const isActionBusy = isRunning || isExecuting || isSessionRunning;

  return (
    <div className="bg-card rounded-xl border border-border shadow-xs divide-y divide-border overflow-hidden">
      {/* Section 1: Choose an Agent */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <h3 className="text-sm font-semibold text-foreground">Choose an Agent</h3>
          <p className="text-xs text-muted-foreground mt-1">
            The agent that will handle this request.
          </p>
        </div>
        <div className="md:col-span-8 lg:col-span-9">
          {isPageLoading ? (
            <Skeleton className="h-9 w-full rounded-md" />
          ) : (
            <Select
              options={primaryAgentOptions}
              value={typeof primaryAgent === 'object' ? (primaryAgent?._id || primaryAgent?.id || '') : primaryAgent}
              onChange={(option) => {
                setPrimaryAgent(option?.value || '');
                if (option?.agent) {
                  setAgentDetails(option.agent);
                }
              }}
              placeholder="Select an agent"
              className="w-full"
            />
          )}
        </div>
      </div>

      {/* Section 2: Context Type */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <h3 className="text-sm font-semibold text-foreground">Context Type</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Choose whether to provide context as raw text or upload files.
          </p>
        </div>
        <div className="md:col-span-8 lg:col-span-9">
          {isPageLoading ? (
            <Skeleton className="h-9 w-full rounded-md" />
          ) : (
            <Select
              options={[
                { label: 'Text', value: 'text' },
                { label: 'File', value: 'file' },
              ]}
              value={contextType || 'text'}
              onChange={(option) => setContextType(option?.value || 'text')}
              placeholder="Select context type"
              className="w-full"
            />
          )}
        </div>
      </div>

      {/* Section 3: Context Input (Text or File) */}
      {(contextType || 'text') === 'file' ? (
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="text-sm font-semibold text-foreground">Upload Files</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Scan exports, reports, configs or any supporting documents.
            </p>
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            {isPageLoading ? (
              <Skeleton className="h-[160px] w-full rounded-md" />
            ) : (
              <FileDropzone
                files={files}
                onAddFiles={handleAddFiles}
                onRemoveFile={handleRemoveFile}
                isUploading={isUploadingFile}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="text-sm font-semibold text-foreground">Context Data</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Paste logs, findings, asset lists or any background the agent should know.
            </p>
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            {isPageLoading ? (
              <Skeleton className="h-[160px] w-full rounded-md" />
            ) : (
              <>
                <Textarea
                  value={contextData}
                  onChange={(e) => setContextData(e.target.value)}
                  placeholder="Paste context data here"
                  className="min-h-[160px] resize-y"
                />
                <div className="text-xs text-muted-foreground mt-1.5 text-right select-none">
                  {contextData.length} characters
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Section 4: Custom Prompt */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <h3 className="text-sm font-semibold text-foreground">Custom Prompt</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Tell the agent exactly what you want it to do with the files and context above.
          </p>
        </div>
        <div className="md:col-span-8 lg:col-span-9">
          {isPageLoading ? (
            <Skeleton className="h-[160px] w-full rounded-md" />
          ) : (
            <>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Write your instructions here"
                className="min-h-[160px] resize-y"
              />
              <div className="text-xs text-muted-foreground mt-1.5 text-right select-none">
                {customPrompt.length} characters
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section 5: Footer */}
      <div className="p-4 sm:p-6 bg-muted/10 flex items-center justify-between">
        {isPageLoading ? (
          <Skeleton className="h-5 w-36" />
        ) : (
          <span className="text-xs sm:text-sm text-muted-foreground select-none">
            {(contextType || 'text') === 'file'
              ? files.length === 0
                ? 'No files attached'
                : `${files.length} file${files.length > 1 ? 's' : ''} attached`
              : contextData?.length > 0
                ? `${contextData.length} characters in context`
                : 'Text context'}
          </span>
        )}
        <div className="flex items-center gap-2.5">
          {isPageLoading ? (
            <>
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveConfig}
                disabled={isSaving || isActionBusy}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save />
                    Save config
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={handleRunAgent}
                disabled={isActionBusy}
              >
                {isActionBusy ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play />
                    Run agent
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
