import { Trans, useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
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

function formatSessionTime(iso, language) {
    const date = new Date(iso);
    if (language === "en") {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date);
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${month}月${day}日, ${hour}:${minute}`;
}

export default function BookingPage({ onOpenBookingModal, onOpenReviewInvite, onToast }) {
    const { t, i18n } = useTranslation();
    const { state, actions } = useAppContext();
    const timer = useCountdown(state.nextSessionISO);
    const [isNotificationExpanded, setIsNotificationExpanded] = useState(false);
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
    const translatedSelectedCourseName = selectedCourseAsset?.id
        ? t(`courseAssets.${selectedCourseAsset.id}.courseName`, { defaultValue: selectedCourseAsset.courseName })
        : "";
    const translatedSelectedCourseTitle = t(`schedule.${selectedSchedule.day}.courseTitle`, {
        defaultValue: selectedSchedule.courseTitle,
    });

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
        const translatedCourseName = primaryCoach.id
            ? t(`courseAssets.${primaryCoach.id}.courseName`, { defaultValue: primaryCoach.courseName })
            : primaryCoach.courseName;
        return {
            ...primaryCoach,
            score: undefined,
            badge: t("booking.post.waiting"),
            desc: `${translatedCourseName || t("booking.post.unselected")} · ${bookedSchedule.day}${i18n.resolvedLanguage === "en" ? "" : "号"} ${bookedSchedule.time}`,
        };
    }, [bookedCourseAsset, bookedSchedule.day, bookedSchedule.time, i18n.resolvedLanguage, t]);

    const handlePickDate = (day) => {
        actions.setSelectedDate(day);
        const firstAsset = (courseAssetsByDate[day] || [])[0];
        if (firstAsset?.id) {
            actions.setSelectedCourseAsset(firstAsset.id);
        }
        if (state.bookingStatus === "booked") {
            actions.setNextSession(buildNextSessionISO(day));
        }
        onToast(t("booking.chooseDayToast", { day }));
    };

    const handlePickCourseAsset = (asset) => {
        actions.setSelectedCourseAsset(asset.id);
        onToast(
            t("booking.chooseCourseToast", {
                name: t(`courseAssets.${asset.id}.courseName`, { defaultValue: asset.courseName }),
            })
        );
    };

    const handleToggleBookingStatus = () => {
        const newStatus = isPre ? "booked" : "pre";
        actions.setBookingStatus(newStatus);
        onToast(
            t("booking.statusToast", {
                status: newStatus === "booked" ? t("booking.statusPost") : t("booking.statusPre"),
            })
        );
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
                        <p className="small-label">{t("booking.venue")}</p>
                        <h1 className="headline">{t("booking.title")}</h1>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button type="button" className="icon-btn" aria-label={t("booking.switchStatusAria")} onClick={handleToggleBookingStatus} title={isPre ? t("booking.switchToPost") : t("booking.switchToPre")}>
                        ⇄
                    </button>
                    <button type="button" className="icon-btn" aria-label={t("booking.notificationAria")}>
                        ○
                    </button>
                </div>
            </header>

            {isPre ? (
                <>
                    <section className={`panel notification-panel ${isNotificationExpanded ? 'is-expanded' : ''}`}>
                        <div className="notification-header" onClick={() => setIsNotificationExpanded(!isNotificationExpanded)} style={{ cursor: 'pointer' }}>
                            <h3 className="notification-title">
                                <span className="notification-dot"></span>
                                {t("booking.pre.notificationTitle")}
                            </h3>
                            <div className="notification-header-right">
                                <span className="notification-time">{t("booking.pre.notificationTime")}</span>
                                <span className="expand-indicator"></span>
                            </div>
                        </div>
                        <div className="notification-content">
                            <p className="notification-body" style={{ marginBottom: '16px', lineHeight: '1.6' }}>
                                <Trans i18nKey="booking.pre.notificationBody" components={{ strong: <strong /> }} />
                            </p>

                            <div style={{ marginBottom: '20px', background: 'var(--surface-container-high)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(80, 69, 51, 0.4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div>
                                        <h4 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px 0', color: 'var(--on-surface)' }}>{t("booking.pre.requestTitle")}</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--tertiary)' }}>{t("booking.pre.requestDrill")}</p>
                                    </div>
                                    <span style={{ backgroundColor: 'rgba(255, 202, 104, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>14:00-15:30</span>
                                </div>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '16px 0' }}></div>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="David Chen" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                                            <h3 style={{ fontSize: '15px', fontWeight: '600', margin: 0, color: 'var(--on-surface)' }}>David Chen</h3>
                                            <span style={{ color: 'var(--on-surface-variant)', fontSize: '12px' }}>{t("booking.pre.coachTitle")}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '16px', color: 'var(--on-surface-variant)', fontSize: '12px' }}>
                                            <span>📞 {t("booking.pre.coachPhone")}</span>
                                            <span>🏆 {t("booking.pre.coachScore")}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="notification-input-wrapper">
                                <textarea
                                    className="notification-input"
                                    placeholder={t("booking.pre.rejectReasonPlaceholder")}
                                ></textarea>
                            </div>
                            <div className="notification-actions">
                                <button className="primary-btn" onClick={(e) => { e.stopPropagation(); onToast(t("booking.approvedToast")); setIsNotificationExpanded(false); actions.setBookingStatus("booked"); }}>{t("booking.pre.approve")}</button>
                                <button className="secondary-btn" onClick={(e) => { e.stopPropagation(); onToast(t("booking.rejectedToast")); setIsNotificationExpanded(false); }}>{t("booking.pre.reject")}</button>
                            </div>
                        </div>
                    </section>

                    <section className="split-grid card-gap">
                        <article className="panel stat-panel">
                            <p className="section-title-sm">{t("booking.pre.totalCourses")}</p>
                            <p className="metric-large">{t("booking.pre.totalCoursesValue")}</p>
                            <p className="muted-text">{t("booking.pre.totalCoursesExpiry")}</p>
                        </article>

                        <article className="panel stat-panel panel-low">
                            <p className="section-title-sm">{t("booking.pre.usedCourses")}</p>
                            <p className="metric-large pale">{t("booking.pre.usedCoursesValue")}</p>
                            <p className="accent-cold">{t("booking.pre.usedCoursesHint")}</p>
                        </article>
                    </section>

                    <section className="section-stack">
                        <div className="section-head">
                            <h2 className="section-title-sm">{t("booking.pre.scheduleTitle")}</h2>
                            <button type="button" className="link-btn" onClick={() => onToast(t("booking.demoListToast"))}>
                                {t("booking.pre.viewAll")}
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
                            <h2 className="section-title-sm">{t("booking.pre.coursesTitle")}</h2>
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

                    <button
                        type="button"
                        className="cta-banner"
                        onClick={onOpenBookingModal}
                        aria-label={
                            selectedCourseAsset?.courseName
                                ? `${t("booking.pre.ctaPrefix")}：${translatedSelectedCourseName}`
                                : `${t("booking.pre.ctaPrefix")} ${t("booking.pre.ctaSelectedSuffix")}`
                        }
                    >
                        {`${t("booking.pre.ctaPrefix")}${translatedSelectedCourseName ? `「${translatedSelectedCourseName}」` : t("booking.pre.ctaSelectedSuffix")}`}
                    </button>
                </>
            ) : (
                <>
                    <article className="panel countdown-panel panel-elevated">
                        <p className="section-title-sm">{t("booking.post.nextTeeTime")}</p>
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
                            <span className="muted-text">{t("booking.post.bookedAt", { date: formatSessionTime(state.nextSessionISO, i18n.resolvedLanguage), time: bookedSchedule.time })}</span>
                            <span className="pill">{t("booking.post.confirmedDay", { day: bookedSchedule.day })}</span>
                        </div>
                        <p className="muted-text" style={{ marginTop: "8px" }}>
                            {t("booking.post.bookedCourse", { name: bookedCourseAsset?.id ? t(`courseAssets.${bookedCourseAsset.id}.courseName`, { defaultValue: bookedCourseAsset.courseName }) : t("booking.post.unselected") })}
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
                            <p className="muted-text weather-meta">{t("booking.post.weatherSummary")}</p>
                            <p className="section-title-xs">{t("booking.post.aiSuggestionTitle")}</p>
                            <p className="muted-text">
                                {t("booking.post.aiSuggestionBody")}
                            </p>
                        </article>
                    </section>

                    <article className="panel qr-panel panel-elevated">
                        <p className="section-title-sm">{t("booking.post.qrTitle")}</p>
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
                        <p className="qr-caption">{t("booking.post.qrCaption")}</p>
                    </article>

                    <button type="button" className="btn-primary wide" onClick={onOpenReviewInvite}>
                        {t("booking.post.classFinished")}
                    </button>

                    <section className="section-stack">
                        <div className="section-head">
                            <h2 className="section-title-sm">{t("booking.post.privateCoach")}</h2>
                            <span className="pill">{bookedCoach.badge}</span>
                        </div>
                        <CoachCard coach={bookedCoach} compact />
                    </section>
                </>
            )}
        </section>
    );
}
