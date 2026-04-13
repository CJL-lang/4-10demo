import { useEffect, useMemo, useState } from "react";
import RecordCard from "../components/RecordCard";
import ProgressOverviewSection from "../components/ProgressOverviewSection";
import { useAppContext } from "../context/AppContext";
import { recordFilterItems, records, coachInfoCard, rankingGroups } from "../data/mockData";

export default function ClubPage({ onGoGrowth, onToast }) {
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
                            aria-label="返回进度首页"
                            onClick={() => setClubView("home")}
                        >
                            ←
                        </button>
                        <div>
                            <p className="small-label">Progress</p>
                            <h1 className="headline">课程记录</h1>
                        </div>
                    </div>
                    <span className="pill">{filteredRecords.length} 条</span>
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
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <p className="tiny-text record-stat">
                        已展示 {visibleRecords.length} / {filteredRecords.length}
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
                                onToast("已加载更多课程记录");
                            }}
                        >
                            加载更多
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
                            aria-label="返回进度首页"
                            onClick={() => setClubView("home")}
                        >
                            ←
                        </button>
                        <div>
                            <p className="small-label">Leaderboards</p>
                            <h1 className="headline">学院排行榜</h1>
                        </div>
                    </div>
                </header>

                <section className="section-stack section-bottom-gap">
                    <div className="stack-list">
                        {rankingGroups.map((group) => (
                            <article className="panel rank-panel" key={group.title}>
                                <div className="rank-head">
                                    <h3>{group.title}</h3>
                                    <span>{group.rank}</span>
                                </div>
                                <div className="rank-rows">
                                    {group.rows.map((row) => (
                                        <div className={`rank-row ${row.isSelf ? "rank-row-self" : ""}`} key={`${group.title}-${row.no}`}>
                                            <span className="rank-medal">{row.no}</span>
                                            <span className="rank-name">
                                                {row.name}
                                                {row.isSelf ? <em className="rank-self-tag">我</em> : null}
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
                    <div className="avatar" style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: 'transparent'
                    }}>PG</div>
                    <div>
                        <p className="small-label">Progress</p>
                        <h1 className="headline">进度</h1>
                    </div>
                </div>
                <button type="button" className="icon-btn" aria-label="通知">
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
                        onToast("已进入课程记录");
                    }}
                >
                    <div className="entry-content">
                        <p className="small-label">Course Records</p>
                        <h3>课程记录</h3>
                        <p className="muted-text">查看技能评测、课程进展与教练建议</p>
                    </div>
                    <span className="club-entry-arrow">→</span>
                </button>

                <button
                    type="button"
                    className="panel panel-low club-entry-card"
                    onClick={() => {
                        setClubView("ranking");
                        onToast("已进入学院排行榜");
                    }}
                >
                    <div className="entry-content">
                        <p className="small-label">Leaderboards</p>
                        <h3>学院排行榜</h3>
                        <p className="muted-text">心理排名、技能等级与学员风采</p>
                    </div>
                    <span className="club-entry-arrow">→</span>
                </button>

                <button
                    type="button"
                    className="panel panel-low club-entry-card"
                    onClick={() => onToast("测评记录功能升级中，敬请期待")}
                >
                    <div className="entry-content">
                        <p className="small-label">Assessments</p>
                        <h3>测评记录</h3>
                        <p className="muted-text">体态评估、挥杆分析与多维数据档案</p>
                    </div>
                    <span className="club-entry-arrow">→</span>
                </button>

                <button
                    type="button"
                    className="panel panel-low club-entry-card"
                    onClick={() => onToast("培养计划制定中，敬请期待")}
                >
                    <div className="entry-content">
                        <p className="small-label">Training Plan</p>
                        <h3>培养计划</h3>
                        <p className="muted-text">你的专属年度、季度进阶训练方案</p>
                    </div>
                    <span className="club-entry-arrow">→</span>
                </button>
            </div>

            <article className="panel panel-elevated my-coach-card section-stack section-bottom-gap" style={{ marginTop: '24px' }}>
                <div className="section-head">
                    <h2 className="section-title-sm">教练名片</h2>
                    <span className="pill">{coachInfoCard.status}</span>
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
                                <span style={{ color: 'var(--outline)' }}>联系方式：</span>
                                <span style={{ color: 'var(--on-surface)' }}>{coachInfoCard.phone}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span style={{ color: 'var(--outline)' }}>最佳带队成绩：</span>
                                <span style={{ color: 'var(--primary)' }}>{coachInfoCard.bestScore}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

        </section>
    );
}
