import { useTranslation } from "react-i18next";

export default function CoachCard({ coach, compact = false, selectable = false, selected = false, onClick }) {
    const { t } = useTranslation();
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

    const translatedCourseName = coach.courseName
        ? t(`courseAssets.${coach.id}.courseName`, { defaultValue: coach.courseName })
        : coach.name;
    const translatedDrill = coach.drill
        ? t(`courseAssets.${coach.id}.drill`, { defaultValue: coach.drill })
        : "";

    return (
        <article className={`coach-card ${compact ? "compact" : ""} ${selectable ? "selectable" : ""} ${selected ? "selected" : ""}`} {...interactiveProps}>
            <div className="coach-avatar" style={coach.avatarUrl ? {
                backgroundImage: `url(${coach.avatarUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'transparent'
            } : {}}>{!coach.avatarUrl && coach.initials}</div>
            <div className="coach-content">
                <div className="coach-title-row">
                    <h4 style={{ fontSize: '18px' }}>{translatedCourseName}</h4>
                    {coach.score ? <span className="coach-score">★ {coach.score}</span> : null}
                    {coach.time ? <span className="coach-badge" style={{ backgroundColor: 'rgba(255, 202, 104, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', whiteSpace: 'nowrap' }}>{coach.time}</span> : (coach.badge ? <span className="coach-badge">{coach.badge}</span> : null)}
                </div>
                {coach.courseName ? <p className="coach-subtitle" style={{ color: 'var(--on-surface-variant)', fontSize: '13px', margin: '4px 0' }}>{t("coachCard.coach")}：{coach.name} <span style={{ opacity: 0.6 }}>| {coach.title}</span></p> : <p className="coach-subtitle">{coach.title}</p>}
                {translatedDrill ? <p className="coach-desc" style={{ marginTop: '8px', color: 'var(--tertiary)' }}>{t("coachCard.specialTraining")}：{translatedDrill}</p> : (coach.desc ? <p className="coach-desc">{coach.desc}</p> : null)}
            </div>
        </article>
    );
}
