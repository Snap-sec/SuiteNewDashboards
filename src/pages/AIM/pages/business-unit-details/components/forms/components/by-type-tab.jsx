import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssetTypeSection, ASSET_TYPE_SECTIONS } from './asset-type-section';

/**
 * "By Asset Type" tab — renders a section per asset type, each with a
 * multi-select combobox and chip-based selection display.
 */
export function ByTypeTab({ selectedAssets, onToggle, onDeselect, onSave }) {
    return (
        <>
            <div className="mt-4 space-y-5 max-h-[58vh] overflow-y-auto pr-1">
                {ASSET_TYPE_SECTIONS.map((section) => (
                    <AssetTypeSection
                        key={section.type}
                        section={section}
                        selectedAssets={selectedAssets}
                        onToggle={onToggle}
                        onDeselect={onDeselect}
                    />
                ))}
            </div>

            <div className="mt-4 flex justify-end">
                <Button onClick={onSave}>
                    <Plus className="mr-2 h-4 w-4" />
                    Update Assets
                </Button>
            </div>
        </>
    );
}
