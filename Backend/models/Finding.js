// Defines what a "finding" looks like, and how findings are ordered.

function createFinding({ file, line, rule, severity, snippet, context }) {
    return { file, line, rule, severity, snippet, context };
}

function severityRank(sev) {
    return { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }[sev] ?? 4;
}

function sortBySeverity(findings) {
    return [...findings].sort(
        (a, b) => severityRank(a.severity) - severityRank(b.severity)
    );
}

module.exports = { createFinding, severityRank, sortBySeverity };