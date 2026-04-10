import { useMemo } from "react";
import { buildNextSessionISO, useAppContext } from "../context/AppContext";
import { coachPost, coachesPre, courseAssetsByDate, scheduleDates } from "../data/mockData";
import { useCountdown } from "../hooks/useCountdown";
import CoachCard from "../components/CoachCard";
import DateChip from "../components/DateChip";

const qrPattern = [
    "111111100101001111111",
    "100000101011101000001",
    "101110101100101011101",
    "101110100111001011101",
    "101110101001101011101",
    "100000100110101000001",
    "111111101010101111111",
    "000000000111000000000",
    "110011101010111010011",
    "001101011101010110100",
    "111000110010011001111",
    "010111001101100111010",
    "101001110011010001101",
    "001010011100111010100",
    "111111100111010110010",
    "100000101010101001101",
    "101110101101001110010",
    "101110100011110001011",
    "101110101110011010100",
    "100000100101100111001",
    "111111101111001001110",
];

function formatSessionTime(iso) {
    const date = new Date(iso);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${month}月${day}日, ${hour}:${minute}`;
}

export default function BookingPage({ onOpenBookingModal, onOpenReviewInvite, onToast }) {
    const { state, actions } = useAppContext();
    const timer = useCountdown(state.nextSessionISO);
    const selectedSchedule = useMemo(
        () => scheduleDates.find((item) => item.day === state.selectedDate) || scheduleDates[0],
        [state.selectedDate]
    );

    const selectedCourseAssets = useMemo(
        () => courseAssetsByDate[state.selectedDate] || coachesPre,
        [state.selectedDate]
    );

    const selectedCourseAsset = useMemo(
        () => selectedCourseAssets.find((item) => item.id === state.selectedCourseAssetId) || selectedCourseAssets[0] || null,
        [selectedCourseAssets, state.selectedCourseAssetId]
    );

    const bookedDay = state.bookedDate || state.selectedDate;
    const bookedSchedule = useMemo(
        () => scheduleDates.find((item) => item.day === bookedDay) || selectedSchedule,
        [bookedDay, selectedSchedule]
    );

    const bookedAssets = useMemo(
        () => courseAssetsByDate[bookedDay] || selectedCourseAssets,
        [bookedDay, selectedCourseAssets]
    );

    const bookedCourseAsset = useMemo(
        () => bookedAssets.find((item) => item.id === state.bookedCourseAssetId) || bookedAssets[0] || null,
        [bookedAssets, state.bookedCourseAssetId]
    );

    const bookedCoach = useMemo(() => {
        const primaryCoach = bookedCourseAsset || coachPost;
        return {
            ...primaryCoach,
            score: undefined,
            badge: "等你来",
            desc: `${primaryCoach.courseName || "已确认课程"} · ${bookedSchedule.day}号 ${bookedSchedule.time}`,
        };
    }, [bookedCourseAsset, bookedSchedule.day, bookedSchedule.time]);

    const handlePickDate = (day) => {
        actions.setSelectedDate(day);
        const firstAsset = (courseAssetsByDate[day] || [])[0];
        if (firstAsset?.id) {
            actions.setSelectedCourseAsset(firstAsset.id);
        }
        if (state.bookingStatus === "booked") {
            actions.setNextSession(buildNextSessionISO(day));
        }
        onToast(`已选择 ${day} 号训练档期`);
    };

    const handlePickCourseAsset = (asset) => {
        actions.setSelectedCourseAsset(asset.id);
        onToast(`已选择课程：${asset.courseName}`);
    };

    const handleToggleBookingStatus = () => {
        const newStatus = isPre ? "booked" : "pre";
        actions.setBookingStatus(newStatus);
        onToast(`已切换到${newStatus === "booked" ? "预约后" : "预约前"}界面`);
    };

    const isPre = state.bookingStatus === "pre";

    return (
        <section className={`screen fade-enter ${isPre ? "booking-pre" : "booking-post"}`}>
            <header className="top-header">
                <div className="user-chip">
                    <div className="avatar golf-icon">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="16" y="2" width="8" height="20" fill="currentColor" fillOpacity="0.3" />
                            <path d="M20 22L14 38H26L20 22Z" fill="currentColor" fillOpacity="0.9" />
                            <circle cx="20" cy="20" r="3" fill="currentColor" />
                        </svg>
                    </div>
                    <div>
                        <p className="small-label">皇家球场</p>
                        <h1 className="headline">Welcome Back</h1>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button type="button" className="icon-btn" aria-label="切换预约状态" onClick={handleToggleBookingStatus} title={isPre ? "切换到预约后" : "切换到预约前"}>
                        ⇄
                    </button>
                    <button type="button" className="icon-btn" aria-label="通知">
                        ○
                    </button>
                </div>
            </header>

            {isPre ? (
                <>
                    <section className="split-grid card-gap">
                        <article className="panel stat-panel">
                            <p className="section-title-sm">剩余总课数</p>
                            <p className="metric-large">12</p>
                            <p className="muted-text">有效期至 2027.12.31</p>
                        </article>

                        <article className="panel stat-panel panel-low">
                            <p className="section-title-sm">已消耗课数</p>
                            <p className="metric-large pale">48</p>
                            <p className="accent-cold">↗ 超越 85% 会员</p>
                        </article>
                    </section>

                    <button type="button" className="cta-banner" onClick={onOpenBookingModal}>
                        <div>
                            <h3>立即预约下一次训练课程</h3>
                            <p>根据您的训练进度，建议本周预约</p>
                        </div>
                        <span className="cta-icon">+</span>
                    </button>

                    <section className="section-stack">
                        <div className="section-head">
                            <h2 className="section-title-sm">训练档期</h2>
                            <button type="button" className="link-btn" onClick={() => onToast("演示版暂未开放完整列表")}>
                                查看全部
                            </button>
                        </div>
                        <div className="date-row">
                            {scheduleDates.map((item) => (
                                <DateChip key={item.day} item={item} active={state.selectedDate === item.day} onClick={handlePickDate} />
                            ))}
                        </div>
                    </section>

                    <section className="section-stack">
                        <div className="section-head">
                            <h2 className="section-title-sm">课程资产</h2>
                            <button type="button" className="round-mini">⌘</button>
                        </div>
                        <div className="stack-list">
                            {selectedCourseAssets.map((coach) => (
                                <CoachCard
                                    key={coach.id || coach.name}
                                    coach={coach}
                                    selectable
                                    selected={selectedCourseAsset?.id === coach.id}
                                    onClick={() => handlePickCourseAsset(coach)}
                                />
                            ))}
                        </div>
                    </section>
                </>
            ) : (
                <>
                    <article className="panel countdown-panel panel-elevated">
                        <p className="section-title-sm">下次发球时间</p>
                        <div className="countdown-row">
                            <div className="time-block">
                                <span className="time-num">{timer.days}</span>
                                <span className="time-label">DAYS</span>
                            </div>
                            <span className="time-colon">:</span>
                            <div className="time-block">
                                <span className="time-num">{timer.hours}</span>
                                <span className="time-label">HOURS</span>
                            </div>
                            <span className="time-colon">:</span>
                            <div className="time-block">
                                <span className="time-num">{timer.minutes}</span>
                                <span className="time-label">MIN</span>
                            </div>
                            <span className="time-colon">:</span>
                            <div className="time-block">
                                <span className="time-num">{timer.seconds}</span>
                                <span className="time-label">SEC</span>
                            </div>
                        </div>
                        <div className="meta-row">
                            <span className="muted-text">预约 {formatSessionTime(state.nextSessionISO)} · {bookedSchedule.time}</span>
                            <span className="pill">{bookedSchedule.day}号已确认</span>
                        </div>
                        <p className="muted-text" style={{ marginTop: "8px" }}>
                            已预约课程：{bookedCourseAsset?.courseName || "未选择"}
                        </p>
                    </article>

                    <section className="card-gap">
                        <article className="panel panel-low weather-ai-card">
                            <div className="weather-head">
                                <span className="weather-icon" aria-hidden="true">
                                    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="13" cy="13" r="6" fill="currentColor" fillOpacity="0.9" />
                                        <path
                                            d="M18 23.5C18 20.46 20.46 18 23.5 18C26 18 28.12 19.68 28.8 22H29C31.21 22 33 23.79 33 26C33 28.21 31.21 30 29 30H18.5C16.57 30 15 28.43 15 26.5C15 24.57 16.57 23 18.5 23H18"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path d="M13 3V0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M13 26V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M3 13H0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M26 13H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <p className="weather-number">24°C</p>
                            </div>
                            <p className="muted-text weather-meta">微风 3.2m/s · 绝佳挥杆天气</p>
                            <p className="section-title-xs">AI练习建议</p>
                            <p className="muted-text">
                                侧风较大，建议今日练习中加强低平球控球稳定性，并注重重心转移。
                            </p>
                        </article>
                    </section>

                    <article className="panel qr-panel panel-elevated">
                        <p className="section-title-sm">上课核销码</p>
                        <div className="qr-shell">
                            <div className="qr-inner" aria-hidden="true">
                                <div className="qr-grid">
                                    {qrPattern.flatMap((row, rowIndex) =>
                                        row.split("").map((cell, cellIndex) => (
                                            <span
                                                key={`${rowIndex}-${cellIndex}`}
                                                className={`qr-cell ${cell === "1" ? "on" : "off"}`}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        <p className="qr-caption">CLASS VERIFICATION CODE • DYNAMIC UPDATE</p>
                    </article>

                    <button type="button" className="btn-primary wide" onClick={onOpenReviewInvite}>
                        课程结束
                    </button>

                    <section className="section-stack">
                        <div className="section-head">
                            <h2 className="section-title-sm">您的私人教练</h2>
                            <span className="pill">{bookedCoach.badge}</span>
                        </div>
                        <CoachCard coach={bookedCoach} compact />
                    </section>
                </>
            )}
        </section>
    );
}
