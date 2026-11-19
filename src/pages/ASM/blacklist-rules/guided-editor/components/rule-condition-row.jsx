import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import CustomSelect from '@/components/custom/select';

const OPERATOR_LABELS = {
  equals: 'Equals',
  notEquals: 'Not Equals',
  contains: 'Contains',
  notContains: 'Not Contains',
  greaterThan: 'Greater Than',
  lessThan: 'Less Than',
  greaterThanOrEqual: 'Greater Than Or Equal',
  lessThanOrEqual: 'Less Than Or Equal',
  in: 'In',
  notIn: 'Not In',
  regex: 'Regex Match',
  exists: 'Exists',
  notExists: 'Does Not Exist',
  '==': 'Equals',
  '!=': 'Not Equals',
};

export const RuleConditionRow = ({
  control,
  namePrefix,
  schema,
  onRemove,
  currentKey,
  formSetValue,
  watch,
}) => {
  const keys = schema?.keys || [];
  const operators = schema?.operators || [
    'equals',
    'notEquals',
    'contains',
    'notContains',
    'greaterThan',
    'lessThan',
    'greaterThanOrEqual',
    'lessThanOrEqual',
    'in',
    'notIn',
    'regex',
    'exists',
    'notExists',
  ];

  const fieldSchema = keys.find((f) => f.value === currentKey);
  const currentOperator = watch ? watch(`${namePrefix}.operator`) : '';
  const isUnaryOperator = currentOperator === 'exists' || currentOperator === 'notExists';

  return (
    <div className="p-4 border border-border/60 rounded-lg bg-card/40 flex flex-col md:flex-row items-start md:items-end gap-3 group">
      {/* Key Selection */}
      <div className="w-full md:w-1/3">
        <FormField
          control={control}
          name={`${namePrefix}.key`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-0.5 mb-1.5">
                Field <span className="text-destructive">*</span>
              </FormLabel>
              <CustomSelect
                options={keys}
                value={field.value}
                onChange={(selected) => {
                  field.onChange(selected ? selected.value : '');
                  formSetValue(`${namePrefix}.value`, '');
                }}
                placeholder="Select field..."
                searchPlaceholder="Search fields..."
                className="h-9"
              />
            </FormItem>
          )}
        />
      </div>

      {/* Operator Selection */}
      <div className="w-full md:w-1/4">
        <FormField
          control={control}
          name={`${namePrefix}.operator`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-0.5 mb-1.5">
                Operator <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="h-9 font-normal">
                    <SelectValue placeholder="Select operator..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60">
                  {operators.map((op) => (
                    <SelectItem key={op} value={op}>
                      {OPERATOR_LABELS[op] || op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      {/* Value Input / Enum / Boolean Select */}
      <div className="w-full flex-1">
        <FormField
          control={control}
          name={`${namePrefix}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-0.5 mb-1.5">
                Value <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                {isUnaryOperator ? (
                  <Input
                    disabled
                    value=""
                    placeholder="N/A (unary operator)"
                    className="h-9 bg-muted text-muted-foreground"
                  />
                ) : fieldSchema?.type === 'boolean' ? (
                  <Select
                    onValueChange={(val) => field.onChange(val === 'true')}
                    defaultValue={String(field.value)}
                    value={field.value !== undefined ? String(field.value) : ''}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select boolean..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">true</SelectItem>
                      <SelectItem value="false">false</SelectItem>
                    </SelectContent>
                  </Select>
                ) : fieldSchema?.type === 'enum' && fieldSchema?.options?.length ? (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select value..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {fieldSchema.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    {...field}
                    type={fieldSchema?.type === 'number' ? 'number' : 'text'}
                    placeholder="Select value"
                    className="h-9"
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Remove Condition */}
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={onRemove}
        className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 self-end mb-[2px]"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default RuleConditionRow;

