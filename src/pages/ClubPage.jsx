import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import RecordCard from "../components/RecordCard";
import ProgressOverviewSection from "../components/ProgressOverviewSection";
import { useAppContext } from "../context/AppContext";
import { recordFilterItems, records, coachInfoCard, rankingGroups } from "../data/mockData";

export default function ClubPage({ onGoGrowth, onToast }) {
    const { t } = useTranslation();
    const { state, actions } = useAppContext();
    const [clubView, setClubView] = useState("home");

    useEffect(() => {
        const scrollMain = document.querySelector(".scroll-main");
        if (scrollMain) {
            scrollMain.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [clubView]);

    const filteredRecords = useMemo(() => {
        if (state.recordFilter === "all") {
            return records;
        }
        return records.filter((item) => item.type === state.recordFilter);
    }, [state.recordFilter]);

    const visibleRecords = useMemo(
        () => filteredRecords.slice(0, state.recordVisibleCount),
        [filteredRecords, state.recordVisibleCount]
    );

    const hasMoreRecords = visibleRecords.length < filteredRecords.length;

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
                    <div className="filter-row">
                        {recordFilterItems.map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                className={`filter-chip ${state.recordFilter === item.key ? "active" : ""}`}
                                onClick={() => actions.setRecordFilter(item.key)}
                            >
                                {t("recordFilters.skills", { defaultValue: item.label })}
                            </button>
                        ))}
                    </div>

                    <p className="tiny-text record-stat">
                        {t("club.recordShown", { visible: visibleRecords.length, total: filteredRecords.length })}
                    </p>

                    <div className="stack-list">
                        {visibleRecords.map((record) => (
                            <RecordCard key={record.id} record={record} />
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

    if (clubView === "ranking") {
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
                            <p className="small-label">{t("ranking.subtitle")}</p>
                            <h1 className="headline">{t("ranking.title")}</h1>
                        </div>
                    </div>
                </header>

                <section className="section-stack section-bottom-gap">
                    <div className="stack-list">
                        {rankingGroups.map((group) => (
                            <article className="panel rank-panel" key={group.title}>
                                <div className="rank-head">
                                    <h3>{t("ranking.skillsOverall", { defaultValue: group.title })}</h3>
                                    <span>{group.rank}</span>
                                </div>
                                <div className="rank-rows">
                                    {group.rows.map((row) => (
                                        <div className={`rank-row ${row.isSelf ? "rank-row-self" : ""}`} key={`${group.title}-${row.no}`}>
                                            <span className="rank-medal">{row.no}</span>
                                            <span className="rank-name">
                                                {row.name}
                                                {row.isSelf ? <em className="rank-self-tag">{t("common.me")}</em> : null}
                                            </span>
                                            <span className="rank-value">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </section>
        );
    }

    return (
        <section className="screen fade-enter club-home">
            <header className="top-header club-header">
                <div className="user-chip">
                    <div className="avatar golf-icon" aria-hidden="true">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="16" y="2" width="8" height="20" fill="currentColor" fillOpacity="0.3" />
                            <path d="M20 22L14 38H26L20 22Z" fill="currentColor" fillOpacity="0.9" />
                            <circle cx="20" cy="20" r="3" fill="currentColor" />
                        </svg>
                    </div>
                    <div>
                        <p className="small-label">{t("club.venue")}</p>
                        <h1 className="headline">{t("club.title")}</h1>
                    </div>
                </div>
                <button type="button" className="icon-btn" aria-label={t("club.notificationAria")}>
                    ○
                </button>
            </header>

            <ProgressOverviewSection withBottomGap={false} />

            <div className="club-entries-stack section-stack">
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
                    onClick={() => {
                        setClubView("ranking");
                        onToast(t("club.toasts.enteredRanking"));
                    }}
                >
                    <div className="entry-content">
                        <p className="small-label">{t("club.entries.ranking.label")}</p>
                        <h3>{t("club.entries.ranking.title")}</h3>
                        <p className="muted-text">{t("club.entries.ranking.desc")}</p>
                    </div>
                    <span className="club-entry-arrow">→</span>
                </button>

                <button
                    type="button"
                    className="panel panel-low club-entry-card"
                    onClick={() => onToast(t("club.toasts.evaluationComingSoon"))}
                >
                    <div className="entry-content">
                        <p className="small-label">{t("club.entries.evaluation.label")}</p>
                        <h3>{t("club.entries.evaluation.title")}</h3>
                        <p className="muted-text">{t("club.entries.evaluation.desc")}</p>
                    </div>
                    <span className="club-entry-arrow">→</span>
                </button>

                <button
                    type="button"
                    className="panel panel-low club-entry-card"
                    onClick={() => onToast(t("club.toasts.planComingSoon"))}
                >
                    <div className="entry-content">
                        <p className="small-label">{t("club.entries.plan.label")}</p>
                        <h3>{t("club.entries.plan.title")}</h3>
                        <p className="muted-text">{t("club.entries.plan.desc")}</p>
                    </div>
                    <span className="club-entry-arrow">→</span>
                </button>
            </div>

            <article className="panel panel-elevated my-coach-card section-stack section-bottom-gap" style={{ marginTop: '24px' }}>
                <div className="section-head">
                    <h2 className="section-title-sm">{t("club.coachCard.title")}</h2>
                    <span className="pill">{t("club.coachCard.status", { defaultValue: coachInfoCard.status })}</span>
                </div>
                <div className="my-coach-info" style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                    <div className="avatar my-coach-avatar" style={{
                        width: '64px',
                        height: '64px',
                        fontSize: '20px',
                        flexShrink: 0,
                        backgroundImage: coachInfoCard.avatarUrl ? `url(${coachInfoCard.avatarUrl})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: coachInfoCard.avatarUrl ? 'transparent' : 'inherit'
                    }}>
                        {!coachInfoCard.avatarUrl && coachInfoCard.avatar}
                    </div>
                    <div className="my-coach-details">
                        <h3 style={{ margin: '0 0 4px', fontSize: '18px', color: 'var(--on-surface)' }}>{coachInfoCard.name}</h3>
                        <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--tertiary)' }}>{coachInfoCard.title}</p>

                        <div style={{ display: 'grid', gap: '6px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span style={{ color: 'var(--outline)' }}>{t("club.coachCard.contact")}</span>
                                <span style={{ color: 'var(--on-surface)' }}>{coachInfoCard.phone}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span style={{ color: 'var(--outline)' }}>{t("club.coachCard.bestScore")}</span>
                                <span style={{ color: 'var(--primary)' }}>{t("club.coachCard.bestScoreValue", { defaultValue: coachInfoCard.bestScore })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

        </section>
    );
}
