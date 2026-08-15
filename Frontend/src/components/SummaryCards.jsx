// src/components/SummaryCards.jsx

const SummaryCards = ({ summary }) => {
    const cards = [
        {
            label: "Total findings",
            value: summary.total,
            className: " bg-neutral-100 text-neutral-700"
        },
        {
            label: "Critical",
            value: summary.critical,
            className: "bg-red-100 text-red-700"
        },
        {
            label: "High",
            value: summary.high,
            className: "bg-orange-100 text-orange-700"
        },
        {
            label: "Medium",
            value: summary.medium,
            className: "bg-yellow-100 text-yellow-700"
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className={`rounded-lg p-4 ${card.className}`}
                >
                    <p className="text-[13px] m-0">
                        {card.label}
                    </p>

                    <p className="text-2xl font-semibold mt-1">
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default SummaryCards;