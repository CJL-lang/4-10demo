export default function StarRating({ value, onChange }) {
    return (
        <div className="stars">
            {Array.from({ length: 5 }).map((_, index) => {
                const score = index + 1;
                const active = score <= value;
                return (
                    <button
                        key={score}
                        type="button"
                        className={`star-btn ${active ? "active" : ""}`}
                        onClick={() => onChange(score)}
                        aria-label={`评分 ${score}`}
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );
}
