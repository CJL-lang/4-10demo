import { useTranslation } from "react-i18next";
import RecordReportMediaPlaceholder from "./RecordReportMediaPlaceholder";

function FeedTypeIcon({ type }) {
    if (type === "image") {
        return (
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                <path
                    d="M4 4.25A1.75 1.75 0 0 1 5.75 2.5h8.5A1.75 1.75 0 0 1 16 4.25v11.5a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 4 15.75V4.25Zm1.5 0v8.46l2.56-2.55a.75.75 0 0 1 1.06 0l1.38 1.38 2.44-2.44a.75.75 0 0 1 1.06 0l.5.5V4.25a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm0 10.89v.61c0 .14.11.25.25.25h8.5a.25.25 0 0 0 .25-.25v-4.03l-1.28-1.28-2.44 2.44a.75.75 0 0 1-1.06 0l-1.38-1.38-3.09 3.04ZM8 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
                    fill="currentColor"
                />
            </svg>
        );
    }

    if (type === "video") {
        return (
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                <path
                    d="M4.75 3.5A1.75 1.75 0 0 0 3 5.25v9.5c0 .97.78 1.75 1.75 1.75h7.5A1.75 1.75 0 0 0 14 14.75v-2.02l2.1 1.4a.75.75 0 0 0 1.16-.62V6.49a.75.75 0 0 0-1.16-.62L14 7.27V5.25a1.75 1.75 0 0 0-1.75-1.75h-7.5Zm3.87 3.66a.75.75 0 0 1 1.13-.64l2.78 1.7a.75.75 0 0 1 0 1.28l-2.78 1.7a.75.75 0 0 1-1.13-.64V7.16Z"
                    fill="currentColor"
                />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <path
                d="M5 3.25A2.25 2.25 0 0 0 2.75 5.5v6A2.25 2.25 0 0 0 5 13.75h1.86l2.54 2.12a.75.75 0 0 0 1.23-.58v-1.54H15a2.25 2.25 0 0 0 2.25-2.25v-6A2.25 2.25 0 0 0 15 3.25H5Z"
                fill="currentColor"
            />
        </svg>
    );
}

export default function RecordReportView({ record, onBack }) {
    const { t } = useTranslation();
    const media = record.reportMedia || [];
    const liveFeedEntries = record.liveFeedEntries || [];
    const coachReview = t(`records.${record.id}.coachReview`, {
        defaultValue: record.coachReview || "",
    });

    const titleLine = `${t(`records.${record.id}.date`, { defaultValue: record.date })} · ${t(`records.${record.id}.title`, { defaultValue: record.title })}`;
    const getFeedTypeLabel = (type) => {
        if (type === "image") {
            return t("club.liveFeed.typeImage");
        }
        if (type === "video") {
            return t("club.liveFeed.typeVideo");
        }
        return t("club.liveFeed.typeText");
    };

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

                    <div className="record-report-section record-report-section--timeline">
                        <div className="record-report-section-head">
                            <h3 className="record-report-h3">{t("club.recordReport.liveFeedSection")}</h3>
                        </div>
                        <p className="tiny-text record-report-section-hint">{t("club.recordReport.liveFeedHint")}</p>

                        {liveFeedEntries.length > 0 ? (
                            <div className="live-feed-history-card">
                                <div className="live-feed-history-body">
                                    <div className="live-feed-timeline">
                                    {liveFeedEntries.map((item, index) => (
                                        <article
                                            key={item.id}
                                            className="live-feed-item"
                                            style={{ animationDelay: `${index * 60}ms` }}
                                        >
                                            <div className="live-feed-dot" />
                                            <div className="live-feed-content">
                                                <div className="live-feed-meta">
                                                    <div className="live-feed-meta-main">
                                                        <span className="live-feed-time">{item.timestamp}</span>
                                                        <span className={`live-feed-type-pill live-feed-type-pill--${item.type}`}>
                                                            <span className="live-feed-type-pill-icon" aria-hidden="true">
                                                                <FeedTypeIcon type={item.type} />
                                                            </span>
                                                            {getFeedTypeLabel(item.type)}
                                                        </span>
                                                    </div>
                                                    <span className="live-feed-coach">{item.coachName}</span>
                                                </div>

                                                {(item.type === "image" || item.type === "video") && (
                                                    <div className="live-feed-media">
                                                        <RecordReportMediaPlaceholder
                                                            kind={item.type === "video" ? "video" : "image"}
                                                        />
                                                    </div>
                                                )}

                                                <p className="live-feed-text">{item.content}</p>
                                            </div>
                                        </article>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="record-report-media-empty panel panel-low">{t("club.recordReport.liveFeedEmpty")}</div>
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
