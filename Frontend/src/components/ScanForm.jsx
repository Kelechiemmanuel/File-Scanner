import { useState } from "react";
import { TbPlayerPlay, TbFolder } from "react-icons/tb";

function ScanForm({ onScan, onUpload, loading }) {
    const [repoUrl, setRepoUrl] = useState("");
    const [files, setFiles] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!repoUrl.trim()) return;

        onScan(repoUrl.trim());
    };

    const handleFolderChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);

        setFiles(selectedFiles);
    };

    const handleUpload = () => {
        if (!files.length) return;

        onUpload(files);
    };

    return (
        <div className="mb-6 space-y-3">

            {/* GitHub scan */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2"
            >
                <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 border dark:bg-gray-900 bg-white text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <TbPlayerPlay size={16} aria-hidden="true" />
                    {loading ? "Scanning..." : "Scan"}
                </button>
            </form>

            {/* Local project upload */}
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
                    type="button"
                    onClick={handleUpload}
                    disabled={loading || !files.length}
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 border dark:bg-gray-900 bg-white text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <TbPlayerPlay size={16} aria-hidden="true" />

                    {loading ? "Scanning..." : "Upload & Scan"}
                </button>
            </div>

        </div>
    );
}

export default ScanForm;