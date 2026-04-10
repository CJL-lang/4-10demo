export default function DateChip({ item, active, onClick }) {
    return (
        <button type="button" className={`date-chip ${active ? "active" : ""}`} onClick={() => onClick(item.day)}>
            <span className="date-chip-dow">{item.dow}</span>
            <span className="date-chip-day">{item.day}</span>
            {active ? <span className="date-chip-dot" /> : null}
        </button>
    );
}
