import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PROFILE_HERO_BADGE_LOGO_WEBP } from "../data/mockData";

export default function MonthlySettlementModal({ open, onClose }) {
    const { t } = useTranslation();
    const [rendered, setRendered] = useState(open);

    useEffect(() => {
        if (open) setRendered(true);
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;
        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!rendered) return null;

    return (
        <div
            className={`modal-mask modal-mask--settlement${open ? "" : " modal-mask--closing"}`}
            onClick={onClose}
            onAnimationEnd={(e) => {
                if (e.target === e.currentTarget && !open) setRendered(false);
            }}
        >
            <div
                className="settlement-overlay"
                role="dialog"
                aria-modal="true"
                aria-labelledby="settlement-dialog-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="settlement-bg" aria-hidden="true" />
                <div className="settlement-sparkles" aria-hidden="true">
                    {Array.from({ length: 14 }, (_, i) => (
                        <span key={i} className={`settlement-spark settlement-spark--${i}`} />
                    ))}
                </div>

                <div className="settlement-inner">
                    <h2 id="settlement-dialog-title" className="settlement-title">
                        {t("profile.settlement.title")}
                    </h2>
                    <p className="settlement-kicker">{t("profile.settlement.kicker")}</p>

                    <div className="settlement-hero">
                        <div className="settlement-halo" aria-hidden="true" />
                        <div className="settlement-emblem">
                            <img
                                src={PROFILE_HERO_BADGE_LOGO_WEBP}
                                alt=""
                                width={120}
                                height={120}
                                loading="eager"
                                decoding="async"
                                className="settlement-emblem-img"
                            />
                        </div>
                    </div>

                    <p className="settlement-rank">{t("profile.rankingHero.value")}</p>
                    <p className="settlement-tier">{t("profile.rankingHero.desc")}</p>
                    <p className="settlement-label">{t("profile.rankingHero.label")}</p>

                    <p className="settlement-celebrate">{t("profile.settlement.celebrateLine")}</p>

                    <button type="button" className="btn-primary settlement-dismiss" onClick={onClose}>
                        {t("profile.settlement.cta")}
                    </button>
                </div>
            </div>
        </div>
    );
}
