export const navItems = [
    { key: "club", label: "进度", icon: "◫" },
    { key: "booking", label: "预约", icon: "◷" },
    { key: "growth", label: "课后", icon: "⌁" },
    { key: "profile", label: "我的", icon: "◉" },
];

/** 「我的」页学院排名主徽章：使用小尺寸本地图，避免解码 6000x6000 原图。 */
export const PROFILE_HERO_BADGE_LOGO_WEBP = "/logo-256.webp";

export const scheduleDates = [
    { dow: "MON", day: 14, time: "09:30-11:00", courseTitle: "短杆触感重建" },
    { dow: "TUE", day: 15, time: "14:30-16:00", courseTitle: "铁杆命中稳定课" },
    { dow: "WED", day: 16, time: "19:00-20:30", courseTitle: "沙坑救球专项" },
    { dow: "THU", day: 17, time: "10:00-11:30", courseTitle: "推杆压力管理" },
    { dow: "FRI", day: 18, time: "16:30-18:00", courseTitle: "实战策略模拟" },
];

export const MAIN_COACH = {
    name: "David Chen",
    initials: "DC",
    title: "PGA 认证高级教练",
    avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
};

/** 「我的」页个人头像。勿使用 Bing 等缩略图外链（防盗链会导致 <img> 加载失败）。 */
export const PROFILE_PORTRAIT_URL =
    "https://th.bing.com/th/id/R.85a1cb435027eb478d54356faf95cf45?rik=huHHDpNFyEx7GA&riu=http%3a%2f%2fimgwcs3.soufunimg.com%2fopen%2f2022_09%2f26%2farticle%2ff5062fc5-abd7-4f49-b5b5-bcad0304023f.jpg&ehk=VoSP%2bR%2bwEpjHyeAAO1pSr%2baJMyvyjpN%2fAeZNiKXvbT8%3d&risl=&pid=ImgRaw&r=0";

export const courseAssetsByDate = {
    14: [
        {
            id: "d14-shortgame-01",
            ...MAIN_COACH,
            time: "09:30-11:00",
            courseName: "短杆·基础班",
            drill: "短杆落点与触感控制",
        },
        {
            id: "d14-shortgame-02",
            ...MAIN_COACH,
            time: "14:30-16:00",
            courseName: "短杆·进阶班",
            drill: "30码内切杆节奏训练",
        },
    ],
    15: [
        {
            id: "d15-wood-01",
            ...MAIN_COACH,
            time: "14:00-15:30",
            courseName: "木杆·专项突击一对一",
            drill: "解决右曲与距离释放",
        },
        {
            id: "d15-iron-01",
            ...MAIN_COACH,
            time: "10:00-11:30",
            courseName: "铁杆·A组",
            drill: "7号铁击球面控制与起草",
        },
        {
            id: "d15-iron-02",
            ...MAIN_COACH,
            time: "14:30-16:00",
            courseName: "铁杆·B组",
            drill: "铁杆重心转移与压缩",
        },
    ],
    16: [
        {
            id: "d16-bunker-01",
            ...MAIN_COACH,
            time: "19:00-20:30",
            courseName: "沙坑·夜训班",
            drill: "起爆点与杆面角度控制",
        },
        {
            id: "d16-bunker-02",
            ...MAIN_COACH,
            time: "10:00-11:30",
            courseName: "沙坑·体能班",
            drill: "下肢爆发与稳定链路训练",
        },
    ],
    17: [
        {
            id: "d17-putting-01",
            ...MAIN_COACH,
            time: "10:00-11:30",
            courseName: "推杆·实战班",
            drill: "高压推杆决策模型构建",
        },
        {
            id: "d17-putting-02",
            ...MAIN_COACH,
            time: "15:00-16:30",
            courseName: "推杆·数据班",
            drill: "坡度阅读与击球速度匹配",
        },
    ],
    18: [
        {
            id: "d18-strategy-01",
            ...MAIN_COACH,
            time: "09:00-11:30",
            courseName: "策略·9洞课",
            drill: "9洞实战：开球与攻果岭选择",
        },
        {
            id: "d18-strategy-02",
            ...MAIN_COACH,
            time: "14:00-16:30",
            courseName: "策略·风场课",
            drill: "逆侧风条件下的落点风险管理",
        },
    ],
};

export const coachesPre = courseAssetsByDate[15];

export const coachInfoCard = {
    ...MAIN_COACH,
    phone: "159 8888 8888",
    bestScore: "66杆 (学员历史最佳)",
    /** 与通知卡片「带队最佳」一行展示一致 */
    bestScoreShort: "66杆",
    status: "上课中",
};

function normalizeTimeRange(s) {
    return String(s).replace(/[\u2013\u2014\u2212]/g, "-").replace(/\s/g, "");
}

/**
 * 预约通知、预约后教练卡片、课后评价课程信息共用同一套展示数据。
 */
export function getSessionDisplay(day, slotId) {
    const slot = slotId ? getSlotById(slotId) : null;
    if (!slot || day == null) {
        return null;
    }
    const assets = courseAssetsByDate[day] || [];
    const slotNorm = normalizeTimeRange(slot.range);
    const match = assets.find((a) => normalizeTimeRange(a.time) === slotNorm);
    const schedule = scheduleDates.find((d) => d.day === day);
    const courseName = match?.courseName ?? schedule?.courseTitle ?? "训练课程";
    const drill = match?.drill ?? "课程内容待教练确认";
    const c = coachInfoCard;
    return {
        courseName,
        drill,
        courseAssetId: match?.id ?? null,
        scheduleDay: day,
        range: slot.range,
        rangeBadgeText: normalizeTimeRange(slot.range).replace(/-/g, "–"),
        coachName: c.name,
        coachTitle: c.title,
        avatarUrl: c.avatarUrl,
        phone: c.phone,
        bestScoreLine: c.bestScore,
        bestScoreShort: c.bestScoreShort ?? c.bestScore,
    };
}

export const coachPost = {
    ...MAIN_COACH,
    desc: "已在球场就绪",
    badge: "等你来",
};

/** 每日 8 个 1.5h 时段：09:30–21:30 */
export const ALL_SLOTS = [
    { id: "slot-0", range: "09:30–11:00", startH: 9, startM: 30 },
    { id: "slot-1", range: "11:00–12:30", startH: 11, startM: 0 },
    { id: "slot-2", range: "12:30–14:00", startH: 12, startM: 30 },
    { id: "slot-3", range: "14:00–15:30", startH: 14, startM: 0 },
    { id: "slot-4", range: "15:30–17:00", startH: 15, startM: 30 },
    { id: "slot-5", range: "17:00–18:30", startH: 17, startM: 0 },
    { id: "slot-6", range: "18:30–20:00", startH: 18, startM: 30 },
    { id: "slot-7", range: "20:00–21:30", startH: 20, startM: 0 },
];

/** 演示：各日可预约时段（其余为不可选） */
export const openSlotsByDate = {
    14: ["slot-0", "slot-2", "slot-3", "slot-5", "slot-7"],
    15: ["slot-1", "slot-2", "slot-4", "slot-6"],
    16: ["slot-0", "slot-3", "slot-4", "slot-5", "slot-7"],
    17: ["slot-1", "slot-2", "slot-5", "slot-6"],
    18: ["slot-0", "slot-2", "slot-4", "slot-7"],
};

export function getSlotById(id) {
    if (!id) {
        return null;
    }
    return ALL_SLOTS.find((s) => s.id === id) || null;
}

/** 课后报告：多媒体占位 kind + 教练点评 coachReview（与 i18n records.* 可对照） */
export const records = [
    {
        id: "r-240328",
        date: "2024年3月28日",
        time: "10:00-11:30",
        type: "skills",
        title: "铁杆·A组",
        drill: "7号铁击球面控制与起草",
        coach: MAIN_COACH.name,
        avatarUrl: MAIN_COACH.avatarUrl,
        note: "命中率达到 8/10，击球重心更稳定。",
        result: "passed",
        target: "目标 7/10",
        advice: "下节课增加逆风条件练习，保持节奏稳定。",
        reportMedia: [{ kind: "image" }, { kind: "image" }],
        coachReview:
            "本节课重点练习 7 号铁杆面角度与击球瞬间的杆身前倾。从 TRACKMAN 与侧面视频看，你的击球点已明显向甜蜜区集中，目标区命中率稳定在 8/10，且送杆时重心能留在左脚内侧，这是非常好的趋势。\n\n建议巩固：继续用「半挥杆—全挥杆」两段式节奏找触感，下节课我们会加入轻度逆风下的弹道管理，请保持今天这种从容的节奏。",
    },
    {
        id: "r-240307",
        date: "2024年3月7日",
        time: "14:30-16:00",
        type: "skills",
        title: "短杆·进阶班",
        drill: "30码内切杆节奏训练",
        coach: MAIN_COACH.name,
        avatarUrl: MAIN_COACH.avatarUrl,
        note: "第一落点控制更集中，落点离散度降低。",
        result: "passed",
        target: "目标 10 球 7 次落点命中",
        advice: "增加不同草况下的切杆触地反馈练习。",
        reportMedia: [{ kind: "video" }, { kind: "image" }],
        coachReview:
            "本场在 30 码内切杆上，你的上杆幅度与杆面释放一致性比去年明显提高：第一落点圆心散布缩小，10 球中 7 球落在预设圆内，达标。\n\n草皮略厚时触地略浅，下次带练时会加入「略早释放、略多送杆」的想象，帮助你在湿草上也能稳定打起球。",
    },
    {
        id: "r-240215",
        date: "2024年2月15日",
        time: "14:30-16:00",
        type: "skills",
        title: "铁杆·B组",
        drill: "铁杆重心转移与压缩",
        coach: MAIN_COACH.name,
        avatarUrl: MAIN_COACH.avatarUrl,
        note: "专注于击球瞬间保持球杆前倾。击球效果和起草提升明显。",
        result: "partial",
        target: "目标 10 球 6 次纯击球",
        advice: "增加慢动作节奏练习，先稳后快。",
        reportMedia: [],
        coachReview:
            "这节课我们盯住铁杆「挤压」与杆身前倾：前 9 球你已经能在慢镜里看到手腕延迟释放，纯击球次数升至 6/10，属于部分达标。\n\n接下来一周请每天做 20 次无球慢挥，只在脑子里回放「左脚踏稳—胸中转向—杆头滞后通过球」三件事。节奏先稳，距离自然会回来。",
    },
];

export const recordFilterItems = [{ key: "skills" }];

export const growthViewItems = [{ key: "tasks" }, { key: "report" }, { key: "review" }];

export const growthOverview = {
    phaseLabel: "提升期 Week 5 / 8",
    phaseProgress: 62,
    weeklyGoal: "本周目标完成 3 / 4",
    streakDays: 11,
    dimensionScores: [
        { key: "体能", score: 84, displayValue: "L4", trend: "+1级" },
        { key: "心理", score: 91, displayValue: "91", trend: "+2" },
        { key: "技能", score: 78, displayValue: "L8", trend: "+1级" },
    ],
    weeklyTrendSeries: {
        irons: [5, 6, 6, 7, 7, 7, 7],
        woods: [4, 5, 5, 5, 6, 6, 6],
        putting: [6, 7, 7, 8, 8, 8, 8],
        scramble: [3, 4, 4, 4, 5, 5, 5],
        wedge: [2, 3, 3, 4, 4, 4, 4],
    },
};

export const practiceTasks = [
    {
        id: "w-2024-week16",
        title: "第 16 周：果岭周边短杆控制",
        categoryKey: "weekly",
        difficultyKey: "challenge",
        publishTime: "2024-04-15 09:00",
        deadline: "2024-04-21 23:59",
        projectItems: [
            "15码内高抛球落点控制 (10次)",
            "沙坑救球出沙率测试 (10次)",
            "核心收紧静力支撑保持"
        ],
        projectRequirements: "本周重点突破果岭边的复杂球位。录制沙坑救球视频时，需清晰展示双脚站位和球杆面的打开程度。文字复盘要求说明沙坑起爆点的击球感受。",
        reward: "短杆控制 +5",
        progress: 0,
        coach: "教练 Alex Rivera",
    },
    {
        id: "w-2024-week15",
        title: "第 15 周：中长铁与下盘稳定",
        categoryKey: "history",
        difficultyKey: "advanced",
        publishTime: "2024-04-08 09:00",
        deadline: "2024-04-14 23:59",
        projectItems: [
            "5号铁飞行弹道控制",
            "7号铁上果岭命中率测试",
            "弹力带髋部驱动发力练习"
        ],
        projectRequirements: "需拍摄正面与侧面的铁杆挥杆视频，重点观察上杆顶点时的下盘稳定性，以及击球瞬间的拍面角度。需附上击球距离数据。",
        reward: "技能熟练 +4",
        progress: 100,
        coach: "教练 David Chen",
    },
    {
        id: "w-2024-week14",
        title: "第 14 周：赛前心态与推杆节奏",
        categoryKey: "history",
        difficultyKey: "basic",
        publishTime: "2024-04-01 09:00",
        deadline: "2024-04-07 23:59",
        projectItems: [
            "3 英尺推杆连续命中演练",
            "赛前10分钟视觉化心理流程"
        ],
        projectRequirements: "主要记录推杆的收杆稳定性。文字复盘请描述在做视觉化流程时的心率感受，并提出需要改善的心理暗示词。",
        reward: "心态专注 +3",
        progress: 100,
        coach: "心理教练 Hannah Cole",
    },
];

export const achievementItems = [
    {
        id: "a-irons",
        rank: "L7",
        label: "铁杆",
        status: "unlocked",
        levelScale: "L1-L9",
        detail: "10球攻目标区：主目标(14码宽)命中记2分，左右次目标(各5码宽)命中记1分。",
        rule: "等级标准(分)：L1=2, L2=3, L3=4, L4=5, L5=6, L6=7, L7=8, L8=9, L9=10。",
        milestone: "距离按学员能力选择 50/75/100/150 码。",
    },
    {
        id: "a-woods",
        rank: "L6",
        label: "木杆",
        status: "progress",
        levelScale: "L1-L9",
        detail: "10次开球，球飞行或滚动穿过30码宽目标门记1分。",
        rule: "等级标准(分)：L1=2, L2=3, L3=4, L4=5, L5=6, L6=7, L7=8, L8=9, L9=10。",
        milestone: "以10球总得分评定当前等级。",
    },
    {
        id: "a-putting",
        rank: "L8",
        label: "推杆",
        status: "unlocked",
        levelScale: "L1-L9",
        detail: "5/10/15英尺各推3球，20英尺推6球，共15推，统计进洞总杆。",
        rule: "等级标准(总杆，越低越高)：L1=25, L2=24, L3=23, L4=22, L5=21, L6=20, L7=19, L8=18, L9=17。",
        milestone: "你的当前成绩已达到 L8 区间。",
    },
    {
        id: "a-scrambling",
        rank: "L5",
        label: "救球",
        status: "progress",
        levelScale: "L1-L9",
        detail: "果岭周边不同距离完成9次切/劈起，每洞计切杆+推杆总杆并汇总。",
        rule: "等级标准(总杆，越低越高)：L1=45, L2=42, L3=39, L4=36, L5=31, L6=28, L7=26, L8=23, L9=21。",
        milestone: "当前总杆处于 L5，继续降低总杆可升段。",
    },
    {
        id: "a-finesse-wedges",
        rank: "L4",
        label: "切杆",
        status: "locked",
        levelScale: "L1-L9",
        detail: "15-40码完成9次切/劈起，落内圈3分、中圈2分、外圈1分。",
        rule: "等级标准(分)：L1=2, L2=3, L3=4, L4=5, L5=6, L6=7, L7=8, L8=9, L9=10。",
        milestone: "待解锁：先完成当前周切杆作业考核。",
    },
];

export const badges = achievementItems.slice(0, 3).map((item) => ({
    rank: item.rank,
    label: item.label,
}));

export const rankingGroups = [
    {
        title: "技能综合排名",
        rank: "NO.4",
        rows: [
            { no: 1, medal: "1", name: "林晓慧", value: "L9" },
            { no: 2, medal: "2", name: "周宇", value: "L9" },
            { no: 3, medal: "3", name: "何漫漫", value: "L9" },
            { no: 4, medal: "4", name: "张逸尘", value: "L8", isSelf: true },
            { no: 5, medal: "5", name: "李建勋", value: "L8" },
            { no: 6, medal: "6", name: "王思雅", value: "L8" },
            { no: 7, medal: "7", name: "陈志豪", value: "L8" },
            { no: 8, medal: "8", name: "高铭宇", value: "L8" },
            { no: 9, medal: "9", name: "孙雨桐", value: "L7" },
            { no: 10, medal: "10", name: "赵可欣", value: "L7" },
            { no: 11, medal: "11", name: "马一凡", value: "L7" },
            { no: 12, medal: "12", name: "蒋浩然", value: "L7" },
            { no: 13, medal: "13", name: "唐若溪", value: "L7" },
            { no: 14, medal: "14", name: "谢君豪", value: "L6" },
            { no: 15, medal: "15", name: "邹安琪", value: "L6" },
            { no: 16, medal: "16", name: "韩子墨", value: "L6" },
            { no: 17, medal: "17", name: "吴欣怡", value: "L6" },
            { no: 18, medal: "18", name: "冯启航", value: "L5" },
            { no: 19, medal: "19", name: "刘若彤", value: "L5" },
            { no: 20, medal: "20", name: "宋嘉树", value: "L5" },
        ],
    },
];

export const ratingLabels = {
    physical: ["LOW", "WARM", "GOOD", "EXCELLENT", "PEAK"],
    mental: ["DISTRACT", "CALM", "FOCUS", "SHARP", "FLOW"],
    skill: ["BASIC", "RISING", "STEADY", "SOLID", "MASTER"],
};

const defaultTaskDoneMap = practiceTasks.reduce((acc, item) => {
    acc[item.id] = item.progress >= 100;
    return acc;
}, {});

export const defaultState = {
    currentTab: "booking",
    bookingStatus: "pre",
    selectedDate: 15,
    selectedCourseAssetId: null,
    /** 已确认的多次预约；单条预约的日期/时段/ISO 均从此读取 */
    bookings: [],
    /** 预约后一级为列表；非 null 时进入某条预约的二级详情 */
    detailBookingId: null,
    ratings: {
        physical: 0,
        mental: 0,
        skill: 0,
        coach: 0,
    },
    reviewText: "",
    growthView: "tasks",
    recordFilter: "skills",
    recordVisibleCount: 4,
    taskDoneMap: defaultTaskDoneMap,
    activeAchievementId: null,
};
