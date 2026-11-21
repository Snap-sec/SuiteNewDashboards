import { AlertTriangle, Check } from 'lucide-react';

export function InventoryCoverage({ coverage }) {
  const percentage = coverage?.percentage || 96.4;
  const observed = coverage?.observed || 12846;
  const expected = coverage?.expected || 13326;
  const context = coverage?.context || [
    { name: 'Ownership', percent: 95.0, isGap: false },
    { name: 'Criticality', percent: 91.4, isGap: false },
    { name: 'Application', percent: 87.8, isGap: true },
    { name: 'Software', percent: 92.6, isGap: false },
    { name: 'Location', percent: 98.1, isGap: false },
  ];

  return (
    <section className="card coverage-card" aria-labelledby="coverageTitle">
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="coverageTitle">Inventory coverage</h2>
          <p className="card-sub">Observed assets against the expected estate</p>
        </div>
        <div className="card-tools">
          <span className="chip chip-good">
            <Check className="icon icon-12" aria-hidden="true" />
            Above target
          </span>
        </div>
      </div>

      <div className="card-body">
        <p className="metric-label">Estate coverage</p>
        <div className="metric-row">
          <span className="metric-value">{percentage}%</span>
          <span className="metric-meta">
            {observed.toLocaleString()} of {expected.toLocaleString()} expected
          </span>
        </div>
        <div className="coverage-meter" aria-hidden="true">
          <span style={{ width: `${percentage}%` }} />
        </div>

        <div className="field-head">
          <span>Context completeness</span>
          <span>Managed assets</span>
        </div>

        <div className="field-list">
          {context.map((field) => (
            <div key={field.name} className="field-row">
              <div className="field-line">
                <span className="field-name">
                  {field.name}
                  {field.isGap && (
                    <span className="field-gap">
                      <AlertTriangle className="icon" aria-hidden="true" />
                      Gap
                    </span>
                  )}
                </span>
                <span className="field-value">{field.percent.toFixed(1)}%</span>
              </div>
              <div className="field-track">
                <span
                  className={field.isGap ? 'is-gap' : ''}
                  style={{ width: `${field.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="coverage-foot">
          Freshness <strong>93.8%</strong> · observed in the last 24 hours
        </div>
      </div>
    </section>
  );
}

export default InventoryCoverage;

