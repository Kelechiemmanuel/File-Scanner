// import { TbCheck } from "react-icons/tb";
import SeverityBadge from "./SeverityBadge";
import ruleDescription from "../utils/ruleDescription";
import { TbCheck, TbChevronDown, TbChevronUp, TbSearch } from "react-icons/tb";
import { Fragment, useState } from "react";


const ROW_BORDER = {
    CRITICAL: "border-l-red-600",
    HIGH: "border-l-orange-500",
    MEDIUM: "border-l-yellow-500",
};

function FindingsTable({ findings }) {
    const [expanded, setExpanded] = useState(null);
    const [search, setSearch] = useState("");
    const [severityFilter, setSeverityFilter] = useState("ALL");

    const filteredFindings = findings.filter((finding) => {
        const matchesSearch =
            finding.rule.toLowerCase().includes(search.toLowerCase()) ||
            finding.file.toLowerCase().includes(search.toLowerCase()) ||
            finding.snippet.toLowerCase().includes(search.toLowerCase());

        const matchesSeverity =
            severityFilter === "ALL" ||
            finding.severity === severityFilter;

        return matchesSearch && matchesSeverity;
    });

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

            <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-200">

                {/* Search */}
                <div className="relative flex-1">
                    <TbSearch
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search findings..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                </div>

                {/* Severity filter */}
                <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                    <option value="ALL">All severities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                </select>

            </div>
            <table className="w-full border-collapse min-w-140">
                <thead>
                    <tr>
                        <th className="text-left text-xs text-gray-500 font-medium bg-gray-50 px-3.5 py-2.5">Severity</th>

                        <th className="text-left text-xs text-gray-500 font-medium bg-gray-50 px-3.5 py-2.5">Rule</th>

                        <th className="text-left text-xs text-gray-500 font-medium bg-gray-50 px-3.5 py-2.5">Location</th>

                        <th className="text-left text-xs text-gray-500 font-medium bg-gray-50 px-3.5 py-2.5 hidden sm:table-cell">Snippet</th>

                        <th className="text-left text-xs text-gray-500 font-medium bg-gray-50 px-3.5 py-2.5">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFindings.map((f, i) => {
                        const explanation = ruleDescription[f.rule];
                        const isExpanded = expanded === i;

                        return (
                            <Fragment key={i}>
                                <tr className={`border-t border-gray-100 border-l-4 ${ROW_BORDER[f.severity] || "border-l-transparent"}`}>
                                    <td className="px-3.5 py-3 align-top">
                                        <SeverityBadge severity={f.severity} />
                                    </td>
                                    <td className="px-3.5 py-3 align-top text-sm text-gray-500">
                                        {f.rule}
                                    </td>
                                    <td className="px-3.5 py-3 align-top text-xs text-gray-500 font-mono">
                                        {f.file}:{f.line}
                                    </td>
                                    <td className="px-3.5 py-3 align-top text-xs text-gray-700 font-mono hidden sm:table-cell">
                                        {f.snippet}
                                    </td>
                                    <td className="px-3.5 py-3 align-top">
                                        <button type="button" onClick={() => setExpanded(isExpanded ? null : i)}
                                            className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                                            {isExpanded ? (
                                                <>
                                                    Hide
                                                    <TbChevronUp size={15} />
                                                </>
                                            ) : (
                                                <>
                                                    Details
                                                    <TbChevronDown size={15} />
                                                </>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                                {isExpanded && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-3.5 py-4 bg-gray-50 dark:bg-gray-900/50"
                                        >
                                            <div className="space-y-5 text-sm">

                                                {/* Why this matters */}
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        Why this matters
                                                    </p>

                                                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                                                        {explanation?.description ||
                                                            "This finding indicates a potential security issue that should be reviewed."}
                                                    </p>
                                                </div>

                                                {/* Recommended fix */}
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        Recommended fix
                                                    </p>

                                                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                                                        {explanation?.recommendation ||
                                                            "Review this finding and apply the appropriate security remediation."}
                                                    </p>
                                                </div>

                                                {/* Source context */}
                                                {f.context && f.context.length > 0 && (
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white mb-2">
                                                            Source
                                                        </p>

                                                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-950 overflow-x-auto">
                                                            <pre className="text-xs font-mono">
                                                                {f.context.map((line) => (
                                                                    <div
                                                                        key={line.line}
                                                                        className={`flex ${line.line === f.line
                                                                                ? "bg-red-900/40"
                                                                                : ""
                                                                            }`}
                                                                    >
                                                                        <span className="select-none w-10 px-3 py-1 text-right text-gray-500 border-r border-gray-800">
                                                                            {line.line}
                                                                        </span>

                                                                        <code
                                                                            className={`px-3 py-1 ${line.line === f.line
                                                                                    ? "text-red-300"
                                                                                    : "text-gray-300"
                                                                                }`}
                                                                        >
                                                                            {line.content}
                                                                        </code>
                                                                    </div>
                                                                ))}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default FindingsTable;