import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMockChatThreads, mockMessagesByThreadId, mockSystemMessages } from "../data/messagesMock";
import { useAppContext } from "../context/AppContext";

export default function MessagesPage({ onToast, onSubViewChange }) {
    const { t } = useTranslation();
    const { state } = useAppContext();
    const role = state.auth.role === "parent" ? "parent" : "student";
    const [segment, setSegment] = useState(() => "system");
    const [subView, setSubView] = useState(() => null);
    const [composerText, setComposerText] = useState("");

    const chatThreads = useMemo(() => getMockChatThreads(role), [role]);

    /** 按通知时间最新在上（`sortedAt` 降序） */
    const systemMessagesSorted = useMemo(
        () => [...mockSystemMessages].sort((a, b) => Date.parse(b.sortedAt) - Date.parse(a.sortedAt)),
        []
    );

    const hideChrome = Boolean(subView);

    useEffect(() => {
        onSubViewChange?.(hideChrome);
        return () => {
            onSubViewChange?.(false);
        };
    }, [hideChrome, onSubViewChange]);

    useEffect(() => {
        const scrollMain = document.querySelector(".scroll-main");
        if (scrollMain) {
            scrollMain.scrollTo({ top: 0, behavior: "auto" });
        }
    }, [subView, segment]);

    useEffect(() => {
        if (subView?.kind !== "chat") {
            setComposerText("");
        }
    }, [subView]);

    const openSystem = (id) => {
        setSubView({ kind: "system", id });
    };

    const openChat = (threadId) => {
        setSubView({ kind: "chat", threadId });
    };

    const closeSubView = () => {
        setSubView(null);
    };

    const activeSystem = subView?.kind === "system" ? mockSystemMessages.find((m) => m.id === subView.id) : null;
    const activeThread = subView?.kind === "chat" ? chatThreads.find((th) => th.id === subView.threadId) : null;
    const activeLines = subView?.kind === "chat" ? mockMessagesByThreadId[subView.threadId] ?? [] : [];

    const sendDemo = () => {
        setComposerText("");
        onToast?.(t("messages.chat.demoSendToast"));
    };

    if (subView?.kind === "system" && activeSystem) {
        const sid = activeSystem.id;
        return (
            <section className="screen fade-enter messages-screen messages-screen--subview">
                <div className="messages-subview-topbar">
                    <button type="button" className="messages-back-btn" onClick={closeSubView} aria-label={t("messages.backAria")}>
                        ←
                    </button>
                    <h2 className="messages-subview-title">{t(`messages.system.items.${sid}.title`)}</h2>
                </div>
                <article className="panel panel-elevated messages-system-detail">
                    <p className="messages-system-detail__time">{t(`messages.system.items.${sid}.time`)}</p>
                    <p className="messages-system-detail__body">{t(`messages.system.items.${sid}.body`)}</p>
                    <button type="button" className="pill messages-system-detail__cta" onClick={closeSubView}>
                        {t("common.gotIt")}
                    </button>
                </article>
            </section>
        );
    }

    if (subView?.kind === "chat" && activeThread) {
        return (
            <section className="screen fade-enter messages-screen messages-screen--subview messages-screen--chat">
                <div className="messages-subview-topbar">
                    <button type="button" className="messages-back-btn" onClick={closeSubView} aria-label={t("messages.backAria")}>
                        ←
                    </button>
                    <div className="messages-chat-top-meta">
                        <img className="messages-chat-top-avatar" src={activeThread.avatarUrl} alt="" width={40} height={40} />
                        <div>
                            <h2 className="messages-subview-title messages-subview-title--chat">{t(activeThread.peerNameKey, activeThread.peerNameParams)}</h2>
                            <span className="messages-relation-pill">{t(`messages.chat.relation.${activeThread.relation}`)}</span>
                        </div>
                    </div>
                </div>
                <div className="messages-thread-bubbles" role="log" aria-label={t("messages.chat.threadAria")}>
                    {activeLines.map((line, idx) => (
                        <div key={`${subView.threadId}-${idx}`} className={`messages-bubble-row messages-bubble-row--${line.from}`}>
                            <div className="messages-bubble">
                                <p className="messages-bubble__text">{t(line.textKey)}</p>
                                <span className="messages-bubble__time">{line.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="messages-composer">
                    <label className="sr-only" htmlFor="messages-composer-input">
                        {t("messages.chat.inputAria")}
                    </label>
                    <input
                        id="messages-composer-input"
                        type="text"
                        className="messages-composer__input"
                        placeholder={t("messages.chat.inputPlaceholder")}
                        value={composerText}
                        onChange={(e) => setComposerText(e.target.value)}
                    />
                    <button type="button" className="pill messages-composer__send" onClick={sendDemo}>
                        {t("messages.chat.send")}
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="screen fade-enter messages-screen">
            <header className="messages-screen-header">
                <p className="small-label">{t("messages.screenKicker")}</p>
                <h1 className="headline">{t("messages.screenTitle")}</h1>
            </header>

            <div className="messages-segments" role="tablist" aria-label={t("messages.segmentsAria")}>
                <button
                    type="button"
                    role="tab"
                    aria-selected={segment === "system"}
                    className={`messages-segment${segment === "system" ? " is-active" : ""}`}
                    onClick={() => setSegment("system")}
                >
                    {t("messages.segmentSystem")}
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={segment === "chat"}
                    className={`messages-segment${segment === "chat" ? " is-active" : ""}`}
                    onClick={() => setSegment("chat")}
                >
                    {t("messages.segmentChat")}
                </button>
            </div>

            {segment === "system" ? (
                <ul className="section-stack messages-system-list" role="list" aria-label={t("messages.systemListAria")}>
                    {systemMessagesSorted.map((item) => (
                        <li key={item.id} className="messages-system-list__item">
                            <button
                                type="button"
                                className="messages-system-row panel panel-elevated"
                                onClick={() => openSystem(item.id)}
                                aria-label={t(`messages.system.items.${item.id}.title`)}
                            >
                                <span className={`messages-unread-dot${item.unread ? " is-on" : ""}`} aria-hidden="true" />
                                <div className="messages-system-row__text">
                                    <div className="messages-system-row__head">
                                        <span className="messages-system-row__title">{t(`messages.system.items.${item.id}.title`)}</span>
                                        <time className="messages-system-row__time">{t(`messages.system.items.${item.id}.time`)}</time>
                                    </div>
                                    <p className="messages-system-row__preview">{t(`messages.system.items.${item.id}.preview`)}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <ul className="section-stack messages-chat-list" role="list" aria-label={t("messages.chatListAria")}>
                    {chatThreads.length === 0 ? (
                        <li className="messages-empty panel panel-elevated">{t("messages.emptyChat")}</li>
                    ) : (
                        chatThreads.map((th) => (
                            <li key={th.id} className="messages-chat-list__item">
                                <button
                                    type="button"
                                    className="messages-chat-row panel panel-elevated"
                                    onClick={() => openChat(th.id)}
                                    aria-label={t("messages.chat.openThreadAria", { name: t(th.peerNameKey, th.peerNameParams) })}
                                >
                                    <span className={`messages-unread-dot${th.unread ? " is-on" : ""}`} aria-hidden="true" />
                                    <img className="messages-chat-row__avatar" src={th.avatarUrl} alt="" width={48} height={48} />
                                    <div className="messages-chat-row__body">
                                        <div className="messages-chat-row__head">
                                            <span className="messages-chat-row__name">{t(th.peerNameKey, th.peerNameParams)}</span>
                                            <span className="messages-relation-pill messages-relation-pill--inline">{t(`messages.chat.relation.${th.relation}`)}</span>
                                        </div>
                                        <p className="messages-chat-row__preview">{t(th.lastPreviewKey)}</p>
                                    </div>
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </section>
    );
}
