import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";
import { achievementItems, rankingGroups, STUDENT_AVATAR_URL } from "../data/mockData";
import { useAppContext } from "../context/AppContext";

export default function ProfilePage() {
    const { t } = useTranslation();
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
                            aria-label={t("profile.backAria")}
                            onClick={() => setProfileView("home")}
                        >
                            ←
                        </button>
                        <div>
                            <p className="small-label">{t("ranking.subtitle")}</p>
                            <h1 className="headline">{t("ranking.title")}</h1>
                        </div>
                    </div>
                    <div className="header-actions">
                        <LanguageToggle />
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
        <section className="screen fade-enter">
            <header className="top-header profile-header">
                <div className="user-chip">
                    <div className="avatar golf-icon" aria-hidden="true">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="16" y="2" width="8" height="20" fill="currentColor" fillOpacity="0.3" />
                            <path d="M20 22L14 38H26L20 22Z" fill="currentColor" fillOpacity="0.9" />
                            <circle cx="20" cy="20" r="3" fill="currentColor" />
                        </svg>
                    </div>
                    <div>
                        <p className="small-label">{t("profile.venue")}</p>
                        <h1 className="headline">{t("profile.title")}</h1>
                    </div>
                </div>
                <div className="header-actions header-actions-stack">
                    <LanguageToggle />
                </div>
            </header>

            <section className="profile-hero">
                <div
                    className="portrait portrait-photo"
                    style={{
                        backgroundImage: `url(${STUDENT_AVATAR_URL})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center top",
                    }}
                    aria-label={t("profile.avatarAria")}
                >
                    <em>★</em>
                </div>
                <h2 className="headline profile-name">张逸尘</h2>
                <span className="member-pill">{t("profile.member")}</span>
            </section>

            <section className="section-stack">
                <div className="section-head">
                    <h2 className="section-title-sm">{t("profile.badgeWall")}</h2>
                    <span className="muted-text">{t("profile.badgeProgress", { unlocked: unlockedCount, total: achievementItems.length })}</span>
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
                        <img src="/logo.png" alt={t("profile.rankingHero.logoAlt")} className="hero-badge-logo" />
                        <div className="hero-badge-glow"></div>
                    </div>
                    <div className="hero-badge-info">
                        <p className="hero-badge-label">{t("profile.rankingHero.label")}</p>
                        <h3 className="hero-badge-value">{t("profile.rankingHero.value")}</h3>
                        <p className="hero-badge-desc">{t("profile.rankingHero.desc")}</p>
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
                                    <small>{t("common.level")}</small>
                                    <strong>{item.rank}</strong>
                                </div>
                                <p>{t(`achievements.${item.id}.label`, { defaultValue: item.label })}</p>
                                <span className="badge-state-text">{item.levelScale}</span>
                            </article>
                        );
                    })}
                </div>
            </section>

            {activeAchievement ? (
                <div className="modal-mask" onClick={actions.closeAchievement}>
                    <section className="modal-card achievement-detail-modal" onClick={(event) => event.stopPropagation()}>
                        <h3>{t(`achievements.${activeAchievement.id}.label`, { defaultValue: activeAchievement.label })}</h3>
                        <p>{t(`achievements.${activeAchievement.id}.detail`, { defaultValue: activeAchievement.detail })}</p>
                        <p>{t(`achievements.${activeAchievement.id}.rule`, { defaultValue: activeAchievement.rule })}</p>
                        <p>{t("common.level")}：{activeAchievement.rank} / {activeAchievement.levelScale}</p>
                        <p>{t("common.status")}：{t(`profile.achievementStatus.${activeAchievement.status}`)}</p>
                        <p>{t(`achievements.${activeAchievement.id}.milestone`, { defaultValue: activeAchievement.milestone })}</p>
                        <div className="modal-actions">
                            <button type="button" className="btn-ghost" onClick={actions.closeAchievement}>
                                {t("common.close")}
                            </button>
                            <button type="button" className="btn-primary" onClick={actions.closeAchievement}>
                                {t("common.gotIt")}
                            </button>
                        </div>
                    </section>
                </div>
            ) : null}
        </section>
    );
}
