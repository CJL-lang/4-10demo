import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const CX = 100;
const CY = 100;
const R_MAX = 78;

function ringPolygon(fraction, n) {
    const pts = [];
    for (let i = 0; i < n; i++) {
        const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
        const r = R_MAX * fraction;
        pts.push([CX + r * Math.cos(angle), CY + r * Math.sin(angle)]);
    }
    return `M ${pts.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" L ")} Z`;
}

function dataPolygon(scores, n) {
    const pts = scores.map((s, i) => {
        const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
        const clamped = Math.min(10, Math.max(0, Number(s) || 0));
        const r = (R_MAX * clamped) / 10;
        return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)];
    });
    return `M ${pts.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" L ")} Z`;
}

export default function AssessmentRadar({ slideId, color, items, isActive = false }) {
    const { t } = useTranslation();
    /** Remount chart subtree whenever this slide becomes active so entrance animations replay (skipped on first mount). */
    const skipMountBurst = useRef(true);
    const [burst, setBurst] = useState(1);
    useEffect(() => {
        if (skipMountBurst.current) {
            skipMountBurst.current = false;
            return;
        }
        if (isActive) {
            setBurst((b) => b + 1);
        }
    }, [isActive]);

    const labeled = useMemo(
        () =>
            items.map((it) => ({
                ...it,
                label: t(`progressAssessment.${slideId}.items.${it.key}`),
            })),
        [items, slideId, t]
    );

    const scores = labeled.map((i) => i.score);
    const n = scores.length;
    const gradId = `assessment-radar-grad-${slideId}`;

    const wrapClass = `assessment-radar-wrap ${isActive ? "assessment-radar-wrap--animated" : "assessment-radar-wrap--idle"}`;

    if (n < 3) {
        return (
            <div className={wrapClass} style={{ "--assessment-accent": color }}>
                <div key={burst} className="assessment-bars assessment-bars--motion">
                    {labeled.map((row) => (
                        <div key={row.key} className="assessment-bar-row">
                            <span className="assessment-bar-label">{row.label}</span>
                            <div className="assessment-bar-track" aria-hidden="true">
                                <div className="assessment-bar-fill" style={{ width: `${row.score * 10}%` }} />
                            </div>
                            <span className="assessment-bar-score">
                                {row.score}
                                <span className="assessment-bar-unit">{t("progressAssessment.scoreUnit")}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const dataPath = dataPolygon(scores, n);
    const rings = [0.35, 0.55, 0.75, 1];
    const pts = scores.map((s, i) => {
        const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
        const clamped = Math.min(10, Math.max(0, Number(s) || 0));
        const r = (R_MAX * clamped) / 10;
        return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)];
    });

    const gradBgId = `${gradId}-radial-bg`;
    const filterGlowId = `${gradId}-soft-glow`;
    return (
        <div className={wrapClass} style={{ "--assessment-accent": color }}>
            <div key={burst} className="assessment-radar-motion">
                <div className="assessment-radar-svg-frame">
                    <svg className="assessment-radar-svg" viewBox="0 0 200 200" aria-hidden="true">
                        <defs>
                            <radialGradient id={gradBgId} cx="42%" cy="38%" r="72%">
                                <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                                <stop offset="42%" stopColor={color} stopOpacity="0.08" />
                                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                            </radialGradient>
                            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={color} stopOpacity="0.55" />
                                <stop offset="45%" stopColor={color} stopOpacity="0.2" />
                                <stop offset="100%" stopColor={color} stopOpacity="0.08" />
                            </linearGradient>
                            <filter id={filterGlowId} x="-40%" y="-40%" width="180%" height="180%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="b" />
                                <feMerge>
                                    <feMergeNode in="b" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <circle className="assessment-radar-bg-disc" cx={CX} cy={CY} r={R_MAX} fill={`url(#${gradBgId})`} />
                        {rings.map((f, ri) => (
                            <path
                                key={f}
                                className={`assessment-radar-grid${ri === rings.length - 1 ? " assessment-radar-grid--outer" : ""}`}
                                d={ringPolygon(f, n)}
                                vectorEffect="nonScalingStroke"
                                style={{ animationDelay: `${ri * 55}ms` }}
                            />
                        ))}
                        {scores.map((_, i) => {
                            const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
                            const x = CX + R_MAX * Math.cos(angle);
                            const y = CY + R_MAX * Math.sin(angle);
                            return (
                                <line
                                    key={i}
                                    className="assessment-radar-axis"
                                    x1={CX}
                                    y1={CY}
                                    x2={x}
                                    y2={y}
                                    vectorEffect="nonScalingStroke"
                                    style={{ animationDelay: `${120 + i * 36}ms` }}
                                />
                            );
                        })}
                        <path d={dataPath} className="assessment-radar-area" fill={`url(#${gradId})`} filter={`url(#${filterGlowId})`} />
                        <path d={dataPath} className="assessment-radar-stroke" pathLength="1" stroke={color} fill="none" />
                        {pts.map((p, i) => (
                            <g key={i} className="assessment-radar-point-group" style={{ animationDelay: `${380 + i * 58}ms` }}>
                                <circle className="assessment-radar-point-halo" cx={p[0]} cy={p[1]} r="9" fill={color} />
                                <circle className="assessment-radar-point" cx={p[0]} cy={p[1]} r="4.6" fill={color} />
                            </g>
                        ))}
                    </svg>
                </div>
                <ul className="assessment-radar-legend">
                    {labeled.map((row, li) => (
                        <li key={row.key} style={{ animationDelay: `${220 + li * 44}ms` }}>
                            <span>{row.label}</span>
                            <strong>
                                {row.score}
                                <small>{t("progressAssessment.scoreUnit")}</small>
                            </strong>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
