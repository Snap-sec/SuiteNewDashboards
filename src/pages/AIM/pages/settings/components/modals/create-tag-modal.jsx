import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useGetAimTagsQuery,
  useCreateAimTagMutation,
  useUpdateAimTagMutation,
} from '@/services/asset-inventory/tagsApi';

const extractTagsList = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.data?.tags)) return response.data.tags;
  if (Array.isArray(response.tags)) return response.tags;
  return [];
};

const getTagId = (tag) => {
  if (!tag) return '';
  if (typeof tag === 'string') return tag;
  return tag.id || tag._id || tag.tagId || tag.value || tag.name || '';
};

const getTagName = (tag) => {
  if (!tag) return '';
  if (typeof tag === 'string') return tag;
  return tag.value || tag.name || tag.label || tag.tagName || tag.tag || '';
};

export default function CreateTagModal({
  open,
  setOpen,
  editingTag = null,
  onSuccess,
}) {
  const [tagName, setTagName] = useState('');

  const { data: responseData } = useGetAimTagsQuery();
  const [createAimTag, { isLoading: isCreating }] = useCreateAimTagMutation();
  const [updateAimTag, { isLoading: isUpdating }] = useUpdateAimTagMutation();

  const tags = extractTagsList(responseData);

  useEffect(() => {
    if (open) {
      if (editingTag) {
        setTagName(getTagName(editingTag));
      } else {
        setTagName('');
      }
    }
  }, [open, editingTag]);

  const handleSave = async () => {
    const trimmed = tagName.trim();
    if (!trimmed) {
      toast.error('Tag name cannot be empty');
      return;
    }

    const currentNames = tags.map((t) => getTagName(t).toLowerCase());

    if (editingTag) {
      const currentEditingName = getTagName(editingTag).toLowerCase();
      if (
        trimmed.toLowerCase() !== currentEditingName &&
        currentNames.includes(trimmed.toLowerCase())
      ) {
        toast.error('Tag name already exists');
        return;
      }

      try {
        const res = await updateAimTag({
          id: getTagId(editingTag),
          value: trimmed,
        }).unwrap();
        toast.success('Tag updated successfully');
        setOpen(false);
        onSuccess?.(res, trimmed);
      } catch (err) {
        toast.error(
          err?.data?.message || err?.data?.error || err?.message || 'Failed to update tag'
        );
      }
    } else {
      if (currentNames.includes(trimmed.toLowerCase())) {
        toast.error('Tag name already exists');
        return;
      }

      try {
        const res = await createAimTag({ value: trimmed }).unwrap();
        toast.success('Tag added successfully');
        setOpen(false);
        onSuccess?.(res, trimmed);
      } catch (err) {
        toast.error(
          err?.data?.message || err?.data?.error || err?.message || 'Failed to add tag'
        );
      }
    }
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={editingTag ? 'Edit Tag' : 'Add Tag'}
      description={
        editingTag
          ? 'Change the name of the tag.'
          : 'Create a new tag to group and filter your assets.'
      }
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isCreating || isUpdating}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isCreating || isUpdating}
          >
            {(isCreating || isUpdating) && (
              <Loader2 className="size-4 animate-spin mr-2" />
            )}
            {editingTag ? 'Save Changes' : 'Add Tag'}
          </Button>
        </div>
      }
      className="sm:max-w-md"
    >
      <div className="space-y-4 py-2 text-left">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Tag name</label>
          <Input
            placeholder="e.g. Production, Critical, EDR"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSave();
              }
            }}
            disabled={isCreating || isUpdating}
            autoFocus
          />
        </div>
      </div>
    </Modal>
  );
}
