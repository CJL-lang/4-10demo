import { useMemo, useState } from "react";
import RecordCard from "../components/RecordCard";
import ProgressOverviewSection from "../components/ProgressOverviewSection";
import { useAppContext } from "../context/AppContext";
import { recordFilterItems, records } from "../data/mockData";

export default function ClubPage({ onGoGrowth, onToast }) {
    const { state, actions } = useAppContext();
    const [clubView, setClubView] = useState("home");
    const [activeRecord, setActiveRecord] = useState(null);

    const filteredRecords = useMemo(() => {
        if (state.recordFilter === "all") {
            return records;
        }
        return records.filter((item) => item.type === state.recordFilter);
    }, [state.recordFilter]);

    const visibleRecords = useMemo(
        () => filteredRecords.slice(0, state.recordVisibleCount),
        [filteredRecords, state.recordVisibleCount]
    );

    const hasMoreRecords = visibleRecords.length < filteredRecords.length;

    if (clubView === "records") {
        return (
            <section className="screen fade-enter">
                <header className="top-header club-subpage-header">
                    <div className="user-chip">
                        <button
                            type="button"
                            className="icon-btn"
                            aria-label="返回进度首页"
                            onClick={() => setClubView("home")}
                        >
                            ←
                        </button>
                        <div>
                            <p className="small-label">Progress</p>
                            <h1 className="headline">课程记录</h1>
                        </div>
                    </div>
                    <span className="pill">{filteredRecords.length} 条</span>
                </header>

                <section className="section-stack section-bottom-gap club-record-page">
                    <div className="filter-row">
                        {recordFilterItems.map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                className={`filter-chip ${state.recordFilter === item.key ? "active" : ""}`}
                                onClick={() => actions.setRecordFilter(item.key)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <p className="tiny-text record-stat">
                        已展示 {visibleRecords.length} / {filteredRecords.length}
                    </p>

                    <div className="stack-list">
                        {visibleRecords.map((record) => (
                            <RecordCard key={record.id} record={record} onClick={setActiveRecord} />
                        ))}
                    </div>

                    {hasMoreRecords ? (
                        <button
                            type="button"
                            className="btn-ghost small record-more-btn"
                            onClick={() => {
                                actions.loadMoreRecords();
                                onToast("已加载更多课程记录");
                            }}
                        >
                            加载更多
                        </button>
                    ) : null}
                </section>

                {activeRecord ? (
                    <div className="modal-mask" onClick={() => setActiveRecord(null)}>
                        <section className="modal-card record-detail-modal" onClick={(event) => event.stopPropagation()}>
                            <h3>{activeRecord.title}</h3>
                            <p>{activeRecord.date}</p>
                            <p>类型：{activeRecord.type}</p>
                            <p>教练：{activeRecord.coach}</p>
                            <p>本课结果：{activeRecord.result}</p>
                            <p>{activeRecord.note}</p>
                            <p>目标：{activeRecord.target}</p>
                            <p>下次建议：{activeRecord.advice}</p>
                            <div className="modal-actions">
                                <button type="button" className="btn-ghost" onClick={() => setActiveRecord(null)}>
                                    关闭
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={() => {
                                        setActiveRecord(null);
                                        onGoGrowth();
                                    }}
                                >
                                    去课后页练习
                                </button>
                            </div>
                        </section>
                    </div>
                ) : null}
            </section>
        );
    }

    return (
        <section className="screen fade-enter club-home">
            <header className="top-header club-header">
                <div className="user-chip">
                    <div className="avatar">PG</div>
                    <div>
                        <p className="small-label">Progress</p>
                        <h1 className="headline">进度</h1>
                    </div>
                </div>
                <button type="button" className="icon-btn" aria-label="通知">
                    ○
                </button>
            </header>

            <button
                type="button"
                className="club-entry-card"
                onClick={() => {
                    setClubView("records");
                    onToast("已进入课程记录");
                }}
            >
                <div>
                    <p className="small-label">Progress Center</p>
                    <h3>课程记录</h3>
                    <p className="muted-text">查看阶段进展、课程表现与教练建议</p>
                </div>
                <span className="club-entry-arrow">→</span>
            </button>

            <ProgressOverviewSection />
        </section>
    );
}
