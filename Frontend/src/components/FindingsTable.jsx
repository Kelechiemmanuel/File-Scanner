import { TbCheck } from "react-icons/tb";
import SeverityBadge from "./SeverityBadge";

const ROW_BORDER = {
    CRITICAL: "border-l-red-600",
    HIGH: "border-l-orange-500",
    MEDIUM: "border-l-yellow-500",
};

function FindingsTable({ findings }) {
    if (findings.length === 0) {
        return (
            <div className="flex items-center gap-2.5 bg-emerald-50 text-emerald-700 px-4 py-3.5 rounded-lg text-sm font-medium mb-4">
                <TbCheck size={16} aria-hidden="true" />
                <span>No issues found on the last scan — this project is clean.</span>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
            <table className="w-full border-collapse min-w-140">
                <thead>
                    <tr>
                        <th className="text-left text-xs text-gray-500 font-medium bg-gray-50 px-3.5 py-2.5">Severity</th>
                        <th className="text-left text-xs text-gray-500 font-medium bg-gray-50 px-3.5 py-2.5">Rule</th>
                        <th className="text-left text-xs text-gray-500 font-medium bg-gray-50 px-3.5 py-2.5">Location</th>
                        <th className="text-left text-xs text-gray-500 font-medium bg-gray-50 px-3.5 py-2.5 hidden sm:table-cell">Snippet</th>
                    </tr>
                </thead>
                <tbody>
                    {findings.map((f, i) => (
                        <tr
                            key={i}
                            className={`border-t border-gray-100 border-l-4 ${ROW_BORDER[f.severity] || "border-l-transparent"}`}
                        >
                            <td className="px-3.5 py-3 align-top">
                                <SeverityBadge severity={f.severity} />
                            </td>
                            <td className="px-3.5 py-3 align-top text-sm text-gray-500">{f.rule}</td>
                            <td className="px-3.5 py-3 align-top text-xs text-gray-500 font-mono">
                                {f.file}:{f.line}
                            </td>
                            <td className="px-3.5 py-3 align-top text-xs text-gray-700 font-mono hidden sm:table-cell">{f.snippet}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FindingsTable;