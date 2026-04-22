import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import CourseRecordsScreen from "../components/CourseRecordsScreen";
import MyCoachScreen from "../components/MyCoachScreen";
import MyPackagesScreen from "../components/MyPackagesScreen";
import GolfVenueAvatar from "../components/GolfVenueAvatar";
import LanguageToggle from "../components/LanguageToggle";
import MonthlySettlementModal from "../components/MonthlySettlementModal";
import ProfileHeroMedal from "../components/ProfileHeroMedal";
import {
    achievementItems,
    dimensionMedalItems,
    MAIN_COACH,
    PROFILE_HERO_BADGE_LOGO_WEBP,
    PROFILE_PORTRAIT_URL,
    rankingGroups,
} from "../data/mockData";
import { useAppContext } from "../context/AppContext";

const PROFILE_LAYOUT_STORAGE_KEY = "academy-react-prototype-profile-layout";

function readStoredProfileLayout() {
    try {
        return localStorage.getItem(PROFILE_LAYOUT_STORAGE_KEY) === "legacy" ? "legacy" : "new";
    } catch {
        return "new";
    }
}

export default function ProfilePage({ onToast }) {
    const { t } = useTranslation();
    const { state, actions } = useAppContext();
    const [profileView, setProfileView] = useState(() => {
        if (state.resumeProfileSubView === "records") {
            return "records";
        }
        if (state.resumeProfileSubView === "packagesDetail") {
            return "packages";
        }
        return "home";
    });
    const [showSettlementModal, setShowSettlementModal] = useState(false);
    const [profileLayout, setProfileLayout] = useState(readStoredProfileLayout);
    const [achievementModalRoot, setAchievementModalRoot] = useState(null);
    const [showMedalPicker, setShowMedalPicker] = useState(false);
    const [pickerDraftId, setPickerDraftId] = useState(null);
    const [badgeWallExpanded, setBadgeWallExpanded] = useState(false);
    const [activeDimensionKey, setActiveDimensionKey] = useState(null);

    useEffect(() => {
        try {
            localStorage.setItem(PROFILE_LAYOUT_STORAGE_KEY, profileLayout);
        } catch {
            /* ignore */
        }
    }, [profileLayout]);

    useLayoutEffect(() => {
        setAchievementModalRoot(document.querySelector(".device-shell"));
    }, []);

    useEffect(() => {
        if (!showMedalPicker) {
            return undefined;
        }
        const onKey = (e) => {
            if (e.key === "Escape") {
                setShowMedalPicker(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [showMedalPicker]);

    useEffect(() => {
        if (!activeDimensionKey) {
            return undefined;
        }
        const onKey = (e) => {
            if (e.key === "Escape") {
                setActiveDimensionKey(null);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [activeDimensionKey]);

    useEffect(() => {
        if (state.activeAchievementId) {
            setActiveDimensionKey(null);
        }
    }, [state.activeAchievementId]);

    useEffect(() => {
        const scrollMain = document.querySelector(".scroll-main");
        if (scrollMain) {
            scrollMain.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [profileView]);

    const activeAchievement = achievementItems.find((item) => item.id === state.activeAchievementId) || null;
    const wornAchievement = useMemo(
        () => achievementItems.find((item) => item.id === state.wornAchievementId) || null,
        [state.wornAchievementId]
    );

    const badgeWallItems = useMemo(
        () => [
            ...achievementItems.map((item) => ({ kind: "skill", ...item })),
            ...dimensionMedalItems.map((item) => ({ kind: "dimension", ...item })),
        ],
        []
    );
    const visibleBadgeWallItems = badgeWallExpanded ? badgeWallItems : badgeWallItems.slice(0, 6);
    const activeDimensionMedal = useMemo(
        () => (activeDimensionKey ? dimensionMedalItems.find((d) => d.dimensionKey === activeDimensionKey) : null),
        [activeDimensionKey]
    );

    const portraitSources = useMemo(() => [PROFILE_PORTRAIT_URL, MAIN_COACH.avatarUrl], []);
    const [portraitSrcIndex, setPortraitSrcIndex] = useState(0);
    const showPortraitInitials = portraitSrcIndex >= portraitSources.length;

    const toast = typeof onToast === "function" ? onToast : () => {};

    const profileMenuItems = useMemo(
        () => [
            {
                id: "package",
                icon: "🎫",
                label: t("profile.entries.package.title"),
                onClick: () => {
                    setProfileView("packages");
                    toast(t("profile.enteredMyPackages"));
                },
            },
            {
                id: "courseRecords",
                icon: "📋",
                label: t("profile.entries.courseRecords.title"),
                onClick: () => {
                    actions.setResumeProfileSubView(null);
                    setProfileView("records");
                    toast(t("profile.enteredCourseRecords"));
                },
            },
            {
                id: "myCoach",
                icon: "🏌️",
                label: t("profile.entries.myCoach.title"),
                onClick: () => {
                    setProfileView("coach");
                    toast(t("profile.enteredMyCoach"));
                },
            },
        ],
        [t, toast, actions, setProfileView]
    );

    if (profileView === "coach") {
        return <MyCoachScreen onBack={() => setProfileView("home")} />;
    }

    if (profileView === "packages") {
        return (
            <MyPackagesScreen
                onBack={() => {
                    actions.setResumeProfilePackageId(null);
                    setProfileView("home");
                }}
                onOpenCourseRecords={(pkg) => {
                    if (pkg?.id) {
                        actions.setResumeProfilePackageId(pkg.id);
                    }
                    actions.setResumeProfileSubView(null);
                    setProfileView("records");
                    toast(t("profile.enteredCourseRecords"));
                }}
                onOpenAssessmentRecords={(pkg) => {
                    const recordId = pkg?.assessmentRecordEntry?.recordId;
                    if (pkg?.id) {
                        actions.setResumeProfilePackageId(pkg.id);
                    }
                    actions.setResumeClubSubView(recordId ? "assessmentRecordDetail" : "assessmentRecords");
                    actions.setResumeAssessmentRecord(recordId ?? null);
                    actions.setTab("club");
                    toast(t("profile.enteredAssessmentRecords"));
                }}
                onOpenTrainingPlan={(pkg) => {
                    if (pkg?.id) {
                        actions.setResumeProfilePackageId(pkg.id);
                    }
                    actions.setResumeClubSubView("plan");
                    actions.setTab("club");
                    toast(t("profile.enteredTrainingPlan"));
                }}
            />
        );
    }

    if (profileView === "records") {
        return (
            <CourseRecordsScreen
                onBack={() => {
                    actions.setResumeProfileSubView(null);
                    if (state.resumeProfilePackageId) {
                        setProfileView("packages");
                    } else {
                        setProfileView("home");
                    }
                }}
                onToast={toast}
            />
        );
    }

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
                <div className="header-actions">
                    <LanguageToggle className="icon-btn profile-lang-toggle" />
                    <button
                        type="button"
                        className="icon-btn profile-layout-toggle"
                        aria-label={profileLayout === "new" ? t("profile.profileLayoutToggle.switchToLegacy") : t("profile.profileLayoutToggle.switchToNew")}
                        onClick={() => setProfileLayout((prev) => (prev === "new" ? "legacy" : "new"))}
                    >
                        {profileLayout === "new" ? t("profile.profileLayoutToggle.buttonToLegacy") : t("profile.profileLayoutToggle.buttonToNew")}
                    </button>
                </div>
            </header>

            <section className="profile-hero">
                <div className="profile-hero__stage">
                    <div className="portrait">
                        {showPortraitInitials ? (
                            <span className="portrait-fallback-initials">{t("profile.portraitInitial")}</span>
                        ) : (
                            <img
                                className="portrait-photo"
                                src={portraitSources[portraitSrcIndex]}
                                alt=""
                                width={112}
                                height={112}
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                onError={() => setPortraitSrcIndex((i) => i + 1)}
                            />
                        )}
                    </div>
                    <ProfileHeroMedal
                        item={wornAchievement}
                        onOpenPicker={() => {
                            setPickerDraftId(state.wornAchievementId ?? null);
                            setShowMedalPicker(true);
                        }}
                    />
                </div>
                <h2 className="headline profile-name">{t("profile.studentName")}</h2>
            </section>

            <section className="section-stack badge-wall">
                <div className="section-head">
                    <h2 className="section-title-sm">{t("profile.badgeWall")}</h2>
                    <button
                        type="button"
                        className="settlement-trigger-pill"
                        onClick={() => setShowSettlementModal(true)}
                    >
                        {profileLayout === "new" ? t("profile.settlementPill.talent") : t("profile.settlementPill.ranking")}
                    </button>
                </div>

                <article
                    className={
                        profileLayout === "new"
                            ? "badge-hero-card badge-hero-card--dual-medals badge-hero-card--non-interactive"
                            : "badge-hero-card"
                    }
                    {...(profileLayout === "legacy"
                        ? {
                              role: "button",
                              tabIndex: 0,
                              "aria-label": t("profile.rankingEntry.desc"),
                              onClick: () => setProfileView("ranking"),
                              onKeyDown: (event) => {
                                  if (event.key === "Enter" || event.key === " ") {
                                      event.preventDefault();
                                      setProfileView("ranking");
                                  }
                              },
                          }
                        : {})}
                >
                    {profileLayout === "legacy" ? (
                        <>
                            <div className="hero-badge-visual">
                                <img
                                    src={PROFILE_HERO_BADGE_LOGO_WEBP}
                                    alt={t("profile.rankingHero.logoAlt")}
                                    className="hero-badge-logo"
                                    width={72}
                                    height={72}
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
                            <span className="hero-badge-arrow" aria-hidden="true">
                                →
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="badge-hero-dual-medals">
                                <div className="profile-medal-tile">
                                    <div className="profile-medal-tile__stage">
                                        <div className="settlement-badge-wrapper">
                                            <img
                                                src={PROFILE_HERO_BADGE_LOGO_WEBP}
                                                alt=""
                                                className="settlement-badge-img"
                                                width={88}
                                                height={88}
                                                loading="eager"
                                                decoding="async"
                                            />
                                        </div>
                                        <div className="settlement-ribbon-container settlement-ribbon-container--profile-medal">
                                            <div className="settlement-ribbon settlement-ribbon--profile-compact">
                                                <span className="settlement-rank-text settlement-rank-text--profile-compact">
                                                    {t("profile.medals.progress")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="profile-medal-tile">
                                    <div className="profile-medal-tile__stage">
                                        <div className="settlement-badge-wrapper">
                                            <img
                                                src={PROFILE_HERO_BADGE_LOGO_WEBP}
                                                alt=""
                                                className="settlement-badge-img"
                                                width={88}
                                                height={88}
                                                loading="eager"
                                                decoding="async"
                                            />
                                        </div>
                                        <div className="settlement-ribbon-container settlement-ribbon-container--profile-medal">
                                            <div className="settlement-ribbon settlement-ribbon--profile-compact">
                                                <span className="settlement-rank-text settlement-rank-text--profile-compact">
                                                    {t("profile.medals.talent")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </article>

                <div className="badge-grid">
                    {visibleBadgeWallItems.map((item, idx) => {
                        const levelNum = parseInt(String(item.rank).replace(/\D/g, ""), 10) || 1;
                        const brightness = 0.5 + levelNum * 0.1;
                        const isSkill = item.kind === "skill";
                        const dimKey = item.dimensionKey;
                        const titleText = isSkill
                            ? t(`achievements.${item.id}.label`, { defaultValue: item.label })
                            : t(`progressAssessment.${dimKey}.title`);
                        const open = () => {
                            if (isSkill) {
                                setActiveDimensionKey(null);
                                actions.openAchievement(item.id);
                            } else {
                                actions.closeAchievement();
                                setActiveDimensionKey(dimKey);
                            }
                        };

                        return (
                            <article
                                className={`panel badge-card${
                                    isSkill && item.id === state.wornAchievementId ? " badge-card--worn" : ""
                                }`}
                                key={item.id}
                                role="button"
                                tabIndex={0}
                                style={{ animationDelay: `${idx * 52}ms` }}
                                onClick={open}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        open();
                                    }
                                }}
                            >
                                <div className="badge-card__inner">
                                    {isSkill && item.id === state.wornAchievementId ? (
                                        <span className="badge-card__worn-pill">{t("profile.medalEquipped")}</span>
                                    ) : null}
                                    <div className="badge-rank" style={{ filter: `brightness(${brightness})` }}>
                                        <span className="badge-rank__ring" aria-hidden="true" />
                                        <small className="badge-rank__eyebrow">LEVEL</small>
                                        <strong className="badge-rank__level">{item.rank}</strong>
                                    </div>
                                    <p className="badge-card__title">{titleText}</p>
                                    <span className="badge-state-text">{item.levelScale}</span>
                                </div>
                            </article>
                        );
                    })}
                </div>
                {badgeWallItems.length > 6 ? (
                    <button
                        type="button"
                        className="badge-wall-expand-btn"
                        aria-expanded={badgeWallExpanded}
                        onClick={() => setBadgeWallExpanded((v) => !v)}
                    >
                        {badgeWallExpanded ? t("profile.badgeWallViewLess") : t("profile.badgeWallViewMore")}
                    </button>
                ) : null}
            </section>

            <section className="section-stack profile-menu-section" aria-labelledby="profile-menu-heading">
                <h2 id="profile-menu-heading" className="profile-menu-heading">
                    <span className="profile-menu-heading__accent" aria-hidden />
                    {t("profile.menuHeading")}
                </h2>
                <ul className="profile-menu-list">
                    {profileMenuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                className="profile-menu-tile"
                                aria-label={item.label}
                                onClick={item.onClick}
                            >
                                <span className="profile-menu-tile__icon" aria-hidden>
                                    {item.icon}
                                </span>
                                <span className="profile-menu-tile__label">{item.label}</span>
                                <span className="profile-menu-tile__chevron" aria-hidden>
                                    ›
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="section-stack profile-actions-section" aria-label={t("profile.logoutSectionAria")}>
                <button
                    type="button"
                    className="profile-logout-btn wide"
                    aria-label={t("profile.logoutAria")}
                    onClick={() => actions.logout()}
                >
                    {t("profile.logout")}
                </button>
            </section>

            {achievementModalRoot && activeDimensionKey && activeDimensionMedal && !activeAchievement
                ? createPortal(
                      <div
                          className="modal-mask"
                          role="dialog"
                          aria-modal="true"
                          aria-labelledby="dimension-detail-title"
                          onClick={() => setActiveDimensionKey(null)}
                      >
                          <section
                              className="modal-card achievement-detail-modal"
                              onClick={(event) => event.stopPropagation()}
                          >
                              <h3 id="dimension-detail-title">
                                  {t(`progressAssessment.${activeDimensionKey}.title`)}
                              </h3>
                              <p>
                                  {t("profile.dimensionMedalModalBody", {
                                      dimension: t(`progressAssessment.${activeDimensionKey}.title`),
                                      rank: activeDimensionMedal.rank,
                                      scale: t("profile.dimensionMedalScale"),
                                  })}
                              </p>
                              <div className="modal-actions achievement-detail-modal__actions">
                                  <button type="button" className="btn-ghost" onClick={() => setActiveDimensionKey(null)}>
                                      {t("common.close")}
                                  </button>
                              </div>
                          </section>
                      </div>,
                      achievementModalRoot
                  )
                : null}

            {activeAchievement && achievementModalRoot
                ? createPortal(
                      <div
                          className="modal-mask"
                          role="dialog"
                          aria-modal="true"
                          aria-labelledby="achievement-detail-title"
                          onClick={actions.closeAchievement}
                      >
                          <section
                              className="modal-card achievement-detail-modal"
                              onClick={(event) => event.stopPropagation()}
                          >
                              <h3 id="achievement-detail-title">
                                  {t(`achievements.${activeAchievement.id}.label`, { defaultValue: activeAchievement.label })}
                              </h3>
                              <p>{t(`achievements.${activeAchievement.id}.detail`, { defaultValue: activeAchievement.detail })}</p>
                              <p>{t(`achievements.${activeAchievement.id}.rule`, { defaultValue: activeAchievement.rule })}</p>
                              <div className="modal-actions achievement-detail-modal__actions">
                                  {activeAchievement.status !== "locked" && state.wornAchievementId === activeAchievement.id ? (
                                      <button
                                          type="button"
                                          className="btn-ghost"
                                          onClick={() => {
                                              actions.clearWornAchievement();
                                              toast(t("profile.toastMedalRemoved"));
                                              actions.closeAchievement();
                                          }}
                                      >
                                          {t("profile.removeMedal")}
                                      </button>
                                  ) : null}
                                  {activeAchievement.status !== "locked" && state.wornAchievementId !== activeAchievement.id ? (
                                      <button
                                          type="button"
                                          className="btn-primary"
                                          onClick={() => {
                                              actions.setWornAchievement(activeAchievement.id);
                                              toast(t("profile.toastMedalEquipped"));
                                              actions.closeAchievement();
                                          }}
                                      >
                                          {t("profile.wearThisMedal")}
                                      </button>
                                  ) : null}
                                  <button type="button" className="btn-ghost" onClick={actions.closeAchievement}>
                                      {t("common.close")}
                                  </button>
                              </div>
                          </section>
                      </div>,
                      achievementModalRoot
                  )
                : null}

            {achievementModalRoot && showMedalPicker
                ? createPortal(
                      <div
                          className="modal-mask profile-medal-picker-mask"
                          role="presentation"
                          onClick={() => setShowMedalPicker(false)}
                      >
                          <section
                              className="modal-card profile-medal-picker"
                              role="dialog"
                              aria-modal="true"
                              aria-labelledby="medal-picker-title"
                              onClick={(event) => event.stopPropagation()}
                          >
                              <h3 id="medal-picker-title">{t("profile.medalPickerTitle")}</h3>
                              <p className="profile-medal-picker__hint muted-text">{t("profile.medalPickerHint")}</p>
                              <div className="profile-medal-picker__list" role="radiogroup" aria-label={t("profile.medalPickerTitle")}>
                                  <button
                                      type="button"
                                      role="radio"
                                      aria-checked={pickerDraftId === null}
                                      className={`profile-medal-picker__row${pickerDraftId === null ? " is-active" : ""}`}
                                      onClick={() => setPickerDraftId(null)}
                                  >
                                      <span className="profile-medal-picker__row-label">{t("profile.medalPickerNone")}</span>
                                  </button>
                                  {achievementItems.map((item) => {
                                      const levelNum = parseInt(String(item.rank).replace(/\D/g, ""), 10) || 1;
                                      const brightness = 0.5 + levelNum * 0.1;
                                      const locked = item.status === "locked";
                                      return (
                                          <button
                                              key={item.id}
                                              type="button"
                                              role="radio"
                                              aria-checked={pickerDraftId === item.id}
                                              aria-disabled={locked}
                                              disabled={locked}
                                              className={`profile-medal-picker__row${pickerDraftId === item.id ? " is-active" : ""}${
                                                  locked ? " is-locked" : ""
                                              }`}
                                              onClick={() => {
                                                  if (!locked) {
                                                      setPickerDraftId(item.id);
                                                  }
                                              }}
                                          >
                                              <div
                                                  className="badge-rank profile-medal-picker__mini"
                                                  style={{ filter: `brightness(${brightness})` }}
                                                  aria-hidden="true"
                                              >
                                                  <span className="badge-rank__ring" />
                                                  <small className="badge-rank__eyebrow">LEVEL</small>
                                                  <strong className="badge-rank__level">{item.rank}</strong>
                                              </div>
                                              <div className="profile-medal-picker__row-main">
                                                  <span className="profile-medal-picker__row-title">
                                                      {t(`achievements.${item.id}.label`, { defaultValue: item.label })}
                                                  </span>
                                                  {locked ? (
                                                      <span className="profile-medal-picker__locked">{t("profile.medalLockedHint")}</span>
                                                  ) : null}
                                              </div>
                                          </button>
                                      );
                                  })}
                              </div>
                              <div className="profile-medal-picker__footer">
                                  <button type="button" className="btn-ghost" onClick={() => setShowMedalPicker(false)}>
                                      {t("profile.medalPickerCancel")}
                                  </button>
                                  {state.wornAchievementId ? (
                                      <button
                                          type="button"
                                          className="btn-ghost"
                                          onClick={() => {
                                              actions.clearWornAchievement();
                                              toast(t("profile.toastMedalRemoved"));
                                              setShowMedalPicker(false);
                                          }}
                                      >
                                          {t("profile.medalRemove")}
                                      </button>
                                  ) : null}
                                  <button
                                      type="button"
                                      className="btn-primary"
                                      onClick={() => {
                                          if (pickerDraftId === null) {
                                              if (state.wornAchievementId) {
                                                  actions.clearWornAchievement();
                                                  toast(t("profile.toastMedalRemoved"));
                                              }
                                              setShowMedalPicker(false);
                                              return;
                                          }
                                          const sel = achievementItems.find((x) => x.id === pickerDraftId);
                                          if (!sel || sel.status === "locked") {
                                              return;
                                          }
                                          actions.setWornAchievement(pickerDraftId);
                                          toast(t("profile.toastMedalEquipped"));
                                          setShowMedalPicker(false);
                                      }}
                                  >
                                      {t("profile.medalPickerApply")}
                                  </button>
                              </div>
                          </section>
                      </div>,
                      achievementModalRoot
                  )
                : null}

            {showSettlementModal && (
                <MonthlySettlementModal onClose={() => setShowSettlementModal(false)} />
            )}
        </section>
    );
}
