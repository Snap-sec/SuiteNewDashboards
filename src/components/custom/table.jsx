import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Search, Settings2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
  CardTable,
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid, useDataGrid } from '@/components/ui/data-grid';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const Table = ({
  data = [],
  columns,
  onRowClick,
  search,
  searchPlaceholder = 'Search ....',
  setSearch,
  pagination,
  totalPages,
  totalCount,
  sorting,
  setPagination,
  setSorting,
  rowSelection,
  setRowSelection,
  initialColumnVisibility,
  toolbar,
  rightToolbar,
  isLoading,
  enableSorting = false,
  manualSorting = true,
  manualPagination = true,
  enableSearch = true,
  newSearchInput,
  showPagination = true,
  className = null,
  cardHeading = true,
  searchWidth,
  pageSizeOptions = [10, 12, 20, 25, 30, 35, 50, 100],
  tableLayout: userTableLayout,
  grid = true,
  showColumnVisibility = true,
  showHeader = true,
  title,
}) => {
  const table = useReactTable({
    columns,
    data: data || [],
    getRowId: (row) => row?._id,
    pageCount: manualPagination ? totalPages : undefined,
    initialState: initialColumnVisibility
      ? { columnVisibility: initialColumnVisibility }
      : undefined,

    state: {
      ...(manualPagination
        ? {
          pagination, // controlled externally
        }
        : {}), // let it be internal otherwise
      ...(manualSorting && {
        sorting,
      }),
      ...(setRowSelection && {
        rowSelection,
      }),
    },

    manualPagination,
    manualSorting,
    enableSorting,

    ...(manualPagination && setPagination
      ? { onPaginationChange: setPagination }
      : {}),

    onSortingChange: manualSorting ? setSorting : undefined,
    onRowSelectionChange: setRowSelection,

    enableRowSelection: true,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const Toolbar = () => {
    const { table } = useDataGrid();

    return (
      <CardToolbar>
        <DataGridColumnVisibility
          table={table}
          trigger={
            <Button variant="outline" className="mb-1">
              <Settings2 />
              Columns
            </Button>
          }
        />
      </CardToolbar>
    );
  };

  return (
    <DataGrid
      table={table}
      recordCount={totalCount || data?.length}
      isLoading={isLoading}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        rowBorder: true,
        cellBorder: grid,
        showHeader,
        ...userTableLayout,
      }}
      onRowClick={onRowClick}
    >
      <Card className={className}>
        {cardHeading && (
          <CardHeader>
            <CardHeading>
              <div className="w-full flex items-center gap-2.5 py-2">
                {title && <CardTitle>{title}</CardTitle>}
                <div className="relative">
                  {newSearchInput
                    ? newSearchInput
                    : enableSearch && (
                      <>
                        <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                          placeholder={searchPlaceholder || 'Search Vulns...'}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className={`ps-9 pe-8 w-${searchWidth || '40'}`}
                        />
                      </>
                    )}

                  {!newSearchInput && search?.length > 0 && (
                    <Button
                      mode="icon"
                      variant="ghost"
                      className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => setSearch('')}
                    >
                      <X />
                    </Button>
                  )}
                </div>

                {toolbar || ''}
              </div>
            </CardHeading>

            <div className="flex items-center gap-3">
              {rightToolbar || ''}
              {showColumnVisibility && <Toolbar />}
            </div>
          </CardHeader>
        )}

        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        {showPagination && (
          <CardFooter>
            <DataGridPagination isLoading={false} sizes={pageSizeOptions} />
          </CardFooter>
        )}
      </Card>
    </DataGrid>
  );
};

export default Table;
