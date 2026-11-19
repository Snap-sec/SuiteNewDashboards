import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import Table from '@/components/custom/table';
import { CustomTooltip } from '@/components/custom/tooltip';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';

export default function TopAssetsTable({ topAssets = [], isLoading }) {
  const [search, setSearch] = useState('');

  const filteredAssets = (topAssets || []).filter((asset) => {
    const nameText = asset?.assetName || asset?.value || '';
    return nameText.toLowerCase().includes(search.toLowerCase());
  });

  const columns = useMemo(
    () => [
      {
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Asset Name" column={column} />,
        accessorFn: (row) => row.assetName || row.value,
        cell: ({ row }) => {
          const assetVal = row.original.assetName || row.original.value;
          return (
            <div className="max-w-[400px] min-w-0">
              <Link
                title={row.original.value}
                to={`/vm/vulnerabilities?filters=asset:${row.original.value}`}
                className="flex items-center gap-2 min-w-0 font-medium text-sm text-mono hover:text-primary"
              >
                {(() => {
                  const { icon, label } = GetAssetTypeInfo(row.original.type);
                  const important = row.original.assetId?.important;
                  if (!icon && !important) return null;
                  return (
                    <CustomTooltip text={label}>
                      <div
                        data-testid="asset-type"
                        className="flex gap-1 items-center bg-accent p-1.5 rounded-md shrink-0"
                      >
                        {icon && (
                          <span className="text-muted-foreground [&>svg]:w-3.5 [&>svg]:h-3.5">
                            {icon}
                          </span>
                        )}
                        {important && (
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                    </CustomTooltip>
                  );
                })()}
                <span className="truncate">{assetVal}</span>
              </Link>
            </div>
          );
        },
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },

      {
        id: 'vulns',
        header: ({ column }) => <DataGridColumnHeader title="Open Vulnerabilities" column={column} />,
        accessorFn: (row) => row.openVulnCount || 0,
        cell: ({ row }) => <span>{row.original.openVulnCount || 0}</span>,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },

      {
        id: 'vulnerableComponent',
        header: ({ column }) => <DataGridColumnHeader title="Vulnerable Component" column={column} />,
        accessorFn: (row) => row.vulnerableComponent || '-',
        cell: ({ row }) => <span>{row.original.vulnerableComponent || '-'}</span>,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
        size: 80
      },

      {
        id: 'recommendedFix',
        header: ({ column }) => <DataGridColumnHeader title="Recommended Fix" column={column} />,
        accessorFn: (row) => row.recommendedFix || '-',
        cell: ({ row }) => <span>{row.original.recommendedFix || '-'}</span>,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
        size: 80
      },
    ],
    []
  );

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-base font-semibold text-foreground">
          Top Affected Assets
        </h3>
      </div>
      <Table
        data={filteredAssets}
        columns={columns}
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search assets..."
        manualPagination={false}
        manualSorting={false}
        showPagination={filteredAssets.length > 5}
        cardHeading={true}
        isLoading={isLoading}
        pageSizeOptions={[5, 10, 20]}
        initialColumnVisibility={{}}
      />
    </div>
  );
}
