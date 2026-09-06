import { useState, useRef, useEffect } from "react";
import { TbPlayerPlay, TbFolder, TbChevronDown } from "react-icons/tb";

const DEMO_RESULTS = [
    "3 hardcoded secrets found",
    "2 insecure configs found",
    "5 vulnerable dependencies found",
];

function ScanForm({ onScan, onUpload, loading }) {
    const [scanType, setScanType] = useState("github");
    const [repoUrl, setRepoUrl] = useState("");
    const [files, setFiles] = useState([]);

    const [demoOpen, setDemoOpen] = useState(false);
    const [demoStatus, setDemoStatus] = useState("idle"); // idle | scanning | done
    const [demoLines, setDemoLines] = useState([]);
    const demoTimeouts = useRef([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (scanType === "github") {
            if (!repoUrl.trim()) return;

            onScan(repoUrl.trim());
        } else {
            if (!files.length) return;

            onUpload(files);
        }
    };

    const handleFolderChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(selectedFiles);
    };

    const clearDemoTimeouts = () => {
        demoTimeouts.current.forEach(clearTimeout);
        demoTimeouts.current = [];
    };

    useEffect(() => {
        return () => clearDemoTimeouts();
    }, []);

    const toggleDemo = () => {
        const next = !demoOpen;
        setDemoOpen(next);

        if (next) {
            runDemo();
        } else {
            clearDemoTimeouts();
        }
    };

    const runDemo = () => {
        clearDemoTimeouts();
        setDemoStatus("scanning");
        setDemoLines([]);

        DEMO_RESULTS.forEach((text, i) => {
            const t = setTimeout(() => {
                setDemoLines((prev) => [...prev, text]);

                if (i === DEMO_RESULTS.length - 1) {
                    const t2 = setTimeout(() => setDemoStatus("done"), 300);
                    demoTimeouts.current.push(t2);
                }
            }, 500 + i * 600);
            demoTimeouts.current.push(t);
        });
    };

    return (
        <div className="max-w-290 mx-auto bg-blue-950/40 border border-blue-800/50 rounded-2xl p-6 mb-5">
            <form onSubmit={handleSubmit} className="mb-4">

                {/* Scan type */}
                <div className="flex items-center gap-5 mb-4 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="scanType"
                            value="github"
                            checked={scanType === "github"}
                            onChange={() => {
                                setScanType("github");
                                setFiles([]);
                            }}
                            className="accent-green-700"
                        />
                        GitHub Repository
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="scanType"
                            value="local"
                            checked={scanType === "local"}
                            onChange={() => {
                                setScanType("local");
                                setRepoUrl("");
                            }}
                            className="accent-green-700"
                        />
                        Local Project
                    </label>
                </div>

                {/* GitHub */}
                {scanType === "github" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="https://github.com/username/repository"
                            className="flex-1 px-3.5 py-2.5 border border-blue-800/50 outline-none focus:outline-none rounded-lg"
                        />

                        <button
                            type="submit"
                            disabled={loading || !repoUrl.trim()}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm shadow-lg shadow-black/10 hover:opacity-90 transition-opacity disabled:cursor-not-allowed"
                        >
                            <TbPlayerPlay size={16} />
                            {loading ? "Scanning..." : "Scan"}
                        </button>
                    </div>
                )}

                {/* Local */}
                {scanType === "local" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                        <label className="flex-1 flex items-center px-3.5 py-2.5 border border-blue-800/50 outline-none focus:outline-none rounded-lg">
                            <TbFolder size={18} />

                            <span className="truncate">
                                {files.length
                                    ? `${files.length} file(s) selected`
                                    : "Select a project folder"}
                            </span>

                            <input
                                type="file"
                                webkitdirectory=""
                                directory=""
                                multiple
                                onChange={handleFolderChange}
                                className="hidden"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={loading || !files.length}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm shadow-lg shadow-black/10 hover:opacity-90 transition-opacity disabled:cursor-not-allowed"
                        >
                            <TbPlayerPlay size={16} />
                            {loading ? "Scanning..." : "Scan"}
                        </button>
                    </div>
                )}

            </form>

            {/* See how it works */}
            <button
                type="button"
                onClick={toggleDemo}
                className="flex items-center gap-1.5 mx-auto text-xs text-blue-300 hover:text-blue-200 transition-colors"
            >
                <TbPlayerPlay size={12} />
                See how it works
                <TbChevronDown
                    size={14}
                    className={`transition-transform ${demoOpen ? "rotate-180" : ""}`}
                />
            </button>

            {demoOpen && (
                <div className="mt-4 pt-4 border-t border-blue-800/50">
                    <div className="flex items-center gap-2 mb-2.5">
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${demoStatus === "scanning" ? "bg-amber-400" : "bg-green-500"
                                }`}
                        />
                        <span className="text-xs text-blue-300">Example data</span>
                    </div>

                    <div className="bg-blue-950/70 rounded-lg p-3.5 text-sm font-mono min-h-[110px]">
                        <div className="text-blue-300">
                            $ scanning github.com/acme/api...
                        </div>

                        <div className="mt-1.5 space-y-1">
                            {demoLines.map((line, i) => (
                                <div
                                    key={i}
                                    className="text-gray-100 animate-in fade-in duration-300"
                                >
                                    ✓ {line}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScanForm;