// src/components/SummaryCards.jsx

const SummaryCards = ({ summary }) => {
    const cards = [
        {
            label: "Total findings",
            value: summary.total,
            bg: "#f4f4f4",
            color: "#333"
        },
        {
            label: "Critical",
            value: summary.critical,
            bg: "#ffe1e1",
            color: "#c0392b"
        },
        {
            label: "High",
            value: summary.high,
            bg: "#fff1e0",
            color: "#d35400"
        },
        {
            label: "Medium",
            value: summary.medium,
            bg: "#fffbe0",
            color: "#b7950b"
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-3 mb-6">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="rounded-lg p-4"
                    style={{ backgroundColor: card.bg }}
                >
                    <p className="text-[13px] m-0" style={{ color: card.color }}>
                        {card.label}
                    </p>

                    <p
                        className="text-2xl font-semibold mt-1"
                        style={{ color: card.color }}
                    >
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default SummaryCards;