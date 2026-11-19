import React from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Select from '@/components/custom/select';
import NodeConditionBuilder from './NodeConditionBuilder';
import { useGetWorkflowSchemaQuery } from '@/services/automation/workflowsApi';

function extractNodeTypes(nodeDefinitions) {
  if (!nodeDefinitions) return [];
  if (Array.isArray(nodeDefinitions)) return nodeDefinitions;
  if (Array.isArray(nodeDefinitions?.data?.nodeTypes)) return nodeDefinitions.data.nodeTypes;
  if (Array.isArray(nodeDefinitions?.data?.data?.nodeTypes)) return nodeDefinitions.data.data.nodeTypes;
  if (Array.isArray(nodeDefinitions?.nodeTypes)) return nodeDefinitions.nodeTypes;
  if (Array.isArray(nodeDefinitions?.data)) return nodeDefinitions.data;
  return [];
}

function SchemaBuilder({ value, onChange, isNested = false }) {
  const schema = Array.isArray(value) ? value : [];

  const handleAddField = () => {
    onChange([...schema, { key: '', type: 'string' }]);
  };

  const handleUpdateField = (index, key, val) => {
    const newSchema = [...schema];
    newSchema[index] = { ...newSchema[index], [key]: val };

    // Initialize subSchema when switching to object or array if not exists
    if (key === 'type' && (val === 'object' || val === 'array') && !newSchema[index].subSchema) {
      newSchema[index].subSchema = [];
    }

    onChange(newSchema);
  };

  const handleRemoveField = (index) => {
    const newSchema = [...schema];
    newSchema.splice(index, 1);
    onChange(newSchema);
  };

  return (
    <div className={`space-y-3 ${isNested ? 'mt-2 pl-4 border-l-2 border-primary/20' : 'mt-4 pt-4 border-t border-border'}`}>
      {!isNested && <Label className="text-xs font-semibold text-foreground">Output Schema</Label>}
      <div className="space-y-2">
        {schema.map((item, index) => (
          <div key={index} className={`flex flex-col gap-2 p-2 border border-border/60 rounded-md ${isNested ? 'bg-background/50' : 'bg-card/40'}`}>
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Field Name"
                    value={item.key || ''}
                    onChange={(e) => handleUpdateField(index, 'key', e.target.value)}
                    className="h-8 text-xs flex-1"
                  />
                  <Select
                    value={item.type || 'string'}
                    options={[
                      { label: 'String', value: 'string' },
                      { label: 'Number', value: 'number' },
                      { label: 'Boolean', value: 'boolean' },
                      { label: 'Array', value: 'array' },
                      { label: 'Object', value: 'object' }
                    ]}
                    onChange={(opt) => handleUpdateField(index, 'type', opt?.value)}
                    className="h-8 text-xs w-[110px]"
                    enableSearch={false}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveField(index)}
              >
                <Trash2 size={14} />
              </Button>
            </div>

            {(item.type === 'object' || item.type === 'array') && (
              <SchemaBuilder
                value={item.subSchema}
                onChange={(newSubSchema) => handleUpdateField(index, 'subSchema', newSubSchema)}
                isNested={true}
              />
            )}
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full h-8 text-xs border-dashed text-muted-foreground hover:text-foreground"
        onClick={handleAddField}
      >
        <Plus size={14} className="mr-1.5" /> Add {isNested ? 'Nested Field' : 'Schema Field'}
      </Button>
    </div>
  );
}

export default function NodeConfigPanel({
  nodes = [],
  selectedNode,
  onClose,
  onUpdateNodeData,
  onDeleteNode,
  nodeDefinitions,
}) {
  if (!selectedNode) return null;

  const type = selectedNode.data?.type || 'context';
  const nodeDefsList = extractNodeTypes(nodeDefinitions);
  const matchingTypeDef = nodeDefsList.find(
    (def) => (def.type || def.name || '').toLowerCase() === type.toLowerCase(),
  );

  const baseFields = matchingTypeDef?.configFields || [
    { name: 'label', label: 'Display Label', type: 'string', required: true },
    { name: 'description', label: 'Description', type: 'string', required: false },
  ];

  const hiddenContextFieldLabels = [
    'Database Connection String or Name',
    'Collection Name',
    'Keys to Fetch',
    'Limit'
  ];

  const hiddenActionFieldLabels = [
    'Keys and Values to Update',
    'Match Keys'
  ];

  let configFields = type.toLowerCase() === 'context'
    ? baseFields.filter(field => !hiddenContextFieldLabels.includes(field.label))
    : type.toLowerCase() === 'action'
      ? baseFields.filter(field => !hiddenActionFieldLabels.includes(field.label))
      : baseFields;

  configFields = configFields.filter(field =>
    field.name !== 'description' &&
    field.label !== 'Description' &&
    field.label !== 'Output Schema' &&
    field.name !== 'outputSchema'
  );

  if (type.toLowerCase() === 'end') {
    const outputFormatField = baseFields.find(f => f.label === 'Output Format');
    const outputFormatValue = outputFormatField
      ? (selectedNode.data?.[outputFormatField.name] ?? outputFormatField.default)
      : null;

    if (String(outputFormatValue || '').toUpperCase() !== 'JSON') {
      configFields = configFields.filter(field => !field.label?.includes('JSON Schema'));
    }
  }

  const handleFieldChange = (fieldName, value) => {
    onUpdateNodeData(selectedNode.id, {
      ...selectedNode.data,
      [fieldName]: value,
    });
  };

  // Condition Builder Logic
  const isContextOrAction = type.toLowerCase() === 'context' || type.toLowerCase() === 'action';

  // The selected resource comes from the Source Type dropdown
  const resource = selectedNode.data?.resource || selectedNode.data?.sourceType || selectedNode.data?.source || selectedNode.data?.entity;

  const showConditionBuilder = isContextOrAction && !!resource;

  const { data: schemaData, isLoading: isLoadingSchema } = useGetWorkflowSchemaQuery(resource, {
    skip: !showConditionBuilder,
  });

  const availableVariables = React.useMemo(() => {
    const vars = [];
    nodes.forEach(n => {
      if (n.id !== selectedNode.id && n.data?.type?.toLowerCase() === 'model' && n.data.outputSchema) {
        const extractKeys = (schemaArr, prefix = '') => {
          schemaArr.forEach(s => {
            if (s.key) {
              const fullKey = prefix ? `${prefix}.${s.key}` : s.key;
              vars.push({ label: fullKey, value: `$.${fullKey}` });
              if (s.subSchema && s.subSchema.length) {
                extractKeys(s.subSchema, fullKey);
              }
            }
          });
        };
        extractKeys(n.data.outputSchema);
      }
    });
    return vars;
  }, [nodes, selectedNode.id]);

  return (
    <aside className="w-[480px] min-w-[480px]  border-l border-border bg-background flex flex-col h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <h3 className="text-sm font-semibold text-foreground truncate">
          {matchingTypeDef?.label || selectedNode.data?.label || 'Node Configuration'}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X size={14} />
        </Button>
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {configFields.map((field) => {
          const value = selectedNode.data?.[field.name] ?? field.default ?? '';

          const selectOptions = (field.options || []).map((opt) => ({
            label: typeof opt === 'object' ? opt.label || opt.name : String(opt),
            value: typeof opt === 'object' ? opt.value || opt.id : String(opt),
          }));

          return (
            <div key={field.name} className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                {field.label}
                {field.required && <span className="text-destructive ml-0.5">*</span>}
              </Label>

              {field.options && field.options.length > 0 ? (
                <Select
                  value={value}
                  options={selectOptions}
                  placeholder={`Select ${field.label}`}
                  onChange={(selectedOption) =>
                    handleFieldChange(field.name, selectedOption?.value || '')
                  }
                  enableSearch={false}
                  className="h-8 text-xs"
                />
              ) : field.type === 'number' ? (
                <Input
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.min !== undefined && field.max !== undefined && field.max <= 2 ? '0.1' : '1'}
                  value={value}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="h-8 text-xs"
                />
              ) : field.type === 'object' || field.name === 'systemPrompt' || field.name === 'config' || field.name === 'urlOrQuery' || field.name === 'description' || field.name?.toLowerCase().includes('schema') || field.label?.toLowerCase().includes('schema') ? (
                <textarea
                  rows={10}
                  value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (field.type === 'object') {
                      try {
                        handleFieldChange(field.name, JSON.parse(val));
                      } catch {
                        handleFieldChange(field.name, val);
                      }
                    } else {
                      handleFieldChange(field.name, val);
                    }
                  }}
                  className="flex w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                  placeholder={`Enter ${field.label}...`}
                />
              ) : (
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className="h-8 text-xs"
                />
              )}
            </div>
          );
        })}

        {/* Condition Builder for Action / Context nodes */}
        {isContextOrAction && (
          <div className="pt-2">
            {!resource ? (
              <div className="text-xs text-muted-foreground p-3 border border-dashed border-border/50 rounded-md bg-muted/20 text-center">
                Please select a Source Type to build conditions.
              </div>
            ) : isLoadingSchema ? (
              <div className="text-xs text-muted-foreground animate-pulse py-2">
                Loading schema for {resource}...
              </div>
            ) : schemaData ? (
              <NodeConditionBuilder
                schema={schemaData}
                value={selectedNode.data?.conditions}
                onChange={(conditions) => handleFieldChange('conditions', conditions)}
                availableVariables={availableVariables}
              />
            ) : (
              <div className="text-xs text-destructive p-3 border border-dashed border-destructive/30 rounded-md bg-destructive/10 text-center">
                Failed to load schema for {resource}.
              </div>
            )}
          </div>
        )}

        {/* Field Mapping for Action Node */}
        {type.toLowerCase() === 'action' && (
          <NodeConditionBuilder
            title="Set Fields"
            schema={schemaData}
            value={selectedNode.data?.updatePayload}
            onChange={(updatePayload) => handleFieldChange('updatePayload', updatePayload)}
            isUpdateMode={true}
            availableVariables={availableVariables}
          />
        )}

        {/* Schema Builder for AI Model Node */}
        {type.toLowerCase() === 'model' && (
          <SchemaBuilder
            value={selectedNode.data?.outputSchema}
            onChange={(outputSchema) => handleFieldChange('outputSchema', outputSchema)}
          />
        )}

        {/* Delete node action */}
        <div className="pt-4 border-t border-border mt-6">
          <Button
            variant="outline"
            className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive h-8 text-xs gap-1.5"
            onClick={() => onDeleteNode(selectedNode.id)}
          >
            <Trash2 size={12} />
            Delete node
          </Button>
        </div>
      </div>
    </aside>
  );
}
