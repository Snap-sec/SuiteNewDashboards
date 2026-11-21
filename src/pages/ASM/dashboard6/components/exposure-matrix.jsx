import { Info } from "lucide-react";

const SEVERITY_DOTS = ["dot-critical", "dot-serious", "dot-warn", "dot-low"];

function heatLevel(value) {
  if (value === 0) return 0;
  if (value === 1) return 1;
  if (value <= 3) return 2;
  if (value <= 5) return 3;
  return 4;
}

export function ExposureMatrix({ data }) {
  return (
    <section className="card matrix-card" aria-labelledby="matrixTitle">
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="matrixTitle">
            Exposure matrix
            <span
              className="info"
              role="img"
              aria-label="Open findings by asset type and severity. Darker cells hold more exposures."
              title="Open findings by asset type and severity. Darker cells hold more exposures."
            >
              <Info className="icon" aria-hidden="true" />
            </span>
          </h2>
        </div>
      </div>

      <div className="card-body">
        <div className="heat-wrap">
          {/* Semantic matrix: two categorical axes, not a record table. */}
          <table className="heat-table">
            <caption className="sr-only">
              Open exposures by asset type and severity. Technologies holds the
              largest count, with{" "}
              {Math.max(...data.rows.map((row) => row.total))} exposures.
            </caption>
            <thead>
              <tr>
                <th scope="col">Asset type</th>
                {data.severities.map((severity, index) => (
                  <th key={severity} scope="col">
                    <span className="sev-head">
                      <span
                        className={`dot ${SEVERITY_DOTS[index]}`}
                        aria-hidden="true"
                      />
                      {severity}
                    </span>
                  </th>
                ))}
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.assetType}>
                  <th scope="row">
                    <span className="heat-type">
                      <span
                        className={`series-dot series-${row.series}`}
                        aria-hidden="true"
                      />
                      {row.assetType}
                    </span>
                  </th>
                  {row.counts.map((value, index) => (
                    <td
                      key={`${row.assetType}-${data.severities[index]}`}
                      className={`heat heat-${heatLevel(value)}`}
                    >
                      {value}
                    </td>
                  ))}
                  <td className="heat-total">{row.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Total</th>
                {data.totals.map((total, index) => (
                  <td key={data.severities[index]} className="heat-total">
                    {total}
                  </td>
                ))}
                <td className="heat-total">{data.grandTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="heat-legend" aria-label="Exposure density legend">
          <span>Exposures</span>
          <span className="heat-key">
            <span className="heat-swatch heat-0" />0
          </span>
          <span className="heat-key">
            <span className="heat-swatch heat-1" />1
          </span>
          <span className="heat-key">
            <span className="heat-swatch heat-2" />
            2–3
          </span>
          <span className="heat-key">
            <span className="heat-swatch heat-3" />
            4–5
          </span>
          <span className="heat-key">
            <span className="heat-swatch heat-4" />6
          </span>
        </div>

        <p className="heat-hint">
          Swipe the matrix sideways to see Low and Total.
        </p>

        <div className="card-foot">
          <span>{data.footer}</span>
        </div>
      </div>
    </section>
  );
}
