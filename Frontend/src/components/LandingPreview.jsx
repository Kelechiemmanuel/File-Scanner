import React, { useState, useEffect } from "react";
import {
    FiActivity,
    FiAlertCircle,
    FiAlertTriangle,
    FiCheckCircle,
    FiBox,
    FiKey,
    FiLock,
    FiSettings,
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

// ---------------------------------------------------------------------------
// This is an ILLUSTRATIVE preview shown on the landing page, before anyone has
// actually scanned a project. All numbers here are example/hardcoded data
// that gently jitters every 10s for visual life — it is NOT a real scan and
// is clearly labeled "Example data" so it's never mistaken for real results.
// The real, live version of this dashboard is AnalyticsOverview.jsx, which
// only renders after an actual scan completes.
// ---------------------------------------------------------------------------

const REFRESH_MS = 2000;

const BASE_TREND = [12, 14, 13, 16, 15, 18, 17, 20, 19, 22, 21, 24];

const RULE_CATEGORIES = [
    { name: "API keys", base: 9 },
    { name: "Passwords", base: 5 },
    { name: "CORS", base: 7 },
    { name: "Debug mode", base: 4 },
    { name: ".env", base: 6 },
    { name: "Deps", base: 8 },
];

const EXAMPLE_FINDINGS = [
    { type: "danger", title: ".env file not excluded in .gitignore", file: ".env", time: "2m" },
    { type: "warning", title: "Hardcoded API key detected", file: "config.js", time: "14m" },
    { type: "warning", title: "CORS allows all origins", file: "server.js", time: "1h" },
    { type: "success", title: "Missing input validation fixed", file: "controller.js", time: "3h" },
];

const EXAMPLE_FILES = [
    { name: "config.js", secrets: 62, deps: 20 },
    { name: ".env", secrets: 88, deps: 0 },
    { name: "server.js", secrets: 15, deps: 45 },
    { name: "auth.js", secrets: 30, deps: 10 },
];

function jitter(base, spread = 3) {
    return Math.max(0, Math.round(base + (Math.random() - 0.5) * spread * 2));
}

function AlertIcon({ type }) {
    if (type === "danger") return <FiAlertCircle className="text-red-400" />;
    if (type === "warning") return <FiAlertTriangle className="text-amber-400" />;
    return <FiCheckCircle className="text-emerald-400" />;
}

function Card({ children, className = "" }) {
    return (
        <div className={`rounded-2xl border border-blue-900/60 bg-[#101d91] shadow-[0_20px_60px_rgba(0,0,0,0.15)] ${className}`}>
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

function CategoryRow({ icon, label, value, color }) {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-blue-100">
                    {icon}
                    <span>{label}</span>
                </div>
                <span className="text-sm font-semibold text-white">{value}%</span>
            </div>
            <div className="h-2 rounded-full bg-blue-950 overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

function FileRow({ file }) {
    return (
        <div className="grid grid-cols-[1.2fr_1fr_1fr_auto] items-center gap-4 py-3 border-b border-blue-900/50 last:border-0">
            <div className="flex items-center gap-3">
                <FiBox className="text-blue-300" />
                <span className="text-sm text-white">{file.name}</span>
            </div>
            <div className="h-2 bg-blue-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full transition-all duration-700" style={{ width: `${file.secrets}%` }} />
            </div>
            <div className="h-2 bg-blue-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full transition-all duration-700" style={{ width: `${file.deps}%` }} />
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                scanned
            </span>
        </div>
    );
}

function LandingPreview() {
    const [tick, setTick] = useState(0);
    const [trend, setTrend] = useState(BASE_TREND.map((v, i) => ({ time: i, total: v, critical: Math.round(v * 0.3) })));
    const [ruleData, setRuleData] = useState(RULE_CATEGORIES.map((r) => ({ name: r.name, value: r.base })));

    useEffect(() => {
        const interval = setInterval(() => {
            setTick((t) => t + 1);
            setTrend((prev) => {
                const last = prev[prev.length - 1];
                const nextTotal = jitter(last.total, 4);
                const next = { time: last.time + 1, total: nextTotal, critical: Math.round(nextTotal * 0.3) };
                return [...prev.slice(1), next];
            });
            setRuleData(RULE_CATEGORIES.map((r) => ({ name: r.name, value: jitter(r.base, 2) })));
        }, REFRESH_MS);
        return () => clearInterval(interval);
    }, []);

    const latestTotal = trend[trend.length - 1]?.total ?? 0;
    const secretsPct = jitter(46, 3);
    const configPct = jitter(28, 3);
    const depsPct = jitter(18, 3);

    return (
        <div className="max-w-280 mx-auto px-2 py-2 rounded-3xl border border-blue-800/70 bg-[#101d91] overflow-hidden mb-8">
            <div className="rounded-3xl border border-blue-800/70 bg-[#070f58]">
                <div className="h-14 px-5 flex items-center border-b border-blue-900/60">
                    <div className="flex gap-2 mr-5">
                        <span className="w-3.5 h-3.5 rounded-full bg-red-400" />
                        <span className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                        <span className="w-3.5 h-3.5 rounded-full bg-green-400" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-100">
                        <FiActivity />
                        what a scan looks like
                    </div>
                    <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 text-xs">
                        <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                        Example data
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
                        <Card className="p-5">
                            <SectionHeader
                                title="Findings trend"
                                right={<span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300">example</span>}
                            />
                            <div className="flex items-end gap-4 mb-4">
                                <span className="text-3xl font-bold">{latestTotal}</span>
                                <span className="text-sm text-blue-200 mb-1">findings / scan</span>
                            </div>
                            <div className="h-55">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trend}>
                                        <defs>
                                            <linearGradient id="previewGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3158ff" stopOpacity={0.35} />
                                                <stop offset="100%" stopColor="#3158ff" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke="#24369a" strokeDasharray="0" vertical={false} />
                                        <XAxis dataKey="time" hide />
                                        <YAxis hide />
                                        <Tooltip contentStyle={{ background: "#07116f", border: "1px solid #293aa0", borderRadius: "10px" }} />
                                        <Area type="monotone" dataKey="total" stroke="#3158ff" strokeWidth={3} fill="url(#previewGradient)" isAnimationActive={false} />
                                        <Area type="monotone" dataKey="critical" stroke="#f87171" strokeWidth={2} strokeDasharray="5 5" fill="transparent" isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex gap-5 text-xs text-blue-100 mt-2">
                                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" />Total findings</span>
                                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400" />Critical</span>
                            </div>
                        </Card>

                        <Card className="p-5">
                            <SectionHeader title="Detection categories" right="example" />
                            <div className="pt-7">
                                <CategoryRow icon={<FiKey />} label="Secrets" value={secretsPct} color="bg-indigo-400" />
                                <CategoryRow icon={<FiSettings />} label="Config issues" value={configPct} color="bg-cyan-400" />
                                <CategoryRow icon={<FiLock />} label="Dependencies" value={depsPct} color="bg-amber-400" />
                            </div>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_2fr] gap-4">
                        <Card className="p-5">
                            <SectionHeader title="Findings by rule" right="example" />
                            <div className="h-33">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ruleData}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#b8c2ff", fontSize: 10 }} />
                                        <YAxis hide />
                                        <Bar dataKey="value" radius={[5, 5, 0, 0]} fill="#2846db" isAnimationActive={false} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="p-5">
                            <SectionHeader title="Example findings" right="illustrative" />
                            <div>
                                {EXAMPLE_FINDINGS.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 py-2.5">
                                        <AlertIcon type={f.type} />
                                        <span className="text-sm text-blue-50 flex-1">{f.title}</span>
                                        <span className="hidden sm:block text-xs px-2 py-1 rounded bg-blue-950 text-blue-200">{f.file}</span>
                                        <span className="text-xs text-blue-300">{f.time}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <Card className="p-5">
                        <SectionHeader title="Files with findings" right="example" />
                        <div className="grid grid-cols-[1.2fr_1fr_1fr_auto] gap-4 mb-2 text-[10px] uppercase tracking-wider text-blue-400">
                            <span>File</span>
                            <span>Secrets</span>
                            <span>Dependencies</span>
                            <span>Status</span>
                        </div>
                        {EXAMPLE_FILES.map((file) => (
                            <FileRow key={file.name} file={file} />
                        ))}
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default LandingPreview;