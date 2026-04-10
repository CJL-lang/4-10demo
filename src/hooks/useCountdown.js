import { useEffect, useMemo, useState } from "react";

function computeCountdown(targetISO) {
    const target = new Date(targetISO).getTime();
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
    };
}

export function useCountdown(targetISO) {
    const [value, setValue] = useState(() => computeCountdown(targetISO));

    useEffect(() => {
        setValue(computeCountdown(targetISO));
        const timer = window.setInterval(() => {
            setValue(computeCountdown(targetISO));
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [targetISO]);

    return useMemo(() => value, [value]);
}
