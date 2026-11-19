import React, { useMemo, useState } from 'react';
import {
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Search, Settings2, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardFooter,
    CardHeader,
    CardHeading,
    CardTable,
    CardToolbar,
} from '@/components/ui/card';
import { DataGrid, useDataGrid } from '@/components/ui/data-grid';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable, DataGridTableBodyRow, DataGridTableBodyRowCell, DataGridTableBase, DataGridTableHead, DataGridTableHeadRow, DataGridTableHeadRowCell, DataGridTableBody, DataGridTableEmpty, DataGridTableRowSpacer } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { flexRender } from '@tanstack/react-table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

const AccordionTable = ({
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
    pageSizeOptions = [10, 12, 20, 30, 50, 100],
    children, // This will be the render prop for expanded content
    expanded,
    onExpandedChange,
    accordionType = 'single',
    AccClass = null,
}) => {
    const [internalExpanded, setInternalExpanded] = useState({});

    const table = useReactTable({
        columns,
        data: data || [],
        getRowId: (row) => row?._id,
        pageCount: manualPagination ? totalPages : undefined,

        state: {
            ...(manualPagination
                ? {
                    pagination,
                }
                : {}),
            ...(manualSorting && {
                sorting,
            }),
            ...(setRowSelection && {
                rowSelection,
            }),
            expanded: expanded !== undefined ? expanded : internalExpanded,
        },

        onExpandedChange: onExpandedChange || setInternalExpanded,
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
        getExpandedRowModel: getExpandedRowModel(),
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

    const expandedState = table.getState().expanded;
    // Convert tanstack expanded state to accordion value
    const accordionValue = useMemo(() => {
        if (accordionType === 'single') {
            const keys = Object.keys(expandedState);
            return keys.length > 0 ? keys[0] : '';
        }
        return Object.keys(expandedState);
    }, [expandedState, accordionType]);

    const handleAccordionChange = (value) => {
        if (accordionType === 'single') {
            const newExpanded = value ? { [value]: true } : {};
            if (onExpandedChange) {
                onExpandedChange(newExpanded);
            } else {
                setInternalExpanded(newExpanded);
            }
        } else {
            const newExpanded = Array.isArray(value) ? value.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}) : {};
            if (onExpandedChange) {
                onExpandedChange(newExpanded);
            } else {
                setInternalExpanded(newExpanded);
            }
        }
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
                cellBorder: false,
            }}
            onRowClick={onRowClick}
        >
            <Card className={className}>
                {cardHeading && (
                    <CardHeader>
                        <CardHeading>
                            <div className="w-full flex items-center gap-2.5 py-2">
                                <div className="relative">
                                    {newSearchInput ? newSearchInput
                                        :
                                        enableSearch &&
                                        <>
                                            <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                                            <Input
                                                placeholder={searchPlaceholder || 'Search Vulns...'}
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className={`ps-9 w-${searchWidth || '40'}`}
                                            />
                                        </>
                                    }

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
                            <Toolbar />
                        </div>
                    </CardHeader>
                )}


                <CardTable>
                    <ScrollArea>
                        <Accordion
                            type={accordionType}
                            collapsible={accordionType === 'single'}
                            value={accordionValue}
                            onValueChange={handleAccordionChange}
                            asChild
                        >
                            <DataGridTableBase>
                                <DataGridTableHead>
                                    {table.getHeaderGroups().map((headerGroup, index) => (
                                        <DataGridTableHeadRow headerGroup={headerGroup} key={index}>
                                            {headerGroup.headers.map((header, index) => (
                                                <DataGridTableHeadRowCell header={header} key={index}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                                </DataGridTableHeadRowCell>
                                            ))}
                                            <th className="w-10 px-0"></th>
                                        </DataGridTableHeadRow>
                                    ))}
                                </DataGridTableHead>

                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row, rowIndex) => {
                                        const isExpanded = table.getState().expanded[row.id];
                                        const isLastRow = rowIndex === table.getRowModel().rows.length - 1;

                                        const toggleRow = () => {
                                            const rowId = row.id;
                                            let newValue;
                                            if (accordionType === 'single') {
                                                newValue = accordionValue === rowId ? "" : rowId;
                                            } else {
                                                const currentArray = Array.isArray(accordionValue) ? accordionValue : [];
                                                newValue = currentArray.includes(rowId)
                                                    ? currentArray.filter(id => id !== rowId)
                                                    : [...currentArray, rowId];
                                            }
                                            handleAccordionChange(newValue);
                                        };

                                        return (
                                            <AccordionItem
                                                value={row.id}
                                                key={row.id}
                                                asChild
                                            >
                                                <tbody className="border-none">
                                                    <DataGridTableBodyRow
                                                        row={row}
                                                        onClick={(e) => {
                                                            toggleRow();
                                                            if (onRowClick) onRowClick(row.original);
                                                        }}
                                                        className={cn(
                                                            "cursor-pointer",
                                                            (!isExpanded && !isLastRow) && "[&>td]:border-b border-border"
                                                        )}
                                                    >
                                                        {row.getVisibleCells().map((cell, colIndex) => (
                                                            <DataGridTableBodyRowCell cell={cell} key={colIndex}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </DataGridTableBodyRowCell>
                                                        ))}
                                                        <td className="w-10 align-middle px-2">
                                                            <div className="flex justify-center items-center">
                                                                <ChevronRight className={cn(
                                                                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                                                                    isExpanded && "rotate-90"
                                                                )} />
                                                            </div>
                                                        </td>
                                                    </DataGridTableBodyRow>
                                                    <tr className="border-none">
                                                        <td
                                                            colSpan={row.getVisibleCells().length + 1}
                                                            className={cn(
                                                                "p-0 border-none",
                                                                (isExpanded && !isLastRow) && "border-b border-border"
                                                            )}
                                                        >
                                                            <AccordionContent className="pb-0 overflow-hidden">
                                                                <div className={`${AccClass ? AccClass : "px-4 py-4"} bg-muted/20 border-t border-border/50`}>
                                                                    {typeof children === 'function' ? children(row) : children}
                                                                </div>
                                                            </AccordionContent>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </AccordionItem>
                                        );
                                    })
                                ) : (
                                    <DataGridTableBody>
                                        <DataGridTableEmpty />
                                    </DataGridTableBody>
                                )}
                            </DataGridTableBase>
                        </Accordion>
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

export default AccordionTable;
