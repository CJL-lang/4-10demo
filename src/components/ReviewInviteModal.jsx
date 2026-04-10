export default function ReviewInviteModal({ open, sessionInfo, onCancel, onJoin }) {
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
                        <p className="small-label">课程提醒</p>
                        <h3>课程结束，去完成课后评价</h3>
                    </div>
                </header>

                <p className="review-remind-desc">请为刚才课程打分并补充评价，帮助教练及时优化你的下节训练安排。</p>

                <div className="review-remind-grid">
                    <div className="review-remind-item">
                        <span>课程主题</span>
                        <strong>{sessionInfo?.courseTitle || "-"}</strong>
                    </div>
                    <div className="review-remind-item">
                        <span>课程内容</span>
                        <strong>{sessionInfo?.courseAsset || "-"}</strong>
                    </div>
                    <div className="review-remind-item">
                        <span>教练信息</span>
                        <strong>{sessionInfo?.coachName || "-"}</strong>
                    </div>
                    <div className="review-remind-item">
                        <span>上课时间</span>
                        <strong>{sessionInfo?.dateLabel || "-"}</strong>
                    </div>
                </div>

                <p className="review-remind-note">完成评价后将同步到你的进度记录中。</p>

                <div className="modal-actions review-invite-actions">
                    <button type="button" className="btn-ghost" onClick={onCancel}>
                        稍后评价
                    </button>
                    <button type="button" className="btn-primary" onClick={onJoin}>
                        加入评价
                    </button>
                </div>
            </section>
        </div>
    );
}
