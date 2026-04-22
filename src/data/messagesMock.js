import { MAIN_COACH, studentPackages } from "./mockData";

const foundationPartners = studentPackages.find((p) => p.id === "pkg-foundation-enlightenment")?.partnerProfiles ?? [];

/**
 * 系统通知列表（文案键在 i18n `messages.system.items.*`）
 * `sortedAt`：与界面展示时间线一致，用于列表排序（与「今天」= 周二 2026-04-21 对齐）
 */
export const mockSystemMessages = [
    { id: "paymentSuccess", unread: false, sortedAt: "2026-04-08T14:00:00" },
    { id: "eventOpen", unread: false, sortedAt: "2026-04-10T10:00:00" },
    { id: "policy", unread: false, sortedAt: "2026-04-12T09:30:00" },
    { id: "holiday", unread: false, sortedAt: "2026-04-17T08:00:00" },
    { id: "venue", unread: false, sortedAt: "2026-04-18T12:00:00" },
    { id: "packageBalance", unread: false, sortedAt: "2026-04-20T11:00:00" },
    { id: "coachSubstitute", unread: true, sortedAt: "2026-04-20T18:20:00" },
    { id: "homework", unread: true, sortedAt: "2026-04-21T08:40:00" },
    { id: "assessment", unread: true, sortedAt: "2026-04-21T09:05:00" },
    { id: "booking", unread: true, sortedAt: "2026-04-21T10:30:00" },
];

/**
 * @param {"student" | "parent"} role
 * @returns {Array<{ id: string, relation: string, peerNameKey: string, avatarUrl: string, lastPreviewKey: string, unread: boolean }>}
 */
export function getMockChatThreads(role) {
    if (role === "parent") {
        return [
            {
                id: "thread-child",
                relation: "child",
                peerNameKey: "messages.chat.peerNames.child",
                peerNameParams: {},
                avatarUrl:
                    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=128&h=128&q=80",
                lastPreviewKey: "messages.chat.lastPreview.child",
                unread: true,
            },
            {
                id: "thread-coach",
                relation: "coach",
                peerNameKey: "messages.chat.peerNames.coach",
                peerNameParams: { name: MAIN_COACH.name },
                avatarUrl: MAIN_COACH.avatarUrl,
                lastPreviewKey: "messages.chat.lastPreview.coachParent",
                unread: false,
            },
        ];
    }

    const p0 = foundationPartners[0];
    const p1 = foundationPartners[1];

    const threads = [
        {
            id: "thread-coach",
            relation: "coach",
            peerNameKey: "messages.chat.peerNames.coach",
            peerNameParams: { name: MAIN_COACH.name },
            avatarUrl: MAIN_COACH.avatarUrl,
            lastPreviewKey: "messages.chat.lastPreview.coachStudent",
            unread: true,
        },
    ];

    if (p0) {
        threads.push({
            id: "thread-partner-0",
            relation: "partner",
            peerNameKey: "messages.chat.peerNames.partner",
            peerNameParams: { name: p0.name },
            avatarUrl: p0.avatarUrl,
            lastPreviewKey: "messages.chat.lastPreview.partner0",
            unread: false,
        });
    }
    if (p1) {
        threads.push({
            id: "thread-partner-1",
            relation: "partner",
            peerNameKey: "messages.chat.peerNames.partner",
            peerNameParams: { name: p1.name },
            avatarUrl: p1.avatarUrl,
            lastPreviewKey: "messages.chat.lastPreview.partner1",
            unread: true,
        });
    }

    threads.push({
        id: "thread-parent",
        relation: "parent",
        peerNameKey: "messages.chat.peerNames.parent",
        peerNameParams: {},
        avatarUrl:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=128&h=128&q=80",
        lastPreviewKey: "messages.chat.lastPreview.parent",
        unread: false,
    });

    return threads;
}

/**
 * @type {Record<string, Array<{ from: "me" | "them"; textKey: string; time: string }>>}
 */
export const mockMessagesByThreadId = {
    "thread-coach": [
        { from: "them", textKey: "messages.chat.lines.coachS1", time: "09:12" },
        { from: "me", textKey: "messages.chat.lines.coachS2", time: "09:18" },
        { from: "them", textKey: "messages.chat.lines.coachS3", time: "09:21" },
    ],
    "thread-partner-0": [
        { from: "them", textKey: "messages.chat.lines.p0a", time: "16:02" },
        { from: "me", textKey: "messages.chat.lines.p0b", time: "16:08" },
    ],
    "thread-partner-1": [
        { from: "them", textKey: "messages.chat.lines.p1a", time: "11:20" },
    ],
    "thread-parent": [
        { from: "them", textKey: "messages.chat.lines.par1", time: "08:30" },
        { from: "me", textKey: "messages.chat.lines.par2", time: "08:35" },
    ],
    "thread-child": [
        { from: "them", textKey: "messages.chat.lines.ch1", time: "07:50" },
        { from: "me", textKey: "messages.chat.lines.ch2", time: "07:55" },
    ],
};
