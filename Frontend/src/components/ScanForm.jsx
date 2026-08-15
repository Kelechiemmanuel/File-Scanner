import { useState } from "react";
import { TbPlayerPlay } from "react-icons/tb";

function ScanForm({ onScan, loading }) {
    const [repoUrl, setRepoUrl] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onScan(repoUrl);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 mb-6"
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
    );
}

export default ScanForm;