import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input, InputWrapper } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomTooltip } from '@/components/custom/tooltip';

const Spinner = ({ className = '' }) => (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
    </svg>
);

/**
 * "Generic" tab — flat search + infinite-scroll checkbox list, original design.
 *
 * @param {object}   props
 * @param {string}   props.searchTerm
 * @param {function} props.onSearchChange
 * @param {Array}    props.selectedAssets       - [{id, value}]
 * @param {function} props.onDeselect           - (assetId) => void
 * @param {object}   props.assetsData           - RTK response data
 * @param {boolean}  props.isLoading
 * @param {boolean}  props.isFetching
 * @param {function} props.isAssetSelected      - (assetId) => boolean
 * @param {function} props.onToggle             - (asset) => void
 * @param {function} props.onLoadMore           - called when list scrolled to bottom
 * @param {function} props.onSave
 */
export function GenericTab({
    searchTerm,
    onSearchChange,
    selectedAssets,
    onDeselect,
    assetsData,
    isLoading,
    isFetching,
    isAssetSelected,
    onToggle,
    onLoadMore,
    onSave,
}) {
    return (
        <div className="mx-auto w-full mt-4">
            {/* Search Bar */}
            <div className="relative mb-4">
                <InputWrapper>
                    <Search />
                    <Input
                        type="text"
                        placeholder="Type to search assets"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </InputWrapper>
                {isFetching && (
                    <Spinner className="absolute right-2 top-2.5 h-5 w-5 text-muted-foreground" />
                )}
            </div>

            {/* Selected Assets chips */}
            <div className="mb-4">
                <div className="flex flex-wrap gap-2 max-h-[300px] kt-scrollable-y-auto">
                    {selectedAssets?.length > 0 ? (
                        selectedAssets.map((asset) => (
                            <CustomTooltip text={asset.value} key={asset.id}>
                                <div className="flex items-center justify-between p-2 border dark:border-gray-800 rounded text-sm text-gray-700 dark:text-white">
                                    <span className="mr-2">
                                        {asset.value.length > 20
                                            ? `${asset.value.slice(0, 20)}…`
                                            : asset.value}
                                    </span>
                                    <button
                                        onClick={() => onDeselect(asset.id)}
                                        className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </CustomTooltip>
                        ))
                    ) : (
                        <div className="rounded border text-sm text-gray-500">
                            {isLoading ? (
                                <Skeleton className="h-9 rounded" />
                            ) : (
                                <div className="p-2 border dark:border-gray-800 rounded text-sm text-gray-500">
                                    No Assets selected
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Assets list (infinite scroll) */}
            <div
                onScroll={onLoadMore}
                className="bg-card border border-border shadow-xs rounded max-h-64 grow kt-scrollable-y-auto p-0"
            >
                {isLoading ? (
                    <div className="flex flex-col gap-2 px-2 py-1">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full rounded" />
                        ))}
                    </div>
                ) : !assetsData?.assets?.length ? (
                    <p className="text-center py-4 text-gray-500">No results found</p>
                ) : (
                    assetsData.assets.map((asset) => {
                        const isSelected = isAssetSelected(asset?._id);
                        return (
                            <div
                                key={asset._id}
                                onClick={() => onToggle(asset)}
                                className={`flex items-center p-2 mb-0.5 lg:mb-1.5 cursor-pointer hover:bg-accent ${isSelected ? 'bg-accent' : ''}`}
                            >
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => onToggle(asset)}
                                    className="mr-2"
                                />
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-sm text-gray-700 dark:text-white">
                                        {asset.value}
                                    </span>
                                    <span className="text-xs font-normal text-muted-foreground capitalize">
                                        {asset.type}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}

                {isFetching && !isLoading && (
                    <div className="flex justify-center p-2">
                        <Spinner className="h-5 w-5 text-muted-foreground" />
                    </div>
                )}
            </div>

            <div className="mt-4 flex justify-end">
                <Button onClick={onSave}>
                    <Plus className="mr-2 h-4 w-4" />
                    Update Assets
                </Button>
            </div>
        </div>
    );
}
