import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFieldArray } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import RuleConditionRow from './rule-condition-row';

export const ConditionGroup = ({
  control,
  name,
  schema,
  watch,
  setValue,
  isRoot = false,
  onRemove,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}.children`,
  });

  const defaultKey = schema?.keys?.[0]?.value || 'domain';

  const handleAddCondition = () => {
    append({
      type: 'condition',
      key: defaultKey,
      operator: 'equals',
      value: '',
      transformer: null,
    });
  };

  const handleAddGroup = () => {
    append({
      type: 'group',
      operator: 'AND',
      children: [
        {
          type: 'condition',
          key: defaultKey,
          operator: 'equals',
          value: '',
          transformer: null,
        },
      ],
    });
  };

  return (
    <div className={`space-y-4 ${!isRoot ? 'mt-4 pl-4 border-l-2 border-primary/30' : ''}`}>
      {/* Group Header: Segmented Operator Toggle on left, Add buttons on right */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <FormField
          control={control}
          name={`${name}.operator`}
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormControl>
                <div className="inline-flex items-center p-1 rounded-lg bg-secondary/80 border border-border/50 gap-1">
                  {['AND', 'OR', 'NOR'].map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => field.onChange(op)}
                      className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                        (field.value || 'AND').toUpperCase() === op
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleAddCondition}
            className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Condition
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleAddGroup}
            className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Group
          </Button>
          {!isRoot && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onRemove}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Children: Conditions and Sub-groups */}
      <div className="space-y-3">
        {fields.length === 0 && (
          <div className="text-center py-6 border border-dashed rounded-lg text-muted-foreground text-sm">
            No conditions in this group. Click '+ Add Condition' to start.
          </div>
        )}

        {fields.map((field, idx) => {
          const type = watch(`${name}.children.${idx}.type`);

          if (type === 'group') {
            return (
              <ConditionGroup
                key={field.id}
                control={control}
                name={`${name}.children.${idx}`}
                schema={schema}
                watch={watch}
                setValue={setValue}
                isRoot={false}
                onRemove={() => remove(idx)}
              />
            );
          }

          const currentKey = watch(`${name}.children.${idx}.key`);

          return (
            <RuleConditionRow
              key={field.id}
              control={control}
              namePrefix={`${name}.children.${idx}`}
              schema={schema}
              onRemove={() => remove(idx)}
              currentKey={currentKey}
              formSetValue={setValue}
              watch={watch}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ConditionGroup;

