import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import AdapterIcon from '@/components/common/profile-image';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import { DateFormatter } from '@/components/custom/date-formatter.jsx';
import { CustomTooltip } from '@/components/custom/tooltip';
import VulnCountBadge from '@/components/custom/vuln-count-badge.jsx';
import { Profile } from '@/components/custom/profile.jsx';

export function getWorkstationsColumns(NewUrl) {
  return [
    // {
    //   accessorKey: '_id',
    //   accessorFn: (row) => row._id,
    //   header: () => <DataGridTableRowSelectAll />,
    //   cell: ({ row }) => <DataGridTableRowSelect row={row} />,
    //   enableSorting: false,
    //   enableHiding: false,
    //   enableResizing: false,
    //   size: 51,
    //   meta: { cellClassName: '' },
    // },
    {
      id: 'assetValue',
      accessorFn: (row) => row.value,
      header: ({ column }) => <DataGridColumnHeader title="Asset" column={column} />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            <Link
              to={`/assetinventory/asset-edit/${row.original._id}?asset=${NewUrl}`}
              className="text-secondary-foreground font-medium hover:text-primary break-words truncate overflow-hidden whitespace-nowrap"
              title={row?.original?.value}
            >
              {row?.original?.value}
            </Link>
            {(() => {
              const createdDate = new Date(row.original.createdAt);
              const currentDate = new Date();
              const daysDifference = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));
              return daysDifference < 5 ? (
                <div>
                  <Badge variant="primary" appearance="outline" size="sm">
                    New
                  </Badge>
                </div>
              ) : null;
            })()}
          </div>
          <span
            className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap max-w-[200px]"
            title={row.original.name}
          >
            {row.original.name || row.original.hostname}
          </span>
        </div>
      ),
      enableSorting: false,
      size: 170,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    // {
    //   id: 'type',
    //   accessorFn: (row) => row.type,
    //   header: ({ column }) => <DataGridColumnHeader title="Type" column={column} />,
    //   cell: ({ row }) => (
    //     <Badge variant="secondary" className="capitalize">
    //       {GetAssetTypeInfo(row?.original?.type)?.icon}
    //       {GetAssetTypeInfo(row?.original?.type)?.label}
    //     </Badge>
    //   ),
    //   enableSorting: false,
    //   size: 150,
    //   meta: { skeleton: <Skeleton className="h-7" /> },
    // },
    // {
    //   id: 'source',
    //   accessorFn: (row) => row.adapters?.[0]?.adapterName,
    //   header: ({ column }) => <DataGridColumnHeader title="Source" column={column} />,
    //   cell: ({ row }) => (
    //     <div className="flex items-center gap-1">
    //       {row.original?.adapters?.length > 0
    //         ? row.original.adapters.map((adapter, idx) => (
    //           <CustomTooltip
    //             key={idx}
    //             text={adapter.name || adapter.adapterName || adapter.title || 'Adapter'}
    //           >
    //             <div>
    //               <AdapterIcon src={adapter.logo} size={24} variant="logo" />
    //             </div>
    //           </CustomTooltip>
    //         ))
    //         : '-'}
    //     </div>
    //   ),
    //   enableSorting: false,
    //   size: 70,
    //   meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    // },
    {
      id: 'workstation.os.platform',
      accessorFn: (row) => row.workstation?.os?.platform,
      header: ({ column }) => <DataGridColumnHeader title="Operating System" column={column} />,
      cell: ({ row }) => {
        const os = row.original?.workstation?.os;
        if (!os) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium capitalize">{os.platform}</span>
            {/* {os.distribution && (
              <span className="text-[10px] text-muted-foreground truncate max-w-[150px]" title={`${os.distribution} ${os.version || ''}`}>
                {os.distribution} {os.version}
              </span>
            )} */}
          </div>
        );
      },
      size: 150,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'properties.vulnerabilityStats.total',
      accessorFn: (row) => row.risk?.autoRiskScore?.factors.vulnerabilityScore,
      header: ({ column }) => <DataGridColumnHeader title="Vuln Count" column={column} />,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <VulnCountBadge
            score={row.original.security?.vulnerability_stats?.total}
            data={row.original.security}
          />
        </div>
      ),
      enableSorting: true,
      size: 120,
      meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'tags',
      accessorFn: (row) => row.tags,
      header: ({ column }) => <DataGridColumnHeader title="Tags" column={column} />,
      cell: ({ row }) => {
        const tags = row.original?.tags;
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-[180px]">
            {tags.map((tag, idx) => {
              const tagName = typeof tag === 'string' ? tag : (tag?.value || tag?.name || tag?.label || tag);
              return (
                <Badge key={idx} variant="secondary" appearance="light" size="sm" className="text-[11px] px-1.5 py-0 inline-flex items-center gap-1">
                  <Tag className="size-3 shrink-0" />
                  <span>{tagName}</span>
                </Badge>
              );
            })}
          </div>
        );
      },
      enableSorting: false,
      size: 140,
      meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'owner',
      accessorFn: (row) => row.owner?.name,
      header: ({ column }) => <DataGridColumnHeader title="Owner" column={column} />,
      cell: ({ row }) => {
        const owner = row?.original?.owner;
        const userName = owner?.user?.email;
        const teamName = owner?.team?.name;
        const departmentName = owner?.department?.name;
        if (userName) {
          return (
            <Profile
              email={owner?.user?.email || ''}
              name={owner?.user?.firstName || owner?.user?.email?.split('@')[0]}
              />
          );
        }
        if (teamName) return <span className="text-sm font-medium">{teamName}</span>;
        if (departmentName) return <span className="text-sm font-medium">{departmentName}</span>;
        return <span className="text-muted-foreground">No owner</span>;
      },
      enableSorting: false,
      size: 180,
      meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
    },
    // {
    //   id: 'businessUnits',
    //   accessorFn: (row) => row.businessUnits,
    //   header: ({ column }) => <DataGridColumnHeader title="Business Unit" column={column} />,
    //   cell: ({ row }) => {
    //     const bus = row?.original?.businessUnits;
    //     if (!bus || bus.length === 0) return <span className="text-muted-foreground">None</span>;
    //     return (
    //       <div className="flex flex-col gap-0.5">
    //         {bus.map((bu, i) => (
    //           <span key={i} className="text-xs font-medium">{bu.name}</span>
    //         ))}
    //       </div>
    //     );
    //   },
    //   enableSorting: false,
    //   size: 150,
    //   meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    // },
    {
      id: 'last_detected',
      accessorFn: (row) => row.last_detected,
      header: ({ column }) => <DataGridColumnHeader title="Detected On" column={column} />,
      cell: ({ row }) => (
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] whitespace-nowrap">
         <DateFormatter date={row.original.last_detected} mode="relative" />
          </span>
          {/* <span className="text-[10px] whitespace-nowrap text-muted-foreground">
            First Detected <DateFormatter date={row?.original?.createdAt} mode="relative" />
          </span> */}
        </div>
      ),
      enableSorting: true,
      size: 80,
      meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    },
  ];
}
