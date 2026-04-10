import { useMemo } from "react";
import { growthOverview } from "../data/mockData";

const TREND_SERIES_META = [
    { key: "physical", label: "体能", color: "var(--primary)" },
    { key: "mental", label: "心理", color: "var(--tertiary)" },
    { key: "skill", label: "技能", color: "#7fd6b2" },
];

const TREND_DAYS = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"];

function buildSmoothPath(values, getX, getY) {
    const points = values.map((value, index) => ({ x: getX(index), y: getY(value) }));
    if (points.length < 2) {
        return "";
    }

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i += 1) {
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

export default function ProgressOverviewSection({ withBottomGap = true }) {
    const chartWidth = 324;
    const chartHeight = 144;

    const trendValues = useMemo(
        () => TREND_SERIES_META.flatMap((series) => growthOverview.weeklyTrendSeries[series.key]),
        []
    );

    const trendMin = Math.min(...trendValues) - 4;
    const trendMax = Math.max(...trendValues) + 4;

    const getX = (index) => (index / (TREND_DAYS.length - 1)) * chartWidth;
    const getY = (value) => {
        if (trendMax === trendMin) {
            return chartHeight / 2;
        }
        return chartHeight - ((value - trendMin) / (trendMax - trendMin)) * chartHeight;
    };

    return (
        <>
            <article className="panel panel-elevated progress-overview-card">
                <div className="section-head">
                    <h2 className="section-title-sm">{growthOverview.phaseLabel}</h2>
                    <span className="pill">连续训练 {growthOverview.streakDays} 天</span>
                </div>
                <p className="muted-text">{growthOverview.weeklyGoal}</p>
                <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={growthOverview.phaseProgress}>
                    <span style={{ width: `${growthOverview.phaseProgress}%` }} />
                </div>
                <p className="tiny-text">阶段达成率 {growthOverview.phaseProgress}%</p>
            </article>

            <section className="split-grid card-gap section-stack">
                {growthOverview.dimensionScores.map((item) => (
                    <article className="panel panel-low metric-mini-card" key={item.key}>
                        <p className="tiny-text">{item.key}</p>
                        <p className="metric-small">{item.displayValue ?? item.score}</p>
                        <p className="accent-cold">{item.trend}</p>
                    </article>
                ))}
            </section>

            <article className={`panel panel-low trend-panel section-stack ${withBottomGap ? "section-bottom-gap" : ""}`}>
                <div className="section-head">
                    <h2 className="section-title-sm">周趋势</h2>
                    <span className="muted-text">最近 7 天</span>
                </div>
                <div className="trend-legend">
                    {TREND_SERIES_META.map((series) => (
                        <span key={series.key} className="trend-legend-item">
                            <i style={{ background: series.color }} />
                            {series.label}
                        </span>
                    ))}
                </div>
                <div className="trend-chart-wrap" aria-label="体能心理技能周趋势曲线图">
                    <svg className="trend-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                        {[0, 1, 2, 3].map((step) => {
                            const y = (chartHeight / 3) * step;
                            return <line key={step} className="trend-grid-line" x1="0" y1={y} x2={chartWidth} y2={y} />;
                        })}

                        {TREND_SERIES_META.map((series) => {
                            const values = growthOverview.weeklyTrendSeries[series.key];
                            const path = buildSmoothPath(values, getX, getY);

                            return (
                                <g key={series.key}>
                                    <path d={path} className="trend-line" style={{ stroke: series.color }} />
                                    {values.map((value, index) => (
                                        <circle
                                            key={`${series.key}-${index}`}
                                            className="trend-point"
                                            style={{ fill: series.color }}
                                            cx={getX(index)}
                                            cy={getY(value)}
                                            r="3.4"
                                        />
                                    ))}
                                </g>
                            );
                        })}
                    </svg>
                    <div className="trend-x-labels">
                        {TREND_DAYS.map((day) => (
                            <small key={day}>{day}</small>
                        ))}
                    </div>
                </div>
            </article>
        </>
    );
}
