import { TbKey, TbSettings, TbPackage } from "react-icons/tb";

const CAPABILITIES = [
    { icon: TbKey, title: "Hardcoded secrets", desc: "API keys, passwords, tokens" },
    { icon: TbSettings, title: "Insecure configs", desc: "CORS, debug mode, cookies" },
    { icon: TbPackage, title: "Vulnerable packages", desc: "Known npm advisories" },
];

const STEPS = [
    "Choose how to submit your project — a local path, a GitHub URL, or pick a folder",
    "Click scan and review findings, grouped by severity",
    "Expand any finding for why it matters and how to fix it",
];

function IntroSection() {
    return (
        <div className="mb-8 bg-[#070f58] px-4 py-6 max-w-550 rounded-2xl border border-blue-800/70">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {CAPABILITIES.map((c) => (
                    <div key={c.title} className="border border-blue-800/70 bg-[#101d91] rounded-lg p-4">
                        <c.icon size={18} className="text-white" aria-hidden="true" />
                        <p className="font-medium text-sm mt-2 mb-0.5">{c.title}</p>
                        <p className="text-xs text-white m-0">{c.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[#101d91] rounded-xl p-5 border border-blue-800/70">
                <p className="font-medium text-sm mb-3">How to use it</p>
                <div className="flex flex-col gap-2.5">
                    {STEPS.map((step, i) => (
                        <div key={step} className="flex gap-2.5 items-start">
                            <span className="w-5 h-5 rounded-full bg-[#070f58] text-white text-[11px] flex items-center justify-center shrink-0">
                                {i + 1}
                            </span>
                            <span className="text-sm text-white">{step}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default IntroSection;