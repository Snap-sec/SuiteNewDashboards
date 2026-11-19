import React from 'react';
import { Database, BrainCircuit, Zap, Radio, Wrench, Box, CheckCircle, Flag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap = {
  context: { icon: Database, iconClass: 'text-violet-400', bgClass: 'bg-violet-400/10' },
  model: { icon: BrainCircuit, iconClass: 'text-blue-400', bgClass: 'bg-blue-400/10' },
  action: { icon: Zap, iconClass: 'text-amber-400', bgClass: 'bg-amber-400/10' },
  event_source: { icon: Radio, iconClass: 'text-emerald-400', bgClass: 'bg-emerald-400/10' },
  tool: { icon: Wrench, iconClass: 'text-rose-400', bgClass: 'bg-rose-400/10' },
  validator: { icon: CheckCircle, iconClass: 'text-cyan-400', bgClass: 'bg-cyan-400/10' },
  end: { icon: Flag, iconClass: 'text-red-400', bgClass: 'bg-red-400/10' },
};

const defaultIconConfig = { icon: Box, iconClass: 'text-cyan-400', bgClass: 'bg-cyan-400/10' };

function extractNodeTypes(nodeDefinitions) {
  if (!nodeDefinitions) return null;
  if (Array.isArray(nodeDefinitions)) return nodeDefinitions;
  if (Array.isArray(nodeDefinitions?.data?.nodeTypes)) return nodeDefinitions.data.nodeTypes;
  if (Array.isArray(nodeDefinitions?.data?.data?.nodeTypes)) return nodeDefinitions.data.data.nodeTypes;
  if (Array.isArray(nodeDefinitions?.nodeTypes)) return nodeDefinitions.nodeTypes;
  if (Array.isArray(nodeDefinitions?.data)) return nodeDefinitions.data;
  return null;
}

export default function NodeSidebar({ nodeDefinitions, isLoading }) {
  const nodeTypes = React.useMemo(() => {
    const list = extractNodeTypes(nodeDefinitions);
    if (Array.isArray(list) && list.length > 0) {
      return list.map((item) => {
        const typeKey = (item.type || item.name || '').toLowerCase();
        const iconConfig = iconMap[typeKey] || defaultIconConfig;
        return {
          type: typeKey,
          label: item.label || item.name || typeKey,
          icon: iconConfig.icon,
          iconClass: iconConfig.iconClass,
          bgClass: iconConfig.bgClass,
          description: item.description || '',
          category: item.category || '',
        };
      });
    }
    return [];
  }, [nodeDefinitions]);

  const onDragStart = (event, type) => {
    event.dataTransfer.setData('application/reactflow-type', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-[200px] min-w-[200px] border-r border-border flex flex-col gap-1.5 p-3.5 select-none bg-background">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Add Node</p>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-full rounded-md" />
          ))}
        </div>
      ) : (
        nodeTypes.map(({ type, label, icon: Icon, iconClass, bgClass }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-border bg-card cursor-grab active:cursor-grabbing hover:bg-accent transition-colors"
          >
            <div className={`p-1.5 rounded-md ${bgClass || 'bg-muted/50'}`}>
              <Icon size={14} className={`${iconClass || 'text-muted-foreground'} shrink-0`} strokeWidth={2} />
            </div>
            <span className="text-sm font-medium truncate">{label}</span>
          </div>
        ))
      )}
    </aside>
  );
}
