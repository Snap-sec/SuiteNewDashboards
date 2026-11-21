export function AssetTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div
      className="flex items-center gap-1.5 border-b border-border pb-2.5 overflow-x-auto select-none"
      role="tablist"
      aria-label="Asset categories"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs transition-all ${
              isActive
                ? "bg-card border border-border text-primary shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40 font-medium"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 text-[10.5px] rounded-full font-mono font-medium ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {tab.count.toLocaleString()}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default AssetTabs;
