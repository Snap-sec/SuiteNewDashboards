import React, { useMemo, useState } from 'react';
import { Box, ExternalLink, Eye } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useGetAsmAssetsQuery } from '@/services/asm/attackSurfaceApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '@/components/common/empty-screen';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import PageHeading from '@/components/custom/page-heading';
import SeverityLabel from '@/components/custom/severity-label';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';
import useDebounce from '../../../../hooks/use-debounce';
import Table from '../components/table/asset-table';
import CsvExportBtn from './components/csv-export-btn';
import TechnologyDetailsModal from './components/technology-details-modal';
import useStore from './store';

const getAssetValue = (asset) => {
  if (!asset) return '-';
  if (typeof asset === 'string') return asset;
  return (
    asset.value ||
    asset.domain ||
    asset.subdomain ||
    asset.name ||
    asset.ip ||
    asset.host ||
    asset.asset_value ||
    '-'
  );
};

const getTechIconUrl = (techName) => {
  if (!techName) return null;
  const cleanName = techName
    .toLowerCase()
    .trim()
    .replace(/\.js$/, 'js')
    .replace(/\s+/g, '-');
  return `https://cdn.simpleicons.org/${cleanName}`
  // return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${cleanName}/${cleanName}-original.svg`
  // return `https://raw.githubusercontent.com/rdimascio/icons/master/icons/${cleanName}.svg`;
};

const TechnologyBadge = ({ tech, onSelect }) => {
  const [imgError, setImgError] = useState(false);
  const name = typeof tech === 'string' ? tech : tech?.value || '-';
  const iconUrl = getTechIconUrl(name);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(tech);
      }}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-secondary/80 hover:bg-secondary text-secondary-foreground border border-border/60 transition-colors max-w-[200px] truncate cursor-pointer text-left"
      title={name}
    >
      {!imgError && iconUrl ? (
        <img
          src={iconUrl}
          alt=""
          className="size-3.5 object-contain shrink-0"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <Box className="size-3 text-muted-foreground shrink-0" />
      )}
      <span className="truncate">{name}</span>
    </button>
  );
};

function getColumns({ onSelectTechnology }) {
  return [
    {
      id: 'asset',
      accessorFn: (row) => row.value || row.subdomain || row.domain,
      header: ({ column }) => (
        <DataGridColumnHeader title="Asset" column={column} />
      ),
      cell: ({ row }) => {
        const assetValue = row.original?.value || row.original?.subdomain || row.original?.domain || '-';
        const isExternallyReachable = row.original?.externally_reachable;
        const status = row.original?.properties?.subdomain_status;

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm truncate" title={assetValue}>
                {assetValue}
              </span>
              {row.original?.isNew && (
                <Badge className="shrink-0" size="sm">
                  New
                </Badge>
              )}
            </div>

          </div>
        );
      },
      enableSorting: false,
      size: 200,
      meta: {
        skeleton: <Skeleton className="h-7 w-48" />,
      },
    },

    {
      id: 'technologies',
      accessorFn: (row) => row.technologies,
      header: ({ column }) => (
        <DataGridColumnHeader title="Technologies" column={column} />
      ),
      cell: ({ row }) => {
        const technologies = row.original?.technologies || [];

        if (!technologies.length) {
          return <span className="text-muted-foreground text-sm">-</span>;
        }

        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            {technologies.slice(0, 5).map((tech, index) => (
              <TechnologyBadge
                key={index}
                tech={tech}
                onSelect={(t) => onSelectTechnology(t, row.original)}
              />
            ))}

            {technologies.length > 5 && (
              <DetailedHoverPopover
                popoverTitle={`Technologies (${technologies.length})`}
                buttonText={`+${technologies.length - 5} more`}
                width="w-[340px] max-w-[300px]"
                popoverContent={
                  <div className="flex flex-wrap gap-1.5 p-1.5">
                    {technologies.slice(5).map((tech, idx) => (
                      <TechnologyBadge
                        key={idx}
                        tech={tech}
                        onSelect={(t) => onSelectTechnology(t, row.original)}
                      />
                    ))}
                  </div>
                }
              />
            )}
          </div>
        );
      },
      enableSorting: false,
      size: 250,
      meta: {
        skeleton: <Skeleton className="h-7 w-56" />,
      },
    },

    // {
    //   id: 'signals',
    //   accessorFn: (row) => row.total_signals ?? row.signals?.total ?? row.total_exposures,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="Signals" column={column} />
    //   ),
    //   cell: ({ row }) => {
    //     const signals = row.original?.signals;
    //     const total = row.original?.total_signals ?? signals?.total ?? row.original?.total_exposures ?? 0;

    //     if (total === 0) {
    //       return (
    //         <Badge variant="success" appearance="outline" className="text-xs">
    //           0 Signals
    //         </Badge>
    //       );
    //     }

    //     return (
    //       <div className="flex items-center gap-1.5 flex-wrap">
    //         <Badge variant="destructive" appearance="outline" className="text-xs">
    //           {total} Signal{total > 1 ? 's' : ''}
    //         </Badge>
    //       </div>
    //     );
    //   },
    //   enableSorting: false,
    //   size: 160,
    //   meta: {
    //     skeleton: <Skeleton className="h-7 w-24" />,
    //   },
    // },
  ];
}

function Technologies2() {
  const pagination = useStore((state) => state.pagination);
  const sorting = useStore((state) => state.sorting);
  const filters = useStore((state) => state.filters);
  const searchQuery = useStore((state) => state.searchQuery);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setFilters = useStore((state) => state.setFilters);
  const setSorting = useStore((state) => state.setSorting);

  const [selectedTech, setSelectedTech] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const getSortParams = () => {
    if (!sorting.length) return {};
    const sort = sorting[0];
    return {
      sortBy: sort.id,
      sortOrder: sort.desc ? 'desc' : 'asc',
    };
  };

  const {
    data: technologiesData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAsmAssetsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    ...filters,
    ...getSortParams(),
    type: 'technology',
  });

  const handleOpenDetails = (tech, parentAsset) => {
    if (!tech) return;
    // If opened from a specific technology badge, merge tech info with asset context
    if (tech.value && parentAsset) {
      setSelectedTech({
        ...tech,
        assetValue: parentAsset.value || parentAsset.subdomain || parentAsset.domain,
        network_scope: parentAsset.network_scope,
        domain: parentAsset.domain,
      });
    } else if (tech.technologies && tech.technologies.length > 0) {
      // If clicked row
      setSelectedTech({
        ...tech.technologies[0],
        allTechs: tech.technologies,
        assetValue: tech.value || tech.subdomain || tech.domain,
        network_scope: tech.network_scope,
        domain: tech.domain,
      });
    } else {
      setSelectedTech(tech);
    }
    setModalOpen(true);
  };

  const columns = useMemo(
    () => getColumns({ onSelectTechnology: handleOpenDetails }),
    [],
  );

  if (isError && !isLoading && !isFetching) {
    return <ApiErrorHandler error={error} />;
  }

  if (
    !isLoading &&
    !isFetching &&
    !technologiesData?.total &&
    !debouncedSearch &&
    Object.keys(filters || {}).length === 0
  ) {
    return (
      <EmptyScreen
        title="No Technologies Found"
        subTitle="When new technologies are added, they will show here."
      />
    );
  }

  return (
    <div className="p-4">
      <Helmet>
        <title>Xpose | Technologies</title>
      </Helmet>

      <div className="w-full flex items-center justify-between mb-2">
        <PageHeading
          title="Technologies"
          description="View and manage all technologies across your organization’s attack surface."
        />
      </div>

      <Table
        data={technologiesData?.data || []}
        columns={columns}
        hideExposures
        isLoading={isLoading || isFetching}
        totalPages={
          Math.ceil((technologiesData?.total || 0) / pagination.pageSize) || 1
        }
        totalCount={technologiesData?.total || 0}
        pagination={pagination}
        setPagination={setPagination}
        search={searchQuery}
        setSearch={setSearchQuery}
        sorting={sorting}
        setSorting={setSorting}
        enableSorting={true}
        manualPagination={true}
        manualSorting={true}
        grid
        onRowClick={(row) => handleOpenDetails(row.original)}
        toolbar={
          <TableToolbarFilters
            filters={filters}
            setFilters={setFilters}
            supportedFilters={technologiesData?.advanced_filters}
            isLoadingFilters={isLoading}
          />
        }
        toolbar_right={
          <CsvExportBtn
            type="technology"
            filters={filters}
            search={searchQuery}
          />
        }
      />

      <TechnologyDetailsModal
        technology={selectedTech}
        open={modalOpen}
        setOpen={setModalOpen}
      />
    </div>
  );
}

export default Technologies2;
