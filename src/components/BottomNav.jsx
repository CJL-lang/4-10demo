import { navItems } from "../data/mockData";
import { useTranslation } from "react-i18next";

export default function BottomNav({ currentTab, onChange }) {
    const { t } = useTranslation();

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <button
                    key={item.key}
                    type="button"
                    className={`nav-item ${currentTab === item.key ? "active" : ""}`}
                    onClick={() => onChange(item.key)}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{t(`nav.${item.key}`, { defaultValue: item.label })}</span>
                </button>
            ))}
        </nav>
    );
}
