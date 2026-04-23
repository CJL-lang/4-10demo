import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import DateChip from "./DateChip";
import { ALL_SLOTS, openSlotsByDate, scheduleDates } from "../data/mockData";

/** Must match app.css: .modal-mask--closing { animation: maskFadeOut … 200ms } (+ buffer). */
const CLOSE_UNMOUNT_MS = 240;

function getDeviceShellEl() {
    if (typeof document === "undefined") return null;
    return document.querySelector(".device-shell");
}

export default function RescheduleModal({ open, initialDay, initialSlotId, onCancel, onConfirm, onClosed }) {
    const { t } = useTranslation();
    const [rendered, setRendered] = useState(open);
    const [shellEl, setShellEl] = useState(getDeviceShellEl);
    const onClosedRef = useRef(onClosed);
    const [pendingDay, setPendingDay] = useState(() => initialDay ?? scheduleDates[0].day);
    const [pendingSlotId, setPendingSlotId] = useState(initialSlotId ?? null);
    const [reason, setReason] = useState("");
    const slotStripRef = useRef(null);
    const [stripFog, setStripFog] = useState({ left: false, right: false });

    useLayoutEffect(() => {
        if (!shellEl) setShellEl(getDeviceShellEl());
    }, [shellEl]);

    useEffect(() => {
        onClosedRef.current = onClosed;
    });

    useEffect(() => {
        if (open) setRendered(true);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const day = initialDay != null ? initialDay : scheduleDates[0].day;
        setPendingDay(day);
        const openSet = new Set(openSlotsByDate[day] || []);
        if (initialSlotId && openSet.has(initialSlotId)) {
            setPendingSlotId(initialSlotId);
        } else {
            setPendingSlotId(null);
        }
        setReason("");
    }, [open, initialDay, initialSlotId]);

    useEffect(() => {
        if (open || !rendered) return undefined;
        const id = window.setTimeout(() => {
            setRendered(false);
            onClosedRef.current?.();
        }, CLOSE_UNMOUNT_MS);
        return () => window.clearTimeout(id);
    }, [open, rendered]);

    const openSlotsForDay = useMemo(() => new Set(openSlotsByDate[pendingDay] || []), [pendingDay]);

    useEffect(() => {
        if (!rendered) return undefined;
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
    }, [pendingDay, rendered]);

    const handlePickDate = (day) => {
        setPendingDay(day);
        setPendingSlotId(null);
    };

    const handlePickSlot = (slotId) => {
        if (!openSlotsForDay.has(slotId)) {
            return;
        }
        setPendingSlotId(slotId);
    };

    const canConfirm = Boolean(pendingSlotId && openSlotsForDay.has(pendingSlotId));

    const handleConfirm = () => {
        if (!canConfirm) return;
        onConfirm({ day: pendingDay, slotId: pendingSlotId, reason: reason.trim() });
    };

    if (!rendered) return null;

    const mask = (
        <div
            className={`modal-mask modal-mask--device-portal${open ? "" : " modal-mask--closing"}`}
            onClick={onCancel}
        >
            <section
                className="modal-card reschedule-modal"
                role="dialog"
                aria-modal="true"
                aria-label={t("booking.pre.rescheduleModalTitle")}
                onClick={(event) => event.stopPropagation()}
            >
                <h3>{t("booking.pre.rescheduleModalTitle")}</h3>
                <p className="reschedule-modal__desc">{t("booking.pre.rescheduleModalDesc")}</p>
                <div className="booking-pre reschedule-modal__pickers">
                    <div className="reschedule-modal__section">
                        <h4 className="reschedule-modal__label">{t("booking.pre.scheduleTitle")}</h4>
                        <div className="date-row reschedule-modal__date-row">
                            {scheduleDates.map((item) => (
                                <DateChip key={item.day} item={item} active={pendingDay === item.day} onClick={handlePickDate} />
                            ))}
                        </div>
                    </div>
                    <div className="reschedule-modal__section reschedule-modal__section--slots">
                        <h4 className="reschedule-modal__label">{t("booking.pre.availabilityTitle")}</h4>
                        <p className="muted-text booking-slot-caption reschedule-modal__hint">{t("booking.pre.selectionHint")}</p>
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
                                const openSlot = openSlotsForDay.has(slot.id);
                                const selected = pendingSlotId === slot.id;
                                return (
                                    <button
                                        key={slot.id}
                                        type="button"
                                        role="listitem"
                                        disabled={!openSlot}
                                        className={`booking-slot-box ${openSlot ? "booking-slot-box--open" : "booking-slot-box--closed"} ${selected ? "booking-slot-box--selected" : ""}`}
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
                </div>
                </div>
                <div className="reschedule-modal__reason">
                    <label className="reschedule-modal__reason-label" htmlFor="reschedule-reason-input">
                        {t("booking.pre.rescheduleModalReasonLabel")}
                    </label>
                    <textarea
                        id="reschedule-reason-input"
                        className="notification-input reschedule-modal__reason-input"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={t("booking.pre.rescheduleModalReasonPlaceholder")}
                        rows={3}
                        autoComplete="off"
                    />
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn-ghost" onClick={onCancel}>
                        {t("booking.pre.rescheduleModalCancel")}
                    </button>
                    <button type="button" className="btn-primary" disabled={!canConfirm} onClick={handleConfirm}>
                        {t("booking.pre.rescheduleModalConfirm")}
                    </button>
                </div>
            </section>
        </div>
    );

    if (shellEl) {
        return createPortal(mask, shellEl);
    }

    return mask;
}
