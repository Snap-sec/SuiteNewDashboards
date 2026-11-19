import { useState } from "react";
import { SearchInput } from "@/components/custom/search";
import { useGetAimPublicAssetsQuery } from "../../../../../services/asset-inventory/assets/public-assets.js";
import { useParams, useNavigate } from "react-router-dom";
import { ContentLoader } from "../../../../../components/common/content-loader";


function GlobalSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: searchResults, isLoading } = useGetAimPublicAssetsQuery({
    orgId: id,
    search: searchTerm,
    limit: 10,
    page: 1
  }, {
    skip: !id
  });

  const suggestions = searchResults?.assets || [];

  const handleAssetClick = (assetId) => {
    navigate(`/pages/public/asset-detail/${id}/${assetId}`);
  };


  if (isLoading) {
    return(
      <ContentLoader />
    )
  }


  return (
    <div className="flex flex-col items-center justify-center h-screen" style={{margin: '0px auto'}}>

      <div className="flex flex-col gap-4 mb-6 items-center">
          <img 
             class="min-w-12 max-w-[70px] shrink-0 rounded-lg" 
             alt="image" 
             src={`https://img.logo.dev/${searchResults?.orgDetails?.website?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}?token=pk_YDuXMfwrRe2kQtBuzc3Etg&size=64&retina=true`} 
          />

          <h2 className="text-base font-semibold leading-none tracking-tight">
            {searchResults?.orgDetails?.name} Asset Inventory
          </h2>
      </div>

      <div className="relative w-[600px]">
        <SearchInput
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            setShowSuggestions(true);
          }}
          className="w-full"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          inputClass="h-12 pl-10 pr-10"
          placeholder="Search Assets..."
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 max-h-[400px] grow kt-scrollable-y-auto mt-1 border border-default w-full rounded-md bg-popover text-popover-foreground p-default animate-fade-in">
            {suggestions.map((asset, idx) => (
              <li
                key={asset._id}
                onClick={() => handleAssetClick(asset._id)}
                className="px-4 py-2 cursor-pointer hover:bg-accent"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{asset.value}</span>
                  <span className="text-sm text-muted-foreground">{asset.type}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {showSuggestions && isLoading && (
          <div className="absolute z-50 top-full mt-1 border border-default w-full rounded-md bg-popover text-popover-foreground p-4">
            Loading...
          </div>
        )}

        {showSuggestions && !isLoading && suggestions.length === 0 && searchTerm && (
          <div className="absolute z-50 top-full mt-1 border border-default w-full rounded-md bg-popover text-popover-foreground p-4">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}

export default GlobalSearch;
