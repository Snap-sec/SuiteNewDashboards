import { useMemo, useState } from "react";
import { toast } from "sonner";
import response from "./data/response.json";
import { PageHead } from "./components/page-head";
import { AssetFilters } from "./components/asset-filters";
import { AssetTabs } from "./components/asset-tabs";
import { AssetTable } from "./components/asset-table";
import "../dashboard6/styles.css";

export function AllAssetsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    environment: null,
    cloud: null,
    severity: null,
    status: null,
    onlyExposed: null,
  });

  const handleScan = () => {
    toast.success("Discovery scan scheduled", {
      description: "Inventory refresh queued for all perimeters.",
    });
  };

  const handleExport = () => {
    toast.success("Export initiated", {
      description: "Downloading asset inventory as CSV format.",
    });
  };

  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      environment: null,
      cloud: null,
      severity: null,
      status: null,
      onlyExposed: null,
    });
    setSearchQuery("");
  };

  // Filter assets based on activeTab, searchQuery, and selectedFilters
  const filteredAssets = useMemo(() => {
    return (response.assets || []).filter((asset) => {
      // 1. Tab filter: 'all', 'ip', 'subdomains', 'server', 'dns'
      if (activeTab !== "all" && asset.type !== activeTab) {
        return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = asset.name?.toLowerCase().includes(query);
        const matchesIp = asset.ip?.toLowerCase().includes(query);
        const matchesTech = (asset.technologies || []).some((t) =>
          t.toLowerCase().includes(query),
        );
        const matchesTeam = asset.team?.toLowerCase().includes(query);
        if (!matchesName && !matchesIp && !matchesTech && !matchesTeam) {
          return false;
        }
      }

      // 3. Environment filter
      if (
        selectedFilters.environment &&
        asset.environment !== selectedFilters.environment
      ) {
        return false;
      }

      // 4. Cloud filter
      if (selectedFilters.cloud && asset.cloud !== selectedFilters.cloud) {
        return false;
      }

      // 5. Severity filter
      if (
        selectedFilters.severity &&
        asset.topSeverity !== selectedFilters.severity
      ) {
        return false;
      }

      // 6. Only exposed filter
      if (selectedFilters.onlyExposed && asset.exposuresCount === 0) {
        return false;
      }

      // 7. Status filter
      if (selectedFilters.status && asset.status !== selectedFilters.status) {
        return false;
      }

      return true;
    });
  }, [activeTab, searchQuery, selectedFilters]);

  return (
    <div className="surface-command">
      <div className="sc-content">
        <PageHead
          workspace={response.workspace}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onScan={handleScan}
          onExport={handleExport}
        />

        {/* Centralized Layout: 3 Stacked Filter cards on left, Tabs + Asset Table on right */}
        <div className="flex flex-col lg:flex-row items-start gap-5 min-w-0">
          {/* Left: 3 Stacked Filter Cards as in wireframe */}
          <AssetFilters
            filterOptions={response.filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />

          {/* Right: Asset category tabs at top + Asset table */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
            <AssetTabs
              tabs={response.tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <AssetTable
              assets={filteredAssets}
              totalCount={response.summary?.total || 1284}
              activeTab={activeTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllAssetsPage;

