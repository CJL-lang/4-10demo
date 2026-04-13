import { useTranslation } from "react-i18next";

function IconImagePlaceholder() {
    return (
        <svg className="record-report-media-svg" viewBox="0 0 48 48" width="48" height="48" aria-hidden>
            <rect x="6" y="10" width="36" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.85" />
            <circle cx="17" cy="22" r="3.5" fill="currentColor" fillOpacity="0.9" />
            <path
                d="M10 34 L18 26 L24 31 L38 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.85"
            />
        </svg>
    );
}

function IconVideoPlaceholder() {
    return (
        <svg className="record-report-media-svg" viewBox="0 0 48 48" width="48" height="48" aria-hidden>
            <rect x="5" y="11" width="38" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.85" />
            <path d="M20 19 L32 24 L20 29 Z" fill="currentColor" fillOpacity="0.95" />
        </svg>
    );
}

function RecordReportMediaPlaceholder({ kind }) {
    const { t } = useTranslation();
    const isVideo = kind === "video";

    return (
        <div
            className={`record-report-media-placeholder ${isVideo ? "record-report-media-placeholder--video" : "record-report-media-placeholder--image"}`}
            role="img"
            aria-label={isVideo ? t("club.recordReport.mediaAriaVideo") : t("club.recordReport.mediaAriaImage")}
        >
            <div className="record-report-media-placeholder-shine" aria-hidden />
            <div className="record-report-media-placeholder-inner">
                {isVideo ? <IconVideoPlaceholder /> : <IconImagePlaceholder />}
                <span className="record-report-media-placeholder-label">
                    {isVideo ? t("club.recordReport.mediaLabelVideo") : t("club.recordReport.mediaLabelImage")}
                </span>
            </div>
        </div>
    );
}

export default function RecordReportView({ record, onBack }) {
    const { t } = useTranslation();
    const media = record.reportMedia || [];
    const coachReview = t(`records.${record.id}.coachReview`, {
        defaultValue: record.coachReview || "",
    });

    const titleLine = `${t(`records.${record.id}.date`, { defaultValue: record.date })} · ${t(`records.${record.id}.title`, { defaultValue: record.title })}`;

    return (
        <section className="screen swing-3d-enter record-report-page">
            <header className="top-header club-subpage-header record-report-top">
                <div className="user-chip">
                    <button type="button" className="icon-btn" aria-label={t("club.recordReport.backAria")} onClick={onBack}>
                        ←
                    </button>
                    <div>
                        <p className="small-label">{t("club.entries.records.label")}</p>
                        <h1 className="headline">{t("club.recordReport.pageTitle")}</h1>
                    </div>
                </div>
                <span className="pill record-report-pill">{t("club.recordReport.readonlyPill")}</span>
            </header>

            <section className="section-stack section-bottom-gap">
                <div className="record-report-container">
                    <div className="record-report-hero">
                        <h2 className="record-report-title">{titleLine}</h2>
                        {record.time ? (
                            <p className="record-report-time">
                                {t("club.recordReport.sessionTime")}: {record.time}
                            </p>
                        ) : null}
                    </div>

                    <div className="record-report-section record-report-section--media">
                        <div className="record-report-section-head">
                            <h3 className="record-report-h3">{t("club.recordReport.mediaSection")}</h3>
                        </div>
                        <p className="tiny-text record-report-section-hint">{t("club.recordReport.mediaHint")}</p>
                        {media.length > 0 ? (
                            <ul className="record-report-media-grid" aria-label={t("club.recordReport.mediaSection")}>
                                {media.map((item, index) => (
                                    <li key={index} className="record-report-media-tile">
                                        <RecordReportMediaPlaceholder kind={item.kind === "video" ? "video" : "image"} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="record-report-media-empty panel panel-low">{t("club.recordReport.emptyMedia")}</div>
                        )}
                    </div>

                    <div className="record-report-section record-report-section--review">
                        <h3 className="record-report-h3">{t("club.recordReport.reviewSection")}</h3>
                        <div className="record-report-review-body">
                            {coachReview.trim()
                                ? coachReview
                                      .split(/\n\n+/)
                                      .map((para, i) => <p key={i}>{para}</p>)
                                : (
                                      <p className="muted-text">{t("club.recordReport.emptyReview")}</p>
                                  )}
                        </div>
                        <p className="tiny-text record-report-coach-sign">
                            {t("club.recordReport.coachSign", { name: record.coach })}
                        </p>
                    </div>
                </div>
            </section>
        </section>
    );
}
