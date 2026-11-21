export function PriorityQueue({ data }) {
  return (
    <section
      className="card queue-card"
      id="priority-queue"
      aria-labelledby="queueTitle"
    >
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="queueTitle">
            Priority queue
          </h2>
        </div>
      </div>

      <div className="card-body">
        <ul className="queue-list">
          {data.items.map((item) => (
            <li key={item.asset} className="queue-item">
              <span className="queue-rank" aria-hidden="true">
                {String(item.rank).padStart(2, "0")}
              </span>
              <div className="queue-main">
                <div className="queue-title">{item.asset}</div>
                <div className="queue-meta">
                  <span>{item.open} open</span>
                  <span>·</span>
                  <span>{item.type}</span>
                  <span>·</span>
                  <span>{item.team}</span>
                </div>
              </div>
              <div className="queue-exposure flex items-center justify-end shrink-0 pt-0.5">
                <span className="chip chip-critical font-medium">
                  {item.open} {item.open === 1 ? "Exposure" : "Exposures"}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="card-foot">
          <span>
            Showing {data.items.length} of {data.total} priority assets
          </span>
        </div>
      </div>
    </section>
  );
}

export default PriorityQueue;
