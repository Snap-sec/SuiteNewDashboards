import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export function DiscoverySources({ sources }) {
  const connected = sources?.connected || 18;
  const healthyCount = sources?.healthy || 17;
  const delayedCount = sources?.delayed || 1;
  const healthyPercent = sources?.healthyPercent || 94.4;
  const delayedPercent = sources?.delayedPercent || 5.6;
  const list = sources?.list || [];
  const lastDiscovery = sources?.lastDiscovery || '4 min ago';
  const nextSweep = sources?.nextSweep || 'in 58s';

  return (
    <section className="card sources-card" id="sources" aria-labelledby="sourcesTitle">
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="sourcesTitle">Discovery sources</h2>
          <p className="card-sub">Top sources by primary attribution</p>
        </div>
        <div className="card-tools">
          <span className="chip chip-neutral">{connected} connected</span>
        </div>
      </div>

      <div className="card-body">
        <div className="source-health">
          <div className="health-bar" aria-hidden="true">
            <span className="healthy" style={{ width: `${healthyPercent}%` }} />
            <span className="delayed" style={{ width: `${delayedPercent}%` }} />
          </div>
          <div className="health-legend">
            <span className="health-key healthy">
              <CheckCircle2 className="icon" aria-hidden="true" />
              <strong>{healthyCount}</strong> healthy
            </span>
            <span className="health-key delayed">
              <AlertTriangle className="icon" aria-hidden="true" />
              <strong>{delayedCount}</strong> delayed
            </span>
          </div>
        </div>

        <div className="source-list">
          {list.map((source) => (
            <div key={source.name} className="source-row">
              <span className="source-badge" aria-hidden="true">
                {source.badge}
              </span>
              <div className="source-main">
                <div className="source-name-line">
                  <span className="source-name" title={source.name}>
                    {source.name}
                  </span>
                  <span className="source-sync">{source.sync}</span>
                  {source.delayed && (
                    <span className="source-delayed">Delayed</span>
                  )}
                </div>
              </div>
              <span className="source-count">{source.count.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="source-foot">
          <span>
            <Clock className="icon" aria-hidden="true" />
            Last full discovery <strong>{lastDiscovery}</strong>
          </span>
          <span>
            Next sweep <strong>{nextSweep}</strong>
          </span>
        </div>
      </div>
    </section>
  );
}

export default DiscoverySources;

