import { useState } from "react";
import ScanForm from "./components/ScanForm";
import SummaryCards from "./components/SummaryCards";
import SecurityScore from "./components/SecurityScore";
import FindingsTable from "./components/FindingsTable";
import { callScanApi, uploadProject } from "./services/api";
import { exportReportAsHtml } from "./utils/exportReport";
import { ImSpinner2 } from "react-icons/im";
import { TbShieldCheck, TbDownload } from "react-icons/tb";
import ColorTheme from "./utils/ColorTheme";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async (target) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const isGithubRepo = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\.git)?\/?$/.test(
        target.trim()
      );

      const data = await callScanApi(
        isGithubRepo
          ? { repoUrl: target.trim() }
          : { targetDir: target.trim() }
      );

      await new Promise(resolve => setTimeout(resolve, 2000));

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await uploadProject(files);

      await new Promise(resolve => setTimeout(resolve, 2000));

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0F172A] dark:text-gray-100 transition-colors duration-300">
      <div className="px-4 sm:px-6 py-6 max-w-270 mx-auto pt-20">
        <div className="flex items-center justify-center gap-5 mb-1 text-center">
          <TbShieldCheck size={50} className="text-green-700 shrink-0" aria-hidden="true" />
          <h1 className="text-2xl sm:text-4xl font-bold">
            <span className="text-green-700">Green</span> Security Auditor
          </h1>
          <ColorTheme />
        </div>
        <p className="dark:text-white text-sm sm:text-xl my-4 sm:my-5 text-center">
          Scan a project for hardcoded secrets and insecure configs
        </p>

        <ScanForm
          onScan={handleScan}
          onUpload={handleUpload}
          loading={loading}
        />

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

            <SummaryCards summary={result.summary} />

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
    </div>
  );
}

export default App;