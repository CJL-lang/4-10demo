export default function BookingModal({ open, onConfirm, onCancel, bookingPreview }) {
    if (!open) {
        return null;
    }

    return (
        <div className="modal-mask" onClick={onCancel}>
            <section className="modal-card" onClick={(event) => event.stopPropagation()}>
                <h3>确认预约本周课程？</h3>
                <p>预约后将自动生成上课核销码，并切换到预约后状态。</p>
                <div className="booking-confirm-meta" role="status" aria-live="polite">
                    <div className="booking-confirm-row">
                        <span>训练档期</span>
                        <strong>{bookingPreview?.day}号 · {bookingPreview?.slot}</strong>
                    </div>
                    <div className="booking-confirm-row">
                        <span>课程主题</span>
                        <strong>{bookingPreview?.courseTitle}</strong>
                    </div>
                    <div className="booking-confirm-row">
                        <span>课程资产</span>
                        <strong>{bookingPreview?.selectedCourseAsset || "系统自动分配"}</strong>
                    </div>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn-ghost" onClick={onCancel}>
                        再想想
                    </button>
                    <button type="button" className="btn-primary" onClick={onConfirm}>
                        确认预约
                    </button>
                </div>
            </section>
        </div>
    );
}
