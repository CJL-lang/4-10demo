import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import GolfVenueAvatar from "../components/GolfVenueAvatar";
import RecordCard from "../components/RecordCard";
import RecordReportView from "../components/RecordReportView";
import ProgressOverviewSection from "../components/ProgressOverviewSection";
import { useAppContext } from "../context/AppContext";
import { records, coachInfoCard } from "../data/mockData";

export default function ClubPage({ onGoGrowth, onToast }) {
    const { t } = useTranslation();
    const { state, actions } = useAppContext();
    const [clubView, setClubView] = useState("home");
    const [reportRecord, setReportRecord] = useState(null);

    useEffect(() => {
        const scrollMain = document.querySelector(".scroll-main");
        if (scrollMain) {
            scrollMain.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [clubView, reportRecord]);

    const filteredRecords = useMemo(
        () => records.filter((item) => item.type === state.recordFilter),
        [state.recordFilter]
    );

    const visibleRecords = useMemo(
        () => filteredRecords.slice(0, state.recordVisibleCount),
        [filteredRecords, state.recordVisibleCount]
    );

    const hasMoreRecords = visibleRecords.length < filteredRecords.length;

    if (clubView === "recordReport" && reportRecord) {
        return (
            <RecordReportView
                record={reportRecord}
                onBack={() => {
                    setReportRecord(null);
                    setClubView("records");
                }}
            />
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

    if (clubView === "records") {
        return (
            <section className="screen swing-3d-enter">
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
                            <p className="small-label">{t("club.entries.records.label")}</p>
                            <h1 className="headline">{t("club.entries.records.title")}</h1>
                        </div>
                    </div>
                    <span className="pill">{t("club.recordCount", { count: filteredRecords.length })}</span>
                </header>

                <section className="section-stack section-bottom-gap club-record-page">
                    <div className="stack-list">
                        {visibleRecords.map((record, index) => (
                            <div
                                key={record.id}
                                className="record-card-enter-wrap"
                                style={{ animationDelay: `${index * 420}ms` }}
                            >
                                <RecordCard
                                    record={record}
                                    onClick={(r) => {
                                        setReportRecord(r);
                                        setClubView("recordReport");
                                        onToast(t("club.toasts.openedReport"));
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {hasMoreRecords ? (
                        <button
                            type="button"
                            className="btn-ghost small record-more-btn"
                            onClick={() => {
                                actions.loadMoreRecords();
                                onToast(t("club.toasts.loadedMore"));
                            }}
                        >
                            {t("club.loadMore")}
                        </button>
                    ) : null}
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

            <ProgressOverviewSection withBottomGap={false} />

            <div className="club-entries-stack section-stack section-bottom-gap">
                <button
                    type="button"
                    className="panel panel-low club-entry-card"
                    onClick={() => {
                        setClubView("records");
                        onToast(t("club.toasts.enteredRecords"));
                    }}
                >
                    <div className="entry-content">
                        <p className="small-label">{t("club.entries.records.label")}</p>
                        <h3>{t("club.entries.records.title")}</h3>
                        <p className="muted-text">{t("club.entries.records.desc")}</p>
                    </div>
                    <span className="club-entry-arrow">→</span>
                </button>

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

            <article className="panel panel-elevated my-coach-card section-stack section-bottom-gap" style={{ marginTop: "24px" }}>
                <div className="section-head">
                    <h2 className="section-title-sm">{t("club.coachCard.title")}</h2>
                    <span className="pill">{t("club.coachCard.status")}</span>
                </div>
                <div className="my-coach-info" style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
                    <div
                        className="avatar my-coach-avatar"
                        style={{
                            width: "64px",
                            height: "64px",
                            fontSize: "20px",
                            flexShrink: 0,
                            backgroundImage: coachInfoCard.avatarUrl ? `url(${coachInfoCard.avatarUrl})` : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            color: coachInfoCard.avatarUrl ? "transparent" : "inherit",
                        }}
                    >
                        {!coachInfoCard.avatarUrl && coachInfoCard.initials}
                    </div>
                    <div className="my-coach-details">
                        <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "var(--on-surface)" }}>{coachInfoCard.name}</h3>
                        <p style={{ margin: "0 0 8px", fontSize: "13px", color: "var(--tertiary)" }}>{coachInfoCard.title}</p>

                        <div style={{ display: "grid", gap: "6px", fontSize: "12px" }}>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <span style={{ color: "var(--outline)" }}>{t("club.coachCard.contact")}</span>
                                <span style={{ color: "var(--on-surface)" }}>{coachInfoCard.phone}</span>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <span style={{ color: "var(--outline)" }}>{t("club.coachCard.bestScore")}</span>
                                <span style={{ color: "var(--primary)" }}>{coachInfoCard.bestScore}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </section>
    );
}
