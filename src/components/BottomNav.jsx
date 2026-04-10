import { navItems } from "../data/mockData";

export default function BottomNav({ currentTab, onChange }) {
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
                    <span className="nav-label">{item.label}</span>
                </button>
            ))}
        </nav>
    );
}
