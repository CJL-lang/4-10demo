export const navItems = [
    { key: "club", label: "进度", icon: "◫" },
    { key: "booking", label: "预约", icon: "◷" },
    { key: "growth", label: "课后", icon: "⌁" },
    { key: "profile", label: "我的", icon: "◉" },
];

export const scheduleDates = [
    { dow: "MON", day: 14, time: "09:30-11:00", courseTitle: "短杆触感重建" },
    { dow: "TUE", day: 15, time: "14:30-16:00", courseTitle: "铁杆命中稳定课" },
    { dow: "WED", day: 16, time: "19:00-20:30", courseTitle: "沙坑救球专项" },
    { dow: "THU", day: 17, time: "10:00-11:30", courseTitle: "推杆压力管理" },
    { dow: "FRI", day: 18, time: "16:30-18:00", courseTitle: "实战策略模拟" },
];

export const courseAssetsByDate = {
    14: [
        {
            id: "d14-shortgame-01",
            courseName: "短杆·基础班",
            initials: "SJ",
            name: "Sarah Jenkins",
            title: "PGA 高级教练",
            desc: "短杆落点与触感控制，适合周初动作校准",
            score: "4.9",
        },
        {
            id: "d14-shortgame-02",
            courseName: "短杆·进阶班",
            initials: "LW",
            name: "Leo Wang",
            title: "短杆专项导师",
            desc: "30码内切杆节奏训练，提升进攻稳定性",
            score: "4.8",
        },
    ],
    15: [
        {
            id: "d15-iron-01",
            courseName: "铁杆·A组",
            initials: "DC",
            name: "David Chen",
            title: "职业巡回赛背景",
            desc: "7号铁与9号铁命中率提升，聚焦击球面控制",
            score: "5.0",
        },
        {
            id: "d15-iron-02",
            courseName: "铁杆·B组",
            initials: "MN",
            name: "Mia Novak",
            title: "挥杆生物力学教练",
            desc: "通过压力盘回放修正重心转移节奏",
            score: "4.9",
        },
    ],
    16: [
        {
            id: "d16-bunker-01",
            courseName: "沙坑·夜训班",
            initials: "AR",
            name: "Alex Rivera",
            title: "沙坑与救球专家",
            desc: "夜间灯光场景下强化起爆点与杆面角度控制",
            score: "4.9",
        },
        {
            id: "d16-bunker-02",
            courseName: "沙坑·体能班",
            initials: "QZ",
            name: "曲子墨",
            title: "体能协调教练",
            desc: "下肢爆发与稳定链路训练，提升连续出杆质量",
            score: "4.7",
        },
    ],
    17: [
        {
            id: "d17-putting-01",
            courseName: "推杆·实战班",
            initials: "HC",
            name: "Hannah Cole",
            title: "心理与推杆双修教练",
            desc: "高压推杆决策模型，减少关键洞失误率",
            score: "5.0",
        },
        {
            id: "d17-putting-02",
            courseName: "推杆·数据班",
            initials: "JY",
            name: "纪言",
            title: "果岭阅读分析师",
            desc: "坡度阅读与击球速度匹配，建立稳定流程",
            score: "4.8",
        },
    ],
    18: [
        {
            id: "d18-strategy-01",
            courseName: "策略·9洞课",
            initials: "SR",
            name: "陈梓萱 (Serena)",
            title: "PGA认证金牌教练",
            desc: "9洞实战策略演练，强化开球与攻果岭选择",
            score: "4.9",
        },
        {
            id: "d18-strategy-02",
            courseName: "策略·风场课",
            initials: "TK",
            name: "Tom Keller",
            title: "赛场策略顾问",
            desc: "逆风与侧风条件下的落点选择与风险管理",
            score: "4.8",
        },
    ],
};

export const coachesPre = courseAssetsByDate[15];

export const coachPost = {
    initials: "SR",
    name: "陈梓萱 (Serena)",
    title: "PGA认证金牌教练",
    desc: "已在球场就绪",
    badge: "等你来",
};

export const records = [
    {
        id: "r-240328",
        date: "2024年3月28日",
        type: "技能",
        title: "7号铁上果岭命中",
        coach: "教练 Richardson",
        note: "命中率达到 8/10，击球重心更稳定。",
        result: "达标",
        target: "目标 7/10",
        advice: "下节课增加逆风条件练习，保持节奏稳定。",
    },
    {
        id: "r-240321",
        date: "2024年3月21日",
        type: "身体",
        title: "核心旋转与平衡",
        coach: "教练 Richardson",
        note: "核心激活更快，击球后姿态保持更完整。",
        result: "部分达标",
        target: "目标 4 轮循环",
        advice: "继续强化左侧髋稳定，避免上杆末端晃动。",
    },
    {
        id: "r-240314",
        date: "2024年3月14日",
        type: "心态",
        title: "窄道开球决策",
        coach: "教练 Richardson",
        note: "建立了固定呼吸节奏，焦虑感明显下降。",
        result: "达标",
        target: "目标 6/8 决策正确",
        advice: "赛前 10 分钟做可视化预演，稳定首洞状态。",
    },
    {
        id: "r-240307",
        date: "2024年3月7日",
        type: "技能",
        title: "30码切杆落点控制",
        coach: "教练 Richardson",
        note: "第一落点控制更集中，落点离散度降低。",
        result: "达标",
        target: "目标 10 球 7 次落点命中",
        advice: "增加不同草况下的切杆触地反馈练习。",
    },
    {
        id: "r-240229",
        date: "2024年2月29日",
        type: "身体",
        title: "下肢发力时序",
        coach: "教练 Richardson",
        note: "起杆更平顺，但换重心略慢。",
        result: "未达标",
        target: "目标 峰值速度 95mph",
        advice: "本周安排两次弹力带髋驱动练习。",
    },
    {
        id: "r-240222",
        date: "2024年2月22日",
        type: "心态",
        title: "推杆前流程一致性",
        coach: "教练 Richardson",
        note: "读取果岭后执行流程更加一致。",
        result: "达标",
        target: "目标 连续 8 次一致流程",
        advice: "比赛日保持同样节奏，减少临场改动作。",
    },
    {
        id: "r-240215",
        date: "2024年2月15日",
        type: "技能",
        title: "铁杆压缩",
        coach: "教练 Richardson",
        note: "专注于击球瞬间保持球杆前倾。击球效果和起草提升明显。",
        result: "部分达标",
        target: "目标 10 球 6 次纯击球",
        advice: "增加慢动作节奏练习，先稳后快。",
    },
    {
        id: "r-240208",
        date: "2024年2月8日",
        type: "身体",
        title: "跨部旋转练习",
        coach: "教练 Richardson",
        note: "修正了过早伸展问题。通过压力盘验证地面反作用力的分配。",
        result: "达标",
        target: "目标 3 组动作达标",
        advice: "保持每次训练前热身，避免下背代偿。",
    },
    {
        id: "r-240201",
        date: "2024年2月1日",
        type: "心态",
        title: "心态与流程",
        coach: "教练 Richardson",
        note: "击球前的视觉化技巧训练，有效降低了在窄道焦虑感。",
        result: "达标",
        target: "目标 心率波动 < 15%",
        advice: "继续保持短句自我提示，避免负面回放。",
    },
];

export const recordFilterItems = [
    { key: "all", label: "全部" },
    { key: "技能", label: "技能" },
    { key: "身体", label: "身体" },
    { key: "心态", label: "心态" },
];

export const growthViewItems = [
    { key: "tasks", label: "练习任务" },
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
        id: "t-putting-3ft",
        title: "3 英尺推杆连续命中",
        category: "今日任务",
        difficulty: "基础",
        target: "连续命中 8 / 10",
        dueText: "今日 21:30 前",
        reward: "心态稳定 +2",
        progress: 50,
        coach: "教练 Richardson",
        homeworkBrief: "拍摄 3 英尺距离下的推杆节奏与收杆稳定性，重点观察肩线摆动是否平稳。",
        checkpoints: ["固定机位拍摄", "完整展示 10 球", "复盘失误原因"],
    },
    {
        id: "t-iron-7",
        title: "7 号铁上果岭命中率",
        category: "今日任务",
        difficulty: "进阶",
        target: "10 球命中 7 球",
        dueText: "今日 21:30 前",
        reward: "技能熟练 +3",
        progress: 70,
        coach: "教练 Richardson",
        homeworkBrief: "上传 7 号铁练习视频，展示站位、挥杆顶点与击球后平衡状态。",
        checkpoints: ["正面与侧面各 1 段", "记录命中结果", "附上当日体感"],
    },
    {
        id: "t-core-rotation",
        title: "核心旋转稳定训练",
        category: "本周任务",
        difficulty: "基础",
        target: "累计完成 4 轮",
        dueText: "本周五前",
        reward: "体能爆发 +2",
        progress: 25,
        coach: "体能教练 曲子墨",
        homeworkBrief: "完成核心旋转与髋部驱动练习，上传训练片段并说明每轮完成情况。",
        checkpoints: ["每轮不少于 45 秒", "保持呼吸节奏", "提交训练后心率"],
    },
    {
        id: "t-wind-control",
        title: "侧风低平球控球",
        category: "本周任务",
        difficulty: "挑战",
        target: "5 组落点误差 < 4m",
        dueText: "本周日复盘",
        reward: "技能抗压 +4",
        progress: 0,
        coach: "教练 Tom Keller",
        homeworkBrief: "在侧风条件下完成低平球控球训练，重点记录每组落点偏差。",
        checkpoints: ["每组至少 5 球", "标记风向与风速", "总结纠偏策略"],
    },
    {
        id: "t-visualization",
        title: "赛前可视化流程",
        category: "已完成",
        difficulty: "基础",
        target: "连续 7 天打卡",
        dueText: "已完成",
        reward: "心态专注 +5",
        progress: 100,
        coach: "心理教练 Hannah Cole",
        homeworkBrief: "录制可视化流程演练，描述上场前的心理预演步骤。",
        checkpoints: ["流程不低于 2 分钟", "包含呼吸引导", "总结稳定动作"],
    },
];

export const achievementItems = [
    {
        id: "a-first-five-star",
        rank: "NO. 1",
        label: "五星教练",
        status: "unlocked",
        current: 1,
        target: 1,
        detail: "完成一次教练 5 星评价",
        milestone: "2024-03-28 已解锁",
    },
    {
        id: "a-streak-ten",
        rank: "NO. 2",
        label: "连训达人",
        status: "progress",
        current: 8,
        target: 10,
        detail: "连续完成 10 节训练",
        milestone: "当前连续 8 节",
    },
    {
        id: "a-mental-master",
        rank: "NO. 3",
        label: "心态掌控",
        status: "unlocked",
        current: 4,
        target: 4,
        detail: "心态评分连续 4 周 >= 4 星",
        milestone: "2024-03-21 已解锁",
    },
    {
        id: "a-iron-king",
        rank: "NO. 4",
        label: "铁杆控场",
        status: "progress",
        current: 6,
        target: 8,
        detail: "7号铁命中率连续 8 课达标",
        milestone: "还差 2 课",
    },
    {
        id: "a-pressure-proof",
        rank: "NO. 5",
        label: "压力免疫",
        status: "locked",
        current: 0,
        target: 5,
        detail: "比赛模拟课中 5 次关键洞稳定推进",
        milestone: "需先解锁上一阶段任务",
    },
    {
        id: "a-swing-lab",
        rank: "NO. 6",
        label: "动作实验室",
        status: "locked",
        current: 0,
        target: 3,
        detail: "上传 3 条高质量动作复盘视频",
        milestone: "可在课后页任务中完成",
    },
];

export const badges = achievementItems.slice(0, 3).map((item) => ({
    rank: item.rank,
    label: item.label,
}));

export const rankingGroups = [
    {
        title: "心理排名",
        rank: "NO.4",
        rows: [
            { no: 1, medal: "1", name: "李建勋", value: "98.5" },
            { no: 2, medal: "2", name: "王思雅", value: "96.2" },
            { no: 3, medal: "3", name: "陈志豪", value: "95.8" },
        ],
    },
    {
        title: "技能等级",
        rank: "NO.8",
        rows: [
            { no: 1, medal: "1", name: "林晓慧", value: "Lv.42" },
            { no: 2, medal: "2", name: "周宇", value: "Lv.39" },
            { no: 3, medal: "3", name: "何漫漫", value: "Lv.38" },
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
        physical: 4,
        mental: 5,
        skill: 3,
        coach: 4,
    },
    reviewText: "",
    growthView: "tasks",
    recordFilter: "all",
    recordVisibleCount: 4,
    taskDoneMap: defaultTaskDoneMap,
    activeAchievementId: null,
};
