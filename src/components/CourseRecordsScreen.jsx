import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import RecordCard from "./RecordCard";
import { useAppContext } from "../context/AppContext";
import { practiceTasks, records } from "../data/mockData";

export default function CourseRecordsScreen({ onBack, onToast }) {
    const { t } = useTranslation();
    const { state, actions } = useAppContext();

    useEffect(() => {
        const scrollMain = document.querySelector(".scroll-main");
        if (scrollMain) {
            scrollMain.scrollTo({ top: 0, behavior: "auto" });
        }
    }, []);

    const filteredRecords = useMemo(
        () => records.filter((item) => item.type === state.recordFilter),
        [state.recordFilter]
    );

    const visibleRecords = useMemo(
        () => filteredRecords.slice(0, state.recordVisibleCount),
        [filteredRecords, state.recordVisibleCount]
    );

    const hasMoreRecords = visibleRecords.length < filteredRecords.length;

    const toast = typeof onToast === "function" ? onToast : () => {};

    return (
        <section className="screen swing-3d-enter">
            <header className="top-header club-subpage-header">
                <div className="user-chip">
                    <button
                        type="button"
                        className="icon-btn"
                        aria-label={t("profile.courseRecordsBackAria")}
                        onClick={onBack}
                    >
                        ←
                    </button>
                    <div>
                        <p className="small-label">{t("club.entries.records.label")}</p>
                        <h1 className="headline">{t("club.entries.records.title")}</h1>
                    </div>
                </div>
                <span className="pill">{t("club.recordCount", { count: filteredRecords.length })}</span>
            </header>

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
                                    const task = practiceTasks.find((tk) => tk.recordId === r.id);
                                    if (task) {
                                        actions.setResumeProfileSubView("records");
                                        actions.setTab("growth");
                                        actions.setGrowthView("report");
                                        actions.setPendingReportTask(task.id);
                                        toast(t("club.toasts.openedReport"));
                                    } else {
                                        toast(t("club.toasts.noReportForRecord"));
                                    }
                                }}
                                onHomework={(r) => {
                                    const task = practiceTasks.find((tk) => tk.recordId === r.id);
                                    if (task) {
                                        actions.setResumeProfileSubView("records");
                                        actions.setTab("growth");
                                        actions.setGrowthView("tasks");
                                        actions.setPendingHomeworkTask(task.id);
                                        toast(t("club.toasts.openHomework"));
                                    } else {
                                        toast(t("club.toasts.noHomeworkForRecord"));
                                    }
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
                            toast(t("club.toasts.loadedMore"));
                        }}
                    >
                        {t("club.loadMore")}
                    </button>
                ) : null}
            </section>
        </section>
    );
}
