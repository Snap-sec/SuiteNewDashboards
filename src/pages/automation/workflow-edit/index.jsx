import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  BackgroundVariant,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './components/CustomNode';
import NodeSidebar from './components/NodeSidebar';
import NodeConfigPanel from './components/NodeConfigPanel';
import { Save, Trash2, Pencil, Loader2, Eraser, ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  useCreateWorkflowMutation,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
  useExecuteWorkflowMutation,
  useGetNodeDefinitionsQuery,
  useGetWorkflowByIdQuery,
} from '@/services/automation/workflowsApi';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { toast } from 'sonner';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { useAutomationStore } from '@/pages/automation/store';
import { useGetAutomationAgentByIdQuery } from '@/services/automation/agentsApi';

const nodeTypes = { custom: CustomNode };

let nodeIdCounter = 10;

function extractNodeTypes(nodeDefinitions) {
  if (!nodeDefinitions) return [];
  if (Array.isArray(nodeDefinitions)) return nodeDefinitions;
  if (Array.isArray(nodeDefinitions?.data?.nodeTypes)) return nodeDefinitions.data.nodeTypes;
  if (Array.isArray(nodeDefinitions?.data?.data?.nodeTypes)) return nodeDefinitions.data.data.nodeTypes;
  if (Array.isArray(nodeDefinitions?.nodeTypes)) return nodeDefinitions.nodeTypes;
  if (Array.isArray(nodeDefinitions?.data)) return nodeDefinitions.data;
  return [];
}

const sanitizeNodes = (rawNodes) => {
  if (!Array.isArray(rawNodes) || rawNodes.length === 0) return [];
  return rawNodes.map((n, index) => {
    const { width, height, measured, style, data, ...rest } = n;
    // Increase spacing from 220 to 350 so nodes don't overlap if positions are missing
    const posX = n.position?.x ?? (index * 350 + 80);
    const posY = n.position?.y ?? 180;

    // Ensure data object exists for CustomNode to render properly
    // If the API flattens the node properties or puts them in config, we construct the data object
    const nodeData = data || {
      type: n.type,
      label: n.config?.label || n.config?.name || n.name || n.label || n.title,
      description: n.config?.description || n.description,
      ...rest
    };

    return {
      ...rest,
      id: n.id || `node-${index}`,
      type: 'custom',
      position: { x: posX, y: posY },
      style: { ...(style || {}) },
      data: nodeData,
    };
  });
};

// Inner canvas component inside ReactFlowProvider
function FlowCanvas({
  nodes,
  setNodes,
  edges,
  setEdges,
  onNodesChange,
  onEdgesChange,
  rfWrapperRef,
  nodeDefinitions,
  onSelectNode,
  isViewOnly = false,
}) {
  const { screenToFlowPosition, fitView } = useReactFlow();

  const nodeTypeDefsMap = React.useMemo(() => {
    const list = extractNodeTypes(nodeDefinitions);
    const map = {};
    list.forEach((item) => {
      const typeKey = (item.type || item.name || '').toLowerCase();
      map[typeKey] = {
        label: item.label || item.name || typeKey,
        description: item.category || item.description || '',
        type: typeKey,
      };
    });
    return map;
  }, [nodeDefinitions]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: { stroke: 'var(--muted-foreground)', strokeWidth: 1.5 },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow-type');
      if (!type) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const nodeInfo = nodeTypeDefsMap[type] || {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        description: '',
        type,
      };

      const newId = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setNodes((nds) =>
        nds.concat({
          id: newId,
          type: 'custom',
          position,
          data: nodeInfo,
        }),
      );
      // Removed automatic selection so the config panel doesn't pop open immediately
    },
    [screenToFlowPosition, setNodes, nodeTypeDefsMap],
  );

  const hasFittedRef = useRef(false);

  useEffect(() => {
    if (nodes.length > 0 && !hasFittedRef.current) {
      hasFittedRef.current = true;
      const timer = setTimeout(() => {
        fitView({ padding: 0.2, minZoom: 0.8, maxZoom: 1 });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [nodes.length, fitView]);

  return (
    <div ref={rfWrapperRef} className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={(event, node) => onSelectNode(node.id)}
        onPaneClick={() => onSelectNode(null)}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, minZoom: 0.8, maxZoom: 1 }}
        minZoom={0.3}
        maxZoom={2}
        deleteKeyCode={isViewOnly ? null : "Delete"}
        nodesDraggable={!isViewOnly}
        nodesConnectable={!isViewOnly}
        elementsSelectable={!isViewOnly}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1}
          color="var(--border)"
        />
        <Controls showInteractive={false} className="bg-card border-border shadow-md rounded-md fill-foreground" />
      </ReactFlow>
    </div>
  );
}

// Workflow Editor Main Component
export default function WorkflowEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isViewOnly = searchParams.get('status') === 'view';
  const passedAgentData = useAutomationStore((state) => state.agentData);

  const reactFlowWrapper = useRef(null);
  const isSavingRef = useRef(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowName, setWorkflowName] = useState('Undefined Workflow');
  const [isEditingName, setIsEditingName] = useState(false);
  const [activeWorkflowId, setActiveWorkflowId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const { data: nodeDefinitions, isLoading: isLoadingNodeDefs } = useGetNodeDefinitionsQuery();
  
  const { data: fetchedAgentData, isLoading: isLoadingAgent, isError: isAgentError, error: agentError } = useGetAutomationAgentByIdQuery(id, {
    skip: !id || id === 'new' || !isViewOnly || !!passedAgentData
  });

  const [isWorkflowActive, setIsWorkflowActive] = useState(false);

  const { data: workflowData, isLoading: isLoadingWorkflow, isError, error } = useGetWorkflowByIdQuery(id, {
    skip: !id || id === 'new' || isViewOnly,
    pollingInterval: isWorkflowActive ? 4000 : 0,
  });
  const [createWorkflow, { isLoading: isCreating }] = useCreateWorkflowMutation();
  const [updateWorkflow, { isLoading: isUpdating }] = useUpdateWorkflowMutation();
  const [deleteWorkflow, { isLoading: isDeleting }] = useDeleteWorkflowMutation();
  const [executeWorkflow, { isLoading: isExecuting }] = useExecuteWorkflowMutation();

  useEffect(() => {
    const status = (workflowData?.data?.data || workflowData?.data?.workflow || workflowData?.data || workflowData)?.latestRun?.status;
    setIsWorkflowActive(['pending', 'running'].includes(status));
  }, [workflowData]);

  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    const effectiveAgentData = passedAgentData || (fetchedAgentData?.data?.data || fetchedAgentData?.data?.agent || fetchedAgentData?.data || fetchedAgentData);

    if (isViewOnly && effectiveAgentData) {
      setActiveWorkflowId(effectiveAgentData.id || effectiveAgentData._id);
      setWorkflowName(effectiveAgentData.name || effectiveAgentData.title || 'Untitled Workflow');
      setNodes(sanitizeNodes(effectiveAgentData.nodes || []));
      setEdges(Array.isArray(effectiveAgentData.edges) ? effectiveAgentData.edges : []);
    } else if (id && id !== 'new' && workflowData && !isViewOnly) {
      console.log('Fetched workflow data:', workflowData);

      // API returns a nested { data: { data: { _id, name... } } } structure sometimes
      const wf = workflowData?.data?.data || workflowData?.data?.workflow || workflowData?.data || workflowData;

      setActiveWorkflowId(wf?.id || wf?._id);
      setWorkflowName(wf?.name || 'Untitled Workflow');
      setNodes(sanitizeNodes(wf?.nodes || []));
      setEdges(Array.isArray(wf?.edges) ? wf.edges : []);
    } else if (!id || id === 'new') {
      setActiveWorkflowId(null);
      setWorkflowName('Undefined Workflow');
      setNodes([]);
      setEdges([]);
    }
    setSelectedNodeId(null);
  }, [id, workflowData, passedAgentData, fetchedAgentData, isViewOnly, setNodes, setEdges]);

  const selectedNode = React.useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const handleUpdateNodeData = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: newData,
            };
          }
          return node;
        }),
      );
    },
    [setNodes],
  );

  const handleDeleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      setSelectedNodeId(null);
    },
    [setNodes, setEdges],
  );

  const handleDeleteCurrentWorkflow = async () => {
    if (!activeWorkflowId) {
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
      setWorkflowName('Undefined Workflow');
      toast.success('Workflow cleared');
      return;
    }

    try {
      await deleteWorkflow(activeWorkflowId).unwrap();
      setActiveWorkflowId(null);
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
      setWorkflowName('Undefined Workflow');
      toast.success('Workflow deleted successfully');
      navigate('/automation/workflows');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete workflow');
    }
  };

  const handleExecuteCurrentWorkflow = async () => {
    if (!activeWorkflowId) {
      toast.error('Please save the workflow first before executing');
      return;
    }

    try {
      await executeWorkflow(activeWorkflowId).unwrap();
      toast.success('Workflow execution scheduled successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to execute workflow');
    }
  };

  const handleSave = async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    const payloadNodes = nodes.map((node) => ({
      ...node,
      type: node.data?.type || node.type,
    }));

    const payload = {
      name: workflowName || 'Undefined Workflow',
      description: 'Automates CVE response',
      status: 'draft',
      nodes: payloadNodes,
      edges,
      raw: { nodes: payloadNodes, edges },
    };

    try {
      if (activeWorkflowId) {
        await updateWorkflow({ workflowId: activeWorkflowId, ...payload }).unwrap();
        toast.success('Workflow updated successfully');
      } else {
        await createWorkflow(payload).unwrap();
        toast.success('Workflow created successfully');
        navigate('/ai-agent-builder/workflows');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save workflow');
    } finally {
      isSavingRef.current = false;
    }
  };

  if (isError && !isViewOnly) {
    return <ApiErrorHandler error={error} />;
  }

  if (isAgentError && isViewOnly) {
    return <ApiErrorHandler error={agentError} />;
  }

  return (
    <div className="flex flex-col h-[90vh] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background shrink-0">
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <Input
              autoFocus
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingName(false);
                  if (nodes.length > 0) {
                    handleSave();
                  }
                }
              }}
              className="h-7 text-sm font-medium w-56"
            />
          ) : (
            <button
              onClick={() => !isViewOnly && setIsEditingName(true)}
              className="flex items-center gap-1.5 text-sm font-medium hover:text-muted-foreground transition-colors group"
            >
              {workflowName}
              {!isViewOnly && <Pencil size={11} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isViewOnly && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setNodes([]);
                  setEdges([]);
                  setSelectedNodeId(null);
                }}
              >
                <Eraser size={12} />
                Clear
              </Button>
              <ButtonWithConfirm
                confirm={true}
                confirmVariant="destructive"
                confirmTitle="Delete Workflow"
                dialog={`Are you sure you want to delete "${workflowName || 'this workflow'}"? This action cannot be undone.`}
                onConfirm={handleDeleteCurrentWorkflow}
                disabled={!activeWorkflowId || isDeleting}
                variant="outline"
                className="gap-1.5 text-muted-foreground hover:text-destructive h-8 text-xs"
              >
                {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                Delete
              </ButtonWithConfirm>
              <Button
                variant="outline"
                className="gap-1.5 h-8 text-xs"
                onClick={handleExecuteCurrentWorkflow}
                disabled={!activeWorkflowId || isExecuting || isWorkflowActive}
              >
                {isExecuting || isWorkflowActive ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                {isWorkflowActive ? 'Running' : 'Execute'}
              </Button>
            </>
          )}
          {!isViewOnly && (
            <Button
              variant="outline"
              className="gap-1.5 h-8 text-xs"
              onClick={handleSave}
              disabled={isSaving || nodes.length === 0}
            >
              {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {activeWorkflowId ? 'Update' : 'Create'}
            </Button>
          )}
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex flex-1 overflow-hidden">
        {!isViewOnly && <NodeSidebar nodeDefinitions={nodeDefinitions} isLoading={isLoadingNodeDefs} />}

        {isLoadingWorkflow || isLoadingAgent ? (
          <div className="flex-1 relative flex items-center justify-center p-8 bg-dot-black/[0.2] dark:bg-dot-white/[0.2]">
            <div className="flex items-center gap-12 opacity-50 absolute pointer-events-none">
              <Skeleton className="w-[150px] h-[40px] rounded-xl shadow-sm border border-border" />
              <div className="w-[150px] h-[2px] bg-muted-foreground/30 rounded" />
              <Skeleton className="w-[150px] h-[40px] rounded-xl shadow-sm border border-border" />
              <div className="w-[150px] h-[2px] bg-muted-foreground/30 rounded" />
              <Skeleton className="w-[150px] h-[40px] rounded-xl shadow-sm border border-border" />
            </div>
          </div>
        ) : (
          <ReactFlowProvider>
            <FlowCanvas
              nodes={nodes}
              setNodes={setNodes}
              edges={edges}
              setEdges={setEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              rfWrapperRef={reactFlowWrapper}
              nodeDefinitions={nodeDefinitions}
              onSelectNode={setSelectedNodeId}
              isViewOnly={isViewOnly}
            />
          </ReactFlowProvider>
        )}

        {!isViewOnly && (
          <NodeConfigPanel
            nodes={nodes}
            selectedNode={selectedNode}
            onClose={() => setSelectedNodeId(null)}
            onUpdateNodeData={handleUpdateNodeData}
            onDeleteNode={handleDeleteNode}
            nodeDefinitions={nodeDefinitions}
          />
        )}
      </div>
    </div>
  );
}
