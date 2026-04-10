import { useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "./components/BottomNav";
import BookingModal from "./components/BookingModal";
import ReviewInviteModal from "./components/ReviewInviteModal";
import Toast from "./components/Toast";
import { useAppContext } from "./context/AppContext";
import { courseAssetsByDate, scheduleDates } from "./data/mockData";
import BookingPage from "./pages/BookingPage";
import ClubPage from "./pages/ClubPage";
import GrowthPage from "./pages/GrowthPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
    const { state, actions } = useAppContext();
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [reviewInviteOpen, setReviewInviteOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [hideBottomNav, setHideBottomNav] = useState(false);
    const scrollRef = useRef(null);
    const viewKey = `${state.currentTab}-${state.currentTab === "booking" ? state.bookingStatus : "stable"}`;
    const selectedSchedule = useMemo(
        () => scheduleDates.find((item) => item.day === state.selectedDate) || scheduleDates[0],
        [state.selectedDate]
    );

    const selectedAssets = useMemo(
        () => courseAssetsByDate[state.selectedDate] || [],
        [state.selectedDate]
    );

    const selectedAsset = useMemo(
        () => selectedAssets.find((item) => item.id === state.selectedCourseAssetId) || selectedAssets[0] || null,
        [selectedAssets, state.selectedCourseAssetId]
    );

    const bookingPreview = useMemo(
        () => ({
            day: selectedSchedule.day,
            slot: selectedSchedule.time,
            courseTitle: selectedSchedule.courseTitle,
            selectedCourseAsset: selectedAsset?.courseName || "系统自动分配",
        }),
        [selectedAsset, selectedSchedule]
    );

    const bookedDay = state.bookedDate || state.selectedDate;

    const bookedSchedule = useMemo(
        () => scheduleDates.find((item) => item.day === bookedDay) || selectedSchedule,
        [bookedDay, selectedSchedule]
    );

    const bookedAssets = useMemo(
        () => courseAssetsByDate[bookedDay] || selectedAssets,
        [bookedDay, selectedAssets]
    );

    const bookedAsset = useMemo(
        () => bookedAssets.find((item) => item.id === state.bookedCourseAssetId) || bookedAssets[0] || null,
        [bookedAssets, state.bookedCourseAssetId]
    );

    const reviewSessionInfo = useMemo(
        () => ({
            dateLabel: `${bookedSchedule.day}号 ${bookedSchedule.time}`,
            courseTitle: bookedSchedule.courseTitle,
            courseAsset: bookedAsset?.courseName || "未选择课程",
            coachName: bookedAsset?.name || "待分配教练",
            coachTitle: bookedAsset?.title || "",
        }),
        [bookedAsset, bookedSchedule]
    );

    useEffect(() => {
        if (!toastMessage) {
            return undefined;
        }
        const timer = window.setTimeout(() => {
            setToastMessage("");
        }, 1800);
        return () => window.clearTimeout(timer);
    }, [toastMessage]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [state.currentTab, state.bookingStatus]);

    const content = useMemo(() => {
        if (state.currentTab === "club") {
            return (
                <ClubPage
                    onGoGrowth={() => {
                        actions.setTab("growth");
                    }}
                    onToast={(message) => {
                        setToastMessage(message);
                    }}
                />
            );
        }
        if (state.currentTab === "growth") {
            return (
                <GrowthPage
                    onSubmit={() => {
                        setToastMessage("评价已提交，感谢你的反馈");
                    }}
                    onToast={(message) => {
                        setToastMessage(message);
                    }}
                    onDetailPageChange={setHideBottomNav}
                    reviewSessionInfo={reviewSessionInfo}
                />
            );
        }
        if (state.currentTab === "profile") {
            return <ProfilePage />;
        }
        return (
            <BookingPage
                onOpenBookingModal={() => setBookingModalOpen(true)}
                onOpenReviewInvite={() => setReviewInviteOpen(true)}
                onToast={(message) => setToastMessage(message)}
            />
        );
    }, [actions, reviewSessionInfo, state.bookingStatus, state.currentTab]);

    return (
        <div className="app-stage">
            <div className="device-shell">
                <div className="device-glow" aria-hidden="true" />

                <main className={`scroll-main ${hideBottomNav ? "no-bottom-nav" : ""}`} ref={scrollRef}>
                    <div key={viewKey} className="view-shell">
                        {content}
                    </div>
                </main>

                {!hideBottomNav ? (
                    <BottomNav
                        currentTab={state.currentTab}
                        onChange={(tab) => {
                            actions.setTab(tab);
                        }}
                    />
                ) : null}

                <BookingModal
                    open={bookingModalOpen}
                    onCancel={() => setBookingModalOpen(false)}
                    bookingPreview={bookingPreview}
                    onConfirm={() => {
                        actions.bookNow();
                        setBookingModalOpen(false);
                        setToastMessage(`预约成功：${bookingPreview.day}号 ${bookingPreview.slot}`);
                    }}
                />

                <ReviewInviteModal
                    open={reviewInviteOpen}
                    sessionInfo={reviewSessionInfo}
                    onCancel={() => setReviewInviteOpen(false)}
                    onJoin={() => {
                        setReviewInviteOpen(false);
                        actions.setGrowthView("review");
                        actions.setTab("growth");
                        setToastMessage("已进入课后互评，请完成本次课程评价");
                    }}
                />

                <Toast message={toastMessage} />
            </div>
        </div>
    );
}
