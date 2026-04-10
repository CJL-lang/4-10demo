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
            today: tasks.filter((task) => task.category === "今日任务" && !task.done),
            weekly: tasks.filter((task) => task.category === "本周任务" && !task.done),
            completed: tasks.filter((task) => task.done),
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
                            <p className="muted-text">{task.target}</p>
                            <div className="task-meta-row">
                                <span>{task.dueText}</span>
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
            <article className="panel panel-elevated task-summary-card">
                <div className="section-head">
                    <h2 className="section-title-sm">任务完成进度</h2>
                    <span className="pill">
                        {completedCount}/{totalCount}
                    </span>
                </div>
                <div className="progress-track">
                    <span style={{ width: `${Math.round((completedCount / totalCount) * 100)}%` }} />
                </div>
            </article>
            {renderTaskGroup("今日任务", taskGroups.today, "今日任务已完成，去挑战本周任务吧")}
            {renderTaskGroup("本周任务", taskGroups.weekly, "本周任务已清空，继续保持")}
            {renderTaskGroup("已完成", taskGroups.completed, "完成后的任务会展示在这里")}
            <div className="section-bottom-gap" />
        </>
    );

    const renderTaskDetailView = (task) => {
        const checkpoints = task.checkpoints?.length ? task.checkpoints : buildFallbackChecklist(task);

        return (
            <section className="section-stack section-bottom-gap homework-detail-wrap">
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
                    <p className="muted-text">{task.homeworkBrief || task.target}</p>
                    <div className="homework-meta-row">
                        <span>负责教练：{task.coach || "教练组"}</span>
                        <span>截止：{task.dueText}</span>
                    </div>
                    <ul className="homework-checklist">
                        {checkpoints.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </article>

                <article className="panel panel-low homework-submit-card">
                    <div className="section-head">
                        <h2 className="section-title-sm">提交作业</h2>
                        <span className="tiny-text">视频 + 文字/语音</span>
                    </div>

                    <label className="homework-field">
                        <div className="homework-field-head">
                            <span className="homework-field-label">训练视频（必传）</span>
                            <button
                                type="button"
                                className="btn-ghost small recorder-trigger"
                                onClick={() => videoInputRef.current?.click()}
                            >
                                {homeworkDraft.videoFileName ? "重新录制" : "开始录制"}
                            </button>
                        </div>
                        <input
                            ref={videoInputRef}
                            className="homework-file-input"
                            type="file"
                            accept="video/*"
                            capture="environment"
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                setHomeworkDraft((prev) => ({
                                    ...prev,
                                    videoFileName: file?.name || "",
                                }));
                                event.target.value = "";
                            }}
                        />
                        <div className={`homework-capture-card ${homeworkDraft.videoFileName ? "has-value" : ""}`}>
                            <p className="homework-capture-title">视频采集</p>
                            <p className="homework-capture-value">
                                {homeworkDraft.videoFileName ? homeworkDraft.videoFileName : "点击右侧按钮调用相机录制"}
                            </p>
                        </div>
                        <em className="homework-file-hint">
                            {homeworkDraft.videoFileName ? `已选择：${homeworkDraft.videoFileName}` : "支持 mp4 / mov 等格式"}
                        </em>
                    </label>

                    <label className="homework-field">
                        <span className="homework-field-label">文字复盘（可选）</span>
                        <textarea
                            className="homework-textarea"
                            placeholder="例如：今天 7 号铁命中率提升到 70%，主要问题在于上杆节奏..."
                            value={homeworkDraft.textNote}
                            onChange={(event) => {
                                setHomeworkDraft((prev) => ({
                                    ...prev,
                                    textNote: event.target.value,
                                }));
                            }}
                        />
                    </label>

                    <label className="homework-field">
                        <div className="homework-field-head">
                            <span className="homework-field-label">语音复盘（可选）</span>
                            <button
                                type="button"
                                className="btn-ghost small recorder-trigger"
                                onClick={() => audioInputRef.current?.click()}
                            >
                                {homeworkDraft.voiceFileName ? "重新录音" : "开始录音"}
                            </button>
                        </div>
                        <input
                            ref={audioInputRef}
                            className="homework-file-input"
                            type="file"
                            accept="audio/*"
                            capture
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                setHomeworkDraft((prev) => ({
                                    ...prev,
                                    voiceFileName: file?.name || "",
                                }));
                                event.target.value = "";
                            }}
                        />
                        <div className={`homework-capture-card ${homeworkDraft.voiceFileName ? "has-value" : ""}`}>
                            <p className="homework-capture-title">语音采集</p>
                            <p className="homework-capture-value">
                                {homeworkDraft.voiceFileName ? homeworkDraft.voiceFileName : "点击右侧按钮调用麦克风录音"}
                            </p>
                        </div>
                        <em className="homework-file-hint">
                            {homeworkDraft.voiceFileName ? `已选择：${homeworkDraft.voiceFileName}` : "可上传 m4a / mp3 等语音文件"}
                        </em>
                    </label>

                    <p className="tiny-text">需上传视频，并补充文字或语音任意一项后可提交。</p>

                    <button
                        type="button"
                        className="btn-primary wide"
                        disabled={!canSubmitHomework}
                        onClick={handleSubmitHomework}
                    >
                        提交课后作业
                    </button>
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
                label={ratingLabels.physical[state.ratings.physical - 1]}
            />
            <RatingGroup
                name="心理状态"
                field="mental"
                value={state.ratings.mental}
                onChange={(value) => actions.setRating("mental", value)}
                label={ratingLabels.mental[state.ratings.mental - 1]}
            />
            <RatingGroup
                name="技能状态"
                field="skill"
                value={state.ratings.skill}
                onChange={(value) => actions.setRating("skill", value)}
                label={ratingLabels.skill[state.ratings.skill - 1]}
            />

            <div className="rating-group">
                <div className="rating-head">
                    <h3>匿名评价教练</h3>
                    <span>{ratingLabels.coach[state.ratings.coach - 1]}</span>
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
        </section>
    );
}
