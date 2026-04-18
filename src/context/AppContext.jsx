import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import {
    ALL_SLOTS,
    achievementIds,
    courseAssetsByDate,
    defaultState,
    getSlotById,
    growthViewItems,
    navItems,
    practiceTasks,
    recordFilterItems,
    scheduleDates,
} from "../data/mockData";

const STORAGE_KEY = "academy-react-prototype-state";
const LEGACY_STORAGE_KEY = "academy-prototype-state";
const AUTH_STORAGE_KEY = "academy-react-prototype-auth";

function validRole(role) {
    return role === "parent" ? "parent" : "student";
}

/** 无记录时视为已登录学生，兼容旧版本地数据 */
function hydrateAuth() {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) {
            return { isLoggedIn: true, role: "student" };
        }
        const parsed = JSON.parse(raw);
        return {
            isLoggedIn: parsed.isLoggedIn !== false,
            role: validRole(parsed.role),
        };
    } catch {
        return { isLoggedIn: true, role: "student" };
    }
}

function validTab(tab) {
    if (tab === "booking") {
        return "club";
    }
    return navItems.some((item) => item.key === tab) ? tab : defaultState.currentTab;
}

function validGrowthView(view) {
    return growthViewItems.some((item) => item.key === view) ? view : defaultState.growthView;
}

function validRecordFilter(filter) {
    const normalized = filter === "技能" ? "skills" : filter;
    return recordFilterItems.some((item) => item.key === normalized) ? normalized : defaultState.recordFilter;
}

function validScheduleDay(day, fallback) {
    const num = Number(day);
    return scheduleDates.some((item) => item.day === num) ? num : fallback;
}

const validCourseAssetIds = [
    ...ALL_SLOTS.map((s) => s.id),
    ...Object.values(courseAssetsByDate)
        .flatMap((items) => items)
        .map((item) => item.id),
];

function validCourseAssetId(id, fallback) {
    if (id === null || id === undefined || id === "") {
        return fallback;
    }
    const str = String(id);
    return validCourseAssetIds.includes(str) ? str : fallback;
}

function validRating(value, fallback) {
    const num = Number(value);
    return num >= 0 && num <= 5 ? num : fallback;
}

function validHomeworkTaskId(id) {
    if (id === null || id === undefined || id === "") {
        return null;
    }
    const str = String(id);
    return practiceTasks.some((t) => t.id === str) ? str : null;
}

function validWornAchievementId(raw) {
    if (typeof raw !== "string" || raw === "") {
        return null;
    }
    return achievementIds.includes(raw) ? raw : null;
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

export function buildNextSessionISO(day, slotId) {
    const slot = slotId ? getSlotById(slotId) : null;
    const target = new Date();
    target.setMonth(9);
    target.setDate(day);
    if (slot) {
        target.setHours(slot.startH, slot.startM, 0, 0);
    } else {
        target.setHours(14, 30, 0, 0);
    }
    if (target.getTime() < Date.now()) {
        target.setFullYear(target.getFullYear() + 1);
    }
    return target.toISOString();
}

function makeBookingId() {
    return `bk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeBookingRow(row, fallbackSlot) {
    if (!row || typeof row !== "object") {
        return null;
    }
    const id = typeof row.id === "string" && row.id ? row.id : makeBookingId();
    const day = validScheduleDay(row.day, defaultState.selectedDate);
    const courseAssetId = validCourseAssetId(row.courseAssetId, fallbackSlot);
    const nextSessionISO =
        typeof row.nextSessionISO === "string" && row.nextSessionISO
            ? row.nextSessionISO
            : buildNextSessionISO(day, courseAssetId);
    const courseConfirmedByCoach = row.courseConfirmedByCoach === false ? false : true;
    return { id, day, courseAssetId, nextSessionISO, courseConfirmedByCoach };
}

function hydrateBookings(parsed) {
    if (Array.isArray(parsed.bookings) && parsed.bookings.length) {
        return parsed.bookings.map((r) => normalizeBookingRow(r, "slot-3")).filter(Boolean);
    }
    if (parsed.bookingStatus === "booked") {
        const legacyDay = validScheduleDay(parsed.bookedDate ?? parsed.selectedDate, defaultState.selectedDate);
        const legacySlot = validCourseAssetId(parsed.bookedCourseAssetId ?? parsed.selectedCourseAssetId, "slot-3");
        const iso = parsed.nextSessionISO || buildNextSessionISO(legacyDay, legacySlot);
        const row = normalizeBookingRow(
            {
                id: makeBookingId(),
                day: legacyDay,
                courseAssetId: legacySlot,
                nextSessionISO: iso,
                courseConfirmedByCoach: true,
            },
            "slot-3"
        );
        return row ? [row] : [];
    }
    return [];
}

function pushBooking(state, day, courseAssetId) {
    const slotId = validCourseAssetId(courseAssetId, "slot-3");
    const d = validScheduleDay(day, state.selectedDate);
    const id = makeBookingId();
    const iso = buildNextSessionISO(d, slotId);
    return {
        ...state,
        bookingStatus: "booked",
        bookings: [
            ...state.bookings,
            { id, day: d, courseAssetId: slotId, nextSessionISO: iso, courseConfirmedByCoach: false },
        ],
        detailBookingId: null,
    };
}

function hydrateState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (!raw) {
            return defaultState;
        }
        const parsed = JSON.parse(raw);
        const bookings = hydrateBookings(parsed);
        const detailBookingId =
            typeof parsed.detailBookingId === "string" && bookings.some((b) => b.id === parsed.detailBookingId)
                ? parsed.detailBookingId
                : null;
        return {
            currentTab: validTab(parsed.currentTab),
            clubOpenBooking: false,
            bookingStatus: parsed.bookingStatus === "booked" ? "booked" : "pre",
            selectedDate: validScheduleDay(parsed.selectedDate, defaultState.selectedDate),
            selectedCourseAssetId: (() => {
                const rawId = parsed.selectedCourseAssetId;
                if (rawId === null || rawId === undefined || rawId === "") {
                    return defaultState.selectedCourseAssetId;
                }
                const id = String(rawId);
                return validCourseAssetIds.includes(id) ? id : null;
            })(),
            bookings,
            detailBookingId,
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
            wornAchievementId: validWornAchievementId(parsed.wornAchievementId),
            pendingHomeworkTaskId: null,
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
                if (state.bookings.length === 0) {
                    return pushBooking(state, state.selectedDate, state.selectedCourseAssetId);
                }
                return { ...state, bookingStatus: "booked" };
            }
            return { ...state, bookingStatus: "pre" };
        }
        case "SET_DETAIL_BOOKING":
            return {
                ...state,
                detailBookingId:
                    typeof action.payload === "string" && state.bookings.some((b) => b.id === action.payload)
                        ? action.payload
                        : null,
            };
        case "SET_SELECTED_DATE":
            return { ...state, selectedDate: Number(action.payload) || state.selectedDate };
        case "SET_SELECTED_COURSE_ASSET":
            if (action.payload === null || action.payload === undefined) {
                return { ...state, selectedCourseAssetId: null };
            }
            return {
                ...state,
                selectedCourseAssetId: validCourseAssetId(action.payload, state.selectedCourseAssetId),
            };
        case "SET_NEXT_SESSION": {
            const iso = action.payload;
            if (!iso || !state.detailBookingId) {
                return state;
            }
            return {
                ...state,
                bookings: state.bookings.map((b) =>
                    b.id === state.detailBookingId ? { ...b, nextSessionISO: iso } : b
                ),
            };
        }
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
        case "SET_PENDING_HOMEWORK_TASK": {
            if (action.payload === null || action.payload === undefined || action.payload === "") {
                return { ...state, pendingHomeworkTaskId: null };
            }
            const tid = validHomeworkTaskId(action.payload);
            return { ...state, pendingHomeworkTaskId: tid };
        }
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
        case "SET_WORN_ACHIEVEMENT": {
            if (action.payload === null || action.payload === undefined || action.payload === "") {
                return { ...state, wornAchievementId: null };
            }
            const wid = String(action.payload);
            return {
                ...state,
                wornAchievementId: achievementIds.includes(wid) ? wid : null,
            };
        }
        case "BOOK_NOW": {
            const next = pushBooking(state, state.selectedDate, state.selectedCourseAssetId);
            return { ...next, currentTab: "club", clubOpenBooking: true };
        }
        case "CLEAR_CLUB_OPEN_BOOKING":
            return { ...state, clubOpenBooking: false };
        case "SET_BOOKING_COURSE_CONFIRMED": {
            const id = action.payload?.id;
            if (!id) {
                return state;
            }
            const confirmed = Boolean(action.payload?.confirmed);
            return {
                ...state,
                bookings: state.bookings.map((b) =>
                    b.id === id ? { ...b, courseConfirmedByCoach: confirmed } : b
                ),
            };
        }
        case "LOGIN":
            return {
                ...state,
                auth: {
                    isLoggedIn: true,
                    role: validRole(action.payload?.role),
                },
            };
        case "LOGOUT":
            return {
                ...state,
                auth: {
                    ...state.auth,
                    isLoggedIn: false,
                },
            };
        default:
            return state;
    }
}

function hydrateFullState() {
    return {
        ...hydrateState(),
        auth: hydrateAuth(),
    };
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, defaultState, hydrateFullState);

    useEffect(() => {
        const { auth: _a, ...rest } = state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    }, [state]);

    useEffect(() => {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.auth));
    }, [state.auth]);

    // Preload heavy assets globally to prevent animation pop-in
    useEffect(() => {
        const preloadImage = new Image();
        preloadImage.src = "/logo.webp";
    }, []);

    const actions = useMemo(
        () => ({
            setTab: (tab) => dispatch({ type: "SET_TAB", payload: tab }),
            setBookingStatus: (status) => dispatch({ type: "SET_BOOKING_STATUS", payload: status }),
            setSelectedDate: (day) => dispatch({ type: "SET_SELECTED_DATE", payload: day }),
            setSelectedCourseAsset: (assetId) => dispatch({ type: "SET_SELECTED_COURSE_ASSET", payload: assetId }),
            setNextSession: (iso) => dispatch({ type: "SET_NEXT_SESSION", payload: iso }),
            setDetailBooking: (id) => dispatch({ type: "SET_DETAIL_BOOKING", payload: id }),
            setRating: (group, value) => dispatch({ type: "SET_RATING", group, value }),
            setReviewText: (text) => dispatch({ type: "SET_REVIEW_TEXT", payload: text }),
            setGrowthView: (view) => dispatch({ type: "SET_GROWTH_VIEW", payload: view }),
            setPendingHomeworkTask: (taskId) => dispatch({ type: "SET_PENDING_HOMEWORK_TASK", payload: taskId }),
            setRecordFilter: (filter) => dispatch({ type: "SET_RECORD_FILTER", payload: filter }),
            loadMoreRecords: () => dispatch({ type: "LOAD_MORE_RECORDS" }),
            toggleTaskDone: (taskId) => dispatch({ type: "TOGGLE_TASK_DONE", taskId }),
            setTaskDone: (taskId, done) => dispatch({ type: "SET_TASK_DONE", taskId, done }),
            openAchievement: (id) => dispatch({ type: "SET_ACHIEVEMENT_MODAL", payload: id }),
            closeAchievement: () => dispatch({ type: "SET_ACHIEVEMENT_MODAL", payload: null }),
            setWornAchievement: (id) => dispatch({ type: "SET_WORN_ACHIEVEMENT", payload: id }),
            clearWornAchievement: () => dispatch({ type: "SET_WORN_ACHIEVEMENT", payload: null }),
            bookNow: () => dispatch({ type: "BOOK_NOW" }),
            clearClubOpenBooking: () => dispatch({ type: "CLEAR_CLUB_OPEN_BOOKING" }),
            setBookingCourseConfirmed: (id, confirmed) =>
                dispatch({ type: "SET_BOOKING_COURSE_CONFIRMED", payload: { id, confirmed } }),
            login: (role) => dispatch({ type: "LOGIN", payload: { role } }),
            logout: () => dispatch({ type: "LOGOUT" }),
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

/** 即将上课优先：用于课后评价等与「当前一节课」相关的展示 */
export function sortBookingsByTime(bookings) {
    return [...bookings].sort((a, b) => new Date(a.nextSessionISO) - new Date(b.nextSessionISO));
}

export function pickReviewBooking(state) {
    const sorted = sortBookingsByTime(state.bookings);
    if (state.detailBookingId) {
        const d = sorted.find((b) => b.id === state.detailBookingId);
        if (d) {
            return d;
        }
    }
    return sorted[0] ?? null;
}
