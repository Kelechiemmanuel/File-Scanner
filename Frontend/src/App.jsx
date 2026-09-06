import { useState, useEffect, useRef, useCallback } from "react";
import IntroSection from "./components/IntroSection";
import ScanForm from "./components/ScanForm";
import SecurityScore from "./components/SecurityScore";
import AnalyticsOverview from "./components/AnalyticsOverview";
import FindingsTable from "./components/FindingsTable";
import { callScanApi, uploadProject } from "./services/api";
import { exportReportAsHtml } from "./utils/exportReport";
import { ImSpinner2 } from "react-icons/im";
import { TbDownload } from "react-icons/tb";
import LandingPreview from "./components/LandingPreview";
import Hero from "./components/Hero";
import FeatureCarousel from "./components/FeatureCarousel";

const REFRESH_INTERVAL_SECONDS = 30;

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liveMode, setLiveMode] = useState(false);
  const [secondsUntilNext, setSecondsUntilNext] = useState(REFRESH_INTERVAL_SECONDS);

  // Remembers whichever of the two scan paths (target string vs uploaded
  // files) was used last, so live mode can re-run the exact same scan.
  const lastRunRef = useRef(null);

  const handleScan = useCallback(async (target) => {
    setLoading(true);
    setError(null);

    try {
      const isGithubRepo = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\.git)?\/?$/.test(
        target.trim()
      );

      const data = await callScanApi(
        isGithubRepo
          ? { repoUrl: target.trim() }
          : { targetDir: target.trim() }
      );

      setResult(data);
      lastRunRef.current = { kind: "scan", target };
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpload = useCallback(async (files) => {
    setLoading(true);
    setError(null);

    try {
      const data = await uploadProject(files);
      setResult(data);
      lastRunRef.current = { kind: "upload", files };
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleScanSubmit = (target) => {
    setResult(null);
    handleScan(target);
  };

  const handleUploadSubmit = (files) => {
    setResult(null);
    handleUpload(files);
  };

  // Live mode: re-run whichever scan (path/repo vs uploaded folder) was last
  // used, every REFRESH_INTERVAL_SECONDS. This re-scans for real — it does
  // not simulate or fake changing numbers.
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
        handleScan(last.target);
      } else {
        handleUpload(last.files);
      }
    }, REFRESH_INTERVAL_SECONDS * 1000);

    return () => {
      clearInterval(countdown);
      clearInterval(rescan);
    };
  }, [liveMode, handleScan, handleUpload]);

  const toggleLive = () => {
    if (!lastRunRef.current) return; // nothing scanned yet to auto-rerun
    setLiveMode((v) => !v);
  };

  return (
    <div className="min-h-screen bg-[#07116f] text-white py-20">
      <div className="px-4 sm:px-6 max-w-290 mx-auto pt-2">

        <Hero onGetStarted={() => document.getElementById("scan-form")?.scrollIntoView({ behavior: "smooth" })} />

        <div id="scan-form">
          <ScanForm
            onScan={handleScanSubmit}
            onUpload={handleUploadSubmit}
            loading={loading}
          />
        </div>

        {loading && (
          <p className="flex items-center gap-2 text-sm">
            <ImSpinner2 className="animate-spin" />
            Scanning...
          </p>
        )}
        {error && <p className="text-[#c0392b] text-sm">{error}</p>}

        {result && (
          <>
            <SecurityScore summary={result.summary} />

            <AnalyticsOverview
              result={result}
              liveMode={liveMode}
              secondsUntilNext={secondsUntilNext}
              onToggleLive={toggleLive}
            />

            <FindingsTable findings={result.findings} />

            <div className="flex justify-center sm:justify-end mt-3">
              <button
                className="flex items-center justify-center gap-1.5 border p-2 rounded-sm hover:bg-gray-50 w-full sm:w-auto text-sm"
                onClick={() => exportReportAsHtml(result)}
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