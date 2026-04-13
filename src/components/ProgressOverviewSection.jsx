import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { growthOverview } from "../data/mockData";

const TREND_SERIES_META = [
    { key: "skill", label: "各项技能进阶趋势", color: "var(--primary)" },
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
    const { t } = useTranslation();
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
        <article className={`panel panel-elevated trend-panel section-stack ${withBottomGap ? "section-bottom-gap" : ""}`}>
            <div className="section-head">
                <h2 className="section-title-sm">{t("progressOverview.title", "技能稳定度趋势")}</h2>
                <span className="muted-text">{t("progressOverview.subtitle", "最近 7 次训练")}</span>
            </div>
            <div className="trend-chart-wrap" aria-label="技能稳定度趋势曲线图">
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
    );
}
