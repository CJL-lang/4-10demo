import { useTranslation } from "react-i18next";

function getCoachAvatarLabel(coachName) {
    const pure = (coachName || "").replace(/^教练\s*/u, "").trim();
    if (!pure) {
        return "CO";
    }

    const tokens = pure.split(/\s+/u).filter(Boolean);
    if (tokens.length >= 2) {
        return `${tokens[0][0]}${tokens[1][0]}`.toUpperCase();
    }

    if (/^[\u4e00-\u9fa5]+$/u.test(tokens[0])) {
        return tokens[0].slice(0, 2);
    }

    return tokens[0].slice(0, 2).toUpperCase();
}

export default function RecordCard({ record, onReport, onHomework }) {
    const { t } = useTranslation();
    const hasReport = typeof onReport === "function";
    const hasHomework = typeof onHomework === "function";
    const showActions = hasReport || hasHomework;
    const singleAction = (hasReport && !hasHomework) || (!hasReport && hasHomework);
    const coachAvatar = getCoachAvatarLabel(record.coach);
    const translatedRecord = {
        date: t(`records.${record.id}.date`, { defaultValue: record.date }),
        title: t(`records.${record.id}.title`, { defaultValue: record.title }),
        drill: t(`records.${record.id}.drill`, { defaultValue: record.drill }),
        note: t(`records.${record.id}.note`, { defaultValue: record.note }),
    };

    return (
        <article className={`record-card ${showActions ? "record-card--has-actions" : ""}`}>
            <div className="record-date">
                <span>{translatedRecord.date}</span>
                {record.time && (
                    <span style={{ marginLeft: "12px", color: "var(--tertiary)", fontSize: "12px" }}>{record.time}</span>
                )}
            </div>
            <div className="record-headline">
                <h4 style={{ fontSize: "18px" }}>{translatedRecord.title}</h4>
                <span className="record-type">{t("recordFilters.skills")}</span>
            </div>

            {translatedRecord.drill && (
                <div style={{ margin: "-4px 0 16px", fontSize: "13px", color: "var(--primary)" }}>
                    {t("recordCard.drill")}:{translatedRecord.drill}
                </div>
            )}

            <div className="record-coach-row">
                <div
                    className="record-coach-avatar"
                    aria-hidden="true"
                    style={
                        record.avatarUrl
                            ? {
                                  backgroundImage: `url(${record.avatarUrl})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  color: "transparent",
                              }
                            : {}
                    }
                >
                    {!record.avatarUrl && coachAvatar}
                </div>
                <div className="record-coach-meta">
                    <p className="record-coach-label">{t("recordCard.headCoach")}</p>
                    <div className="record-coach">{record.coach}</div>
                </div>
            </div>

            <p className="record-note">{translatedRecord.note}</p>

            {showActions ? (
                <div
                    className={`record-card-actions ${singleAction ? "record-card-actions--single" : ""}`}
                    role="group"
                    aria-label={t("recordCard.actionsGroupAria")}
                >
                    {hasReport ? (
                        <button
                            type="button"
                            className="record-card-action-btn record-card-action-btn--report"
                            onClick={() => onReport(record)}
                        >
                            {t("recordCard.viewReport")}
                        </button>
                    ) : null}
                    {hasHomework ? (
                        <button
                            type="button"
                            className="record-card-action-btn record-card-action-btn--homework"
                            onClick={() => onHomework(record)}
                        >
                            {t("recordCard.viewHomework")}
                        </button>
                    ) : null}
                </div>
            ) : null}
        </article>
    );
}
