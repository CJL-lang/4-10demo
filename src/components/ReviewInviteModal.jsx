import { useTranslation } from "react-i18next";

export default function ReviewInviteModal({ open, sessionInfo, onCancel, onJoin }) {
    const { t } = useTranslation();

    if (!open) {
        return null;
    }

    return (
        <div className="modal-mask" onClick={onCancel}>
            <section className="modal-card review-invite-modal" onClick={(event) => event.stopPropagation()}>
                <header className="review-remind-head">
                    <div className="review-remind-icon" aria-hidden="true">
                        ✓
                    </div>
                    <div>
                        <p className="small-label">{t("booking.reviewInvite.label")}</p>
                        <h3>{t("booking.reviewInvite.title")}</h3>
                    </div>
                </header>

                <p className="review-remind-desc">{t("booking.reviewInvite.desc")}</p>

                <div className="review-remind-grid">
                    <div className="review-remind-item">
                        <span>{t("booking.reviewInvite.courseTopic")}</span>
                        <strong>{sessionInfo?.courseTitle || "-"}</strong>
                    </div>
                    <div className="review-remind-item">
                        <span>{t("booking.reviewInvite.courseContent")}</span>
                        <strong>{sessionInfo?.courseAsset || "-"}</strong>
                    </div>
                    <div className="review-remind-item">
                        <span>{t("booking.reviewInvite.coachInfo")}</span>
                        <strong>{sessionInfo?.coachName || "-"}</strong>
                    </div>
                    <div className="review-remind-item">
                        <span>{t("booking.reviewInvite.sessionTime")}</span>
                        <strong>{sessionInfo?.dateLabel || "-"}</strong>
                    </div>
                </div>

                <p className="review-remind-note">{t("booking.reviewInvite.note")}</p>

                <div className="modal-actions review-invite-actions">
                    <button type="button" className="btn-ghost" onClick={onCancel}>
                        {t("booking.reviewInvite.later")}
                    </button>
                    <button type="button" className="btn-primary" onClick={onJoin}>
                        {t("booking.reviewInvite.join")}
                    </button>
                </div>
            </section>
        </div>
    );
}
