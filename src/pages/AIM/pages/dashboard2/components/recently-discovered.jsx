import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  AppWindow,
  Box,
  Clock,
  Database,
  Laptop,
  Network,
  Search,
  Server,
  User,
  UserCheck,
} from 'lucide-react';

const ASSET_ICONS = {
  Compute: Server,
  Container: Box,
  Database: Database,
  Endpoint: Laptop,
  Application: AppWindow,
  Identity: UserCheck,
  'Network device': Network,
};

const STATE_CLASSES = {
  Active: 'state-active',
  Idle: 'state-idle',
  Dormant: 'state-dormant',
  Retired: 'state-retired',
};

export function RecentlyDiscovered({ assets }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allAssets = useMemo(() => assets || [], [assets]);

  const counts = useMemo(
    () => ({
      all: allAssets.length,
      review: allAssets.filter((a) => a.flags?.includes('review')).length,
      unowned: allAssets.filter((a) => a.flags?.includes('unowned') || a.owner === 'Unassigned').length,
    }),
    [allAssets],
  );

  const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {
      // Filter by tab
      if (activeFilter === 'review' && !asset.flags?.includes('review')) {
        return false;
      }
      if (
        activeFilter === 'unowned' &&
        !asset.flags?.includes('unowned') &&
        asset.owner !== 'Unassigned'
      ) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = asset.name.toLowerCase().includes(query);
        const matchId = asset.id.toLowerCase().includes(query);
        const matchType = asset.type.toLowerCase().includes(query);
        const matchOwner = asset.owner.toLowerCase().includes(query);
        const matchSource = asset.source.toLowerCase().includes(query);
        return matchName || matchId || matchType || matchOwner || matchSource;
      }

      return true;
    });
  }, [allAssets, activeFilter, searchQuery]);

  return (
    <section className="card recent-card" id="recent" aria-labelledby="recentTitle">
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="recentTitle">Recently discovered</h2>
          <p className="card-sub">New assets added in the last 24 hours</p>
        </div>
        <div className="card-tools">
          <div className="flex items-center gap-1.5 h-[26px] px-2 border border-border rounded-md bg-muted/40 text-xs">
            <Search className="icon icon-12 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 outline-none text-xs text-foreground placeholder:text-muted-foreground w-24 focus:w-36 transition-[width]"
            />
          </div>
          <div className="filter-tabs" role="group" aria-label="Filter recent assets">
            <button
              className="filter-btn"
              type="button"
              aria-pressed={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            >
              All <span>{counts.all}</span>
            </button>
            <button
              className="filter-btn"
              type="button"
              aria-pressed={activeFilter === 'review'}
              onClick={() => setActiveFilter('review')}
            >
              Needs review <span>{counts.review}</span>
            </button>
            <button
              className="filter-btn"
              type="button"
              aria-pressed={activeFilter === 'unowned'}
              onClick={() => setActiveFilter('unowned')}
            >
              Unowned <span>{counts.unowned}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Recent assets table">
          <table className="asset-table">
            <thead>
              <tr>
                <th scope="col">Asset</th>
                <th scope="col">Type</th>
                <th scope="col">Source</th>
                <th scope="col">Owner</th>
                <th scope="col">State</th>
                <th scope="col">Added</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">
                    No recent assets match this filter.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const IconComp = ASSET_ICONS[asset.type] || Server;
                  const isUnassigned =
                    asset.owner === 'Unassigned' || asset.flags?.includes('unowned');

                  return (
                    <tr key={asset.id}>
                      <td>
                        <div className="asset-cell">
                          <span className="asset-type-icon" aria-hidden="true">
                            <IconComp className="icon" />
                          </span>
                          <div>
                            <span className="asset-name">
                              {asset.name}
                              {asset.flags?.includes('review') && (
                                <span
                                  className="review-flag"
                                  title={asset.reviewMsg || 'Needs review'}
                                  aria-label={asset.reviewMsg || 'Needs review'}
                                >
                                  <AlertTriangle className="icon" aria-hidden="true" />
                                </span>
                              )}
                            </span>
                            <span className="asset-meta">
                              {asset.id} · {asset.source}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="type-cell">{asset.type}</span>
                      </td>
                      <td>
                        <span className="type-cell">{asset.source}</span>
                      </td>
                      <td>
                        {isUnassigned ? (
                          <span className="owner-missing">
                            <User className="icon" aria-hidden="true" />
                            Unassigned
                          </span>
                        ) : (
                          <span className="owner-name">{asset.owner}</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`state-pill ${STATE_CLASSES[asset.state] || 'state-active'}`}
                        >
                          {asset.state}
                        </span>
                      </td>
                      <td className="added-cell">{asset.added}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="recent-foot">
          <span>Showing {filteredAssets.length} recent assets</span>
          <span>
            <Clock className="icon" aria-hidden="true" />
            Last sync <strong>4 min ago</strong>
          </span>
        </div>
      </div>
    </section>
  );
}

export default RecentlyDiscovered;
