const DOT_CLASS = {
  discovery: "discovery",
  resolved: "resolved",
  changed: "changed",
  scan: "scan",
};

export function SurfaceChanges({ data }) {
  return (
    <section className="card timeline-card" aria-labelledby="timelineTitle">
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="timelineTitle">
            Surface changes
          </h2>
        </div>
        <div className="card-tools">
          <span className="chip chip-neutral">{data.thisWeek} this week</span>
        </div>
      </div>

      <div className="card-body">
        <ol className="timeline">
          {data.events.map((event, index) => (
            <li key={`${event.title}-${index}`} className="tl-item">
              <span
                className={`tl-dot ${DOT_CLASS[event.kind] ?? "scan"}`}
                aria-hidden="true"
              />
              <div className="tl-body">
                <p className="tl-title">{event.title}</p>
                <p className="tl-asset">{event.asset}</p>
              </div>
              <span className="tl-time">{event.time}</span>
            </li>
          ))}
        </ol>

        <div className="card-foot">
          <span>Showing 5 recent changes</span>
        </div>
      </div>
    </section>
  );
}
