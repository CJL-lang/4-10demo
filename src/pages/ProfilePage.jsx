import { useEffect, useState } from "react";
import { achievementItems, rankingGroups } from "../data/mockData";
import { useAppContext } from "../context/AppContext";

export default function ProfilePage() {
    const { state, actions } = useAppContext();
    const [profileView, setProfileView] = useState("home");

    useEffect(() => {
        const scrollMain = document.querySelector(".scroll-main");
        if (scrollMain) {
            scrollMain.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [profileView]);

    const unlockedCount = achievementItems.filter((item) => item.status === "unlocked").length;
    const activeAchievement = achievementItems.find((item) => item.id === state.activeAchievementId) || null;

    if (profileView === "ranking") {
        return (
            <section className="screen swing-3d-enter">
                <header className="top-header club-subpage-header">
                    <div className="user-chip">
                        <button
                            type="button"
                            className="icon-btn"
                            aria-label="返回"
                            onClick={() => setProfileView("home")}
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
        <section className="screen fade-enter">
            <header className="top-header profile-header">
                <div className="user-chip">
                    <div className="avatar" style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: 'transparent'
                    }}>ZA</div>
                    <h1 className="headline">THE ACADEMY</h1>
                </div>
                <button type="button" className="icon-btn" aria-label="设置">
                    ⊙
                </button>
            </header>

            <section className="profile-hero">
                <div className="portrait">
                    <span>ZA</span>
                    <em>★</em>
                </div>
                <h2 className="headline profile-name">张逸尘</h2>
                <span className="member-pill">ELITE MEMBER</span>
            </section>

            <section className="section-stack">
                <div className="section-head">
                    <h2 className="section-title-sm">勋章墙</h2>
                    <span className="muted-text">已获得 {unlockedCount}/{achievementItems.length}</span>
                </div>

                {/* 学院排名专属主勋章 */}
                <article 
                    className="badge-hero-card" 
                    onClick={() => setProfileView("ranking")} 
                    role="button" 
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setProfileView("ranking");
                        }
                    }}
                >
                    <div className="hero-badge-visual">
                        {/* 我们假设导出的logo图片保存为 public/logo.png */}
                        <img src="/logo.png" alt="Academy Rank Logo" className="hero-badge-logo" />
                        <div className="hero-badge-glow"></div>
                    </div>
                    <div className="hero-badge-info">
                        <p className="hero-badge-label">全院综合排名</p>
                        <h3 className="hero-badge-value">NO. 4</h3>
                        <p className="hero-badge-desc">ELITE 级学员</p>
                    </div>
                    <span className="hero-badge-arrow">→</span>
                </article>

                <div className="badge-grid">
                    {achievementItems.map((item) => {
                        const levelNum = parseInt(item.rank.replace(/\D/g, ""), 10) || 1;
                        const brightness = 0.5 + levelNum * 0.1; // L1: 0.6, L9: 1.4
                        
                        return (
                            <article
                                className="panel badge-card"
                                key={item.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => actions.openAchievement(item.id)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        actions.openAchievement(item.id);
                                    }
                                }}
                            >
                                <div className="badge-rank" style={{ filter: `brightness(${brightness})` }}>
                                    <small>LEVEL</small>
                                    <strong>{item.rank}</strong>
                                </div>
                                <p>{item.label}</p>
                                <span className="badge-state-text">{item.levelScale}</span>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="section-stack section-bottom-gap">
                <button
                    type="button"
                    className="panel panel-low profile-entry-card"
                    onClick={() => setProfileView("ranking")}
                >
                    <div className="entry-content">
                        <h3 className="section-title-sm">学院排行榜</h3>
                        <p className="muted-text">查看您的学院排名与当前段位</p>
                    </div>
                    <span className="entry-arrow">→</span>
                </button>
            </section>

            {activeAchievement ? (
                <div className="modal-mask" onClick={actions.closeAchievement}>
                    <section className="modal-card achievement-detail-modal" onClick={(event) => event.stopPropagation()}>
                        <h3>{activeAchievement.label}</h3>
                        <p>{activeAchievement.detail}</p>
                        <p>{activeAchievement.rule}</p>
                        <p>等级：{activeAchievement.rank} / {activeAchievement.levelScale}</p>
                        <p>状态：{activeAchievement.status === "unlocked" ? "已解锁" : activeAchievement.status === "progress" ? "进行中" : "未解锁"}</p>
                        <p>{activeAchievement.milestone}</p>
                        <div className="modal-actions">
                            <button type="button" className="btn-ghost" onClick={actions.closeAchievement}>
                                关闭
                            </button>
                            <button type="button" className="btn-primary" onClick={actions.closeAchievement}>
                                我知道了
                            </button>
                        </div>
                    </section>
                </div>
            ) : null}
        </section>
    );
}
