import { useState } from "react";
import { TbPlayerPlay, TbFolder } from "react-icons/tb";

function ScanForm({ onScan, onUpload, loading }) {
    const [scanType, setScanType] = useState("github");
    const [repoUrl, setRepoUrl] = useState("");
    const [files, setFiles] = useState([]);

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

    return (
        <form onSubmit={handleSubmit} className="mb-6">

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
                        className="flex-1 px-3.5 py-2.5 border border-gray-300 dark:text-white rounded-lg text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />

                    <button
                        type="submit"
                        disabled={loading || !repoUrl.trim()}
                        className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] border rounded-lg text-sm font-medium hover:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        <TbPlayerPlay size={16} />
                        {loading ? "Scanning..." : "Scan"}
                    </button>
                </div>
            )}

            {/* Local */}
            {scanType === "local" && (
                <div className="flex flex-col sm:flex-row gap-2">
                    <label className="flex-1 flex items-center gap-2 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
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
                        className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] border rounded-lg text-sm font-medium hover:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        <TbPlayerPlay size={16} />
                        {loading ? "Scanning..." : "Scan"}
                    </button>
                </div>
            )}

        </form>
    );
}

export default ScanForm;