export const navItems = [
    { key: "club", label: "进度", icon: "◫" },
    { key: "booking", label: "预约", icon: "◷" },
    { key: "growth", label: "课后", icon: "⌁" },
    { key: "profile", label: "我的", icon: "◉" },
];

/** 学员头像（演示：中国青少年学生肖像素材，可替换为学员实拍） */
export const STUDENT_AVATAR_URL =
    "https://th.bing.com/th/id/R.85a1cb435027eb478d54356faf95cf45?rik=huHHDpNFyEx7GA&riu=http%3a%2f%2fimgwcs3.soufunimg.com%2fopen%2f2022_09%2f26%2farticle%2ff5062fc5-abd7-4f49-b5b5-bcad0304023f.jpg&ehk=VoSP%2bR%2bwEpjHyeAAO1pSr%2baJMyvyjpN%2fAeZNiKXvbT8%3d&risl=&pid=ImgRaw&r=0";

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
    status: "上课中",
};

export const coachPost = {
    ...MAIN_COACH,
    desc: "已在球场就绪",
    badge: "等你来",
};

export const records = [
    {
        id: "r-240328",
        date: "2024年3月28日",
        time: "10:00-11:30",
        type: "技能",
        title: "铁杆·A组",
        drill: "7号铁击球面控制与起草",
        coach: MAIN_COACH.name,
        avatarUrl: MAIN_COACH.avatarUrl,
        note: "命中率达到 8/10，击球重心更稳定。",
        result: "达标",
        target: "目标 7/10",
        advice: "下节课增加逆风条件练习，保持节奏稳定。",
    },
    {
        id: "r-240307",
        date: "2024年3月7日",
        time: "14:30-16:00",
        type: "技能",
        title: "短杆·进阶班",
        drill: "30码内切杆节奏训练",
        coach: MAIN_COACH.name,
        avatarUrl: MAIN_COACH.avatarUrl,
        note: "第一落点控制更集中，落点离散度降低。",
        result: "达标",
        target: "目标 10 球 7 次落点命中",
        advice: "增加不同草况下的切杆触地反馈练习。",
    },
    {
        id: "r-240215",
        date: "2024年2月15日",
        time: "14:30-16:00",
        type: "技能",
        title: "铁杆·B组",
        drill: "铁杆重心转移与压缩",
        coach: MAIN_COACH.name,
        avatarUrl: MAIN_COACH.avatarUrl,
        note: "专注于击球瞬间保持球杆前倾。击球效果和起草提升明显。",
        result: "部分达标",
        target: "目标 10 球 6 次纯击球",
        advice: "增加慢动作节奏练习，先稳后快。",
    },
];

export const recordFilterItems = [
    { key: "技能", label: "技能" },
];

export const growthViewItems = [
    { key: "tasks", label: "练习任务" },
    { key: "report", label: "课后报告" },
    { key: "review", label: "课后互评" },
];

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
        physical: [66, 69, 73, 76, 79, 82, 84],
        mental: [78, 80, 83, 86, 87, 89, 91],
        skill: [58, 63, 67, 70, 72, 75, 78],
    },
};

export const practiceTasks = [
    {
        id: "w-2024-week16",
        title: "第 16 周：果岭周边短杆控制",
        category: "本周作业",
        difficulty: "挑战",
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
        category: "历史作业",
        difficulty: "进阶",
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
        category: "历史作业",
        difficulty: "基础",
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
    coach: ["一般", "合格", "良好", "优秀", "卓越"],
};

const defaultTaskDoneMap = practiceTasks.reduce((acc, item) => {
    acc[item.id] = item.progress >= 100;
    return acc;
}, {});

export const defaultState = {
    currentTab: "booking",
    bookingStatus: "pre",
    selectedDate: 15,
    bookedDate: 15,
    selectedCourseAssetId: "d15-iron-01",
    bookedCourseAssetId: "d15-iron-01",
    nextSessionISO: "2026-10-24T14:30:00",
    ratings: {
        physical: 0,
        mental: 0,
        skill: 0,
        coach: 0,
    },
    reviewText: "",
    growthView: "tasks",
    recordFilter: "技能",
    recordVisibleCount: 4,
    taskDoneMap: defaultTaskDoneMap,
    activeAchievementId: null,
};
