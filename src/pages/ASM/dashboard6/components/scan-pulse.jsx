import { Clock } from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function ScanPulse({ data }) {
  const scheduledDatesMap = new Map(
    (data.scheduledDates || []).map((s) => [s.date, s]),
  );
  const completedDatesMap = new Map(
    (data.completedDates || []).map((c) => [c.date, c]),
  );

  // November 2026: 30 days, starting on Sunday (index 0)
  const totalDays = 30;
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  // Pad with first 5 days of December to complete the 5th week row cleanly
  const paddingDays = [1, 2, 3, 4, 5];

  return (
    <section className="card scan-card" aria-labelledby="scanTitle">
      <div className="card-head">
        <div className="card-titles">
          <h2 className="card-title" id="scanTitle">
            Scan pulse
          </h2>
        </div>
      </div>

      <div className="card-body scan-body">
        {/* Next Scan Callout */}
        <p className="scan-label">Next scan</p>
        <p className="scan-date">
          {data.nextScan} <span>{data.nextScanTime}</span>
        </p>

        {/* Full Month Calendar */}
        <div className="month-calendar">
          <div className="month-header">
            <span className="month-title">{data.month || "November 2026"}</span>
            <span className="month-badge">
              {(data.scheduledDates || []).length} scheduled
            </span>
          </div>

          <div className="calendar-weekdays" aria-hidden="true">
            {WEEKDAYS.map((wd) => (
              <span key={wd} className="cal-weekday">
                {wd}
              </span>
            ))}
          </div>

          <div
            className="calendar-days-grid"
            role="grid"
            aria-label={`Scan schedule for ${data.month || "November 2026"}`}
          >
            {daysArray.map((date) => {
              const isToday = date === data.today;
              const scheduled = scheduledDatesMap.get(date);
              const completed = completedDatesMap.get(date);
              const isNext = scheduled?.status === "next";

              let cellClass = "cal-cell";
              if (isNext) cellClass += " is-scan-next";
              else if (scheduled) cellClass += " is-scan-scheduled";
              else if (completed) cellClass += " is-scan-completed";
              else if (isToday) cellClass += " is-today";

              return (
                <div
                  key={date}
                  className={cellClass}
                  title={
                    isNext
                      ? `Nov ${date}: Next scan at ${scheduled.time} (${scheduled.title})`
                      : scheduled
                        ? `Nov ${date}: Scheduled scan at ${scheduled.time}`
                        : completed
                          ? `Nov ${date}: Completed scan (${completed.findings} findings)`
                          : isToday
                            ? `Nov ${date}: Today`
                            : `Nov ${date}`
                  }
                  aria-label={`November ${date}${
                    isNext
                      ? ", Next scan scheduled"
                      : scheduled
                        ? ", Scan scheduled"
                        : completed
                          ? ", Scan completed"
                          : isToday
                            ? ", Today"
                            : ""
                  }`}
                >
                  <span>{date}</span>
                </div>
              );
            })}

            {/* Muted next month days to keep grid uniform */}
            {paddingDays.map((padDate) => (
              <span
                key={`pad-${padDate}`}
                className="cal-cell is-muted"
                aria-hidden="true"
              >
                <span>{padDate}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Last Scan Footer */}
        <div className="scan-last">
          <Clock className="icon" aria-hidden="true" />
          Last scan {data.lastScan} · {data.lastScanFindings} findings
        </div>
      </div>
    </section>
  );
}

export default ScanPulse;
