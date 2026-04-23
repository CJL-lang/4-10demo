import { useId } from "react";

/**
 * Playful, title-aligned icons for system notification inbox rows.
 */
const S = 26;
const vb = "0 0 24 24";

/**
 * 消息主列表「系统通知」入口：金色主题铃 + 星光点缀
 */
export function SystemInboxEntryIcon() {
    const uid = useId().replace(/:/g, "");
    const gFill = `inbox-gold-fill-${uid}`;
    const gStroke = `inbox-gold-line-${uid}`;
    return (
        <svg viewBox={vb} width={S} height={S} className="messages-system-inbox-icon messages-system-inbox-entry-gold" aria-hidden>
            <defs>
                <linearGradient id={gFill} x1="4" y1="1" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#fff8e6" />
                    <stop offset="0.4" stopColor="#f0c14a" />
                    <stop offset="0.75" stopColor="#b8860b" />
                    <stop offset="1" stopColor="#5c3506" />
                </linearGradient>
                <linearGradient id={gStroke} x1="4" y1="3" x2="20" y2="19">
                    <stop offset="0" stopColor="#fff1c8" />
                    <stop offset="0.5" stopColor="#eca813" />
                    <stop offset="1" stopColor="#8a5a0e" />
                </linearGradient>
            </defs>
            <path d="M18.2 2.2l.35.75.8.1-.58.5.2.82-.7-.4-.7.4.2-.82-.57-.5.78-.1z" fill="rgba(255, 236, 200, 0.95)" />
            <path d="M3.2 3.2l.25.55.6.05-.42.35.1.65-.5-.3-.5.3.1-.65-.4-.3.5-.1z" fill="rgba(255, 210, 120, 0.65)" />
            <path d="M20.1 5.1l.15.3.3.04-.22.2.1.35-.3-.2-.2.1.06-.35-.2-.2.3-.04z" fill="rgba(255, 248, 220, 0.5)" />
            <path
                d="M12 3a3 3 0 0 0-3 3v.5a2 2 0 0 0-2 2v4.5A4.5 4.5 0 0 0 11.5 17.5H12a4.5 4.5 0 0 0 4.5-4.5V8.5a2 2 0 0 0-2-2V6a3 3 0 0 0-2.4-2.95"
                fill={`url(#${gFill})`}
                stroke={`url(#${gStroke})`}
                strokeWidth="0.9"
                strokeLinejoin="round"
            />
            <path
                d="M9 17.5V18a3 3 0 0 0 6 0v-.5"
                fill="none"
                stroke={`url(#${gStroke})`}
                strokeWidth="0.9"
                strokeLinecap="round"
            />
        </svg>
    );
}

function SvgBooking() {
    return (
        <svg viewBox={vb} width={S} height={S} className="messages-system-inbox-icon" aria-hidden>
            <rect x="3.5" y="4.5" width="17" height="16" rx="2.2" fill="rgba(255,255,255,0.12)" />
            <path d="M3.5 9.5h17M8 2.5v3M16 2.5v3" stroke="currentColor" strokeWidth={1.45} strokeLinecap="round" />
            <circle cx="12" cy="14" r="3.2" stroke="currentColor" strokeWidth={1.45} fill="none" />
            <path d="M12 12.2v1.6l.9.9" stroke="currentColor" strokeWidth={1.45} strokeLinecap="round" />
        </svg>
    );
}

function SvgAssessment() {
    return (
        <svg viewBox={vb} width={S} height={S} className="messages-system-inbox-icon" aria-hidden>
            <path
                d="M12 3.2l1.1 2.1 2.4.3-1.8 1.7.5 2.4-2.2-1.2-2.2 1.2.5-2.4-1.8-1.7 2.4-.3z"
                fill="rgba(255,200,100,0.35)"
                stroke="currentColor"
                strokeWidth={1.1}
            />
            <rect x="5" y="15" width="2.2" height="4.5" rx="0.5" fill="currentColor" opacity="0.35" />
            <rect x="8.2" y="12.5" width="2.2" height="7" rx="0.5" fill="currentColor" opacity="0.5" />
            <rect x="11.4" y="14" width="2.2" height="5.5" rx="0.5" fill="currentColor" opacity="0.65" />
            <rect x="14.6" y="10" width="2.2" height="9.5" rx="0.5" fill="currentColor" opacity="0.85" />
        </svg>
    );
}

function SvgHomework() {
    return (
        <svg viewBox={vb} width={S} height={S} className="messages-system-inbox-icon" aria-hidden>
            <path
                d="M8 3.5h10a1.2 1.2 0 0 1 1.2 1.2V18a2.5 2.5 0 0 1-2.5 2.5H8.5A2.5 2.5 0 0 1 6 18V4.2A.7.7 0 0 1 6.7 3.5H8z"
                stroke="currentColor"
                strokeWidth={1.45}
                fill="rgba(255,255,255,0.1)"
            />
            <path d="M6 4.2h1.2a1.5 1.5 0 0 0 0 3H6" stroke="currentColor" strokeWidth={1.45} fill="none" />
            <path d="M9.2 8.5h5.2M9.2 11.2h4.2M9.2 14h5" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" opacity="0.75" />
            <path d="M16.2 2.2l1.1 1.1-3.2 3.2-1.2-.1-.2-1.2z" fill="rgba(250, 204, 21, 0.45)" stroke="currentColor" strokeWidth={0.85} />
        </svg>
    );
}

function SvgCoachSubstitute() {
    return (
        <svg viewBox={vb} width={S} height={S} className="messages-system-inbox-icon" aria-hidden>
            <circle cx="8" cy="7.5" r="2.1" fill="rgba(255,255,255,0.18)" stroke="currentColor" strokeWidth={1.15} />
            <path d="M3.5 19.5c.7-2 2-2.9 4-2.9h1" stroke="currentColor" strokeWidth={1.1} fill="none" strokeLinecap="round" />
            <circle cx="16.5" cy="7" r="1.75" fill="rgba(255,200,100,0.28)" stroke="currentColor" strokeWidth={1.1} />
            <path d="M20.5 18.5c-.8-1.4-1.8-1.9-3-2" stroke="currentColor" strokeWidth={1.05} fill="none" strokeLinecap="round" />
            <path
                d="M12 3.5h4.2M14.1 1.8v3.4"
                stroke="rgba(250, 204, 21, 0.95)"
                strokeWidth={1.35}
                strokeLinecap="round"
            />
            <path d="M11.5 11.5l4.2 4.2" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" opacity="0.45" />
        </svg>
    );
}

function SvgPackageBalance() {
    return (
        <svg viewBox={vb} width={S} height={S} className="messages-system-inbox-icon" aria-hidden>
            <rect x="3" y="5" width="14" height="9.5" rx="1.1" fill="rgba(255,200,100,0.22)" stroke="currentColor" strokeWidth={1.15} />
            <rect x="5" y="7" width="14" height="9.5" rx="1.1" fill="rgba(255,255,255,0.06)" stroke="currentColor" strokeWidth={1.15} />
            <rect x="7" y="9" width="14" height="9.5" rx="1.1" fill="rgba(255,255,255,0.04)" stroke="currentColor" strokeWidth={1.15} />
            <path d="M10.5 4.2V3.2a1 1 0 0 1 1-1h5.4a1 1 0 0 1 1 1v1" fill="none" stroke="currentColor" strokeWidth={1.05} />
        </svg>
    );
}

function SvgVenue() {
    return (
        <svg viewBox={vb} width={S} height={S} className="messages-system-inbox-icon" aria-hidden>
            <path d="M4 18.2h16" stroke="rgba(120, 180, 90, 0.55)" strokeWidth={1.35} strokeLinecap="round" />
            <ellipse cx="10" cy="12" rx="3.4" ry="1.15" fill="rgba(100, 160, 80, 0.32)" />
            <ellipse cx="15" cy="10.2" rx="2.1" ry="0.75" fill="rgba(100, 160, 80, 0.26)" />
            <path d="M12 3v8.8M12 3l-2 1M12 3l2 1" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
            <rect x="10.8" y="10" width="1.4" height="2.2" fill="currentColor" opacity="0.45" rx="0.2" />
        </svg>
    );
}

function SvgHoliday() {
    return (
        <svg viewBox={vb} width={S} height={S} className="messages-system-inbox-icon" aria-hidden>
            <circle cx="18" cy="4.5" r="2.2" fill="rgba(255, 200, 80, 0.35)" stroke="rgba(255, 200, 80, 0.85)" strokeWidth={0.9} />
            <path d="M18 2.3v1.2M18 5.7v1.2M16.2 4.5h1.2M19.8 4.5h1.2M16.8 2.8l.8.8M18.4 5.2l.8.8M19.2 2.8l-.8.8M16.8 5.2l-.8.8" stroke="rgba(255, 200, 80, 0.75)" strokeWidth={0.55} strokeLinecap="round" />
            <rect x="3.5" y="8" width="13" height="11" rx="1.4" fill="rgba(255,255,255,0.08)" stroke="currentColor" strokeWidth={1.1} />
            <path d="M3.5 11.2h13" stroke="currentColor" strokeWidth={1.05} opacity="0.45" />
            <circle cx="7" cy="14.5" r="0.55" fill="currentColor" opacity="0.6" />
            <circle cx="10" cy="14.5" r="0.55" fill="currentColor" opacity="0.6" />
            <circle cx="13" cy="14.5" r="0.55" fill="currentColor" opacity="0.6" />
        </svg>
    );
}

function SvgPolicy() {
    return (
        <svg viewBox={vb} width={S} height={S} className="messages-system-inbox-icon" aria-hidden>
            <path
                d="M12.2 2.2l1.1 0.4 0.1 0.1h5.1a.8.8 0 0 1 .8.8V18a.8.8 0 0 1-1.1.7L12.2 19l-5-1.1a.8.8 0 0 1-1.1-.7V3.1a.8.8 0 0 1 .2-.4l.6-0.5z"
                fill="rgba(255,255,255,0.1)"
                stroke="currentColor"
                strokeWidth={1.1}
            />
            <path d="M9.2 6.2h4.2M9.2 9.2h6.2M9.2 12.2h5" stroke="currentColor" strokeWidth={1.05} strokeLinecap="round" opacity="0.55" />
            <circle cx="9.2" cy="6.2" r="0.45" fill="currentColor" />
        </svg>
    );
}

function SvgEventOpen() {
    return (
        <svg viewBox={vb} width={S} height={S} className="messages-system-inbox-icon" aria-hidden>
            <path
                d="M4.5 5.5h15a1 1 0 0 1 1 1v11.2a1.2 1.2 0 0 1-1.2 1.2H4.7a1.2 1.2 0 0 1-1.2-1.2V6.5a1 1 0 0 1 1-1z"
                fill="rgba(59, 130, 246, 0.18)"
                stroke="currentColor"
                strokeWidth={1.1}
            />
            <path d="M8.5 3.2V2M15.5 3.2V2" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" />
            <path
                d="M4.5 9.2h15M10.5 5.5l1.8 2.2 2.2-3.2 2.5 3.2"
                fill="none"
                stroke="rgba(250, 204, 21, 0.85)"
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function SvgPaymentSuccess() {
    return (
        <svg viewBox={vb} width={S} height={S} className="messages-system-inbox-icon" aria-hidden>
            <circle cx="12" cy="12" r="7.2" fill="rgba(34, 197, 94, 0.2)" stroke="rgba(52, 211, 153, 0.7)" strokeWidth={1.15} />
            <path d="M8.2 12.2l2.2 2.2L16 8.8" stroke="rgba(187, 247, 208, 0.95)" strokeWidth={1.35} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="19" cy="4" r="0.6" fill="rgba(250, 204, 21, 0.95)" />
            <circle cx="5.5" cy="5.5" r="0.45" fill="rgba(250, 204, 21, 0.7)" />
            <circle cx="20.5" cy="8.5" r="0.35" fill="rgba(255, 255, 255, 0.5)" />
        </svg>
    );
}

function SvgDefault() {
    return (
        <svg viewBox={vb} width={S} height={S} className="messages-system-inbox-icon" aria-hidden>
            <path
                d="M12 3a3 3 0 0 0-3 3v.5a2 2 0 0 0-2 2v4.5A4.5 4.5 0 0 0 11.5 17.5H12a4.5 4.5 0 0 0 4.5-4.5V8.5a2 2 0 0 0-2-2V6a3 3 0 0 0-2.4-2.95"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.35}
            />
            <path d="M9 17.5V18a3 3 0 0 0 6 0v-.5" fill="none" stroke="currentColor" strokeWidth={1.15} />
        </svg>
    );
}

const BY_ID = {
    booking: SvgBooking,
    assessment: SvgAssessment,
    homework: SvgHomework,
    coachSubstitute: SvgCoachSubstitute,
    packageBalance: SvgPackageBalance,
    venue: SvgVenue,
    holiday: SvgHoliday,
    policy: SvgPolicy,
    eventOpen: SvgEventOpen,
    paymentSuccess: SvgPaymentSuccess,
};

/**
 * @param {{ messageId: string, className?: string }} props
 */
export function SystemInboxMessageIcon({ messageId, className }) {
    const Cmp = BY_ID[messageId] ?? SvgDefault;
    return (
        <span className={className}>
            <Cmp />
        </span>
    );
}
