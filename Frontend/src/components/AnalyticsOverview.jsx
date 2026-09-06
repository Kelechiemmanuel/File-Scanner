import React from "react";
import { motion } from "framer-motion";
import {
    FiActivity,
    FiAlertOctagon,
    FiAlertTriangle,
    FiInfo,
    FiFile,
    FiShield,
} from "react-icons/fi";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

// ---------------- DATA HELPERS ----------------
// All of these work off REAL scan results — no placeholder/demo data.

function categorizeRule(rule) {
    if (rule.startsWith("Vulnerable dependency:")) return "Vulnerable dependency";
    return rule;
}

function groupByRule(findings) {
    const counts = {};
    for (const f of findings) {
        const cat = categorizeRule(f.rule);
        counts[cat] = (counts[cat] || 0) + 1;
    }
    return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
}

function groupByFile(findings, limit = 5) {
    const counts = {};
    for (const f of findings) counts[f.file] = (counts[f.file] || 0) + 1;
    return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
}

function severityPercent(count, total) {
    return total === 0 ? 0 : Math.round((count / total) * 100);
}

function computeScore(summary) {
    // Simple weighted deduction — critical hurts most, medium least.
    const penalty = summary.critical * 15 + summary.high * 8 + summary.medium * 3;
    return Math.max(0, 100 - penalty);
}

const SEVERITY_META = {
    CRITICAL: { icon: FiAlertOctagon, color: "text-red-400" },
    HIGH: { icon: FiAlertTriangle, color: "text-amber-400" },
    MEDIUM: { icon: FiInfo, color: "text-blue-300" },
};

// ---------------- UI PRIMITIVES ----------------

function Card({ children, className = "" }) {
    return (
        <div
            className={`rounded-2xl border border-blue-900/60 bg-[#101d91] shadow-[0_20px_60px_rgba(0,0,0,0.15)] ${className}`}
        >
            {children}
        </div>
    );
}

function SectionHeader({ title, right }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            {right && <span className="text-xs text-blue-200">{right}</span>}
        </div>
    );
}

function SeverityBar({ label, value, color }) {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-100">{label}</span>
                <span className="text-sm font-semibold text-white">{value}%</span>
            </div>
            <div className="h-2 rounded-full bg-blue-950 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${color}`}
                />
            </div>
        </div>
    );
}

function FileRow({ file, count, maxCount }) {
    const pct = maxCount === 0 ? 0 : Math.round((count / maxCount) * 100);
    return (
        <div className="grid grid-cols-[1.4fr_1fr_auto] items-center gap-4 py-3 border-b border-blue-900/50 last:border-0">
            <div className="flex items-center gap-3 min-w-0">
                <FiFile className="text-blue-300 shrink-0" />
                <span className="text-sm text-white truncate">{file}</span>
            </div>
            <div className="h-2 bg-blue-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-blue-200 justify-self-end">{count} finding{count === 1 ? "" : "s"}</span>
        </div>
    );
}

// ---------------- MAIN COMPONENT ----------------

function AnalyticsOverview({ result, history, liveMode, secondsUntilNext, onToggleLive }) {
    const { summary, findings } = result;
    const score = computeScore(summary);

    const ruleData = groupByRule(findings);
    const fileData = groupByFile(findings);
    const maxFileCount = fileData.length > 0 ? fileData[0].value : 0;

    const recentFindings = [...findings]
        .sort((a, b) => {
            const rank = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 };
            return rank[a.severity] - rank[b.severity];
        })
        .slice(0, 4);

    // history: array the parent keeps of past scans in this session —
    // [{ label: "Scan 1", total, critical, score }, ...]. Real, not simulated.
    const rawTrendData = history && history.length > 0 ? history : [
        { label: "This scan", total: summary.total, critical: summary.critical, score },
    ];

    // Recharts' Area/Line needs 2+ points to draw anything — a single point
    // has no segment to connect, so the chart renders empty axes with no
    // visible line. Duplicating the one point gives an honest flat line
    // ("nothing has changed yet, this is the first scan") instead of a
    // silently empty-looking chart.
    const trendData = rawTrendData.length === 1
        ? [rawTrendData[0], rawTrendData[0]]
        : rawTrendData;

    return (
        <div className="rounded-3xl border border-blue-800/70 bg-[#070f58] overflow-hidden mb-6">
            <div className="h-14 px-5 flex items-center border-b border-blue-900/60">
                <div className="flex gap-2 mr-5">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-400" />
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                    <span className="w-3.5 h-3.5 rounded-full bg-green-400" />
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-100 truncate">
                    <FiActivity />
                    <span className="truncate">{result.scannedFolder}</span>
                </div>
                <button
                    type="button"
                    onClick={onToggleLive}
                    className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs shrink-0"
                >
                    <span className={`w-2 h-2 rounded-full bg-emerald-400 ${liveMode ? "animate-pulse" : ""}`} />
                    {liveMode ? `Live · next in ${secondsUntilNext}s` : "Live updates off"}
                </button>
            </div>

            <div className="p-4 space-y-4">
                <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
                    <Card className="p-5">
                        <SectionHeader
                            title="Findings over time"
                            right={
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                                    {liveMode ? "● live" : "session"}
                                </span>
                            }
                        />
                        <div className="flex items-end gap-4 mb-4">
                            <span className="text-3xl font-bold">{summary.total}</span>
                            <span className="text-sm text-blue-200 mb-1">total findings</span>
                        </div>
                        <div className="h-50">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3158ff" stopOpacity={0.35} />
                                            <stop offset="100%" stopColor="#3158ff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid stroke="#24369a" strokeDasharray="0" vertical={false} />
                                    <XAxis dataKey="label" hide />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{ background: "#07116f", border: "1px solid #293aa0", borderRadius: "10px" }} />
                                    <Area type="monotone" dataKey="total" stroke="#3158ff" strokeWidth={3} fill="url(#totalGradient)" />
                                    <Area type="monotone" dataKey="critical" stroke="#f87171" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex gap-5 text-xs text-blue-100 mt-2">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                Total findings
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-400" />
                                Critical
                            </span>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <SectionHeader title="Severity breakdown" right={`${summary.total} total`} />
                        <div className="pt-7">
                            <SeverityBar label="Critical" value={severityPercent(summary.critical, summary.total)} color="bg-red-400" />
                            <SeverityBar label="High" value={severityPercent(summary.high, summary.total)} color="bg-amber-400" />
                            <SeverityBar label="Medium" value={severityPercent(summary.medium, summary.total)} color="bg-blue-400" />
                        </div>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-[1fr_2fr] gap-4">
                    <Card className="p-5">
                        <SectionHeader title="Findings by rule" right="count" />
                        <div className="h-38">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ruleData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={false} />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{ background: "#07116f", border: "1px solid #293aa0", borderRadius: "10px" }} />
                                    <Bar dataKey="value" radius={[5, 5, 0, 0]} fill="#2846db" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <SectionHeader title="Recent findings" right={`${summary.critical + summary.high} need attention`} />
                        <div>
                            {recentFindings.length === 0 ? (
                                <p className="text-sm text-blue-200">No findings on this scan.</p>
                            ) : (
                                recentFindings.map((f, i) => {
                                    const meta = SEVERITY_META[f.severity] || SEVERITY_META.MEDIUM;
                                    const Icon = meta.icon;
                                    return (
                                        <div key={`${f.file}-${f.line}-${i}`} className="flex items-center gap-3 py-2.5">
                                            <Icon className={meta.color} />
                                            <span className="text-sm text-blue-50 flex-1 truncate">{f.rule}</span>
                                            <span className="hidden sm:block text-xs px-2 py-1 rounded bg-blue-950 text-blue-200 truncate max-w-40">
                                                {f.file}
                                            </span>
                                            <span className="text-xs text-blue-300">L{f.line}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
                    <Card className="p-5">
                        <SectionHeader title="Files with findings" right={`${fileData.length} file${fileData.length === 1 ? "" : "s"}`} />
                        <div className="grid grid-cols-[1.4fr_1fr_auto] gap-4 mb-2 text-[10px] uppercase tracking-wider text-blue-400">
                            <span>File</span>
                            <span>Relative volume</span>
                            <span>Count</span>
                        </div>
                        {fileData.length === 0 ? (
                            <p className="text-sm text-blue-200">No findings.</p>
                        ) : (
                            fileData.map((f) => (
                                <FileRow key={f.name} file={f.name} count={f.value} maxCount={maxFileCount} />
                            ))
                        )}
                    </Card>

                    <Card className="p-5">
                        <SectionHeader title="Security score" right="this scan" />
                        <div className="flex items-center gap-2 mb-1">
                            <FiShield className={score >= 70 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-red-400"} />
                            <span className="text-3xl font-bold">{score}</span>
                            <span className="text-sm text-blue-200">/100</span>
                        </div>
                        <div className="h-20 mt-5">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <Area type="monotone" dataKey="score" stroke="#35ed75" strokeWidth={2} fill="transparent" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-between text-xs text-blue-300 mt-2">
                            <span>Earlier</span>
                            <span>Current</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsOverview;