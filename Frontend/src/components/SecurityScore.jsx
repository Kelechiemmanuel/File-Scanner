

function SecurityScore({ summary }) {
    const deductions =
        summary.critical * 25 +
        summary.high * 15 +
        summary.medium * 5;

    const score = Math.max(0, 100 - deductions);

    const getStatus = () => {
        if (score >= 90) return "Excellent";
        if (score >= 75) return "Good";
        if (score >= 50) return "Needs Improvement";
        return "Critical";
    };

    const status = getStatus();

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        Security Score
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Based on detected security findings
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-3xl font-bold">
                        {score}
                        <span className="text-sm text-gray-400">
                            /100
                        </span>
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {status}
                    </p>
                </div>
            </div>

            <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-green-600 rounded-full transition-all duration-700"
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
}

export default SecurityScore;