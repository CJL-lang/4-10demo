import { useEffect, useId, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../context/AppContext";
import { studentPackages } from "../data/mockData";

const RING_RADIUS = 38;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

function clamp01(n) {
    if (Number.isNaN(n) || !Number.isFinite(n)) {
        return 0;
    }
    return Math.min(1, Math.max(0, n));
}

/** 从「4/5节」或百分比文案解析 0–1，供环形进度使用 */
function attendanceProgressRatio(overview) {
    if (!overview) {
        return 0;
    }
    const detail = String(overview.attendanceDetail || "");
    const frac = detail.match(/(\d+)\s*\/\s*(\d+)/);
    if (frac) {
        const a = Number(frac[1]);
        const b = Number(frac[2]);
        if (b > 0) {
            return clamp01(a / b);
        }
    }
    const label = String(overview.attendanceLabel || "");
    const pct = label.match(/(\d+(?:\.\d+)?)\s*%/);
    if (pct) {
        return clamp01(Number(pct[1]) / 100);
    }
    return 0;
}

function PackageHeroStatRing({ label, valueText, progress, ariaLabel }) {
    const [drawProgress, setDrawProgress] = useState(0);
    const p = clamp01(progress);
    const dash = drawProgress * RING_CIRC;

    useLayoutEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mq.matches) {
            setDrawProgress(p);
            return undefined;
        }
        setDrawProgress(0);
        const id = window.requestAnimationFrame(() => {
            setDrawProgress(p);
        });
        return () => window.cancelAnimationFrame(id);
    }, [p]);

    return (
        <div className="package-hero-stat package-hero-stat--ring" aria-label={ariaLabel}>
            <div className="package-hero-stat__ring-wrap">
                <svg className="package-hero-stat__svg" viewBox="0 0 100 100" aria-hidden="true">
                    <circle className="package-hero-stat__track" cx="50" cy="50" r={RING_RADIUS} />
                    <circle
                        className="package-hero-stat__fill"
                        cx="50"
                        cy="50"
                        r={RING_RADIUS}
                        strokeDasharray={`${dash} ${RING_CIRC}`}
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className="package-hero-stat__center" aria-hidden="true">
                    <strong className="package-hero-stat__value">{valueText}</strong>
                </div>
            </div>
            <span className="package-hero-stat__label">{label}</span>
        </div>
    );
}

/** 与 Profile 佩戴勋章同构的缩小版：头像 + 颈部挂绳奖牌（只读展示） */
function PartnerAvatarWithMedal({ name, rank, avatarUrl }) {
    const uid = useId().replace(/:/g, "");
    const levelNum = parseInt(String(rank).replace(/\D/g, ""), 10) || 1;
    const brightness = 0.5 + levelNum * 0.1;
    const gradId = `pkgMiniLanyard-${uid}`;

    return (
        <div className="package-partner-mini">
            <div className="package-partner-mini__stage">
                <div className="package-partner-mini__portrait">
                    <img src={avatarUrl} alt="" width={72} height={72} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                </div>
                <div className="package-partner-mini__medal" aria-hidden="true">
                    <div className="package-partner-mini__pendulum">
                        <svg className="package-partner-mini__lanyard" viewBox="0 0 64 42" width="64" height="42">
                            <defs>
                                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8b6914" />
                                    <stop offset="45%" stopColor="#d4a64a" />
                                    <stop offset="100%" stopColor="#a67c1f" />
                                </linearGradient>
                            </defs>
                            <ellipse cx="32" cy="5" rx="5" ry="3" fill={`url(#${gradId})`} opacity="0.95" />
                            <path
                                d="M32 7.5 Q 22 16 20 28 Q 19 34 24 38"
                                fill="none"
                                stroke={`url(#${gradId})`}
                                strokeWidth="2.4"
                                strokeLinecap="round"
                            />
                            <path
                                d="M32 7.5 Q 42 16 44 28 Q 45 34 40 38"
                                fill="none"
                                stroke={`url(#${gradId})`}
                                strokeWidth="2.4"
                                strokeLinecap="round"
                            />
                            <circle cx="32" cy="39" r="3.2" fill="none" stroke="#6b5420" strokeWidth="1.4" />
                            <circle cx="32" cy="39" r="1.6" fill="#c9a227" />
                        </svg>
                        <div className="package-partner-mini__coin" style={{ filter: `brightness(${brightness})` }}>
                            <span className="package-partner-mini__shine" aria-hidden="true" />
                            <span className="badge-rank__ring" aria-hidden="true" />
                            <small className="badge-rank__eyebrow">LEVEL</small>
                            <strong className="badge-rank__level">{rank}</strong>
                        </div>
                    </div>
                </div>
            </div>
            <p className="package-partner-mini__name">{name}</p>
        </div>
    );
}

function PackageChevronIcon() {
    return (
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path
                d="M7.72 4.47a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06L11.19 9 7.72 5.53a.75.75 0 0 1 0-1.06Z"
                fill="currentColor"
            />
        </svg>
    );
}

function PackageSectionIcon({ kind }) {
    if (kind === "plan") {
        return (
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <path
                    d="M5 3.25A2.75 2.75 0 0 0 2.25 6v8A2.75 2.75 0 0 0 5 16.75h10A2.75 2.75 0 0 0 17.75 14V6A2.75 2.75 0 0 0 15 3.25H5Zm0 1.5h10c.69 0 1.25.56 1.25 1.25v.46H3.75V6c0-.69.56-1.25 1.25-1.25Zm-1.25 3.21h12.5V14c0 .69-.56 1.25-1.25 1.25H5c-.69 0-1.25-.56-1.25-1.25V7.96Zm2.5 2.04a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Zm0 2.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z"
                    fill="currentColor"
                />
            </svg>
        );
    }

    if (kind === "partners") {
        return (
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <path
                    d="M6.25 9a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5Zm7.5 1a2.25 2.25 0 1 0-1.52-3.91A3.97 3.97 0 0 1 12.5 7.5c0 .66-.16 1.29-.45 1.84.47.42 1.08.66 1.7.66ZM2.5 14.25c0-1.79 1.67-3.25 3.75-3.25S10 12.46 10 14.25v.25a.75.75 0 0 1-.75.75h-6a.75.75 0 0 1-.75-.75v-.25Zm8.9.25c.06-.25.1-.5.1-.75 0-.81-.24-1.56-.66-2.2.44-.12.92-.19 1.41-.19 1.91 0 3.45 1.21 3.72 2.89h-4.57Z"
                    fill="currentColor"
                />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path
                d="M4.75 3.5A1.75 1.75 0 0 0 3 5.25v9.5c0 .97.78 1.75 1.75 1.75h10.5A1.75 1.75 0 0 0 17 14.75v-9.5A1.75 1.75 0 0 0 15.25 3.5H4.75Zm0 1.5h10.5a.25.25 0 0 1 .25.25v2.1H4.5v-2.1c0-.14.11-.25.25-.25Zm-.25 3.85H15.5v5.9a.25.25 0 0 1-.25.25H4.75a.25.25 0 0 1-.25-.25v-5.9Zm2.25 1.15a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Zm0 2.75a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5Z"
                fill="currentColor"
            />
        </svg>
    );
}

function formatPeriod(period) {
    if (!period) {
        return "";
    }
    return `${period.start} - ${period.end}`;
}

function statusToneClass(tone) {
    if (tone === "success") {
        return " package-status-pill--success";
    }
    if (tone === "active") {
        return " package-status-pill--active";
    }
    return " package-status-pill--muted";
}

function PackageEntryCard({ title, entry, ctaLabel, onClick, simple, ariaLabel }) {
    if (simple) {
        return (
            <button type="button" className="panel package-nav-card package-nav-card--simple" onClick={onClick} aria-label={ariaLabel}>
                <div className="package-nav-card__main">
                    <h3 className="package-nav-card__title">{title}</h3>
                </div>
                <span className="package-nav-card__cta package-nav-card__cta--icon-only" aria-hidden="true">
                    <PackageChevronIcon />
                </span>
            </button>
        );
    }

    return (
        <button type="button" className="panel package-nav-card" onClick={onClick}>
            <div className="package-nav-card__main">
                <p className="package-nav-card__eyebrow">{title}</p>
                <div className="package-nav-card__head">
                    <h3 className="package-nav-card__title">{entry.title}</h3>
                    <span className="package-nav-card__status">{entry.statusLabel}</span>
                </div>
                <p className="package-nav-card__meta">{entry.meta}</p>
            </div>
            <span className="package-nav-card__cta">
                {ctaLabel}
                <PackageChevronIcon />
            </span>
        </button>
    );
}

export default function MyPackagesScreen({ onBack, onOpenCourseRecords, onOpenAssessmentRecords, onOpenTrainingPlan }) {
    const { t } = useTranslation();
    const { state, actions } = useAppContext();
    const [activePackageId, setActivePackageId] = useState(null);

    const activePackage = useMemo(
        () => studentPackages.find((item) => item.id === activePackageId) || null,
        [activePackageId]
    );
    const isDetail = Boolean(activePackage);

    useEffect(() => {
        const id = state.resumeProfilePackageId;
        if (!id) {
            return;
        }
        if (studentPackages.some((p) => p.id === id)) {
            setActivePackageId(id);
        }
        actions.setResumeProfilePackageId(null);
        actions.setResumeProfileSubView(null);
    }, [state.resumeProfilePackageId, actions]);

    useEffect(() => {
        const scrollMain = document.querySelector(".scroll-main");
        if (scrollMain) {
            scrollMain.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [activePackageId]);

    const handleBack = () => {
        if (isDetail) {
            setActivePackageId(null);
            actions.setResumeProfilePackageId(null);
            return;
        }
        onBack?.();
    };

    return (
        <section className="screen swing-3d-enter my-packages-screen">
            <header className="top-header club-subpage-header">
                <div className="user-chip">
                    <button type="button" className="icon-btn" aria-label={t("profile.packageScreen.backAria")} onClick={handleBack}>
                        ←
                    </button>
                    <div>
                        <p className="small-label">
                            {isDetail ? t("profile.packageScreen.detailEyebrow") : t("profile.entries.package.kicker")}
                        </p>
                        <h1 className="headline">{t("profile.entries.package.title")}</h1>
                    </div>
                </div>
                {!isDetail ? <span className="pill">{t("profile.packageScreen.packageCount", { count: studentPackages.length })}</span> : null}
            </header>

            <section className={`section-stack section-bottom-gap my-packages-stack${isDetail ? " my-packages-stack--detail" : ""}`}>
                {!isDetail ? (
                    <>
                        <ul className="my-packages-list" role="list">
                            {studentPackages.map((pkg, index) => (
                                <li key={pkg.id} className="my-packages-list__item" style={{ animationDelay: `${index * 90}ms` }}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        className="panel package-overview-card"
                                        onClick={() => setActivePackageId(pkg.id)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                setActivePackageId(pkg.id);
                                            }
                                        }}
                                        aria-label={t("profile.packageScreen.openPackageAria", {
                                            name: t(`profile.packageScreen.itemNames.${pkg.id}`, { defaultValue: pkg.name }),
                                        })}
                                    >
                                        <div className="package-overview-card__top">
                                            <span className={`package-status-pill${statusToneClass(pkg.status?.tone)}`}>{pkg.status?.label}</span>
                                            <span className="package-overview-card__period">{formatPeriod(pkg.period)}</span>
                                        </div>
                                        <h2 className="package-card__name">
                                            {t(`profile.packageScreen.itemNames.${pkg.id}`, { defaultValue: pkg.name })}
                                        </h2>
                                        <p className="package-overview-card__summary">{pkg.planSummary?.description}</p>
                                        <div
                                            className="package-detail-hero__stats package-overview-card__stats"
                                            role="group"
                                            aria-label={t("profile.packageScreen.heroStatsGroupAria")}
                                        >
                                            <PackageHeroStatRing
                                                label={t("profile.packageScreen.summaryLessonsLabel")}
                                                valueText={`${pkg.overview?.completedLessons}/${pkg.overview?.totalLessons}`}
                                                progress={
                                                    pkg.overview?.totalLessons > 0
                                                        ? pkg.overview.completedLessons / pkg.overview.totalLessons
                                                        : 0
                                                }
                                                ariaLabel={t("profile.packageScreen.heroStatLessonsAria", {
                                                    value: `${pkg.overview?.completedLessons}/${pkg.overview?.totalLessons}`,
                                                })}
                                            />
                                            <PackageHeroStatRing
                                                label={t("profile.packageScreen.summaryAttendanceLabel")}
                                                valueText={pkg.overview?.attendanceDetail}
                                                progress={attendanceProgressRatio(pkg.overview)}
                                                ariaLabel={t("profile.packageScreen.heroStatAttendanceAria", {
                                                    value: pkg.overview?.attendanceDetail,
                                                })}
                                            />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <>
                        <article className="panel panel-elevated package-detail-hero">
                            <p className="package-detail-hero__eyebrow">{t("profile.packageScreen.currentPackage")}</p>
                            <h2 className="package-detail-hero__title">
                                {t(`profile.packageScreen.itemNames.${activePackage.id}`, { defaultValue: activePackage.name })}
                            </h2>
                            <div className="package-detail-hero__meta">
                                <p className="package-detail-hero__period">
                                    <span>{t("profile.packageScreen.periodLabel")}</span>
                                    <strong>{formatPeriod(activePackage.period)}</strong>
                                </p>
                                <span className={`package-status-pill${statusToneClass(activePackage.status?.tone)}`}>
                                    {activePackage.status?.label}
                                </span>
                            </div>
                            <div className="package-plan-summary package-detail-hero__plan-summary">
                                <p className="package-plan-summary__title">{activePackage.planSummary?.title}</p>
                                <p className="package-plan-summary__desc">{activePackage.planSummary?.description}</p>
                            </div>
                            <div className="package-detail-hero__stats" role="group" aria-label={t("profile.packageScreen.heroStatsGroupAria")}>
                                <PackageHeroStatRing
                                    label={t("profile.packageScreen.summaryLessonsLabel")}
                                    valueText={`${activePackage.overview?.completedLessons}/${activePackage.overview?.totalLessons}`}
                                    progress={
                                        activePackage.overview?.totalLessons > 0
                                            ? activePackage.overview.completedLessons / activePackage.overview.totalLessons
                                            : 0
                                    }
                                    ariaLabel={t("profile.packageScreen.heroStatLessonsAria", {
                                        value: `${activePackage.overview?.completedLessons}/${activePackage.overview?.totalLessons}`,
                                    })}
                                />
                                <PackageHeroStatRing
                                    label={t("profile.packageScreen.summaryAttendanceLabel")}
                                    valueText={activePackage.overview?.attendanceDetail}
                                    progress={attendanceProgressRatio(activePackage.overview)}
                                    ariaLabel={t("profile.packageScreen.heroStatAttendanceAria", {
                                        value: activePackage.overview?.attendanceDetail,
                                    })}
                                />
                            </div>
                        </article>

                        <article className="panel package-section-card package-section-card--entries">
                            <div className="package-record-entry-list">
                                <PackageEntryCard
                                    simple
                                    title={t("profile.packageScreen.planSectionTitle")}
                                    ariaLabel={t("profile.packageScreen.openTrainingPlan")}
                                    onClick={() => onOpenTrainingPlan?.(activePackage)}
                                />
                                <PackageEntryCard
                                    simple
                                    title={t("profile.packageScreen.courseRecordLabel")}
                                    ariaLabel={t("profile.packageScreen.openCourseRecord")}
                                    onClick={() => onOpenCourseRecords?.(activePackage)}
                                />
                                <PackageEntryCard
                                    simple
                                    title={t("profile.packageScreen.assessmentRecordLabel")}
                                    ariaLabel={t("profile.packageScreen.openAssessmentRecord")}
                                    onClick={() => onOpenAssessmentRecords?.(activePackage)}
                                />
                            </div>
                        </article>

                        <article className="panel package-section-card package-section-card--partners">
                            <div className="package-section-head">
                                <span className="package-section-head__icon">
                                    <PackageSectionIcon kind="partners" />
                                </span>
                                <h3 className="package-section-head__title">{t("profile.packageScreen.partnersSectionTitle")}</h3>
                            </div>
                            <div className="package-partner-grid package-partner-grid--stacked">
                                <article className="package-insight-card package-insight-card--wide">
                                    <p className="package-insight-card__label">{t("profile.packageScreen.partnerNamesLabel")}</p>
                                    {activePackage.partnerProfiles?.length ? (
                                        <div className="package-partner-strip">
                                            {activePackage.partnerProfiles.map((p) => (
                                                <PartnerAvatarWithMedal
                                                    key={`${p.name}-${p.rank}`}
                                                    name={p.name}
                                                    rank={p.rank}
                                                    avatarUrl={p.avatarUrl}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="package-insight-card__value package-insight-card__value--solo">
                                            {t("profile.packageScreen.noPartners")}
                                        </p>
                                    )}
                                </article>
                                <article className="package-insight-card package-insight-card--wide package-insight-card--sub">
                                    <p className="package-insight-card__label">{t("profile.packageScreen.sharedProgressLabel")}</p>
                                    <ul className="package-progress-list">
                                        {activePackage.sharedProgress?.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </article>
                                <article className="package-insight-card package-insight-card--wide package-insight-card--sub">
                                    <p className="package-insight-card__label">{t("profile.packageScreen.momentsTitle")}</p>
                                    <div className="package-timeline package-timeline--in-card">
                                        {activePackage.moments?.map((moment, index) => (
                                            <article
                                                key={moment.id}
                                                className="package-timeline-item"
                                                style={{ animationDelay: `${220 + index * 80}ms` }}
                                            >
                                                <span className="package-timeline-item__dot" aria-hidden="true" />
                                                <div className="package-timeline-item__body">
                                                    <p className="package-timeline-item__date">{moment.date}</p>
                                                    <p className="package-timeline-item__title">{moment.title}</p>
                                                    <p className="package-timeline-item__desc">{moment.description}</p>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </article>
                            </div>
                        </article>
                    </>
                )}
            </section>
        </section>
    );
}
