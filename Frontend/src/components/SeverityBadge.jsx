import { TbAlertOctagon, TbAlertTriangle, TbInfoCircle } from "react-icons/tb";

const STYLES = {
    CRITICAL: "bg-red-100 text-red-700",
    HIGH: "bg-orange-100 text-orange-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
};

const ICONS = {
    CRITICAL: TbAlertOctagon,
    HIGH: TbAlertTriangle,
    MEDIUM: TbInfoCircle,
};

function SeverityBadge({ severity }) {
    const style = STYLES[severity] || "bg-gray-100 text-gray-600";
    const Icon = ICONS[severity];

    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${style}`}>
            {Icon && <Icon size={12} aria-hidden="true" />}
            {severity}
        </span>
    );
}

export default SeverityBadge;