import { useTranslation } from "react-i18next";

export default function BookingModal({ open, onConfirm, onCancel, bookingPreview }) {
    const { t } = useTranslation();

    if (!open) {
        return null;
    }

    return (
        <div className="modal-mask" onClick={onCancel}>
            <section className="modal-card" onClick={(event) => event.stopPropagation()}>
                <h3>{t("booking.modal.title")}</h3>
                <p>{t("booking.modal.desc")}</p>
                <div className="booking-confirm-meta" role="status" aria-live="polite">
                    <div className="booking-confirm-row">
                        <span>{t("booking.modal.slot")}</span>
                        <strong>{bookingPreview?.day}号 · {bookingPreview?.slot}</strong>
                    </div>
                    <div className="booking-confirm-row">
                        <span>{t("booking.modal.topic")}</span>
                        <strong>{bookingPreview?.courseTitle}</strong>
                    </div>
                    <div className="booking-confirm-row">
                        <span>{t("booking.modal.asset")}</span>
                        <strong>{bookingPreview?.selectedCourseAsset || t("booking.modal.autoAssign")}</strong>
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
