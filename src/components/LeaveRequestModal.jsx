import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

/** Must match app.css: .modal-mask--closing { animation: maskFadeOut … 200ms } (+ buffer). */
const CLOSE_UNMOUNT_MS = 240;

function getScrollMainEl() {
    if (typeof document === "undefined") return null;
    return document.querySelector("main.scroll-main");
}

export default function LeaveRequestModal({ open, sessionSummary, onCancel, onConfirm, onClosed }) {
    const { t } = useTranslation();
    const [rendered, setRendered] = useState(open);
    const [reason, setReason] = useState("");
    const [mainEl, setMainEl] = useState(getScrollMainEl);
    const onClosedRef = useRef(onClosed);

    useLayoutEffect(() => {
        if (!mainEl) setMainEl(getScrollMainEl());
    }, [mainEl]);

    useEffect(() => {
        onClosedRef.current = onClosed;
    });

    useEffect(() => {
        if (open) setRendered(true);
    }, [open]);

    useEffect(() => {
        if (open) setReason("");
    }, [open]);

    /**
     * Inner `.modal-card` also animates on close; its `animationend` bubbles with `target !==` mask,
     * so relying on mask `animationend` often never unmounts — overlay stays dimming the screen.
     * Unmount after the close animation duration instead.
     */
    useEffect(() => {
        if (open || !rendered) return undefined;
        const id = window.setTimeout(() => {
            setRendered(false);
            onClosedRef.current?.();
        }, CLOSE_UNMOUNT_MS);
        return () => window.clearTimeout(id);
    }, [open, rendered]);

    if (!rendered) return null;

    const handleSend = () => {
        const trimmed = reason.trim();
        if (!trimmed) return;
        onConfirm(trimmed);
    };

    const mask = (
        <div
            className={`modal-mask modal-mask--main-portal${open ? "" : " modal-mask--closing"}`}
            onClick={onCancel}
        >
            <section className="modal-card leave-request-modal" onClick={(event) => event.stopPropagation()}>
                <h3>{t("booking.post.leaveModalTitle")}</h3>
                <p>{t("booking.post.leaveModalDesc")}</p>
                {sessionSummary ? (
                    <div className="booking-confirm-meta" role="status" aria-live="polite">
                        <div className="booking-confirm-row">
                            <span>{t("booking.post.leaveModalSessionDate")}</span>
                            <strong>{sessionSummary.dateLine}</strong>
                        </div>
                        <div className="booking-confirm-row">
                            <span>{t("booking.post.leaveModalSessionSlot")}</span>
                            <strong>{sessionSummary.slotRange}</strong>
                        </div>
                    </div>
                ) : null}
                <label className="leave-request-label" htmlFor="leave-reason-input">
                    {t("booking.post.leaveModalReasonLabel")}
                </label>
                <textarea
                    id="leave-reason-input"
                    className="notification-input leave-request-textarea"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={t("booking.post.leaveModalReasonPlaceholder")}
                    rows={4}
                    autoComplete="off"
                />
                <div className="modal-actions">
                    <button type="button" className="btn-ghost" onClick={onCancel}>
                        {t("booking.post.leaveModalCancel")}
                    </button>
                    <button type="button" className="btn-primary" disabled={!reason.trim()} onClick={handleSend}>
                        {t("booking.post.leaveModalSend")}
                    </button>
                </div>
            </section>
        </div>
    );

    if (mainEl) {
        return createPortal(mask, mainEl);
    }

    return mask;
}
