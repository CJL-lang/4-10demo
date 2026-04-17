import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GolfVenueAvatar from "../components/GolfVenueAvatar";
import ProgressOverviewSection from "../components/ProgressOverviewSection";
import RecordReportMediaPlaceholder from "../components/RecordReportMediaPlaceholder";
import { useAppContext } from "../context/AppContext";
import SessionCourseDetailCard from "../components/SessionCourseDetailCard";
import { liveFeedData, liveFeedCourseSession } from "../data/mockData";

function LiveFeedTypeIcon({ type }) {
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

export default function ClubPage({ onGoGrowth, onToast }) {
    const { t } = useTranslation();
    const { state } = useAppContext();
    const [clubView, setClubView] = useState("home");

    useEffect(() => {
        const scrollMain = document.querySelector(".scroll-main");
        if (scrollMain) {
            scrollMain.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [clubView]);

    const liveFeedItems = liveFeedData || [];
    const latestLiveFeedItem = liveFeedItems[0] || null;
    const earlierLiveFeedItems = latestLiveFeedItem ? liveFeedItems.slice(1) : [];
    const liveFeedMediaCount = liveFeedItems.filter((item) => item.type === "image" || item.type === "video").length;

    const getLiveFeedTypeLabel = (type) => {
        if (type === "image") {
            return t("club.liveFeed.typeImage");
        }
        if (type === "video") {
            return t("club.liveFeed.typeVideo");
        }
        return t("club.liveFeed.typeText");
    };

    if (clubView === "liveFeed") {
        const staggerMs = 420;
        const wrapDelay = (i) => ({ animationDelay: `${i * staggerMs}ms` });

        return (
            <section className="screen swing-3d-enter club-live-feed-page">
                <header className="top-header club-subpage-header">
                    <div className="user-chip">
                        <button
                            type="button"
                            className="icon-btn"
                            aria-label={t("club.backHomeAria")}
                            onClick={() => setClubView("home")}
                        >
                            ←
                        </button>
                        <div>
                            <p className="small-label">{t("club.liveFeed.summaryEyebrow")}</p>
                            <h1 className="headline">{t("club.liveFeed.detailPageTitle")}</h1>
                        </div>
                    </div>
                </header>

                <section className="section-stack section-bottom-gap club-record-page club-live-feed-detail-page">
                    <div className="stack-list" id="club-live-feed-details">
                        <div className="record-card-enter-wrap" style={wrapDelay(0)}>
                            <div className="live-feed-course-info" aria-label={t("club.liveFeed.courseInfoTitle")}>
                                <div className="live-feed-detail-block live-feed-detail-block--course">
                                    <div className="live-feed-course-info-header">
                                        <p className="live-feed-course-info-eyebrow">{t("club.liveFeed.courseInfoTitle")}</p>
                                    </div>
                                    {liveFeedCourseSession ? (
                                        <SessionCourseDetailCard
                                            className="live-feed-course-card"
                                            session={liveFeedCourseSession}
                                            metaBeforeCoach={
                                                <dl className="live-feed-course-meta-dl">
                                                    <div className="live-feed-course-meta-row">
                                                        <dt>{t("club.liveFeed.studentLabel")}</dt>
                                                        <dd>{t("club.liveFeed.studentValue")}</dd>
                                                    </div>
                                                    <div className="live-feed-course-meta-row">
                                                        <dt>{t("club.liveFeed.sessionLabel")}</dt>
                                                        <dd>{t("club.liveFeed.sessionValue")}</dd>
                                                    </div>
                                                </dl>
                                            }
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {liveFeedItems.length > 0 ? (
                            <>
                                {latestLiveFeedItem ? (
                                    <div className="record-card-enter-wrap" style={wrapDelay(1)}>
                                        <article
                                            className="live-feed-highlight live-feed-highlight--featured panel panel-elevated"
                                            aria-live="polite"
                                        >
                                            <div className="live-feed-highlight-head">
                                                <div>
                                                    <p className="live-feed-highlight-eyebrow">{t("club.liveFeed.latestLabel")}</p>
                                                    <h3 className="live-feed-highlight-title">{latestLiveFeedItem.timestamp}</h3>
                                                </div>
                                                <span className={`live-feed-type-pill live-feed-type-pill--${latestLiveFeedItem.type}`}>
                                                    <span className="live-feed-type-pill-icon" aria-hidden="true">
                                                        <LiveFeedTypeIcon type={latestLiveFeedItem.type} />
                                                    </span>
                                                    {getLiveFeedTypeLabel(latestLiveFeedItem.type)}
                                                </span>
                                            </div>

                                            {(latestLiveFeedItem.type === "image" || latestLiveFeedItem.type === "video") && (
                                                <div className="live-feed-highlight-media">
                                                    <RecordReportMediaPlaceholder
                                                        kind={latestLiveFeedItem.type === "video" ? "video" : "image"}
                                                    />
                                                </div>
                                            )}

                                            <p className="live-feed-highlight-text">{latestLiveFeedItem.content}</p>

                                            <div className="live-feed-highlight-footer">
                                                <span className="live-feed-highlight-coach">{latestLiveFeedItem.coachName}</span>
                                                <span className="live-feed-highlight-status">
                                                    <span className="live-feed-highlight-status-dot" aria-hidden="true" />
                                                    {t("club.liveFeed.synced")}
                                                </span>
                                            </div>
                                        </article>
                                    </div>
                                ) : null}

                                {earlierLiveFeedItems.length > 0 ? (
                                    <div className="record-card-enter-wrap" style={wrapDelay(2)}>
                                        <div className="live-feed-history-card">
                                            <div className="live-feed-stream-head">
                                                <p className="live-feed-stream-label">{t("club.liveFeed.historyLabel")}</p>
                                                <span
                                                    className="live-feed-stream-count"
                                                    title={t("club.recordCount", { count: earlierLiveFeedItems.length })}
                                                >
                                                    {earlierLiveFeedItems.length}
                                                </span>
                                            </div>
                                            <div className="live-feed-history-body">
                                                <div className="live-feed-timeline">
                                                    {earlierLiveFeedItems.map((item, index) => (
                                                        <div
                                                            key={item.id}
                                                            className="live-feed-item"
                                                            style={{ animationDelay: `${index * 150}ms` }}
                                                        >
                                                            <div className="live-feed-dot" aria-hidden="true" />
                                                            <div className="live-feed-content">
                                                                <div className="live-feed-meta">
                                                                    <div className="live-feed-meta-main">
                                                                        <span className="live-feed-time">{item.timestamp}</span>
                                                                        <span className={`live-feed-type-pill live-feed-type-pill--${item.type}`}>
                                                                            <span className="live-feed-type-pill-icon" aria-hidden="true">
                                                                                <LiveFeedTypeIcon type={item.type} />
                                                                            </span>
                                                                            {getLiveFeedTypeLabel(item.type)}
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
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </>
                        ) : (
                            <div className="record-card-enter-wrap" style={wrapDelay(1)}>
                                <div className="panel panel-low live-feed-empty">
                                    <p className="muted-text">{t("club.liveFeed.empty")}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </section>
        );
    }

    if (clubView === "plan") {
        const planIds = ["p1", "p2", "p3", "p4"];
        const planData = planIds.map((id) => ({
            period: t(`club.plan.${id}.period`),
            goal: t(`club.plan.${id}.goal`),
            points: t(`club.plan.${id}.points`),
            breakthrough: t(`club.plan.${id}.breakthrough`),
        }));

        return (
            <section className="screen swing-3d-enter club-plan-page">
                <header className="top-header club-subpage-header" style={{ position: "relative", justifyContent: "center" }}>
                    <button
                        type="button"
                        className="icon-btn"
                        aria-label={t("club.backHomeAria")}
                        onClick={() => setClubView("home")}
                        style={{ position: "absolute", left: 0 }}
                    >
                        ←
                    </button>
                    <h1 className="headline" style={{ fontSize: "18px" }}>
                        {t("club.entries.plan.title")}
                    </h1>
                    <div className="header-actions" style={{ position: "absolute", right: 0 }}>
                        <button type="button" className="icon-btn" aria-label={t("common.more")}>
                            •••
                        </button>
                        <button type="button" className="icon-btn" aria-label={t("common.close")} onClick={() => setClubView("home")}>
                            ○
                        </button>
                    </div>
                </header>

                <section className="section-stack section-bottom-gap">
                    <div className="plan-container">
                        <div className="plan-header-card">
                            <h2 className="plan-title">{t("club.entries.plan.studentPlan", { name: "李小明" })}</h2>
                            <p className="plan-subtitle">{t("club.entries.plan.readonly")}</p>
                        </div>

                        <div className="plan-timeline">
                            {planData.map((item, index) => (
                                <div key={index} className="plan-timeline-item">
                                    <div className="plan-card">
                                        <div className="plan-row">
                                            <span className="plan-label">{t("club.entries.plan.period")}</span>
                                            <span className="plan-value">{item.period}</span>
                                        </div>
                                        <div className="plan-row">
                                            <span className="plan-label">{t("club.entries.plan.goal")}</span>
                                            <span className="plan-value">{item.goal}</span>
                                        </div>
                                        <div className="plan-row">
                                            <span className="plan-label">{t("club.entries.plan.points")}</span>
                                            <span className="plan-value">{item.points}</span>
                                        </div>
                                        <div className="plan-row">
                                            <span className="plan-label">{t("club.entries.plan.breakthrough")}</span>
                                            <span className="plan-value">{item.breakthrough}</span>
                                        </div>
                                    </div>
                                    {index < planData.length - 1 ? <div className="plan-arrow">↓</div> : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </section>
        );
    }

    return (
        <section className="screen fade-enter club-home">
            <header className="top-header club-header">
                <div className="user-chip">
                    <GolfVenueAvatar />
                    <div>
                        <p className="small-label">{t("common.venueName")}</p>
                        <h1 className="headline">{t("club.title")}</h1>
                    </div>
                </div>
                <button type="button" className="icon-btn" aria-label={t("club.notificationAria")}>
                    ○
                </button>
            </header>

            {state.auth.role === "parent" && (
                <section className="live-feed-section section-stack section-bottom-gap">
                    <div className="section-head live-feed-header">
                        <div className="live-feed-header-main">
                            <h2 className="section-title-sm">{t("club.liveFeed.title")}</h2>
                            <div className="live-feed-badge">
                                <span className="live-feed-dot-pulse" aria-hidden="true" />
                                {t("club.liveFeed.status")}
                            </div>
                        </div>
                    </div>
                    <div className="live-feed-overview panel panel-elevated">
                        <div className="live-feed-overview-head">
                            <div>
                                <p className="live-feed-overview-eyebrow">{t("club.liveFeed.summaryEyebrow")}</p>
                                <h3 className="live-feed-overview-title">{t("club.liveFeed.summaryTitle")}</h3>
                                <p className="live-feed-overview-summary">
                                    <span>{t("club.liveFeed.syncing")}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>
                                        {t("club.liveFeed.collapsedSummary", {
                                            time: latestLiveFeedItem?.timestamp ?? "--:--",
                                            count: liveFeedItems.length,
                                        })}
                                    </span>
                                </p>
                            </div>
                            <button
                                type="button"
                                className="live-feed-overview-action"
                                aria-label={t("club.liveFeed.viewDetailsAria")}
                                onClick={() => setClubView("liveFeed")}
                            >
                                <span className="live-feed-overview-action-copy">{t("club.liveFeed.viewDetails")}</span>
                                <span className="live-feed-overview-action-icon" aria-hidden="true">
                                    →
                                </span>
                            </button>
                        </div>

                        <div className="live-feed-overview-stats" aria-label={t("club.liveFeed.summaryEyebrow")}>
                            <div className="live-feed-stat-card">
                                <span className="live-feed-stat-label">{t("club.liveFeed.updatesCount")}</span>
                                <strong className="live-feed-stat-value">{liveFeedItems.length}</strong>
                            </div>
                            <div className="live-feed-stat-card">
                                <span className="live-feed-stat-label">{t("club.liveFeed.mediaCount")}</span>
                                <strong className="live-feed-stat-value">{liveFeedMediaCount}</strong>
                            </div>
                            <div className="live-feed-stat-card">
                                <span className="live-feed-stat-label">{t("club.liveFeed.latestAt")}</span>
                                <strong className="live-feed-stat-value">{latestLiveFeedItem?.timestamp ?? "--:--"}</strong>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <ProgressOverviewSection withBottomGap={false} />

            <div className="club-entries-stack section-stack section-bottom-gap">
                <button
                    type="button"
                    className="panel panel-low club-entry-card"
                    onClick={() => setClubView("plan")}
                >
                    <div className="entry-content">
                        <p className="small-label">{t("club.entries.plan.label")}</p>
                        <h3>{t("club.entries.plan.title")}</h3>
                        <p className="muted-text">{t("club.entries.plan.desc")}</p>
                    </div>
                    <span className="club-entry-arrow">→</span>
                </button>
            </div>
        </section>
    );
}
