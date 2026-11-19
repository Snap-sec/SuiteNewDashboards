import { useMemo } from 'react';
import { Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import AssetRelationModal from './modals/add-asset-relation';
import SectionCard from './SectionCard';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';

const RelationsSection = ({ asset }) => {
  const relations = asset?.relations || [];

  const getTypeBadgeVariant = (type) => {
    const map = {
      subdomain: 'primary',
      ip: 'info',
      port: 'warning',
      certificate: 'success',
      dns: 'secondary',
    };
    return map[type] || 'secondary';
  };

  const columns = useMemo(
    () => [
      {
        id: 'asset',
        accessorFn: () => asset?.value || '-',
        header: ({ column }) => (
          <DataGridColumnHeader title="Asset" column={column} />
        ),
        cell: () => (
          <span>{asset?.value || '-'}</span>
        ),
        size: 200,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'relation',
        accessorFn: (row) => row?.relation || '—',
        header: ({ column }) => (
          <DataGridColumnHeader title="Relation" column={column} />
        ),
        cell: ({ row }) => (
          <Badge variant="primary" appearance="outline">
            {row.original?.relation || '—'}
          </Badge>
        ),
        size: 100,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'relatedType',
        accessorFn: (row) => {
          const isAssetChild =
            row?.child?.type === asset?.type &&
            row?.child?.value === asset?.value;
          const relatedEntity = isAssetChild ? row?.parent : row?.child;
          return relatedEntity?.type || '—';
        },
        header: ({ column }) => (
          <DataGridColumnHeader title="Related Type" column={column} />
        ),
        cell: ({ row }) => {
          const isAssetChild =
            row.original?.child?.type === asset?.type &&
            row.original?.child?.value === asset?.value;
          const relatedEntity = isAssetChild ? row.original?.parent : row.original?.child;
          return (
            <Badge
              variant={getTypeBadgeVariant(relatedEntity?.type)}
              appearance="outline"
            >
              {relatedEntity?.type || '—'}
            </Badge>
          );
        },
        size: 120,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'relatedValue',
        accessorFn: (row) => {
          const isAssetChild =
            row?.child?.type === asset?.type &&
            row?.child?.value === asset?.value;
          const relatedEntity = isAssetChild ? row?.parent : row?.child;
          return relatedEntity?.value || '—';
        },
        header: ({ column }) => (
          <DataGridColumnHeader title="Related Value" column={column} />
        ),
        cell: ({ row }) => {
          const isAssetChild =
            row.original?.child?.type === asset?.type &&
            row.original?.child?.value === asset?.value;
          const relatedEntity = isAssetChild ? row.original?.parent : row.original?.child;
          return (
            <span className="text-sm text-foreground">
              {relatedEntity?.value || '—'}
            </span>
          );
        },
        size: 200,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
    ],
    [asset]
  );

  if (relations.length === 0) return null;

  return (
    <SectionCard
      icon={<Share2 className="size-4" />}
      iconColor="text-pink-500"
      title="Asset Relations"
      className="w-full min-w-0"
    >
      <div className="w-full min-w-0 overflow-x-auto">
        <Table
          data={relations}
          columns={columns}
          enableSearch={false}
          showPagination={relations.length > 10}
          manualPagination={false}
          cardHeading={false}
          className="border-0 shadow-none p-0"
        />
      </div>
    </SectionCard>
  );
};

export default RelationsSection;