import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import StarRating from "../components/StarRating";
import RecordReportMediaPlaceholder from "../components/RecordReportMediaPlaceholder";
import { growthViewItems, practiceTasks, ratingLabels, records } from "../data/mockData";
import { useAppContext } from "../context/AppContext";

function RatingGroup({ name, value, onChange, label }) {
    return (
        <div className="rating-group">
            <div className="rating-head">
                <h3>{name}</h3>
                <span>{label}</span>
            </div>
            <StarRating value={value} onChange={onChange} />
        </div>
    );
}

function LiveFeedTypeIcon({ type }) {
    if (type === "image") {
        return (
            <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                <path
                    d="M4 4.25A1.75 1.75 0 0 1 5.75 2.5h8.5A1.75 1.75 0 0 1 16 4.25v11.5a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 4 15.75V4.25Zm1.5 0v8.46l2.56-2.55a.75.75 0 0 1 1.06 0l1.38 1.38 2.44-2.44a.75.75 0 0 1 1.06 0l.5.5V4.25a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm0 10.89v.61c0 .14.11.25.25.25h8.5a.25.25 0 0 0 .25-.25v-4.03l-1.28-1.28-2.44 2.44a.75.75 0 0 1-1.06 0l-1.38-1.38-3.09 3.04ZM8 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
                    fill="currentColor"
                />
            </svg>
        );
    }
    if (type === "video") {
        return (
            <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                <path
                    d="M4.75 3.5A1.75 1.75 0 0 0 3 5.25v9.5c0 .97.78 1.75 1.75 1.75h7.5A1.75 1.75 0 0 0 14 14.75v-2.02l2.1 1.4a.75.75 0 0 0 1.16-.62V6.49a.75.75 0 0 0-1.16-.62L14 7.27V5.25a1.75 1.75 0 0 0-1.75-1.75h-7.5Zm3.87 3.66a.75.75 0 0 1 1.13-.64l2.78 1.7a.75.75 0 0 1 0 1.28l-2.78 1.7a.75.75 0 0 1-1.13-.64V7.16Z"
                    fill="currentColor"
                />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
            <path
                d="M5 3.25A2.25 2.25 0 0 0 2.75 5.5v6A2.25 2.25 0 0 0 5 13.75h1.86l2.54 2.12a.75.75 0 0 0 1.23-.58v-1.54H15a2.25 2.25 0 0 0 2.25-2.25v-6A2.25 2.25 0 0 0 15 3.25H5Z"
                fill="currentColor"
            />
        </svg>
    );
}

function taskCardCopy(task, langIsEn) {
    return {
        date: langIsEn && task.sessionDateEn ? task.sessionDateEn : task.sessionDate,
        title: langIsEn && task.titleEn ? task.titleEn : task.title,
        drill: langIsEn && task.drillTopicEn ? task.drillTopicEn : task.drillTopic,
        note: langIsEn && task.coachNoteEn ? task.coachNoteEn : task.coachNote,
    };
}

function GrowthSessionCard({ task, variant, onOpen }) {
    const { t, i18n } = useTranslation();
    const langIsEn = Boolean(i18n.language?.toLowerCase().startsWith("en"));
    const copy = taskCardCopy(task, langIsEn);
    const skillLabel = task.difficulty || t("growth.skillPill");
    const coachRole = t("growth.coachRoleLead");

    return (
        <article className={`panel panel-low growth-session-card ${task.done ? "growth-session-card--done" : ""}`}>
            <div className="growth-session-card__meta">
                <span className="growth-session-card__date">{copy.date}</span>
                <span className="growth-session-card__time">{task.sessionTime}</span>
            </div>
            <div className="growth-session-card__head">
                <h3 className="growth-session-card__title">{copy.title}</h3>
                <span className="growth-session-card__pill">{skillLabel}</span>
            </div>
            <p className="growth-session-card__drill">{copy.drill}</p>
            <div className="growth-session-card__coach">
                <img className="growth-session-card__avatar" src={task.avatarUrl} alt="" />
                <div className="growth-session-card__coach-text">
                    <span className="growth-session-card__coach-role">{coachRole}</span>
                    <span className="growth-session-card__coach-name">{task.coach}</span>
                </div>
            </div>
            <p className="growth-session-card__note">{copy.note}</p>
            <button type="button" className="growth-session-card__cta" onClick={() => onOpen(task.id)}>
                {variant === "homework" ? t("growth.viewHomework") : t("growth.viewReport")}
            </button>
        </article>
    );
}

export default function GrowthPage({ onSubmit, onToast, onDetailPageChange, reviewSessionInfo }) {
    const { t, i18n } = useTranslation();
    const { state, actions } = useAppContext();
    const videoInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [activeReportTaskId, setActiveReportTaskId] = useState(null);
    const [homeworkDraft, setHomeworkDraft] = useState({
        videoFileName: "",
        textNote: "",
        voiceFileName: "",
    });

    const tasks = useMemo(
        () =>
            practiceTasks.map((task) => {
                const done = Boolean(state.taskDoneMap[task.id]);
                return {
                    ...task,
                    done,
                    progress: done ? 100 : task.progress,
                };
            }),
        [state.taskDoneMap]
    );

    const activeTask = useMemo(
        () => tasks.find((task) => task.id === activeTaskId) || null,
        [tasks, activeTaskId]
    );

    const activeReportTask = useMemo(
        () => tasks.find((task) => task.id === activeReportTaskId) || null,
        [tasks, activeReportTaskId]
    );

    const recordForReport = useMemo(() => {
        if (!activeReportTask?.recordId) {
            return null;
        }
        return records.find((r) => r.id === activeReportTask.recordId) || null;
    }, [activeReportTask]);

    const canSubmitHomework =
        Boolean(homeworkDraft.videoFileName) &&
        (homeworkDraft.textNote.trim().length > 0 || Boolean(homeworkDraft.voiceFileName));

    const homeworkDetailMode = state.growthView === "tasks" && Boolean(activeTask);
    const reportDetailMode = state.growthView === "report" && Boolean(activeReportTask);
    const hideSubnavChrome = homeworkDetailMode || reportDetailMode;

    const taskGroups = useMemo(
        () => ({
            pending: tasks.filter((task) => !task.done),
            completed: tasks.filter((task) => task.done),
        }),
        [tasks]
    );

    useEffect(() => {
        onDetailPageChange?.(hideSubnavChrome);
        return () => {
            onDetailPageChange?.(false);
        };
    }, [hideSubnavChrome, onDetailPageChange]);

    useEffect(() => {
        const scrollMain = document.querySelector(".scroll-main");
        if (scrollMain) {
            scrollMain.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [hideSubnavChrome, state.growthView]);

    useEffect(() => {
        const tid = state.pendingHomeworkTaskId;
        if (!tid) {
            return;
        }
        actions.setGrowthView("tasks");
        setActiveTaskId(tid);
        setActiveReportTaskId(null);
        actions.setPendingHomeworkTask(null);
    }, [state.pendingHomeworkTaskId, actions]);

    useEffect(() => {
        const tid = state.pendingReportTaskId;
        if (!tid) {
            return;
        }
        actions.setGrowthView("report");
        setActiveTaskId(null);
        setActiveReportTaskId(tid);
        actions.setPendingReportTask(null);
    }, [state.pendingReportTaskId, actions]);

    const openTaskDetail = (taskId) => {
        setActiveTaskId(taskId);
        setHomeworkDraft({
            videoFileName: "",
            textNote: "",
            voiceFileName: "",
        });
    };

    const closeTaskDetail = () => {
        setActiveTaskId(null);
    };

    const backToRecordsIfNeeded = () => {
        if (state.resumeProfileSubView === "records") {
            actions.setTab("profile");
            return true;
        }
        return false;
    };

    const closeReportDetail = () => {
        if (backToRecordsIfNeeded()) {
            return;
        }
        setActiveReportTaskId(null);
    };

    const handleSubmitHomework = () => {
        if (!activeTask) {
            return;
        }

        if (!homeworkDraft.videoFileName) {
            onToast?.(t("growth.uploadVideoToast"));
            return;
        }

        if (!homeworkDraft.textNote.trim() && !homeworkDraft.voiceFileName) {
            onToast?.(t("growth.addReflectionToast"));
            return;
        }

        actions.setTaskDone(activeTask.id, true);
        closeTaskDetail();
        onToast?.(t("growth.submitToast"));
    };

    const renderGrowthSessionList = (list, variant) => (
        <div className="growth-session-list">
            {list.map((task) => (
                <GrowthSessionCard key={task.id} task={task} variant={variant} onOpen={variant === "homework" ? openTaskDetail : setActiveReportTaskId} />
            ))}
        </div>
    );

    const renderHomeworkSection = (titleKey, list, emptyKey) => (
        <section className="section-stack" key={titleKey}>
            <div className="section-head">
                <h2 className="section-title-sm">{t(titleKey)}</h2>
                <span className="tiny-text">{t("growth.countItems", { count: list.length })}</span>
            </div>
            {list.length === 0 ? (
                <article className="panel panel-low task-empty-card">
                    <p className="muted-text">{t(emptyKey)}</p>
                </article>
            ) : (
                renderGrowthSessionList(list, "homework")
            )}
        </section>
    );

    const renderTaskView = () => (
        <>
            {renderHomeworkSection("growth.pendingHomework", taskGroups.pending, "growth.emptyPendingHomework")}
            {renderHomeworkSection("growth.completedHomework", taskGroups.completed, "growth.emptyCompletedHomework")}
            <div className="section-bottom-gap" />
        </>
    );

    const renderTaskDetailView = (task) => {
        return (
            <section className="section-stack section-bottom-gap homework-detail-wrap swing-3d-enter">
                <article className="panel panel-elevated homework-brief-card">
                    <div className="homework-detail-topbar">
                        <button type="button" className="icon-btn homework-back-btn" aria-label={t("growth.backToHomeworkList")} onClick={closeTaskDetail}>
                            ←
                        </button>
                        <h2 className="section-title-sm homework-detail-topbar-heading">{t("growth.tasks")}</h2>
                    </div>
                    <div className="homework-hero">
                        <h3 className="homework-task-title">{task.title}</h3>
                    </div>
                    <div className="homework-meta-grid">
                        <div className="homework-meta-card homework-meta-card--publish">
                            <span className="homework-meta-label">{t("growth.publishTime")}</span>
                            <strong>{task.publishTime}</strong>
                        </div>
                        <div className="homework-meta-card homework-meta-card--deadline">
                            <span className="homework-meta-label">{t("growth.deadline")}</span>
                            <strong>{task.deadline}</strong>
                        </div>
                    </div>

                    <div className="homework-project-info">
                        <section className="homework-detail-block">
                            <div className="homework-block-head">
                                <h4 className="homework-block-title">{t("growth.projectItems")}</h4>
                                <span className="pill">{t("growth.projectCount", { count: task.projectItems?.length ?? 0 })}</span>
                            </div>
                            <ul className="homework-checklist">
                                {task.projectItems?.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="homework-detail-block">
                            <div className="homework-block-head">
                                <h4 className="homework-block-title">{t("growth.projectRequirements")}</h4>
                            </div>
                            <p className="homework-requirement-text">{task.projectRequirements}</p>
                        </section>
                    </div>
                </article>

                <article className="panel panel-low homework-submit-card">
                    <div className="submit-header">
                        <h2 className="submit-title">{t("growth.deliveryTitle")}</h2>
                    </div>

                    <div className="submit-actions-grid">
                        <button type="button" className={`submit-action-btn ${homeworkDraft.videoFileName ? "active" : ""}`} onClick={() => videoInputRef.current?.click()}>
                            <span className="action-icon">🎥</span>
                            <span className="action-label">
                                {t("growth.uploadVideo")}
                                <span className="req-star">*</span>
                            </span>
                            <span className="action-status">{homeworkDraft.videoFileName ? t("growth.selected") : t("growth.goShoot")}</span>
                        </button>

                        <button type="button" className={`submit-action-btn ${homeworkDraft.voiceFileName ? "active" : ""}`} onClick={() => audioInputRef.current?.click()}>
                            <span className="action-icon">🎙️</span>
                            <span className="action-label">{t("growth.voiceReflection")}</span>
                            <span className="action-status">{homeworkDraft.voiceFileName ? t("growth.recorded") : t("growth.goRecord")}</span>
                        </button>
                    </div>

                    <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        capture="environment"
                        hidden
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            setHomeworkDraft((prev) => ({
                                ...prev,
                                videoFileName: file?.name || "",
                            }));
                            event.target.value = "";
                        }}
                    />
                    <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        capture
                        hidden
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            setHomeworkDraft((prev) => ({
                                ...prev,
                                voiceFileName: file?.name || "",
                            }));
                            event.target.value = "";
                        }}
                    />

                    <div className="submit-text-area">
                        <textarea
                            className="homework-textarea sleek-textarea"
                            placeholder={t("growth.textareaPlaceholder")}
                            value={homeworkDraft.textNote}
                            onChange={(event) => {
                                setHomeworkDraft((prev) => ({
                                    ...prev,
                                    textNote: event.target.value,
                                }));
                            }}
                        />
                    </div>

                    <div className="submit-footer">
                        <p className="submit-req-hint">{t("growth.submitHint")}</p>
                        <button type="button" className="btn-submit-action" disabled={!canSubmitHomework} onClick={handleSubmitHomework}>
                            {canSubmitHomework ? t("growth.submitReady") : t("growth.submitDisabled")}
                        </button>
                    </div>
                </article>
            </section>
        );
    };

    const renderReportDetailView = (task) => {
        const langIsEn = Boolean(i18n.language?.toLowerCase().startsWith("en"));
        const copy = taskCardCopy(task, langIsEn);
        const body = recordForReport?.coachReview || copy.note;
        const feedItems = recordForReport?.liveFeedEntries || [];
        const getLiveFeedTypeLabel = (type) => {
            if (type === "image") {
                return t("club.liveFeed.typeImage");
            }
            if (type === "video") {
                return t("club.liveFeed.typeVideo");
            }
            return t("club.liveFeed.typeText");
        };

        return (
            <section className="section-stack section-bottom-gap homework-detail-wrap swing-3d-enter">
                <article className="panel panel-elevated homework-brief-card growth-report-detail-card">
                    <div className="homework-detail-topbar">
                        <button type="button" className="icon-btn homework-back-btn" aria-label={t("growth.backToReportList")} onClick={closeReportDetail}>
                            ←
                        </button>
                        <h2 className="section-title-sm homework-detail-topbar-heading">{t("growth.report")}</h2>
                    </div>
                    <header className="growth-report-detail-hero">
                        <h3 className="homework-task-title">{copy.title}</h3>
                    </header>
                    <div className="growth-report-detail-summary">
                        <div className="growth-report-detail-meta">
                            <span>{copy.date}</span>
                            <span className="growth-report-detail-meta__time">{task.sessionTime}</span>
                        </div>
                        <p className="growth-report-detail-drill">{copy.drill}</p>
                    </div>
                    <div className="growth-report-detail-coach-wrap">
                        <div className="growth-session-card__coach growth-report-detail-coach">
                            <img className="growth-session-card__avatar" src={task.avatarUrl} alt="" />
                            <div className="growth-session-card__coach-text">
                                <span className="growth-session-card__coach-role">{t("growth.coachRoleLead")}</span>
                                <span className="growth-session-card__coach-name">{task.coach}</span>
                            </div>
                        </div>
                    </div>
                    <section className="growth-report-detail-review">
                        <h4 className="growth-report-detail-subhead">{t("growth.reportCoachReview")}</h4>
                        <p className="growth-report-detail-body">{body}</p>
                    </section>

                    <section className="growth-report-detail-live" aria-labelledby="growth-report-live-heading">
                        <div className="growth-report-detail-live__head">
                            <h4 id="growth-report-live-heading" className="growth-report-detail-live__title">
                                {t("growth.sessionLiveRecordTitle")}
                            </h4>
                            <span className="growth-report-detail-live__count">{feedItems.length}</span>
                        </div>
                        {feedItems.length > 0 ? (
                            <ul className="growth-report-detail-live__list">
                                {feedItems.map((item, index) => (
                                    <li
                                        key={item.id}
                                        className="growth-report-detail-live__item growth-report-detail-live__item--motion"
                                        style={{
                                            animationDelay: `${780 + index * 110}ms`,
                                        }}
                                    >
                                        <span className="growth-report-detail-live__rail" aria-hidden="true" />
                                        <div className="growth-report-detail-live__body">
                                            <div className="growth-report-detail-live__meta">
                                                <span className="growth-report-detail-live__time">{item.timestamp}</span>
                                                <span className={`growth-report-detail-live__type growth-report-detail-live__type--${item.type}`}>
                                                    <span className="growth-report-detail-live__type-icon" aria-hidden="true">
                                                        <LiveFeedTypeIcon type={item.type} />
                                                    </span>
                                                    {getLiveFeedTypeLabel(item.type)}
                                                </span>
                                                <span className="growth-report-detail-live__coach">{item.coachName}</span>
                                            </div>
                                            {(item.type === "image" || item.type === "video") && (
                                                <div className="growth-report-detail-live__media">
                                                    <RecordReportMediaPlaceholder kind={item.type === "video" ? "video" : "image"} />
                                                </div>
                                            )}
                                            <p className="growth-report-detail-live__text">{item.content}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="growth-report-detail-live__empty">{t("club.liveFeed.empty")}</p>
                        )}
                    </section>
                </article>
            </section>
        );
    };

    const renderReportListView = () => {
        const ordered = [...tasks].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
        return (
            <>
                <section className="section-stack">
                    <div className="section-head">
                        <h2 className="section-title-sm">{t("growth.report")}</h2>
                        <span className="tiny-text">{t("growth.countItems", { count: ordered.length })}</span>
                    </div>
                    {ordered.length === 0 ? (
                        <article className="panel panel-low task-empty-card">
                            <p className="muted-text">{t("growth.emptyReport")}</p>
                        </article>
                    ) : (
                        renderGrowthSessionList(ordered, "report")
                    )}
                </section>
                <div className="section-bottom-gap" />
            </>
        );
    };

    const renderReviewView = () => {
        const coachLabel =
            state.ratings.coach > 0 ? t(`growth.coachRatingLabels.${state.ratings.coach}`) : "—";

        return (
            <article className="panel feedback-panel panel-elevated section-bottom-gap growth-review-panel">
                <header className="feedback-head">
                    <h2 className="headline">{t("growth.reviewHeadline")}</h2>
                    <span className="tag">{t("growth.reviewTag")}</span>
                </header>

                <article className="panel panel-low review-session-card">
                    <div className="review-session-card-top">
                        <div>
                            <p className="small-label">{t("growth.sessionInfo")}</p>
                            <h3>{reviewSessionInfo?.courseName ?? t("growth.sessionSyncing")}</h3>
                        </div>
                        {reviewSessionInfo?.dateLabel ? <span className="pill review-session-time-pill">{reviewSessionInfo.dateLabel}</span> : null}
                    </div>
                    <p className="muted-text">{t("growth.courseTopic", { value: reviewSessionInfo?.drill ?? t("growth.pendingCourseTopic") })}</p>
                    <div className="review-session-divider" aria-hidden="true" />
                    <div className="review-session-coach-row">
                        {reviewSessionInfo?.avatarUrl ? (
                            <img className="review-session-avatar" src={reviewSessionInfo.avatarUrl} alt="" />
                        ) : (
                            <div className="review-session-avatar review-session-avatar--placeholder" aria-hidden="true" />
                        )}
                        <div className="review-session-coach-meta">
                            <span className="review-session-coach-name">{reviewSessionInfo?.coachName || "—"}</span>
                            <span className="muted-text review-session-coach-title">
                                {reviewSessionInfo?.coachTitle || t("growth.unassignedCoach")}
                            </span>
                        </div>
                    </div>
                </article>

                <RatingGroup
                    name={t("growth.physical")}
                    value={state.ratings.physical}
                    onChange={(value) => actions.setRating("physical", value)}
                    label={ratingLabels.physical[state.ratings.physical - 1] || "—"}
                />
                <RatingGroup
                    name={t("growth.mental")}
                    value={state.ratings.mental}
                    onChange={(value) => actions.setRating("mental", value)}
                    label={ratingLabels.mental[state.ratings.mental - 1] || "—"}
                />
                <RatingGroup
                    name={t("growth.skill")}
                    value={state.ratings.skill}
                    onChange={(value) => actions.setRating("skill", value)}
                    label={ratingLabels.skill[state.ratings.skill - 1] || "—"}
                />

                <div className="rating-group">
                    <div className="rating-head">
                        <h3>{t("growth.coachRating")}</h3>
                        <span>{coachLabel}</span>
                    </div>
                    <StarRating value={state.ratings.coach} onChange={(value) => actions.setRating("coach", value)} />
                </div>

                <textarea
                    className="feedback-textarea"
                    placeholder={t("growth.feedbackPlaceholder")}
                    value={state.reviewText}
                    onChange={(event) => actions.setReviewText(event.target.value)}
                />

                <button type="button" className="btn-primary wide" onClick={onSubmit}>
                    {t("growth.submitReview")}
                </button>
            </article>
        );
    };

    return (
        <section className={`screen fade-enter ${hideSubnavChrome ? "homework-focus-screen" : ""}`}>
            {!hideSubnavChrome ? (
                <section className="section-stack growth-subnav-wrap">
                    <div className="growth-subnav">
                        {growthViewItems.map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                className={`growth-subtab ${state.growthView === item.key ? "active" : ""}`}
                                onClick={() => {
                                    actions.setGrowthView(item.key);
                                    if (item.key !== "tasks") {
                                        closeTaskDetail();
                                    }
                                    if (item.key !== "report") {
                                        setActiveReportTaskId(null);
                                    }
                                }}
                            >
                                {t(`growth.${item.key}`)}
                            </button>
                        ))}
                    </div>
                </section>
            ) : null}

            {state.growthView === "tasks" && activeTask ? renderTaskDetailView(activeTask) : null}
            {state.growthView === "tasks" && !activeTask ? renderTaskView() : null}
            {state.growthView === "review" ? renderReviewView() : null}
            {state.growthView === "report" && activeReportTask ? renderReportDetailView(activeReportTask) : null}
            {state.growthView === "report" && !activeReportTask ? renderReportListView() : null}
        </section>
    );
}
