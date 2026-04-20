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

export default function RecordCard({ record, onClick, onReport, onHomework }) {
    const { t } = useTranslation();
    const openReport = onReport ?? onClick;
    const hasReport = typeof openReport === "function";
    const hasHomework = typeof onHomework === "function";
    const showActions = hasReport || hasHomework;
    const dualActions = hasReport && hasHomework;

    const coachAvatar = getCoachAvatarLabel(record.coach);
    const translatedRecord = {
        date: t(`records.${record.id}.date`, { defaultValue: record.date }),
        title: t(`records.${record.id}.title`, { defaultValue: record.title }),
        drill: t(`records.${record.id}.drill`, { defaultValue: record.drill }),
        note: t(`records.${record.id}.note`, { defaultValue: record.note }),
    };

    return (
        <article className="panel panel-low growth-session-card">
            <div className="growth-session-card__meta">
                <span className="growth-session-card__date">{translatedRecord.date}</span>
                {record.time ? <span className="growth-session-card__time">{record.time}</span> : null}
            </div>
            <div className="growth-session-card__head">
                <h3 className="growth-session-card__title">{translatedRecord.title}</h3>
                <span className="growth-session-card__pill">{t("growth.skillPill")}</span>
            </div>

            {translatedRecord.drill ? (
                <p className="growth-session-card__drill">
                    {t("recordCard.drill")}: {translatedRecord.drill}
                </p>
            ) : null}

            <div className="growth-session-card__coach">
                {record.avatarUrl ? (
                    <img className="growth-session-card__avatar" src={record.avatarUrl} alt="" />
                ) : (
                    <div className="growth-session-card__avatar growth-session-card__avatar--initials" aria-hidden="true">
                        {coachAvatar}
                    </div>
                )}
                <div className="growth-session-card__coach-text">
                    <span className="growth-session-card__coach-role">{t("growth.coachRoleLead")}</span>
                    <span className="growth-session-card__coach-name">{record.coach}</span>
                </div>
            </div>

            <p className="growth-session-card__note">{translatedRecord.note}</p>

            {showActions ? (
                <div
                    className={`record-card-cta-row ${dualActions ? "" : "record-card-cta-row--single"}`}
                    role="group"
                    aria-label={t("recordCard.actionsGroupAria")}
                >
                    {hasReport ? (
                        <button
                            type="button"
                            className="growth-session-card__cta"
                            onClick={() => openReport(record)}
                        >
                            {t("recordCard.viewReport")}
                        </button>
                    ) : null}
                    {hasHomework ? (
                        <button
                            type="button"
                            className="growth-session-card__cta"
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
