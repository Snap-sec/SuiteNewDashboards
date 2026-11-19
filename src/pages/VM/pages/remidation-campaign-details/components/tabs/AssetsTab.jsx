import { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetVmRemidationCampaignAssetsByIdQuery } from '@/services/vm/remidationCampaignApi';
import { Skeleton } from '@/components/ui/skeleton';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import Table from '@/components/custom/table';
import { CustomTooltip } from '@/components/custom/tooltip';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';

export default function AssetsTab({ campaignId }) {
  const { data, isLoading, isFetching } =
    useGetVmRemidationCampaignAssetsByIdQuery(campaignId, {
      skip: !campaignId,
    });
  const [search, setSearch] = useState('');

  const apiList = data?.items;
  const assets = Array.isArray(apiList) && apiList.length > 0 ? apiList : [];

  const filteredAssets = assets.filter((asset) => {
    const nameText = asset?.name || asset?.assetName || asset?.value || '';
    return nameText.toLowerCase().includes(search?.toLowerCase());
  });

  const columns = useMemo(
    () => [
      {
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Asset Name" column={column} />,
        accessorFn: (row) => row.name || row.assetName || row.value,
        cell: ({ row }) => {
          const assetVal = row.original.value || row.original.name || row.original.assetName;
          return (
            <div className=" min-w-0">
              <Link
                title={assetVal}
                to={`/vm/vulnerabilities?filters=asset:${row.original.value || assetVal}`}
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
        size: 60,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },

      {
        id: 'vulns',
        header: ({ column }) => <DataGridColumnHeader title="Open Vulnerabilities" column={column} />,
        accessorFn: (row) => row.vulns || row.vulnCount || 0,
        cell: ({ row }) => (
          <span>{row.original.vulns || row.original.vulnCount || 0}</span>
        ),
        size: 30,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7 w-full" />,
        },
      },

      {
        id: 'vulnerableComponent',
        header: ({ column }) => <DataGridColumnHeader title="Vulnerable Component" column={column} />,
        accessorFn: (row) => row.vulnerableComponent || '-',
        cell: ({ row }) => {
          const comp = row.original.vulnerableComponent;
          return comp ? (
            <div className="truncate text-sm" title={comp}>
              {comp}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          );
        },
        size: 40,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7 w-full" />,
        },
      },

      {
        id: 'recommendedFix',
        header: ({ column }) => <DataGridColumnHeader title="Recommended Fix" column={column} />,
        accessorFn: (row) => row.recommendedFix || '-',
        cell: ({ row }) => {
          const fix = row.original.recommendedFix;
          return fix ? (
            <div className="truncate text-sm" title={fix}>
              {fix}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          );
        },
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
        size: 50
      },
    ],
    []
  );

  return (
    <Table
      data={filteredAssets}
      columns={columns || []}
      search={search}
      setSearch={setSearch}
      manualPagination={false}
      manualSorting={false}
      showPagination={true}
      cardHeading={true}
      isLoading={isLoading || isFetching}
    />
  );
}
