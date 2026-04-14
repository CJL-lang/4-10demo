import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { PROFILE_HERO_BADGE_LOGO_WEBP } from "../data/mockData";

export default function MonthlySettlementModal({ onClose }) {
    const { t } = useTranslation();
    const [isClosing, setIsClosing] = useState(false);
    const [particles, setParticles] = useState([]);
    const [mountNode, setMountNode] = useState(null);

    useEffect(() => {
        // Generate random particles on mount
        const generatedParticles = Array.from({ length: 15 }).map((_, i) => {
            const left = `${Math.random() * 100}%`;
            const duration = 2 + Math.random() * 3; // 2s to 5s
            const delay = Math.random() * 2; // 0s to 2s
            const size = 3 + Math.random() * 4; // 3px to 7px

            return {
                id: i,
                left,
                duration: `${duration}s`,
                delay: `${delay}s`,
                size: `${size}px`
            };
        });
        setParticles(generatedParticles);
    }, []);

    useEffect(() => {
        setMountNode(document.querySelector(".device-shell"));
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300); // Matches settlementFadeOut duration
    };

    if (!mountNode) {
        return null;
    }

    return createPortal(
        <div
            className={`settlement-modal-mask ${isClosing ? "settlement-modal-mask--closing" : ""}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
        >
            <div className="settlement-particles">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="settlement-particle"
                        style={{
                            left: p.left,
                            width: p.size,
                            height: p.size,
                            animation: `particleFloat ${p.duration} ease-in ${p.delay} infinite`
                        }}
                    />
                ))}
            </div>

            <div className="settlement-content">
                <h2 className="settlement-title">全院综合排名</h2>

                <div className="settlement-center-stage">
                    <div className="settlement-rays"></div>
                    <div className="settlement-glow"></div>

                    <div className="settlement-badge-wrapper">
                        <img
                            src={PROFILE_HERO_BADGE_LOGO_WEBP}
                            alt="Badge"
                            className="settlement-badge-img"
                        />
                    </div>

                    <div className="settlement-ribbon-container">
                        <div className="settlement-ribbon">
                            <span className="settlement-rank-text">NO. 4</span>
                        </div>
                        <div className="settlement-subtitle">ELITE 级学员</div>
                    </div>
                </div>
            </div>

            <div className="settlement-close-hint" onClick={handleClose}>
                点击任意处关闭
            </div>
        </div>,
        mountNode
    );
}
