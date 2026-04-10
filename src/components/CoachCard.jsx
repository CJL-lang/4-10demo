export default function CoachCard({ coach, compact = false, selectable = false, selected = false, onClick }) {
    const interactiveProps = selectable
        ? {
              role: "button",
              tabIndex: 0,
              onClick,
              onKeyDown: (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onClick?.();
                  }
              },
          }
        : {};

    return (
        <article className={`coach-card ${compact ? "compact" : ""} ${selectable ? "selectable" : ""} ${selected ? "selected" : ""}`} {...interactiveProps}>
            <div className="coach-avatar">{coach.initials}</div>
            <div className="coach-content">
                <div className="coach-title-row">
                    <h4>{coach.name}</h4>
                    {coach.score ? <span className="coach-score">★ {coach.score}</span> : null}
                    {coach.badge ? <span className="coach-badge">{coach.badge}</span> : null}
                </div>
                {coach.courseName ? <p className="coach-course-name">{coach.courseName}</p> : null}
                <p className="coach-subtitle">{coach.title}</p>
                {coach.desc ? <p className="coach-desc">{coach.desc}</p> : null}
            </div>
        </article>
    );
}
