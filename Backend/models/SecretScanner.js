
//Scans individual files for rule matches (secrets + insecure configs).


const fs = require("fs");
const path = require("path");
const { matchLine } = require("./Rule");
const { createFinding } = require("./Finding");

function redact(text) {
    // Mask anything inside quotes that looks like a real value, so results
    // show that a secret exists without exposing its actual value.
    return text.replace(/(['"])([A-Za-z0-9_\-]{4,})(['"])/g, "$1***REDACTED***$3");
}

function isCommentLine(trimmedLine) {
    return trimmedLine.startsWith("//") || trimmedLine.startsWith("*") || trimmedLine.startsWith("/*");
}

function scanFile(filePath, unexcludedEnvFiles) {
    // A properly excluded .env file is expected to contain secrets, so skip it.
    // An .env that ISN'T excluded is a real exposure risk, so it gets scanned fully.
    if (path.basename(filePath) === ".env" && !unexcludedEnvFiles.has(filePath)) {
        return [];
    }

    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    const findings = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (isCommentLine(trimmed)) return;

        for (const match of matchLine(line)) {
            findings.push(
                createFinding({
                    file: filePath,
                    line: index + 1,
                    rule: match.name,
                    severity: match.severity,
                    snippet: redact(trimmed.slice(0, 100)),
                })
            );
        }
    });

    return findings;
}

function scanAll(files, unexcludedEnvFiles) {
    let findings = [];
    for (const file of files) {
        findings = findings.concat(scanFile(file, unexcludedEnvFiles));
    }
    return findings;
}

module.exports = { scanFile, scanAll, redact };