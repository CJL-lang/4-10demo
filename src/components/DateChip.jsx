import { useTranslation } from "react-i18next";

export default function DateChip({ item, active, onClick }) {
    const { t } = useTranslation();

    return (
        <button type="button" className={`date-chip ${active ? "active" : ""}`} onClick={() => onClick(item.day)}>
            <span className="date-chip-dow">{t(`weekdays.${item.dow}`, { defaultValue: item.dow })}</span>
            <span className="date-chip-day">{item.day}</span>
            {active ? <span className="date-chip-dot" /> : null}
        </button>
    );
}
