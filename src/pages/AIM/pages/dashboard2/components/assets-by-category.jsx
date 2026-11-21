import {
  AlertTriangle,
  AppWindow,
  Box,
  Database,
  HardDrive,
  Laptop,
  Network,
  Server,
  UserCheck,
} from 'lucide-react';

const CATEGORY_ICONS = {
  server: Server,
  laptop: Laptop,
  app: AppWindow,
  database: Database,
  identity: UserCheck,
  network: Network,
  container: Box,
  storage: HardDrive,
};

export function AssetsByCategory({ categories }) {
  const totalClasses = categories?.totalClasses || 8;
  const list = categories?.list || [];
  const notice =
    categories?.unmanagedNotice ||
    '1,148 assets are unmanaged · Compute, endpoints, and network hold 68% of the gap.';

  return (
    <section className="card categories-card" id="categories" aria-labelledby="categoriesTitle">
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="categoriesTitle">Assets by category</h2>
          <p className="card-sub">Current inventory by primary asset class</p>
        </div>
        <div className="card-tools">
          <span className="chip chip-neutral">{totalClasses} classes</span>
        </div>
      </div>

      <div className="card-body">
        <div className="category-list">
          {list.map((item) => {
            const IconComponent = CATEGORY_ICONS[item.type] || Server;
            return (
              <div key={item.name} className="category-row">
                <span className="category-icon" aria-hidden="true">
                  <IconComponent className="icon" />
                </span>
                <div className="category-main">
                  <div className="category-top">
                    <span className="category-name">{item.name}</span>
                    <span className="category-numbers">
                      <span className="category-count">{item.count.toLocaleString()}</span>
                      <span className="category-share">{item.share}</span>
                    </span>
                  </div>
                  <div className="category-track" aria-hidden="true">
                    <span style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="category-foot">
          <AlertTriangle className="icon" aria-hidden="true" />
          <span>{notice}</span>
        </div>
      </div>
    </section>
  );
}

export default AssetsByCategory;

