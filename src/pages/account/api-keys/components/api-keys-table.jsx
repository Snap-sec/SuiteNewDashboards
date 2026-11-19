import { useState } from 'react';
import {
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteApiKeyMutation } from '@/services/auth/apiKeyApi';
import { useAuth } from '@/auth/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
import Table from '@/components/custom/table';
import { Profile } from '../../../../components/custom/profile';
import { CreateApiKeyModal } from './create-api-key-modal';
import { EmptyScreen } from '@/components/common/empty-screen';

const ApiKeyCell = ({ value }) => {
  if (!value)
    return (
      <span className="text-muted-foreground italic text-sm">
        Not generated
      </span>
    );

  return (
    <div className="flex items-start gap-2 group max-w-full">
      <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-mono text-muted-foreground border border-border/50 break-all whitespace-normal max-w-[300px] sm:max-w-[450px] lg:max-w-[600px]">
        {value}
      </code>
    </div>
  );
};

export const ApiKeysTable = ({ data, isLoading, onRotate }) => {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState(null);
  const [deleteApiKey] = useDeleteApiKeyMutation();

  const handleDelete = async () => {
    if (!deleteKeyId) return;
    try {
      await deleteApiKey(deleteKeyId).unwrap();
      toast.success('API key deleted successfully');
      setDeleteKeyId(null);
    } catch (error) {
      toast.error('Failed to delete API key');
    }
  };
  const tableData = Array.isArray(data)
    ? data.map((item) => ({
      id: item._id || item.id,
      name: item.name || 'Public API Key',
      apiKey: item.api_key || item.apiKey,
      createdBy: item.createdBy,
      lastUsed: item.updatedAt
        ? new Date(item.updatedAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        : 'Never',
      createdAt: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        : 'Never',
      permissions: item.permissions || 'Full Access',
      status:
        item.status === 1 || item.status === undefined ? 'Active' : 'Revoked',
    }))
    : [];

  const columns = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataGridColumnHeader title="Name" column={column} />
      ),
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">
          {row.original.name}
        </span>
      ),
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      accessorKey: 'apiKey',
      header: ({ column }) => (
        <DataGridColumnHeader title="API Key" column={column} />
      ),
      cell: ({ row }) => <ApiKeyCell value={row.original.apiKey} />,
      size: 300,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      accessorKey: 'createdBy',
      header: ({ column }) => (
        <DataGridColumnHeader title="Created By" column={column} />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row?.original?.createdBy ? (
            <Profile
              userId={row?.original?.createdBy?._id}
              name={`${row?.original?.createdBy?.firstName} ${row?.original?.createdBy?.lastName}`}
            />
          ) : (
            <Profile name={`System`} graphicsUserName="System" userId={null} />
          )}
        </span>
      ),
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataGridColumnHeader title="Created At" column={column} />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.createdAt}
        </span>
      ),
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataGridColumnHeader title="" column={column} />
      ),
      cell: ({ row }) => {
        const createdById = row.original.createdBy?._id || row.original.createdBy?.id || row.original.createdBy;
        const currentUserId = user?._id || user?.id || user?.userId;
        const isCreator = !!currentUserId && (currentUserId === createdById);
        const isPlatformAdmin = user?.role === 'Platform Admin';

        return (
          <div className="flex pr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-lg"
                >
                  <MoreHorizontal size={16} className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 border-border/50">
                <DropdownMenuItem
                  onClick={() => setDeleteKeyId(row.original.id)}
                  disabled={!isCreator && !isPlatformAdmin}
                  className="text-destructive hover:text-destructive focus:text-destructive cursor-pointer"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 30,
      meta: {
        skeleton: <Skeleton className="h-7 w-8 rounded-lg" />,
      },
    },
  ];

  return (
    <div className="space-y-8">
      {tableData.length === 0 && !isLoading ? (
        <div className="border border-border/40 shadow-sm overflow-hidden rounded-xl bg-card h-[500px] flex items-center justify-center">
          <EmptyScreen
            title="No API Keys"
            subTitle="There are currently no API keys available. Create one to get started."
            engage={
              <Button onClick={() => setIsCreateModalOpen(true)} variant="outline">
                <Plus size={14} className="mr-2" /> Create API Key
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-medium leading-none text-mono">
                API Keys
              </h2>
              <p className="text-sm text-secondary-foreground">
                API keys are used to authenticate your account when interacting with
                the SnapSec API.
              </p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} variant="outline">
              <Plus size={14} className="mr-2" /> Create API Key
            </Button>
          </div>

          <div className="space-y-4">
            <Table
              data={tableData}
              columns={columns}
              isLoading={isLoading}
              enableSearch={false}
              manualPagination={false}
              showPagination={false}
              className="border border-border/40 shadow-sm overflow-hidden rounded-xl bg-card"
              cardHeading={false}
              tableLayout={{
                headerBackground: true,
                rowBorder: true,
              }}
              grid
            />
          </div>
        </>
      )}

      <CreateApiKeyModal
        open={isCreateModalOpen}
        setOpen={setIsCreateModalOpen}
      />
      <ConfirmDialog
        open={!!deleteKeyId}
        setOpen={() => setDeleteKeyId(null)}
        onConfirm={handleDelete}
        variant="destructive"
        title="Delete API Key"
        dialog="This action cannot be undone. This API key will no longer be valid for authentication."
      />
    </div>
  );
};
