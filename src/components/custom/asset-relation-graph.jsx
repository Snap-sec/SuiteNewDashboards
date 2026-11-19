import React, { useCallback, useState } from 'react';
import {
  addEdge,
  Background,
  BaseEdge,
  Controls,
  getBezierPath,
  Handle,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import {
  Activity,
  ArrowRight,
  Box,
  CircleEllipsis,
  Code2,
  Container,
  Cpu,
  Database,
  ExternalLink,
  Factory,
  FileBadge2,
  GitFork,
  Globe,
  Layers,
  LayoutPanelLeft,
  Lock,
  MapPin,
  Monitor,
  Server,
  Users,
  X,
} from 'lucide-react';
import '@xyflow/react/dist/style.css';
import { Link } from 'react-router';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import VulnerabilitiesBadges from './vulnerabilities-badges';

const isDarkTheme =
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const ASSET_TYPE_CONFIG = {
  subdomain: {
    label: 'SUBDOMAIN',
    icon: Globe,
  },
  workstation: {
    label: 'WORKSTATION',
    icon: Monitor,
  },
  ip: {
    label: 'IP ADDRESS',
    icon: MapPin,
  },
  dns: {
    label: 'DNS RECORDS',
    icon: LayoutPanelLeft,
  },
  certificate: {
    label: 'CERTIFICATES',
    icon: FileBadge2,
  },
  employee: {
    label: 'EMPLOYEES',
    icon: Users,
  },
  port: {
    label: 'PORT',
    icon: Activity,
  },
  api: {
    label: 'API',
    icon: Code2,
  },
  endpoint: {
    label: 'ENDPOINT',
    icon: ArrowRight,
  },
  application: {
    label: 'APPLICATIONS',
    icon: Server,
  },
  repository: {
    label: 'REPOSITORY',
    icon: GitFork,
  },
  repo: {
    label: 'REPOSITORY',
    icon: GitFork,
  },
  registry: {
    label: 'REGISTRY',
    icon: Database,
  },
  technology: {
    label: 'TECHNOLOGY',
    icon: Cpu,
  },
  object_storage: {
    label: 'OBJECT STORAGE',
    icon: Container,
  },
  compartment: {
    label: 'COMPARTMENT',
    icon: Box,
  },
  vendor: {
    label: 'VENDOR',
    icon: Factory,
  },
  other: {
    label: 'OTHER',
    icon: CircleEllipsis,
  },
  server: {
    label: 'SERVER',
    icon: Server,
  },
  iam_role: {
    label: 'IAM ROLE',
    icon: Lock,
  },
  database: {
    label: 'DATABASE',
    icon: Database,
  },
};

// Custom nodes
const TailwindNode = ({ data }) => {
  const type = data?.type?.toLowerCase() || 'subdomain';
  const config = ASSET_TYPE_CONFIG[type] || ASSET_TYPE_CONFIG.subdomain;
  const Icon = config.icon;
  const isHorizontal = data?.layout === 'horizontal';

  return (
    <div
      className={`relative flex flex-col p-3.5 min-w-[200px] rounded-xl border border-border group transition-all duration-300 bg-accent overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-lg bg-background border border-border transition-colors`}
          >
            <Icon className={`h-4 w-4 text-foreground`} />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-[10px] font-black tracking-[0.15em] uppercase text-muted-foreground`}
            >
              {config.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full bg-border`} />
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <div
          className="text-[14px] font-mono font-bold text-foreground truncate pr-6 leading-tight"
          title={data?.value}
        >
          {data?.value}
        </div>

        {/* display vuln component */}
        {data?.original?.vulnerabilityStats && (
          <div className="border-t border-border/50 pt-2">
            <VulnerabilitiesBadges
              vulnerabilities={data?.original?.vulnerabilityStats}
            />
          </div>
        )}

        {data?.original?.id && data?.original?.showDetails !== false && (
          <Link
            to={`/caim/asset-edit/${data?.original?.id}?asset=${data?.original?.type}`}
            className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-wider"
          >
            View Details <ExternalLink className="h-2.5 w-2.5" />
          </Link>
        )}
      </div>

      <Handle
        type="target"
        position={isHorizontal ? Position.Left : Position.Top}
        className={`w-3 h-3 border-2 border-background bg-border ${isHorizontal ? '!-left-1.5' : '!-top-1.5'}`}
      />
      <Handle
        type="source"
        position={isHorizontal ? Position.Right : Position.Bottom}
        className={`w-3 h-3 border-2 border-background bg-border ${isHorizontal ? '!-right-1.5' : '!-bottom-1.5'}`}
      />
    </div>
  );
};

const StyledEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label }) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.5,
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        fill="none"
        stroke="var(--border)"
        strokeWidth={1.5}
        strokeOpacity={0.8}
      />
      {label && (
        <foreignObject
          x={labelX - 35}
          y={labelY - 10}
          width={70}
          height={20}
          style={{ overflow: 'visible' }}
        >
          <div className="flex items-center justify-center w-full h-full pointer-events-none">
            <div className="bg-card border border-border rounded-full px-2 py-0.5 shadow-2xl backdrop-blur-md">
              <p className="text-[7px] font-black text-muted-foreground pointer-events-none uppercase tracking-[0.2em]">
                {label}
              </p>
            </div>
          </div>
        </foreignObject>
      )}
    </>
  );
};

const nodeTypes = {
  tailwind: TailwindNode,
};

const edgeTypes = {
  styled: StyledEdge,
};

const flattenTree = (
  data,
  x = 0,
  y = 0,
  level = 0,
  siblings = 1,
  index = 0,
  parentId = null,
  nodes = [],
  edges = [],
  layout = 'vertical',
) => {
  // Calculate position
  const horizontalSpacing = 300; // Increased for larger nodes
  const verticalSpacing = 200; // Increased for larger nodes
  const nodeId = data._id || (parentId ? `${parentId}-${index}` : 'parent');
  const node = {
    id: nodeId,
    type: 'tailwind',
    position: { x, y },
    data: {
      value: data.value || data.name || 'Unknown',
      type: data.type || 'Unknown',
      original: data,
      layout,
    },
  };
  nodes.push(node);
  if (parentId) {
    edges.push({
      id: `edge-${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      type: 'styled',
      label: data.relation || '',
    });
  }
  // Handle children
  const relationsData =
    data.relations || data.realtions || data.associatedAssets;
  const children = relationsData
    ? (Array.isArray(relationsData) ? relationsData : [relationsData]).map(
        (rel) => {
          // If it's a relation object with a child property
          if (rel.child) {
            return {
              ...rel.child,
              relation: rel.relation,
              _id: rel._id,
              id: rel.child?.id || rel.child?._id || rel._id,
            };
          }
          // If it's already an asset object (like in associatedAssets)
          return rel;
        },
      )
    : [];

  if (children.length > 0) {
    if (layout === 'horizontal') {
      // Flow children to the right horizontally
      const totalHeight = (children.length - 1) * verticalSpacing;
      children.forEach((child, i) => {
        const childX = x + horizontalSpacing;
        const childY = y - totalHeight / 2 + i * verticalSpacing;
        flattenTree(
          child,
          childX,
          childY,
          level + 1,
          children.length,
          i,
          nodeId,
          nodes,
          edges,
          layout,
        );
        // Ensure the edge label is set from the child's relation property
        const currentEdge = edges[edges.length - 1];
        if (currentEdge) {
          currentEdge.label = child.relation || '';
          currentEdge.type = 'styled';
        }
      });
    } else {
      // Center children horizontally under this node (vertical flow)
      const totalWidth = (children.length - 1) * horizontalSpacing;
      children.forEach((child, i) => {
        const childX = x - totalWidth / 2 + i * horizontalSpacing;
        const childY = y + verticalSpacing;
        flattenTree(
          child,
          childX,
          childY,
          level + 1,
          children.length,
          i,
          nodeId,
          nodes,
          edges,
          layout,
        );
        // Ensure the edge label is set from the child's relation property
        const currentEdge = edges[edges.length - 1];
        if (currentEdge) {
          currentEdge.label = child.relation || '';
          currentEdge.type = 'styled';
        }
      });
    }
  }
  return { nodes, edges };
};

function AssetRelationGraph({ data, height, layout = 'vertical' }) {
  // Flatten the tree and generate nodes/edges
  const { nodes: transformedNodes, edges: transformedEdges } =
    React.useMemo(() => {
      if (!data) return { nodes: [], edges: [] };
      return flattenTree(data, 0, 0, 0, 1, 0, null, [], [], layout);
    }, [data, layout]);

  const [nodes, setNodes, onNodesChange] = useNodesState(transformedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(transformedEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Update nodes and edges when data changes
  React.useEffect(() => {
    setNodes(transformedNodes);
    setEdges(transformedEdges);
  }, [transformedNodes, transformedEdges]);

  // Fullscreen modal state
  const [fullscreen, setFullscreen] = useState(false);

  // The graph content to render (to avoid code duplication)
  const GraphContent = (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      minZoom={0.2}
      maxZoom={2}
      defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      style={{ backgroundColor: 'transparent', width: '100%', height: '100%' }}
      proOptions={{ hideAttribution: true }} // Hides the React Flow Attribution
    >
      <Controls
        // className="bg-accent border-border fill-foreground [&>button]:border-border"
        className="!bg-card !border-border fill-foreground [&>button]:!bg-card [&>button]:!border-border"
        showInteractive={false}
      />
      <Background variant="dots" gap={20} size={1} color="var(--border)" />
    </ReactFlow>
  );

  return (
    <div
      style={{
        height: height || '100%',
        width: '100%',
        backgroundColor: 'transparent',
        position: 'relative',
      }}
    >
      {GraphContent}
      {/* Floating fullscreen icon */}
      <button
        onClick={() => setFullscreen(true)}
        className="absolute bottom-4 right-4 bg-background border border-border rounded-full w-10 h-10 shadow-sm flex items-center justify-center cursor-pointer z-10 hover:bg-accent transition-colors"
        aria-label="Fullscreen"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground"
        >
          <path d="m15 3 6 6" />
          <path d="M9 21 3 15" />
          <path d="M21 3v6h-6" />
          <path d="M3 21v-6h6" />
        </svg>
      </button>
      {/* Fullscreen Modal using RE UI Dialog */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-[80vw] h-[80vh] p-0 flex flex-col">
          <div className="w-full h-full min-h-0">{GraphContent}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { AssetRelationGraph };
