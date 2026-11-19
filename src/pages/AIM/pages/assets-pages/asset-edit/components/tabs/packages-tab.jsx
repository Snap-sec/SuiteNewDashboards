import { useMemo } from 'react';
import { Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Table from '@/components/custom/table';
import { EmptyScreen } from '../../../../../../../components/common/empty-screen';

export function PackagesTab({ asset }) {
  const data = useMemo(
    () =>
      asset?.related_assets?.server?.[0]?.server?.packages ||
      asset?.workstation?.packages ||
      [],
    [asset?.related_assets?.server?.[0]?.server?.packages],
  );

  if (
    !asset?.related_assets?.server?.[0]?.server?.packages?.length &&
    !asset?.workstation?.packages?.length
  ) {
    return <EmptyScreen />;
  }

  const columns = useMemo(
    () => [
      {
        // Name
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <Server className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{row.original.name}</span>
            </div>
            <span className="text-[11px] text-muted-foreground line-clamp-1">
              {row.original.desc}
            </span>
          </div>
        ),
      },

      //   Version
      {
        header: 'Version',
        accessorKey: 'version',
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.version}</span>
        ),
      },

      //   Architecture
      {
        header: 'Architecture',
        accessorKey: 'category',
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className="capitalize text-[10px] py-0 px-1.5 h-5"
          >
            {row.original.architecture}
          </Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <Table
        data={data}
        columns={columns}
        enableSearch={true}
        searchPlaceholder="Search services..."
        manualPagination={false}
        showPagination={true}
        className="border-none shadow-none"
      />
    </div>
  );
}
