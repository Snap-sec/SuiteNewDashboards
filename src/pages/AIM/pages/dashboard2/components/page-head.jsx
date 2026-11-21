import { Globe, RefreshCw } from 'lucide-react';

export function PageHead({
  company = 'Northwind Labs',
  environment = 'All environments',
  updatedLabel = 'Updated 4 min ago',
  onSync,
  isSyncing = false,
}) {
  return (
    <header className="page-head">
      <div className="flex flex-col gap-1 min-w-0">
        <h1 className="page-title">Asset inventory</h1>
        <p className="page-sub">
          Know what {company} owns, who is accountable for it, and how the estate is changing.
        </p>
      </div>

      <div className="page-actions">
        <span className="scope-chip">
          <Globe className="icon icon-14" aria-hidden="true" />
          {environment}
        </span>
        <div className="sync-group">
          <span className="sync">
            <span className="live-dot" aria-hidden="true" />
            <span>{isSyncing ? 'Syncing sources…' : updatedLabel}</span>
          </span>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSync}
          disabled={isSyncing}
        >
          <RefreshCw
            className={`icon icon-14 ${isSyncing ? 'spin-animation' : ''}`}
            aria-hidden="true"
          />
          <span>{isSyncing ? 'Syncing…' : 'Sync inventory'}</span>
        </button>
      </div>
    </header>
  );
}

export default PageHead;

