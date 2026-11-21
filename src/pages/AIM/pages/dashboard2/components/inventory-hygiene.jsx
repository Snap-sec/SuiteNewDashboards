import { Clock, GitMerge, Tag, User } from 'lucide-react';

const HYGIENE_ICONS = {
  owner: User,
  classify: Tag,
  stale: Clock,
  duplicate: GitMerge,
};

export function InventoryHygiene({ hygiene }) {
  const openFlags = hygiene?.openFlags || 1382;
  const checksCount = hygiene?.checksCount || 4;
  const checks = hygiene?.checks || [];
  const footer = hygiene?.footer || 'Next hygiene pass at 02:00 UTC · rules run nightly';

  return (
    <section className="card hygiene-card" aria-labelledby="hygieneTitle">
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="hygieneTitle">Inventory hygiene</h2>
          <p className="card-sub">Data-quality flags from the nightly inventory pass</p>
        </div>
        <div className="card-tools">
          <span className="chip chip-neutral">{checksCount} checks</span>
        </div>
      </div>

      <div className="card-body">
        <div className="hygiene-hero">
          <p className="metric-label">Open review flags</p>
          <div className="metric-row">
            <span className="metric-value">{openFlags.toLocaleString()}</span>
            <span className="metric-meta">across {checksCount} checks</span>
          </div>
        </div>

        <div className="hygiene-list">
          {checks.map((check) => {
            const IconComp = HYGIENE_ICONS[check.type] || Tag;
            return (
              <div key={check.id} className="hygiene-row">
                <span className={`hygiene-icon ${check.type}`} aria-hidden="true">
                  <IconComp className="icon" />
                </span>
                <div className="hygiene-copy">
                  <strong>{check.title}</strong>
                  <span>{check.description}</span>
                </div>
                <span className="hygiene-count">{check.count.toLocaleString()}</span>
              </div>
            );
          })}
        </div>

        <div className="hygiene-foot">
          <Clock className="icon" aria-hidden="true" />
          <span>{footer}</span>
        </div>
      </div>
    </section>
  );
}

export default InventoryHygiene;

