import { useEffect, useState } from "react";

export default function Toast({ message }) {
    const [visible, setVisible] = useState(false);
    const [displayMsg, setDisplayMsg] = useState("");

    useEffect(() => {
        if (message) {
            setDisplayMsg(message);
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [message]);

    if (!displayMsg) return null;

    return (
        <div
            className={`toast${visible ? "" : " toast--exit"}`}
            onAnimationEnd={() => {
                if (!visible) setDisplayMsg("");
            }}
        >
            {displayMsg}
        </div>
    );
}
