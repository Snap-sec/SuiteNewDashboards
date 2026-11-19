import React, { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  useGetAimAssetsQuery,
  useSetAimAssetsRelationshipMutation,
} from '@/services/asset-inventory/assets/assetsApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as UISelect,
} from '@/components/ui/select';
import Select from '@/components/custom/select';
import { assetRelationSchema } from './schemas/asset-relation-schema';

const AssetRelationModal = ({
  className,
  initialAssociatedAssets,
  assetId,
}) => {
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const form = useForm({
    resolver: zodResolver(assetRelationSchema),
    defaultValues: {
      relationName: '',
      relationType: 'child',
      assetValue: '',
    },
  });

  const { reset, handleSubmit, control } = form;

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: assets, isLoading: assetsLoading } = useGetAimAssetsQuery(
    {
      page: 1,
      limit: 10,
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    },
    {
      skip: !show,
    },
  );

  const [setRelationship] = useSetAimAssetsRelationshipMutation();

  const availableAssets = useMemo(() => {
    if (!assets?.assets) return [];

    const allAssets = assets.assets.map((asset) => ({
      label: `${asset.value} (${asset.type})`,
      value: asset._id, // Store _id
      type: asset.type,
    }));

    const selectedIds = new Set([
      assetId,
      ...(initialAssociatedAssets || []).map(
        (ass) => ass.child?._id || ass.parent?._id || ass._id,
      ),
    ]);

    return allAssets.filter((asset) => !selectedIds.has(asset.value));
  }, [assets, initialAssociatedAssets, assetId]);

  const onSubmitBase = async (values) => {
    // Find the selected asset from availableAssets by ID (value field)
    const selected = availableAssets.find((a) => a.value === values.assetValue);
    if (!selected) return;

    // Logic:
    // - If relationType is parent: selected is parent, current asset is child
    // - If relationType is child: current asset is parent, selected is child
    const payload = {
      relation: values.relationName,
      parentId: values.relationType === 'parent' ? selected.value : assetId,
      childId: values.relationType === 'child' ? selected.value : assetId,
    };

    setIsUpdating(true);
    try {
      toast.promise(setRelationship(payload).unwrap(), {
        loading: 'Adding relation...',
        success: 'Relation added successfully',
        error: (err) => err?.data?.message || 'Failed to add relation',
      });

      reset({
        relationName: values.relationName, // Keep name for convenience
        relationType: values.relationType,
        assetValue: '',
      });
      return true;
    } catch (error) {
      console.error('Failed to add relation:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    reset();
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <Plus className="size-3.5 mr-1" />
          Add Relation
        </Button>
      </DialogTrigger>
      <DialogContent className={`max-w-2xl ${className}`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add ASSET RELATION
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmitBase)} className="space-y-6 p-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={control}
                name="relationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Relation Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Depends On, Part Of"
                        {...field}
                        className="h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="relationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Relation Type <span className="text-destructive">*</span>
                    </FormLabel>
                    <UISelect
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                      </SelectContent>
                    </UISelect>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="assetValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Select Asset <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        placeholder="Search and select an asset..."
                        searchPlaceholder="Search assets by name or value..."
                        emptyMessage={
                          assetsLoading
                            ? 'Loading assets...'
                            : 'No assets found'
                        }
                        options={availableAssets}
                        value={field.value}
                        onChange={(option) => field.onChange(option?.value)}
                        onSearchChange={setSearchTerm}
                        searchField="label"
                        enableSearch={true}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <ButtonWithConfirm
                  variant="outline"
                  type="button"
                  className="w-full"
                  disabled={isUpdating}
                  confirm={true}
                  onConfirm={handleSubmit(onSubmitBase)}
                  confirmTitle="Add Relation"
                  dialog="Are you sure you want to add this asset relation?"
                >
                  <Plus className="size-3.5 mr-1" /> Add Relation
                </ButtonWithConfirm>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AssetRelationModal;
