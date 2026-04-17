import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { coachInfoCard } from "../data/mockData";

export default function MyCoachScreen({ onBack }) {
    const { t } = useTranslation();
    const coach = coachInfoCard;
    const [avatarFailed, setAvatarFailed] = useState(false);

    const specialties = useMemo(
        () => [
            t("profile.coachScreen.specialty1"),
            t("profile.coachScreen.specialty2"),
            t("profile.coachScreen.specialty3"),
        ],
        [t]
    );

    const telHref = `tel:${String(coach.phone || "").replace(/\s+/g, "")}`;

    return (
        <section className="screen swing-3d-enter my-coach-screen">
            <header className="top-header club-subpage-header my-coach-screen-header">
                <div className="user-chip">
                    <button type="button" className="icon-btn" aria-label={t("profile.coachScreen.backAria")} onClick={onBack}>
                        ←
                    </button>
                    <div>
                        <p className="small-label">{t("profile.coachScreen.kicker")}</p>
                        <h1 className="headline">{t("profile.coachScreen.pageTitle")}</h1>
                    </div>
                </div>
            </header>

            <div className="section-stack section-bottom-gap my-coach-stack">
                <div className="my-coach-hero">
                    <div className="my-coach-hero-visual">
                        {avatarFailed ? (
                            <span className="my-coach-hero-fallback" aria-hidden="true">
                                {coach.initials}
                            </span>
                        ) : (
                            <img
                                src={coach.avatarUrl}
                                alt=""
                                className="my-coach-hero-photo"
                                width={120}
                                height={120}
                                loading="eager"
                                decoding="async"
                                onError={() => setAvatarFailed(true)}
                            />
                        )}
                        <div className="my-coach-hero-ring" aria-hidden="true" />
                    </div>
                    <h2 className="my-coach-hero-name">{coach.name}</h2>
                    <p className="my-coach-hero-title">{coach.title}</p>
                    <p className="my-coach-hero-tagline">{t("profile.coachScreen.tagline")}</p>
                </div>

                <article className="panel my-coach-panel my-coach-panel--sheet">
                    <section className="my-coach-section my-coach-section--quick" aria-label={t("profile.coachScreen.quickSectionAria")}>
                        <div className="my-coach-row my-coach-row--status">
                            <span className="my-coach-row-label">{t("profile.coachScreen.statusLabel")}</span>
                            <span className="my-coach-status-pill">{coach.status}</span>
                        </div>
                        <div className="my-coach-row">
                            <span className="my-coach-row-label">{t("profile.coachScreen.phoneLabel")}</span>
                            <div className="my-coach-row-value">
                                <a className="my-coach-phone-link" href={telHref}>
                                    {coach.phone}
                                </a>
                            </div>
                        </div>
                        <div className="my-coach-row my-coach-row--last">
                            <span className="my-coach-row-label">{t("profile.coachScreen.bestScoreLabel")}</span>
                            <span className="my-coach-row-value my-coach-best">{coach.bestScore ?? coach.bestScoreShort}</span>
                        </div>
                    </section>

                    <div className="my-coach-section-rule" role="presentation" />

                    <section className="my-coach-section my-coach-section--bio" aria-labelledby="my-coach-bio-heading">
                        <h3 id="my-coach-bio-heading" className="my-coach-subheading">
                            {t("profile.coachScreen.bioHeading")}
                        </h3>
                        <p className="my-coach-bio">{t("profile.coachScreen.bio")}</p>
                    </section>

                    <div className="my-coach-section-rule" role="presentation" />

                    <section className="my-coach-section my-coach-section--tags" aria-labelledby="my-coach-spec-heading">
                        <h3 id="my-coach-spec-heading" className="my-coach-subheading">
                            {t("profile.coachScreen.specialtyHeading")}
                        </h3>
                        <ul className="my-coach-specialty-list">
                            {specialties.map((text, i) => (
                                <li key={i} className="my-coach-specialty-item">
                                    <span className="my-coach-specialty-index" aria-hidden="true">
                                        {i + 1}
                                    </span>
                                    <span className="my-coach-specialty-text">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </article>
            </div>
        </section>
    );
}
