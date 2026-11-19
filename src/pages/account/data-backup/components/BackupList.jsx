import { useMemo, useState } from 'react';
import { Database, Download, RefreshCw, Trash2, CheckCircle, Loader, X, MoreHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DateFormatter } from '@/components/custom/date-formatter';
import Table from '@/components/custom/table';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '—';
  const gb = bytes / 1024 / 1024 / 1024;
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
}

function BackupActionsDropdown({ row, onRestore, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]" side="bottom" align="end">
        <DropdownMenuItem asChild>
          <ButtonWithConfirm
            confirm
            confirmVariant="destructive"
            confirmTitle="Delete Backup"
            dialog="This backup will be permanently deleted and cannot be recovered. Are you sure you want to continue?"
            onConfirm={() => {
              onDelete(row.original._id);
              setOpen(false);
            }}
            variant="ghost"
            className="w-full justify-start !font-normal hover:bg-red-200/20 px-2 py-1.5 text-sm h-8"
          >
            <span className="text-destructive flex items-center gap-2">
              Delete
            </span>
          </ButtonWithConfirm>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getColumns({ onRestore, onDelete }) {
  return [
    {
      id: 'backup',
      accessorFn: (row) => row.name,
      header: ({ column }) => <DataGridColumnHeader title="Backup" column={column} />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center rounded-md size-7 bg-muted text-muted-foreground shrink-0">
            <Database size={13} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              <DateFormatter date={row.original.createdAt} />
            </p>
            <p className="text-xs text-muted-foreground">{row.original.name}</p>
          </div>
        </div>
      ),
      enableSorting: false,
      size: 280,
      meta: {
        skeleton: <Skeleton className="h-8" />,
      },
    },
    {
      id: 'size',
      accessorFn: (row) => row.size,
      header: ({ column }) => <DataGridColumnHeader title="Size" column={column} />,
      cell: ({ row }) => (
        <span className="text-sm text-foreground">{formatBytes(row.original.size)}</span>
      ),
      enableSorting: false,
      size: 100,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      id: 'type',
      accessorFn: (row) => row.type,
      header: ({ column }) => <DataGridColumnHeader title="Type" column={column} />,
      cell: ({ row }) => {
        const typeMap = {
          'Manual': 'User',
          'Automatic': 'Cron',
          'System Migration': 'Migration'
        };
        const label = typeMap[row.original.type] || row.original.type || '—';
        return <span className="text-sm text-foreground">{label}</span>;
      },
      enableSorting: false,
      size: 120,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      id: 'status',
      accessorFn: (row) => row.status,
      header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
      cell: ({ row }) => {
        const status = row.original.status;
        const isCompleted = status === 'completed';
        const isFailed = status?.toLowerCase().includes('failed');
        return (
          <Badge
            size="lg"
            variant={isCompleted ? 'success' : isFailed ? 'destructive' : 'warning'}
            appearance="outline"
          >
            {isCompleted ? <CheckCircle size={12} /> : isFailed ? <X size={12} /> : <Loader size={12} className="animate-spin" />}
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : '—'}
          </Badge>
        );
      },
      enableSorting: false,
      size: 130,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      id: 'actions',
      accessorFn: (row) => row._id,
      header: ({ column }) => <DataGridColumnHeader title="Actions" column={column} />,
      cell: ({ row }) => (
        <BackupActionsDropdown row={row} onRestore={onRestore} onDelete={onDelete} />
      ),
      enableSorting: false,
      size: 120,
      meta: {
        headerClassName: '',
      },
    },
  ];
}

export function BackupList({ backups = [], retention = 1, isLoading, onCreateBackup, onRestore, onDelete }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');

  const columns = useMemo(
    () => getColumns({ onRestore, onDelete }),
    [onRestore, onDelete],
  );

  const activeRetentionLimit = retention;
  const isAtOrAboveLimit = backups.length > 0 && backups.length >= activeRetentionLimit;
  const excessBackups = backups.length > activeRetentionLimit ? backups.slice(activeRetentionLimit) : [];
  const nextToDelete = isAtOrAboveLimit ? backups[activeRetentionLimit - 1] : null;

  const dialogContent = isAtOrAboveLimit ? (
    <div className="space-y-2 text-left">
      <p>A new backup will be created immediately. This may take a few moments depending on your data size.</p>

      {excessBackups.length > 0 && (
        <>
          <p className="font-semibold text-destructive mt-2">The following {excessBackups.length} older backup(s) will be deleted immediately:</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1 max-h-32 overflow-y-auto">
            {excessBackups.map(b => <li key={b._id}>{b.name}</li>)}
          </ul>
        </>
      )}

      <div className="mt-2">
        <p className="text-sm text-amber-600 font-medium">
          Warning: Because you have reached your retention limit of {activeRetentionLimit}, your oldest backup will be automatically deleted after this new backup finishes successfully:
        </p>
        <p className="text-sm text-amber-600 font-semibold pl-2 mt-1 border-l-2 border-amber-600/50">
          {nextToDelete?.name}
        </p>
      </div>

      <p className="mt-4 font-medium">Are you sure you want to proceed?</p>
    </div>
  ) : (
    "A new backup will be created immediately. This may take a few moments depending on your data size."
  );

  return (
    <Table
      data={backups}
      columns={columns}
      isLoading={isLoading}
      pagination={pagination}
      setPagination={setPagination}
      totalPages={Math.ceil(backups.length / pagination.pageSize)}
      totalCount={backups.length}
      search={search}
      setSearch={setSearch}
      enableSorting={false}
      manualPagination={false}
      searchPlaceholder="Search backups..."
      searchWidth="48"
      showColumnVisibility={false}
      rightToolbar={
        <ButtonWithConfirm
          confirm
          confirmVariant={excessBackups.length > 0 ? "destructive" : (isAtOrAboveLimit ? "warning" : "default")}
          confirmTitle="Create Backup"
          dialog={dialogContent}
          onConfirm={onCreateBackup}
          variant="outline"
        >
          <Database size={14} />
          Create Backup Now
        </ButtonWithConfirm>
      }
      cardHeading={true}
      grid={false}
    />
  );
}
