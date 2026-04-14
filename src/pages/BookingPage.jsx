import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { sortBookingsByTime, useAppContext } from "../context/AppContext";
import { ALL_SLOTS, coachPost, coachInfoCard, getSessionDisplay, getSlotById, openSlotsByDate, scheduleDates } from "../data/mockData";
import { useCountdown } from "../hooks/useCountdown";
import CoachCard from "../components/CoachCard";
import SessionCourseDetailCard from "../components/SessionCourseDetailCard";
import DateChip from "../components/DateChip";
import GolfVenueAvatar from "../components/GolfVenueAvatar";

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

function formatSessionTime(iso, locale) {
    if (!iso) return "";
    const date = new Date(iso);
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function formatBookingCardDate(iso, locale) {
    if (!iso) return "";
    const date = new Date(iso);
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
        month: "long",
        day: "numeric",
        weekday: "short",
    }).format(date);
}

export default function BookingPage({ onOpenBookingModal, onOpenReviewInvite, onToast }) {
    const { t, i18n } = useTranslation();
    const { state, actions } = useAppContext();
    const detailBooking = useMemo(
        () => state.bookings.find((b) => b.id === state.detailBookingId) ?? null,
        [state.bookings, state.detailBookingId]
    );
    const timer = useCountdown(detailBooking?.nextSessionISO ?? null);
    const [isNotificationExpanded, setIsNotificationExpanded] = useState(false);
    const slotStripRef = useRef(null);
    const [stripFog, setStripFog] = useState({ left: false, right: false });

    const selectedSchedule = useMemo(
        () => scheduleDates.find((item) => item.day === state.selectedDate) || scheduleDates[0],
        [state.selectedDate]
    );

    const openSlotsForDay = useMemo(() => new Set(openSlotsByDate[state.selectedDate] || []), [state.selectedDate]);

    const bookedSchedule = useMemo(
        () =>
            detailBooking
                ? scheduleDates.find((item) => item.day === detailBooking.day) || selectedSchedule
                : selectedSchedule,
        [detailBooking, selectedSchedule]
    );

    const bookedSlot = useMemo(() => getSlotById(detailBooking?.courseAssetId), [detailBooking?.courseAssetId]);

    const selectedSlot = useMemo(() => getSlotById(state.selectedCourseAssetId), [state.selectedCourseAssetId]);

    useEffect(() => {
        const el = slotStripRef.current;
        if (!el) {
            return undefined;
        }
        const updateFog = () => {
            const max = el.scrollWidth - el.clientWidth;
            if (max <= 4) {
                setStripFog({ left: false, right: false });
                return;
            }
            const sl = el.scrollLeft;
            setStripFog({ left: sl > 6, right: sl < max - 6 });
        };
        updateFog();
        const ro = new ResizeObserver(updateFog);
        ro.observe(el);
        el.addEventListener("scroll", updateFog, { passive: true });
        return () => {
            ro.disconnect();
            el.removeEventListener("scroll", updateFog);
        };
    }, [state.selectedDate, state.bookingStatus]);

    const previewSlotId = state.selectedCourseAssetId || "slot-3";
    const previewSession = useMemo(
        () => getSessionDisplay(state.selectedDate, previewSlotId),
        [state.selectedDate, previewSlotId]
    );

    const bookedSession = useMemo(
        () => (detailBooking ? getSessionDisplay(detailBooking.day, detailBooking.courseAssetId) : null),
        [detailBooking]
    );

    const sortedBookings = useMemo(() => sortBookingsByTime(state.bookings), [state.bookings]);

    const bookedCoach = useMemo(() => {
        if (!detailBooking) {
            return null;
        }
        const primaryCoach = coachPost;
        const base = { ...primaryCoach, score: undefined, badge: t("booking.post.waiting") };
        const locale = i18n.resolvedLanguage || "zh";
        const fmt = (iso) => formatSessionTime(iso, locale);
        const coachTitle = t("booking.pre.coachTitle", { defaultValue: primaryCoach.title });
        if (!bookedSession || !bookedSlot) {
            return {
                ...base,
                title: coachTitle,
                desc: bookedSlot
                    ? t("booking.post.bookedAt", {
                          date: fmt(detailBooking.nextSessionISO),
                          time: bookedSlot.range,
                      })
                    : `${t("booking.post.coachReadyDesc")} · ${bookedSchedule.day}${t("booking.modal.daySuffix")} ${bookedSchedule.time}`,
            };
        }
        if (detailBooking.courseConfirmedByCoach === false) {
            return {
                ...base,
                courseName: t("booking.courseTitleUnknown"),
                drill: t("growth.pendingCourseTopic", { defaultValue: bookedSession.drill }),
                time: bookedSession.range,
                avatarUrl: bookedSession.avatarUrl,
                title: coachTitle,
                desc: t("booking.post.bookedAt", {
                    date: fmt(detailBooking.nextSessionISO),
                    time: bookedSlot.range,
                }),
            };
        }
        const courseName = bookedSession.courseAssetId
            ? t(`courseAssets.${bookedSession.courseAssetId}.courseName`, { defaultValue: bookedSession.courseName })
            : t(`schedule.${bookedSession.scheduleDay}.courseTitle`, { defaultValue: bookedSession.courseName });
        const drill = bookedSession.courseAssetId
            ? t(`courseAssets.${bookedSession.courseAssetId}.drill`, { defaultValue: bookedSession.drill })
            : t("growth.pendingCourseTopic", { defaultValue: bookedSession.drill });
        return {
            ...base,
            courseName,
            drill,
            time: bookedSession.range,
            avatarUrl: bookedSession.avatarUrl,
            title: coachTitle,
            desc: t("booking.post.bookedAt", {
                date: fmt(detailBooking.nextSessionISO),
                time: bookedSlot.range,
            }),
        };
    }, [detailBooking, bookedSession, bookedSlot, bookedSchedule.day, bookedSchedule.time, t, i18n.resolvedLanguage]);

    const handlePickDate = (day) => {
        actions.setSelectedDate(day);
        actions.setSelectedCourseAsset(null);
    };

    const handlePickSlot = (slotId) => {
        if (!openSlotsForDay.has(slotId)) {
            return;
        }
        actions.setSelectedCourseAsset(slotId);
    };

    const isPre = state.bookingStatus === "pre";

    const handleToggleBookingStatus = () => {
        const newStatus = isPre ? "booked" : "pre";
        actions.setBookingStatus(newStatus);
        onToast(
            t("booking.statusToast", {
                status: newStatus === "booked" ? t("booking.statusPost") : t("booking.statusPre"),
            })
        );
    };

    const showPostList = !isPre && !detailBooking && state.bookings.length > 0;
    const showPostEmpty = !isPre && !detailBooking && state.bookings.length === 0;
    const showPostDetail = !isPre && detailBooking;

    return (
        <section
            className={`screen fade-enter ${isPre ? "booking-pre" : "booking-post"}${showPostDetail ? " booking-post--detail" : ""}`}
        >
            <header className={`top-header${showPostDetail ? " booking-top-header booking-top-header--detail" : ""}`}>
                {showPostDetail ? (
                    <button
                        type="button"
                        className="icon-btn booking-back-btn"
                        aria-label={t("booking.post.backToList")}
                        onClick={() => actions.setDetailBooking(null)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path
                                d="M15 18L9 12L15 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                ) : null}
                {!showPostDetail ? (
                    <div className="user-chip">
                        <GolfVenueAvatar />
                        <div>
                            <p className="small-label">{t("common.venueName")}</p>
                            <h1 className="headline">{t("booking.title")}</h1>
                        </div>
                    </div>
                ) : (
                    <div className="booking-detail-header-spacer" aria-hidden="true" />
                )}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                        type="button"
                        className="icon-btn"
                        aria-label={t("booking.switchStatusAria")}
                        onClick={handleToggleBookingStatus}
                        title={isPre ? t("booking.switchToPost") : t("booking.switchToPre")}
                    >
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
                            <p
                                className="notification-body"
                                style={{ marginBottom: '16px', lineHeight: '1.6' }}
                                dangerouslySetInnerHTML={{ __html: t("booking.pre.notificationBody") }}
                            />

                            <SessionCourseDetailCard session={previewSession} />

                            <div className="notification-input-wrapper">
                                <textarea className="notification-input" placeholder={t("booking.pre.rejectReasonPlaceholder")} />
                            </div>
                            <div className="notification-actions">
                                <button
                                    type="button"
                                    className="primary-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToast(t("booking.approvedToast"));
                                        setIsNotificationExpanded(false);
                                        actions.bookNow();
                                    }}
                                >
                                    {t("booking.pre.approve")}
                                </button>
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToast(t("booking.rejectedToast"));
                                        setIsNotificationExpanded(false);
                                    }}
                                >
                                    {t("booking.pre.reject")}
                                </button>
                            </div>
                        </div>
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

                    <section className="section-stack booking-slot-section">
                        <div className="section-head">
                            <h2 className="section-title-sm">{t("booking.pre.availabilityTitle")}</h2>
                        </div>
                        <p className="muted-text booking-slot-caption">{t("booking.pre.selectionHint")}</p>
                        <div
                            className={`slot-strip-outer ${stripFog.left ? "slot-strip-outer--left" : ""} ${stripFog.right ? "slot-strip-outer--right" : ""}`}
                        >
                            <span className="slot-strip-fog slot-strip-fog--left" aria-hidden="true" />
                            <span className="slot-strip-fog slot-strip-fog--right" aria-hidden="true" />
                            <span className="slot-strip-nudge slot-strip-nudge--left" aria-hidden="true">
                                ‹
                            </span>
                            <span className="slot-strip-nudge slot-strip-nudge--right" aria-hidden="true">
                                ›
                            </span>
                            <div
                                ref={slotStripRef}
                                className="booking-slot-grid"
                                role="list"
                                aria-label={t("booking.pre.slotPickerAria")}
                            >
                                {ALL_SLOTS.map((slot) => {
                                    const open = openSlotsForDay.has(slot.id);
                                    const selected = state.selectedCourseAssetId === slot.id;
                                    return (
                                        <button
                                            key={slot.id}
                                            type="button"
                                            role="listitem"
                                            disabled={!open}
                                            className={`booking-slot-box ${open ? "booking-slot-box--open" : "booking-slot-box--closed"} ${selected ? "booking-slot-box--selected" : ""}`}
                                            onClick={() => handlePickSlot(slot.id)}
                                        >
                                            {(() => {
                                                const [start, end] = slot.range.split("–");
                                                return (
                                                    <>
                                                        <span className="booking-slot-time-start">{start}</span>
                                                        <span className="booking-slot-time-divider" />
                                                        <span className="booking-slot-time-end">{end}</span>
                                                    </>
                                                );
                                            })()}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <button
                        type="button"
                        disabled={!state.selectedCourseAssetId}
                        className={`cta-banner${!state.selectedCourseAssetId ? " cta-banner--disabled" : ""}`}
                        style={{ marginTop: "16px" }}
                        onClick={() => {
                            if (state.selectedCourseAssetId) {
                                onOpenBookingModal();
                            }
                        }}
                    >
                        <h3 className="booking-pre-cta-line">
                            {state.selectedCourseAssetId && selectedSlot
                                ? `${t("booking.pre.ctaTitle")} ${t("booking.pre.ctaAppointmentTime", {
                                    day: selectedSchedule.day,
                                    range: selectedSlot.range,
                                })}`
                                : t("booking.pre.selectSlotFirst")}
                        </h3>
                    </button>

                    <article className="panel panel-elevated my-coach-card section-stack section-bottom-gap" style={{ marginTop: "24px" }}>
                        <div className="section-head">
                            <h2 className="section-title-sm">{t("club.coachCard.title")}</h2>
                            <span className="pill">{t("club.coachCard.status")}</span>
                        </div>
                        <div className="my-coach-info" style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
                            <div
                                className="avatar my-coach-avatar"
                                style={{
                                    width: "64px",
                                    height: "64px",
                                    fontSize: "20px",
                                    flexShrink: 0,
                                    backgroundImage: coachInfoCard.avatarUrl ? `url(${coachInfoCard.avatarUrl})` : "none",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    color: coachInfoCard.avatarUrl ? "transparent" : "inherit",
                                }}
                            >
                                {!coachInfoCard.avatarUrl && coachInfoCard.initials}
                            </div>
                            <div className="my-coach-details">
                                <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "var(--on-surface)" }}>{coachInfoCard.name}</h3>
                                <p style={{ margin: "0 0 8px", fontSize: "13px", color: "var(--tertiary)" }}>{t("booking.pre.coachTitle", { defaultValue: coachInfoCard.title })}</p>
                                <div style={{ display: "grid", gap: "6px", fontSize: "12px" }}>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        <span style={{ color: "var(--outline)" }}>{t("club.coachCard.contact")}</span>
                                        <span style={{ color: "var(--on-surface)" }}>{coachInfoCard.phone}</span>
                                    </div>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        <span style={{ color: "var(--outline)" }}>{t("club.coachCard.bestScore")}</span>
                                        <span style={{ color: "var(--primary)" }}>{t("club.coachCard.bestScoreValue")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </>
            ) : (
                <>
                    {showPostEmpty ? (
                        <article className="panel panel-elevated booking-post-empty">
                            <p className="section-title-sm">{t("booking.post.emptyTitle")}</p>
                            <p className="muted-text">{t("booking.post.emptyHint")}</p>
                            <button
                                type="button"
                                className="btn-primary wide"
                                style={{ marginTop: "16px" }}
                                onClick={() => actions.setBookingStatus("pre")}
                            >
                                {t("booking.post.goBook")}
                            </button>
                        </article>
                    ) : null}

                    {showPostList ? (
                        <section className="section-stack booking-post-list">
                            <div className="section-head">
                                <h2 className="section-title-sm">{t("booking.post.listTitle")}</h2>
                                <span className="pill">{t("booking.post.listCount", { count: sortedBookings.length })}</span>
                            </div>
                            <ul className="booking-post-card-list" role="list">
                                {sortedBookings.map((b) => {
                                    const cardSession = getSessionDisplay(b.day, b.courseAssetId);
                                    const slot = getSlotById(b.courseAssetId);
                                    const coachEdited = b.courseConfirmedByCoach !== false;
                                    const courseLabel = coachEdited
                                        ? cardSession?.courseAssetId
                                            ? t(`courseAssets.${cardSession.courseAssetId}.courseName`, {
                                                  defaultValue: cardSession.courseName,
                                              })
                                            : t(`schedule.${b.day}.courseTitle`, { defaultValue: cardSession?.courseName ?? "—" })
                                        : t("booking.courseTitleUnknown");
                                    const drillLabel = coachEdited
                                        ? cardSession?.courseAssetId
                                            ? t(`courseAssets.${cardSession.courseAssetId}.drill`, { defaultValue: cardSession?.drill ?? "" })
                                            : t("growth.pendingCourseTopic", { defaultValue: cardSession?.drill ?? "" })
                                        : `${t("sessionCourse.drillPrefix")}${t("growth.pendingCourseTopic", { defaultValue: cardSession?.drill ?? "" })}`;
                                    return (
                                        <li key={b.id} role="listitem">
                                            <button
                                                type="button"
                                                className="booking-post-card panel panel-elevated"
                                                onClick={() => actions.setDetailBooking(b.id)}
                                            >
                                                <div className="booking-post-card-top">
                                                    <span className="booking-post-card-date">
                                                        {formatBookingCardDate(b.nextSessionISO, i18n.resolvedLanguage || "zh")}
                                                    </span>
                                                    <span className="booking-post-card-time">{slot?.range ?? "—"}</span>
                                                </div>
                                                <p className="booking-post-card-course">{courseLabel}</p>
                                                <p className="muted-text booking-post-card-drill">{drillLabel}</p>
                                                <span className="booking-post-card-cta">{t("booking.post.openDetail")}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            <p className="muted-text booking-post-list-hint">{t("booking.post.listHint")}</p>
                        </section>
                    ) : null}

                    {showPostDetail ? (
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
                                    <span className="muted-text">
                                        {t("booking.post.bookedAt", {
                                            date: formatSessionTime(detailBooking.nextSessionISO, i18n.resolvedLanguage || "zh"),
                                            time: bookedSlot?.range ?? bookedSchedule.time,
                                        })}
                                    </span>
                                    <span className="pill">{t("booking.post.confirmedDay", { day: bookedSchedule.day })}</span>
                                </div>
                                <p className="muted-text" style={{ marginTop: "8px" }}>
                                    {bookedSlot
                                        ? t("booking.post.bookedSlotOnly", { range: bookedSlot.range })
                                        : t("booking.post.bookedCourse", { name: t("booking.post.unselected") })}
                                </p>
                            </article>

                            {bookedSession ? (
                                <section className="card-gap">
                                    <SessionCourseDetailCard
                                        session={bookedSession}
                                        coachHasEditedCourse={detailBooking.courseConfirmedByCoach !== false}
                                    />
                                </section>
                            ) : null}

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
                                    <p className="muted-text">{t("booking.post.aiSuggestionBody")}</p>
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

                            {bookedCoach ? (
                                <section className="section-stack">
                                    <div className="section-head">
                                        <h2 className="section-title-sm">{t("booking.post.privateCoach")}</h2>
                                        <span className="pill">{bookedCoach.badge}</span>
                                    </div>
                                    <CoachCard coach={bookedCoach} compact />
                                </section>
                            ) : null}
                        </>
                    ) : null}
                </>
            )}
        </section>
    );
}
