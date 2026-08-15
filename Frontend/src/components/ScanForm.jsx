// src/components/ScanForm.jsx
import { useState } from "react";
import { TbPlayerPlay } from "react-icons/tb";

function ScanForm({ onScan, loading }) {
    const [mode, setMode] = useState("local"); // "local" or "repo"
    const [value, setValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === "local") {
            onScan({ targetDir: value });
        } else {
            onScan({ repoUrl: value });
        }
    };

    return (
        <div className="mb-6">
            <div className="flex gap-4 mb-2 text-sm">
                <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                        type="radio"
                        checked={mode === "local"}
                        onChange={() => { setMode("local"); setValue(""); }}
                    />
                    Local folder
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                        type="radio"
                        checked={mode === "repo"}
                        onChange={() => { setMode("repo"); setValue(""); }}
                    />
                    GitHub repo
                </label>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={
                        mode === "local"
                            ? "C:\\Users\\USER\\Projects\\blog-app"
                            : "https://github.com/username/repo"
                    }
                    className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <TbPlayerPlay size={16} aria-hidden="true" />
                    {loading ? "Scanning..." : "Scan"}
                </button>
            </form>
        </div>
    );
}

export default ScanForm;