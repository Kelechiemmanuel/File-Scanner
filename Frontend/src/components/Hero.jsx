import { TbShieldCheck, TbArrowDown } from "react-icons/tb";
import ColorTheme from "../utils/ColorTheme";

function Hero({ onGetStarted }) {
    return (
        <div className="relative overflow-hidden mb-10">
            {/* Decorative glow shapes — purely visual, no content */}
            <div className="pointer-events-none absolute -top-24 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -top-10 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" aria-hidden="true" />

            {/* Minimal nav */}
            <nav className="relative flex items-center justify-between h-16 rounded-2xl border border-blue-800/70 bg-[#0a176f]/80 backdrop-blur-xl px-5 mb-14">
                <div className="flex items-center gap-2.5">
                    <TbShieldCheck size={22} className="text-green-600 dark:text-emerald-400" aria-hidden="true" />
                    <span className="font-bold text-sm sm:text-base">
                        <span className="text-green-600 dark:text-emerald-400">Green</span> Security Auditor
                    </span>
                </div>
                <ColorTheme />
            </nav>

            {/* Headline */}
            <div className="relative text-center max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-5">
                    Catch what <span className="bg-linear-to-r from-green-500 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        shouldn't ship
                    </span>
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-blue-200 mb-8 leading-relaxed">
                    Scan any project for hardcoded secrets, insecure configs, and vulnerable
                    dependencies — from a local path, a GitHub repo, or a folder you pick.
                    No setup, no account, no data stored.
                </p>

                <button
                    type="button"
                    onClick={onGetStarted}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm shadow-lg shadow-black/10 hover:opacity-90 transition-opacity"
                >
                    Start scanning
                    <TbArrowDown size={16} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

export default Hero;