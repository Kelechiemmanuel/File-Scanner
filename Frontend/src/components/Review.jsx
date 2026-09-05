import React from "react";
import { motion } from "framer-motion";
import {
    FiActivity,
    FiCpu,
    FiDatabase,
    FiHardDrive,
    FiServer,
    FiAlertCircle,
    FiCheckCircle,
    FiAlertTriangle,
    FiBox,
    FiDollarSign,
    FiChevronRight,
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


// ---------------- DATA ----------------

const throughputData = [
    { time: "10:00", requests: 32, errors: 12 },
    { time: "10:30", requests: 38, errors: 13 },
    { time: "11:00", requests: 34, errors: 12 },
    { time: "11:30", requests: 43, errors: 15 },
    { time: "12:00", requests: 40, errors: 14 },
    { time: "12:30", requests: 49, errors: 17 },
    { time: "13:00", requests: 44, errors: 16 },
    { time: "13:30", requests: 54, errors: 18 },
    { time: "14:00", requests: 48, errors: 17 },
    { time: "14:30", requests: 58, errors: 20 },
    { time: "15:00", requests: 53, errors: 18 },
    { time: "15:30", requests: 63, errors: 21 },
];

const latencyData = [
    { name: "auth", value: 38 },
    { name: "query", value: 52 },
    { name: "live", value: 31 },
    { name: "alert", value: 48 },
    { name: "bill", value: 57 },
    { name: "tenant", value: 43 },
];

const containers = [
    {
        name: "gateway-7f4c",
        cpu: 31,
        memory: 42,
        status: "running",
    },
    {
        name: "auth-9b2a",
        cpu: 18,
        memory: 34,
        status: "running",
    },
    {
        name: "query-3d8e",
        cpu: 64,
        memory: 76,
        status: "running",
    },
    {
        name: "billing-8f21",
        cpu: 42,
        memory: 55,
        status: "running",
    },
];

const alerts = [
    {
        type: "danger",
        title: "API latency p99 > 800ms",
        service: "gateway",
        time: "2m",
    },
    {
        type: "warning",
        title: "Memory pressure on node-3",
        service: "kubelet",
        time: "14m",
    },
    {
        type: "success",
        title: "Pod restart loop cleared",
        service: "billing",
        time: "1h",
    },
    {
        type: "success",
        title: "Disk usage back under 80%",
        service: "postgres",
        time: "3h",
    },
];


// ---------------- COMPONENTS ----------------

function Card({ children, className = "" }) {
    return (
        <div
            className={`
        rounded-2xl
        border border-blue-900/60
        bg-[#101d91]
        shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        ${className}
      `}
        >
            {children}
        </div>
    );
}


function SectionHeader({ title, right }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">
                {title}
            </h2>

            {right && (
                <span className="text-xs text-blue-200">
                    {right}
                </span>
            )}
        </div>
    );
}


function ResourceBar({ icon, label, value, type }) {
    const barColor =
        type === "cpu"
            ? "bg-indigo-400"
            : type === "memory"
                ? "bg-cyan-400"
                : "bg-amber-400";

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-blue-100">
                    {icon}
                    <span>{label}</span>
                </div>

                <span className="text-sm font-semibold text-white">
                    {value}%
                </span>
            </div>

            <div className="h-2 rounded-full bg-blue-950 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${barColor}`}
                />
            </div>
        </div>
    );
}


function AlertIcon({ type }) {
    if (type === "danger") {
        return <FiAlertCircle className="text-red-400" />;
    }

    if (type === "warning") {
        return <FiAlertTriangle className="text-yellow-400" />;
    }

    return <FiCheckCircle className="text-emerald-400" />;
}


function ContainerRow({ container }) {
    return (
        <div className="grid grid-cols-[1.2fr_1fr_1fr_auto] items-center gap-4 py-3 border-b border-blue-900/50 last:border-0">

            <div className="flex items-center gap-3">
                <FiBox className="text-blue-300" />

                <span className="text-sm text-white">
                    {container.name}
                </span>
            </div>

            <div>
                <div className="h-2 bg-blue-950 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-400 rounded-full"
                        style={{ width: `${container.cpu}%` }}
                    />
                </div>
            </div>

            <div>
                <div className="h-2 bg-blue-950 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${container.memory}%` }}
                    />
                </div>
            </div>

            <span className="flex items-center gap-1 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {container.status}
            </span>
        </div>
    );
}


// ---------------- APP ----------------

export default function App() {
    return (
        <div className="min-h-screen bg-[#07116f] text-white">

            {/* DASHBOARD */}

            <main className="max-w-290 mx-auto px-4 py-6">

                {/* WINDOW */}

                <div className="rounded-3xl border border-blue-800/70 bg-[#070f58] overflow-hidden">

                    {/* WINDOW HEADER */}

                    <div className="h-14 px-5 flex items-center border-b border-blue-900/60">

                        <div className="flex gap-2 mr-5">
                            <span className="w-3.5 h-3.5 rounded-full bg-red-400" />
                            <span className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                            <span className="w-3.5 h-3.5 rounded-full bg-green-400" />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-blue-100">
                            <FiActivity />
                            app.kubewatchlabs.com / overview
                        </div>

                        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                        </div>

                    </div>


                    {/* CONTENT */}

                    <div className="p-4 space-y-4">

                        {/* TOP ROW */}

                        <div className="grid lg:grid-cols-[2fr_1fr] gap-4">

                            {/* THROUGHPUT */}

                            <Card className="p-5">

                                <SectionHeader
                                    title="Cluster throughput"
                                    right={
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                                            ● live
                                        </span>
                                    }
                                />

                                <div className="flex items-end gap-4 mb-4">
                                    <span className="text-3xl font-bold">
                                        50.2k
                                    </span>

                                    <span className="text-xs text-yellow-400 mb-1">
                                        ↘ -11.0%
                                    </span>

                                    <span className="text-sm text-blue-200 mb-1">
                                        req/min
                                    </span>
                                </div>

                                <div className="h-55">

                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={throughputData}>

                                            <defs>
                                                <linearGradient
                                                    id="requestsGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        stopOpacity={0.35}
                                                    />

                                                    <stop
                                                        offset="100%"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>

                                            <CartesianGrid
                                                stroke="#24369a"
                                                strokeDasharray="0"
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="time"
                                                hide
                                            />

                                            <YAxis hide />

                                            <Tooltip
                                                contentStyle={{
                                                    background: "#07116f",
                                                    border: "1px solid #293aa0",
                                                    borderRadius: "10px",
                                                }}
                                            />

                                            <Area
                                                type="monotone"
                                                dataKey="requests"
                                                stroke="#3158ff"
                                                strokeWidth={3}
                                                fill="url(#requestsGradient)"
                                            />

                                            <Area
                                                type="monotone"
                                                dataKey="errors"
                                                stroke="#19c6ed"
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                fill="transparent"
                                            />

                                        </AreaChart>
                                    </ResponsiveContainer>

                                </div>

                                <div className="flex gap-5 text-xs text-blue-100 mt-2">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                        Requests
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                        Errors
                                    </span>
                                </div>

                            </Card>


                            {/* RESOURCE USAGE */}

                            <Card className="p-5">

                                <SectionHeader
                                    title="Resource usage"
                                    right="6 nodes"
                                />

                                <div className="pt-7">

                                    <ResourceBar
                                        icon={<FiCpu />}
                                        label="CPU"
                                        value={45}
                                        type="cpu"
                                    />

                                    <ResourceBar
                                        icon={<FiDatabase />}
                                        label="Memory"
                                        value={63}
                                        type="memory"
                                    />

                                    <ResourceBar
                                        icon={<FiHardDrive />}
                                        label="Disk"
                                        value={78}
                                        type="disk"
                                    />

                                </div>

                            </Card>

                        </div>


                        {/* SECOND ROW */}

                        <div className="grid lg:grid-cols-[1fr_2fr] gap-4">

                            {/* LATENCY */}

                            <Card className="p-5">

                                <SectionHeader
                                    title="Latency by service"
                                    right="p95 · ms"
                                />

                                <div className="h-33">

                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={latencyData}>

                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: "#b8c2ff",
                                                    fontSize: 11,
                                                }}
                                            />

                                            <YAxis hide />

                                            <Bar
                                                dataKey="value"
                                                radius={[5, 5, 0, 0]}
                                                fill="#2846db"
                                            />

                                        </BarChart>
                                    </ResponsiveContainer>

                                </div>

                            </Card>


                            {/* ALERTS */}

                            <Card className="p-5">

                                <SectionHeader
                                    title="Active alerts"
                                    right="2 firing"
                                />

                                <div>

                                    {alerts.map((alert, index) => (

                                        <div
                                            key={index}
                                            className="flex items-center gap-3 py-2.5"
                                        >

                                            <AlertIcon type={alert.type} />

                                            <span className="text-sm text-blue-50 flex-1">
                                                {alert.title}
                                            </span>

                                            <span className="hidden sm:block text-xs px-2 py-1 rounded bg-blue-950 text-blue-200">
                                                {alert.service}
                                            </span>

                                            <span className="text-xs text-blue-300">
                                                {alert.time}
                                            </span>

                                        </div>

                                    ))}

                                </div>

                            </Card>

                        </div>


                        {/* THIRD ROW */}

                        <div className="grid lg:grid-cols-[2fr_1fr] gap-4">

                            {/* CONTAINERS */}

                            <Card className="p-5">

                                <SectionHeader
                                    title="Containers"
                                    right="128 total"
                                />

                                <div className="grid grid-cols-[1.2fr_1fr_1fr_auto] gap-4 mb-2 text-[10px] uppercase tracking-wider text-blue-400">
                                    <span>Container</span>
                                    <span>CPU</span>
                                    <span>Memory</span>
                                    <span>Status</span>
                                </div>

                                {containers.map((container) => (
                                    <ContainerRow
                                        key={container.name}
                                        container={container}
                                    />
                                ))}

                            </Card>


                            {/* CLOUD SPEND */}

                            <Card className="p-5">

                                <SectionHeader
                                    title="Cloud spend"
                                    right="this month"
                                />

                                <div className="flex items-end gap-3">

                                    <span className="text-3xl font-bold">
                                        $3,260
                                    </span>

                                    <span className="text-xs text-yellow-400 mb-1">
                                        ↗ 5.0%
                                    </span>

                                </div>

                                <div className="h-24 mt-5">

                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={[
                                                { x: 1, cost: 30 },
                                                { x: 2, cost: 26 },
                                                { x: 3, cost: 29 },
                                                { x: 4, cost: 23 },
                                                { x: 5, cost: 21 },
                                                { x: 6, cost: 18 },
                                                { x: 7, cost: 16 },
                                                { x: 8, cost: 13 },
                                            ]}
                                        >

                                            <Area
                                                type="monotone"
                                                dataKey="cost"
                                                stroke="#35ed75"
                                                strokeWidth={2}
                                                fill="transparent"
                                            />

                                        </AreaChart>
                                    </ResponsiveContainer>

                                </div>

                                <div className="flex justify-between text-xs text-blue-300 mt-2">
                                    <span>Last month</span>
                                    <span>Current</span>
                                </div>

                            </Card>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}