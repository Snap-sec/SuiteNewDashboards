import { useState } from 'react';
import { Tag, MoreHorizontal, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '@/components/common/empty-screen';
import {
  useGetAimTagsQuery,
  useDeleteAimTagMutation,
} from '@/services/asset-inventory/tagsApi';
import CreateTagModal from './modals/create-tag-modal';

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

const TagsSettings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAimTagsQuery();

  const [deleteAimTag, { isLoading: isDeleting }] = useDeleteAimTagMutation();

  const tags = extractTagsList(responseData);

  const handleOpenAdd = () => {
    setEditingTag(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tag) => {
    setEditingTag(tag);
    setIsModalOpen(true);
  };

  const handleDeleteTag = async (tagToDelete) => {
    try {
      const tagId = getTagId(tagToDelete);
      await deleteAimTag(tagId).unwrap();
      toast.success('Tag deleted successfully');
    } catch (err) {
      toast.error(
        err?.data?.message || err?.data?.error || err?.message || 'Failed to delete tag'
      );
    }
  };

  if (isError) {
    return <ApiErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <div className="space-y-6 py-4">
      {!isLoading && tags.length === 0 ? (
        <EmptyScreen
          title="No Tags Found"
          subTitle="Create tags to organize and filter your assets."
          engage={
            <Button variant="primary" className="h-9 mt-2" onClick={handleOpenAdd}>
              <Plus className="size-4 mr-2" />
              Add tag
            </Button>
          }
        />
      ) : (
        <div className="bg-background">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                Tags
              </h2>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5 flex-wrap">
                Tags help you group and filter assets in this project.
              </p>
            </div>
            <Button variant="primary" className="h-9" onClick={handleOpenAdd}>
              <Plus className="size-4 mr-2" />
              Add tag
            </Button>
          </div>

          {/* Tags List */}
          <div className="grid grid-cols-1 gap-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-16 w-full rounded-lg" />
              ))
            ) : (
              tags.map((tag) => {
                const id = getTagId(tag);
                const name = getTagName(tag);
                return (
                  <div
                    key={id || name}
                    className="border border-border rounded-lg p-4 flex items-center justify-between bg-muted/10 hover:bg-muted/20 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg border border-border bg-muted text-muted-foreground">
                        <Tag className="size-4 shrink-0" />
                      </div>
                      <span className="text-sm font-semibold tracking-wide text-foreground">
                        {name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[120px]">
                          <DropdownMenuItem onClick={() => handleOpenEdit(tag)}>
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <ButtonWithConfirm
                        confirm={true}
                        variant="ghost"
                        confirmVariant="destructive"
                        onConfirm={() => handleDeleteTag(tag)}
                        confirmTitle="Delete Tag"
                        dialog={`Are you sure you want to delete the tag "${name}"? This action cannot be undone.`}
                        confirmButton={<Button variant="destructive">Delete</Button>}
                        cancelButton={<Button variant="outline">Cancel</Button>}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-transparent"
                      >
                        <X className="size-4" />
                      </ButtonWithConfirm>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Tag Modal */}
      <CreateTagModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        editingTag={editingTag}
      />
    </div>
  );
};

export default TagsSettings;
