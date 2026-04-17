import { useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "./components/BottomNav";
import BookingModal from "./components/BookingModal";
import Toast from "./components/Toast";
import { pickReviewBooking, useAppContext } from "./context/AppContext";
import { getSessionDisplay, getSlotById, scheduleDates } from "./data/mockData";
import BookingPage from "./pages/BookingPage";
import ClubPage from "./pages/ClubPage";
import GrowthPage from "./pages/GrowthPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { useTranslation } from "react-i18next";

const TAB_ORDER = ["club", "booking", "growth", "profile"];

export default function App() {
    const { i18n, t } = useTranslation();
    const { state, actions } = useAppContext();
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [hideBottomNav, setHideBottomNav] = useState(false);
    const [slideDir, setSlideDir] = useState("");
    const scrollRef = useRef(null);

    const viewKey = `${state.currentTab}-${state.currentTab === "booking" ? `${state.bookingStatus}-${state.detailBookingId ?? "list"}` : "stable"}`;
    const selectedSchedule = useMemo(
        () => scheduleDates.find((item) => item.day === state.selectedDate) || scheduleDates[0],
        [state.selectedDate]
    );

    const selectedSlot = useMemo(
        () => (state.selectedCourseAssetId ? getSlotById(state.selectedCourseAssetId) : null),
        [state.selectedCourseAssetId]
    );

    const bookingPreview = useMemo(
        () => ({
            day: selectedSchedule.day,
            slot: selectedSlot?.range ?? "—",
            courseTitle: t("booking.modal.pendingTopic"),
        }),
        [selectedSchedule.day, selectedSlot, t]
    );

    const reviewBooking = useMemo(() => pickReviewBooking(state), [state]);

    const bookedDay = reviewBooking?.day ?? state.selectedDate;

    const bookedSchedule = useMemo(
        () => scheduleDates.find((item) => item.day === bookedDay) || selectedSchedule,
        [bookedDay, selectedSchedule]
    );

    const bookedSlot = useMemo(() => getSlotById(reviewBooking?.courseAssetId), [reviewBooking?.courseAssetId]);

    const bookedSessionDisplay = useMemo(() => {
        if (!reviewBooking) {
            return null;
        }
        const raw = getSessionDisplay(reviewBooking.day, reviewBooking.courseAssetId);
        if (!raw) {
            return null;
        }
        if (reviewBooking.courseConfirmedByCoach === false) {
            return {
                ...raw,
                courseName: t("booking.courseTitleUnknown"),
                drill: t("growth.pendingCourseTopic", { defaultValue: raw.drill }),
            };
        }
        return raw;
    }, [reviewBooking, t]);

    const reviewSessionInfo = useMemo(() => {
        const dateLabel = t("growth.sessionDateLabel", {
            day: bookedSchedule.day,
            time: bookedSlot?.range ?? bookedSchedule.time,
        });
        if (!bookedSessionDisplay) {
            return {
                dateLabel,
                courseName: null,
                drill: null,
                range: null,
                coachName: null,
                coachTitle: null,
                avatarUrl: null,
                phone: null,
                bestScoreShort: null,
            };
        }
        return { ...bookedSessionDisplay, dateLabel };
    }, [bookedSchedule.day, bookedSchedule.time, bookedSlot, bookedSessionDisplay, t]);

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
    }, [state.currentTab, state.bookingStatus, state.detailBookingId]);

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
                        setToastMessage(t("growth.submitReviewToast"));
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
            return <ProfilePage onToast={(message) => setToastMessage(message)} />;
        }
        return (
            <BookingPage
                onOpenBookingModal={() => setBookingModalOpen(true)}
                onToast={(message) => setToastMessage(message)}
            />
        );
    }, [actions, reviewSessionInfo, state.bookingStatus, state.currentTab, state.detailBookingId, t]);

    if (!state.auth.isLoggedIn) {
        return (
            <div className={`app-stage ${i18n.resolvedLanguage === "en" ? "locale-en" : "locale-zh"}`}>
                <LoginPage />
            </div>
        );
    }

    return (
        <div className={`app-stage ${i18n.resolvedLanguage === "en" ? "locale-en" : "locale-zh"}`}>
            <div className="device-shell">
                <div className="device-glow" aria-hidden="true" />

                <main className={`scroll-main ${hideBottomNav ? "no-bottom-nav" : ""}`} ref={scrollRef}>
                    <div key={viewKey} className={`view-shell${slideDir ? ` ${slideDir}` : ""}`}>
                        {content}
                    </div>
                </main>

                {!hideBottomNav ? (
                    <BottomNav
                        currentTab={state.currentTab}
                        onChange={(tab) => {
                            const prev = TAB_ORDER.indexOf(state.currentTab);
                            const next = TAB_ORDER.indexOf(tab);
                            setSlideDir(next > prev ? "slide-from-right" : "slide-from-left");
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
                        setToastMessage(t("booking.modal.successToast", { day: bookingPreview.day, slot: bookingPreview.slot }));
                    }}
                />

                <Toast message={toastMessage} />
            </div>
        </div>
    );
}
