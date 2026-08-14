
//Formats scan results into the shape sent back to the frontend.
//This is the "view" layer — it decides how data is presented, not how it's produced.

function toJSON(targetDir, findings) {
    const summary = {
        total: findings.length,
        critical: findings.filter((f) => f.severity === "CRITICAL").length,
        high: findings.filter((f) => f.severity === "HIGH").length,
        medium: findings.filter((f) => f.severity === "MEDIUM").length,
    };

    return {
        scannedFolder: targetDir,
        summary,
        findings,
    };
}

module.exports = { toJSON };