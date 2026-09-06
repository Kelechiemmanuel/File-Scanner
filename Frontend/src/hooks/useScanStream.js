import { useState, useRef, useCallback } from "react";

/**
 * Connects to the backend's SSE scan stream and exposes:
 *  - findings: array, grows as each "finding" event arrives
 *  - currentFile: the file currently being walked (for a progress line)
 *  - status: "idle" | "scanning" | "done" | "error"
 *  - startScan(targetPath): opens the stream
 *  - stopScan(): closes it early if the user navigates away
 */
function useScanStream() {
    const [findings, setFindings] = useState([]);
    const [currentFile, setCurrentFile] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    const sourceRef = useRef(null);

    const stopScan = useCallback(() => {
        if (sourceRef.current) {
            sourceRef.current.close();
            sourceRef.current = null;
        }
    }, []);

    const startScan = useCallback(
        (targetPath) => {
            stopScan();

            setFindings([]);
            setCurrentFile(null);
            setError(null);
            setStatus("scanning");

            const url = `/api/scan/stream?targetPath=${encodeURIComponent(targetPath)}`;
            const source = new EventSource(url);
            sourceRef.current = source;

            source.addEventListener("file", (e) => {
                const data = JSON.parse(e.data);
                setCurrentFile(data.path);
            });

            source.addEventListener("finding", (e) => {
                const finding = JSON.parse(e.data);
                setFindings((prev) => [...prev, finding]);
            });

            source.addEventListener("done", () => {
                setStatus("done");
                setCurrentFile(null);
                stopScan();
            });

            source.addEventListener("error", (e) => {
                let message = "Connection lost.";
                try {
                    message = JSON.parse(e.data).message;
                } catch {
                    // non-JSON error event (e.g. network drop) — keep default message
                }
                setError(message);
                setStatus("error");
                stopScan();
            });
        },
        [stopScan]
    );

    return { findings, currentFile, status, error, startScan, stopScan };
}

export default useScanStream;