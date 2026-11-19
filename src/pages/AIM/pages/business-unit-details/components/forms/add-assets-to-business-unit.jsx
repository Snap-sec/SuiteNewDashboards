import { useEffect, useState } from 'react';
import { Plus, Globe, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Modal } from '@/components/custom/modal';
import {
    useAddAimBusinessUnitAssetsMutation,
    useGetAimAssetBusinessUnitByIdQuery,
} from '../../../../../../services/asset-inventory/businessUnitsApi';
import { useGetAimAssetsQuery } from '../../../../../../services/asset-inventory/assets/assetsApi';
import { ByTypeTab } from './components/by-type-tab';
import { GenericTab } from './components/generic-tab';

/**
 * Modal to add / remove assets from a business unit.
 * All state and data-fetching live here; UI is delegated to tab components.
 *
 * @param {string} props.businessUnitId
 */
const AddAssetsToBusinessUnitModal = ({ businessUnitId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('by-type');

    // ── Existing BU assets ────────────────────────────────────────────────────
    const { data: businessUnitAssets, isLoading: isAssetsLoading } =
        useGetAimAssetBusinessUnitByIdQuery(businessUnitId);

    // ── Selection state ───────────────────────────────────────────────────────
    const [selectedAssets, setSelectedAssets] = useState([]);

    useEffect(() => {
        setSelectedAssets(
            businessUnitAssets?.assets?.map((asset) => ({
                id: asset._id,
                value: asset.value,
                type: asset.type,
                isCurrentAsset: true,
            })) || [],
        );
    }, [businessUnitAssets]);

    // ── Generic-tab search + pagination ───────────────────────────────────────
    const [limit, setLimit] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // ── Assets query (only for the Generic tab) ────────────────────────────────
    const {
        data: assetsData,
        isLoading: isAssetsDataLoading,
        isFetching: isAssetsDataFetching,
    } = useGetAimAssetsQuery(
        { search: debouncedSearchTerm, page: 1, limit, unified_view: true },
        { skip: !isModalOpen || activeTab !== 'generic' },
    );

    const [addAssetsToBusinessUnit] = useAddAimBusinessUnitAssetsMutation();

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleToggleSelect = (asset) => {
        setSelectedAssets((prev) => {
            const already = prev.find((a) => a.id === asset._id);
            if (already) return prev.filter((a) => a.id !== asset._id);
            return [...prev, { id: asset._id, value: asset.value, type: asset.type, isCurrentAsset: false }];
        });
    };

    const handleDeselect = (assetId) =>
        setSelectedAssets((prev) => prev.filter((a) => a.id !== assetId));

    const handleSave = () => {
        const allSelectedIds = selectedAssets.map((a) => a.id);
        const originalIds = new Set(businessUnitAssets?.assets?.map((a) => a._id) || []);
        const unchanged =
            allSelectedIds.length === originalIds.size &&
            allSelectedIds.every((id) => originalIds.has(id));

        if (unchanged) return toast.error('No changes to save');

        toast.promise(
            addAssetsToBusinessUnit({ businessUnitId, assetIds: allSelectedIds }).unwrap(),
            {
                loading: 'Updating assets in business unit…',
                success: 'Assets updated successfully!',
                error: 'Failed to update assets.',
            },
        );
        setIsModalOpen(false);
    };

    const isAssetSelected = (assetId) => selectedAssets?.some((a) => a?.id === assetId);

    // Infinite scroll handler for the Generic tab
    const handleListScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            if (limit < assetsData?.pagination?.total && !isAssetsDataFetching) {
                setLimit((prev) => prev + 20);
            }
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <Modal
            className="w-full sm:w-[90%] md:w-[600px] lg:w-[600px] xl:w-[800px]"
            title={
                businessUnitAssets?.assets?.length === 0
                    ? 'Add Assets To Business Unit'
                    : 'Manage Business Unit Assets'
            }
            description="Choose an asset type, then attach the assets that belong to it."
            open={isModalOpen}
            setOpen={setIsModalOpen}
            trigger={
                <Button onClick={() => setIsModalOpen(true)} variant="outline" className="-mt-1">
                    <Plus />
                    Add Assets
                </Button>
            }
        >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList variant="line" size="md" className="w-full">
                    <TabsTrigger value="by-type">
                        <Globe className=" h-4 w-4" />
                        Web Application
                    </TabsTrigger>
                    <TabsTrigger value="generic">
                        <LayoutGrid className=" h-4 w-4" />
                        Generic
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="by-type">
                    <ByTypeTab
                        selectedAssets={selectedAssets}
                        onToggle={handleToggleSelect}
                        onDeselect={handleDeselect}
                        onSave={handleSave}
                    />
                </TabsContent>

                <TabsContent value="generic">
                    <GenericTab
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        selectedAssets={selectedAssets}
                        onDeselect={handleDeselect}
                        assetsData={assetsData}
                        isLoading={isAssetsDataLoading || isAssetsLoading}
                        isFetching={isAssetsDataFetching}
                        isAssetSelected={isAssetSelected}
                        onToggle={handleToggleSelect}
                        onLoadMore={handleListScroll}
                        onSave={handleSave}
                    />
                </TabsContent>
            </Tabs>
        </Modal>
    );
};

export default AddAssetsToBusinessUnitModal;
