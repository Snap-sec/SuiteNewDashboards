import { memo, useCallback, useMemo } from 'react';
import {
  Trash2,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Select from '@/components/custom/select';
import { cn } from '@/lib/utils';
import { OPERATORS_DISPLAY_MAP, NO_VALUE_OPS, getFieldIcon } from '../utils.jsx';

export const RuleRow = memo(function RuleRow({ rule, onUpdate, onRemove, isOnly, schemaList, operatorsMap }) {
  const schema = schemaList?.find((s) => s.field === rule.field);
  const ops = schema && operatorsMap ? operatorsMap[schema.type] : [];
  const noVal = NO_VALUE_OPS.has(rule.operator);
  const isBetween = rule.operator === 'is_between';
  const isOneOf =
    rule.operator === 'is_one_of' || rule.operator === 'is_not_one_of';
  
  // Ensure values are strings for UI components (Select/Input)
  const displayValue = typeof rule.value === 'boolean' ? String(rule.value) : (rule.value ?? '');
  const displayValueTo = typeof rule.valueTo === 'boolean' ? String(rule.valueTo) : (rule.valueTo ?? '');

  const handleField = useCallback((f) => {
    const sch = schemaList?.find((s) => s.field === f);
    const firstOp = (sch && operatorsMap) ? operatorsMap[sch.type][0] : '';
    onUpdate({ ...rule, field: f, operator: firstOp, value: '', valueTo: '' });
  }, [rule, onUpdate, schemaList, operatorsMap]);

  const schemaOptions = useMemo(() => schemaList?.map((s) => ({
    label: s.label || s.field,
    value: s.field,
    searchLabel: s.label || s.field,
  })), [schemaList]);

  const operatorOptions = useMemo(() => ops?.map((op) => ({
    label: OPERATORS_DISPLAY_MAP[op] || op,
    value: op,
  })), [ops]);

  const enumOptions = useMemo(() => (schema?.options || []).map((o) => {
    const s = typeof o === 'boolean' ? String(o) : o;
    return {
      label: s,
      value: s,
    };
  }), [schema?.options]);

  return (
    <div className="group/row flex items-center gap-3 py-2 transition-all relative overflow-x-auto overflow-y-hidden whitespace-nowrap">

      {/* Field Selection */}
      <Select
        value={rule.field}
        options={schemaOptions}
        onChange={(opt) => handleField(opt.value)}
        placeholder="Select field..."
        searchPlaceholder="Search field..."
        searchField="searchLabel"
        className="w-[250px] h-9 text-xs"
      />

      {/* Operator Selection */}
      <Select
        value={rule.operator}
        options={operatorOptions}
        onChange={(opt) => onUpdate({ ...rule, operator: opt.value, value: '', valueTo: '' })}
        placeholder="Condition..."
        enableSearch={ops?.length > 10}
        className="w-[160px] h-9 text-xs"
      />

      {/* Value Input */}
      {!noVal && (
        <div className="flex items-center gap-2 flex-1">
          {schema?.type === 'enum' && !isOneOf ? (
            <Select
              value={displayValue}
              options={enumOptions}
              onChange={(opt) => {
                const val = opt.value;
                const numericVal = (schema?.type === 'number' && typeof val === 'string' && val !== '') ? Number(val) : val;
                onUpdate({ ...rule, value: numericVal });
              }}
              placeholder="Choose value..."
              enableSearch={schema.options.length > 10}
              className="flex-1 h-9 text-xs"
            />
          ) : schema?.type === 'enum' && isOneOf ? (
            <div className="flex flex-wrap gap-1.5 p-1 border border-border rounded-md bg-muted/20 min-h-[36px] flex-1">
              {schema.options.map((o) => {
                const s = typeof o === 'boolean' ? String(o) : o;
                const isChecked = (displayValue || '').split(',').filter(Boolean).includes(s);
                return (
                  <Badge
                    key={s}
                    variant={isChecked ? "primary" : "outline"}
                    className={cn(
                      "cursor-pointer text-[10px] py-0 px-2 h-6 flex items-center gap-1 transition-all",
                      !isChecked && "text-muted-foreground opacity-60 hover:opacity-100"
                    )}
                    onClick={() => {
                      const cur = (displayValue || '').split(',').filter(Boolean);
                      const next = isChecked ? cur.filter(x => x !== s) : [...cur, s];
                      onUpdate({ ...rule, value: next.join(',') });
                    }}
                  >
                    {isChecked ? <CheckCircle2 className="size-3" /> : <Circle className="size-3 opacity-30" />}
                    {s}
                  </Badge>
                );
              })}
            </div>
          ) : schema?.type === 'boolean' ? null : (
            <div className="flex items-center gap-2 flex-1">
              <Input
                className="h-9 text-xs"
                type={schema?.type === 'number' ? 'number' : schema?.type === 'date' ? 'date' : 'text'}
                placeholder={isBetween ? 'From...' : 'Enter value...'}
                value={displayValue}
                onChange={(e) => {
                  const val = e.target.value;
                  const numericVal = (schema?.type === 'number' && val !== '') ? Number(val) : val;
                  onUpdate({ ...rule, value: numericVal });
                }}
              />
              {isBetween && (
                <>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground px-1">And</span>
                  <Input
                    className="h-9 text-xs"
                    type={schema?.type === 'number' ? 'number' : 'date'}
                    placeholder="To..."
                    value={displayValueTo}
                    onChange={(e) => {
                      const val = e.target.value;
                      const numericVal = (schema?.type === 'number' && val !== '') ? Number(val) : val;
                      onUpdate({ ...rule, valueTo: numericVal });
                    }}
                  />
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
        onClick={onRemove}
        disabled={isOnly}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
});
