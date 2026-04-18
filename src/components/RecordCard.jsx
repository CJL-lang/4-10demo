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

function getResultClass(result) {
    if (result === "达标") {
        return "is-good";
    }
    if (result === "部分达标") {
        return "is-mid";
    }
    if (result === "未达标") {
        return "is-alert";
    }
    return "";
}

export default function RecordCard({ record, onClick }) {
    const { t } = useTranslation();
    const isInteractive = typeof onClick === "function";
    const coachAvatar = getCoachAvatarLabel(record.coach);
    const resultClass = getResultClass(record.result);
    const translatedRecord = {
        date: t(`records.${record.id}.date`, { defaultValue: record.date }),
        title: t(`records.${record.id}.title`, { defaultValue: record.title }),
        drill: t(`records.${record.id}.drill`, { defaultValue: record.drill }),
        note: t(`records.${record.id}.note`, { defaultValue: record.note }),
    };
    const translatedResult =
        record.result === "达标"
            ? t("recordCard.result.passed")
            : record.result === "部分达标"
              ? t("recordCard.result.partial")
              : record.result === "未达标"
                ? t("recordCard.result.failed")
                : record.result;

    return (
        <article
            className={`record-card ${isInteractive ? "record-card-clickable" : ""}`}
            role={isInteractive ? "button" : undefined}
            tabIndex={isInteractive ? 0 : undefined}
            onClick={isInteractive ? () => onClick(record) : undefined}
            onKeyDown={
                isInteractive
                    ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              onClick(record);
                          }
                      }
                    : undefined
            }
        >
            <div className="record-date">
                <span>{translatedRecord.date}</span>
                {record.time && (
                    <span style={{ marginLeft: "12px", color: "var(--tertiary)", fontSize: "12px" }}>{record.time}</span>
                )}
            </div>
            <div className="record-headline">
                <h4 style={{ fontSize: "18px" }}>{translatedRecord.title}</h4>
                <span className="record-type">{t("recordFilters.skills", { defaultValue: record.type })}</span>
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
                {record.result ? <span className={`record-result-chip ${resultClass}`}>{translatedResult}</span> : null}
            </div>

            <p className="record-note">{translatedRecord.note}</p>
            {isInteractive ? <p className="record-report-entry-hint">{t("recordCard.viewReport")}</p> : null}
        </article>
    );
}
