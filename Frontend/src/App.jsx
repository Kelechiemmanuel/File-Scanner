import { useState, useEffect, useRef, useCallback } from "react";
import IntroSection from "./components/IntroSection";
import ScanForm from "./components/ScanForm";
import SecurityScore from "./components/SecurityScore";
import AnalyticsOverview from "./components/AnalyticsOverview";
import FindingsTable from "./components/FindingsTable";
import { uploadProject } from "./services/api";
import { exportReportAsHtml } from "./utils/exportReport";
import { ImSpinner2 } from "react-icons/im";
import { TbDownload } from "react-icons/tb";
import LandingPreview from "./components/LandingPreview";
import Hero from "./components/Hero";
import FeatureCarousel from "./components/FeatureCarousel";
import useScanStream from "./hooks/useScanStream";

const REFRESH_INTERVAL_SECONDS = 30;

// Derives the same shape SecurityScore/AnalyticsOverview expect from
// result.summary, but computed from live findings instead of a
// one-shot backend response.
function summarizeFindings(findings) {
  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  findings.forEach((f) => {
    if (counts[f.severity] !== undefined) counts[f.severity] += 1;
  });
  return { total: findings.length, ...counts };
}

function App() {
  const { findings, currentFile, status, error: streamError, startScan } = useScanStream();

  const [uploadResult, setUploadResult] = useState(null); // still non-streaming for now
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liveMode, setLiveMode] = useState(false);
  const [secondsUntilNext, setSecondsUntilNext] = useState(REFRESH_INTERVAL_SECONDS);

  const lastRunRef = useRef(null);

  const handleScanSubmit = (target) => {
    setError(null);
    lastRunRef.current = { kind: "scan", target };
    startScan(target); // ← real SSE stream, findings arrive as they're found
  };

  const handleUpload = useCallback(async (files) => {
    setLoading(true);
    setError(null);

    try {
      const data = await uploadProject(files);
      setUploadResult(data);
      lastRunRef.current = { kind: "upload", files };
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUploadSubmit = (files) => {
    setUploadResult(null);
    handleUpload(files);
  };

  // Live mode re-runs the last scan on an interval. For the streaming
  // path this just calls startScan again.
  useEffect(() => {
    if (!liveMode) return;

    setSecondsUntilNext(REFRESH_INTERVAL_SECONDS);

    const countdown = setInterval(() => {
      setSecondsUntilNext((s) => (s <= 1 ? REFRESH_INTERVAL_SECONDS : s - 1));
    }, 1000);

    const rescan = setInterval(() => {
      const last = lastRunRef.current;
      if (!last) return;
      if (last.kind === "scan") {
        startScan(last.target);
      } else {
        handleUpload(last.files);
      }
    }, REFRESH_INTERVAL_SECONDS * 1000);

    return () => {
      clearInterval(countdown);
      clearInterval(rescan);
    };
  }, [liveMode, startScan, handleUpload]);

  const toggleLive = () => {
    if (!lastRunRef.current) return;
    setLiveMode((v) => !v);
  };

  const hasStreamedResult = status !== "idle";
  const summary = summarizeFindings(findings);

  return (
    <div className="min-h-screen bg-[#07116f] text-white py-20">
      <div className="px-4 sm:px-6 max-w-290 mx-auto pt-2">

        <Hero onGetStarted={() => document.getElementById("scan-form")?.scrollIntoView({ behavior: "smooth" })} />

        <div id="scan-form">
          <ScanForm
            onScan={handleScanSubmit}
            onUpload={handleUploadSubmit}
            loading={loading || status === "scanning"}
          />
        </div>

        {status === "scanning" && (
          <p className="flex items-center gap-2 text-sm">
            <ImSpinner2 className="animate-spin" />
            {currentFile ? `Scanning ${currentFile}...` : "Scanning..."}
          </p>
        )}
        {(error || streamError) && (
          <p className="text-[#c0392b] text-sm">{error || streamError}</p>
        )}

        {hasStreamedResult && (
          <>
            <SecurityScore summary={summary} />

            <AnalyticsOverview
              result={{ summary, findings }}
              liveMode={liveMode}
              secondsUntilNext={secondsUntilNext}
              onToggleLive={toggleLive}
            />

            <FindingsTable
              findings={findings}
              currentFile={currentFile}
              scanning={status === "scanning"}
            />

            <div className="flex justify-center sm:justify-end mt-3">
              <button
                className="flex items-center justify-center gap-1.5 border p-2 rounded-sm hover:bg-gray-50 w-full sm:w-auto text-sm"
                onClick={() => exportReportAsHtml({ summary, findings })}
              >
                <TbDownload size={15} aria-hidden="true" />
                Export report
              </button>
            </div>
          </>
        )}
      </div>

      <LandingPreview />
      <FeatureCarousel />
      <IntroSection />
    </div>
  );
}

export default App;