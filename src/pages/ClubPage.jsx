import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import GolfVenueAvatar from "../components/GolfVenueAvatar";
import ProgressOverviewSection from "../components/ProgressOverviewSection";
import RecordReportMediaPlaceholder from "../components/RecordReportMediaPlaceholder";
import BookingPage from "./BookingPage";
import { sortBookingsByTime, useAppContext } from "../context/AppContext";
import SessionCourseDetailCard from "../components/SessionCourseDetailCard";
import {
    assessmentHistoryRecords,
    getAssessmentRecordById,
    getSessionDisplay,
    getSlotById,
    liveFeedData,
    liveFeedCourseSession,
} from "../data/mockData";

/** 与 app.css 中 `.club-record-page .stack-list > .record-card-enter-wrap` 的 rankRowReveal 节奏一致 */
const ASSESSMENT_CARD_STAGGER_MS = 420;

function localizedDigestCourseName(t, sessionDisplay) {
    if (!sessionDisplay) {
        return null;
    }
    const { courseAssetId, scheduleDay, courseName } = sessionDisplay;
    if (courseAssetId) {
        return t(`courseAssets.${courseAssetId}.courseName`, { defaultValue: courseName });
    }
    if (scheduleDay != null) {
        return t(`schedule.${scheduleDay}.courseTitle`, { defaultValue: courseName });
    }
    return courseName;
}
const ASSESSMENT_RANK_REVEAL_MS = 360;
/** 维度卡片入场约过半后，子项开始错层入场 */
const ASSESSMENT_ITEM_AFTER_REVEAL_MS = Math.round(ASSESSMENT_RANK_REVEAL_MS * 0.48);
const ASSESSMENT_ITEM_STAGGER_MS = 56;

function LiveFeedTypeIcon({ type }) {
    if (type === "image") {
        return (
            <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                <path
                    d="M4 4.25A1.75 1.75 0 0 1 5.75 2.5h8.5A1.75 1.75 0 0 1 16 4.25v11.5a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 4 15.75V4.25Zm1.5 0v8.46l2.56-2.55a.75.75 0 0 1 1.06 0l1.38 1.38 2.44-2.44a.75.75 0 0 1 1.06 0l.5.5V4.25a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm0 10.89v.61c0 .14.11.25.25.25h8.5a.25.25 0 0 0 .25-.25v-4.03l-1.28-1.28-2.44 2.44a.75.75 0 0 1-1.06 0l-1.38-1.38-3.09 3.04ZM8 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
                    fill="currentColor"
                />
            </svg>
        );
    }

    if (type === "video") {
        return (
            <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                <path
                    d="M4.75 3.5A1.75 1.75 0 0 0 3 5.25v9.5c0 .97.78 1.75 1.75 1.75h7.5A1.75 1.75 0 0 0 14 14.75v-2.02l2.1 1.4a.75.75 0 0 0 1.16-.62V6.49a.75.75 0 0 0-1.16-.62L14 7.27V5.25a1.75 1.75 0 0 0-1.75-1.75h-7.5Zm3.87 3.66a.75.75 0 0 1 1.13-.64l2.78 1.7a.75.75 0 0 1 0 1.28l-2.78 1.7a.75.75 0 0 1-1.13-.64V7.16Z"
                    fill="currentColor"
                />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
            <path
                d="M5 3.25A2.25 2.25 0 0 0 2.75 5.5v6A2.25 2.25 0 0 0 5 13.75h1.86l2.54 2.12a.75.75 0 0 0 1.23-.58v-1.54H15a2.25 2.25 0 0 0 2.25-2.25v-6A2.25 2.25 0 0 0 15 3.25H5Z"
                fill="currentColor"
            />
        </svg>
    );
}

function formatDigestSession(iso, locale) {
    if (!iso) {
        return "";
    }
    const date = new Date(iso);
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function formatAssessmentRecordDate(iso, locale) {
    if (!iso) {
        return "";
    }
    const date = new Date(iso);
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
}

export default function ClubPage({ onGoGrowth, onToast, onOpenBookingModal, onClubSubpageChange }) {
    const { t, i18n } = useTranslation();
    const { state, actions } = useAppContext();
    const [clubView, setClubView] = useState("home");
    const [selectedAssessmentRecordId, setSelectedAssessmentRecordId] = useState(null);
    const [isLiveFeedCourseCollapsed, setIsLiveFeedCourseCollapsed] = useState(false);
    const liveFeedCollapseLockedRef = useRef(false);
    const liveFeedCollapseLockTimerRef = useRef(null);

    /** 从套餐详情进入 Club 子页后返回：回到「我的」当前套餐详情 */
    const returnToPackageDetailIfNeeded = () => {
        if (state.resumeProfilePackageId) {
            actions.setResumeProfileSubView("packagesDetail");
            actions.setTab("profile");
            return;
        }
        setClubView("home");
    };

    useEffect(() => {
        if (state.clubOpenBooking) {
            setClubView("booking");
            actions.clearClubOpenBooking();
        }
    }, [state.clubOpenBooking, actions]);

    useEffect(() => {
        if (!state.resumeClubSubView) {
            return;
        }

        if (state.resumeClubSubView === "assessmentRecordDetail") {
            const record = state.resumeAssessmentRecordId
                ? getAssessmentRecordById(state.resumeAssessmentRecordId)
                : null;
            if (record) {
                setSelectedAssessmentRecordId(record.id);
                setClubView("assessmentRecordDetail");
            } else {
                setSelectedAssessmentRecordId(null);
                setClubView("assessmentRecords");
            }
        } else if (state.resumeClubSubView === "assessmentRecords") {
            setSelectedAssessmentRecordId(null);
            setClubView("assessmentRecords");
        } else if (state.resumeClubSubView === "plan") {
            setClubView("plan");
        }

        actions.setResumeClubSubView(null);
        actions.setResumeAssessmentRecord(null);
    }, [state.resumeClubSubView, state.resumeAssessmentRecordId, actions]);

    useEffect(() => {
        const hideBottom =
            clubView === "assessmentRecords" || clubView === "assessmentRecordDetail";
        onClubSubpageChange?.(hideBottom);
    }, [clubView, onClubSubpageChange]);

    useEffect(
        () => () => {
            onClubSubpageChange?.(false);
        },
        [onClubSubpageChange]
    );

    useEffect(() => {
        const scrollMain = document.querySelector(".scroll-main");
        if (scrollMain) {
            scrollMain.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [clubView]);

    useEffect(() => {
        if (clubView !== "liveFeed") {
            clearTimeout(liveFeedCollapseLockTimerRef.current);
            liveFeedCollapseLockedRef.current = false;
            setIsLiveFeedCourseCollapsed(false);
            return undefined;
        }

        const scrollMain = document.querySelector(".scroll-main");
        if (!scrollMain) {
            return undefined;
        }

        const COLLAPSE_THRESHOLD = 72;

        const onScroll = () => {
            const top = scrollMain.scrollTop;
            setIsLiveFeedCourseCollapsed((prev) => {
                if (!prev && top > COLLAPSE_THRESHOLD) {
                    // Lock resets for 440ms to prevent feedback loop during collapse transition.
                    liveFeedCollapseLockedRef.current = true;
                    clearTimeout(liveFeedCollapseLockTimerRef.current);
                    liveFeedCollapseLockTimerRef.current = setTimeout(() => {
                        liveFeedCollapseLockedRef.current = false;
                    }, 440);
                    return true;
                }
                if (prev && !liveFeedCollapseLockedRef.current && top <= 0) {
                    return false;
                }
                return prev;
            });
        };

        scrollMain.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            scrollMain.removeEventListener("scroll", onScroll);
            clearTimeout(liveFeedCollapseLockTimerRef.current);
            liveFeedCollapseLockedRef.current = false;
        };
    }, [clubView]);

    const sortedBookings = useMemo(() => sortBookingsByTime(state.bookings), [state.bookings]);
    const nextBooking = sortedBookings[0] ?? null;
    const nextSlot = useMemo(() => (nextBooking ? getSlotById(nextBooking.courseAssetId) : null), [nextBooking]);
    const nextSessionDisplay = useMemo(() => {
        if (!nextBooking) {
            return null;
        }
        return getSessionDisplay(nextBooking.day, nextBooking.courseAssetId);
    }, [nextBooking]);

    const digestSwipeRef = useRef(null);
    const digestPointerRef = useRef({ active: false, pointerId: null, startX: 0, startScroll: 0 });

    const snapDigestToNearest = () => {
        const el = digestSwipeRef.current;
        if (!el) {
            return;
        }
        const w = el.clientWidth;
        if (w <= 0) {
            return;
        }
        const idx = Math.max(0, Math.min(1, Math.round(el.scrollLeft / w)));
        el.scrollTo({ left: idx * w, behavior: "smooth" });
    };

    useLayoutEffect(() => {
        const el = digestSwipeRef.current;
        if (!el) {
            return;
        }
        let cancelled = false;
        const apply = () => {
            if (cancelled || !digestSwipeRef.current) {
                return;
            }
            const w = digestSwipeRef.current.clientWidth;
            if (w <= 0) {
                requestAnimationFrame(apply);
                return;
            }
            const idx = nextBooking ? 1 : 0;
            digestSwipeRef.current.scrollLeft = idx * w;
        };
        apply();
        return () => {
            cancelled = true;
        };
    }, [nextBooking]);

    const digestPointerDown = (e) => {
        if (e.target.closest("button, a")) {
            return;
        }
        const el = digestSwipeRef.current;
        if (!el) {
            return;
        }
        digestPointerRef.current = {
            active: true,
            pointerId: e.pointerId,
            startX: e.clientX,
            startScroll: el.scrollLeft,
        };
        el.setPointerCapture(e.pointerId);
    };

    const digestPointerMove = (e) => {
        const p = digestPointerRef.current;
        if (!p.active || p.pointerId !== e.pointerId) {
            return;
        }
        const el = digestSwipeRef.current;
        if (!el) {
            return;
        }
        el.scrollLeft = p.startScroll - (e.clientX - p.startX);
    };

    const digestPointerUp = (e) => {
        const p = digestPointerRef.current;
        if (!p.active || p.pointerId !== e.pointerId) {
            return;
        }
        p.active = false;
        digestSwipeRef.current?.releasePointerCapture(e.pointerId);
        snapDigestToNearest();
    };

    const liveFeedItems = liveFeedData || [];
    const latestLiveFeedItem = liveFeedItems[0] || null;
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

    if (clubView === "assessmentRecordDetail") {
        const record = selectedAssessmentRecordId ? getAssessmentRecordById(selectedAssessmentRecordId) : null;

        if (!record) {
            return (
                <section className="screen swing-3d-enter club-assessment-records-page">
                    <header className="top-header club-subpage-header">
                        <div className="user-chip">
                            <button
                                type="button"
                                className="icon-btn"
                                aria-label={t("club.assessmentRecords.backListAria")}
                                onClick={() => setClubView("assessmentRecords")}
                            >
                                ←
                            </button>
                            <div>
                                <p className="small-label">{t("club.assessmentRecords.detailTitle")}</p>
                                <h1 className="headline">{t("club.assessmentRecords.listTitle")}</h1>
                            </div>
                        </div>
                    </header>
                    <section className="section-stack section-bottom-gap">
                        <p className="muted-text">{t("club.assessmentRecords.listTitle")}</p>
                        <button type="button" className="panel panel-low" onClick={() => setClubView("assessmentRecords")}>
                            {t("club.assessmentRecords.backListAria")}
                        </button>
                    </section>
                </section>
            );
        }

        const recordTitle = t(`club.assessmentRecords.records.${record.i18nSlug}.title`);

        return (
            <section className="screen swing-3d-enter club-assessment-detail-page">
                <header className="top-header club-subpage-header">
                    <div className="user-chip">
                        <button
                            type="button"
                            className="icon-btn"
                            aria-label={t("club.assessmentRecords.backListAria")}
                            onClick={() => setClubView("assessmentRecords")}
                        >
                            ←
                        </button>
                        <div>
                            <p className="small-label">{t("club.assessmentRecords.detailTitle")}</p>
                            <h1 className="headline club-assessment-detail-headline">{recordTitle}</h1>
                        </div>
                    </div>
                </header>

                <section className="section-stack section-bottom-gap club-record-page club-assessment-detail-body">
                    <div className="stack-list">
                        <div className="record-card-enter-wrap" style={{ animationDelay: "0ms" }}>
                            <div className="panel panel-elevated club-assessment-detail-hero">
                                <p className="small-label club-assessment-detail-hero-label">{t("club.assessmentRecords.dateLabel")}</p>
                                <p className="club-assessment-detail-hero-date">{formatAssessmentRecordDate(record.dateIso, i18n.resolvedLanguage)}</p>
                                <div className="club-assessment-detail-hero-coach">
                                    <img src={record.coach.avatarUrl} alt="" className="club-assessment-coach-avatar" width={48} height={48} />
                                    <div>
                                        <p className="club-assessment-detail-hero-coach-label">{t("club.assessmentRecords.coachSection")}</p>
                                        <p className="club-assessment-coach-name">{record.coach.name}</p>
                                        <p className="muted-text club-assessment-coach-title">{record.coach.title}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {record.dimensions.map((dim, di) => (
                            <div
                                key={dim.id}
                                className="record-card-enter-wrap"
                                style={{ animationDelay: `${(di + 1) * ASSESSMENT_CARD_STAGGER_MS}ms` }}
                            >
                                <article className="panel panel-elevated club-assessment-dimension-block">
                                    <div className="club-assessment-dimension-head">
                                        <span className="club-assessment-dimension-accent" aria-hidden="true" />
                                        <h2 className="section-title-sm club-assessment-dimension-title">
                                            {t(`progressAssessment.${dim.id}.title`)}
                                        </h2>
                                    </div>
                                    <p className="small-label club-assessment-dimension-summary-label">{t("club.assessmentRecords.dimensionSummary")}</p>
                                    <p className="club-assessment-dimension-summary">
                                        {t(`club.assessmentRecords.records.${record.i18nSlug}.dimensions.${dim.id}`)}
                                    </p>
                                    <p className="small-label club-assessment-item-eval-label">{t("club.assessmentRecords.itemEval")}</p>
                                    <ul className="club-assessment-item-list">
                                        {dim.items.map((item, ii) => {
                                            const blockDelay = (di + 1) * ASSESSMENT_CARD_STAGGER_MS;
                                            const itemAnimDelay =
                                                blockDelay + ASSESSMENT_ITEM_AFTER_REVEAL_MS + ii * ASSESSMENT_ITEM_STAGGER_MS;
                                            return (
                                                <li
                                                    key={item.key}
                                                    className="club-assessment-item-row"
                                                    style={{ animationDelay: `${itemAnimDelay}ms` }}
                                                >
                                                    <div className="club-assessment-item-head">
                                                        <span className="club-assessment-item-name">{t(`progressAssessment.${dim.id}.items.${item.key}`)}</span>
                                                        <span className="club-assessment-item-score-pill">
                                                            {t("club.assessmentRecords.scoreShort", { score: item.score })}
                                                        </span>
                                                    </div>
                                                    <p className="club-assessment-item-comment">
                                                        {t(`club.assessmentRecords.records.${record.i18nSlug}.items.${dim.id}.${item.key}`)}
                                                    </p>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </article>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
        );
    }

    if (clubView === "assessmentRecords") {
        return (
            <section className="screen swing-3d-enter club-assessment-records-page">
                <header className="top-header club-subpage-header">
                    <div className="user-chip">
                        <button
                            type="button"
                            className="icon-btn"
                            aria-label={t("club.assessmentRecords.backHomeAria")}
                            onClick={returnToPackageDetailIfNeeded}
                        >
                            ←
                        </button>
                        <div>
                            <p className="small-label">{t("progressOverview.title")}</p>
                            <h1 className="headline">{t("club.assessmentRecords.listTitle")}</h1>
                        </div>
                    </div>
                    <span className="pill">{t("club.recordCount", { count: assessmentHistoryRecords.length })}</span>
                </header>

                <section className="section-stack section-bottom-gap club-record-page club-assessment-records-list">
                    <div className="stack-list">
                        {assessmentHistoryRecords.map((rec, i) => {
                            const cardTitle = t(`club.assessmentRecords.records.${rec.i18nSlug}.title`);
                            const dateStr = formatAssessmentRecordDate(rec.dateIso, i18n.resolvedLanguage);
                            return (
                                <div key={rec.id} className="record-card-enter-wrap" style={{ animationDelay: `${i * 420}ms` }}>
                                    <button
                                        type="button"
                                        className="panel panel-elevated club-assessment-record-card"
                                        aria-label={t("club.assessmentRecords.openRecordAria", {
                                            date: dateStr,
                                            title: cardTitle,
                                            coach: rec.coach.name,
                                        })}
                                        onClick={() => {
                                            setSelectedAssessmentRecordId(rec.id);
                                            setClubView("assessmentRecordDetail");
                                        }}
                                    >
                                        <div className="club-assessment-record-card__head">
                                            <p className="club-assessment-record-title" role="heading" aria-level={3}>
                                                {cardTitle}
                                            </p>
                                            <p className="club-assessment-record-date">{dateStr}</p>
                                        </div>
                                        <div className="club-assessment-record-card__coach">
                                            <div className="club-assessment-record-coach">
                                                <img
                                                    src={rec.coach.avatarUrl}
                                                    alt=""
                                                    className="club-assessment-coach-avatar"
                                                    width={44}
                                                    height={44}
                                                />
                                                <div>
                                                    <p className="club-assessment-coach-name">{rec.coach.name}</p>
                                                    <p className="muted-text club-assessment-coach-title">{rec.coach.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </section>
        );
    }

    if (clubView === "liveFeed") {
        const staggerMs = 420;
        const wrapDelay = (i) => ({ animationDelay: `${i * staggerMs}ms` });
        const summaryCourseName = liveFeedCourseSession
            ? liveFeedCourseSession.courseAssetId != null
                ? t(`courseAssets.${liveFeedCourseSession.courseAssetId}.courseName`, {
                    defaultValue: liveFeedCourseSession.courseName,
                })
                : liveFeedCourseSession.courseName
            : "";
        const summaryCoachName = liveFeedCourseSession?.coachName || "";
        const summaryTime = liveFeedCourseSession?.range || "";

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

                <section
                    className={`section-stack section-bottom-gap club-record-page club-live-feed-detail-page ${isLiveFeedCourseCollapsed ? "club-live-feed-detail-page--course-collapsed" : ""
                        }`}
                >
                    {liveFeedCourseSession ? (
                        <div
                            className={`club-live-feed-sticky-summary ${isLiveFeedCourseCollapsed ? "is-visible" : ""
                                }`}
                            aria-hidden={!isLiveFeedCourseCollapsed}
                        >
                            <div className="club-live-feed-sticky-summary__main">
                                <p className="club-live-feed-sticky-summary__title">{summaryCourseName}</p>
                                <p className="club-live-feed-sticky-summary__meta">
                                    <span>{summaryTime}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>{summaryCoachName}</span>
                                </p>
                            </div>
                            <span className="club-live-feed-sticky-summary__status">{t("club.liveFeed.status")}</span>
                        </div>
                    ) : null}
                    <div className="stack-list" id="club-live-feed-details">
                        <div className="record-card-enter-wrap" style={wrapDelay(0)}>
                            <div
                                className={`live-feed-course-info ${isLiveFeedCourseCollapsed ? "live-feed-course-info--collapsed" : ""
                                    }`}
                                aria-label={t("club.liveFeed.courseInfoTitle")}
                            >
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

                        {liveFeedItems.length > 0 ? (
                            <div className="record-card-enter-wrap" style={wrapDelay(1)}>
                                <section
                                    className="growth-report-detail-live club-live-feed-live-section"
                                    aria-labelledby="club-live-feed-timeline-heading"
                                    aria-live="polite"
                                >
                                    <div className="growth-report-detail-live__head">
                                        <h4 id="club-live-feed-timeline-heading" className="growth-report-detail-live__title">
                                            {t("growth.sessionLiveRecordTitle")}
                                        </h4>
                                        <span
                                            className="growth-report-detail-live__count"
                                            title={t("club.recordCount", { count: liveFeedItems.length })}
                                        >
                                            {liveFeedItems.length}
                                        </span>
                                    </div>
                                    <ul className="growth-report-detail-live__list">
                                        {liveFeedItems.map((item, index) => (
                                            <li
                                                key={item.id}
                                                className="growth-report-detail-live__item growth-report-detail-live__item--motion"
                                                style={{ animationDelay: `${780 + index * 110}ms` }}
                                            >
                                                <span className="growth-report-detail-live__rail" aria-hidden="true" />
                                                <div className="growth-report-detail-live__body">
                                                    <div className="growth-report-detail-live__meta">
                                                        <span className="growth-report-detail-live__time">{item.timestamp}</span>
                                                        <span
                                                            className={`growth-report-detail-live__type growth-report-detail-live__type--${item.type}`}
                                                        >
                                                            <span className="growth-report-detail-live__type-icon" aria-hidden="true">
                                                                <LiveFeedTypeIcon type={item.type} />
                                                            </span>
                                                            {getLiveFeedTypeLabel(item.type)}
                                                        </span>
                                                        <span className="growth-report-detail-live__coach">{item.coachName}</span>
                                                    </div>
                                                    {(item.type === "image" || item.type === "video") && (
                                                        <div className="growth-report-detail-live__media">
                                                            <RecordReportMediaPlaceholder
                                                                kind={item.type === "video" ? "video" : "image"}
                                                            />
                                                        </div>
                                                    )}
                                                    <p className="growth-report-detail-live__text">{item.content}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>
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
                        onClick={returnToPackageDetailIfNeeded}
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
                        <button type="button" className="icon-btn" aria-label={t("common.close")} onClick={returnToPackageDetailIfNeeded}>
                            ○
                        </button>
                    </div>
                </header>

                <section className="section-stack section-bottom-gap">
                    <div className="plan-container">
                        <div className="plan-header-card">
                            <h2 className="plan-title">{t("club.entries.plan.studentPlan", { name: t("profile.studentName") })}</h2>
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

    if (clubView === "booking") {
        return (
            <BookingPage
                embedded
                onEmbeddedBack={() => setClubView("home")}
                onOpenBookingModal={onOpenBookingModal}
                onToast={onToast}
            />
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

            <section className="club-booking-digest section-stack section-bottom-gap" aria-label={t("club.bookingDigest.sectionTitle")}>
                <div className="section-head">
                    <h2 className="section-title-sm">{t("club.bookingDigest.sectionTitle")}</h2>
                </div>
                <div className="club-booking-digest-card">
                    <div
                        ref={digestSwipeRef}
                        className="club-booking-digest-swipe"
                        onPointerDown={digestPointerDown}
                        onPointerMove={digestPointerMove}
                        onPointerUp={digestPointerUp}
                        onPointerCancel={digestPointerUp}
                    >
                        <div className="club-booking-digest-slide">
                            <div className="club-booking-digest-slide-inner club-booking-digest-slide-inner--pre">
                                <div className="club-booking-digest-slide-head">
                                    <span className="club-booking-digest-pulse-dot" aria-hidden="true" />
                                    <p className="club-booking-digest-eyebrow">{t("club.bookingDigest.preEyebrow")}</p>
                                </div>
                                <h3 className="club-booking-digest-title">{t("club.bookingDigest.preTitle")}</h3>
                                <p className="club-booking-digest-summary">{t("club.bookingDigest.preSummary")}</p>
                                <button
                                    type="button"
                                    className="club-booking-digest-action-btn"
                                    onClick={() => setClubView("booking")}
                                >
                                    <span>{t("club.bookingDigest.viewDetails")}</span>
                                    <span className="club-booking-digest-action-icon" aria-hidden="true">
                                        →
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="club-booking-digest-slide">
                            <div className="club-booking-digest-slide-inner club-booking-digest-slide-inner--post">
                                {nextBooking ? (
                                    <>
                                        <div className="club-booking-digest-slide-head">
                                            <span className="club-booking-digest-status-dot" aria-hidden="true" />
                                            <p className="club-booking-digest-eyebrow">{t("club.bookingDigest.postEyebrow")}</p>
                                        </div>
                                        <p className="club-booking-digest-next-time">
                                            {t("club.bookingDigest.nextTime", {
                                                date: formatDigestSession(nextBooking.nextSessionISO, i18n.resolvedLanguage),
                                                range: nextSlot?.range ?? "—",
                                            })}
                                        </p>
                                        {nextSessionDisplay ? (
                                            <p className="club-booking-digest-course">
                                                {localizedDigestCourseName(t, nextSessionDisplay)}
                                            </p>
                                        ) : null}
                                        <button
                                            type="button"
                                            className="club-booking-digest-action-btn club-booking-digest-action-btn--ghost"
                                            onClick={() => setClubView("booking")}
                                        >
                                            <span>{t("club.bookingDigest.viewDetails")}</span>
                                            <span className="club-booking-digest-action-icon" aria-hidden="true">
                                                →
                                            </span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="club-booking-digest-slide-head">
                                            <span className="club-booking-digest-status-dot club-booking-digest-status-dot--muted" aria-hidden="true" />
                                            <p className="club-booking-digest-eyebrow">{t("club.bookingDigest.postEyebrow")}</p>
                                        </div>
                                        <p className="club-booking-digest-summary club-booking-digest-summary--compact">
                                            {t("club.bookingDigest.postEmptyHint")}
                                        </p>
                                        <button
                                            type="button"
                                            className="club-booking-digest-action-btn club-booking-digest-action-btn--primary"
                                            onClick={() => setClubView("booking")}
                                        >
                                            <span>{t("club.bookingDigest.goBook")}</span>
                                            <span className="club-booking-digest-action-icon" aria-hidden="true">
                                                →
                                            </span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ProgressOverviewSection
                withBottomGap={false}
                onOpenAssessmentRecords={() => {
                    setClubView("assessmentRecords");
                }}
            />

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
