import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DrawerModal from '@/components/custom/drawer-modal';
import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGetAimCustomFieldsSchemaQuery, useCreateAimCustomFieldMutation, useUpdateAimCustomFieldMutation } from '@/services/asset-inventory/customFieldsApi';
import { toast } from 'sonner';
import { getDataTypeIcon } from '@/components/custom/data-type-badge';
import GetAssetTypeInfo from '@/components/custom/asset-icons';

export default function DefineFieldModal({ trigger, open, setOpen, initialData = null }) {
  const { data: schema, isLoading: isSchemaLoading } = useGetAimCustomFieldsSchemaQuery();
  const [createCustomField, { isLoading: isCreating }] = useCreateAimCustomFieldMutation();
  const [updateCustomField, { isLoading: isUpdating }] = useUpdateAimCustomFieldMutation();

  const isEditing = !!initialData;

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [dataType, setDataType] = useState('text');
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState('');

  // Reset form when opened
  useEffect(() => {
    if (open) {
      if (isEditing) {
        setName(initialData.name || '');
        setKey(initialData.key || '');
        setDescription(initialData.description || '');
        setDataType(initialData.type || 'text');
        setSelectedAssets(initialData.assetTypes || []);
        setIsRequired(initialData.required || false);
        setOptions(initialData.options || []);
      } else {
        setName('');
        setKey('');
        setDescription('');
        setDataType('text');
        setSelectedAssets([]);
        setIsRequired(false);
        setOptions([]);
      }
      setNewOption('');
    }
  }, [open, initialData, isEditing]);

  const toggleAsset = (assetId) => {
    setSelectedAssets(prev =>
      prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]
    );
  };

  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions([...options, trimmed]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (indexToRemove) => {
    setOptions(options.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async () => {
    if (!name || !key || !dataType) {
      toast.error('Name, Key, and Data Type are required.');
      return;
    }

    if (selectedAssets.length === 0) {
      toast.error('Please select at least one asset type under "Available on".');
      return;
    }

    if ((dataType === 'dropdown' || dataType === 'select' || dataType === 'multiselect') && options.length === 0) {
      toast.error('Please add at least one option for the dropdown/multi-select.');
      return;
    }

    try {
      if (isEditing) {
        await updateCustomField({
          id: initialData._id,
          name,
          key,
          type: dataType,
          assetTypes: selectedAssets,
          required: isRequired,
          description,
          options: (dataType === 'dropdown' || dataType === 'select' || dataType === 'multiselect') ? options : []
        }).unwrap();
        toast.success('Custom field updated successfully.');
      } else {
        await createCustomField({
          name,
          key,
          type: dataType,
          assetTypes: selectedAssets,
          required: isRequired,
          description,
          options: (dataType === 'dropdown' || dataType === 'select' || dataType === 'multiselect') ? options : []
        }).unwrap();
        toast.success('Custom field created successfully.');
      }
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} custom field.`);
    }
  };

  const footer = (
    <div className="flex justify-end gap-2 w-full">
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleSave} disabled={isCreating || isUpdating}>
        {isEditing ? 'Update field' : 'Create field'}
      </Button>
    </div>
  );

  return (
    <DrawerModal
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      title={
        <div className="flex flex-col gap-1 text-left">
          <span className="text-lg font-semibold">{isEditing ? 'Update field' : 'Define new field'}</span>
          <span className="text-sm font-normal text-muted-foreground">This field will appear on every selected asset type's detail page.</span>
        </div>
      }
      footer={footer}
      width="[550px]"
    >
      <div className="p-4 space-y-8 overflow-y-auto h-full hide-scrollbar pb-20 -mt-4">

        {/* Name and Key */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Field name</label>
            <Input
              placeholder="e.g. Data Center Location"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!isEditing) {
                  setKey(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''));
                }
              }}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Key</label>
              <Input
                className="h-7 text-xs max-w-[200px]"
                value={key}
                onChange={(e) => setKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, ''))}
              />
            </div>
            <p className="text-xs text-muted-foreground">Used when referencing this field via the API or import templates.</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Description <span className="text-muted-foreground font-normal">(optional)</span></label>
          <Textarea
            placeholder="Help teammates understand what to enter here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none min-h-[80px]"
          />
        </div>

        {/* Data Type */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Data type</label>
            <p className="text-xs text-muted-foreground">What kind of value should this field store?</p>
          </div>
          {isSchemaLoading ? (
            <p className="text-sm text-muted-foreground">Loading data types...</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {schema?.data_types?.map(type => {
                const Icon = getDataTypeIcon(type.id);
                return (
                  <div
                    key={type.id}
                    onClick={() => {
                      if (dataType !== type.id) {
                        setDataType(type.id);
                        setOptions([]);
                        setNewOption('');
                      }
                    }}
                    className={cn(
                      "border rounded-lg p-3 cursor-pointer transition-all flex items-start gap-3",
                      dataType === type.id ? "border-primary bg-primary/5 shadow-sm" : "hover:bg-muted/50"
                    )}
                  >
                    <Icon className={cn("size-4 mt-0.5 shrink-0", dataType === type.id ? "text-primary" : "text-muted-foreground")} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{type.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Options */}
        {(dataType === 'dropdown' || dataType === 'select' || dataType === 'multiselect') && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Options</label>
              <p className="text-xs text-muted-foreground">Define the choices users can pick from.</p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type an option and press Add"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddOption}>Add</Button>
            </div>
            {options.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {options.map((opt, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1 px-2.5 py-1 text-sm bg-muted/30">
                    {opt}
                    <X className="size-3 cursor-pointer hover:text-destructive" onClick={() => handleRemoveOption(idx)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Available on */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Available on</label>
            <p className="text-xs text-muted-foreground">Select every asset type that should show this field.</p>
          </div>
          {isSchemaLoading ? (
            <p className="text-sm text-muted-foreground">Loading asset types...</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {schema?.asset_types?.map(asset => {
                const isSelected = selectedAssets.includes(asset.id);
                const typeInfo = GetAssetTypeInfo(asset.id);
                return (
                  <label
                    key={asset.id}
                    className={cn(
                      "flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-colors",
                      isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleAsset(asset.id)}
                    />
                    <span className="text-muted-foreground ml-1">{typeInfo.icon}</span>
                    <span className="text-sm">{typeInfo.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Require a value */}
        <div className="flex items-center justify-between border rounded-lg p-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Require a value</span>
            <span className="text-xs text-muted-foreground">Asset owners must fill this in before saving the asset.</span>
          </div>
          <Switch checked={isRequired} onCheckedChange={setIsRequired} />
        </div>

      </div>
    </DrawerModal>
  );
}
