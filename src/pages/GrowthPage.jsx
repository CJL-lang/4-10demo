import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import RecordCard from "../components/RecordCard";
import RecordReportView from "../components/RecordReportView";
import StarRating from "../components/StarRating";
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

function collectProjectItems(t, taskId) {
    const items = [];
    for (let i = 0; i < 12; i += 1) {
        const line = t(`tasks.${taskId}.projectItems.${i}`, { defaultValue: "" });
        if (!line) break;
        items.push(line);
    }
    return items;
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
    const [reportRecord, setReportRecord] = useState(null);

    const filteredRecords = useMemo(
        () => records.filter((item) => item.type === state.recordFilter),
        [state.recordFilter]
    );

    const visibleRecords = useMemo(
        () => filteredRecords.slice(0, state.recordVisibleCount),
        [filteredRecords, state.recordVisibleCount]
    );

    const hasMoreRecords = visibleRecords.length < filteredRecords.length;

    const tasks = useMemo(
        () =>
            practiceTasks.map((task) => {
                const done = Boolean(state.taskDoneMap[task.id]);
                const record = records.find((r) => r.id === task.recordId) || null;
                return {
                    ...task,
                    record,
                    title: t(`tasks.${task.id}.title`),
                    projectRequirements: t(`tasks.${task.id}.projectRequirements`),
                    projectItems: collectProjectItems(t, task.id),
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
            pending: tasks.filter((task) => !task.done && task.record),
            completed: tasks.filter((task) => task.done && task.record),
        }),
        [tasks]
    );

    useEffect(() => {
        const hideNav = detailMode || Boolean(reportRecord);
        onDetailPageChange?.(hideNav);
        return () => {
            onDetailPageChange?.(false);
        };
    }, [detailMode, reportRecord, onDetailPageChange]);

    useEffect(() => {
        if (!state.pendingHomeworkTaskId) {
            return;
        }
        const id = state.pendingHomeworkTaskId;
        actions.setPendingHomeworkTask(null);
        setActiveTaskId(id);
        setHomeworkDraft({
            videoFileName: "",
            textNote: "",
            voiceFileName: "",
        });
    }, [state.pendingHomeworkTaskId, actions]);

    useEffect(() => {
        const scrollMain = document.querySelector(".scroll-main");
        if (scrollMain) {
            scrollMain.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [detailMode, state.growthView, reportRecord]);

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

    const renderTaskGroup = (groupKey, title, list, emptyText, withBottomGap) => (
        <section className={`section-stack club-record-page ${withBottomGap ? "section-bottom-gap" : ""}`} key={groupKey}>
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
                    {list.map((task, index) => (
                        <div
                            key={task.id}
                            className="record-card-enter-wrap"
                            style={{ animationDelay: `${index * 420}ms` }}
                        >
                            <RecordCard record={task.record} onHomework={() => openTaskDetail(task.id)} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );

    const renderTaskView = () => (
        <>
            {renderTaskGroup("pending", t("growth.pendingHomework"), taskGroups.pending, t("growth.emptyPendingHomework"), true)}
            {renderTaskGroup("completed", t("growth.completedHomework"), taskGroups.completed, t("growth.emptyCompletedHomework"), false)}
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
                    </div>
                    <div className="homework-hero">
                        <h3 className="homework-task-title">
                            {task.record
                                ? t(`records.${task.record.id}.title`, { defaultValue: task.record.title })
                                : task.title}
                        </h3>
                    </div>
                    <div className="homework-meta-grid">
                        <div className="homework-meta-card homework-meta-card--publish">
                            <span className="homework-meta-label">{t("growth.courseSession")}</span>
                            <strong>
                                {task.record
                                    ? `${task.record.date}${task.record.time ? ` ${task.record.time}` : ""}`
                                    : task.publishTime}
                            </strong>
                        </div>
                        <div className="homework-meta-card homework-meta-card--deadline">
                            <span className="homework-meta-label">{t("growth.homeworkDeadline")}</span>
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

    const coachStarLabel =
        state.ratings.coach > 0 ? t(`growth.coachRatingLabels.${state.ratings.coach}`) : "—";

    const renderReviewView = () => (
        <article className="panel feedback-panel panel-elevated section-bottom-gap">
            <header className="feedback-head">
                <h2 className="headline">{t("growth.reviewHeadline")}</h2>
                <span className="tag">{t("growth.reviewTag")}</span>
            </header>

            <article className="panel panel-low review-session-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{ minWidth: 0 }}>
                        <p className="small-label" style={{ marginBottom: "4px" }}>
                            {t("growth.sessionInfo")}
                        </p>
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold", color: "var(--on-surface)", wordBreak: "break-word" }}>
                            {reviewSessionInfo?.courseName || t("growth.sessionSyncing")}
                        </h3>
                    </div>
                    {reviewSessionInfo?.dateLabel && (
                        <div className="review-session-meta" style={{ margin: 0, flexShrink: 0 }}>
                            <span>{reviewSessionInfo.dateLabel}</span>
                        </div>
                    )}
                </div>

                {reviewSessionInfo?.coachName && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed rgba(255, 255, 255, 0.1)" }}>
                        <img
                            src={reviewSessionInfo.avatarUrl}
                            alt=""
                            style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--on-surface)" }}>
                                {reviewSessionInfo.coachName}
                            </span>
                            <span style={{ fontSize: "12px", color: "var(--on-surface-variant)" }}>
                                {t("coachCard.coach")}
                            </span>
                        </div>
                    </div>
                )}
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
                    <span>{coachStarLabel}</span>
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
        <section className="section-stack section-bottom-gap club-record-page">
            <div className="stack-list">
                {visibleRecords.map((record, index) => (
                    <div
                        key={record.id}
                        className="record-card-enter-wrap"
                        style={{ animationDelay: `${index * 420}ms` }}
                    >
                        <RecordCard
                            record={record}
                            onReport={(r) => {
                                setReportRecord(r);
                                onToast?.(t("club.toasts.openedReport"));
                            }}
                        />
                    </div>
                ))}
            </div>

            {hasMoreRecords ? (
                <button
                    type="button"
                    className="btn-ghost small record-more-btn"
                    onClick={() => {
                        actions.loadMoreRecords();
                        onToast?.(t("club.toasts.loadedMore"));
                    }}
                >
                    {t("club.loadMore")}
                </button>
            ) : null}
        </section>
    );

    if (reportRecord) {
        return (
            <RecordReportView
                record={reportRecord}
                onBack={() => setReportRecord(null)}
            />
        );
    }

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
                                {t(`growth.${item.key}`)}
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
