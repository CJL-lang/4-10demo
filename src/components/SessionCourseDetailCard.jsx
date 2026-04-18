import { useTranslation } from "react-i18next";

function PhoneIcon() {
    return (
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <path
                d="M5.5 2.5h2.1c.39 0 .73.27.81.65l.54 2.52a.84.84 0 0 1-.24.8L7.3 7.9a11.47 11.47 0 0 0 4.8 4.8l1.43-1.42a.84.84 0 0 1 .8-.24l2.52.54c.38.08.65.42.65.81v2.11c0 .46-.37.84-.84.84h-.41C8.93 16.34 3.66 11.07 3.66 4.75v-.41c0-.47.38-.84.84-.84Z"
                fill="currentColor"
            />
        </svg>
    );
}

function TrophyIcon() {
    return (
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <path
                d="M6.67 2.5h6.66v1.25h1.67a.84.84 0 0 1 .83.83v1.25a3.33 3.33 0 0 1-2.91 3.3 4.16 4.16 0 0 1-2.09 2.17v2.03h2.08a.83.83 0 1 1 0 1.67H7.08a.83.83 0 1 1 0-1.67h2.09V11.3A4.16 4.16 0 0 1 7.08 9.13a3.33 3.33 0 0 1-2.91-3.3V4.58c0-.46.37-.83.83-.83h1.67V2.5Zm7.5 2.92h-.84v1.25c0 .28-.03.56-.08.82a1.67 1.67 0 0 0 .92-1.5V5.42Zm-8.34 0H5v.57c0 .68.39 1.27.92 1.56a4.2 4.2 0 0 1-.09-.89V5.42Z"
                fill="currentColor"
            />
        </svg>
    );
}

/**
 * 与预约通知内课程卡片同一结构，供「预约后教练区」「课后评价」复用。
 * @param {boolean} [coachHasEditedCourse=true] 为 false 时课程名为「未知」，副标题与预约前「待教练确认」一致。
 */
export default function SessionCourseDetailCard({
    session,
    className = "",
    coachHasEditedCourse = true,
    metaBeforeCoach = null,
}) {
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
            {metaBeforeCoach ? (
                <>
                    <div className="session-course-detail-meta-slot">{metaBeforeCoach}</div>
                    <div className="session-course-detail-divider" aria-hidden="true" />
                </>
            ) : null}
            <div className="session-course-detail-coach">
                <img src={session.avatarUrl} alt="" className="session-course-detail-avatar" width={44} height={44} />
                <div className="session-course-detail-coach-text">
                    <div className="session-course-detail-name-row">
                        <h3 className="session-course-detail-name">{session.coachName}</h3>
                        <span className="session-course-detail-coach-title">{session.coachTitle}</span>
                    </div>
                    <div className="session-course-detail-extras">
                        <span className="session-course-detail-extra-item">
                            <span className="session-course-detail-extra-icon">
                                <PhoneIcon />
                            </span>
                            <span>{session.phone}</span>
                        </span>
                        <span className="session-course-detail-extra-item">
                            <span className="session-course-detail-extra-icon">
                                <TrophyIcon />
                            </span>
                            <span>
                                {t("sessionCourse.bestTeam", { value: session.bestScoreShort })}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
