import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
    const { i18n, t } = useTranslation();
    const isEnglish = i18n.resolvedLanguage === "en";

    return (
        <button
            type="button"
            className="lang-toggle-btn"
            aria-label={t("language.switchTo")}
            onClick={() => {
                i18n.changeLanguage(isEnglish ? "zh" : "en");
            }}
        >
            {t("language.button")}
        </button>
    );
}
