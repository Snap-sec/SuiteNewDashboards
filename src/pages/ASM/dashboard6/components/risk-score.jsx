import { AlertTriangle, ArrowDown, Info } from "lucide-react";

const BAND_CLASS = {
  low: "band-low",
  moderate: "band-moderate",
  high: "band-high",
  critical: "band-critical",
};

export function RiskScore({ data }) {
  return (
    <section className="card score-card" aria-labelledby="scoreTitle">
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="scoreTitle">
            Risk score
            <span
              className="info"
              role="img"
              aria-label="A weighted score from exposure severity, patch latency, and identity gaps. Lower is better."
              title="A weighted score from exposure severity, patch latency, and identity gaps. Lower is better."
            >
              <Info className="icon" aria-hidden="true" />
            </span>
          </h2>
        </div>
      </div>

      <div className="card-body score-body">
        <div className="score-headline">
          <span className="score-number">{data.score}</span>
          <span className="score-max">/ 100</span>
          <span className="pill pill-warn">
            <AlertTriangle className="icon" aria-hidden="true" />
            {data.band}
          </span>
        </div>
        <p className="score-delta">
          <ArrowDown className="icon" aria-hidden="true" />
          {data.delta}
        </p>

        <div className="ladder-wrap">
          <div
            className="risk-ladder"
            role="img"
            aria-label={`Risk score ${data.score} out of 100, inside the high band from 60 to 79.`}
          >
            {data.bands.map((band) => (
              <span
                key={band.label}
                className={`band ${BAND_CLASS[band.tone] ?? "band-low"}`}
                style={{ flexGrow: band.weight }}
              />
            ))}
            <span
              className="risk-marker"
              style={{ left: `${data.score}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="ladder-labels" aria-hidden="true">
            {data.bands.map((band) => (
              <span key={band.label}>{band.label}</span>
            ))}
          </div>
        </div>

        <div className="divider" role="presentation" />

        <div className="drivers-head">
          <span>Score drivers</span>
          <span>Risk</span>
        </div>

        <ul className="factor-list">
          {data.drivers.map((driver) => (
            <li key={driver.label} className="factor">
              <div className="factor-top">
                <span>{driver.label}</span>
                <strong>{driver.value}</strong>
              </div>
              <div className="factor-track">
                <span
                  className="factor-fill"
                  style={{ width: `${driver.value}%` }}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="card-foot">
          <span>Lower is better</span>
        </div>
      </div>
    </section>
  );
}
