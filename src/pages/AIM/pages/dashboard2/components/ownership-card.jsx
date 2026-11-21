import { User } from 'lucide-react';

export function OwnershipCard({ ownership }) {
  const coveredPercent = ownership?.coveredPercent || 95.0;
  const assetsWithOwner = ownership?.assetsWithOwner || 12198;
  const teams = ownership?.teams || [
    { name: 'Platform', count: 4128, percent: 100 },
    { name: 'Corporate IT', count: 3842, percent: 93.1 },
    { name: 'Customer Engineering', count: 2214, percent: 53.6 },
    { name: 'Data & Analytics', count: 1406, percent: 34.1 },
    { name: 'Security', count: 608, percent: 14.7 },
  ];
  const unassigned = ownership?.unassigned || {
    count: 648,
    title: '648 assets unassigned',
    description: 'No accountable team in AD or CMDB',
    badge: 'Open',
  };

  return (
    <section className="card ownership-card" aria-labelledby="ownershipTitle">
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="ownershipTitle">Ownership</h2>
          <p className="card-sub">Accountable teams across the inventory</p>
        </div>
        <div className="card-tools">
          <span className="chip chip-neutral">{coveredPercent}% covered</span>
        </div>
      </div>

      <div className="card-body">
        <p className="metric-label">Owner coverage</p>
        <div className="metric-row">
          <span className="metric-value">{assetsWithOwner.toLocaleString()}</span>
          <span className="metric-meta">assets with an owner</span>
        </div>
        <div className="coverage-meter" aria-hidden="true">
          <span style={{ width: `${coveredPercent}%` }} />
        </div>

        <div className="field-head">
          <span>Assets by owner team</span>
          <span>Top 5</span>
        </div>

        <div className="team-list">
          {teams.map((team) => (
            <div key={team.name} className="team-row">
              <span className="team-name" title={team.name}>
                {team.name}
              </span>
              <span className="team-bar" aria-hidden="true">
                <span style={{ width: `${team.percent}%` }} />
              </span>
              <span className="team-count">{team.count.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="owner-callout">
          <span className="owner-callout-icon" aria-hidden="true">
            <User className="icon" />
          </span>
          <div className="owner-callout-copy">
            <strong>{unassigned.title}</strong>
            <span>{unassigned.description}</span>
          </div>
          <span className="chip chip-warn">{unassigned.badge}</span>
        </div>
      </div>
    </section>
  );
}

export default OwnershipCard;

