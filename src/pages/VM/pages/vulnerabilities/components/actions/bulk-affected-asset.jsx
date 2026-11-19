import React, { useState, useEffect } from 'react';
import { useGetAimAssetsQuery } from '@/services/asset-inventory/assets/assetsApi';
import GetAssetTypeInfo from "@/components/custom/asset-icons";
import { Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Select from '@/components/custom/select';

const BulkAffectedAsset = ({ 
  selectedAffectedAsset, 
  setSelectedAffectedAsset 
}) => {
  const { data: assets, isLoading: isAssetsLoading } = useGetAimAssetsQuery();
  const [assetSearch, setAssetSearch] = useState('');
  const [showSelect, setShowSelect] = useState(false);

  useEffect(() => {
    if (!selectedAffectedAsset) {
      setShowSelect(false);
    }
  }, [selectedAffectedAsset]);

  const assetOptions = assets?.assets?.map(asset => {
    const info = GetAssetTypeInfo(asset.type);
    return {
      label: (
        <div className="flex items-center gap-2">
          {info.icon}
          <span>{asset.value}</span>
          <span className="text-muted-foreground text-[10px]">({info.label})</span>
        </div>
      ),
      searchText: `${asset.value} ${info.label}`,
      value: asset._id,
      asset: asset
    };
  }) || [];

  return (
    <>
      {showSelect ? (
        <Select
          options={[
            { label: 'None', value: 'none' },
            ...assetOptions
          ]}
          placeholder="Select Affected Asset"
          className="w-60"
          onChange={setSelectedAffectedAsset}
          searchField="searchText"
          onSearchChange={(search) => setAssetSearch(search || '')}
          isLoading={isAssetsLoading}
          value={selectedAffectedAsset?.value}
        />
      ) : (
        <Button
          variant="outline"
          onClick={() => setShowSelect(true)}
        >
          <Server className="mr-1 h-4 w-4" />
          Affected Asset
        </Button>
      )}
    </>
  );
};

export default BulkAffectedAsset;
