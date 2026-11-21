const STAGE_DOTS = {
  triage: "stage-triage",
  progress: "stage-progress",
  verify: "stage-verify",
};

export function RemediationBoard({ data }) {
  // Support data.topExposures or derive from columns
  const exposures =
    data.topExposures ||
    (data.columns || []).flatMap((col) =>
      (col.tasks || []).map((t) => ({
        ...t,
        stage: col.stage,
        stageTone: col.tone,
      })),
    ).slice(0, 5);

  return (
    <section className="card board-card" aria-labelledby="remediationTableTitle">
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="remediationTableTitle">
            Top 5 exposures & remediation status
          </h2>
        </div>
      </div>

      <div className="card-body">
        <div className="remediation-table-wrap">
          <table className="remediation-table">
            <thead>
              <tr>
                <th scope="col">Exposure</th>
                <th scope="col">Asset</th>
                <th scope="col">Severity</th>
                <th scope="col">Remediation status</th>
              </tr>
            </thead>
            <tbody>
              {exposures.map((exp, idx) => {
                const sevLower = (exp.severity || "").toLowerCase();
                const stageTone = exp.stageTone || "progress";
                const stageDotClass = STAGE_DOTS[stageTone] ?? "stage-progress";

                return (
                  <tr key={exp.id || `${exp.title}-${idx}`}>
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground leading-snug">
                          {exp.title}
                        </span>
                        {exp.id && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {exp.id} · {exp.assetType || "Asset"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <code className="text-[11px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted/60">
                        {exp.asset}
                      </code>
                    </td>
                    <td>
                      <span className={`sev-pill ${sevLower}`}>
                        <span className="dot" aria-hidden="true" />
                        {exp.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`stage-badge ${stageTone}`}>
                        <span className={`stage-dot ${stageDotClass}`} aria-hidden="true" />
                        {exp.stage}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card-foot">
          <span>
            {data.activeTasks || 25} active tasks across remediation pipelines
          </span>
        </div>
      </div>
    </section>
  );
}

export default RemediationBoard;
