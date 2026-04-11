import { useEffect, useMemo, useRef, useState } from "react";
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
            onToast?.("请先上传训练视频");
            return;
        }

        if (!homeworkDraft.textNote.trim() && !homeworkDraft.voiceFileName) {
            onToast?.("请补充文字或语音复盘");
            return;
        }

        actions.setTaskDone(activeTask.id, true);
        closeTaskDetail();
        onToast?.("作业已提交，已完成课后任务");
    };

    const renderTaskGroup = (title, list, emptyText) => (
        <section className="section-stack" key={title}>
            <div className="section-head">
                <h2 className="section-title-sm">{title}</h2>
                <span className="tiny-text">{list.length} 条</span>
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
                                <h3>{task.title}</h3>
                                <span className="task-difficulty">{task.difficulty}</span>
                            </div>
                            <div className="task-meta-row task-time-row" style={{ marginTop: "8px", fontSize: "12px", color: "var(--outline)" }}>
                                <span>发布：{task.publishTime}</span>
                                <span>截止：{task.deadline}</span>
                            </div>
                            <div className="task-meta-row" style={{ marginTop: "4px" }}>
                                <span>教练：{task.coach}</span>
                                <span>{task.reward}</span>
                            </div>
                            <div className="progress-track task-progress-track">
                                <span style={{ width: `${task.progress}%` }} />
                            </div>
                            <div className="task-card-footer">
                                <span className={`task-state-chip ${task.done ? "is-done" : "is-pending"}`}>
                                    {task.done ? "已完成，可再次提交" : "点击进入作业提交"}
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
            {renderTaskGroup("本周作业", taskGroups.weekly, "本周作业已空，非常棒！")}
            <div className="section-bottom-gap" />
        </>
    );

    const renderTaskDetailView = (task) => {
        return (
            <section className="section-stack section-bottom-gap homework-detail-wrap swing-3d-enter">
                <article className="panel panel-elevated homework-brief-card">
                    <div className="homework-detail-topbar">
                        <button type="button" className="icon-btn homework-back-btn" aria-label="返回任务列表" onClick={closeTaskDetail}>
                            ←
                        </button>
                        <span className="pill">{task.category}</span>
                    </div>
                    <div className="section-head">
                        <h2 className="section-title-sm">课后作业</h2>
                        <span className="tag">ASSIGNMENT</span>
                    </div>
                    <h3 className="homework-task-title">{task.title}</h3>
                    <div className="homework-meta-row">
                        <span>发布：{task.publishTime}</span>
                        <span>截止：{task.deadline}</span>
                    </div>

                    <div className="homework-project-info" style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed rgba(80, 69, 51, 0.4)" }}>
                        <h4 style={{ margin: "0 0 8px", fontSize: "14px", color: "var(--primary-fixed)" }}>作业项目</h4>
                        <ul className="homework-checklist">
                            {task.projectItems?.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>

                        <h4 style={{ margin: "16px 0 8px", fontSize: "14px", color: "var(--primary-fixed)" }}>项目要求</h4>
                        <p className="muted-text" style={{ fontSize: "13px", lineHeight: "1.6" }}>{task.projectRequirements}</p>
                    </div>
                </article>

                <article className="panel panel-low homework-submit-card">
                    <div className="submit-header">
                        <h2 className="submit-title">作业交付</h2>
                    </div>

                    <div className="submit-actions-grid">
                        <button type="button" className={`submit-action-btn ${homeworkDraft.videoFileName ? "active" : ""}`} onClick={() => videoInputRef.current?.click()}>
                            <span className="action-icon">🎥</span>
                            <span className="action-label">视频记录<span className="req-star">*</span></span>
                            <span className="action-status">{homeworkDraft.videoFileName ? "已选" : "去拍摄"}</span>
                        </button>
                        
                        <button type="button" className={`submit-action-btn ${homeworkDraft.voiceFileName ? "active" : ""}`} onClick={() => audioInputRef.current?.click()}>
                            <span className="action-icon">🎙️</span>
                            <span className="action-label">语音反思</span>
                            <span className="action-status">{homeworkDraft.voiceFileName ? "已录制" : "去录音"}</span>
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
                            placeholder="写点什么，例如今天的挥杆节奏感..."
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
                        <p className="submit-req-hint">※ 需提交视频，并选填语音或文字内容方可提交流程</p>
                        <button
                            type="button"
                            className="btn-submit-action"
                            disabled={!canSubmitHomework}
                            onClick={handleSubmitHomework}
                        >
                            {canSubmitHomework ? "一键提交作业" : "完善内容以提交"}
                        </button>
                    </div>
                </article>
            </section>
        );
    };

    const renderReviewView = () => (
        <article className="panel feedback-panel panel-elevated section-bottom-gap">
            <header className="feedback-head">
                <h2 className="headline">课后互评</h2>
                <span className="tag">EVALUATION</span>
            </header>

            <article className="panel panel-low review-session-card">
                <p className="small-label">本次课程信息</p>
                <h3>{reviewSessionInfo?.courseAsset || "课程信息待同步"}</h3>
                <p className="muted-text">课程主题：{reviewSessionInfo?.courseTitle || "-"}</p>
                <div className="review-session-meta">
                    <span>教练：{reviewSessionInfo?.coachName || "-"}</span>
                    <span>{reviewSessionInfo?.coachTitle || ""}</span>
                </div>
                <p className="muted-text">上课时间：{reviewSessionInfo?.dateLabel || "-"}</p>
            </article>

            <RatingGroup
                name="体能状态"
                field="physical"
                value={state.ratings.physical}
                onChange={(value) => actions.setRating("physical", value)}
                label={ratingLabels.physical[state.ratings.physical - 1] || "—"}
            />
            <RatingGroup
                name="心理状态"
                field="mental"
                value={state.ratings.mental}
                onChange={(value) => actions.setRating("mental", value)}
                label={ratingLabels.mental[state.ratings.mental - 1] || "—"}
            />
            <RatingGroup
                name="技能状态"
                field="skill"
                value={state.ratings.skill}
                onChange={(value) => actions.setRating("skill", value)}
                label={ratingLabels.skill[state.ratings.skill - 1] || "—"}
            />

            <div className="rating-group">
                <div className="rating-head">
                    <h3>匿名评价教练</h3>
                    <span>{ratingLabels.coach[state.ratings.coach - 1] || "—"}</span>
                </div>
                <StarRating value={state.ratings.coach} onChange={(value) => actions.setRating("coach", value)} />
            </div>

            <textarea
                className="feedback-textarea"
                placeholder="教学质量反馈..."
                value={state.reviewText}
                onChange={(event) => actions.setReviewText(event.target.value)}
            />

            <button type="button" className="btn-primary wide" onClick={onSubmit}>
                提交评价
            </button>
        </article>
    );

    const renderReportView = () => (
        <article className="panel panel-low task-empty-card" style={{ marginTop: '16px' }}>
            <p className="muted-text">课后报告页面正在开发中...</p>
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
                                {item.label}
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
