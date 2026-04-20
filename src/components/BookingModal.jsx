import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CLOSE_UNMOUNT_MS = 240;

export default function BookingModal({ open, onConfirm, onCancel, bookingPreview }) {
    const { t } = useTranslation();
    const [rendered, setRendered] = useState(open);

    useEffect(() => {
        if (open) setRendered(true);
    }, [open]);

    useEffect(() => {
        if (open || !rendered) return undefined;
        const id = window.setTimeout(() => setRendered(false), CLOSE_UNMOUNT_MS);
        return () => window.clearTimeout(id);
    }, [open, rendered]);

    if (!rendered) return null;

    return (
        <div
            className={`modal-mask${open ? "" : " modal-mask--closing"}`}
            onClick={onCancel}
        >
            <section className="modal-card" onClick={(event) => event.stopPropagation()}>
                <h3>{t("booking.modal.title")}</h3>
                <p>{t("booking.modal.desc")}</p>
                <div className="booking-confirm-meta" role="status" aria-live="polite">
                    <div className="booking-confirm-row">
                        <span>{t("booking.modal.slot")}</span>
                        <strong>
                            {bookingPreview?.day}
                            {t("booking.modal.daySuffix")} · {bookingPreview?.slot}
                        </strong>
                    </div>
                    <div className="booking-confirm-row">
                        <span>{t("booking.modal.topic")}</span>
                        <strong>{bookingPreview?.courseTitle}</strong>
                    </div>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn-ghost" onClick={onCancel}>
                        {t("booking.modal.cancel")}
                    </button>
                    <button type="button" className="btn-primary" onClick={onConfirm}>
                        {t("booking.modal.confirm")}
                    </button>
                </div>
            </section>
        </div>
    );
}
