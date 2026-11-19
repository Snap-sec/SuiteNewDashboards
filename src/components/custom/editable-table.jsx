'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTable,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
} from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';



function EditableCell({ row, column, value, onSave, onCancel, cursorStyle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState(null);

  const editableConfig = typeof column.editable === 'boolean'
    ? { editable: column.editable }
    : column.editable || { editable: false };

  const handleStartEdit = () => {
    if (!editableConfig.editable) return;
    setIsEditing(true);
    setEditValue(value);
    setError(null);
  };

  const handleSave = () => {
    if (editableConfig.validator) {
      const validation = editableConfig.validator(editValue);
      if (validation !== true) {
        setError(typeof validation === 'string' ? validation : 'Invalid value');
        return;
      }
    }

    const finalValue = editableConfig.parser ? editableConfig.parser(editValue) : editValue;

    console.log('Saving value:', finalValue); // Debug log
    onSave(finalValue);
    setIsEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
    setError(null);
    onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (column.cell) {
    return (
      <div className="group relative">
        {column.cell({ row, isEditing, value })}
      </div>
    );
  }

  if (isEditing) {
    const inputType = editableConfig.type || 'text';
    const isTextarea = inputType === 'textarea';

    return (
      <div className="flex items-center gap-1 min-w-0">
        {isTextarea ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-h-[60px] text-sm",
              error && "border-red-500 focus:border-red-500"
            )}
            autoFocus
          />
        ) : (
          <Input
            type={inputType}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "text-sm h-8",
              error && "border-red-500 focus:border-red-500"
            )}
            autoFocus
          />
        )}
      </div>
    );
  }

  const displayValue = editableConfig.formatter ? editableConfig.formatter(value) : String(value || '');

  return (
    <div
      className={cn(
        editableConfig.editable ? `hover:bg-accent ${cursorStyle ? cursorStyle : "cursor-cell"} hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground ring-ring/40 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 p-2 transition-[color,box-shadow] border border-transparent hover:border-border hover:bg-background flex flex-row items-center gap-2.5 px-2.5 py-2 rounded-md text-sm [&_svg]:text-muted-foreground hover:[&_svg]:text-primary [&[data-active=true]_svg]:text-primary`
          : " "
      )}
      onClick={handleStartEdit}
    >
      <span className="text-sm truncate flex-1">{displayValue}</span>
    </div>
  );
}

function EditableTable({
  data,
  columns,
  title = "Data Table",
  searchable = true,
  searchPlaceholder,
  onDataChange,
  onRowUpdate,
  onSearch,
  onPaginationChange,
  manualPagination,
  mannualPagination = false,
  mannualSorting = false,
  pageSize = 10,
  totalPages = 0,
  currentPage = 1,
  totalItems = 0,
  className,
  cursorStyle,
  tableLayout = {
    columnsPinnable: true,
    columnsMovable: true,
    columnsVisibility: true,
    cellBorder: true,
  },
}) {
  const [tableData, setTableData] = useState(data);
  const [searchQuery, setSearchQuery] = useState('');
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const isManualPagination =
    manualPagination !== undefined
      ? manualPagination
      : (mannualPagination || Boolean(onPaginationChange || totalPages > 0 || totalItems > 0));

  const calculatedPageCount = useMemo(() => {
    if (totalPages > 0) return totalPages;
    if (totalItems > 0 && pageSize > 0) {
      return Math.ceil(totalItems / pageSize);
    }
    return -1;
  }, [totalPages, totalItems, pageSize]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  useEffect(() => {
    // Keep internal pagination in sync when parent passes updated page or pageSize
    setPagination(prev => ({
      ...prev,
      pageIndex: (currentPage ? (currentPage - 1) : prev.pageIndex || 0),
      pageSize: pageSize,
    }));
  }, [currentPage, pageSize]);

  const handleCellUpdate = useCallback((rowId, columnId, newValue) => {
    console.log('handleCellUpdate called with', rowId, columnId, newValue);
    const updatedData = tableData.map((row) => {
      if (String(row.id || row._id) === String(rowId)) {
        const updatedRow = { ...row, [columnId]: newValue };

        if (onRowUpdate) {
          console.log('Calling onRowUpdate', rowId, columnId, newValue);
          onRowUpdate(rowId, columnId, newValue);
        }

        return updatedRow;
      }
      return row;
    });

    setTableData(updatedData);

    if (onDataChange) {
      onDataChange(updatedData);
    }
  }, [tableData, onDataChange, onRowUpdate]);

  const tableColumns = useMemo(
    () => [
      ...columns.map((column) => ({
        id: column.accessorKey,
        accessorKey: column.accessorKey,
        header: ({ column: tableColumn }) => (
          <DataGridColumnHeader title={column.title} column={tableColumn} />
        ),
        cell: ({ row }) => (
          <EditableCell
            row={row}
            column={column}
            value={row.getValue(column.accessorKey)}
            onSave={(newValue) =>
              handleCellUpdate(String(row.original.id || row.original._id), column.accessorKey, newValue)
            }
            onCancel={() => { }}
            cursorStyle={cursorStyle}
          />
        ),
        enableSorting: true,
        size: column.size || 150,
        meta: {
          skeleton: column.skeleton || <Skeleton className="h-4 w-full" />,
        },
      })),
    ],
    [columns, handleCellUpdate, cursorStyle]
  );

  const table = useReactTable({
    columns: tableColumns,
    data: tableData,
    getRowId: (row) => String(row.id || row._id),
    manualPagination: isManualPagination,
    pageCount: calculatedPageCount,

    // Use internal client-side pagination
    state: {
      pagination,
      sorting,
      rowSelection,
    },

    onPaginationChange: (up) => {
      const next = typeof up === 'function' ? up(pagination) : up;
      setPagination(next);
      if (onPaginationChange) {
        onPaginationChange({ page: (next.pageIndex || 0) + 1, limit: next.pageSize });
      }
    },

    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,

    enableRowSelection: true,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // const table = useReactTable({
  //   columns: tableColumns,
  //   data: tableData,
  //   pageCount: Math.ceil((totalItems || 0) / pagination.pageSize) || totalPages,
  //   // manualPagination: mannualPagination,
  //   // manualSorting: mannualSorting,
  //   manualFiltering: false,
  //   getRowId: (row) => String(row.id || row._id),
  //   state: {
  //     // pagination,
  //     sorting,
  //     rowSelection,
  //   },
  //   columnResizeMode: 'onChange',
  //   // onPaginationChange: mannualPagination ? undefined : (updatedPagination) => {
  //   //   setPagination(updatedPagination);
  //   //   if (onPaginationChange) {
  //   //     const newPagination = typeof updatedPagination === 'function'
  //   //       ? updatedPagination(pagination)
  //   //       : updatedPagination;
  //   //     onPaginationChange({
  //   //       page: newPagination.pageIndex + 1,
  //   //       limit: newPagination.pageSize
  //   //     });
  //   //   }
  //   // },
  //   onSortingChange: setSorting,
  //   enableRowSelection: true,
  //   onRowSelectionChange: setRowSelection,
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  // });

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const totalRecordCount = totalItems || (totalPages && pageSize ? totalPages * pageSize : 0) || tableData?.length || 0;

  return (
    <div className={className}>
      <DataGrid
        table={table}
        recordCount={totalRecordCount}
        tableLayout={tableLayout}
      >
        <Card>
          <CardHeader className="py-3.5">
            <CardTitle>{title}</CardTitle>
            {searchable && (
              <CardToolbar className="relative">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder={searchPlaceholder || `Search Assets`}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="ps-9 w-40"
                />
                {searchQuery.length > 0 && (
                  <Button
                    variant="ghost"
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => {
                      setSearchQuery('');
                      if (onSearch) onSearch('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </CardToolbar>
            )}
          </CardHeader>
          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </Card>
      </DataGrid>
    </div>
  );
}

export { EditableTable };
