import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database, BrainCircuit, Zap, Radio, Wrench, Box, CheckCircle, Flag } from 'lucide-react';

const iconMap = {
  context: Database,
  model: BrainCircuit,
  action: Zap,
  event_source: Radio,
  tool: Wrench,
  validator: CheckCircle,
  end: Flag,
};

const colorMap = {
  context: { border: 'border-t-purple-500', icon: 'bg-purple-500/20 text-purple-400' },
  model: { border: 'border-t-blue-500', icon: 'bg-blue-500/20 text-blue-400' },
  action: { border: 'border-t-amber-500', icon: 'bg-amber-500/20 text-amber-400' },
  event_source: { border: 'border-t-emerald-500', icon: 'bg-emerald-500/20 text-emerald-400' },
  tool: { border: 'border-t-rose-500', icon: 'bg-rose-500/20 text-rose-400' },
  validator: { border: 'border-t-cyan-500', icon: 'bg-cyan-500/20 text-cyan-400' },
  end: { border: 'border-t-red-500', icon: 'bg-red-500/20 text-red-400' },
};

function CustomNode({ data, selected }) {
  const typeKey = (data?.type || '').toLowerCase();
  const Icon = iconMap[typeKey] || Box;
  const colors = colorMap[typeKey] || { border: 'border-t-gray-500', icon: 'bg-gray-500/20 text-gray-400' };

  return (
    <div
      className={`
        relative rounded-xl border-x border-b border-t-4 border-border bg-card/95 backdrop-blur min-w-[200px] w-auto whitespace-nowrap
        flex flex-col text-left transition-all duration-150 shrink-0 select-none shadow-lg
        ${colors.border}
        ${selected ? 'ring-2 ring-primary/50 border-x-primary/50 border-b-primary/50' : 'hover:border-muted-foreground/30'}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-background !border-2 !border-muted-foreground/70 !-left-1.5 hover:!border-primary transition-colors"
      />

      <div className="p-3 flex items-center gap-3">
        <div className={`p-1.5 rounded-lg ${colors.icon} shrink-0`}>
          <Icon size={16} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground leading-tight">
            {data?.label || 'Node'}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground mt-0.5">
            {data?.description || 'Node Configuration'}
          </span>
        </div>
      </div>

      {typeKey === 'validator' ? (
        <div className="flex flex-col border-t border-border/40 bg-black/10 py-1.5 pb-2 rounded-b-xl gap-1">
          <div className="flex justify-end items-center relative h-5">
            <span className="text-[10px] font-medium text-muted-foreground mr-3">pass</span>
            <Handle
              type="source"
              position={Position.Right}
              id="pass"
              className="!w-2.5 !h-2.5 !bg-background !border-2 !border-emerald-500 !-right-1.5 !top-1/2 !transform !-translate-y-1/2"
            />
          </div>
          <div className="flex justify-end items-center relative h-5">
            <span className="text-[10px] font-medium text-muted-foreground mr-3">fail</span>
            <Handle
              type="source"
              position={Position.Right}
              id="fail"
              className="!w-2.5 !h-2.5 !bg-background !border-2 !border-rose-500 !-right-1.5 !top-1/2 !transform !-translate-y-1/2"
            />
          </div>
        </div>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-2.5 !h-2.5 !bg-background !border-2 !border-muted-foreground/70 !-right-1.5 hover:!border-primary transition-colors"
        />
      )}
    </div>
  );
}

export default React.memo(CustomNode);
