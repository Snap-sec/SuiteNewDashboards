import { memo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { makeRule, makeGroup } from '../utils.jsx';
import { LogicToggle } from './LogicToggle';
import { RuleRow } from './RuleRow';

export const GroupNode = memo(function GroupNode({ group, onUpdate, onRemove, depth, isOnly, schemaList, operatorsMap }) {
  const updateChild = useCallback(
    (id, updated) => {
      onUpdate({
        ...group,
        children: group.children.map((c) => (c.id === id ? updated : c)),
      });
    },
    [group, onUpdate],
  );

  const removeChild = useCallback(
    (id) => {
      const next = group.children.filter((c) => c.id !== id);
      onUpdate({ ...group, children: next.length ? next : [makeRule()] });
    },
    [group, onUpdate],
  );

  const addRule = useCallback(() =>
    onUpdate({ ...group, children: [...group.children, makeRule()] }), [group, onUpdate]);

  const addGroup = useCallback(() =>
    onUpdate({ ...group, children: [...group.children, makeGroup('AND')] }), [group, onUpdate]);

  const childRules = group.children.filter((c) => c.type === 'rule');
  const isOnlyRule = childRules.length <= 1;

  const handleLogicOp = useCallback((op) => onUpdate({ ...group, logicOp: op }), [group, onUpdate]);

  return (
    <div className={cn(
      "relative space-y-4",
      depth > 0 && "ml-4 pl-4 border-l border-border/60"
    )}>
      {/* Group Header */}
      <div className="flex items-center justify-between py-2 group/header">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">
            Level {depth}
          </span>
          <LogicToggle
            value={group.logicOp}
            onChange={handleLogicOp}
          />
        </div>
        <div className="flex items-center gap-2 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={addRule}
            className="h-7 text-[10px] font-bold uppercase tracking-wider hover:bg-primary/10 hover:text-primary"
          >
            <Plus className="size-3 mr-1.5" />
            Add Rule
          </Button>
          {depth < 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={addGroup}
              className="h-7 text-[10px] font-bold uppercase tracking-wider hover:bg-primary/10 hover:text-primary"
            >
              <Plus className="size-3 mr-1.5" />
              Add Group
            </Button>
          )}
          {!isOnly && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-7 text-[10px] font-bold uppercase tracking-wider text-destructive hover:bg-destructive/10"
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Children List */}
      <div className="flex flex-col gap-4">
        {group.children.map((child, idx) => (
          <div key={child.id} className="relative">
            {child.type === 'rule' ? (
              <RuleRow
                rule={child}
                onUpdate={(updated) => updateChild(child.id, updated)}
                onRemove={() => removeChild(child.id)}
                isOnly={isOnlyRule && group.children.length === 1}
                schemaList={schemaList}
                operatorsMap={operatorsMap}
              />
            ) : (
              <GroupNode
                group={child}
                onUpdate={(updated) => updateChild(child.id, updated)}
                onRemove={() => removeChild(child.id)}
                depth={depth + 1}
                isOnly={false}
                schemaList={schemaList}
                operatorsMap={operatorsMap}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
