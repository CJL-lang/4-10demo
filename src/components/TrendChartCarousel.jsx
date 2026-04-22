import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { growthOverview } from "../data/mockData";

const TREND_DAYS = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"];
const Y_MIN = 0.5;
const Y_MAX = 9.5;

const CHART_ORDER = ["irons", "woods", "putting", "scramble", "wedge"];
const CHART_COLORS = {
    irons: "var(--primary)",
    woods: "#7ecaff",
    putting: "#a8e6a3",
    scramble: "#ffb86c",
    wedge: "#c792ea",
};

const CHART_W = 260;
const CHART_H = 120;
const CARD_SPACING = 135;
const DRAG_LOCK_THRESHOLD = 10;
const DRAG_SNAP_THRESHOLD = 36;

function buildSmoothPath(values, getX, getY) {
    const points = values.map((v, i) => ({ x: getX(i), y: getY(v) }));
    if (points.length < 2) {
        return "";
    }
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? 0 : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
}

function getX(index) {
    return (index / (TREND_DAYS.length - 1)) * CHART_W;
}

function getY(value) {
    return CHART_H - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * CHART_H;
}

function ChartCard({ chart, isActive, isDragging, offset, onClick, switchChartAriaLabel }) {
    const absOffset = Math.abs(offset);
    const values = growthOverview.weeklyTrendSeries[chart.key] || [];
    const path = buildSmoothPath(values, getX, getY);
    const latestLevel = values[values.length - 1] || 0;
    const firstLevel = values[0] || 0;
    const trend = latestLevel - firstLevel;

    const cardStyle = {
        "--chart-color": chart.color,
        "--offset": offset,
        "--offset-abs": absOffset,
        zIndex: isActive ? 3 : 3 - absOffset,
    };

    return (
        <div
            className={`chart-card${isActive ? " is-active" : ""}${isDragging ? " is-dragging" : ""}`}
            style={cardStyle}
            onClick={!isActive ? onClick : undefined}
            role={!isActive ? "button" : undefined}
            tabIndex={!isActive ? 0 : undefined}
            onKeyDown={
                !isActive
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onClick();
                        }
                    }
                    : undefined
            }
            aria-label={!isActive ? switchChartAriaLabel : undefined}
        >
            <div className="chart-card-header">
                <span className="chart-card-label">{chart.label}</span>
                <span className="chart-card-level" style={{ color: chart.color }}>
                    L{latestLevel}
                </span>
                {trend > 0 && <span className="chart-card-trend chart-card-trend--up">+{trend}</span>}
            </div>
            <p className="chart-card-story">{chart.story}</p>

            <svg className="chart-card-svg" viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" aria-hidden="true">
                {[3, 5, 7, 9].map((lvl) => (
                    <line key={lvl} className="trend-grid-line" x1="0" y1={getY(lvl)} x2={CHART_W} y2={getY(lvl)} />
                ))}

                <defs>
                    <linearGradient id={`grad-${chart.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chart.color} stopOpacity="0.22" />
                        <stop offset="100%" stopColor={chart.color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                {path && (
                    <path
                        d={`${path} L ${getX(values.length - 1)} ${CHART_H} L 0 ${CHART_H} Z`}
                        fill={`url(#grad-${chart.key})`}
                    />
                )}

                <path
                    d={path}
                    pathLength="1"
                    className={`trend-line${isActive ? " is-active-line" : ""}`}
                    style={{ stroke: chart.color }}
                />

                {isActive &&
                    values.map((v, i) => (
                        <circle
                            key={i}
                            className="trend-point"
                            style={{ fill: chart.color, animationDelay: `${120 + i * 60}ms` }}
                            cx={getX(i)}
                            cy={getY(v)}
                            r="3.4"
                        />
                    ))}
            </svg>

            <div className="chart-x-labels">
                {TREND_DAYS.map((d) => (
                    <small key={d}>{d}</small>
                ))}
            </div>

            {isActive && (
                <div className="chart-y-labels" aria-hidden="true">
                    {[9, 7, 5, 3, 1].map((lvl) => (
                        <span key={lvl} style={{ top: `${((Y_MAX - lvl) / (Y_MAX - Y_MIN)) * 100}%` }}>
                            L{lvl}
                        </span>
                    ))}
                </div>
            )}

            {!isActive && <div className="chart-card-fog" aria-hidden="true" />}
        </div>
    );
}

export default function TrendChartCarousel({ onActiveChartChange }) {
    const { t } = useTranslation();
    const charts = useMemo(
        () =>
            CHART_ORDER.map((key) => ({
                key,
                label: t(`progressCharts.${key}`),
                color: CHART_COLORS[key],
                story: t(`progressOverview.chartStories.${key}`),
            })),
        [t]
    );
    const [activeIndex, setActiveIndex] = useState(2);
    const [dragOffsetPx, setDragOffsetPx] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef(null);
    const pointerStateRef = useRef({
        pointerId: null,
        startX: 0,
        startY: 0,
        dragX: 0,
        axis: null,
    });
    const clickGuardUntilRef = useRef(0);

    const prev = useCallback(() => setActiveIndex((i) => Math.max(0, i - 1)), []);
    const next = useCallback(() => setActiveIndex((i) => Math.min(charts.length - 1, i + 1)), [charts.length]);

    const clampIndex = useCallback((value) => Math.max(0, Math.min(charts.length - 1, value)), [charts.length]);

    const applyEdgeResistance = useCallback(
        (dx) => {
            const draggingPastLeft = activeIndex === 0 && dx > 0;
            const draggingPastRight = activeIndex === charts.length - 1 && dx < 0;
            if (draggingPastLeft || draggingPastRight) {
                return dx * 0.35;
            }
            return dx;
        },
        [activeIndex, charts.length]
    );

    const resetDrag = useCallback(() => {
        pointerStateRef.current = {
            pointerId: null,
            startX: 0,
            startY: 0,
            dragX: 0,
            axis: null,
        };
        setDragOffsetPx(0);
        setIsDragging(false);
    }, []);

    const onPointerDown = (e) => {
        pointerStateRef.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            dragX: 0,
            axis: null,
        };
    };

    const onPointerMove = (e) => {
        const pointer = pointerStateRef.current;
        if (pointer.pointerId !== e.pointerId) {
            return;
        }

        const dx = e.clientX - pointer.startX;
        const dy = e.clientY - pointer.startY;

        if (!pointer.axis) {
            if (Math.abs(dx) < DRAG_LOCK_THRESHOLD && Math.abs(dy) < DRAG_LOCK_THRESHOLD) {
                return;
            }

            if (Math.abs(dx) >= Math.abs(dy) * 0.85) {
                pointer.axis = "x";
                if (trackRef.current?.setPointerCapture) {
                    trackRef.current.setPointerCapture(e.pointerId);
                }
                setIsDragging(true);
            } else {
                pointer.axis = "y";
                return;
            }
        }

        if (pointer.axis !== "x") {
            return;
        }

        e.preventDefault();
        const resistedDx = applyEdgeResistance(dx);
        pointer.dragX = resistedDx;
        setDragOffsetPx(resistedDx);
    };

    const finishDrag = useCallback(() => {
        const pointer = pointerStateRef.current;
        const deltaX = pointer.dragX;
        const wasHorizontalDrag = pointer.axis === "x";

        if (wasHorizontalDrag) {
            const cardDelta = -deltaX / CARD_SPACING;
            let targetIndex = clampIndex(Math.round(activeIndex + cardDelta));

            if (targetIndex === activeIndex && Math.abs(deltaX) > DRAG_SNAP_THRESHOLD) {
                targetIndex = clampIndex(activeIndex + (deltaX < 0 ? 1 : -1));
            }

            clickGuardUntilRef.current = Date.now() + 220;
            setActiveIndex(targetIndex);
        }

        resetDrag();
    }, [activeIndex, clampIndex, resetDrag]);

    const onPointerUp = (e) => {
        if (pointerStateRef.current.pointerId !== e.pointerId) {
            return;
        }
        finishDrag();
    };

    const onPointerCancel = (e) => {
        if (pointerStateRef.current.pointerId !== e.pointerId) {
            return;
        }
        resetDrag();
    };

    useEffect(() => {
        const el = trackRef.current;
        if (!el) {
            return undefined;
        }
        const onKey = (e) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                prev();
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                next();
            }
        };
        el.addEventListener("keydown", onKey);
        return () => el.removeEventListener("keydown", onKey);
    }, [prev, next]);

    useEffect(() => {
        onActiveChartChange?.(charts[activeIndex] || null);
    }, [activeIndex, charts, onActiveChartChange]);

    return (
        <div
            className="chart-carousel-outer"
            role="region"
            aria-label={t("progressOverview.ariaTrend")}
            aria-roledescription="carousel"
            ref={trackRef}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
        >
            <button
                type="button"
                className="chart-carousel-nav chart-carousel-nav--prev"
                aria-label={t("progressOverview.prevChartAria")}
                disabled={activeIndex <= 0}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => {
                    if (activeIndex > 0) {
                        prev();
                    }
                }}
            >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path
                        d="M14.2 5.3a1 1 0 0 0-1.4 0l-5 5a1 1 0 0 0 0 1.4l5 5a1 1 0 1 0 1.4-1.4L10.4 12l3.8-3.8a1 1 0 0 0 0-1.4Z"
                        fill="currentColor"
                    />
                </svg>
            </button>
            <button
                type="button"
                className="chart-carousel-nav chart-carousel-nav--next"
                aria-label={t("progressOverview.nextChartAria")}
                disabled={activeIndex >= charts.length - 1}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => {
                    if (activeIndex < charts.length - 1) {
                        next();
                    }
                }}
            >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path
                        d="M9.8 5.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L13.6 12l-3.8-3.8a1 1 0 0 1 0-1.4Z"
                        fill="currentColor"
                    />
                </svg>
            </button>

            <div className="chart-edge-fog chart-edge-fog--left" aria-hidden="true" />
            <div className="chart-edge-fog chart-edge-fog--right" aria-hidden="true" />

            <div className={`chart-carousel-track${isDragging ? " is-dragging" : ""}`} aria-live="polite">
                {charts.map((chart, i) => (
                    <ChartCard
                        key={chart.key}
                        chart={chart}
                        isActive={i === activeIndex}
                        isDragging={isDragging}
                        offset={i - activeIndex + dragOffsetPx / CARD_SPACING}
                        switchChartAriaLabel={t("progressOverview.switchChartAria", { label: chart.label })}
                        onClick={() => {
                            if (Date.now() < clickGuardUntilRef.current || isDragging) {
                                return;
                            }
                            setActiveIndex(i);
                        }}
                    />
                ))}
            </div>

            <div className="chart-dots" role="tablist" aria-label={t("progressOverview.chartDotsAria")}>
                {charts.map((chart, i) => (
                    <button
                        key={chart.key}
                        type="button"
                        role="tab"
                        aria-selected={i === activeIndex}
                        aria-label={chart.label}
                        className={`chart-dot${i === activeIndex ? " is-active" : ""}`}
                        style={
                            i === activeIndex
                                ? {
                                    background: charts[activeIndex].color,
                                    "--dot-color": charts[activeIndex].color,
                                }
                                : { "--dot-color": chart.color }
                        }
                        onClick={() => setActiveIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
}
