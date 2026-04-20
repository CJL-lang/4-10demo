import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AssessmentRadar from "./AssessmentRadar";
import TrendChartCarousel from "./TrendChartCarousel";
import { assessmentSlideColors, growthOverview } from "../data/mockData";

const PROGRESS_VIEW_STORAGE_KEY = "club-progress-overview-view";

/** 与 TrendChartCarousel 一致的拖拽门槛与翻页手感 */
const DRAG_LOCK_THRESHOLD = 10;
const DRAG_SNAP_THRESHOLD = 36;
/** 标题栏横向拖动超过此值则切换新版 / 旧版测评视图 */
const HEAD_VIEW_SWITCH_THRESHOLD = 52;
const HEAD_VIEW_NUDGE_MAX = 44;

function applyScrollOverscrollResistance(el, nextLeft) {
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    if (nextLeft < 0) {
        return nextLeft * 0.35;
    }
    if (nextLeft > maxScroll) {
        return maxScroll + (nextLeft - maxScroll) * 0.35;
    }
    return nextLeft;
}

export default function ProgressOverviewSection({ withBottomGap = true, onOpenAssessmentRecords }) {
    const { t } = useTranslation();
    const slides = growthOverview.assessmentSlides;
    const [viewMode, setViewModeState] = useState(() => {
        try {
            const v = localStorage.getItem(PROGRESS_VIEW_STORAGE_KEY);
            if (v === "trend" || v === "dimensions") {
                return v;
            }
        } catch {
            /* ignore */
        }
        return "dimensions";
    });

    const setViewMode = (mode) => {
        setViewModeState(mode);
        try {
            localStorage.setItem(PROGRESS_VIEW_STORAGE_KEY, mode);
        } catch {
            /* ignore */
        }
    };
    const swipeRef = useRef(null);
    const [dimensionSlideIndex, setDimensionSlideIndex] = useState(0);
    const pointerRef = useRef({
        pointerId: null,
        startX: 0,
        startY: 0,
        startScroll: 0,
        axis: null,
        lockIdx: null,
    });
    const headPointerRef = useRef({
        pointerId: null,
        startX: 0,
        startY: 0,
        axis: null,
    });
    const [headSwipeShift, setHeadSwipeShift] = useState(0);

    const resetHeadPointer = () => {
        headPointerRef.current = {
            pointerId: null,
            startX: 0,
            startY: 0,
            axis: null,
        };
    };

    const onHeadPointerDown = (e) => {
        if (e.target.closest("button, a")) {
            return;
        }
        headPointerRef.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            axis: null,
        };
    };

    const onHeadPointerMove = (e) => {
        const p = headPointerRef.current;
        if (p.pointerId !== e.pointerId) {
            return;
        }
        const dx = e.clientX - p.startX;
        const dy = e.clientY - p.startY;
        if (!p.axis) {
            if (Math.abs(dx) < DRAG_LOCK_THRESHOLD && Math.abs(dy) < DRAG_LOCK_THRESHOLD) {
                return;
            }
            if (Math.abs(dx) >= Math.abs(dy) * 0.85) {
                p.axis = "x";
                e.currentTarget.setPointerCapture(e.pointerId);
                e.currentTarget.classList.add("is-head-view-dragging");
            } else {
                p.axis = "y";
                return;
            }
        }
        if (p.axis !== "x") {
            return;
        }
        e.preventDefault();
        const damp = Math.max(-HEAD_VIEW_NUDGE_MAX, Math.min(HEAD_VIEW_NUDGE_MAX, dx * 0.28));
        setHeadSwipeShift(damp);
    };

    const finishHeadPointer = (e) => {
        const p = headPointerRef.current;
        if (p.pointerId !== e.pointerId) {
            return;
        }
        const el = e.currentTarget;
        if (p.axis === "x") {
            const dx = e.clientX - p.startX;
            if (dx <= -HEAD_VIEW_SWITCH_THRESHOLD) {
                setViewMode("trend");
            } else if (dx >= HEAD_VIEW_SWITCH_THRESHOLD) {
                setViewMode("dimensions");
            }
            if (el.hasPointerCapture?.(e.pointerId)) {
                el.releasePointerCapture(e.pointerId);
            }
            el.classList.remove("is-head-view-dragging");
        } else if (p.pointerId != null) {
            if (el.hasPointerCapture?.(e.pointerId)) {
                el.releasePointerCapture(e.pointerId);
            }
            el.classList.remove("is-head-view-dragging");
        }
        setHeadSwipeShift(0);
        resetHeadPointer();
    };

    const onHeadPointerUp = (e) => {
        finishHeadPointer(e);
    };

    const onHeadPointerCancel = (e) => {
        finishHeadPointer(e);
    };

    const onHeadKeyDown = (e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            setViewMode("trend");
        }
        if (e.key === "ArrowRight") {
            e.preventDefault();
            setViewMode("dimensions");
        }
    };

    const snapAfterDrag = (clientDx) => {
        const el = swipeRef.current;
        if (!el) {
            return;
        }
        const w = el.clientWidth;
        if (w <= 0) {
            return;
        }
        const maxIdx = Math.max(0, slides.length - 1);
        const clampIdx = (i) => Math.max(0, Math.min(maxIdx, i));
        let target = clampIdx(Math.round(el.scrollLeft / w));
        const lockIdx = pointerRef.current.lockIdx;
        if (lockIdx != null && target === lockIdx && Math.abs(clientDx) > DRAG_SNAP_THRESHOLD) {
            target = clampIdx(lockIdx + (clientDx < 0 ? 1 : -1));
        }
        el.scrollLeft = target * w;
    };

    useLayoutEffect(() => {
        if (viewMode !== "dimensions") {
            return undefined;
        }
        const el = swipeRef.current;
        if (!el) {
            return undefined;
        }
        let cancelled = false;
        const apply = () => {
            if (cancelled || !swipeRef.current) {
                return;
            }
            if (swipeRef.current.clientWidth <= 0) {
                requestAnimationFrame(apply);
                return;
            }
            swipeRef.current.scrollLeft = 0;
            setDimensionSlideIndex(0);
        };
        apply();
        return () => {
            cancelled = true;
        };
    }, [viewMode]);

    useEffect(() => {
        if (viewMode !== "dimensions") {
            return undefined;
        }
        const el = swipeRef.current;
        if (!el) {
            return undefined;
        }
        const onKey = (e) => {
            const w = el.clientWidth;
            if (w <= 0) {
                return;
            }
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                el.scrollBy({ left: -w, behavior: "smooth" });
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                el.scrollBy({ left: w, behavior: "smooth" });
            }
        };
        el.addEventListener("keydown", onKey);
        return () => el.removeEventListener("keydown", onKey);
    }, [viewMode]);

    useEffect(() => {
        if (viewMode !== "dimensions") {
            return undefined;
        }
        const el = swipeRef.current;
        if (!el) {
            return undefined;
        }
        const syncIndex = () => {
            const w = el.clientWidth;
            if (w <= 0) {
                return;
            }
            const maxIdx = Math.max(0, slides.length - 1);
            setDimensionSlideIndex(Math.max(0, Math.min(maxIdx, Math.round(el.scrollLeft / w))));
        };
        syncIndex();
        el.addEventListener("scroll", syncIndex, { passive: true });
        return () => el.removeEventListener("scroll", syncIndex);
    }, [viewMode, slides.length]);

    const resetPointer = () => {
        pointerRef.current = {
            pointerId: null,
            startX: 0,
            startY: 0,
            startScroll: 0,
            axis: null,
            lockIdx: null,
        };
    };

    const onPointerDown = (e) => {
        if (e.target.closest("button, a")) {
            return;
        }
        const el = swipeRef.current;
        if (!el) {
            return;
        }
        pointerRef.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            startScroll: el.scrollLeft,
            axis: null,
            lockIdx: null,
        };
    };

    const onPointerMove = (e) => {
        const p = pointerRef.current;
        if (p.pointerId !== e.pointerId) {
            return;
        }
        const el = swipeRef.current;
        if (!el) {
            return;
        }

        const dx = e.clientX - p.startX;
        const dy = e.clientY - p.startY;

        if (!p.axis) {
            if (Math.abs(dx) < DRAG_LOCK_THRESHOLD && Math.abs(dy) < DRAG_LOCK_THRESHOLD) {
                return;
            }
            if (Math.abs(dx) >= Math.abs(dy) * 0.85) {
                p.axis = "x";
                const w = el.clientWidth;
                if (w > 0) {
                    p.lockIdx = Math.round(el.scrollLeft / w);
                }
                el.setPointerCapture(e.pointerId);
                el.classList.add("is-dragging");
            } else {
                p.axis = "y";
                return;
            }
        }

        if (p.axis !== "x") {
            return;
        }

        e.preventDefault();
        const raw = p.startScroll - (e.clientX - p.startX);
        el.scrollLeft = applyScrollOverscrollResistance(el, raw);
    };

    const finishPointer = (e) => {
        const p = pointerRef.current;
        if (p.pointerId !== e.pointerId) {
            return;
        }
        const el = swipeRef.current;
        const clientDx = e.clientX - p.startX;
        if (p.axis === "x" && el) {
            if (el.hasPointerCapture?.(e.pointerId)) {
                el.releasePointerCapture(e.pointerId);
            }
            el.classList.remove("is-dragging");
            snapAfterDrag(clientDx);
        }
        resetPointer();
    };

    const onPointerUp = (e) => {
        finishPointer(e);
    };

    const onPointerCancel = (e) => {
        finishPointer(e);
    };

    return (
        <section className={`trend-panel section-stack ${withBottomGap ? "section-bottom-gap" : ""}`}>
            <div className="progress-chart-box">
                <div className="section-head chart-progress-head">
                    <div
                        className="chart-progress-head-top chart-progress-head-top--view-swipe"
                        style={headSwipeShift ? { transform: `translateX(${headSwipeShift}px)` } : undefined}
                        onPointerDown={onHeadPointerDown}
                        onPointerMove={onHeadPointerMove}
                        onPointerUp={onHeadPointerUp}
                        onPointerCancel={onHeadPointerCancel}
                    >
                        <div
                            className="chart-progress-head-lead"
                            tabIndex={0}
                            aria-label={t("progressOverview.viewModeAria")}
                            onKeyDown={onHeadKeyDown}
                        >
                            <h2 className="section-title-sm" id="progress-overview-title">
                                {t("progressOverview.title")}
                            </h2>
                            <span className="muted-text" id="progress-overview-subtitle">
                                {viewMode === "dimensions" ? t("progressOverview.subtitle") : t("progressOverview.subtitleTrend")}
                            </span>
                        </div>
                        <div className="chart-progress-head-actions">
                            {typeof onOpenAssessmentRecords === "function" ? (
                                <button
                                    type="button"
                                    className="progress-view-records-btn"
                                    onClick={onOpenAssessmentRecords}
                                    aria-label={t("progressOverview.viewDetailedRecordsAria")}
                                >
                                    {t("progressOverview.viewDetailedRecords")}
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>

                {viewMode === "dimensions" ? (
                    <div className="progress-assessment-outer">
                        <button
                            type="button"
                            className="chart-carousel-nav chart-carousel-nav--prev"
                            aria-label={t("progressOverview.prevDimensionAria")}
                            disabled={dimensionSlideIndex <= 0}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => {
                                const el = swipeRef.current;
                                const w = el?.clientWidth ?? 0;
                                if (!el || w <= 0 || dimensionSlideIndex <= 0) {
                                    return;
                                }
                                el.scrollBy({ left: -w, behavior: "smooth" });
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
                            aria-label={t("progressOverview.nextDimensionAria")}
                            disabled={dimensionSlideIndex >= slides.length - 1}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => {
                                const el = swipeRef.current;
                                const w = el?.clientWidth ?? 0;
                                if (!el || w <= 0 || dimensionSlideIndex >= slides.length - 1) {
                                    return;
                                }
                                el.scrollBy({ left: w, behavior: "smooth" });
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                <path
                                    d="M9.8 5.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L13.6 12l-3.8-3.8a1 1 0 0 1 0-1.4Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                        <div
                            ref={swipeRef}
                            className="progress-assessment-swipe"
                            role="region"
                            aria-label={t("progressOverview.aria")}
                            tabIndex={0}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                            onPointerCancel={onPointerCancel}
                        >
                            {slides.map((slide, slideIndex) => (
                                <div key={slide.id} className="progress-assessment-slide">
                                    <div
                                        className={`progress-assessment-slide-inner${dimensionSlideIndex === slideIndex ? " is-active-slide" : ""}`}
                                    >
                                        <h3 className="progress-assessment-slide-title">{t(`progressAssessment.${slide.id}.title`)}</h3>
                                        <AssessmentRadar
                                            slideId={slide.id}
                                            color={assessmentSlideColors[slide.id] || "var(--primary)"}
                                            items={slide.items}
                                            isActive={dimensionSlideIndex === slideIndex}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <TrendChartCarousel />
                )}
            </div>
        </section>
    );
}
