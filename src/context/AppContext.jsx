import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { courseAssetsByDate, defaultState, growthViewItems, navItems, practiceTasks, recordFilterItems, scheduleDates } from "../data/mockData";

const STORAGE_KEY = "academy-react-prototype-state";
const LEGACY_STORAGE_KEY = "academy-prototype-state";

function validTab(tab) {
    return navItems.some((item) => item.key === tab) ? tab : defaultState.currentTab;
}

function validGrowthView(view) {
    return growthViewItems.some((item) => item.key === view) ? view : defaultState.growthView;
}

function validRecordFilter(filter) {
    return recordFilterItems.some((item) => item.key === filter) ? filter : defaultState.recordFilter;
}

function validScheduleDay(day, fallback) {
    const num = Number(day);
    return scheduleDates.some((item) => item.day === num) ? num : fallback;
}

const validCourseAssetIds = Object.values(courseAssetsByDate)
    .flatMap((items) => items)
    .map((item) => item.id);

function validCourseAssetId(id, fallback) {
    return validCourseAssetIds.includes(id) ? id : fallback;
}

function validRating(value, fallback) {
    const num = Number(value);
    return num >= 0 && num <= 5 ? num : fallback;
}

function sanitizeTaskDoneMap(input) {
    const baseMap = { ...defaultState.taskDoneMap };
    if (!input || typeof input !== "object") {
        return baseMap;
    }

    practiceTasks.forEach((task) => {
        const value = input[task.id];
        if (typeof value === "boolean") {
            baseMap[task.id] = value;
        }
    });

    return baseMap;
}

export function buildNextSessionISO(day) {
    const target = new Date();
    target.setMonth(9);
    target.setDate(day);
    target.setHours(14, 30, 0, 0);
    if (target.getTime() < Date.now()) {
        target.setFullYear(target.getFullYear() + 1);
    }
    return target.toISOString();
}

function hydrateState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (!raw) {
            return defaultState;
        }
        const parsed = JSON.parse(raw);
        return {
            currentTab: validTab(parsed.currentTab),
            bookingStatus: parsed.bookingStatus === "booked" ? "booked" : "pre",
            selectedDate: validScheduleDay(parsed.selectedDate, defaultState.selectedDate),
            bookedDate: validScheduleDay(parsed.bookedDate ?? parsed.selectedDate, defaultState.bookedDate),
            selectedCourseAssetId: validCourseAssetId(parsed.selectedCourseAssetId, defaultState.selectedCourseAssetId),
            bookedCourseAssetId: validCourseAssetId(parsed.bookedCourseAssetId ?? parsed.selectedCourseAssetId, defaultState.bookedCourseAssetId),
            nextSessionISO: parsed.nextSessionISO || defaultState.nextSessionISO,
            ratings: {
                physical: validRating(parsed.ratings?.physical, defaultState.ratings.physical),
                mental: validRating(parsed.ratings?.mental, defaultState.ratings.mental),
                skill: validRating(parsed.ratings?.skill, defaultState.ratings.skill),
                coach: validRating(parsed.ratings?.coach, defaultState.ratings.coach),
            },
            reviewText: typeof parsed.reviewText === "string" ? parsed.reviewText : "",
            growthView: validGrowthView(parsed.growthView),
            recordFilter: validRecordFilter(parsed.recordFilter),
            recordVisibleCount: Number(parsed.recordVisibleCount) > 0 ? Number(parsed.recordVisibleCount) : defaultState.recordVisibleCount,
            taskDoneMap: sanitizeTaskDoneMap(parsed.taskDoneMap),
            activeAchievementId: typeof parsed.activeAchievementId === "string" ? parsed.activeAchievementId : null,
        };
    } catch {
        return defaultState;
    }
}

function appReducer(state, action) {
    switch (action.type) {
        case "SET_TAB":
            return { ...state, currentTab: validTab(action.payload) };
        case "SET_BOOKING_STATUS": {
            const nextStatus = action.payload === "booked" ? "booked" : "pre";
            if (nextStatus === "booked") {
                return {
                    ...state,
                    bookingStatus: "booked",
                    bookedDate: state.selectedDate,
                    bookedCourseAssetId: state.selectedCourseAssetId,
                    nextSessionISO: buildNextSessionISO(state.selectedDate),
                };
            }
            return { ...state, bookingStatus: "pre" };
        }
        case "SET_SELECTED_DATE":
            return { ...state, selectedDate: Number(action.payload) || state.selectedDate };
        case "SET_SELECTED_COURSE_ASSET":
            return {
                ...state,
                selectedCourseAssetId: validCourseAssetId(action.payload, state.selectedCourseAssetId),
            };
        case "SET_NEXT_SESSION":
            return { ...state, nextSessionISO: action.payload || state.nextSessionISO };
        case "SET_RATING":
            return {
                ...state,
                ratings: {
                    ...state.ratings,
                    [action.group]: validRating(action.value, state.ratings[action.group] ?? 3),
                },
            };
        case "SET_REVIEW_TEXT":
            return { ...state, reviewText: action.payload };
        case "SET_GROWTH_VIEW":
            return { ...state, growthView: validGrowthView(action.payload) };
        case "SET_RECORD_FILTER":
            return {
                ...state,
                recordFilter: validRecordFilter(action.payload),
                recordVisibleCount: defaultState.recordVisibleCount,
            };
        case "LOAD_MORE_RECORDS":
            return {
                ...state,
                recordVisibleCount: state.recordVisibleCount + 4,
            };
        case "TOGGLE_TASK_DONE": {
            if (!action.taskId) {
                return state;
            }
            return {
                ...state,
                taskDoneMap: {
                    ...state.taskDoneMap,
                    [action.taskId]: !state.taskDoneMap[action.taskId],
                },
            };
        }
        case "SET_TASK_DONE": {
            if (!action.taskId) {
                return state;
            }
            return {
                ...state,
                taskDoneMap: {
                    ...state.taskDoneMap,
                    [action.taskId]: Boolean(action.done),
                },
            };
        }
        case "SET_ACHIEVEMENT_MODAL":
            return {
                ...state,
                activeAchievementId: action.payload || null,
            };
        case "BOOK_NOW":
            return {
                ...state,
                bookingStatus: "booked",
                currentTab: "booking",
                bookedDate: state.selectedDate,
                bookedCourseAssetId: state.selectedCourseAssetId,
                nextSessionISO: buildNextSessionISO(state.selectedDate),
            };
        default:
            return state;
    }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, defaultState, hydrateState);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const actions = useMemo(
        () => ({
            setTab: (tab) => dispatch({ type: "SET_TAB", payload: tab }),
            setBookingStatus: (status) => dispatch({ type: "SET_BOOKING_STATUS", payload: status }),
            setSelectedDate: (day) => dispatch({ type: "SET_SELECTED_DATE", payload: day }),
            setSelectedCourseAsset: (assetId) => dispatch({ type: "SET_SELECTED_COURSE_ASSET", payload: assetId }),
            setNextSession: (iso) => dispatch({ type: "SET_NEXT_SESSION", payload: iso }),
            setRating: (group, value) => dispatch({ type: "SET_RATING", group, value }),
            setReviewText: (text) => dispatch({ type: "SET_REVIEW_TEXT", payload: text }),
            setGrowthView: (view) => dispatch({ type: "SET_GROWTH_VIEW", payload: view }),
            setRecordFilter: (filter) => dispatch({ type: "SET_RECORD_FILTER", payload: filter }),
            loadMoreRecords: () => dispatch({ type: "LOAD_MORE_RECORDS" }),
            toggleTaskDone: (taskId) => dispatch({ type: "TOGGLE_TASK_DONE", taskId }),
            setTaskDone: (taskId, done) => dispatch({ type: "SET_TASK_DONE", taskId, done }),
            openAchievement: (id) => dispatch({ type: "SET_ACHIEVEMENT_MODAL", payload: id }),
            closeAchievement: () => dispatch({ type: "SET_ACHIEVEMENT_MODAL", payload: null }),
            bookNow: () => dispatch({ type: "BOOK_NOW" }),
        }),
        []
    );

    return <AppContext.Provider value={{ state, actions }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error("useAppContext must be used within AppProvider");
    }
    return ctx;
}
