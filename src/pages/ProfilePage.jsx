import { achievementItems, rankingGroups } from "../data/mockData";
import { useAppContext } from "../context/AppContext";

export default function ProfilePage() {
    const { state, actions } = useAppContext();
    const unlockedCount = achievementItems.filter((item) => item.status === "unlocked").length;
    const activeAchievement = achievementItems.find((item) => item.id === state.activeAchievementId) || null;

    return (
        <section className="screen fade-enter">
            <header className="top-header profile-header">
                <div className="user-chip">
                    <div className="avatar">ZA</div>
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
                <div className="badge-grid">
                    {achievementItems.map((item) => (
                        <article
                            className={`panel badge-card badge-card-${item.status}`}
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
                            <div className="badge-rank">
                                <small>RANK</small>
                                <strong>{item.rank}</strong>
                            </div>
                            <p>{item.label}</p>
                            <span className="badge-state-text">
                                {item.status === "unlocked" ? "已解锁" : item.status === "progress" ? `${item.current}/${item.target}` : "未解锁"}
                            </span>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section-stack section-bottom-gap">
                <div className="section-head">
                    <h2 className="section-title-sm">学院排行榜</h2>
                    <button type="button" className="btn-ghost small">按月结算</button>
                </div>

                <div className="stack-list">
                    {rankingGroups.map((group) => (
                        <article className="panel rank-panel" key={group.title}>
                            <div className="rank-head">
                                <h3>{group.title}</h3>
                                <span>{group.rank}</span>
                            </div>
                            <div className="rank-rows">
                                {group.rows.map((row) => (
                                    <div className="rank-row" key={`${group.title}-${row.no}`}>
                                        <span className="rank-medal">{row.no}</span>
                                        <span className="rank-name">{row.name}</span>
                                        <span className="rank-value">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {activeAchievement ? (
                <div className="modal-mask" onClick={actions.closeAchievement}>
                    <section className="modal-card achievement-detail-modal" onClick={(event) => event.stopPropagation()}>
                        <h3>{activeAchievement.label}</h3>
                        <p>{activeAchievement.detail}</p>
                        <p>进度：{activeAchievement.current}/{activeAchievement.target}</p>
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
