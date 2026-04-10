function getCoachAvatarLabel(coachName) {
    const pure = (coachName || "").replace(/^教练\s*/u, "").trim();
    if (!pure) {
        return "CO";
    }

    const tokens = pure.split(/\s+/u).filter(Boolean);
    if (tokens.length >= 2) {
        return `${tokens[0][0]}${tokens[1][0]}`.toUpperCase();
    }

    if (/^[\u4e00-\u9fa5]+$/u.test(tokens[0])) {
        return tokens[0].slice(0, 2);
    }

    return tokens[0].slice(0, 2).toUpperCase();
}

function getResultClass(result) {
    if (result === "达标") {
        return "is-good";
    }
    if (result === "部分达标") {
        return "is-mid";
    }
    if (result === "未达标") {
        return "is-alert";
    }
    return "";
}

export default function RecordCard({ record, onClick }) {
    const isInteractive = typeof onClick === "function";
    const coachAvatar = getCoachAvatarLabel(record.coach);
    const resultClass = getResultClass(record.result);

    return (
        <article
            className={`record-card ${isInteractive ? "record-card-clickable" : ""}`}
            role={isInteractive ? "button" : undefined}
            tabIndex={isInteractive ? 0 : undefined}
            onClick={isInteractive ? () => onClick(record) : undefined}
            onKeyDown={
                isInteractive
                    ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              onClick(record);
                          }
                      }
                    : undefined
            }
        >
            <div className="record-date">{record.date}</div>
            <div className="record-headline">
                <h4>{record.title}</h4>
                <span className="record-type">{record.type}</span>
            </div>

            <div className="record-coach-row">
                <div className="record-coach-avatar" aria-hidden="true">
                    {coachAvatar}
                </div>
                <div className="record-coach-meta">
                    <p className="record-coach-label">主教练</p>
                    <div className="record-coach">{record.coach}</div>
                </div>
                {record.result ? <span className={`record-result-chip ${resultClass}`}>{record.result}</span> : null}
            </div>

            <p className="record-note">{record.note}</p>
            {record.target ? <p className="record-target">{record.target}</p> : null}
        </article>
    );
}
