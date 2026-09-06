import { useRef, useState, useEffect } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiCheckCircle,
    FiKey,
    FiSettings,
    FiFileText,
    FiCode,
    FiPackage,
} from "react-icons/fi";

const FEATURES = [
    {
        icon: FiKey,
        title: "Secret Detection",
        description:
            "Scans source files line by line for hardcoded credentials before they ever reach version control.",
        bullets: [
            "Catches API keys, passwords, and generic tokens",
            "Flags AWS access keys and DB connection strings",
            "Values are redacted in every report — never exposed",
            "Works on local folders, GitHub repos, or uploaded projects",
        ],
    },
    {
        icon: FiSettings,
        title: "Insecure Configuration",
        description:
            "Flags common misconfigurations that quietly widen your attack surface.",
        bullets: [
            "CORS settings that allow all origins",
            "Debug mode left enabled",
            "Cookies/sessions missing the secure flag",
            "Session secrets left at well-known defaults",
        ],
    },
    {
        icon: FiFileText,
        title: "Environment File Protection",
        description:
            "Verifies that .env files containing real secrets are actually excluded from Git.",
        bullets: [
            "Checks both local and root-level .gitignore",
            "Only scans .env contents when it's genuinely unprotected",
            "Flags missing .gitignore entirely",
            "Avoids false alarms on properly excluded files",
        ],
    },
    {
        icon: FiCode,
        title: "Input Validation Awareness",
        description:
            "Flags request handlers that use user input directly with no visible validation.",
        bullets: [
            "Covers both req.body.x and destructured { x } = req.body",
            "Works on route files and separate controller files",
            "Recognizes express-validator, Joi, Zod, and Yup",
            "Skips files that already show signs of validation",
        ],
    },
    {
        icon: FiPackage,
        title: "Dependency Vulnerability Scanning",
        description:
            "Runs a real npm audit against your project's actual dependencies.",
        bullets: [
            "Matches known CVEs from the npm advisory database",
            "Reports exact affected version ranges",
            "Honestly reports when it can't check (no lockfile, no network)",
            "Never silently treats 'couldn't check' as 'all clear'",
        ],
    },
];

function FeatureCarousel() {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const scrollToIndex = (index) => {
        const container = scrollRef.current;
        if (!container) return;
        const card = container.children[index];
        if (card) {
            container.scrollTo({ left: card.offsetLeft - container.offsetLeft, behavior: "smooth" });
        }
    };

    const handlePrev = () => scrollToIndex(Math.max(0, activeIndex - 1));
    const handleNext = () => scrollToIndex(Math.min(FEATURES.length - 1, activeIndex + 1));

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            let closestIndex = 0;
            let closestDistance = Infinity;
            Array.from(container.children).forEach((child, i) => {
                const distance = Math.abs(child.offsetLeft - container.offsetLeft - container.scrollLeft);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = i;
                }
            });
            setActiveIndex(closestIndex);
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="mb-10 max-w-280 m-auto">
            <div className="flex items-center justify-left mb-4">
                <h2 className="text-lg font-semibold text-white">What it actually checks</h2>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={feature.title}
                            className="snap-start shrink-0 w-[85%] sm:w-[46%] lg:w-[31%] rounded-2xl border border-blue-900/60 bg-[#101d91] p-6"
                        >
                            <div className="w-10 h-10 rounded-lg bg-blue-950 flex items-center justify-center mb-4">
                                <Icon className="text-emerald-400" size={18} aria-hidden="true" />
                            </div>
                            <h3 className="text-white font-semibold text-base mb-2">{feature.title}</h3>
                            <p className="text-blue-200 text-sm leading-relaxed mb-4">{feature.description}</p>
                            <ul className="space-y-2.5">
                                {feature.bullets.map((bullet) => (
                                    <li key={bullet} className="flex items-start gap-2 text-sm text-blue-100">
                                        <FiCheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={14} aria-hidden="true" />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-center gap-10">
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    aria-label="Previous feature"
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-800/60 text-blue-200 disabled:opacity-30 hover:bg-blue-900/40 transition-colors"
                >
                    <FiChevronLeft />
                </button>
                <div className="flex justify-center gap-1.5 mt-4">
                    {FEATURES.map((feature, i) => (
                        <button
                            key={feature.title}
                            type="button"
                            onClick={() => scrollToIndex(i)}
                            aria-label={`Go to ${feature.title}`}
                            className={`h-1.5 rounded-full transition-all ${i === activeIndex ? "w-6 bg-emerald-400" : "w-1.5 bg-blue-800"
                                }`}
                        />
                    ))}
                </div>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={activeIndex === FEATURES.length - 1}
                    aria-label="Next feature"
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-800/60 text-blue-200 disabled:opacity-30 hover:bg-blue-900/40 transition-colors"
                >
                    <FiChevronRight />
                </button>
            </div>
        </div>
    );
}

export default FeatureCarousel;