import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LONG_PRESS_MS = 520;
const TAP_FX_MS = 620;

/**
 * 个人主页「佩戴」勋章：挂绳奖牌（颈部下垂）+ 空态入口。
 * 佩戴态：短按触发动效；长按打开选择器。
 */
export default function ProfileHeroMedal({ item, onOpenPicker }) {
    const { t } = useTranslation();
    const longPressTimerRef = useRef(null);
    const longPressFiredRef = useRef(false);
    const [pendulumTap, setPendulumTap] = useState(false);
    const riverGradId = `profileHeroMedalRiverGrad-${useId().replace(/:/g, "")}`;
    const levelNum = item ? parseInt(String(item.rank).replace(/\D/g, ""), 10) || 1 : 1;
    const brightness = 0.5 + levelNum * 0.1;

    if (!item) {
        return (
            <button
                type="button"
                className="profile-hero-medal profile-hero-medal--empty"
                onClick={onOpenPicker}
                aria-label={t("profile.heroMedalEmptyAria")}
            >
                <span className="profile-hero-medal__empty-lanyard" aria-hidden="true">
                    <svg viewBox="0 0 48 28" width="40" height="22">
                        <path
                            d="M24 2v8M18 10c0 6 4 10 6 14M30 10c0 6-4 10-6 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.45"
                        />
                    </svg>
                </span>
                <span className="profile-hero-medal__empty-icon" aria-hidden="true">
                    <svg viewBox="0 0 40 40" width="22" height="22">
                        <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                        <path
                            d="M20 12v16M12 20h16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </span>
                <span className="profile-hero-medal__empty-label">{t("profile.heroMedalEmpty")}</span>
            </button>
        );
    }

    const clearLongPressTimer = useCallback(() => {
        if (longPressTimerRef.current != null) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);

    const tapClearRef = useRef(null);

    useEffect(() => {
        return () => {
            if (tapClearRef.current != null) {
                clearTimeout(tapClearRef.current);
            }
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
            }
        };
    }, []);

    const playTapFx = useCallback(() => {
        if (tapClearRef.current != null) {
            clearTimeout(tapClearRef.current);
        }
        setPendulumTap(true);
        tapClearRef.current = window.setTimeout(() => {
            tapClearRef.current = null;
            setPendulumTap(false);
        }, TAP_FX_MS);
    }, []);

    const handleWornPointerDown = useCallback(() => {
        longPressFiredRef.current = false;
        clearLongPressTimer();
        longPressTimerRef.current = window.setTimeout(() => {
            longPressTimerRef.current = null;
            longPressFiredRef.current = true;
            onOpenPicker();
        }, LONG_PRESS_MS);
    }, [clearLongPressTimer, onOpenPicker]);

    const handleWornPointerEnd = useCallback(() => {
        clearLongPressTimer();
        if (!longPressFiredRef.current) {
            playTapFx();
        }
    }, [clearLongPressTimer, playTapFx]);

    const handleWornKeyDown = useCallback(
        (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpenPicker();
            }
        },
        [onOpenPicker],
    );

    return (
        <button
            type="button"
            className="profile-hero-medal profile-hero-medal--worn"
            onPointerDown={handleWornPointerDown}
            onPointerUp={handleWornPointerEnd}
            onPointerCancel={clearLongPressTimer}
            onPointerLeave={clearLongPressTimer}
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={handleWornKeyDown}
            aria-label={t("profile.wearMedalAria")}
        >
            <span className={`profile-hero-medal__pendulum${pendulumTap ? " is-tapping" : ""}`}>
                <svg className="profile-hero-medal__lanyard" viewBox="0 0 64 42" width="64" height="42" aria-hidden="true">
                    <defs>
                        <linearGradient id="profileLanyardGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b6914" />
                            <stop offset="45%" stopColor="#d4a64a" />
                            <stop offset="100%" stopColor="#a67c1f" />
                        </linearGradient>
                    </defs>
                    {/* 颈部结点 */}
                    <ellipse cx="32" cy="5" rx="5" ry="3" fill="url(#profileLanyardGrad)" opacity="0.95" />
                    {/* 左右挂绳 */}
                    <path
                        d="M32 7.5 Q 22 16 20 28 Q 19 34 24 38"
                        fill="none"
                        stroke="url(#profileLanyardGrad)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                    />
                    <path
                        d="M32 7.5 Q 42 16 44 28 Q 45 34 40 38"
                        fill="none"
                        stroke="url(#profileLanyardGrad)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                    />
                    {/* 绳结金属环 */}
                    <circle cx="32" cy="39" r="3.2" fill="none" stroke="#6b5420" strokeWidth="1.4" />
                    <circle cx="32" cy="39" r="1.6" fill="#c9a227" />
                </svg>
                <div className="profile-hero-medal__coin" style={{ filter: `brightness(${brightness})` }}>
                    <span className="profile-hero-medal__shine" aria-hidden="true" />
                    <span className="profile-hero-medal__gold-glint" aria-hidden="true" />
                    <span className="badge-rank__ring" aria-hidden="true" />
                    <small className="badge-rank__eyebrow">LEVEL</small>
                    <strong className="badge-rank__level">{item.rank}</strong>
                </div>
                <span className="profile-hero-medal__sparkles" aria-hidden="true">
                    <span className="profile-hero-medal__sparkles-bloom profile-hero-medal__sparkles-bloom--a" />
                    <span className="profile-hero-medal__sparkles-bloom profile-hero-medal__sparkles-bloom--b" />
                    <span className="profile-hero-medal__sparkles-bloom profile-hero-medal__sparkles-bloom--c" />
                    <svg className="profile-hero-medal__sparkles-rivers" viewBox="0 0 100 80" width="100" height="80">
                        <defs>
                            <linearGradient id={riverGradId} x1="0%" y1="50%" x2="100%" y2="50%">
                                <stop offset="0%" stopColor="rgba(255, 190, 70, 0)" />
                                <stop offset="45%" stopColor="rgba(255, 248, 230, 0.98)" />
                                <stop offset="100%" stopColor="rgba(255, 175, 50, 0)" />
                            </linearGradient>
                        </defs>
                        <path
                            className="profile-hero-medal__sparkles-path profile-hero-medal__sparkles-path--1"
                            d="M4 36 Q 26 6 52 42 Q 72 62 96 28"
                            fill="none"
                            stroke={`url(#${riverGradId})`}
                        />
                        <path
                            className="profile-hero-medal__sparkles-path profile-hero-medal__sparkles-path--2"
                            d="M94 14 Q 52 2 48 48 Q 44 70 6 46"
                            fill="none"
                            stroke={`url(#${riverGradId})`}
                        />
                        <path
                            className="profile-hero-medal__sparkles-path profile-hero-medal__sparkles-path--3"
                            d="M16 54 Q 38 66 54 26 Q 62 12 86 38"
                            fill="none"
                            stroke={`url(#${riverGradId})`}
                        />
                    </svg>
                </span>
            </span>
        </button>
    );
}
