import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import StarRating from "../components/StarRating";
import { growthViewItems, practiceTasks, ratingLabels } from "../data/mockData";
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

function buildFallbackChecklist(task) {
    return [
        `完成目标：${task.target}`,
        "上传训练视频（必传）",
        "补充文字复盘或语音复盘（任选其一）",
    ];
}

export default function GrowthPage({ onSubmit, onToast, onDetailPageChange, reviewSessionInfo }) {
    const { t } = useTranslation();
    const { state, actions } = useAppContext();
    const videoInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const [activeTaskId, setActiveTaskId] = useState(null);
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
                    translatedTitle: t(`tasks.${task.id}.title`, { defaultValue: task.title }),
                    translatedReward: t(`tasks.${task.id}.reward`, { defaultValue: task.reward }),
                    translatedCoach: t(`tasks.${task.id}.coach`, { defaultValue: task.coach }),
                    translatedProjectRequirements: t(`tasks.${task.id}.projectRequirements`, { defaultValue: task.projectRequirements }),
                    translatedProjectItems: task.projectItems.map((item, index) =>
                        t(`tasks.${task.id}.projectItems.${index}`, { defaultValue: item })
                    ),
                    done,
                    progress: done ? 100 : task.progress,
                };
            }),
        [state.taskDoneMap, t]
    );

    const activeTask = useMemo(
        () => tasks.find((task) => task.id === activeTaskId) || null,
        [tasks, activeTaskId]
    );

    const canSubmitHomework =
        Boolean(homeworkDraft.videoFileName) &&
        (homeworkDraft.textNote.trim().length > 0 || Boolean(homeworkDraft.voiceFileName));

    const detailMode = state.growthView === "tasks" && Boolean(activeTask);

    const taskGroups = useMemo(
        () => ({
            weekly: tasks.filter((task) => task.category === "本周作业" && !task.done),
            completed: tasks.filter((task) => task.category === "历史作业" || task.done),
        }),
        [tasks]
    );

    const completedCount = taskGroups.completed.length;
    const totalCount = tasks.length;

    useEffect(() => {
        onDetailPageChange?.(detailMode);
        return () => {
            onDetailPageChange?.(false);
        };
    }, [detailMode, onDetailPageChange]);

    useEffect(() => {
        const scrollMain = document.querySelector(".scroll-main");
        if (scrollMain) {
            scrollMain.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [detailMode, state.growthView]);

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

    const renderTaskGroup = (title, list, emptyText) => (
        <section className="section-stack" key={title}>
            <div className="section-head">
                <h2 className="section-title-sm">{title}</h2>
                <span className="tiny-text">{t("growth.countItems", { count: list.length })}</span>
            </div>
            {list.length === 0 ? (
                <article className="panel panel-low task-empty-card">
                    <p className="muted-text">{emptyText}</p>
                </article>
            ) : (
                <div className="stack-list">
                    {list.map((task) => (
                        <article
                            className={`panel panel-low task-card task-card-clickable ${task.done ? "is-done" : ""}`}
                            key={task.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => openTaskDetail(task.id)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    openTaskDetail(task.id);
                                }
                            }}
                        >
                            <div className="task-head">
                                <h3>{task.translatedTitle}</h3>
                                <span className="task-difficulty">{task.difficulty === "挑战" ? t("growth.difficulty.challenge") : task.difficulty === "进阶" ? t("growth.difficulty.advanced") : t("growth.difficulty.basic")}</span>
                            </div>
                            <div className="task-meta-row task-time-row" style={{ marginTop: "8px", fontSize: "12px", color: "var(--outline)" }}>
                                <span>{t("growth.taskPublish", { value: task.publishTime })}</span>
                                <span>{t("growth.taskDeadline", { value: task.deadline })}</span>
                            </div>
                            <div className="task-meta-row" style={{ marginTop: "4px" }}>
                                <span>{t("growth.taskCoach", { value: task.translatedCoach })}</span>
                                <span>{task.translatedReward}</span>
                            </div>
                            <div className="progress-track task-progress-track">
                                <span style={{ width: `${task.progress}%` }} />
                            </div>
                            <div className="task-card-footer">
                                <span className={`task-state-chip ${task.done ? "is-done" : "is-pending"}`}>
                                    {task.done ? t("growth.taskResubmit") : t("growth.taskEnter")}
                                </span>
                                <span className="task-enter-arrow">→</span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );

    const renderTaskView = () => (
        <>
            {renderTaskGroup(t("growth.weeklyAssignments"), taskGroups.weekly, t("growth.emptyWeekly"))}
            <div className="section-bottom-gap" />
        </>
    );

    const renderTaskDetailView = (task) => {
        return (
            <section className="section-stack section-bottom-gap homework-detail-wrap swing-3d-enter">
                <article className="panel panel-elevated homework-brief-card">
                    <div className="homework-detail-topbar">
                        <button type="button" className="icon-btn homework-back-btn" aria-label={t("growth.taskBackAria")} onClick={closeTaskDetail}>
                            ←
                        </button>
                        <span className="pill">{task.category === "本周作业" ? t("growth.categories.weekly") : t("growth.categories.history")}</span>
                    </div>
                    <div className="section-head">
                        <h2 className="section-title-sm">{t("growth.assignmentLabel")}</h2>
                        <span className="tag">{t("growth.assignmentTag")}</span>
                    </div>
                    <h3 className="homework-task-title">{task.translatedTitle}</h3>
                    <div className="homework-highlight-row">
                        <span className="homework-highlight-chip">{task.difficulty === "挑战" ? t("growth.difficulty.challenge") : task.difficulty === "进阶" ? t("growth.difficulty.advanced") : t("growth.difficulty.basic")}</span>
                        <span className="homework-highlight-chip">{task.translatedReward}</span>
                    </div>
                    <div className="homework-meta-grid">
                        <div className="homework-meta-card">
                            <span className="homework-meta-label">{t("growth.publishTime")}</span>
                            <strong>{task.publishTime}</strong>
                        </div>
                        <div className="homework-meta-card">
                            <span className="homework-meta-label">{t("growth.deadline")}</span>
                            <strong>{task.deadline}</strong>
                        </div>
                    </div>

                    <div className="homework-project-info">
                        <section className="homework-detail-block">
                            <div className="homework-block-head">
                                <h4 className="homework-block-title">{t("growth.projectItems")}</h4>
                                <span className="pill">{t("growth.projectCount", { count: task.projectItems?.length || 0 })}</span>
                            </div>
                            <ul className="homework-checklist">
                                {task.translatedProjectItems?.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="homework-detail-block">
                            <div className="homework-block-head">
                                <h4 className="homework-block-title">{t("growth.projectRequirements")}</h4>
                            </div>
                            <p className="homework-requirement-text">{task.translatedProjectRequirements}</p>
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
                            <span className="action-label">{t("growth.uploadVideo")}<span className="req-star">*</span></span>
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
                        <p className="submit-req-hint">※ {t("growth.submitHint")}</p>
                        <button
                            type="button"
                            className="btn-submit-action"
                            disabled={!canSubmitHomework}
                            onClick={handleSubmitHomework}
                        >
                            {canSubmitHomework ? t("growth.submitReady") : t("growth.submitDisabled")}
                        </button>
                    </div>
                </article>
            </section>
        );
    };

    const renderReviewView = () => (
        <article className="panel feedback-panel panel-elevated section-bottom-gap">
            <header className="feedback-head">
                <h2 className="headline">{t("growth.reviewHeadline")}</h2>
                <span className="tag">{t("growth.reviewTag")}</span>
            </header>

            <article className="panel panel-low review-session-card">
                <p className="small-label">{t("growth.sessionInfo")}</p>
                <h3>{reviewSessionInfo?.courseAsset || t("growth.sessionSyncing")}</h3>
                <p className="muted-text">{t("growth.courseTopic", { value: reviewSessionInfo?.courseTitle || "-" })}</p>
                <div className="review-session-meta">
                    <span>{t("growth.coachLabel", { value: reviewSessionInfo?.coachName || "-" })}</span>
                    <span>{reviewSessionInfo?.coachTitle || ""}</span>
                </div>
                <p className="muted-text">{t("growth.sessionTime", { value: reviewSessionInfo?.dateLabel || "-" })}</p>
            </article>

            <RatingGroup
                name={t("growth.physical")}
                field="physical"
                value={state.ratings.physical}
                onChange={(value) => actions.setRating("physical", value)}
                label={ratingLabels.physical[state.ratings.physical - 1] || "—"}
            />
            <RatingGroup
                name={t("growth.mental")}
                field="mental"
                value={state.ratings.mental}
                onChange={(value) => actions.setRating("mental", value)}
                label={ratingLabels.mental[state.ratings.mental - 1] || "—"}
            />
            <RatingGroup
                name={t("growth.skill")}
                field="skill"
                value={state.ratings.skill}
                onChange={(value) => actions.setRating("skill", value)}
                label={ratingLabels.skill[state.ratings.skill - 1] || "—"}
            />

            <div className="rating-group">
                <div className="rating-head">
                    <h3>{t("growth.coachRating")}</h3>
                    <span>{t(`growth.coachRatingLabels.${state.ratings.coach}`, { defaultValue: ratingLabels.coach[state.ratings.coach - 1] || "—" })}</span>
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

    const renderReportView = () => (
        <article className="panel panel-low task-empty-card" style={{ marginTop: '16px' }}>
            <p className="muted-text">{t("growth.emptyReport")}</p>
        </article>
    );

    return (
        <section className={`screen fade-enter ${detailMode ? "homework-focus-screen" : ""}`}>
            {!detailMode ? (
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
                                }}
                            >
                                {t(`growth.${item.key}`, { defaultValue: item.label })}
                            </button>
                        ))}
                    </div>
                </section>
            ) : null}

            {state.growthView === "tasks" && activeTask ? renderTaskDetailView(activeTask) : null}
            {state.growthView === "tasks" && !activeTask ? renderTaskView() : null}
            {state.growthView === "review" ? renderReviewView() : null}
            {state.growthView === "report" ? renderReportView() : null}
        </section>
    );
}
