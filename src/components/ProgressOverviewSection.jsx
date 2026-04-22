import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AssessmentRadar from "./AssessmentRadar";
import TrendChartCarousel from "./TrendChartCarousel";
import { assessmentSlideColors, growthOverview } from "../data/mockData";

const PROGRESS_VIEW_STORAGE_KEY = "club-progress-overview-view";

/** 与 TrendChartCarousel 一致的拖拽门槛与翻页手感 */
const DRAG_LOCK_THRESHOLD = 10;
const DRAG_SNAP_THRESHOLD = 36;

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
    const [activeTrendChart, setActiveTrendChart] = useState("putting");

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
    const dimensionProfiles = useMemo(
        () =>
            slides.map((slide) => {
                const average =
                    slide.items.reduce((sum, item) => sum + Number(item.score || 0), 0) / Math.max(1, slide.items.length);
                return {
                    id: slide.id,
                    title: t(`progressAssessment.${slide.id}.title`),
                    average,
                };
            }),
        [slides, t]
    );
    const strongestDimension = useMemo(
        () => [...dimensionProfiles].sort((a, b) => b.average - a.average)[0] ?? null,
        [dimensionProfiles]
    );
    const focusDimension = useMemo(
        () => [...dimensionProfiles].sort((a, b) => a.average - b.average)[0] ?? null,
        [dimensionProfiles]
    );
    const trendProfiles = useMemo(
        () =>
            Object.entries(growthOverview.weeklyTrendSeries).map(([key, values]) => ({
                key,
                label: t(`progressCharts.${key}`),
                delta: (values?.[values.length - 1] || 0) - (values?.[0] || 0),
                story: t(`progressOverview.chartStories.${key}`),
            })),
        [t]
    );
    const activeTrendProfile = trendProfiles.find((item) => item.key === activeTrendChart) ?? trendProfiles[0] ?? null;
    const overviewLead =
        viewMode === "dimensions"
            ? t("progressOverview.storyLeadDimensions", {
                  best: strongestDimension?.title ?? "—",
                  focus: focusDimension?.title ?? "—",
              })
            : t("progressOverview.storyLeadTrend", {
                  chart: activeTrendProfile?.label ?? "—",
                  direction:
                      (activeTrendProfile?.delta ?? 0) >= 0
                          ? t("progressOverview.trendDirectionUp")
                          : t("progressOverview.trendDirectionDown"),
              });
    const overviewSupport =
        viewMode === "dimensions"
            ? t("progressOverview.storySupportDimensions", {
                  phase: t("progressOverview.demoPhaseLabel"),
                  goal: t("progressOverview.demoWeeklyGoalMetric"),
              })
            : t("progressOverview.storySupportTrend", {
                  streak: t("progressOverview.streakValue", { count: growthOverview.streakDays }),
                  story: activeTrendProfile?.story ?? "—",
              });

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
                    <div className="chart-progress-head-top">
                        <div
                            className="chart-progress-head-lead"
                        >
                            <p className="chart-progress-eyebrow">{t("progressOverview.sectionEyebrow")}</p>
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
                    <div className="progress-view-tabs" role="tablist" aria-label={t("progressOverview.viewModesAria")}>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={viewMode === "dimensions"}
                            className={`progress-view-tab${viewMode === "dimensions" ? " is-active" : ""}`}
                            onClick={() => setViewMode("dimensions")}
                        >
                            {t("progressOverview.dimensionsLabel")}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={viewMode === "trend"}
                            className={`progress-view-tab${viewMode === "trend" ? " is-active" : ""}`}
                            onClick={() => setViewMode("trend")}
                        >
                            {t("progressOverview.trendLabel")}
                        </button>
                    </div>
                    <div className="progress-story-block">
                        <div className="progress-story-copy">
                            <p className="progress-story-lead">{overviewLead}</p>
                            <p className="progress-story-support">{overviewSupport}</p>
                        </div>
                        <div className="progress-story-metrics">
                            <div className="progress-story-stat">
                                <span>{t("progressOverview.phaseProgressLabel")}</span>
                                <strong>{growthOverview.phaseProgress}%</strong>
                            </div>
                            <div className="progress-story-stat">
                                <span>{t("progressOverview.weeklyGoalLabel")}</span>
                                <strong>{t("progressOverview.demoWeeklyGoalMetric")}</strong>
                            </div>
                            <div className="progress-story-stat">
                                <span>
                                    {viewMode === "dimensions"
                                        ? t("progressOverview.focusDimensionLabel")
                                        : t("progressOverview.activeTrendLabel")}
                                </span>
                                <strong>
                                    {viewMode === "dimensions"
                                        ? focusDimension?.title ?? "—"
                                        : activeTrendProfile?.label ?? "—"}
                                </strong>
                            </div>
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
                                        <div className="progress-assessment-slide-meta">
                                            <span className="progress-assessment-slide-kicker">{t("progressOverview.dimensionsLabel")}</span>
                                            <strong className="progress-assessment-slide-score">
                                                {t("progressOverview.slideAverage", {
                                                    score: dimensionProfiles[slideIndex]?.average?.toFixed(1) ?? "0.0",
                                                })}
                                            </strong>
                                        </div>
                                        <h3 className="progress-assessment-slide-title">{t(`progressAssessment.${slide.id}.title`)}</h3>
                                        <AssessmentRadar
                                            slideId={slide.id}
                                            color={assessmentSlideColors[slide.id] || "var(--primary)"}
                                            items={slide.items}
                                            isActive={dimensionSlideIndex === slideIndex}
                                        />
                                        <p className="progress-assessment-slide-note">
                                            {t(
                                                slide.id === strongestDimension?.id
                                                    ? "progressOverview.dimensionStateStrong"
                                                    : slide.id === focusDimension?.id
                                                      ? "progressOverview.dimensionStateFocus"
                                                      : "progressOverview.dimensionStateSteady",
                                                {
                                                    title: dimensionProfiles[slideIndex]?.title ?? t(`progressAssessment.${slide.id}.title`),
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <TrendChartCarousel onActiveChartChange={(chart) => setActiveTrendChart(chart?.key || "putting")} />
                )}
            </div>
        </section>
    );
}
