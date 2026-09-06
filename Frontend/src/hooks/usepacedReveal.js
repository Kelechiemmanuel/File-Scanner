import { useState, useEffect, useRef } from "react";

const REVEAL_INTERVAL_MS = 350; // time between each finding appearing

/**
 * Takes an already-complete findings array (e.g. result.findings from a
 * normal POST /api/scan response) and reveals it into the UI one item
 * at a time, instead of all at once — same paced feel as the "see how
 * it works" demo, but driven by real scan results.
 *
 * Returns { visibleFindings, revealing } — pass visibleFindings straight
 * into FindingsTable. `revealing` is true while items are still being
 * paced out, useful for a "still displaying results..." indicator if
 * you want one (separate from the actual scan's loading state).
 */
function usePacedReveal(findings, intervalMs = REVEAL_INTERVAL_MS) {
    const [visibleFindings, setVisibleFindings] = useState([]);
    const [revealing, setRevealing] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current);

        if (!findings || findings.length === 0) {
            setVisibleFindings([]);
            setRevealing(false);
            return;
        }

        setVisibleFindings([]);
        setRevealing(true);

        let index = 0;
        timerRef.current = setInterval(() => {
            setVisibleFindings((prev) => [...prev, findings[index]]);
            index += 1;

            if (index >= findings.length) {
                clearInterval(timerRef.current);
                timerRef.current = null;
                setRevealing(false);
            }
        }, intervalMs);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [findings, intervalMs]);

    return { visibleFindings, revealing };
}

export default usePacedReveal;