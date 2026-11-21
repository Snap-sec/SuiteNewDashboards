import { useState } from 'react';
import {
  AlertTriangle,
  Archive,
  ArrowUp,
  Box,
  CheckCircle2,
  ChevronDown,
  Clock,
} from 'lucide-react';

export function EstateOverview({ estate }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const weekly = estate?.weeklyDiscovery || [];
  const scale = estate?.scale || 360;
  const ticks = estate?.ticks || [300, 150, 0];
  const lifecycle = estate?.lifecycle || {
    active: { count: 10924, percent: 85.04 },
    idle: { count: 1112, percent: 8.66 },
    dormant: { count: 552, percent: 4.30 },
    retired: { count: 258, percent: 2.00 },
  };

  const totalNewAssets = weekly.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <section className="card estate-card" id="estate" aria-labelledby="estateTitle">
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="estateTitle">Estate overview</h2>
          <p className="card-sub">Inventory growth and lifecycle across all environments</p>
        </div>
        <div className="card-tools">
          <span className="chip chip-neutral">Last 12 weeks</span>
        </div>
      </div>

      <div className="card-body">
        <div className="estate-hero">
          <div className="estate-main">
            <p className="hero-label">Total assets</p>
            <p className="hero-value">{estate?.totalAssets?.toLocaleString() || '12,846'}</p>
            <p className="hero-delta">
              <ArrowUp className="icon" aria-hidden="true" />
              {estate?.addedThisWeek || 312} this week{' '}
              <span>· {estate?.deltaPercent || '2.5% since Sep 1'}</span>
            </p>
          </div>
          <div className="estate-insight">
            <p className="insight-title">
              <Box className="icon" aria-hidden="true" />
              Where growth comes from
            </p>
            <p>
              <strong>58%</strong> of new assets arrive through cloud and endpoint discovery.
            </p>
          </div>
        </div>

        <div className="chart-block">
          <div className="chart-head">
            <span className="flow-label">New assets per week</span>
            <span className="chart-note">
              <strong>{estate?.addedThisWeek || 312}</strong> this week
            </span>
          </div>

          <div
            className="chart-frame"
            role="img"
            aria-label={`New assets per week over 12 weeks, latest week added ${estate?.addedThisWeek || 312}.`}
          >
            <div className="chart-y" aria-hidden="true">
              {ticks.map((tick) => (
                <span
                  key={tick}
                  style={{ bottom: `${((tick / scale) * 100).toFixed(2)}%` }}
                >
                  {tick}
                </span>
              ))}
            </div>

            <div className="chart-plot">
              <div className="chart-grid" aria-hidden="true">
                {ticks.map((tick) => (
                  <span
                    key={tick}
                    className={tick === 0 ? 'is-baseline' : ''}
                    style={{ bottom: `${((tick / scale) * 100).toFixed(2)}%` }}
                  />
                ))}
              </div>

              <div className="bar-cols">
                {weekly.map((week, index) => {
                  const height = (week.value / scale) * 100;
                  const isLatest = index === weekly.length - 1;
                  return (
                    <div
                      key={week.label}
                      className="bar-col"
                      onMouseEnter={() => setActiveTooltip({ week, index, height })}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      <div
                        className="bar"
                        style={{ height: `${height.toFixed(2)}%` }}
                      />
                      {isLatest && (
                        <span
                          className="bar-value"
                          style={{ bottom: `${height.toFixed(2)}%` }}
                        >
                          {week.value}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {activeTooltip && (
                <div
                  className="chart-tooltip"
                  style={{
                    left: `${((activeTooltip.index + 0.5) / weekly.length) * 100}%`,
                    top: `calc(${100 - activeTooltip.height}% - 36px)`,
                  }}
                >
                  <strong>{activeTooltip.week.value}</strong> new assets
                  <span className="block text-muted-foreground text-[9px] mt-0.5">
                    Week of {activeTooltip.week.label}
                  </span>
                </div>
              )}
            </div>

            <div className="chart-x" aria-hidden="true">
              {[0, 2, 4, 6, 8, 10].map((idx) => (
                weekly[idx] && (
                  <span
                    key={weekly[idx].label}
                    style={{
                      left: `${(((idx + 0.5) / weekly.length) * 100).toFixed(2)}%`,
                    }}
                  >
                    {weekly[idx].label}
                  </span>
                )
              ))}
            </div>
          </div>

          <details className="mini-details">
            <summary>
              <span>
                <strong>{totalNewAssets.toLocaleString()}</strong> new assets over 12 weeks
              </span>
              <span className="mini-summary-action">
                Weekly data <ChevronDown className="icon icon-12" aria-hidden="true" />
              </span>
            </summary>
            <div className="mini-table-wrap">
              <table className="mini-table">
                <thead>
                  <tr>
                    <th scope="col">Week of</th>
                    <th scope="col">New assets</th>
                  </tr>
                </thead>
                <tbody>
                  {weekly.map((week) => (
                    <tr key={week.label}>
                      <td>{week.label}</td>
                      <td>{week.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>

        <div className="lifecycle">
          <div className="lifecycle-head">
            <span className="flow-label">Lifecycle</span>
            <span>
              {lifecycle.active.count.toLocaleString()} active · {lifecycle.active.percent}%
            </span>
          </div>

          <div className="lifecycle-bar" aria-hidden="true">
            <span
              className="life-active"
              style={{ width: `${lifecycle.active.percent}%` }}
            />
            <span
              className="life-idle"
              style={{ width: `${lifecycle.idle.percent}%` }}
            />
            <span
              className="life-dormant"
              style={{ width: `${lifecycle.dormant.percent}%` }}
            />
            <span
              className="life-retired"
              style={{ width: `${lifecycle.retired.percent}%` }}
            />
          </div>

          <div className="lifecycle-legend">
            <span className="lifecycle-key active">
              <CheckCircle2 className="icon" aria-hidden="true" />
              Active <strong>{lifecycle.active.count.toLocaleString()}</strong>
            </span>
            <span className="lifecycle-key idle">
              <Clock className="icon" aria-hidden="true" />
              Idle <strong>{lifecycle.idle.count.toLocaleString()}</strong>
            </span>
            <span className="lifecycle-key dormant">
              <AlertTriangle className="icon" aria-hidden="true" />
              Dormant <strong>{lifecycle.dormant.count.toLocaleString()}</strong>
            </span>
            <span className="lifecycle-key retired">
              <Archive className="icon" aria-hidden="true" />
              Retired <strong>{lifecycle.retired.count.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EstateOverview;

