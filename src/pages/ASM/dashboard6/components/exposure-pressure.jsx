import { ArrowDown, ChevronDown, Info } from "lucide-react";
import { FlowChart } from "./flow-chart";

const SPLIT_DOTS = {
  critical: "dot-critical",
  serious: "dot-serious",
  low: "dot-low",
};

export function ExposurePressure({ data }) {
  const { flow, flowSummary } = data;

  return (
    <section className="card pressure-card" aria-labelledby="pressureTitle">
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="pressureTitle">
            Exposure pressure
            <span
              className="info"
              role="img"
              aria-label="Open exposures today and the weekly balance of newly opened and resolved findings."
              title="Open exposures today and the weekly balance of newly opened and resolved findings."
            >
              <Info className="icon" aria-hidden="true" />
            </span>
          </h2>
        </div>
      </div>

      <div className="card-body pressure-body">
        <div className="pressure-main">
          <div className="pressure-hero">
            <p className="pressure-label">Open exposures</p>
            <p className="pressure-value">{data.open}</p>
            <p className="pressure-delta">
              <ArrowDown className="icon" aria-hidden="true" />
              {data.delta}
            </p>
            <ul className="pressure-split" aria-label="Severity split">
              {data.split.map((item) => (
                <li key={item.label}>
                  <span
                    className={`dot ${SPLIT_DOTS[item.tone] ?? "dot-low"}`}
                    aria-hidden="true"
                  />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="flow-side">
            <div className="flow-head">
              <span className="flow-label">Weekly flow</span>
              <div className="legend" aria-hidden="true">
                <span className="legend-item">
                  <span className="legend-key open" />
                  Opened
                </span>
                <span className="legend-item">
                  <span className="legend-key resolved" />
                  Resolved
                </span>
              </div>
            </div>
            <FlowChart flow={flow} summary={flowSummary} />
          </div>
        </div>

        <details className="mini-details">
          <summary>
            <span>
              <strong>{flowSummary.resolved}</strong> resolved ·{" "}
              <strong>{flowSummary.opened}</strong> opened over{" "}
              {flowSummary.weeks} weeks
            </span>
            <span className="mini-summary-action">
              Weekly data <ChevronDown className="icon" aria-hidden="true" />
            </span>
          </summary>
          <div className="mini-table-wrap">
            {/* Semantic table for the weekly flow readout, not a record grid. */}
            <table className="mini-table">
              <caption className="sr-only">
                Weekly opened and resolved exposure counts for the last{" "}
                {flowSummary.weeks} weeks.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Week of</th>
                  <th scope="col">Opened</th>
                  <th scope="col">Resolved</th>
                </tr>
              </thead>
              <tbody>
                {flow.labels.map((label, index) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{flow.opened[index]}</td>
                    <td>{flow.resolved[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </section>
  );
}
