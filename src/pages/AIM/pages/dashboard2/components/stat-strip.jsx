import { CheckCircle2, Layers, Plus, User } from 'lucide-react';

export function StatStrip({ metrics }) {
  const data = metrics || {
    totalAssets: 12846,
    managed: 11698,
    unowned: 648,
    addedThisWeek: 312,
  };

  return (
    <section className="stat-strip" aria-label="Inventory summary">
      <div className="stat">
        <Layers className="icon icon-14" aria-hidden="true" />
        <span className="stat-value">{data.totalAssets.toLocaleString()}</span>
        <span className="stat-label">total assets</span>
      </div>
      <div className="stat">
        <CheckCircle2 className="icon icon-14" aria-hidden="true" />
        <span className="stat-value">{data.managed.toLocaleString()}</span>
        <span className="stat-label">managed</span>
      </div>
      <div className="stat stat-warn">
        <User className="icon icon-14" aria-hidden="true" />
        <span className="stat-value">{data.unowned.toLocaleString()}</span>
        <span className="stat-label">unowned</span>
      </div>
      <div className="stat">
        <Plus className="icon icon-14" aria-hidden="true" />
        <span className="stat-value">{data.addedThisWeek.toLocaleString()}</span>
        <span className="stat-label">added this week</span>
      </div>
    </section>
  );
}

export default StatStrip;

