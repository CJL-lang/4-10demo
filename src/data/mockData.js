export const navItems = [
    { key: "club", label: "进度", icon: "◫" },
    { key: "messages", label: "消息", icon: "✉" },
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
        liveFeedEntries: [
            {
                id: "rr-240328-3",
                timestamp: "10:52",
                type: "text",
                content: "击球点稳定回到甜蜜区，7号铁方向控制明显更收敛。",
                coachName: MAIN_COACH.name,
            },
            {
                id: "rr-240328-2",
                timestamp: "10:36",
                type: "image",
                content: "侧面动作抓拍：送杆更完整，重心留在左侧更自然。",
                coachName: MAIN_COACH.name,
            },
            {
                id: "rr-240328-1",
                timestamp: "10:12",
                type: "text",
                content: "完成热身后进入7号铁目标区练习，今天节奏进入状态很快。",
                coachName: MAIN_COACH.name,
            },
        ],
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
        liveFeedEntries: [
            {
                id: "rr-240307-3",
                timestamp: "15:18",
                type: "text",
                content: "切杆第一落点更集中，连续几球都能落进预设圈内。",
                coachName: MAIN_COACH.name,
            },
            {
                id: "rr-240307-2",
                timestamp: "14:58",
                type: "video",
                content: "短视频记录：厚草位切杆时，出杆节奏比上次更顺。",
                coachName: MAIN_COACH.name,
            },
            {
                id: "rr-240307-1",
                timestamp: "14:37",
                type: "text",
                content: "已开始30码内切杆节奏训练，今天触地反馈整体不错。",
                coachName: MAIN_COACH.name,
            },
        ],
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
        liveFeedEntries: [
            {
                id: "rr-240215-3",
                timestamp: "15:05",
                type: "text",
                content: "纯击球次数已经来到6/10，压缩感开始稳定出现。",
                coachName: MAIN_COACH.name,
            },
            {
                id: "rr-240215-2",
                timestamp: "14:42",
                type: "text",
                content: "下盘启动更清楚，但出杆前半段还需要再慢一点。",
                coachName: MAIN_COACH.name,
            },
            {
                id: "rr-240215-1",
                timestamp: "14:16",
                type: "text",
                content: "进入铁杆重心转移练习，先用慢挥确认杆身前倾感觉。",
                coachName: MAIN_COACH.name,
            },
        ],
        coachReview:
            "这节课我们盯住铁杆「挤压」与杆身前倾：前 9 球你已经能在慢镜里看到手腕延迟释放，纯击球次数升至 6/10，属于部分达标。\n\n接下来一周请每天做 20 次无球慢挥，只在脑子里回放「左脚踏稳—胸中转向—杆头滞后通过球」三件事。节奏先稳，距离自然会回来。",
    },
];

/** 家长端「课堂实时动态」本节课卡片：与预约通知同一套 session 数据（4/16 演示对齐木杆 14:00 时段）。 */
export const liveFeedCourseSession = getSessionDisplay(15, "slot-3");

export const liveFeedData = [
    {
        id: "lf-3",
        timestamp: "14:45",
        type: "text",
        content: "纠正了下杆节奏，右曲情况有明显改善，击球更扎实了。",
        coachName: "David Chen",
    },
    {
        id: "lf-2",
        timestamp: "14:30",
        type: "image",
        content: "挥杆动作抓拍：重心转移比上节课更流畅。",
        coachName: "David Chen",
    },
    {
        id: "lf-1",
        timestamp: "14:15",
        type: "text",
        content: "热身完毕，今天状态不错，准备开始木杆练习。",
        coachName: "David Chen",
    }
];

export const recordFilterItems = [{ key: "skills" }];

export const growthViewItems = [{ key: "tasks" }, { key: "report" }, { key: "review" }];

/** 进度页六项测评：雷达/图例强调色（统一金色系，与主题 primary 同族） */
export const assessmentSlideColors = {
    swingMechanics: "var(--primary)",
    shortGame: "#f5c84a",
    putting: "#ffd78a",
    physical: "#e8b032",
    mental: "#ffc668",
    courseManagement: "#f4d58d",
};

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
    assessmentSlides: [
        {
            id: "swingMechanics",
            items: [
                { key: "grip", score: 8 },
                { key: "stance", score: 7 },
                { key: "backswing", score: 7 },
                { key: "downswing", score: 6 },
                { key: "impact", score: 8 },
                { key: "followThrough", score: 7 },
            ],
        },
        {
            id: "shortGame",
            items: [
                { key: "chip", score: 7 },
                { key: "pitch", score: 6 },
                { key: "bunker", score: 5 },
            ],
        },
        {
            id: "putting",
            items: [
                { key: "distanceControl", score: 8 },
                { key: "directionControl", score: 7 },
                { key: "greenReading", score: 6 },
            ],
        },
        {
            id: "physical",
            items: [
                { key: "flexibility", score: 7 },
                { key: "coreStrength", score: 6 },
                { key: "balance", score: 8 },
                { key: "power", score: 5 },
            ],
        },
        {
            id: "mental",
            items: [
                { key: "focus", score: 8 },
                { key: "pressure", score: 6 },
                { key: "competitionMindset", score: 7 },
            ],
        },
        {
            id: "courseManagement",
            items: [
                { key: "strategy", score: 7 },
                { key: "riskAssessment", score: 6 },
            ],
        },
    ],
    /** 旧版「技能趋势」轮播：五项技能 × D1–D7 等级曲线（演示数据） */
    weeklyTrendSeries: {
        irons: [5, 6, 6, 7, 7, 7, 7],
        woods: [4, 5, 5, 5, 6, 6, 6],
        putting: [6, 7, 7, 8, 8, 8, 8],
        scramble: [3, 4, 4, 4, 5, 5, 5],
        wedge: [2, 3, 3, 4, 4, 4, 4],
    },
};

/** Club 测评记录列表/详情演示数据（维度 id、子项 key 与 progressAssessment 对齐） */
export const assessmentHistoryRecords = [
    {
        id: "ar-rec-1",
        i18nSlug: "r1",
        dateIso: "2024-03-28T14:30:00",
        coach: { ...MAIN_COACH },
        dimensions: [
            {
                id: "swingMechanics",
                items: [
                    { key: "grip", score: 8 },
                    { key: "stance", score: 7 },
                    { key: "backswing", score: 7 },
                    { key: "downswing", score: 6 },
                    { key: "impact", score: 8 },
                    { key: "followThrough", score: 7 },
                ],
            },
            {
                id: "shortGame",
                items: [
                    { key: "chip", score: 7 },
                    { key: "pitch", score: 6 },
                    { key: "bunker", score: 5 },
                ],
            },
            {
                id: "putting",
                items: [
                    { key: "distanceControl", score: 8 },
                    { key: "directionControl", score: 7 },
                    { key: "greenReading", score: 6 },
                ],
            },
            {
                id: "physical",
                items: [
                    { key: "flexibility", score: 7 },
                    { key: "coreStrength", score: 6 },
                    { key: "balance", score: 8 },
                    { key: "power", score: 5 },
                ],
            },
        ],
    },
    {
        id: "ar-rec-2",
        i18nSlug: "r2",
        dateIso: "2024-03-15T10:00:00",
        coach: { ...MAIN_COACH },
        dimensions: [
            {
                id: "swingMechanics",
                items: [
                    { key: "grip", score: 7 },
                    { key: "stance", score: 8 },
                    { key: "impact", score: 7 },
                ],
            },
            {
                id: "mental",
                items: [
                    { key: "focus", score: 8 },
                    { key: "pressure", score: 6 },
                    { key: "competitionMindset", score: 7 },
                ],
            },
            {
                id: "courseManagement",
                items: [
                    { key: "strategy", score: 7 },
                    { key: "riskAssessment", score: 6 },
                ],
            },
        ],
    },
    {
        id: "ar-rec-3",
        i18nSlug: "r3",
        dateIso: "2024-02-28T16:00:00",
        coach: { ...MAIN_COACH },
        dimensions: [
            {
                id: "putting",
                items: [
                    { key: "distanceControl", score: 7 },
                    { key: "directionControl", score: 8 },
                    { key: "greenReading", score: 7 },
                ],
            },
            {
                id: "shortGame",
                items: [
                    { key: "chip", score: 8 },
                    { key: "pitch", score: 7 },
                    { key: "bunker", score: 6 },
                ],
            },
        ],
    },
];

export function getAssessmentRecordById(recordId) {
    return assessmentHistoryRecords.find((r) => r.id === recordId) ?? null;
}

/** 课后作业 / 课后报告列表与详情共用；与 records[].id 通过 recordId 对齐（课程记录「打开作业」） */
export const practiceTasks = [
    {
        id: "w-iron-a-240328",
        recordId: "r-240328",
        title: "铁杆·A组",
        titleEn: "Irons · Group A",
        publishTime: "2024-03-28 12:00",
        deadline: "2024-04-05 23:59",
        sessionDate: "2024年3月28日",
        sessionDateEn: "Mar 28, 2024",
        sessionTime: "10:00–11:30",
        drillTopic: "专项: 7号铁击球面控制与起草",
        drillTopicEn: "Focus: 7-iron face control and turf interaction",
        coachTitle: "主教练",
        coach: MAIN_COACH.name,
        avatarUrl: MAIN_COACH.avatarUrl,
        coachNote: "命中率达到 8/10，击球重心更稳定。",
        coachNoteEn: "Hit rate 8/10; strike-centeredness is steadier.",
        category: "课后作业",
        difficulty: "技能",
        projectItems: [
            "7号铁击球面角度自检（连续 10 球）",
            "草痕方向与深浅记录（视频+标注）",
            "击球重心偏移复盘（文字或语音）",
        ],
        projectRequirements:
            "视频需包含杆面朝向与草痕特写；复盘需说明至少两次节奏失衡的原因与调整。",
        reward: "",
        progress: 0,
    },
    {
        id: "w-short-adv-240307",
        recordId: "r-240307",
        title: "短杆·进阶班",
        titleEn: "Short game · Advanced",
        publishTime: "2024-03-07 16:00",
        deadline: "2024-03-20 23:59",
        sessionDate: "2024年3月7日",
        sessionDateEn: "Mar 7, 2024",
        sessionTime: "14:30–16:00",
        drillTopic: "专项: 30码内切杆节奏训练",
        drillTopicEn: "Focus: chipping rhythm inside 30 yards",
        coachTitle: "主教练",
        coach: MAIN_COACH.name,
        avatarUrl: MAIN_COACH.avatarUrl,
        coachNote: "第一落点控制更集中，落点离散度降低。",
        coachNoteEn: "First bounce tighter; landing dispersion improved.",
        category: "课后作业",
        difficulty: "技能",
        projectItems: [
            "30码内切杆节奏 10 球落区统计",
            "厚草与薄草位各 5 球触地反馈记录",
            "节奏口令与呼吸配合复盘",
        ],
        projectRequirements: "请上传侧面与正面的切杆视频；文字复盘需写出两次节奏断点的自我感受。",
        reward: "",
        progress: 100,
    },
    {
        id: "w-iron-b-240215",
        recordId: "r-240215",
        title: "铁杆·B组",
        titleEn: "Irons · Group B",
        publishTime: "2024-02-15 16:00",
        deadline: "2024-02-28 23:59",
        sessionDate: "2024年2月15日",
        sessionDateEn: "Feb 15, 2024",
        sessionTime: "14:30–16:00",
        drillTopic: "专项: 铁杆重心转移与压缩",
        drillTopicEn: "Focus: iron weight shift and compression",
        coachTitle: "主教练",
        coach: MAIN_COACH.name,
        avatarUrl: MAIN_COACH.avatarUrl,
        coachNote: "专注于击球瞬间保持球杆前倾。击球效果和起草提升明显。",
        coachNoteEn: "Focused on shaft lean at impact; ball striking and turf interaction improved.",
        category: "课后作业",
        difficulty: "技能",
        projectItems: [
            "慢挥杆确认杆身前倾与重心转移",
            "10 球纯击球与起草质量自检",
            "TRACKMAN 或落点数据截图（可选）",
        ],
        projectRequirements: "视频需能看到击球后草痕；复盘说明重心转移时常见的卡顿点。",
        reward: "",
        progress: 100,
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

/**
 * 测评记录六项维度勋章（演示数据；不参与佩戴选择，刻度 L1-L10）
 * dimensionKey 对齐 i18n `progressAssessment.*`
 */
export const dimensionMedalItems = [
    { id: "dim-swingMechanics", dimensionKey: "swingMechanics", rank: "L6", levelScale: "L1-L10" },
    { id: "dim-shortGame", dimensionKey: "shortGame", rank: "L7", levelScale: "L1-L10" },
    { id: "dim-putting", dimensionKey: "putting", rank: "L8", levelScale: "L1-L10" },
    { id: "dim-physical", dimensionKey: "physical", rank: "L5", levelScale: "L1-L10" },
    { id: "dim-mental", dimensionKey: "mental", rank: "L7", levelScale: "L1-L10" },
    { id: "dim-courseManagement", dimensionKey: "courseManagement", rank: "L6", levelScale: "L1-L10" },
];

/** Profile「佩戴勋章」等校验用 */
export const achievementIds = achievementItems.map((item) => item.id);

export const badges = achievementItems.slice(0, 3).map((item) => ({
    rank: item.rank,
    label: item.label,
}));

/** 「我的套餐」学生端详情演示数据：保留核心字段，并为重排补充概览/入口信息。 */
export const studentPackages = [
    {
        id: "pkg-foundation-enlightenment",
        name: "基础高尔夫启蒙套餐",
        period: {
            start: "2025.09.01",
            end: "2026.02.28",
        },
        status: {
            label: "已结业",
            tone: "success",
            statusKind: "graduated",
        },
        overview: {
            completedLessons: 12,
            totalLessons: 12,
            partnerCount: 2,
            attendanceLabel: "90%",
            attendanceDetail: "10/12节",
        },
        planSummary: {
            title: "核心提升计划",
            description: "共包含 12 节系统性课程，当前进度 12/12。",
        },
        courseOutline: [
            {
                id: "foundation-lesson-1",
                title: "第1节：高尔夫礼仪与基础握杆",
                description: "学习基础姿势与正确的握杆方式。",
                statusLabel: "已销课",
                statusTone: "success",
            },
            {
                id: "foundation-lesson-2",
                title: "第2节：推杆基础",
                description: "果岭上的基础推杆练习。",
                statusLabel: "已销课",
                statusTone: "success",
            },
            {
                id: "foundation-lesson-3",
                title: "第3节：短杆启蒙",
                description: "理解短杆挥动节奏与触球后的送杆路径。",
                statusLabel: "已完成",
                statusTone: "muted",
            },
        ],
        partnerProfiles: [
            {
                name: "小明",
                rank: "L3",
                avatarUrl:
                    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=128&h=128&q=80",
            },
            {
                name: "小红",
                rank: "L5",
                avatarUrl:
                    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=128&h=128&q=80",
            },
        ],
        sharedProgress: ["礼仪规范达标", "握杆姿势固定"],
        moments: [
            {
                id: "foundation-moment-1",
                date: "2025年9月15日",
                title: "首次推杆入洞",
                description: "在果岭上完成了人生第一次推杆入洞。",
            },
        ],
        courseRecordEntry: {
            recordId: "r-240328",
            title: "高尔夫礼仪与基础握杆",
            meta: "2025-09-05 14:00 | 教练：王教练",
            statusLabel: "表现优秀",
        },
        assessmentRecordEntry: {
            recordId: "ar-rec-1",
            title: "结业测评",
            meta: "2026-02-25",
            statusLabel: "85分（良好）",
        },
    },
    {
        id: "pkg-shortgame-advanced",
        name: "短杆进阶专项套餐",
        period: {
            start: "2026.03.03",
            end: "2026.05.30",
        },
        status: {
            label: "进行中",
            tone: "active",
            statusKind: "inProgress",
        },
        overview: {
            completedLessons: 6,
            totalLessons: 10,
            partnerCount: 1,
            attendanceLabel: "80%",
            attendanceDetail: "4/5节",
        },
        planSummary: {
            title: "比赛场景短杆提升",
            description: "围绕切杆、劈起杆与果岭边救球建立稳定成功率，目前已完成 6/10 节。",
        },
        courseOutline: [
            {
                id: "shortgame-lesson-1",
                title: "第1节：30码内落点控制",
                description: "建立第一落点意识与不同落区的杆面选择。",
                statusLabel: "已销课",
                statusTone: "success",
            },
            {
                id: "shortgame-lesson-2",
                title: "第2节：薄草位切杆",
                description: "处理不同草况下的杆头入射角和节奏。",
                statusLabel: "已销课",
                statusTone: "success",
            },
            {
                id: "shortgame-lesson-3",
                title: "第3节：沙坑脱困",
                description: "提升起爆点稳定性和出沙厚度控制。",
                statusLabel: "待上课",
                statusTone: "muted",
            },
        ],
        partnerProfiles: [
            {
                name: "小雨",
                rank: "L4",
                avatarUrl:
                    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=128&h=128&q=80",
            },
        ],
        sharedProgress: ["切杆触地更稳定", "沙坑出球高度更统一"],
        moments: [
            {
                id: "shortgame-moment-1",
                date: "2026年3月22日",
                title: "首次连续三球进内圈",
                description: "30码内切杆训练中，连续三球都落在目标内圈。",
            },
            {
                id: "shortgame-moment-2",
                date: "2026年4月2日",
                title: "完成第一节沙坑脱困练习",
                description: "可以稳定把球送上果岭，落点更靠近旗位方向。",
            },
        ],
        courseRecordEntry: {
            recordId: "r-240307",
            title: "短杆·进阶班",
            meta: "2026-04-02 15:00 | 教练：David Chen",
            statusLabel: "继续巩固",
        },
        assessmentRecordEntry: {
            recordId: "ar-rec-3",
            title: "阶段测评",
            meta: "2026-04-18",
            statusLabel: "78分（稳步提升）",
        },
    },
    {
        id: "pkg-newcomer-gift",
        name: "新客体验赠课",
        period: {
            start: "2025.08.18",
            end: "2025.08.31",
        },
        status: {
            label: "已体验",
            tone: "muted",
            statusKind: "trialDone",
        },
        overview: {
            completedLessons: 2,
            totalLessons: 2,
            partnerCount: 0,
            attendanceLabel: "100%",
            attendanceDetail: "2/2节",
        },
        planSummary: {
            title: "入门体验模块",
            description: "通过两节体验课了解基础站姿、挥杆节奏与学院教学方式。",
        },
        courseOutline: [
            {
                id: "gift-lesson-1",
                title: "第1节：挥杆启蒙体验",
                description: "完成基础握杆、站姿与短距离挥杆体验。",
                statusLabel: "已销课",
                statusTone: "success",
            },
            {
                id: "gift-lesson-2",
                title: "第2节：果岭互动体验",
                description: "在果岭区认识推杆节奏与距离感。",
                statusLabel: "已销课",
                statusTone: "success",
            },
        ],
        partnerProfiles: [],
        sharedProgress: ["完成第一次正式挥杆", "建立基础礼仪认知"],
        moments: [
            {
                id: "gift-moment-1",
                date: "2025年8月24日",
                title: "第一次完成标准收杆",
                description: "从僵硬用力转为能顺畅完成收杆动作。",
            },
        ],
        courseRecordEntry: {
            recordId: "r-240215",
            title: "体验课总结",
            meta: "2025-08-28 10:00 | 教练：David Chen",
            statusLabel: "体验完成",
        },
        assessmentRecordEntry: {
            recordId: "ar-rec-2",
            title: "体验评估",
            meta: "2025-08-30",
            statusLabel: "建议进入基础班",
        },
    },
];

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
    currentTab: "club",
    /** 预约成功后一次性打开 Club 内约课二级；不入库、刷新后清除 */
    clubOpenBooking: false,
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
    /** 成就详情弹窗当前打开的成就 id（勿与佩戴勋章混淆） */
    activeAchievementId: null,
    /** 个人主页头像处佩戴展示的勋章，对应 achievementItems[].id */
    wornAchievementId: null,
    /** 从其它页跳转时打开对应课后作业（如课程记录） */
    pendingHomeworkTaskId: null,
    /** 从其它页跳转时打开对应课后报告详情（与 pendingHomeworkTaskId 同源任务 id） */
    pendingReportTaskId: null,
    /** 下次进入「我的」时恢复子页：如从课程记录跳转课后后再返回 */
    resumeProfileSubView: null,
    /** 从套餐详情跳转其它页后返回时恢复的套餐 id（不入本地持久化） */
    resumeProfilePackageId: null,
    /** 下次进入 Club 时恢复二级页：如从套餐详情跳转测评记录 */
    resumeClubSubView: null,
    /** Club 二级详情需要恢复的测评记录 id */
    resumeAssessmentRecordId: null,
};
