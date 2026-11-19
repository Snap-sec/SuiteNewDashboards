import { useEffect, useState } from "react";

export default function CountUp({ value, duration = 800 }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!value || value <= 2) {
            setDisplay(value || 0);
            return;
        }

        let current = 1;
        const step = duration / value;

        const interval = setInterval(() => {
            setDisplay(current);
            current++;
            if (current > value) clearInterval(interval);
        }, step);

        return () => clearInterval(interval);
    }, [value]);

    return <p className="text-4xl font-bold text-mono">{display}</p>;
}