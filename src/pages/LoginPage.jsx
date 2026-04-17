import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";
import { useAppContext } from "../context/AppContext";

export default function LoginPage() {
    const { t } = useTranslation();
    const { state, actions } = useAppContext();
    const [role, setRole] = useState(() => state.auth.role);
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const baseId = useId();
    const accountId = `${baseId}-account`;
    const passwordId = `${baseId}-password`;

    const handleSubmit = (event) => {
        event.preventDefault();
        const acc = account.trim();
        const pwd = password.trim();
        if (!acc || !pwd) {
            setError(t("login.errorEmpty"));
            return;
        }
        setError("");
        actions.login(role);
    };

    return (
        <div className="device-shell login-device-shell">
            <div className="device-glow" aria-hidden="true" />
            <header className="login-top-bar">
                <LanguageToggle className="icon-btn login-lang-toggle" />
            </header>
            <main className="login-main">
                <div className="login-card">
                    <div className="login-card-glow" aria-hidden="true" />
                    <div className="login-brand">
                        <div className="login-logo-ring">
                            <img
                                className="login-logo"
                                src="/logo-256.webp"
                                alt=""
                                width={80}
                                height={80}
                                decoding="async"
                            />
                        </div>
                        <h1 className="login-title">{t("login.title")}</h1>
                    </div>

                    <div className="login-role-tabs" role="tablist" aria-label={t("login.roleTabsAria")}>
                        <button
                            type="button"
                            role="tab"
                            className={`login-role-tab${role === "student" ? " is-active" : ""}`}
                            aria-selected={role === "student"}
                            id="login-tab-student"
                            onClick={() => setRole("student")}
                        >
                            {t("login.student")}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            className={`login-role-tab${role === "parent" ? " is-active" : ""}`}
                            aria-selected={role === "parent"}
                            id="login-tab-parent"
                            onClick={() => setRole("parent")}
                        >
                            {t("login.parent")}
                        </button>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit} noValidate>
                        <div className="login-field">
                            <label className="login-label" htmlFor={accountId}>
                                {t("login.accountLabel")}
                            </label>
                            <input
                                id={accountId}
                                className="login-input"
                                name="account"
                                type="text"
                                autoComplete="username"
                                placeholder={t("login.accountPlaceholder")}
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                            />
                        </div>
                        <div className="login-field">
                            <label className="login-label" htmlFor={passwordId}>
                                {t("login.passwordLabel")}
                            </label>
                            <input
                                id={passwordId}
                                className="login-input"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder={t("login.passwordPlaceholder")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error ? (
                            <p className="login-error" role="alert">
                                {error}
                            </p>
                        ) : null}
                        <button type="submit" className="btn-primary login-submit wide">
                            {t("login.submit")}
                        </button>
                        <p className="login-demo-hint">{t("login.demoHint")}</p>
                    </form>
                </div>
            </main>
        </div>
    );
}
