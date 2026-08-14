import { useState } from "react";
import ScanForm from "./components/ScanForm";
import SummaryCards from "./components/SummaryCards";
import FindingsTable from "./components/FindingsTable";
import { callScanApi } from "./services/api";
import { exportReportAsHtml } from "./utils/exportReport";
import { ImSpinner2 } from "react-icons/im";
import { TbShieldCheck, TbDownload } from "react-icons/tb";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async (targetDir) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await callScanApi(targetDir);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <div className="flex items-center justify-center gap-2.5 mb-1">
        <TbShieldCheck size={26} className="text-green-700" aria-hidden="true" />
        <h1 className="text-4xl font-bold "><span className="text-green-700">Green</span> Security Auditor</h1>
      </div>
      <p className="text-[#666] my-5">
        Scan a project for hardcoded secrets and insecure configs
      </p>

      <ScanForm onScan={handleScan} loading={loading} />

      {loading && (
        <p className="flex items-center gap-2">
          <ImSpinner2 className="animate-spin" />
          Scanning...
        </p>
      )}
      {error && <p className="text-[#c0392b]">{error}</p>}

      {result && (
        <>
          <SummaryCards summary={result.summary} />
          <FindingsTable findings={result.findings} />

          <div className="flex justify-end mt-2">
            <button
              className="flex items-center gap-1.5 border p-2 rounded-sm hover:bg-gray-50"
              onClick={() => exportReportAsHtml(result)}
            >
              <TbDownload size={15} aria-hidden="true" />
              Export report
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;