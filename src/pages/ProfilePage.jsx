import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import GolfVenueAvatar from "../components/GolfVenueAvatar";
import LanguageToggle from "../components/LanguageToggle";
import MonthlySettlementModal from "../components/MonthlySettlementModal";
import { achievementItems, MAIN_COACH, PROFILE_HERO_BADGE_LOGO_WEBP, PROFILE_PORTRAIT_URL, rankingGroups } from "../data/mockData";
import { useAppContext } from "../context/AppContext";

export default function ProfilePage() {
    const { t } = useTranslation();
    const { state, actions } = useAppContext();
    const [profileView, setProfileView] = useState("home");
    const [settlementOpen, setSettlementOpen] = useState(false);

    useEffect(() => {
        const scrollMain = document.querySelector(".scroll-main");
        if (scrollMain) {
            scrollMain.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [profileView]);

    const activeAchievement = achievementItems.find((item) => item.id === state.activeAchievementId) || null;

    const portraitSources = useMemo(() => [PROFILE_PORTRAIT_URL, MAIN_COACH.avatarUrl], []);
    const [portraitSrcIndex, setPortraitSrcIndex] = useState(0);
    const showPortraitInitials = portraitSrcIndex >= portraitSources.length;

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
                            <p className="small-label">{t("profile.rankingKicker")}</p>
                            <h1 className="headline">{t("ranking.title")}</h1>
                        </div>
                    </div>
                </header>

                <section className="section-stack section-bottom-gap">
                    <div className="stack-list">
                        {rankingGroups.map((group) => (
                            <article className="panel rank-panel" key={group.title}>
                                <div className="rank-head">
                                    <h3>{t("ranking.skillsOverall")}</h3>
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
                    <GolfVenueAvatar />
                    <div>
                        <p className="small-label">{t("common.venueName")}</p>
                        <h1 className="headline">{t("profile.title")}</h1>
                    </div>
                </div>
                <LanguageToggle className="icon-btn profile-lang-toggle" />
            </header>

            <section className="profile-hero">
                <div className="portrait">
                    {showPortraitInitials ? (
                        <>
                            <span className="portrait-fallback-initials">{t("profile.portraitInitial")}</span>
                            <em aria-hidden="true">★</em>
                        </>
                    ) : (
                        <>
                            <img
                                className="portrait-photo"
                                src={portraitSources[portraitSrcIndex]}
                                alt=""
                                width={152}
                                height={152}
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                onError={() => setPortraitSrcIndex((i) => i + 1)}
                            />
                            <em aria-hidden="true">★</em>
                        </>
                    )}
                </div>
                <h2 className="headline profile-name">{t("profile.studentName")}</h2>
                <span className="member-pill">{t("profile.memberPill")}</span>
            </section>

            <section className="section-stack badge-wall">
                <div className="section-head badge-wall-head">
                    <h2 className="section-title-sm">{t("profile.badgeWall")}</h2>
                    <button
                        type="button"
                        className="settlement-trigger"
                        onClick={() => setSettlementOpen(true)}
                    >
                        {t("profile.settlement.openButton")}
                    </button>
                </div>

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
                        <img
                            src={PROFILE_HERO_BADGE_LOGO_WEBP}
                            alt={t("profile.rankingHero.logoAlt")}
                            className="hero-badge-logo"
                            width={84}
                            height={84}
                            loading="eager"
                            decoding="async"
                            fetchPriority="high"
                        />
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
                        const brightness = 0.5 + levelNum * 0.1;

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
                                <p>{t(`achievements.${item.id}.label`, { defaultValue: item.label })}</p>
                                <span className="badge-state-text">{item.levelScale}</span>
                            </article>
                        );
                    })}
                </div>
            </section>

            <MonthlySettlementModal open={settlementOpen} onClose={() => setSettlementOpen(false)} />

            {activeAchievement ? (
                <div className="modal-mask" onClick={actions.closeAchievement}>
                    <section className="modal-card achievement-detail-modal" onClick={(event) => event.stopPropagation()}>
                        <h3>{t(`achievements.${activeAchievement.id}.label`, { defaultValue: activeAchievement.label })}</h3>
                        <p>{t(`achievements.${activeAchievement.id}.detail`, { defaultValue: activeAchievement.detail })}</p>
                        <p>{t(`achievements.${activeAchievement.id}.rule`, { defaultValue: activeAchievement.rule })}</p>
                        <p>
                            {t("common.level")}：{activeAchievement.rank} / {activeAchievement.levelScale}
                        </p>
                        <p>
                            {t("common.status")}：
                            {activeAchievement.status === "unlocked"
                                ? t("profile.achievementStatus.unlocked")
                                : activeAchievement.status === "progress"
                                    ? t("profile.achievementStatus.progress")
                                    : t("profile.achievementStatus.locked")}
                        </p>
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
