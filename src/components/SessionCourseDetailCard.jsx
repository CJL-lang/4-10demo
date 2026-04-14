import { useTranslation } from "react-i18next";

/**
 * 与预约通知内课程卡片同一结构，供「预约后教练区」「课后互评」复用。
 * @param {boolean} [coachHasEditedCourse=true] 为 false 时课程名为「未知」，副标题与预约前「待教练确认」一致。
 */
export default function SessionCourseDetailCard({ session, className = "", coachHasEditedCourse = true }) {
    const { t } = useTranslation();

    if (!session?.courseName) {
        return (
            <div className={`session-course-detail-card session-course-detail-card--empty ${className}`.trim()}>
                <p className="muted-text">{t("sessionCourse.emptyHint")}</p>
            </div>
        );
    }

    const badgeTime = String(session.range || "").replace(/[\u2013\u2014]/g, "-");

    const courseTitle = coachHasEditedCourse
        ? session.courseAssetId != null
            ? t(`courseAssets.${session.courseAssetId}.courseName`, { defaultValue: session.courseName })
            : t(`schedule.${session.scheduleDay}.courseTitle`, { defaultValue: session.courseName })
        : t("booking.courseTitleUnknown");

    const drillText = coachHasEditedCourse
        ? session.courseAssetId != null
            ? t(`courseAssets.${session.courseAssetId}.drill`, { defaultValue: session.drill })
            : t("growth.pendingCourseTopic", { defaultValue: session.drill })
        : t("growth.pendingCourseTopic", { defaultValue: session.drill });

    return (
        <div className={`session-course-detail-card ${className}`.trim()}>
            <div className="session-course-detail-head">
                <div>
                    <h4 className="session-course-detail-title">{courseTitle}</h4>
                    <p className="session-course-detail-sub">
                        {t("sessionCourse.drillPrefix")}
                        {drillText}
                    </p>
                </div>
                <span className="session-course-detail-time-badge">{badgeTime}</span>
            </div>
            <div className="session-course-detail-divider" aria-hidden="true" />
            <div className="session-course-detail-coach">
                <img src={session.avatarUrl} alt="" className="session-course-detail-avatar" width={44} height={44} />
                <div className="session-course-detail-coach-text">
                    <div className="session-course-detail-name-row">
                        <h3 className="session-course-detail-name">{session.coachName}</h3>
                        <span className="session-course-detail-coach-title">{session.coachTitle}</span>
                    </div>
                    <div className="session-course-detail-extras">
                        <span>📞 {session.phone}</span>
                        <span>
                            🏆 {t("sessionCourse.bestTeam", { value: session.bestScoreShort })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
